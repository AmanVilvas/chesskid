import argon2 from 'argon2';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { pool } from './db.js';
import { config } from './config.js';
import { asyncRoute, HttpError, sendError } from './http.js';
import {
  CSRF_COOKIE, SESSION_COOKIE, assertCsrf, newSecret, hashSecret,
  parseCookieHeader, serializeCookie,
} from './security.js';

const registerSchema = z.object({
  name: z.string().trim().min(1).max(70),
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(12).max(128),
}).strict();
const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(128),
}).strict();

const passwordOptions = { type: argon2.argon2id, memoryCost: 19_456, timeCost: 2, parallelism: 1 };
const dummyPasswordHash = await argon2.hash('not-a-valid-user-password', passwordOptions);

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function setSessionCookie(res, secret, expiresAt) {
  const maxAge = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
  res.append('Set-Cookie', serializeCookie(SESSION_COOKIE, secret, { maxAge }));
}

function clearSessionCookie(res) {
  res.append('Set-Cookie', serializeCookie(SESSION_COOKIE, '', { clear: true }));
}

export async function requireAuth(req, res, next) {
  try {
    const secret = parseCookieHeader(req.headers.cookie).get(SESSION_COOKIE);
    if (!secret || !/^[A-Za-z0-9_-]{40,60}$/.test(secret)) throw new HttpError(401, 'authentication_required', 'Sign in to continue.');
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, s.expires_at
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = $1 AND s.expires_at > NOW()`,
      [hashSecret(secret)],
    );
    if (!result.rowCount) throw new HttpError(401, 'authentication_required', 'Sign in to continue.');
    req.user = publicUser(result.rows[0]);
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return next(new HttpError(403, 'admin_required', 'You do not have access to this action.'));
  return next();
}

export function registerAuthRoutes(app, { loginLimiter, registerLimiter }) {
  app.get('/api/auth/csrf', (req, res) => {
    const token = newSecret();
    res.append('Set-Cookie', serializeCookie(CSRF_COOKIE, token, { httpOnly: false, maxAge: 60 * 60 * 4 }));
    res.set('Cache-Control', 'no-store');
    res.json({ csrfToken: token });
  });

  app.post('/api/auth/register', registerLimiter, asyncRoute(async (req, res) => {
    assertCsrf(req);
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, 400, 'invalid_input', 'Enter a name, valid email, and password with at least 12 characters.');
    const { name, email, password } = parsed.data;
    const passwordHash = await argon2.hash(password, passwordOptions);
    const userId = randomUUID();
    let user;
    try {
      const result = await pool.query(
        'INSERT INTO users (id, email, name, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
        [userId, email, name, passwordHash],
      );
      user = result.rows[0];
    } catch (error) {
      if (error.code === '23505') return sendError(res, 409, 'account_exists', 'An account with this email already exists. Try signing in.');
      throw error;
    }
    await issueSession(res, user.id);
    return res.status(201).json({ user: publicUser(user) });
  }));

  app.post('/api/auth/login', loginLimiter, asyncRoute(async (req, res) => {
    assertCsrf(req);
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, 400, 'invalid_input', 'Enter a valid email and password.');
    const { email, password } = parsed.data;
    const result = await pool.query('SELECT id, name, email, role, password_hash FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    const valid = await argon2.verify(user?.password_hash || dummyPasswordHash, password).catch(() => false);
    if (!user || !valid) return sendError(res, 401, 'invalid_credentials', 'We couldn’t match that email and password. Check them and try again.');
    await issueSession(res, user.id);
    return res.json({ user: publicUser(user) });
  }));

  app.get('/api/auth/me', requireAuth, (req, res) => {
    res.set('Cache-Control', 'no-store').json({ user: req.user });
  });

  app.post('/api/auth/logout', requireAuth, asyncRoute(async (req, res) => {
    assertCsrf(req);
    const secret = parseCookieHeader(req.headers.cookie).get(SESSION_COOKIE);
    await pool.query('DELETE FROM sessions WHERE token_hash = $1', [hashSecret(secret)]);
    clearSessionCookie(res);
    return res.status(204).end();
  }));
}

async function issueSession(res, userId) {
  const secret = newSecret();
  const expiresAt = new Date(Date.now() + config.sessionTtlHours * 60 * 60 * 1000);
  await pool.query('DELETE FROM sessions WHERE expires_at <= NOW()');
  await pool.query('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, $3)', [hashSecret(secret), userId, expiresAt]);
  setSessionCookie(res, secret, expiresAt);
}
