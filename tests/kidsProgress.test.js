import test from 'node:test';
import assert from 'node:assert/strict';
import { kidsWorlds } from '../src/kids/kidsWorlds.js';
import { crownsFor, summarizeWorlds } from '../src/kids/kidsProgress.js';
import { kidsFilms } from '../src/kids/kidsFilms.js';

test('Course 1 is the six syllabus days in order: Rook, Bishop, Queen, King, Knight, Pawn', () => {
  assert.equal(kidsWorlds.length, 6);
  assert.deepEqual(kidsWorlds.map((world) => world.id), [1, 2, 3, 4, 6, 5]);
  assert.deepEqual(kidsWorlds.map((world) => world.day), [1, 2, 3, 4, 5, 6]);
  assert.equal(kidsWorlds[0].videoLessonId, 'u1-l1');
  assert.equal(kidsWorlds[0].practiceLessonId, 'u1-l2');
  assert.deepEqual(kidsWorlds.map((world) => world.practice.id), ['rook', 'bishop', 'queen', 'king', 'knight', 'pawn']);
});

test('without openAll, only the first day is open for a new learner', () => {
  const summary = summarizeWorlds(kidsWorlds, {}, {});
  assert.deepEqual(summary.worlds.map((world) => world.unlocked), [true, false, false, false, false, false]);
  assert.equal(summary.currentId, 1);
  assert.equal(summary.totalStars, 0);
});

test('with openAll every day is open from the start', () => {
  const summary = summarizeWorlds(kidsWorlds, {}, {}, { openAll: true });
  assert.ok(summary.worlds.every((world) => world.unlocked));
  assert.equal(summary.currentId, 1);
  assert.equal(summary.courseComplete, false);
});

test('the next day opens after the lesson and three solved puzzles', () => {
  const almost = summarizeWorlds(kidsWorlds, { watched: { 1: true } }, { rook: { completed: [0, 1] } });
  assert.equal(almost.worlds[1].unlocked, false);
  assert.equal(almost.worlds[0].medals, 1);
  const open = summarizeWorlds(kidsWorlds, { watched: { 1: true } }, { rook: { completed: [0, 1, 2] } });
  assert.equal(open.worlds[1].unlocked, true);
  assert.equal(open.worlds[0].medals, 2);
  assert.equal(open.currentId, 2);
  assert.equal(open.totalStars, 1 + 2 + 3);
});

test('watching alone is not enough when a day has puzzles', () => {
  const summary = summarizeWorlds(kidsWorlds, { watched: { 1: true, 2: true } }, {});
  assert.equal(summary.worlds[1].unlocked, false);
});

test('byId finds reordered days, and finishing all six completes the course', () => {
  const watched = Object.fromEntries(kidsWorlds.map((world) => [world.id, true]));
  const progress = Object.fromEntries(kidsWorlds.map((world) => [world.practice.id, { completed: world.practice.puzzles.map((_, index) => index) }]));
  const summary = summarizeWorlds(kidsWorlds, { watched }, progress, { openAll: true });
  assert.ok(summary.worlds.every((world) => world.unlocked && world.mastered && world.medals === 3));
  assert.equal(summary.byId(5).id, 5);
  assert.equal(summary.byId(6).id, 6);
  assert.equal(summary.courseComplete, true);
});

test('invalid stored puzzle indexes are ignored', () => {
  const summary = summarizeWorlds(kidsWorlds, { watched: { 1: true } }, { rook: { completed: [0, 0, 99, -1] } });
  assert.equal(summary.worlds[0].solved, 1);
});

test('crowns reward solving within the target move count', () => {
  assert.equal(crownsFor(2, 2), 3);
  assert.equal(crownsFor(4, 2), 2);
  assert.equal(crownsFor(5, 2), 1);
});

test('every world has an animated lesson with valid squares and pieces', () => {
  const square = /^[a-h][1-8]$/;
  for (const world of kidsWorlds) {
    const film = kidsFilms[world.id];
    assert.ok(film?.length >= 3, `world ${world.id} needs a film`);
    for (const scene of film) {
      assert.ok(scene.caption.length > 5);
      const squares = new Set();
      for (const piece of scene.pieces) {
        assert.match(piece.sq, square);
        assert.match(piece.p, /^[wb][KQRBNP]$/);
        assert.ok(!squares.has(piece.sq), `two pieces share ${piece.sq} in world ${world.id}`);
        squares.add(piece.sq);
      }
      for (const sq of scene.highlight || []) assert.match(sq, square);
      for (const [from, to] of scene.arrows || []) { assert.match(from, square); assert.match(to, square); }
    }
  }
});

test('a newly opened world is celebrated once, and existing players get no replay', async () => {
  const { pickUnlockToCelebrate } = await import('../src/kids/kidsProgress.js');
  const worlds = [{ id: 1, unlocked: true }, { id: 2, unlocked: true }, { id: 3, unlocked: false }];
  assert.deepEqual(pickUnlockToCelebrate(worlds, null), { celebrate: null, seenOpen: [1, 2] });
  assert.deepEqual(pickUnlockToCelebrate(worlds, [1]), { celebrate: 2, seenOpen: [1, 2] });
  assert.deepEqual(pickUnlockToCelebrate(worlds, [1, 2]), { celebrate: null, seenOpen: [1, 2] });
});

test('motion tier follows reduced-motion, overrides and low-end hints', async () => {
  const { decideMotionTier } = await import('../src/kids/kidsMotion.js');
  assert.equal(decideMotionTier({ cores: 8, memory: 8 }), 'full');
  assert.equal(decideMotionTier({ prefersReduced: true, cores: 8, memory: 8 }), 'reduced');
  assert.equal(decideMotionTier({ cores: 4, memory: 4 }), 'lite');
  assert.equal(decideMotionTier({ cores: 2 }), 'lite');
  assert.equal(decideMotionTier({ saveData: true, cores: 8 }), 'lite');
  assert.equal(decideMotionTier({ cores: 8, memory: 8, override: 'reduced' }), 'reduced');
  assert.equal(decideMotionTier({ prefersReduced: true, override: 'full' }), 'full');
});
