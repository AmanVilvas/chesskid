import { motion, useReducedMotion } from 'motion/react';

// The Chess Crew: an original family of chess characters. Flat shapes, no outlines, one face
// language (oval eyes, rosy cheeks, tiny smile) so every character feels like the same world.
export const CREW = {
  pawn: { name: 'Pip', piece: 'Pawn', color: '#FF9F43', shade: '#EE8526', light: '#FFC58C', blurb: 'Small steps, big dreams. Pip wants to become a queen!' },
  rook: { name: 'Rocco', piece: 'Rook', color: '#FF6B6B', shade: '#E65454', light: '#FFA3A3', blurb: 'Steady and strong. Rocco loves a straight road.' },
  bishop: { name: 'Bea', piece: 'Bishop', color: '#9B7BF7', shade: '#8263EA', light: '#C6B4FF', blurb: 'Bea glides on slanty paths and never changes colour.' },
  queen: { name: 'Queenie', piece: 'Queen', color: '#FF7EB6', shade: '#EE609E', light: '#FFB6D6', blurb: 'Queenie can go straight or slanty. Super powerful!' },
  king: { name: 'King Kip', piece: 'King', color: '#33C481', shade: '#25AA6D', light: '#86E2B6', blurb: 'One careful step at a time keeps King Kip safe.' },
  knight: { name: 'Kit', piece: 'Knight', color: '#2DA8F0', shade: '#1B8FD4', light: '#8FD3FA', blurb: 'Kit hops in an L and jumps over everyone.' },
};

const INK = '#2E3135';
const CHEEK = '#FF8FA3';

const moves = {
  idle: { y: 0, rotate: 0, transition: { duration: 0.2 } },
  wave: { y: [0, -6, 0], transition: { duration: 0.5, ease: 'easeOut' } },
  happy: { y: [0, -14, 0, -5, 0], transition: { duration: 0.65, ease: 'easeOut' } },
  cheer: { y: [0, -18, 0], rotate: [0, -5, 5, 0], transition: { duration: 0.75, repeat: 1, repeatDelay: 0.4 } },
  think: { rotate: -6, transition: { type: 'spring', stiffness: 220, damping: 14 } },
  oops: { x: [0, -5, 5, -3, 3, 0], transition: { duration: 0.45 } },
  sleep: { y: 0 },
};

function Face({ cx, cy, mood, s = 1 }) {
  const happy = mood === 'happy' || mood === 'cheer';
  const dx = 11 * s;
  const lookUp = mood === 'think' ? -2.5 * s : 0;
  return (
    <g>
      <ellipse cx={cx - dx - 4 * s} cy={cy + 8 * s} rx={5 * s} ry={3.2 * s} fill={CHEEK} opacity=".7" />
      <ellipse cx={cx + dx + 4 * s} cy={cy + 8 * s} rx={5 * s} ry={3.2 * s} fill={CHEEK} opacity=".7" />
      {mood === 'sleep' ? (
        <g stroke={INK} strokeWidth={2.6 * s} strokeLinecap="round" fill="none">
          <path d={`M${cx - dx - 4 * s} ${cy} q${4 * s} ${3 * s} ${8 * s} 0`} />
          <path d={`M${cx + dx - 4 * s} ${cy} q${4 * s} ${3 * s} ${8 * s} 0`} />
        </g>
      ) : happy ? (
        <g stroke={INK} strokeWidth={3 * s} strokeLinecap="round" fill="none">
          <path d={`M${cx - dx - 4.5 * s} ${cy + 1 * s} q${4.5 * s} ${-6 * s} ${9 * s} 0`} />
          <path d={`M${cx + dx - 4.5 * s} ${cy + 1 * s} q${4.5 * s} ${-6 * s} ${9 * s} 0`} />
        </g>
      ) : (
        <g className="crew-eyes">
          <ellipse cx={cx - dx} cy={cy + lookUp} rx={3.6 * s} ry={5 * s} fill={INK} />
          <ellipse cx={cx + dx} cy={cy + lookUp} rx={3.6 * s} ry={5 * s} fill={INK} />
          <circle cx={cx - dx + 1.2 * s} cy={cy - 1.8 * s + lookUp} r={1.3 * s} fill="#fff" />
          <circle cx={cx + dx + 1.2 * s} cy={cy - 1.8 * s + lookUp} r={1.3 * s} fill="#fff" />
        </g>
      )}
      {mood === 'oops' && (
        <g stroke={INK} strokeWidth={2.2 * s} strokeLinecap="round" fill="none">
          <path d={`M${cx - dx - 5 * s} ${cy - 8 * s} q${5 * s} ${-3 * s} ${9 * s} ${-1 * s}`} />
          <path d={`M${cx + dx + 5 * s} ${cy - 8 * s} q${-5 * s} ${-3 * s} ${-9 * s} ${-1 * s}`} />
        </g>
      )}
      {happy ? (
        <path d={`M${cx - 7 * s} ${cy + 7 * s} q${7 * s} ${9 * s} ${14 * s} 0 z`} fill="#8B2F3C" />
      ) : mood === 'oops' ? (
        <ellipse cx={cx} cy={cy + 10 * s} rx={3 * s} ry={3.6 * s} fill="#8B2F3C" />
      ) : (
        <path d={`M${cx - 5 * s} ${cy + 8 * s} q${5 * s} ${5 * s} ${10 * s} 0`} stroke={INK} strokeWidth={2.6 * s} strokeLinecap="round" fill="none" />
      )}
    </g>
  );
}

function Arms({ c, mood, y = 92, left = 30, right = 90 }) {
  const up = mood === 'cheer' || mood === 'happy';
  const wave = mood === 'wave';
  return (
    <g fill={c.shade}>
      <rect x={left - 16} y={y - 6} width="18" height="12" rx="6" style={{ transformBox: 'view-box', transformOrigin: `${left}px ${y}px`, transform: up ? 'rotate(48deg)' : 'rotate(-28deg)' }} />
      <rect x={right - 2} y={y - 6} width="18" height="12" rx="6" className={wave ? 'crew-wave' : ''} style={{ transformBox: 'view-box', transformOrigin: `${right}px ${y}px`, transform: up ? 'rotate(-48deg)' : wave ? 'rotate(-70deg)' : 'rotate(28deg)' }} />
    </g>
  );
}

const Base = ({ c }) => <rect x="28" y="114" width="64" height="18" rx="9" fill={c.shade} />;

function Body({ id, c, mood, crown }) {
  switch (id) {
    case 'rook':
      return (
        <g>
          <Arms c={c} mood={mood} y={88} left={34} right={86} />
          <Base c={c} />
          <rect x="32" y="34" width="56" height="88" rx="18" fill={c.color} />
          <rect x="32" y="34" width="14" height="88" rx="7" fill={c.shade} opacity=".35" />
          {[32, 52, 72].map((x) => <rect key={x} x={x} y="18" width="16" height="26" rx="7" fill={c.color} />)}
          <rect x="44" y="96" width="32" height="6" rx="3" fill={c.light} opacity=".7" />
          <Face cx={60} cy={66} mood={mood} />
        </g>
      );
    case 'bishop':
      return (
        <g>
          <Arms c={c} mood={mood} y={92} left={32} right={88} />
          <Base c={c} />
          <path d="M60 18 C86 30 92 66 88 96 C86 112 76 122 60 122 C44 122 34 112 32 96 C28 66 34 30 60 18 Z" fill={c.color} />
          <path d="M60 18 C46 26 38 44 35 62 C34 80 36 100 44 116 C34 110 31 100 32 86 C30 60 38 30 60 18 Z" fill={c.shade} opacity=".4" />
          <path d="M70 30 L80 44" stroke={c.light} strokeWidth="5" strokeLinecap="round" />
          <circle cx="60" cy="13" r="7" fill={c.color} />
          <Face cx={60} cy={70} mood={mood} />
        </g>
      );
    case 'queen':
      return (
        <g>
          <Arms c={c} mood={mood} y={92} />
          <Base c={c} />
          <path d="M60 36 C84 36 94 58 92 86 C90 108 78 122 60 122 C42 122 30 108 28 86 C26 58 36 36 60 36 Z" fill={c.color} />
          <path d="M34 60 C30 76 30 98 40 114 C30 108 27 96 28 84 C28 74 30 66 34 60 Z" fill={c.shade} opacity=".45" />
          <path d="M38 40 L42 16 L51 30 L60 12 L69 30 L78 16 L82 40 Z" fill="#FFC23D" />
          {[42, 60, 78].map((x, i) => <circle key={x} cx={x} cy={i === 1 ? 11 : 15} r="4" fill="#FFE08A" />)}
          <Face cx={60} cy={72} mood={mood} />
        </g>
      );
    case 'king':
      return (
        <g>
          <Arms c={c} mood={mood} y={94} />
          <Base c={c} />
          <path d="M60 40 C84 40 94 60 92 88 C90 110 78 122 60 122 C42 122 30 110 28 88 C26 60 36 40 60 40 Z" fill={c.color} />
          <path d="M34 62 C30 78 30 98 40 114 C30 108 27 96 28 86 C28 76 30 68 34 62 Z" fill={c.shade} opacity=".45" />
          <rect x="38" y="28" width="44" height="16" rx="6" fill="#FFC23D" />
          <path d="M42 30 L46 20 L54 28 L60 18 L66 28 L74 20 L78 30 Z" fill="#FFC23D" />
          <rect x="57" y="4" width="6" height="18" rx="3" fill="#FFC23D" />
          <rect x="52" y="9" width="16" height="6" rx="3" fill="#FFC23D" />
          <Face cx={60} cy={74} mood={mood} />
        </g>
      );
    case 'knight':
      return (
        <g>
          <Arms c={c} mood={mood} y={98} left={32} right={88} />
          <Base c={c} />
          <path d="M40 24 L46 6 L56 22 Z" fill={c.shade} />
          <path d="M58 22 L68 6 L74 24 Z" fill={c.shade} />
          <path d="M60 18 C84 18 96 40 96 66 C96 98 84 122 60 122 C38 122 26 104 26 78 C26 44 38 18 60 18 Z" fill={c.color} />
          <path d="M44 22 C30 34 24 58 26 80 C28 100 36 114 48 120 C34 116 22 100 22 76 C22 50 30 30 44 22 Z" fill={c.shade} />
          <ellipse cx="70" cy="90" rx="22" ry="16" fill={c.light} />
          <ellipse cx="64" cy="90" rx="2.6" ry="2" fill={c.shade} />
          <ellipse cx="78" cy="90" rx="2.6" ry="2" fill={c.shade} />
          <Face cx={62} cy={60} mood={mood} s={0.95} />
        </g>
      );
    case 'pawn':
    default:
      return (
        <g>
          <Arms c={c} mood={mood} y={96} />
          <Base c={c} />
          <path d="M42 120 C42 96 48 82 54 74 L66 74 C72 82 78 96 78 120 Z" fill={c.color} />
          <rect x="40" y="68" width="40" height="10" rx="5" fill={c.shade} />
          <circle cx="60" cy="44" r="28" fill={c.color} />
          <path d="M40 32 C36 44 38 60 48 68 C36 64 30 52 32 40 C34 34 36 32 40 32 Z" fill={c.shade} opacity=".45" />
          <Face cx={60} cy={46} mood={mood} />
          {crown && (
            <g transform="rotate(-10 60 14)">
              <path d="M44 20 L46 4 L54 13 L60 1 L66 13 L74 4 L76 20 Z" fill="#FFC23D" />
            </g>
          )}
        </g>
      );
  }
}

/** A Chess Crew character. `silhouette` draws a locked, not-yet-collected character. */
export function Character({ id = 'pawn', mood = 'idle', size = 96, crown = false, silhouette = false, className = '', title }) {
  const reduce = useReducedMotion();
  const base = CREW[id] || CREW.pawn;
  const c = silhouette ? { color: '#CFD3D8', shade: '#BEC3C9', light: '#DADDE1' } : base;
  return (
    <motion.div
      className={`crew ${className}`}
      style={{ width: size, height: size * (140 / 120) }}
      animate={reduce || silhouette ? undefined : moves[mood] || moves.idle}
      key={reduce ? 'still' : mood}
      role="img"
      aria-label={title || (silhouette ? 'A character you have not met yet' : `${base.name} the ${base.piece.toLowerCase()}`)}
    >
      <svg viewBox="0 0 120 140" width="100%" height="100%" aria-hidden="true">
        <ellipse cx="60" cy="134" rx="34" ry="5" fill="#2E3135" opacity=".12" />
        <Body id={id} c={c} mood={silhouette ? 'sleep' : mood} crown={crown} />
      </svg>
    </motion.div>
  );
}
