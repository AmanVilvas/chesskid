// Small original illustrations that sit beside each stop on Crown Mountain.
const ink = '#2B3A33';

function Tower({ c, d }) {
  return (
    <g>
      <rect x="30" y="26" width="34" height="46" rx="3" fill={c} />
      <rect x="30" y="26" width="10" height="46" fill={d} opacity=".35" />
      <path d="M26 26 h42 v-10 h-7 v6 h-7 v-6 h-7 v6 h-7 v-6 h-7 v6 h-7 z" fill={c} />
      <path d="M43 72 v-14 a4 4 0 0 1 8 0 v14 z" fill={ink} opacity=".75" />
      <rect x="54" y="36" width="5" height="8" rx="2.5" fill={ink} opacity=".6" />
      <path d="M47 16 V2 l12 4 -12 4" fill="#F5C65D" stroke={ink} strokeWidth="1.5" strokeLinejoin="round" />
    </g>
  );
}
function Trees({ c, d }) {
  const tree = (x, s, tone) => (
    <g transform={`translate(${x} ${72 - 46 * s}) scale(${s})`}>
      <rect x="-3" y="34" width="6" height="12" fill="#8A6A4A" />
      <path d="M0 0 L16 22 H8 L20 38 H-20 L-8 22 H-16 Z" fill={tone} />
    </g>
  );
  return <g>{tree(26, 0.9, d)}{tree(62, 1, c)}{tree(44, 1.25, c)}</g>;
}
function Palace({ c, d }) {
  return (
    <g>
      <rect x="18" y="44" width="58" height="28" rx="3" fill="#FFF6EA" />
      <path d="M30 44 a17 17 0 0 1 34 0 z" fill={c} />
      <rect x="22" y="34" width="8" height="38" rx="2" fill={d} opacity=".85" />
      <rect x="64" y="34" width="8" height="38" rx="2" fill={d} opacity=".85" />
      <path d="M21 34 l5 -9 5 9 z M63 34 l5 -9 5 9 z" fill={c} />
      <path d="M47 27 v-9" stroke={ink} strokeWidth="1.6" />
      <circle cx="47" cy="16" r="3" fill="#F5C65D" stroke={ink} strokeWidth="1.2" />
      <path d="M41 72 v-12 a6 6 0 0 1 12 0 v12 z" fill={d} />
    </g>
  );
}
function Keep({ c, d }) {
  return (
    <g>
      <rect x="20" y="38" width="54" height="34" rx="3" fill={c} />
      <path d="M20 38 h54 v-8 h-6 v5 h-6 v-5 h-6 v5 h-6 v-5 h-6 v5 h-6 v-5 h-6 v5 h-6 v-5 h-6 z" fill={c} />
      <rect x="20" y="38" width="12" height="34" fill={d} opacity=".3" />
      <path d="M40 72 v-14 a7 7 0 0 1 14 0 v14 z" fill={ink} opacity=".7" />
      <path d="M36 22 L39 12 L44 18 L47 8 L50 18 L55 12 L58 22 Z" fill="#F5C65D" stroke={ink} strokeWidth="1.5" strokeLinejoin="round" />
    </g>
  );
}
function Cottages({ c, d }) {
  const house = (x, s, roof) => (
    <g transform={`translate(${x} ${72 - 34 * s}) scale(${s})`}>
      <rect x="0" y="14" width="28" height="20" fill="#FFF6EA" />
      <path d="M-3 15 L14 0 L31 15 Z" fill={roof} />
      <rect x="10" y="22" width="8" height="12" fill={ink} opacity=".6" />
    </g>
  );
  return <g>{house(14, 0.95, d)}{house(46, 1.15, c)}<circle cx="80" cy="64" r="8" fill={c} opacity=".7" /></g>;
}
function Peaks({ c, d }) {
  return (
    <g>
      <path d="M6 72 L30 26 L46 52 L60 18 L88 72 Z" fill={d} />
      <path d="M60 18 L68 33 L63 31 L58 36 L54 30 Z M30 26 L36 38 L31 36 L26 40 Z" fill="#FFFFFF" />
      <path d="M46 52 L60 18 L88 72 H58 Z" fill={c} opacity=".55" />
    </g>
  );
}
function Watchtower({ c, d }) {
  return (
    <g>
      <path d="M36 72 L40 30 H56 L60 72 Z" fill={c} />
      <rect x="34" y="22" width="28" height="9" rx="2" fill={d} />
      <path d="M32 22 L48 8 L64 22 Z" fill={d} />
      <circle cx="48" cy="44" r="4" fill={ink} opacity=".6" />
      <path d="M68 14 l6 -6 m0 10 l8 0 m-8 -14 l4 -6" stroke="#F5C65D" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}
function Gate({ c, d }) {
  return (
    <g>
      <rect x="16" y="22" width="16" height="50" rx="3" fill={c} />
      <rect x="62" y="22" width="16" height="50" rx="3" fill={c} />
      <path d="M32 34 h30 v38 h-6 v-18 a9 9 0 0 0 -18 0 v18 h-6 z" fill={d} />
      <path d="M14 22 l10 -10 10 10 z M60 22 l10 -10 10 10 z" fill={d} />
      <path d="M47 31 L44 24 L47 26 L50 20 L53 26 L56 24 L53 31 Z" fill="#F5C65D" transform="translate(-3 0)" />
    </g>
  );
}
function Bridge({ c, d }) {
  return (
    <g>
      <path d="M4 72 q44 -40 88 0" fill="none" stroke={d} strokeWidth="7" strokeLinecap="round" />
      <path d="M4 60 q44 -40 88 0" fill="none" stroke={c} strokeWidth="4" strokeLinecap="round" />
      {[18, 32, 48, 64, 78].map((x) => <path key={x} d={`M${x} ${x === 48 ? 40 : x === 32 || x === 64 ? 45 : 53} v16`} stroke={c} strokeWidth="3" strokeLinecap="round" />)}
      <path d="M0 74 q12 -6 24 0 t24 0 t24 0 t24 0" fill="none" stroke="#8CAED1" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}
function Tents({ c, d }) {
  return (
    <g>
      <path d="M8 72 L30 32 L52 72 Z" fill={c} />
      <path d="M30 32 L30 72 L40 72 Z" fill={d} opacity=".45" />
      <path d="M46 72 L66 38 L86 72 Z" fill={d} />
      <path d="M30 32 V18 l10 4 -10 4" fill="#F5C65D" stroke={ink} strokeWidth="1.4" />
      <path d="M62 72 q4 -10 8 0" fill="#FFF6EA" />
    </g>
  );
}
function Summit({ c }) {
  return (
    <g>
      <path d="M2 72 L40 8 L52 26 L60 16 L94 72 Z" fill="#B9C5DD" />
      <path d="M40 8 L50 24 L44 22 L38 28 L33 20 Z" fill="#fff" />
      <path d="M48 8 V-12" stroke={ink} strokeWidth="2" transform="translate(-8 4)" />
      <path d="M40 -8 L58 -2 L40 4 Z" fill={c} stroke={ink} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M45 -4 l1.5 -3 1.5 2 1.5 -3 1.5 3 1.5 -2 1 3 z" fill="#fff" />
    </g>
  );
}

const art = { 1: Tower, 2: Trees, 3: Palace, 4: Keep, 5: Cottages, 6: Peaks, 7: Watchtower, 8: Gate, 9: Bridge, 10: Tents, 11: Summit };

export function Landmark({ worldId, color, deep, className = '' }) {
  const Art = art[worldId];
  if (!Art) return null;
  return (
    <svg className={className} viewBox="0 -14 96 90" aria-hidden="true">
      <ellipse cx="48" cy="73" rx="44" ry="6" fill="#2B3A33" opacity=".08" />
      <Art c={color} d={deep} />
    </svg>
  );
}
