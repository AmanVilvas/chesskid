import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { adminRouter } from './admin.js';
import { config, isAllowedOrigin } from './config.js';
import { registerAuthRoutes } from './auth.js';
import { catalogRouter } from './catalog.js';
import { handleRazorpayWebhook, paymentRouter } from './payments.js';
import { HttpError, sendError } from './http.js';

export const app = express();
app.disable('x-powered-by');
if (config.trustProxy) app.set('trust proxy', 1);
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  contentSecurityPolicy: {
    directives: {
      scriptSrc: ["'self'", 'https://checkout.razorpay.com'],
      frameSrc: ["'self'", 'https://api.razorpay.com', 'https://checkout.razorpay.com'],
    },
  },
}));
app.use(cors({
  origin(origin, callback) {
    if (!origin || isAllowedOrigin(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'Idempotency-Key'],
  maxAge: 600,
}));

const makeLimiter = (windowMs, limit, message) => rateLimit({
  windowMs,
  limit,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: { code: 'rate_limited', message } },
});
const authLimiter = makeLimiter(15 * 60 * 1000, 30, 'Too many account requests. Try again later.');
const loginLimiter = makeLimiter(15 * 60 * 1000, 10, 'Too many sign-in attempts. Try again later.');
const registerLimiter = makeLimiter(60 * 60 * 1000, 8, 'Too many accounts were created from this network. Try again later.');
const checkoutLimiter = makeLimiter(10 * 60 * 1000, 8, 'Too many checkout attempts. Try again shortly.');
const adminUploadLimiter = makeLimiter(60 * 60 * 1000, 30, 'Too many content uploads. Try again later.');
const apiLimiter = makeLimiter(15 * 60 * 1000, 2400, 'Too many requests. Please try again later.');

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Razorpay webhook signatures must be checked against the exact raw request body.
app.post('/api/payments/webhook', express.raw({ type: 'application/json', limit: '256kb' }), (req, res, next) => {
  Promise.resolve(handleRazorpayWebhook(req, res)).catch(next);
});

app.use('/api', apiLimiter);
app.use(express.json({ limit: '20kb', strict: true }));
app.use('/api/auth', authLimiter);
registerAuthRoutes(app, { loginLimiter, registerLimiter });
app.use('/api', catalogRouter);
app.use('/api/payments', checkoutLimiter, paymentRouter);
app.use('/api/admin', adminUploadLimiter, adminRouter);
app.use('/api', (_req, _res, next) => next(new HttpError(404, 'not_found', 'This API route was not found.')));

app.use((error, req, res, _next) => {
  if (req.file?.path && path.dirname(req.file.path) === config.assetRoot) void unlink(req.file.path).catch(() => {});
  if (res.headersSent) return;
  const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : Number.isInteger(error.status) && error.status >= 400 && error.status < 600 ? error.status : 500;
  if (status >= 500) console.error('Request failed:', error.code || error.name || 'internal_error');
  const message = status === 413 ? 'Uploaded files must be 500 MB or smaller.' : status === 500 ? 'Something went wrong. Please try again.' : error.message;
  sendError(res, status, error.code || (status === 500 ? 'internal_error' : 'request_failed'), message);
});
