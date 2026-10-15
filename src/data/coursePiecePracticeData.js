import extractedLessons from './lichessLearnExercises.json' with { type: 'json' };

export const coursePiecePracticeLessons = extractedLessons.categories.map((category) => ({
  id: category.id,
  originalStageId: category.originalStageId,
  name: category.title,
  type: category.pieceCode,
  color: '#328dd1',
  rule: category.subtitle,
  intro: category.intro,
  complete: category.complete,
  emptyApples: category.exercises.every((exercise) => exercise.emptyApples),
  puzzles: category.exercises.map((exercise) => ({
    ...exercise,
    title: exercise.goal,
    targets: exercise.apples,
    prompt: exercise.goal,
  })),
}));

export function createCoursePiecePracticeGame(lesson, puzzle) {
  const [placement, activeColor = 'w'] = puzzle.fen.split(' ');
  const pieces = {};
  const ranks = placement.split('/');

  if (ranks.length !== 8) throw new Error(`Invalid FEN board for ${puzzle.id}`);

  ranks.forEach((row, rowIndex) => {
    let file = 0;
    const rank = 8 - rowIndex;
    for (const cell of row) {
      if (/\d/.test(cell)) {
        file += Number(cell);
        continue;
      }
      const square = `${'abcdefgh'[file]}${rank}`;
      pieces[square] = {
        type: cell.toLowerCase(),
        color: cell === cell.toUpperCase() ? 'w' : 'b',
      };
      file += 1;
    }
    if (file !== 8) throw new Error(`Invalid FEN rank in ${puzzle.id}`);
  });

  return { pieces, activeColor, moves: 0 };
}

const files = 'abcdefgh';
const rankOf = (square) => Number(square[1]);
const fileOf = (square) => files.indexOf(square[0]);
const squareAt = (file, rank) => file >= 0 && file < 8 && rank >= 1 && rank <= 8 ? `${files[file]}${rank}` : null;

export function getCoursePieceLegalMoves(game, from, puzzle) {
  const piece = game.pieces[from];
  if (!piece || piece.color !== game.activeColor) return [];

  const file = fileOf(from);
  const rank = rankOf(from);
  const remainingStars = new Set(puzzle.targets);
  const starBlocks = !puzzle.emptyApples;
  const isBlocked = (square) => !!game.pieces[square] || (starBlocks && remainingStars.has(square));
  const canLand = (square) => {
    const occupant = game.pieces[square];
    if (occupant?.color === piece.color) return false;
    if (starBlocks && remainingStars.has(square)) return true;
    return !occupant || occupant.color !== piece.color;
  };
  const destinations = new Set();

  const addStep = (dx, dy) => {
    const square = squareAt(file + dx, rank + dy);
    if (square && canLand(square)) destinations.add(square);
  };

  if (piece.type === 'n') {
    for (const [dx, dy] of [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]]) addStep(dx, dy);
  } else if (piece.type === 'k') {
    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) if (dx || dy) addStep(dx, dy);
    }
  } else if (piece.type === 'p') {
    const direction = piece.color === 'w' ? 1 : -1;
    const one = squareAt(file, rank + direction);
    if (one && !isBlocked(one)) {
      destinations.add(one);
      const startingRank = piece.color === 'w' ? 2 : 7;
      const two = squareAt(file, rank + 2 * direction);
      if (rank === startingRank && two && !isBlocked(two)) destinations.add(two);
    }
    for (const dx of [-1, 1]) {
      const target = squareAt(file + dx, rank + direction);
      if (!target) continue;
      const occupant = game.pieces[target];
      if ((starBlocks && remainingStars.has(target)) || (occupant && occupant.color !== piece.color)) destinations.add(target);
    }
  } else {
    const directions = [];
    if (piece.type === 'r' || piece.type === 'q') directions.push([1, 0], [-1, 0], [0, 1], [0, -1]);
    if (piece.type === 'b' || piece.type === 'q') directions.push([1, 1], [1, -1], [-1, 1], [-1, -1]);
    for (const [dx, dy] of directions) {
      for (let step = 1; step < 8; step += 1) {
        const target = squareAt(file + dx * step, rank + dy * step);
        if (!target) break;
        if (game.pieces[target]) {
          if (game.pieces[target].color !== piece.color) destinations.add(target);
          break;
        }
        if (starBlocks && remainingStars.has(target)) {
          destinations.add(target);
          break;
        }
        destinations.add(target);
      }
    }
  }

  return [...destinations];
}

export function applyCoursePieceMove(game, from, to, promotion = 'q') {
  const moving = game.pieces[from];
  if (!moving) return game;
  const pieces = { ...game.pieces };
  delete pieces[from];
  pieces[to] = {
    ...moving,
    type: moving.type === 'p' && (to.endsWith('8') || to.endsWith('1')) ? promotion : moving.type,
  };
  return { ...game, pieces, moves: game.moves + 1 };
}

export function didCoursePieceMoveFail(game, puzzle) {
  const rule = puzzle.failureRule;
  if (!rule) return false;
  if (rule.type === 'whitePawnOnAnyOf') {
    return rule.squares.some((square) => game.pieces[square]?.type === 'p' && game.pieces[square]?.color === 'w');
  }
  if (rule.type === 'noPieceOn') {
    const occupied = [...Object.keys(game.pieces), ...(puzzle.emptyApples ? [] : puzzle.targets)];
    return occupied.some((square) => !rule.squares.includes(square));
  }
  return false;
}
