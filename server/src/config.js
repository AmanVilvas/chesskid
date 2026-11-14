import 'dotenv/config';
import path from 'node:path';

// On Vercel the API runs as a serverless function behind Vercel's proxy (see api/index.js).
const onVercel = Boolean(process.env.VERCEL);
const production = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT || 3001);
const sessionTtlHours = Number(process.env.SESSION_TTL_HOURS || 12);
// APP_ORIGIN may list several site addresses separated by commas; the first is the main one.
const configuredOrigins = (process.env.APP_ORIGIN || 'http://localhost:5173').split(',').map((value) => value.trim()).filter(Boolean);
const appOriginUrls = configuredOrigins.map((value) => new URL(value));
// Vercel's Postgres (Neon) integration provides POSTGRES_URL; DATABASE_URL is preferred when both exist.
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
const databaseSsl = process.env.DATABASE_SSL ? process.env.DATABASE_SSL === 'true' : onVercel;
const configuredCoursePricePaise = process.env.BEGINNER_COURSE_PRICE_PAISE ?? process.env.BEGINNER_COURSE_PRICE_MINOR;
const coursePriceMinor = Number(configuredCoursePricePaise || 0);
const razorpayConfigured = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_WEBHOOK_SECRET);

if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be a valid TCP port');
if (!Number.isFinite(sessionTtlHours) || sessionTtlHours < 1 || sessionTtlHours > 24 * 30) throw new Error('SESSION_TTL_HOURS must be between 1 and 720');
if (!databaseUrl) throw new Error('DATABASE_URL is required');
if (production && appOriginUrls.some((url) => url.protocol !== 'https:')) throw new Error('APP_ORIGIN must use HTTPS in production');
if (production && !databaseSsl) throw new Error('DATABASE_SSL=true is required in production');
if (production && (!configuredCoursePricePaise || coursePriceMinor <= 0)) throw new Error('A positive course price in paise must be configured before production starts');
// Accounts work without Razorpay; checkout and the webhook answer "not configured" until keys are set.
if (production && !razorpayConfigured) console.warn('Razorpay is not configured: paid checkout is disabled until RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET and RAZORPAY_WEBHOOK_SECRET are set.');

const appOrigin = appOriginUrls[0].origin;
const allowedOrigins = new Set(appOriginUrls.map((url) => url.origin));
// Serverless file systems are read-only except /tmp, and /tmp is not durable.
const assetRoot = path.resolve(process.env.PRIVATE_ASSET_ROOT || (onVercel ? '/tmp/private-assets' : './private-assets'));

export const config = Object.freeze({
  production,
  port,
  appOrigin,
  sessionTtlHours,
  databaseUrl,
  databaseSsl,
  // Vercel sits exactly one proxy hop in front of the function, so client IPs (for rate limits) come from it.
  trustProxy: process.env.TRUST_PROXY ? process.env.TRUST_PROXY === '1' : onVercel,
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  coursePriceMinor,
  courseCurrency: 'INR',
  assetRoot,
});

export function isAllowedOrigin(origin) {
  if (allowedOrigins.has(origin)) return true;
  if (!config.production && typeof origin === 'string') {
    try {
      const url = new URL(origin);
      return ['localhost', '127.0.0.1'].includes(url.hostname) && ['http:', 'https:'].includes(url.protocol);
    } catch { return false; }
  }
  return false;
}

if (!Number.isSafeInteger(config.coursePriceMinor) || config.coursePriceMinor < 0) throw new Error('BEGINNER_COURSE_PRICE_PAISE must be a non-negative integer');
if ((process.env.BEGINNER_COURSE_CURRENCY || 'INR').toUpperCase() !== 'INR') throw new Error('This course checkout is configured for INR only');
