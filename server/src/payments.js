import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { Router } from 'express';
import Razorpay from 'razorpay';
import { z } from 'zod';
import { config } from './config.js';
import { pool, inTransaction } from './db.js';
import { asyncRoute, HttpError } from './http.js';
import { assertCsrf } from './security.js';
import { requireAuth } from './auth.js';

const router = Router();
const razorpay = config.razorpayKeyId && config.razorpayKeySecret
  ? new Razorpay({ key_id: config.razorpayKeyId, key_secret: config.razorpayKeySecret })
  : null;
const checkoutSchema = z.object({ courseSlug: z.string().min(1).max(100), couponCode: z.string().trim().max(32).optional() }).strict();
const idempotencySchema = z.string().min(16).max(128).regex(/^[A-Za-z0-9._:-]+$/);
const paymentPayload = (order) => ({
  keyId: config.razorpayKeyId,
  orderId: order.razorpay_order_id,
  amount: Number(order.amount_minor),
  currency: 'INR',
  name: 'The Thinking Academy',
  description: 'Course enrollment',
});

router.post('/checkout', requireAuth, asyncRoute(async (req, res) => {
  assertCsrf(req);
  if (!razorpay) throw new HttpError(503, 'payments_not_configured', 'Secure checkout is not configured yet.');
  const body = checkoutSchema.safeParse(req.body);
  const key = idempotencySchema.safeParse(req.get('Idempotency-Key'));
  if (!body.success || !key.success) throw new HttpError(400, 'invalid_checkout', 'The course or checkout request is invalid.');
  const courseResult = await pool.query(
    'SELECT id, slug, title, price_minor, currency FROM courses WHERE slug = $1 AND published = TRUE',
    [body.data.courseSlug],
  );
  const course = courseResult.rows[0];
  if (!course) throw new HttpError(404, 'course_not_found', 'Course not found.');
  if (course.currency.trim().toUpperCase() !== 'INR') throw new HttpError(409, 'unsupported_currency', 'Course checkout currently supports Indian rupees only.');
  const existingEnrollment = await pool.query('SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2 AND (expires_at IS NULL OR expires_at > NOW())', [req.user.id, course.id]);
  if (existingEnrollment.rowCount) throw new HttpError(409, 'already_enrolled', 'You already have access to this course.');

  const planResult = await pool.query('SELECT razorpay_plan_id, price_paise FROM course_subscription_plans WHERE course_id = $1 AND active = TRUE', [course.id]);
  if (planResult.rowCount) {
    if (body.data.couponCode) throw new HttpError(400, 'coupon_not_supported_for_subscription', 'Promotional codes are currently available for one-time course purchases.');
    const subscription = await razorpay.subscriptions.create({
      plan_id: planResult.rows[0].razorpay_plan_id,
      total_count: 120,
      quantity: 1,
      customer_notify: 1,
      notes: { courseId: course.id, userId: req.user.id },
    });
    await pool.query(
      `INSERT INTO course_subscriptions (id, user_id, course_id, razorpay_subscription_id, status)
       VALUES ($1, $2, $3, $4, 'created') ON CONFLICT (razorpay_subscription_id) DO NOTHING`,
      [randomUUID(), req.user.id, course.id, subscription.id],
    );
    return res.json({
      mode: 'subscription', keyId: config.razorpayKeyId, subscriptionId: subscription.id,
      amount: planResult.rows[0].price_paise, currency: 'INR', name: 'The Thinking Academy',
      description: course.title,
    });
  }
  if (course.price_minor <= 0) throw new HttpError(400, 'free_course', 'This course does not require paid checkout.');

  let discountMinor = 0;
  let couponId = null;
  if (body.data.couponCode) {
    const code = body.data.couponCode.toUpperCase();
    const couponResult = await pool.query(
      `SELECT id, discount_percent, max_redemptions, redeemed_count
       FROM coupons WHERE code = $1 AND active = TRUE
         AND (course_id IS NULL OR course_id = $2)
         AND (starts_at IS NULL OR starts_at <= NOW())
         AND (expires_at IS NULL OR expires_at > NOW())`,
      [code, course.id],
    );
    const coupon = couponResult.rows[0];
    if (!coupon) throw new HttpError(400, 'invalid_coupon', 'That discount code is invalid or has expired.');
    const pendingResult = await pool.query(
      `SELECT COUNT(*)::int AS count FROM orders
       WHERE coupon_id = $1 AND status = 'pending' AND created_at > NOW() - INTERVAL '30 minutes'`,
      [coupon.id],
    );
    if (coupon.max_redemptions !== null && Number(coupon.redeemed_count) + Number(pendingResult.rows[0].count) >= coupon.max_redemptions) {
      throw new HttpError(400, 'coupon_limit_reached', 'This discount code has reached its redemption limit.');
    }
    couponId = coupon.id;
    discountMinor = Math.min(course.price_minor - 100, Math.floor(course.price_minor * coupon.discount_percent / 100));
  }
  const amountMinor = course.price_minor - discountMinor;

  const orderId = randomUUID();
  const orderResult = await pool.query(
    `INSERT INTO orders (id, user_id, course_id, amount_minor, discount_minor, coupon_id, currency, status, idempotency_key)
     VALUES ($1, $2, $3, $4, $5, $6, 'INR', 'pending', $7)
     ON CONFLICT (user_id, idempotency_key) DO UPDATE SET updated_at = NOW()
     RETURNING id, status, razorpay_order_id, amount_minor, discount_minor, coupon_id, currency, course_id`,
    [orderId, req.user.id, course.id, amountMinor, discountMinor, couponId, key.data],
  );
  const order = orderResult.rows[0];
  if (order.status !== 'pending') throw new HttpError(409, 'checkout_already_used', 'This checkout request has already been completed.');
  if (order.course_id !== course.id || Number(order.amount_minor) !== amountMinor || order.currency.trim().toUpperCase() !== 'INR' || order.coupon_id !== couponId) {
    throw new HttpError(409, 'idempotency_key_reused', 'Use a new checkout request for a different purchase.');
  }
  if (order.razorpay_order_id) return res.json(paymentPayload(order));

  const providerOrder = await razorpay.orders.create({
    amount: Number(order.amount_minor),
    currency: 'INR',
    receipt: order.id,
    expire_by: Math.floor(Date.now() / 1000) + 30 * 60,
    notes: { academyOrderId: order.id, courseId: order.course_id, userId: req.user.id },
  });
  await pool.query(
    "UPDATE orders SET razorpay_order_id = $1, updated_at = NOW() WHERE id = $2 AND status = 'pending'",
    [providerOrder.id, order.id],
  );
  res.json(paymentPayload({ ...order, razorpay_order_id: providerOrder.id }));
}));

router.post('/free-enrollment', requireAuth, asyncRoute(async (req, res) => {
  assertCsrf(req);
  const body = checkoutSchema.safeParse(req.body);
  if (!body.success) throw new HttpError(400, 'invalid_course', 'The course is invalid.');
  const enrolled = await inTransaction(async (client) => {
    const course = await client.query('SELECT id, price_minor FROM courses WHERE slug = $1 AND published = TRUE FOR UPDATE', [body.data.courseSlug]);
    if (!course.rowCount) throw new HttpError(404, 'course_not_found', 'Course not found.');
    if (course.rows[0].price_minor !== 0) throw new HttpError(400, 'payment_required', 'Complete checkout to enroll in this course.');
    const result = await client.query(
      `INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2)
       ON CONFLICT (user_id, course_id) DO NOTHING RETURNING course_id`,
      [req.user.id, course.rows[0].id],
    );
    return Boolean(result.rowCount);
  });
  res.status(enrolled ? 201 : 200).json({ enrolled: true, alreadyEnrolled: !enrolled });
}));

export const paymentRouter = router;

function signatureMatches(body, signature, secret) {
  if (typeof signature !== 'string' || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = createHmac('sha256', secret).update(body).digest();
  const actual = Buffer.from(signature, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function handleRazorpayWebhook(req, res) {
  if (!config.razorpayWebhookSecret) throw new HttpError(503, 'payments_not_configured', 'Payment processing is not configured.');
  const signature = req.get('x-razorpay-signature');
  if (!Buffer.isBuffer(req.body) || !signatureMatches(req.body, signature, config.razorpayWebhookSecret)) {
    throw new HttpError(400, 'invalid_webhook_signature', 'Webhook signature verification failed.');
  }
  let event;
  try { event = JSON.parse(req.body.toString('utf8')); }
  catch { throw new HttpError(400, 'invalid_webhook', 'Webhook body is invalid.'); }
  const eventId = req.get('x-razorpay-event-id');
  if (!eventId || eventId.length > 255 || typeof event.event !== 'string') {
    throw new HttpError(400, 'invalid_webhook', 'Webhook event details are missing.');
  }

  if (event.event === 'payment.captured') {
    const payment = event.payload?.payment?.entity;
    if (!payment?.id || !payment.order_id || !Number.isSafeInteger(payment.amount) || !payment.currency) {
      throw new HttpError(400, 'invalid_payment_event', 'Payment event is missing required order details.');
    }
    await inTransaction(async (client) => {
      const eventResult = await client.query(
        'INSERT INTO payment_webhook_events (provider_event_id, event_type) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING provider_event_id',
        [eventId, event.event],
      );
      if (!eventResult.rowCount) return;
      const orderResult = await client.query(
        `SELECT id, user_id, course_id, amount_minor, currency, status, razorpay_order_id, coupon_id
         FROM orders WHERE razorpay_order_id = $1 FOR UPDATE`, [payment.order_id],
      );
      const order = orderResult.rows[0];
      if (!order || order.razorpay_order_id !== payment.order_id || Number(order.amount_minor) !== payment.amount ||
          order.currency.trim().toUpperCase() !== payment.currency.toUpperCase()) {
        throw new HttpError(400, 'payment_order_mismatch', 'Payment does not match the pending course order.');
      }
      if (order.status === 'refunded') throw new HttpError(409, 'payment_refunded', 'Refunded orders cannot create course access.');
      if (order.status !== 'paid') {
        await client.query("UPDATE orders SET status = 'paid', razorpay_payment_id = $1, updated_at = NOW() WHERE id = $2", [payment.id, order.id]);
        await client.query('INSERT INTO enrollments (user_id, course_id, order_id) VALUES ($1, $2, $3) ON CONFLICT (user_id, course_id) DO NOTHING', [order.user_id, order.course_id, order.id]);
        if (order.coupon_id) await client.query('UPDATE coupons SET redeemed_count = redeemed_count + 1 WHERE id = $1', [order.coupon_id]);
      }
    });
  } else if (event.event === 'refund.processed') {
    const refund = event.payload?.refund?.entity;
    if (refund?.payment_id) {
      await inTransaction(async (client) => {
        const eventResult = await client.query(
          'INSERT INTO payment_webhook_events (provider_event_id, event_type) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING provider_event_id',
          [eventId, event.event],
        );
        if (!eventResult.rowCount) return;
        const original = await client.query('SELECT id, user_id, course_id, amount_minor FROM orders WHERE razorpay_payment_id = $1 FOR UPDATE', [refund.payment_id]);
        const order = original.rows[0];
        if (order && Number.isSafeInteger(refund.amount) && refund.amount >= Number(order.amount_minor)) {
          await client.query("UPDATE orders SET status = 'refunded', updated_at = NOW() WHERE id = $1", [order.id]);
          await client.query('DELETE FROM enrollments WHERE user_id = $1 AND course_id = $2 AND order_id = $3', [order.user_id, order.course_id, order.id]);
        }
      });
    }
  } else if (event.event.startsWith('subscription.')) {
    const subscription = event.payload?.subscription?.entity;
    if (!subscription?.id || typeof subscription.status !== 'string') throw new HttpError(400, 'invalid_subscription_event', 'Subscription event is missing required details.');
    await inTransaction(async (client) => {
      const eventResult = await client.query(
        'INSERT INTO payment_webhook_events (provider_event_id, event_type) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING provider_event_id',
        [eventId, event.event],
      );
      if (!eventResult.rowCount) return;
      const result = await client.query(
        `UPDATE course_subscriptions SET status = $1,
          current_end = CASE WHEN $2::bigint IS NULL THEN current_end ELSE TO_TIMESTAMP($2::bigint) END,
          updated_at = NOW()
         WHERE razorpay_subscription_id = $3 RETURNING id, user_id, course_id, status, current_end`,
        [subscription.status, Number.isSafeInteger(subscription.current_end) ? subscription.current_end : null, subscription.id],
      );
      const local = result.rows[0];
      if (!local) return;
      if (['authenticated', 'active'].includes(local.status)) {
        await client.query(
          `INSERT INTO enrollments (user_id, course_id, expires_at) VALUES ($1, $2, $3)
           ON CONFLICT (user_id, course_id) DO UPDATE SET expires_at = EXCLUDED.expires_at`,
          [local.user_id, local.course_id, local.current_end],
        );
      } else if (['cancelled', 'completed'].includes(local.status)) {
        await client.query('UPDATE enrollments SET expires_at = $1 WHERE user_id = $2 AND course_id = $3 AND order_id IS NULL', [local.current_end || new Date(), local.user_id, local.course_id]);
      } else if (['halted', 'pending'].includes(local.status)) {
        await client.query('UPDATE enrollments SET expires_at = NOW() WHERE user_id = $1 AND course_id = $2 AND order_id IS NULL', [local.user_id, local.course_id]);
      }
    });
  }
  res.json({ received: true });
}
