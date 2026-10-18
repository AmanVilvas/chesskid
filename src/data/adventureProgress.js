const ACTIVITY_DAYS_KEY = 'chesskid-adventure-activity-days';

function localDayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function readActivityDays() {
  try {
    const days = JSON.parse(localStorage.getItem(ACTIVITY_DAYS_KEY) || '[]');
    return Array.isArray(days) ? [...new Set(days.filter((day) => /^\d{4}-\d{2}-\d{2}$/.test(day)))].sort() : [];
  } catch {
    return [];
  }
}

export function recordLearningActivity() {
  try {
    const days = new Set(readActivityDays());
    days.add(localDayKey());
    localStorage.setItem(ACTIVITY_DAYS_KEY, JSON.stringify([...days].sort()));
  } catch {
    // Progress still works for this session when browser storage is unavailable.
  }
}

export function getLearningStreak(days = readActivityDays(), now = new Date()) {
  if (!days.length) return { current: 0, best: 0 };
  const activity = new Set(days);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const previousLocalDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
  const yesterday = previousLocalDay(today);
  let cursor = activity.has(localDayKey(today)) ? today : activity.has(localDayKey(yesterday)) ? yesterday : null;
  let current = 0;
  while (cursor && activity.has(localDayKey(cursor))) {
    current += 1;
    cursor = previousLocalDay(cursor);
  }

  let best = 0;
  let run = 0;
  let previous = null;
  for (const key of days) {
    const [year, month, day] = key.split('-').map(Number);
    const date = Date.UTC(year, month - 1, day) / 86_400_000;
    if (previous !== null && date - previous === 1) run += 1;
    else run = 1;
    best = Math.max(best, run);
    previous = date;
  }
  return { current, best };
}
