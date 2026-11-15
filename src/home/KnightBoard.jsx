import { useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Star } from 'lucide-react';
import { CourseChessPiece } from '../components/CourseChessPiece';

/* ---------------------------------------------------------------- hero board */
const SIZE = 5;
const START = { r: 2, c: 2 };
const STARS = [{ r: 0, c: 1 }, { r: 1, c: 3 }, { r: 3, c: 4 }];
const HOPS = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
const key = (p) => `${p.r}-${p.c}`;
const FILES = 'abcde';

export function KnightBoard() {
  const [knight, setKnight] = useState(START);
  const [left, setLeft] = useState(() => new Set(STARS.map(key)));
  const [moves, setMoves] = useState(0);
  const won = left.size === 0;
  const legal = new Set(won ? [] : HOPS.map(([dr, dc]) => ({ r: knight.r + dr, c: knight.c + dc })).filter((p) => p.r >= 0 && p.r < SIZE && p.c >= 0 && p.c < SIZE).map(key));
  const hop = (p) => {
    if (!legal.has(key(p))) return;
    setKnight(p);
    setMoves((m) => m + 1);
    setLeft((prev) => { const next = new Set(prev); next.delete(key(p)); return next; });
  };
  const reset = () => { setKnight(START); setLeft(new Set(STARS.map(key))); setMoves(0); };
  const cell = 100 / SIZE;

  return (
    <div className="ah-board-card">
      <div className="ah-board-head">
        <span className="ah-sticker">Try it</span>
        <p><b>Hop the knight</b> to grab all 3 stars. It jumps in an L.</p>
      </div>
      <div className="ah-board" role="grid" aria-label="Knight puzzle board">
        {Array.from({ length: SIZE * SIZE }, (_, i) => {
          const p = { r: Math.floor(i / SIZE), c: i % SIZE };
          const k = key(p);
          const isLegal = legal.has(k);
          return (
            <button key={k} type="button" role="gridcell" className={`ah-sq ${(p.r + p.c) % 2 ? 'is-dark' : ''} ${isLegal ? 'is-legal' : ''}`}
              onClick={() => hop(p)} disabled={!isLegal} aria-label={`${FILES[p.c]}${SIZE - p.r}${left.has(k) ? ', star' : ''}${isLegal ? ', knight can jump here' : ''}`}>
              {left.has(k) && <motion.span className="ah-star" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Star size={22} fill="currentColor" /></motion.span>}
            </button>
          );
        })}
        <motion.div className="ah-knight" aria-hidden="true" animate={{ left: `${knight.c * cell}%`, top: `${knight.r * cell}%` }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }} style={{ width: `${cell}%`, height: `${cell}%` }}>
          <motion.span key={moves} initial={{ y: 0 }} animate={{ y: [0, -18, 0] }} transition={{ duration: 0.45 }}><CourseChessPiece type="n" color="w" /></motion.span>
        </motion.div>
      </div>
      <div className="ah-board-foot" aria-live="polite">
        <span className="ah-pips">{STARS.map((s) => <Star key={key(s)} size={16} className={left.has(key(s)) ? '' : 'is-got'} fill="currentColor" />)}</span>
        {won
          ? <span className="ah-won">Done in {moves} hops! That’s a real Day 5 puzzle.</span>
          : <span>{moves === 0 ? 'Tap a glowing square' : `${moves} ${moves === 1 ? 'hop' : 'hops'}`}</span>}
        <button type="button" className="ah-reset" onClick={reset} aria-label="Reset the puzzle"><RotateCcw size={15} /></button>
      </div>
    </div>
  );
}
