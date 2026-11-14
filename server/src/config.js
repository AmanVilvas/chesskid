import 'dotenv/config';
import path from 'node:path';

const production = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT || 3001);
const sessionTtlHours = Number(process.env.SESSION_TTL_HOURS || 12);
const configuredOrigin = process.env.APP_ORIGIN || 'http://localhost:5173';
const appOriginUrl = new URL(configuredOrigin);
const databaseSsl = process.env.DATABASE_SSL === 'true';
const configuredCoursePricePaise = process.env.BEGINNER_COURSE_PRICE_PAISE ?? process.env.BEGINNER_COURSE_PRICE_MINOR;
const coursePriceMinor = Number(configuredCoursePricePaise || 0);

if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be a valid TCP port');
if (!Number.isFinite(sessionTtlHours) || sessionTtlHours < 1 || sessionTtlHours > 24 * 30) throw new Error('SESSION_TTL_HOURS must be between 1 and 720');
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
if (production && (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET || !process.env.RAZORPAY_WEBHOOK_SECRET)) throw new Error('Razorpay credentials and webhook secret must be configured before production starts');
if (production && appOriginUrl.protocol !== 'https:') throw new Error('APP_ORIGIN must use HTTPS in production');
if (production && !databaseSsl) throw new Error('DATABASE_SSL=true is required in production');
if (production && (!configuredCoursePricePaise || coursePriceMinor <= 0)) throw new Error('A positive course price in paise must be configured before production starts');

const appOrigin = appOriginUrl.origin;
const assetRoot = path.resolve(process.env.PRIVATE_ASSET_ROOT || './private-assets');

export const config = Object.freeze({
  production,
  port,
  appOrigin,
  sessionTtlHours,
  databaseUrl: process.env.DATABASE_URL,
  databaseSsl,
  trustProxy: process.env.TRUST_PROXY === '1',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  coursePriceMinor,
  courseCurrency: 'INR',
  assetRoot,
});

export function isAllowedOrigin(origin) {
  if (origin === config.appOrigin) return true;
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
