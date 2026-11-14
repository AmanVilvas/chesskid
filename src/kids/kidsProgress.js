// Kids World progress. Puzzle completion is stored in the SAME key and shape the
// course player uses ('course-lichess-learn-v1': { [pieceId]: { completed: number[], stars } }),
// so progress is shared between the kids map and the existing lesson player.
export const PUZZLE_PROGRESS_KEY = 'course-lichess-learn-v1';
export const KIDS_STATE_KEY = 'kids-world-v1';
// The adventure home page reads lesson completion from this key.
export const LESSON_ITEMS_KEY = 'course-completed-items';
export const UNLOCK_PUZZLES_NEEDED = 3;

function readJson(key, fallback) {
  try {
    const value = JSON.parse(globalThis.localStorage?.getItem(key) || 'null');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try { globalThis.localStorage?.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
}

export function readKidsState() {
  const state = readJson(KIDS_STATE_KEY, {});
  return {
    watched: state.watched && typeof state.watched === 'object' ? state.watched : {},
    crowns: state.crowns && typeof state.crowns === 'object' ? state.crowns : {},
    // Worlds whose opening has already been celebrated on the map (null = never tracked yet).
    seenOpen: Array.isArray(state.seenOpen) ? state.seenOpen.filter(Number.isInteger) : null,
    worksheets: state.worksheets && typeof state.worksheets === 'object' ? state.worksheets : {},
    chests: state.chests && typeof state.chests === 'object' ? state.chests : {},
    daily: state.daily && typeof state.daily === 'object' ? state.daily : {},
  };
}

export function todayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function updateKidsState(change) {
  const state = readKidsState();
  change(state);
  writeJson(KIDS_STATE_KEY, state);
  return state;
}

export const markWorksheetDone = (worldId) => updateKidsState((state) => { state.worksheets[worldId] = true; });
export const markChestOpened = (worldId) => updateKidsState((state) => { state.chests[worldId] = true; });
/** Daily quest: puzzles solved today (only today's count is kept). */
export const recordDailyPuzzle = () => updateKidsState((state) => {
  const key = todayKey();
  state.daily = { [key]: (Number(state.daily[key]) || 0) + 1 };
});
export const dailyPuzzles = (state = readKidsState()) => Number(state.daily[todayKey()]) || 0;

/**
 * Which newly opened world (if any) the map should celebrate. The first time this is tracked,
 * every world that is already open counts as seen, so existing players get no surprise replays.
 * Returns { celebrate, seenOpen } where seenOpen is the list to store afterwards.
 */
export function pickUnlockToCelebrate(worldSummaries, seenOpen) {
  const open = worldSummaries.filter((world) => world.unlocked).map((world) => world.id);
  if (!Array.isArray(seenOpen)) return { celebrate: null, seenOpen: open };
  const fresh = open.filter((id) => id !== 1 && !seenOpen.includes(id));
  return { celebrate: fresh.length ? Math.max(...fresh) : null, seenOpen: [...new Set([...seenOpen, ...open])].sort((a, b) => a - b) };
}

export function markSeenOpen(ids) {
  const state = readKidsState();
  state.seenOpen = ids;
  writeJson(KIDS_STATE_KEY, state);
}

export function readPuzzleProgress() {
  return readJson(PUZZLE_PROGRESS_KEY, {});
}

export function markWatched(worldId, lessonId) {
  const state = readKidsState();
  state.watched[worldId] = true;
  writeJson(KIDS_STATE_KEY, state);
  markLessonItem(lessonId);
  return state;
}

export function markLessonItem(lessonId) {
  if (!lessonId) return;
  const items = readJson(LESSON_ITEMS_KEY, {});
  items[lessonId] = true;
  writeJson(LESSON_ITEMS_KEY, items);
}

/** Crowns for one puzzle: 3 when solved within the exercise's target move count. */
export function crownsFor(moves, targetMoves) {
  if (!Number.isFinite(targetMoves) || targetMoves <= 0) return 3;
  if (moves <= targetMoves) return 3;
  if (moves <= targetMoves + 2) return 2;
  return 1;
}

/** Records a solved puzzle in the shared practice progress and the kids crown table. */
export function recordPuzzleSolved(pieceId, puzzleIndex, puzzleId, crowns) {
  const progress = readPuzzleProgress();
  const piece = progress[pieceId] && Array.isArray(progress[pieceId].completed)
    ? progress[pieceId]
    : { completed: [], stars: 0 };
  const firstCompletion = !piece.completed.includes(puzzleIndex);
  if (firstCompletion) {
    piece.completed = [...piece.completed, puzzleIndex].sort((a, b) => a - b);
    piece.stars = piece.completed.length;
  }
  progress[pieceId] = piece;
  writeJson(PUZZLE_PROGRESS_KEY, progress);

  const state = readKidsState();
  const best = Math.max(Number(state.crowns[puzzleId]) || 0, crowns);
  state.crowns[puzzleId] = best;
  writeJson(KIDS_STATE_KEY, state);
  return { firstCompletion, best, progress, state };
}

/**
 * Pure summary of every world: what is done, what is unlocked, and the current stop.
 * A world unlocks when the previous world's lesson was watched and, if it has puzzles,
 * at least UNLOCK_PUZZLES_NEEDED of them (or all, when fewer) were solved.
 */
export function summarizeWorlds(worlds, { watched = {}, crowns = {}, worksheets = {}, chests = {} } = {}, puzzleProgress = {}, { openAll = false } = {}) {
  const summaries = [];
  let previousOpensNext = true;
  for (const world of worlds) {
    const puzzles = world.practice?.puzzles || [];
    const completed = Array.isArray(puzzleProgress[world.practice?.id]?.completed)
      ? puzzleProgress[world.practice.id].completed.filter((index) => index >= 0 && index < puzzles.length)
      : [];
    const solved = new Set(completed).size;
    const stars = [...new Set(completed)].reduce((sum, index) => sum + (puzzles[index]?.targets.length || 0), 0);
    const crownTotal = puzzles.reduce((sum, puzzle) => sum + (Number(crowns[puzzle.id]) || 0), 0);
    const isWatched = Boolean(watched[world.id]);
    const needed = Math.min(UNLOCK_PUZZLES_NEEDED, puzzles.length);
    const opensNext = isWatched && solved >= needed;
    const mastered = isWatched && solved === puzzles.length;
    const unlocked = openAll || previousOpensNext;
    // Medals: 1 for the lesson, 2 when the unlock goal is met, 3 when every puzzle is solved.
    const medals = !isWatched ? 0 : mastered ? 3 : opensNext ? 2 : 1;
    summaries.push({
      id: world.id,
      unlocked,
      watched: isWatched,
      solved,
      total: puzzles.length,
      stars,
      crowns: crownTotal,
      maxCrowns: puzzles.length * 3,
      opensNext,
      mastered,
      medals,
      worksheetDone: Boolean(worksheets[world.id]),
      chestOpened: Boolean(chests[world.id]),
      chestReady: mastered && !chests[world.id],
      percent: puzzles.length ? Math.round(((isWatched ? 1 : 0) + solved) / (puzzles.length + 1) * 100) : isWatched ? 100 : 0,
    });
    previousOpensNext = unlocked && opensNext;
  }
  const unlockedWorlds = summaries.filter((entry) => entry.unlocked);
  const current = unlockedWorlds.find((entry) => !entry.opensNext) || unlockedWorlds[unlockedWorlds.length - 1];
  return {
    worlds: summaries,
    byId: (id) => summaries.find((entry) => entry.id === Number(id)),
    courseComplete: summaries.every((entry) => entry.mastered),
    currentId: current.id,
    totalStars: summaries.reduce((sum, entry) => sum + entry.stars, 0),
    totalCrowns: summaries.reduce((sum, entry) => sum + entry.crowns, 0),
    worldsOpened: summaries.filter((entry) => entry.opensNext).length,
  };
}
