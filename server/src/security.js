import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import path from 'node:path';
import { config, isAllowedOrigin } from './config.js';

export const SESSION_COOKIE = config.production ? '__Host-tta_session' : 'tta_session';
export const CSRF_COOKIE = config.production ? '__Host-tta_csrf' : 'tta_csrf';

export function newSecret(bytes = 32) {
  return randomBytes(bytes).toString('base64url');
}

export function hashSecret(secret) {
  return createHash('sha256').update(secret).digest('hex');
}

export function parseCookieHeader(header = '') {
  const cookies = new Map();
  for (const entry of header.split(';')) {
    const index = entry.indexOf('=');
    if (index < 1) continue;
    const name = entry.slice(0, index).trim();
    const value = entry.slice(index + 1).trim();
    if (!cookies.has(name)) cookies.set(name, value);
  }
  return cookies;
}

export function equalTokens(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string') return false;
  const leftBytes = Buffer.from(left);
  const rightBytes = Buffer.from(right);
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}

export function serializeCookie(name, value, { httpOnly = true, maxAge = 0, clear = false } = {}) {
  const fields = [`${name}=${clear ? '' : value}`, 'Path=/', 'SameSite=Strict'];
  if (config.production) fields.push('Secure');
  if (httpOnly) fields.push('HttpOnly');
  if (clear) fields.push('Max-Age=0', 'Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  else if (maxAge > 0) fields.push(`Max-Age=${Math.floor(maxAge)}`);
  return fields.join('; ');
}

export function resolvePrivateAsset(storageKey) {
  if (typeof storageKey !== 'string' || !/^[a-zA-Z0-9_-]{1,120}\.[a-zA-Z0-9]{1,10}$/.test(storageKey)) {
    throw new Error('Invalid private asset key');
  }
  const fullPath = path.resolve(config.assetRoot, storageKey);
  if (path.dirname(fullPath) !== config.assetRoot) throw new Error('Invalid private asset path');
  return fullPath;
}

export function assertRequestOrigin(req) {
  if (!isAllowedOrigin(req.get('origin'))) {
    const error = new Error('Origin is not allowed');
    error.status = 403;
    error.code = 'origin_forbidden';
    throw error;
  }
}

export function assertCsrf(req) {
  assertRequestOrigin(req);
  const cookies = parseCookieHeader(req.headers.cookie);
  if (!equalTokens(req.get('x-csrf-token'), cookies.get(CSRF_COOKIE))) {
    const error = new Error('CSRF validation failed');
    error.status = 403;
    error.code = 'csrf_failed';
    throw error;
  }
}
