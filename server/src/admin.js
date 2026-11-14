import { randomUUID } from 'node:crypto';
import { mkdir, open, rename, unlink } from 'node:fs/promises';
import path from 'node:path';
import express from 'express';
import multer from 'multer';
import Razorpay from 'razorpay';
import { z } from 'zod';
import { config } from './config.js';
import { pool } from './db.js';
import { asyncRoute, HttpError } from './http.js';
import { assertCsrf } from './security.js';
import { requireAdmin, requireAuth } from './auth.js';

await mkdir(config.assetRoot, { recursive: true });
const razorpayClient = config.razorpayKeyId && config.razorpayKeySecret
  ? new Razorpay({ key_id: config.razorpayKeyId, key_secret: config.razorpayKeySecret })
  : null;

const tempStorage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, config.assetRoot),
  filename: (_req, _file, callback) => callback(null, `${randomUUID()}.upload`),
});
const upload = multer({
  storage: tempStorage,
  limits: { fileSize: 500 * 1024 * 1024, files: 1, fields: 3, parts: 5, fieldSize: 4 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!['video/mp4', 'video/webm', 'application/pdf'].includes(file.mimetype)) return callback(new HttpError(415, 'unsupported_upload_type', 'Upload an MP4, WebM, or PDF file.'));
    return callback(null, true);
  },
});

function sniffType(header) {
  if (header.length >= 12 && header.toString('ascii', 4, 8) === 'ftyp') return { mime: 'video/mp4', extension: 'mp4' };
  if (header.length >= 4 && header.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))) return { mime: 'video/webm', extension: 'webm' };
  if (header.length >= 5 && header.toString('ascii', 0, 5) === '%PDF-') return { mime: 'application/pdf', extension: 'pdf' };
  return null;
}

async function finalizeUpload(file) {
  if (!file) throw new HttpError(400, 'file_required', 'Choose a file to upload.');
  const handle = await open(file.path, 'r');
  let header;
  try {
    header = Buffer.alloc(16);
    const { bytesRead } = await handle.read(header, 0, header.length, 0);
    header = header.subarray(0, bytesRead);
  } finally { await handle.close(); }
  const type = sniffType(header);
  if (!type || type.mime !== file.mimetype) {
    await unlink(file.path).catch(() => {});
    throw new HttpError(415, 'file_signature_mismatch', 'The file content does not match a supported video or PDF format.');
  }
  const storageKey = `${randomUUID()}.${type.extension}`;
  const destination = path.join(config.assetRoot, storageKey);
  try { await rename(file.path, destination); }
  catch (error) { await unlink(file.path).catch(() => {}); throw error; }
  return { storageKey, mimeType: type.mime, byteSize: file.size, fullPath: destination };
}

async function withUpload(req, res, next) {
  try {
    await new Promise((resolve, reject) => upload.single('file')(req, res, (error) => error ? reject(error) : resolve()));
    next();
  } catch (error) {
    next(error);
  }
}

const lessonParams = z.object({ lessonId: z.string().min(1).max(100) }).strict();
const resourceParams = z.object({ courseSlug: z.string().min(1).max(100) }).strict();
const resourceFields = z.object({ title: z.string().trim().min(1).max(120), lessonId: z.string().max(100).optional().or(z.literal('')) }).strict();
const courseCreateSchema = z.object({
  title: z.string().trim().min(3).max(140),
  slug: z.string().trim().min(3).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(4000).default(''),
  pricePaise: z.number().int().min(0).max(100_000_000),
}).strict();
const courseUpdateSchema = courseCreateSchema.partial().extend({ published: z.boolean().optional() }).strict();
const lessonCreateSchema = z.object({
  title: z.string().trim().min(1).max(180),
  kind: z.enum(['video', 'game', 'activity', 'resource']),
  unitNumber: z.number().int().min(1).max(32767),
  position: z.number().int().min(1).max(32767),
  durationSeconds: z.number().int().min(0).max(2_147_483_647).default(0),
  content: z.record(z.string(), z.unknown()).default({}),
}).strict();
const lessonUpdateSchema = lessonCreateSchema.partial().strict();
const instructorSchema = z.object({ email: z.string().trim().toLowerCase().email().max(254) }).strict();
const couponSchema = z.object({
  code: z.string().trim().min(3).max(32).regex(/^[A-Za-z0-9_-]+$/),
  discountPercent: z.number().int().min(1).max(99),
  courseId: z.string().uuid().optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
  maxRedemptions: z.number().int().min(1).max(1_000_000).optional().nullable(),
}).strict();
const subscriptionPlanSchema = z.object({
  pricePaise: z.number().int().min(100).max(100_000_000),
  period: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']),
  intervalCount: z.number().int().min(1).max(12).default(1),
}).strict();

function requireContentEditor(req, _res, next) {
  if (!['admin', 'instructor'].includes(req.user?.role)) return next(new HttpError(403, 'admin_required', 'You do not have access to this action.'));
  next();
}

async function ensureCourseEditor(user, courseId) {
  if (user.role === 'admin') return;
  const access = await pool.query('SELECT 1 FROM course_instructors WHERE course_id = $1 AND user_id = $2', [courseId, user.id]);
  if (!access.rowCount) throw new HttpError(403, 'course_editor_required', 'You are not assigned to edit this course.');
}

export const adminRouter = express.Router();
adminRouter.use(requireAuth, requireContentEditor);

function courseSlugEditor(req, _res, next) {
  (async () => {
    const params = resourceParams.safeParse(req.params);
    if (!params.success) throw new HttpError(400, 'invalid_course', 'Course URL is invalid.');
    const course = await pool.query('SELECT id FROM courses WHERE slug = $1', [params.data.courseSlug]);
    if (!course.rowCount) throw new HttpError(404, 'course_not_found', 'Course not found.');
    await ensureCourseEditor(req.user, course.rows[0].id);
    req.courseForUpload = course.rows[0];
  })().then(() => next(), next);
}

function lessonEditor(req, _res, next) {
  (async () => {
    const params = lessonParams.safeParse(req.params);
    if (!params.success) throw new HttpError(400, 'invalid_lesson', 'Lesson identifier is invalid.');
    const lesson = await pool.query('SELECT id, course_id, media_storage_key FROM lessons WHERE id = $1', [params.data.lessonId]);
    if (!lesson.rowCount) throw new HttpError(404, 'lesson_not_found', 'Lesson not found.');
    await ensureCourseEditor(req.user, lesson.rows[0].course_id);
    req.lessonForUpload = lesson.rows[0];
  })().then(() => next(), next);
}

adminRouter.get('/overview', requireAdmin, asyncRoute(async (_req, res) => {
  const [summary, courses, activity, topLessons, lessonFunnel] = await Promise.all([
    pool.query(`SELECT
      (SELECT COUNT(*)::int FROM users WHERE role = 'learner') AS learners,
      (SELECT COUNT(*)::int FROM courses WHERE published = TRUE) AS published_courses,
      (SELECT COUNT(*)::int FROM courses) AS total_courses,
      (SELECT COUNT(*)::int FROM enrollments WHERE expires_at IS NULL OR expires_at > NOW()) AS active_enrollments,
      (SELECT COUNT(*)::int FROM lesson_progress WHERE completed_at IS NOT NULL) AS completed_lessons,
      (SELECT COUNT(DISTINCT user_id)::int FROM lesson_progress WHERE completed_at IS NOT NULL AND updated_at >= NOW() - INTERVAL '7 days') AS active_learners_7d,
      (SELECT COUNT(DISTINCT user_id)::int FROM lesson_progress WHERE completed_at IS NOT NULL AND updated_at >= NOW() - INTERVAL '30 days') AS active_learners_30d,
      (SELECT COUNT(*)::int FROM orders WHERE status = 'paid') AS paid_orders,
      (SELECT COALESCE(SUM(amount_minor), 0)::bigint FROM orders WHERE status = 'paid') AS revenue_paise,
      (SELECT COUNT(DISTINCT user_id)::int FROM orders WHERE status = 'paid') AS paying_learners`),
    pool.query(`SELECT c.id, c.title, c.slug, c.published,
      COUNT(DISTINCT e.user_id)::int AS enrolled_learners,
      COUNT(DISTINCT l.id)::int AS lessons,
      COUNT(DISTINCT p.lesson_id)::int AS completed_lesson_records
      FROM courses c
      LEFT JOIN enrollments e ON e.course_id = c.id AND (e.expires_at IS NULL OR e.expires_at > NOW())
      LEFT JOIN lessons l ON l.course_id = c.id
      LEFT JOIN lesson_progress p ON p.lesson_id = l.id AND p.completed_at IS NOT NULL
      GROUP BY c.id ORDER BY c.updated_at DESC LIMIT 8`),
    pool.query(`SELECT date_trunc('day', created_at)::date AS day,
      COUNT(*) FILTER (WHERE status = 'paid')::int AS paid_orders,
      COALESCE(SUM(amount_minor) FILTER (WHERE status = 'paid'), 0)::bigint AS revenue_paise,
      COUNT(*) FILTER (WHERE status = 'pending')::int AS pending_orders
      FROM orders WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY date_trunc('day', created_at)::date ORDER BY day`),
    pool.query(`SELECT l.id, l.title, c.title AS course_title,
      COUNT(p.user_id)::int AS completions
      FROM lessons l JOIN courses c ON c.id = l.course_id
      LEFT JOIN lesson_progress p ON p.lesson_id = l.id AND p.completed_at IS NOT NULL
      GROUP BY l.id, c.title ORDER BY completions DESC, l.position LIMIT 5`),
    pool.query(`SELECT c.id AS course_id, c.title AS course_title, l.id, l.title,
      l.unit_number, l.position, COUNT(p.user_id)::int AS completions
      FROM lessons l JOIN courses c ON c.id = l.course_id
      LEFT JOIN lesson_progress p ON p.lesson_id = l.id AND p.completed_at IS NOT NULL
      WHERE c.published = TRUE GROUP BY c.id, l.id
      ORDER BY c.title, l.unit_number, l.position`),
  ]);
  const metrics = summary.rows[0];
  const learnerCount = Number(metrics.learners);
  res.set('Cache-Control', 'private, no-store').json({
    metrics: {
      ...metrics,
      revenue_rupees: Number(metrics.revenue_paise) / 100,
      conversion_percent: learnerCount ? Number((Number(metrics.paying_learners) / learnerCount * 100).toFixed(1)) : 0,
      returning_active_share: Number(metrics.active_learners_30d) ? Number((Number(metrics.active_learners_7d) / Number(metrics.active_learners_30d) * 100).toFixed(1)) : 0,
    },
    courses: courses.rows,
    activity: activity.rows,
    topLessons: topLessons.rows,
    lessonFunnel: lessonFunnel.rows,
  });
}));

adminRouter.get('/courses', asyncRoute(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT c.id, c.slug, c.title, c.description, c.price_minor, c.currency, c.published, c.updated_at,
      COUNT(DISTINCT l.id)::int AS lesson_count,
      COUNT(DISTINCT e.user_id)::int AS learner_count
     FROM courses c
     LEFT JOIN lessons l ON l.course_id = c.id
     LEFT JOIN enrollments e ON e.course_id = c.id AND (e.expires_at IS NULL OR e.expires_at > NOW())
     WHERE $1::text = 'admin' OR EXISTS (
       SELECT 1 FROM course_instructors ci WHERE ci.course_id = c.id AND ci.user_id = $2
     )
     GROUP BY c.id ORDER BY c.updated_at DESC`,
    [req.user.role, req.user.id],
  );
  res.set('Cache-Control', 'private, no-store').json({ courses: rows });
}));

adminRouter.post('/courses', requireAdmin, asyncRoute(async (req, res) => {
  assertCsrf(req);
  const parsed = courseCreateSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'invalid_course', 'Add a valid title, course URL name, description, and price in paise.');
  const { title, slug, description, pricePaise } = parsed.data;
  const id = randomUUID();
  try {
    await pool.query(
      `INSERT INTO courses (id, slug, title, description, price_minor, currency, published)
       VALUES ($1, $2, $3, $4, $5, 'INR', FALSE)`,
      [id, slug, title, description, pricePaise],
    );
  } catch (error) {
    if (error.code === '23505') throw new HttpError(409, 'course_slug_taken', 'That course URL is already being used.');
    throw error;
  }
  res.status(201).json({ course: { id, slug, title, description, price_minor: pricePaise, currency: 'INR', published: false } });
}));

adminRouter.get('/courses/:courseId', asyncRoute(async (req, res) => {
  const params = z.string().uuid().safeParse(req.params.courseId);
  if (!params.success) throw new HttpError(400, 'invalid_course', 'Course identifier is invalid.');
  await ensureCourseEditor(req.user, params.data);
  const [course, lessons, resources, plan, instructors] = await Promise.all([
    pool.query('SELECT id, slug, title, description, price_minor, currency, published, updated_at FROM courses WHERE id = $1', [params.data]),
    pool.query('SELECT id, unit_number, position, title, kind, duration_seconds, content, media_storage_key, media_mime_type FROM lessons WHERE course_id = $1 ORDER BY unit_number, position', [params.data]),
    pool.query('SELECT id, lesson_id, title, mime_type, byte_size, created_at FROM resources WHERE course_id = $1 ORDER BY created_at DESC', [params.data]),
    pool.query('SELECT razorpay_plan_id, price_paise, period, interval_count, active FROM course_subscription_plans WHERE course_id = $1', [params.data]),
    req.user.role === 'admin' ? pool.query('SELECT u.id, u.name, u.email FROM course_instructors ci JOIN users u ON u.id = ci.user_id WHERE ci.course_id = $1 ORDER BY u.name', [params.data]) : Promise.resolve({ rows: [] }),
  ]);
  if (!course.rowCount) throw new HttpError(404, 'course_not_found', 'Course not found.');
  res.set('Cache-Control', 'private, no-store').json({ course: course.rows[0], lessons: lessons.rows, resources: resources.rows, subscriptionPlan: plan.rows[0] || null, instructors: instructors.rows });
}));

adminRouter.patch('/courses/:courseId', asyncRoute(async (req, res) => {
  assertCsrf(req);
  const id = z.string().uuid().safeParse(req.params.courseId);
  const parsed = courseUpdateSchema.safeParse(req.body);
  if (!id.success || !parsed.success || Object.keys(parsed.data).length === 0) throw new HttpError(400, 'invalid_course', 'Course changes are invalid.');
  await ensureCourseEditor(req.user, id.data);
  if (req.user.role !== 'admin' && parsed.data.published !== undefined) throw new HttpError(403, 'admin_required', 'Only an administrator can publish a course.');
  const { title, slug, description, pricePaise, published } = parsed.data;
  try {
    const result = await pool.query(
      `UPDATE courses SET
        title = COALESCE($2, title), slug = COALESCE($3, slug), description = COALESCE($4, description),
        price_minor = COALESCE($5, price_minor), published = COALESCE($6, published), updated_at = NOW()
       WHERE id = $1 RETURNING id, slug, title, description, price_minor, currency, published, updated_at`,
      [id.data, title ?? null, slug ?? null, description ?? null, pricePaise ?? null, published ?? null],
    );
    if (!result.rowCount) throw new HttpError(404, 'course_not_found', 'Course not found.');
    res.json({ course: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') throw new HttpError(409, 'course_slug_taken', 'That course URL is already being used.');
    throw error;
  }
}));

adminRouter.post('/courses/:courseId/instructors', requireAdmin, asyncRoute(async (req, res) => {
  assertCsrf(req);
  const id = z.string().uuid().safeParse(req.params.courseId);
  const fields = instructorSchema.safeParse(req.body);
  if (!id.success || !fields.success) throw new HttpError(400, 'invalid_instructor', 'Enter a valid instructor email.');
  const result = await pool.query("SELECT id FROM users WHERE email = $1 AND role = 'instructor'", [fields.data.email]);
  if (!result.rowCount) throw new HttpError(404, 'instructor_not_found', 'Create an instructor account first or ask an administrator to change the account role.');
  await pool.query('INSERT INTO course_instructors (course_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [id.data, result.rows[0].id]);
  res.status(201).json({ assigned: true });
}));

adminRouter.post('/courses/:courseId/lessons', asyncRoute(async (req, res) => {
  assertCsrf(req);
  const id = z.string().uuid().safeParse(req.params.courseId);
  const parsed = lessonCreateSchema.safeParse(req.body);
  if (!id.success || !parsed.success) throw new HttpError(400, 'invalid_lesson', 'Complete the lesson details with a valid type, unit, and position.');
  await ensureCourseEditor(req.user, id.data);
  const lessonId = `lesson-${randomUUID()}`;
  const l = parsed.data;
  try {
    await pool.query(
      `INSERT INTO lessons (id, course_id, unit_number, position, title, kind, duration_seconds, content)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)`,
      [lessonId, id.data, l.unitNumber, l.position, l.title, l.kind, l.durationSeconds, JSON.stringify(l.content)],
    );
  } catch (error) {
    if (error.code === '23505') throw new HttpError(409, 'lesson_position_taken', 'That unit and lesson position is already in use.');
    throw error;
  }
  res.status(201).json({ lesson: { id: lessonId, ...l } });
}));

adminRouter.patch('/lessons/:lessonId', asyncRoute(async (req, res) => {
  assertCsrf(req);
  const lessonId = lessonParams.shape.lessonId.safeParse(req.params.lessonId);
  const parsed = lessonUpdateSchema.safeParse(req.body);
  if (!lessonId.success || !parsed.success || Object.keys(parsed.data).length === 0) throw new HttpError(400, 'invalid_lesson', 'Lesson changes are invalid.');
  const existing = await pool.query('SELECT course_id FROM lessons WHERE id = $1', [lessonId.data]);
  if (!existing.rowCount) throw new HttpError(404, 'lesson_not_found', 'Lesson not found.');
  await ensureCourseEditor(req.user, existing.rows[0].course_id);
  const l = parsed.data;
  try {
    const result = await pool.query(
      `UPDATE lessons SET title = COALESCE($2, title), kind = COALESCE($3, kind),
        unit_number = COALESCE($4, unit_number), position = COALESCE($5, position),
        duration_seconds = COALESCE($6, duration_seconds), content = COALESCE($7::jsonb, content), updated_at = NOW()
       WHERE id = $1 RETURNING id, unit_number, position, title, kind, duration_seconds, content`,
      [lessonId.data, l.title ?? null, l.kind ?? null, l.unitNumber ?? null, l.position ?? null, l.durationSeconds ?? null, l.content === undefined ? null : JSON.stringify(l.content)],
    );
    res.json({ lesson: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') throw new HttpError(409, 'lesson_position_taken', 'That unit and lesson position is already in use.');
    throw error;
  }
}));

adminRouter.delete('/lessons/:lessonId', asyncRoute(async (req, res) => {
  assertCsrf(req);
  const existing = await pool.query('SELECT course_id FROM lessons WHERE id = $1', [req.params.lessonId]);
  if (!existing.rowCount) throw new HttpError(404, 'lesson_not_found', 'Lesson not found.');
  await ensureCourseEditor(req.user, existing.rows[0].course_id);
  await pool.query('DELETE FROM lessons WHERE id = $1', [req.params.lessonId]);
  res.status(204).end();
}));

adminRouter.get('/orders', requireAdmin, asyncRoute(async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT o.id, o.amount_minor, o.discount_minor, o.currency, o.status, o.created_at,
      c.title AS course_title, u.name AS learner_name, u.email AS learner_email, cp.code AS coupon_code
     FROM orders o JOIN courses c ON c.id = o.course_id JOIN users u ON u.id = o.user_id
     LEFT JOIN coupons cp ON cp.id = o.coupon_id ORDER BY o.created_at DESC LIMIT 200`,
  );
  res.set('Cache-Control', 'private, no-store').json({ orders: rows });
}));

adminRouter.get('/users', requireAdmin, asyncRoute(async (_req, res) => {
  const { rows } = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 500');
  res.set('Cache-Control', 'private, no-store').json({ users: rows });
}));

adminRouter.patch('/users/:userId/role', requireAdmin, asyncRoute(async (req, res) => {
  assertCsrf(req);
  const userId = z.string().uuid().safeParse(req.params.userId);
  const role = z.object({ role: z.enum(['learner', 'instructor', 'admin']) }).strict().safeParse(req.body);
  if (!userId.success || !role.success) throw new HttpError(400, 'invalid_role', 'Choose a valid account role.');
  if (userId.data === req.user.id && role.data.role !== 'admin') throw new HttpError(400, 'cannot_remove_own_admin', 'You cannot remove your own administrator access.');
  const result = await pool.query('UPDATE users SET role = $2, updated_at = NOW() WHERE id = $1 RETURNING id, name, email, role', [userId.data, role.data.role]);
  if (!result.rowCount) throw new HttpError(404, 'user_not_found', 'Account not found.');
  res.json({ user: result.rows[0] });
}));

adminRouter.get('/coupons', requireAdmin, asyncRoute(async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT cp.id, cp.code, cp.discount_percent, cp.course_id, c.title AS course_title,
      cp.expires_at, cp.max_redemptions, cp.redeemed_count, cp.active, cp.created_at
     FROM coupons cp LEFT JOIN courses c ON c.id = cp.course_id ORDER BY cp.created_at DESC`,
  );
  res.set('Cache-Control', 'private, no-store').json({ coupons: rows });
}));

adminRouter.post('/coupons', requireAdmin, asyncRoute(async (req, res) => {
  assertCsrf(req);
  const parsed = couponSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'invalid_coupon', 'Enter a valid code, percentage, and optional limits.');
  const coupon = parsed.data;
  const id = randomUUID();
  try {
    await pool.query(
      `INSERT INTO coupons (id, code, discount_percent, course_id, expires_at, max_redemptions)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, coupon.code.toUpperCase(), coupon.discountPercent, coupon.courseId || null, coupon.expiresAt || null, coupon.maxRedemptions || null],
    );
  } catch (error) {
    if (error.code === '23505') throw new HttpError(409, 'coupon_exists', 'That discount code already exists.');
    throw error;
  }
  res.status(201).json({ coupon: { id, code: coupon.code.toUpperCase(), discount_percent: coupon.discountPercent, course_id: coupon.courseId || null, expires_at: coupon.expiresAt || null, max_redemptions: coupon.maxRedemptions || null, redeemed_count: 0, active: true } });
}));

adminRouter.patch('/coupons/:couponId', requireAdmin, asyncRoute(async (req, res) => {
  assertCsrf(req);
  const active = z.object({ active: z.boolean() }).strict().safeParse(req.body);
  const id = z.string().uuid().safeParse(req.params.couponId);
  if (!id.success || !active.success) throw new HttpError(400, 'invalid_coupon', 'Coupon status is invalid.');
  const result = await pool.query('UPDATE coupons SET active = $2 WHERE id = $1 RETURNING id, active', [id.data, active.data.active]);
  if (!result.rowCount) throw new HttpError(404, 'coupon_not_found', 'Discount code not found.');
  res.json({ coupon: result.rows[0] });
}));

adminRouter.post('/courses/:courseId/subscription-plan', requireAdmin, asyncRoute(async (req, res) => {
  assertCsrf(req);
  if (!razorpayClient) throw new HttpError(503, 'payments_not_configured', 'Razorpay is not configured yet.');
  const id = z.string().uuid().safeParse(req.params.courseId);
  const parsed = subscriptionPlanSchema.safeParse(req.body);
  if (!id.success || !parsed.success) throw new HttpError(400, 'invalid_subscription_plan', 'Choose a valid recurring price and billing period.');
  const course = await pool.query('SELECT title FROM courses WHERE id = $1', [id.data]);
  if (!course.rowCount) throw new HttpError(404, 'course_not_found', 'Course not found.');
  const p = parsed.data;
  const providerPlan = await razorpayClient.plans.create({
    period: p.period, interval: p.intervalCount,
    item: { name: course.rows[0].title, amount: p.pricePaise, currency: 'INR', description: 'Recurring course access' },
    notes: { courseId: id.data },
  });
  await pool.query(
    `INSERT INTO course_subscription_plans (course_id, razorpay_plan_id, price_paise, period, interval_count)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (course_id) DO UPDATE SET razorpay_plan_id = EXCLUDED.razorpay_plan_id,
       price_paise = EXCLUDED.price_paise, period = EXCLUDED.period,
       interval_count = EXCLUDED.interval_count, active = TRUE, updated_at = NOW()`,
    [id.data, providerPlan.id, p.pricePaise, p.period, p.intervalCount],
  );
  res.status(201).json({ subscriptionPlan: { razorpayPlanId: providerPlan.id, ...p } });
}));
adminRouter.post('/lessons/:lessonId/video', lessonEditor, (req, _res, next) => {
  try { assertCsrf(req); next(); } catch (error) { next(error); }
}, withUpload, asyncRoute(async (req, res) => {
  const params = lessonParams.safeParse(req.params);
  if (!params.success) throw new HttpError(400, 'invalid_lesson', 'Lesson identifier is invalid.');
  const file = await finalizeUpload(req.file);
  try {
    await pool.query('UPDATE lessons SET media_storage_key = $1, media_mime_type = $2, updated_at = NOW() WHERE id = $3', [file.storageKey, file.mimeType, params.data.lessonId]);
  } catch (error) {
    await unlink(file.fullPath).catch(() => {});
    throw error;
  }
  if (req.lessonForUpload.media_storage_key) {
    const oldPath = path.join(config.assetRoot, req.lessonForUpload.media_storage_key);
    if (path.dirname(oldPath) === config.assetRoot) await unlink(oldPath).catch(() => {});
  }
  res.status(201).json({ lessonId: params.data.lessonId, mediaAvailable: true, mimeType: file.mimeType, byteSize: file.byteSize });
}));

adminRouter.post('/courses/:courseSlug/resources', courseSlugEditor, (req, _res, next) => {
  try { assertCsrf(req); next(); } catch (error) { next(error); }
}, withUpload, asyncRoute(async (req, res) => {
  const params = resourceParams.safeParse(req.params);
  const fields = resourceFields.safeParse(req.body);
  if (!params.success || !fields.success) throw new HttpError(400, 'invalid_resource', 'Resource title, course, or lesson is invalid.');
  const course = await pool.query('SELECT id FROM courses WHERE slug = $1', [params.data.courseSlug]);
  if (!course.rowCount) throw new HttpError(404, 'course_not_found', 'Course not found.');
  const lessonId = fields.data.lessonId || null;
  if (lessonId) {
    const lesson = await pool.query('SELECT 1 FROM lessons WHERE id = $1 AND course_id = $2', [lessonId, course.rows[0].id]);
    if (!lesson.rowCount) throw new HttpError(400, 'invalid_resource_lesson', 'The selected lesson does not belong to this course.');
  }
  if (!req.file) throw new HttpError(400, 'file_required', 'Choose a PDF or supporting video file to upload.');
  const file = await finalizeUpload(req.file);
  try {
    const id = randomUUID();
    await pool.query(
      'INSERT INTO resources (id, course_id, lesson_id, title, storage_key, mime_type, byte_size) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [id, course.rows[0].id, lessonId, fields.data.title, file.storageKey, file.mimeType, file.byteSize],
    );
    return res.status(201).json({ resource: { id, title: fields.data.title, lessonId, mimeType: file.mimeType, byteSize: file.byteSize } });
  } catch (error) {
    await unlink(file.fullPath).catch(() => {});
    throw error;
  }
}));

adminRouter.delete('/resources/:resourceId', asyncRoute(async (req, res) => {
  assertCsrf(req);
  const resourceId = z.string().uuid().safeParse(req.params.resourceId);
  if (!resourceId.success) throw new HttpError(400, 'invalid_resource', 'Resource identifier is invalid.');
  const result = await pool.query('SELECT r.storage_key, r.course_id FROM resources r WHERE r.id = $1', [resourceId.data]);
  if (!result.rowCount) throw new HttpError(404, 'resource_not_found', 'Resource not found.');
  await ensureCourseEditor(req.user, result.rows[0].course_id);
  await pool.query('DELETE FROM resources WHERE id = $1', [resourceId.data]);
  const filePath = path.resolve(config.assetRoot, result.rows[0].storage_key);
  if (path.dirname(filePath) === config.assetRoot) await unlink(filePath).catch(() => {});
  res.status(204).end();
}));
