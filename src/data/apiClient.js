import { localApiRequest } from './localApi';

// For now the site runs without a server: accounts and progress are kept in browser storage.
// Set VITE_USE_API=true (for example in a .env.local file) to use the Express API in server/ instead.
export const USE_SERVER_API = import.meta.env.VITE_USE_API === 'true';

let csrfToken = null;

export async function refreshCsrfToken() {
  if (!USE_SERVER_API) return 'local';
  const response = await fetch('/api/auth/csrf', { credentials: 'include', headers: { Accept: 'application/json' } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || typeof data.csrfToken !== 'string') throw new Error(data.error?.message || 'Could not connect securely to the academy.');
  csrfToken = data.csrfToken;
  return csrfToken;
}

export async function apiRequest(path, options = {}) {
  if (!USE_SERVER_API) return localApiRequest(path, options);
  const method = (options.method || 'GET').toUpperCase();
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');
  if (options.body !== undefined && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    if (!csrfToken) await refreshCsrfToken();
    headers.set('X-CSRF-Token', csrfToken);
  }
  let response = await fetch(path, {
    ...options,
    method,
    headers,
    credentials: 'include',
    body: options.body === undefined || options.body instanceof FormData ? options.body : JSON.stringify(options.body),
  });
  if (response.status === 403 && !['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const errorData = await response.clone().json().catch(() => ({}));
    if (errorData.error?.code === 'csrf_failed') {
      await refreshCsrfToken();
      headers.set('X-CSRF-Token', csrfToken);
      response = await fetch(path, { ...options, method, headers, credentials: 'include', body: options.body === undefined || options.body instanceof FormData ? options.body : JSON.stringify(options.body) });
    }
  }
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || 'The request could not be completed.');
  return data;
}
