import { Router } from 'express';
import { pool } from './db.js';
import { asyncRoute, HttpError } from './http.js';
import { requireAuth } from './auth.js';
import { assertCsrf } from './security.js';
import { z } from 'zod';

const progressSchema = z.object({ completed: z.boolean() }).strict();

export const catalogRouter = Router();

catalogRouter.get('/courses', asyncRoute(async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT c.id, c.slug, c.title, c.description, c.price_minor, c.currency,
            sp.razorpay_plan_id IS NOT NULL AS has_subscription,
            sp.price_paise AS subscription_price_paise, sp.period AS subscription_period, sp.interval_count AS subscription_interval_count,
            COUNT(l.id)::int AS lesson_count
     FROM courses c LEFT JOIN lessons l ON l.course_id = c.id
     LEFT JOIN course_subscription_plans sp ON sp.course_id = c.id AND sp.active = TRUE
     WHERE c.published = TRUE GROUP BY c.id ORDER BY c.created_at`,
  );
  res.set('Cache-Control', 'public, max-age=60').json({ courses: rows });
}));

catalogRouter.get('/courses/:slug', asyncRoute(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT c.id, c.slug, c.title, c.description, c.price_minor, c.currency,
      sp.razorpay_plan_id IS NOT NULL AS has_subscription,
      sp.price_paise AS subscription_price_paise, sp.period AS subscription_period, sp.interval_count AS subscription_interval_count
     FROM courses c LEFT JOIN course_subscription_plans sp ON sp.course_id = c.id AND sp.active = TRUE
     WHERE c.slug = $1 AND c.published = TRUE`,
    [req.params.slug],
  );
  if (!rows[0]) throw new HttpError(404, 'course_not_found', 'Course not found.');
  res.json({ course: rows[0] });
}));

catalogRouter.get('/courses/:slug/access', requireAuth, asyncRoute(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT c.id AS course_id, (e.user_id IS NOT NULL) AS enrolled
     FROM courses c LEFT JOIN enrollments e ON e.course_id = c.id AND e.user_id = $2 AND (e.expires_at IS NULL OR e.expires_at > NOW())
     WHERE c.slug = $1 AND c.published = TRUE`,
    [req.params.slug, req.user.id],
  );
  if (!rows[0]) throw new HttpError(404, 'course_not_found', 'Course not found.');
  res.set('Cache-Control', 'no-store').json({ enrolled: rows[0].enrolled });
}));

catalogRouter.get('/me/courses', requireAuth, asyncRoute(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT c.id, c.slug, c.title, c.description, c.price_minor, c.currency, e.enrolled_at
     FROM enrollments e JOIN courses c ON c.id = e.course_id
     WHERE e.user_id = $1 AND c.published = TRUE AND (e.expires_at IS NULL OR e.expires_at > NOW()) ORDER BY e.enrolled_at DESC`,
    [req.user.id],
  );
  res.set('Cache-Control', 'no-store').json({ courses: rows });
}));

catalogRouter.get('/courses/:slug/lessons', requireAuth, asyncRoute(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT l.id, l.unit_number, l.position, l.title, l.kind, l.duration_seconds,
            l.content, (l.media_storage_key IS NOT NULL) AS media_available,
            (p.completed_at IS NOT NULL) AS completed
     FROM courses c JOIN enrollments e ON e.course_id = c.id AND e.user_id = $2 AND (e.expires_at IS NULL OR e.expires_at > NOW())
     JOIN lessons l ON l.course_id = c.id
     LEFT JOIN lesson_progress p ON p.lesson_id = l.id AND p.user_id = $2
     WHERE c.slug = $1 AND c.published = TRUE ORDER BY l.unit_number, l.position`,
    [req.params.slug, req.user.id],
  );
  if (!rows.length) {
    const course = await pool.query('SELECT id FROM courses WHERE slug = $1 AND published = TRUE', [req.params.slug]);
    if (!course.rowCount) throw new HttpError(404, 'course_not_found', 'Course not found.');
    const enrolled = await pool.query('SELECT 1 FROM enrollments WHERE course_id = $1 AND user_id = $2 AND (expires_at IS NULL OR expires_at > NOW())', [course.rows[0].id, req.user.id]);
    if (!enrolled.rowCount) throw new HttpError(403, 'course_access_required', 'Enroll in this course to access its lessons.');
  }
  res.set('Cache-Control', 'private, no-store').json({ lessons: rows });
}));

catalogRouter.get('/courses/:slug/resources', requireAuth, asyncRoute(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT r.id, r.lesson_id, r.title, r.mime_type, r.byte_size, r.created_at
     FROM courses c JOIN enrollments e ON e.course_id = c.id AND e.user_id = $2 AND (e.expires_at IS NULL OR e.expires_at > NOW())
     LEFT JOIN resources r ON r.course_id = c.id
     WHERE c.slug = $1 AND c.published = TRUE ORDER BY r.created_at, r.title`,
    [req.params.slug, req.user.id],
  );
  if (!rows.length) {
    const course = await pool.query('SELECT id FROM courses WHERE slug = $1 AND published = TRUE', [req.params.slug]);
    if (!course.rowCount) throw new HttpError(404, 'course_not_found', 'Course not found.');
    throw new HttpError(403, 'course_access_required', 'Enroll in this course to access its resources.');
  }
  res.set('Cache-Control', 'private, no-store').json({ resources: rows.filter((resource) => resource.id) });
}));

catalogRouter.post('/lessons/:lessonId/complete', requireAuth, asyncRoute(async (req, res) => {
  assertCsrf(req);
  const parsed = progressSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'invalid_progress', 'Progress update is invalid.');
  const completed = parsed.data.completed;
  const { rows } = await pool.query(
    `INSERT INTO lesson_progress (user_id, lesson_id, completed_at)
     SELECT $1, l.id, CASE WHEN $3 THEN NOW() ELSE NULL END
     FROM lessons l JOIN enrollments e ON e.course_id = l.course_id AND e.user_id = $1 AND (e.expires_at IS NULL OR e.expires_at > NOW())
     WHERE l.id = $2
     ON CONFLICT (user_id, lesson_id) DO UPDATE
       SET completed_at = CASE WHEN $3 THEN COALESCE(lesson_progress.completed_at, NOW()) ELSE NULL END,
           updated_at = NOW()
     RETURNING lesson_id, completed_at`,
    [req.user.id, req.params.lessonId, completed],
  );
  if (!rows[0]) throw new HttpError(404, 'lesson_not_found', 'Lesson not found or course access is required.');
  res.set('Cache-Control', 'no-store').json({ progress: rows[0] });
}));

catalogRouter.get('/lessons/:lessonId/video', requireAuth, asyncRoute(async (req, res) => {
  const { streamPrivateAsset } = await import('./assets.js');
  const { rows } = await pool.query(
    `SELECT l.media_storage_key, l.media_mime_type
     FROM lessons l JOIN enrollments e ON e.course_id = l.course_id AND e.user_id = $2 AND (e.expires_at IS NULL OR e.expires_at > NOW())
     WHERE l.id = $1`,
    [req.params.lessonId, req.user.id],
  );
  if (!rows[0]) throw new HttpError(404, 'lesson_not_found', 'Lesson not found or course access is required.');
  if (!rows[0].media_storage_key) throw new HttpError(404, 'media_not_configured', 'Video media is not available for this lesson yet.');
  await streamPrivateAsset(req, res, rows[0].media_storage_key, rows[0].media_mime_type);
}));

catalogRouter.get('/resources/:resourceId/download', requireAuth, asyncRoute(async (req, res) => {
  const { streamPrivateAsset } = await import('./assets.js');
  const { rows } = await pool.query(
    `SELECT r.storage_key, r.mime_type, r.title
     FROM resources r JOIN enrollments e ON e.course_id = r.course_id AND e.user_id = $2 AND (e.expires_at IS NULL OR e.expires_at > NOW())
     WHERE r.id = $1`,
    [req.params.resourceId, req.user.id],
  );
  if (!rows[0]) throw new HttpError(404, 'resource_not_found', 'Resource not found or course access is required.');
  const extension = rows[0].mime_type === 'application/pdf' ? '.pdf' : rows[0].mime_type === 'video/webm' ? '.webm' : '.mp4';
  res.set('Content-Disposition', `attachment; filename="course-resource${extension}"`);
  await streamPrivateAsset(req, res, rows[0].storage_key, rows[0].mime_type);
}));
