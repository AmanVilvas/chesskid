import { forwardRef, useId } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CourseChessPiece } from '../components/CourseChessPiece';

export const FILES = 'abcdefgh';
export const pieceNames = { k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn' };
const coords = (square) => ({ x: FILES.indexOf(square[0]), y: 8 - Number(square[1]) });

export function GoldStar({ className = '' }) {
  const id = useId().replaceAll(':', '');
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2=".7" y2="1">
          <stop offset="0" stopColor="#FFF0A8" />
          <stop offset=".5" stopColor="#F5C65D" />
          <stop offset="1" stopColor="#E59A2B" />
        </linearGradient>
      </defs>
      <path d="m50 6 13 27.5 30 3.6-22 20.6 5.8 29.8L50 72.8 23.2 87.5 29 57.7 7 37.1l30-3.6Z" fill={`url(#g${id})`} stroke="#B9741A" strokeWidth="4" strokeLinejoin="round" />
      <path d="M38 38 Q44 26 50 20" fill="none" stroke="#fff" strokeOpacity=".75" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Presentational board shared by the animated lessons and the puzzles.
 * pieces: [{ id, type, color, sq }]
 */
export const KidsBoard = forwardRef(function KidsBoard({
  pieces,
  stars = [],
  highlight = [],
  legal = [],
  selected = '',
  lastMove = null,
  burst = '',
  shake = '',
  arrows = [],
  focusSquare = '',
  drag = null,
  label = 'Chess board',
  dim = false,
  interactive = false,
  boardProps = {},
  onSquareFocus,
  children,
}, ref) {
  const reduce = useReducedMotion();
  const occupied = new Map(pieces.map((piece) => [piece.sq, piece]));
  const arrowId = useId().replaceAll(':', '');

  return (
    <div className={`kb-frame ${dim ? 'kb-dim' : ''}`}>
      <div
        ref={ref}
        className={`kb-board ${interactive ? 'kb-interactive' : ''}`}
        role="grid"
        aria-label={label}
        {...boardProps}
      >
        {Array.from({ length: 64 }, (_, index) => {
          const x = index % 8;
          const rank = 8 - Math.floor(index / 8);
          const square = `${FILES[x]}${rank}`;
          const piece = occupied.get(square);
          const dark = (x + rank) % 2 === 1;
          const isStar = stars.includes(square);
          const classes = [
            'kb-square', dark ? 'dark' : 'light',
            highlight.includes(square) ? 'glow' : '',
            selected === square ? 'selected' : '',
            lastMove && (lastMove.from === square || lastMove.to === square) ? 'last' : '',
            shake === square ? 'nope' : '',
          ].filter(Boolean).join(' ');
          return (
            <div
              key={square}
              data-square={square}
              className={classes}
              role="gridcell"
              aria-label={`${square}${piece ? `, ${piece.color === 'w' ? 'white' : 'black'} ${pieceNames[piece.type]}` : ''}${isStar ? ', star' : ''}${legal.includes(square) ? ', you can move here' : ''}`}
              aria-selected={selected === square}
              tabIndex={interactive ? (focusSquare === square ? 0 : -1) : undefined}
              onFocus={interactive ? () => onSquareFocus?.(square) : undefined}
            >
              {isStar && (
                <motion.span
                  className="kb-star"
                  initial={reduce ? false : { scale: 0, rotate: -40 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 18, delay: reduce ? 0 : 0.06 * stars.indexOf(square) }}
                >
                  <GoldStar className="kb-star-svg" />
                </motion.span>
              )}
              {legal.includes(square) && <span className={`kb-legal ${piece || isStar ? 'kb-legal-ring' : ''}`} />}
              {x === 0 && <i className="kb-rank">{rank}</i>}
              {rank === 1 && <i className="kb-file">{FILES[x]}</i>}
            </div>
          );
        })}

        {arrows.length > 0 && (
          <svg className="kb-arrows" viewBox="0 0 8 8" aria-hidden="true">
            <defs>
              <marker id={`a${arrowId}`} markerWidth="4" markerHeight="4" refX="2.4" refY="2" orient="auto">
                <path d="M0,0 L4,2 L0,4 Z" fill="#2F6B52" />
              </marker>
            </defs>
            {arrows.map(([from, to], i) => {
              const a = coords(from);
              const b = coords(to);
              return (
                <motion.line
                  key={`${from}${to}${i}`}
                  x1={a.x + 0.5} y1={a.y + 0.5} x2={b.x + 0.5} y2={b.y + 0.5}
                  markerEnd={`url(#a${arrowId})`}
                  initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.85 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              );
            })}
          </svg>
        )}

        <div className="kb-pieces" aria-hidden="true">
          <AnimatePresence initial={false}>
            {pieces.map((piece) => {
              const dragging = drag && drag.id === piece.id;
              const { x, y } = coords(piece.sq);
              // Positioned with transforms (percent of the piece's own size = one square),
              // so moves never trigger layout. Drag positions arrive as percent of the board.
              const tx = dragging ? drag.x * 8 : x * 100;
              const ty = dragging ? drag.y * 8 : y * 100;
              return (
                <motion.div
                  key={piece.id}
                  className={`kb-piece ${piece.color === 'b' ? 'kb-black' : ''} ${dragging ? 'kb-dragging' : ''} ${selected === piece.sq ? 'kb-lifted' : ''}`}
                  initial={reduce ? false : { x: `${tx}%`, y: `${ty}%`, scale: 0.4, opacity: 0 }}
                  animate={{ x: `${tx}%`, y: `${ty}%`, scale: dragging ? 1.18 : 1, opacity: 1 }}
                  exit={{ scale: 0.2, opacity: 0, transition: { duration: 0.22 } }}
                  transition={dragging || reduce ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 34, mass: 0.7 }}
                >
                  <span className="kb-piece-shadow" />
                  <CourseChessPiece type={piece.type} color={piece.color} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {burst && (
            <motion.div
              key={burst}
              className="kb-burst"
              style={{ left: 0, top: 0, translate: `${coords(burst).x * 100}% ${coords(burst).y * 100}%` }}
              initial={{ scale: 0.4, opacity: 1 }}
              animate={{ scale: 2.4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <GoldStar className="kb-star-svg" />
            </motion.div>
          )}
        </AnimatePresence>
        {children}
      </div>
    </div>
  );
});
