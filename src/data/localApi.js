// Browser-only stand-in for the course API (no server, no database).
// Accounts, sessions and lesson progress live in this browser's localStorage, so an account
// only exists on the device where it was created. Passwords are stored as salted PBKDF2 hashes,
// but this is a demo mode: switch back to the real API (VITE_USE_API=true) for real accounts.
import { course1Sections } from '../parent/course1Sections';
import { PARTS, PREVIEW_UNITS, priceFor } from '../home/data';

const ACCOUNTS_KEY = 'ta-local-accounts';
const SESSION_KEY = 'ta-local-session';
const PROGRESS_KEY = 'ta-local-progress';
const PURCHASES_KEY = 'ta-local-purchases';
const COURSE = { id: 'local-beginner-chess', slug: 'beginner-chess', title: 'Beginner Chess', description: 'Chess Course 1: meet the pieces, one a day.', price_minor: 0, currency: 'INR', has_subscription: false };
const LESSON_IDS = [...new Set(course1Sections.flatMap((section) => section.lectures.map((lecture) => lecture.id)))];

function read(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');
    return value && typeof value === 'object' ? value : fallback;
  } catch { return fallback; }
}
function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { throw new Error('This browser is blocking storage, so your account cannot be saved here.'); }
}

const fail = (message) => { throw new Error(message); };
const toHex = (buffer) => [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
const randomId = () => (crypto.randomUUID ? crypto.randomUUID() : toHex(crypto.getRandomValues(new Uint8Array(16))));

async function hashPassword(password, saltHex) {
  const salt = Uint8Array.from(saltHex.match(/../g).map((pair) => parseInt(pair, 16)));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  return toHex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 150_000 }, key, 256));
}

const publicUser = (account) => ({ id: account.id, name: account.name, email: account.email, role: account.role });
const currentAccount = () => {
  const session = read(SESSION_KEY, null);
  if (!session?.userId) return null;
  return Object.values(read(ACCOUNTS_KEY, {})).find((account) => account.id === session.userId) || null;
};
const requireAccount = () => currentAccount() || fail('Sign in to continue.');

async function register({ name, email, password } = {}) {
  const cleanName = String(name || '').trim();
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (!cleanName || cleanName.length > 70 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || String(password || '').length < 12 || String(password).length > 128) {
    fail('Enter a name, valid email, and password with at least 12 characters.');
  }
  const accounts = read(ACCOUNTS_KEY, {});
  if (accounts[cleanEmail]) fail('An account with this email already exists. Try signing in.');
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
  const account = { id: randomId(), name: cleanName, email: cleanEmail, role: 'learner', salt, hash: await hashPassword(password, salt), createdAt: new Date().toISOString() };
  write(ACCOUNTS_KEY, { ...accounts, [cleanEmail]: account });
  write(SESSION_KEY, { userId: account.id });
  return { user: publicUser(account) };
}

async function login({ email, password } = {}) {
  const account = read(ACCOUNTS_KEY, {})[String(email || '').trim().toLowerCase()];
  const hash = account ? await hashPassword(String(password || ''), account.salt) : null;
  if (!account || hash !== account.hash) fail('That email and password do not match an account on this device.');
  write(SESSION_KEY, { userId: account.id });
  return { user: publicUser(account) };
}

const purchasesOf = (userId) => read(PURCHASES_KEY, {})[userId] || [];
const hasCourse = () => purchasesOf(requireAccount().id).length > 0;
const NEEDS_PURCHASE = 'Choose a course part to unlock your lessons.';

/** Demo payment: records a purchase for this account. No money moves. */
function demoPay({ parts, personalised } = {}) {
  const account = requireAccount();
  const ids = [...new Set((Array.isArray(parts) ? parts : []).map(Number))].filter((n) => n >= 1 && n <= PARTS.length).sort();
  if (!ids.length) fail('Choose at least one course part.');
  const owned = new Set(purchasesOf(account.id).flatMap((p) => p.parts));
  if (ids.some((id) => owned.has(id))) fail('You already have one of those parts.');
  const purchase = { id: `DEMO-${Date.now().toString(36).toUpperCase()}`, parts: ids, personalised: Boolean(personalised), amount: priceFor(ids, Boolean(personalised)), at: new Date().toISOString(), child: null };
  const all = read(PURCHASES_KEY, {});
  write(PURCHASES_KEY, { ...all, [account.id]: [...purchasesOf(account.id), purchase] });
  return { purchase };
}

function savePersonalisation({ id, name, fav, colour } = {}) {
  const account = requireAccount();
  const all = read(PURCHASES_KEY, {});
  const mine = purchasesOf(account.id).map((p) => (p.id === id ? { ...p, child: { name: String(name || '').slice(0, 20), fav: String(fav || '').slice(0, 8), colour: String(colour || '').slice(0, 9) } } : p));
  write(PURCHASES_KEY, { ...all, [account.id]: mine });
  return { ok: true };
}

// The two preview units are open to every signed-in parent; everything else needs a purchase.
const isPreviewLesson = (id) => { const m = String(id).match(/^u(\d+)-/); return Boolean(m) && PREVIEW_UNITS.includes(Number(m[1])); };

function lessons() {
  const account = requireAccount();
  const owned = hasCourse();
  const done = read(PROGRESS_KEY, {})[account.id] || {};
  return { lessons: LESSON_IDS.map((id) => ({ id, media_available: false, completed: Boolean(done[id]), locked: !owned && !isPreviewLesson(id) })) };
}

function completeLesson(lessonId, completed) {
  const account = requireAccount();
  if (!hasCourse() && !isPreviewLesson(lessonId)) fail(NEEDS_PURCHASE);
  if (!LESSON_IDS.includes(lessonId)) fail('Lesson not found.');
  const progress = read(PROGRESS_KEY, {});
  const mine = { ...(progress[account.id] || {}) };
  if (completed === false) delete mine[lessonId];
  else mine[lessonId] = true;
  write(PROGRESS_KEY, { ...progress, [account.id]: mine });
  return { progress: { lessonId, completed: completed !== false } };
}

/** Answers the same paths and methods as the server API. */
export async function localApiRequest(path, { method = 'GET', body } = {}) {
  const url = new URL(path, 'http://local');
  const route = url.pathname;
  const verb = method.toUpperCase();
  const lessonMatch = route.match(/^\/api\/lessons\/([^/]+)\/complete$/);

  if (route === '/api/auth/csrf') return { csrfToken: 'local' };
  if (route === '/api/auth/me') return { user: publicUser(requireAccount()) };
  if (route === '/api/auth/register' && verb === 'POST') return register(body);
  if (route === '/api/auth/login' && verb === 'POST') return login(body);
  if (route === '/api/auth/logout' && verb === 'POST') { localStorage.removeItem(SESSION_KEY); return null; }
  if (route === '/api/courses/beginner-chess') return { course: COURSE };
  // The course opens once this account has bought at least one part (demo checkout).
  if (route === '/api/courses/beginner-chess/access') return { enrolled: hasCourse() };
  if (route === '/api/payments/purchases') return { purchases: purchasesOf(requireAccount().id) };
  if (route === '/api/payments/demo-pay' && verb === 'POST') return demoPay(body);
  if (route === '/api/payments/personalisation' && verb === 'POST') return savePersonalisation(body);
  if (route === '/api/payments/demo-reset' && verb === 'POST') { const all = read(PURCHASES_KEY, {}); delete all[requireAccount().id]; write(PURCHASES_KEY, all); return { ok: true }; }
  if (route === '/api/courses/beginner-chess/lessons') return lessons();
  if (lessonMatch && verb === 'POST') return completeLesson(decodeURIComponent(lessonMatch[1]), body?.completed);
  if (route === '/api/payments/free-enrollment') fail('This course is paid. Choose a part to unlock it.');
  if (route.startsWith('/api/payments/')) fail('Payments are not available yet. The course is free for now.');
  if (route.startsWith('/api/admin')) fail('The admin dashboard needs the course server, which is switched off for now.');
  return fail('This feature is not available yet.');
}
