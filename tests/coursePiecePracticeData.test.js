import test from 'node:test';
import assert from 'node:assert/strict';
import extracted from '../src/data/lichessLearnExercises.json' with { type: 'json' };
import {
  applyCoursePieceMove,
  coursePiecePracticeLessons,
  createCoursePiecePracticeGame,
  didCoursePieceMoveFail,
  getCoursePieceLegalMoves,
} from '../src/data/coursePiecePracticeData.js';

const expectedCategories = [
  ['rook', 1, 6],
  ['bishop', 2, 6],
  ['queen', 3, 5],
  ['king', 4, 3],
  ['knight', 5, 6],
  ['pawn', 6, 8],
];

test('the extracted category ids and exercise counts match Lichess Learn source order', () => {
  assert.deepEqual(coursePiecePracticeLessons.map(({ id, originalStageId, puzzles }) => [id, originalStageId, puzzles.length]), expectedCategories);
  assert.equal(extracted.extractionReport.categoriesProcessed, 6);
  assert.equal(extracted.extractionReport.totalExercises, 34);
  assert.deepEqual(extracted.extractionReport.exercisesByCategory, {
    rook: 6,
    bishop: 6,
    queen: 5,
    king: 3,
    knight: 6,
    pawn: 8,
  });
});

test('the first exercise positions and goals are copied from the original stage definitions', () => {
  const firstExercises = coursePiecePracticeLessons.map(({ id, puzzles }) => [id, puzzles[0]]);
  assert.deepEqual(firstExercises.map(([id, puzzle]) => [id, puzzle.sourceFen, puzzle.targets, puzzle.goal]), [
    ['rook', '8/8/8/8/8/8/4R3/8 w - -', ['e7'], 'Click on the rook to bring it to the star!'],
    ['bishop', '8/8/8/8/8/5B2/8/8 w - -', ['d5', 'g8'], 'Grab all the stars!'],
    ['queen', '8/8/8/8/8/8/4Q3/8 w - -', ['e5', 'b8'], 'Grab all the stars!'],
    ['king', '8/8/8/8/8/3K4/8/8 w - -', ['e6'], 'The king is slow.'],
    ['knight', '8/8/8/8/4N3/8/8/8 w - -', ['c5', 'd7'], 'Knights have a fancy way of jumping around!'],
    ['pawn', '8/8/8/P7/8/8/8/8 w - -', ['f3'], 'Pawns move one square only. But when they reach the other side of the board, they become a stronger piece!'],
  ]);
});

test('every source FEN parses without adding pieces and preserves the original side to move', () => {
  for (const lesson of coursePiecePracticeLessons) {
    for (const puzzle of lesson.puzzles) {
      const game = createCoursePiecePracticeGame(lesson, puzzle);
      assert.equal(game.activeColor, puzzle.sideToMove, puzzle.id);
      assert.equal(Object.values(game.pieces).length, [...puzzle.sourceFen.split(' ')[0]].filter((char) => /[prnbqk]/i.test(char)).length, puzzle.id);
      assert.ok(puzzle.fen.endsWith('0 1'), `${puzzle.id} should include the source defaults added by Lichess`);
    }
  }
});

test('all explicit Lichess arrow hints are legal in sequence on the exact source positions', () => {
  for (const lesson of coursePiecePracticeLessons) {
    for (const puzzle of lesson.puzzles) {
      let game = createCoursePiecePracticeGame(lesson, puzzle);
      let remaining = [...puzzle.targets];
      for (const uci of puzzle.hintMoves) {
        const from = uci.slice(0, 2);
        const to = uci.slice(2, 4);
        assert.ok(getCoursePieceLegalMoves(game, from, { ...puzzle, targets: remaining }).includes(to), `${puzzle.id}: ${uci}`);
        game = applyCoursePieceMove(game, from, to, uci[4] || 'q');
        remaining = remaining.filter((square) => square !== to);
      }
    }
  }
});

test('the original multi-star route collects targets in order and rejects an illegal move', () => {
  const lesson = coursePiecePracticeLessons.find(({ id }) => id === 'rook');
  const puzzle = lesson.puzzles[1];
  let game = createCoursePiecePracticeGame(lesson, puzzle);
  let remaining = [...puzzle.targets];

  for (const [from, to] of [['c7', 'c5'], ['c5', 'g5']]) {
    assert.ok(getCoursePieceLegalMoves(game, from, { ...puzzle, targets: remaining }).includes(to));
    game = applyCoursePieceMove(game, from, to);
    remaining = remaining.filter((square) => square !== to);
  }

  assert.deepEqual(remaining, []);
  assert.deepEqual(game.pieces.g5, { type: 'r', color: 'w' });
  assert.equal(game.moves, 2);
  assert.equal(getCoursePieceLegalMoves(createCoursePiecePracticeGame(lesson, puzzle), 'c7', puzzle).includes('b6'), false);
});

test('source pawn failure assertions remain active', () => {
  const lesson = coursePiecePracticeLessons.find(({ id }) => id === 'pawn');
  const puzzle = lesson.puzzles[6];
  const initial = createCoursePiecePracticeGame(lesson, puzzle);
  const wrongMove = applyCoursePieceMove(initial, 'e2', 'e3');

  assert.equal(didCoursePieceMoveFail(wrongMove, puzzle), true);
});
