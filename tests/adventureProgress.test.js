import test from 'node:test';
import assert from 'node:assert/strict';
import { getLearningStreak } from '../src/data/adventureProgress.js';

test('a learner with no recorded activity has no current or best streak', () => {
  assert.deepEqual(getLearningStreak([], new Date(2026, 9, 18)), { current: 0, best: 0 });
});

test('streak counts consecutive local activity days through today', () => {
  const days = ['2026-10-15', '2026-10-16', '2026-10-17', '2026-10-18'];
  assert.deepEqual(getLearningStreak(days, new Date(2026, 9, 18)), { current: 4, best: 4 });
});

test('the current streak expires after a missed day while the best streak remains', () => {
  const days = ['2026-10-14', '2026-10-15', '2026-10-17'];
  assert.deepEqual(getLearningStreak(days, new Date(2026, 9, 19)), { current: 0, best: 2 });
});
