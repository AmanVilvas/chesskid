// Animated "cartoon" lessons for Kids World. These stand in for lesson videos until real
// animated videos exist. Each scene is a keyframe: pieces keep their `id`, so a piece whose
// square changes between scenes glides to its new square.
const files = 'abcdefgh';
const at = (f, r) => (f >= 0 && f < 8 && r >= 1 && r <= 8 ? `${files[f]}${r}` : null);
const parse = (sq) => [files.indexOf(sq[0]), Number(sq[1])];

function ray(from, directions) {
  const [f, r] = parse(from);
  const out = [];
  for (const [df, dr] of directions) {
    for (let step = 1; step < 8; step += 1) {
      const sq = at(f + df * step, r + dr * step);
      if (!sq) break;
      out.push(sq);
    }
  }
  return out;
}
const straight = (sq) => ray(sq, [[1, 0], [-1, 0], [0, 1], [0, -1]]);
const diagonal = (sq) => ray(sq, [[1, 1], [1, -1], [-1, 1], [-1, -1]]);
const around = (sq) => {
  const [f, r] = parse(sq);
  const out = [];
  for (let df = -1; df <= 1; df += 1) for (let dr = -1; dr <= 1; dr += 1) if (df || dr) out.push(at(f + df, r + dr));
  return out.filter(Boolean);
};
const jumps = (sq) => {
  const [f, r] = parse(sq);
  return [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]].map(([df, dr]) => at(f + df, r + dr)).filter(Boolean);
};
const between = (from, to) => {
  const [f1, r1] = parse(from);
  const [f2, r2] = parse(to);
  const df = Math.sign(f2 - f1);
  const dr = Math.sign(r2 - r1);
  const out = [];
  let f = f1 + df;
  let r = r1 + dr;
  while (f !== f2 || r !== r2) { out.push(at(f, r)); f += df; r += dr; }
  return out;
};

export const kidsFilms = {
  1: [
    { pieces: [{ id: 'r', p: 'wR', sq: 'd4' }], caption: 'This is the Rook. It guards Rook Castle!', mood: 'wave' },
    { pieces: [{ id: 'r', p: 'wR', sq: 'd4' }], highlight: straight('d4'), caption: 'The rook moves in straight lines.' },
    { pieces: [{ id: 'r', p: 'wR', sq: 'd8' }], highlight: between('d4', 'd8').concat('d8'), caption: 'Zoom! All the way up…', mood: 'happy' },
    { pieces: [{ id: 'r', p: 'wR', sq: 'a8' }], highlight: ['c8', 'b8', 'a8'], caption: '…and all the way across!' },
    { pieces: [{ id: 'r', p: 'wR', sq: 'd4' }, { id: 'f', p: 'wP', sq: 'd6' }], highlight: ['d5'], arrows: [['d4', 'd5']], caption: 'It cannot jump over a friend. It stops right before.', mood: 'think' },
    { pieces: [{ id: 'r', p: 'wR', sq: 'd4' }], stars: ['d7', 'g4'], caption: 'Now it is your turn. Catch the stars!', mood: 'cheer' },
  ],
  2: [
    { pieces: [{ id: 'b', p: 'wB', sq: 'c1' }], caption: 'Hello, Bishop! It lives in Bishop Forest.', mood: 'wave' },
    { pieces: [{ id: 'b', p: 'wB', sq: 'c1' }], highlight: diagonal('c1'), caption: 'The bishop slides on slanty lines called diagonals.' },
    { pieces: [{ id: 'b', p: 'wB', sq: 'h6' }], highlight: between('c1', 'h6').concat('h6'), caption: 'Swoosh! All the way along the diagonal.', mood: 'happy' },
    { pieces: [{ id: 'b', p: 'wB', sq: 'f8' }], highlight: ['g7', 'f8'], caption: 'It can turn and slide another way.' },
    { pieces: [{ id: 'b', p: 'wB', sq: 'f8' }], highlight: diagonal('f8'), caption: 'A bishop on a dark square stays on dark squares forever!', mood: 'think' },
    { pieces: [{ id: 'b', p: 'wB', sq: 'f8' }], stars: ['b4', 'h6'], caption: 'Your turn. Slide to the stars!', mood: 'cheer' },
  ],
  3: [
    { pieces: [{ id: 'q', p: 'wQ', sq: 'd4' }], caption: 'This is the Queen, the strongest piece of all!', mood: 'wave' },
    { pieces: [{ id: 'q', p: 'wQ', sq: 'd4' }], highlight: straight('d4'), caption: 'She moves in straight lines, like a rook…' },
    { pieces: [{ id: 'q', p: 'wQ', sq: 'd4' }], highlight: diagonal('d4'), caption: '…and on slanty lines, like a bishop!', mood: 'happy' },
    { pieces: [{ id: 'q', p: 'wQ', sq: 'd8' }], highlight: between('d4', 'd8').concat('d8'), caption: 'Straight up she goes!' },
    { pieces: [{ id: 'q', p: 'wQ', sq: 'h4' }], highlight: between('d8', 'h4').concat('h4'), caption: 'Then down a diagonal. Wheee!', mood: 'happy' },
    { pieces: [{ id: 'q', p: 'wQ', sq: 'h4' }], stars: ['b4', 'e7'], caption: 'Your turn. Fly to the stars!', mood: 'cheer' },
  ],
  4: [
    { pieces: [{ id: 'k', p: 'wK', sq: 'e4' }], caption: 'The King is the most important piece.', mood: 'wave' },
    { pieces: [{ id: 'k', p: 'wK', sq: 'e4' }], highlight: around('e4'), caption: 'He takes one small step, in any direction.' },
    { pieces: [{ id: 'k', p: 'wK', sq: 'f5' }], highlight: ['f5'], caption: 'Step! Just one square.', mood: 'happy' },
    { pieces: [{ id: 'k', p: 'wK', sq: 'e6' }], highlight: ['e6'], caption: 'Step again!' },
    { pieces: [{ id: 'k', p: 'wK', sq: 'e6' }], stars: ['d6', 'f7'], caption: 'Slow and careful keeps the king safe. Your turn!', mood: 'cheer' },
  ],
  5: [
    { pieces: [{ id: 'p', p: 'wP', sq: 'e2' }], caption: 'Meet the Pawn. That is me, Pip!', mood: 'wave' },
    { pieces: [{ id: 'p', p: 'wP', sq: 'e4' }], highlight: ['e3', 'e4'], caption: 'On its very first move, a pawn may hop two squares.', mood: 'happy' },
    { pieces: [{ id: 'p', p: 'wP', sq: 'e5' }], highlight: ['e5'], caption: 'After that, one step forward at a time.' },
    { pieces: [{ id: 'p', p: 'wP', sq: 'e5' }, { id: 'n', p: 'bN', sq: 'd6' }], highlight: ['d6'], arrows: [['e5', 'd6']], caption: 'Pawns capture on a slant, one square forward.', mood: 'think' },
    { pieces: [{ id: 'p', p: 'wP', sq: 'd6' }], highlight: ['d6'], caption: 'Gotcha!', mood: 'happy' },
    { pieces: [{ id: 'p2', p: 'wP', sq: 'a7' }], highlight: ['a8'], arrows: [['a7', 'a8']], caption: 'When a pawn reaches the far side…' },
    { pieces: [{ id: 'p2', p: 'wQ', sq: 'a8' }], highlight: ['a8'], caption: '…it becomes a Queen! That is my big dream.', mood: 'cheer' },
  ],
  6: [
    { pieces: [{ id: 'n', p: 'wN', sq: 'd4' }], caption: 'The Knight is a jumpy horse!', mood: 'wave' },
    { pieces: [{ id: 'n', p: 'wN', sq: 'd4' }], highlight: jumps('d4'), caption: 'It moves in an L. Two steps, then one to the side.' },
    { pieces: [{ id: 'n', p: 'wN', sq: 'f5' }], highlight: ['f5'], arrows: [['d4', 'f5']], caption: 'Hop! Two across, then one up.', mood: 'happy' },
    { pieces: [{ id: 'n', p: 'wN', sq: 'g3' }], highlight: ['g3'], arrows: [['f5', 'g3']], caption: 'Hop again!' },
    { pieces: [{ id: 'n2', p: 'wN', sq: 'g1' }, { id: 'a', p: 'wP', sq: 'f2' }, { id: 'b', p: 'wP', sq: 'g2' }, { id: 'c', p: 'wP', sq: 'h2' }], caption: 'Knights are the only pieces that jump over others.', mood: 'think' },
    { pieces: [{ id: 'n2', p: 'wN', sq: 'f3' }, { id: 'a', p: 'wP', sq: 'f2' }, { id: 'b', p: 'wP', sq: 'g2' }, { id: 'c', p: 'wP', sq: 'h2' }], highlight: ['f3'], caption: 'Boing! Right over the pawns.', mood: 'cheer' },
  ],
  7: [
    { pieces: [{ id: 'bk', p: 'bK', sq: 'e8' }, { id: 'wr', p: 'wR', sq: 'a1' }, { id: 'wk', p: 'wK', sq: 'g1' }], caption: 'When a piece attacks the King, we say CHECK!', mood: 'wave' },
    { pieces: [{ id: 'bk', p: 'bK', sq: 'e8' }, { id: 'wr', p: 'wR', sq: 'e1' }, { id: 'wk', p: 'wK', sq: 'g1' }], highlight: between('e1', 'e8').concat('e8'), arrows: [['e1', 'e8']], caption: 'The rook looks right at the king. Check!', mood: 'think' },
    { pieces: [{ id: 'bk', p: 'bK', sq: 'd7' }, { id: 'wr', p: 'wR', sq: 'e1' }, { id: 'wk', p: 'wK', sq: 'g1' }], highlight: ['d7'], caption: 'The king must escape. He steps out of the way!', mood: 'happy' },
    { pieces: [{ id: 'bk', p: 'bK', sq: 'd7' }, { id: 'wr', p: 'wR', sq: 'e1' }, { id: 'wk', p: 'wK', sq: 'g1' }], caption: 'Three ways out of check: run, block, or capture!', mood: 'cheer' },
  ],
  8: [
    { pieces: [{ id: 'bk', p: 'bK', sq: 'g8' }, { id: 'f', p: 'bP', sq: 'f7' }, { id: 'g', p: 'bP', sq: 'g7' }, { id: 'h', p: 'bP', sq: 'h7' }, { id: 'wr', p: 'wR', sq: 'a1' }, { id: 'wk', p: 'wK', sq: 'g1' }], caption: 'Checkmate means the king is attacked and cannot escape.', mood: 'wave' },
    { pieces: [{ id: 'bk', p: 'bK', sq: 'g8' }, { id: 'f', p: 'bP', sq: 'f7' }, { id: 'g', p: 'bP', sq: 'g7' }, { id: 'h', p: 'bP', sq: 'h7' }, { id: 'wr', p: 'wR', sq: 'a8' }, { id: 'wk', p: 'wK', sq: 'g1' }], highlight: between('a8', 'g8').concat('g8'), arrows: [['a8', 'g8']], caption: 'The rook zooms to the back row. Check!', mood: 'think' },
    { pieces: [{ id: 'bk', p: 'bK', sq: 'g8' }, { id: 'f', p: 'bP', sq: 'f7' }, { id: 'g', p: 'bP', sq: 'g7' }, { id: 'h', p: 'bP', sq: 'h7' }, { id: 'wr', p: 'wR', sq: 'a8' }, { id: 'wk', p: 'wK', sq: 'g1' }], highlight: ['f8', 'h8', 'f7', 'g7', 'h7'], caption: 'His own pawns block every escape. CHECKMATE! The game is won.', mood: 'cheer' },
  ],
  9: [
    { pieces: [{ id: 'bk', p: 'bK', sq: 'a8' }, { id: 'wq', p: 'wQ', sq: 'b1' }, { id: 'wk', p: 'wK', sq: 'e2' }], caption: 'Stalemate is a sneaky trap. Let us see it.', mood: 'wave' },
    { pieces: [{ id: 'bk', p: 'bK', sq: 'a8' }, { id: 'wq', p: 'wQ', sq: 'b6' }, { id: 'wk', p: 'wK', sq: 'e2' }], caption: 'The queen moves up. The king is NOT in check…', mood: 'think' },
    { pieces: [{ id: 'bk', p: 'bK', sq: 'a8' }, { id: 'wq', p: 'wQ', sq: 'b6' }, { id: 'wk', p: 'wK', sq: 'e2' }], highlight: ['a7', 'b7', 'b8'], caption: '…but every square around him is guarded.' },
    { pieces: [{ id: 'bk', p: 'bK', sq: 'a8' }, { id: 'wq', p: 'wQ', sq: 'b6' }, { id: 'wk', p: 'wK', sq: 'e2' }], caption: 'He cannot move, so it is a draw. Always leave the king a square!', mood: 'oops' },
  ],
  10: [
    { pieces: [{ id: 'bk', p: 'bK', sq: 'e8' }, { id: 'wk', p: 'wK', sq: 'e6' }, { id: 'wq', p: 'wQ', sq: 'a3' }], caption: 'Checkmate is easier with a team!', mood: 'wave' },
    { pieces: [{ id: 'bk', p: 'bK', sq: 'e8' }, { id: 'wk', p: 'wK', sq: 'e6' }, { id: 'wq', p: 'wQ', sq: 'e7' }], highlight: between('a3', 'e7').concat('e7'), caption: 'The queen lands right next to the king. Check!', mood: 'think' },
    { pieces: [{ id: 'bk', p: 'bK', sq: 'e8' }, { id: 'wk', p: 'wK', sq: 'e6' }, { id: 'wq', p: 'wQ', sq: 'e7' }], highlight: ['e7'], arrows: [['e6', 'e7']], caption: 'Her king protects her, so she cannot be captured. Checkmate!', mood: 'cheer' },
  ],
  11: [
    { pieces: [{ id: 'bk', p: 'bK', sq: 'h8' }, { id: 'wk', p: 'wK', sq: 'g6' }, { id: 'wq', p: 'wQ', sq: 'a7' }], caption: 'The King and Queen can win together.', mood: 'wave' },
    { pieces: [{ id: 'bk', p: 'bK', sq: 'h8' }, { id: 'wk', p: 'wK', sq: 'g6' }, { id: 'wq', p: 'wQ', sq: 'a7' }], highlight: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8'], caption: 'First, push the lonely king to the edge of the board.', mood: 'think' },
    { pieces: [{ id: 'bk', p: 'bK', sq: 'h8' }, { id: 'wk', p: 'wK', sq: 'g6' }, { id: 'wq', p: 'wQ', sq: 'a7' }], highlight: ['g6'], caption: 'Bring your own king close to help.' },
    { pieces: [{ id: 'bk', p: 'bK', sq: 'h8' }, { id: 'wk', p: 'wK', sq: 'g6' }, { id: 'wq', p: 'wQ', sq: 'g7' }], highlight: between('a7', 'g7').concat('g7'), caption: 'Then the queen lands next to the king. Checkmate!', mood: 'happy' },
    { pieces: [{ id: 'bk', p: 'bK', sq: 'h8' }, { id: 'wk', p: 'wK', sq: 'g6' }, { id: 'wq', p: 'wQ', sq: 'g7' }], caption: 'You reached Crown Summit. What a climb!', mood: 'cheer' },
  ],
};
