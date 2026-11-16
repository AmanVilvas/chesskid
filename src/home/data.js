// One maintained source for the academy's offers, prices and curriculum, so every page agrees.

export const INTRO = {
  name: 'introductory session',
  cta: 'Book an Introductory Session',
  short: 'Book a session',
  strip: 'Chess for ages 4–6 · Live classes and a paid Home Course · Meet your coach in an introductory session',
};

export const PLANS = {
  personal: { id: 'personal', label: 'Personal classes', badge: '1:1', price: '₹4,800', unit: 'per month', who: 'One coach and one child', perChild: false },
  paired: { id: 'paired', label: 'Paired classes', badge: '1:2', price: '₹3,200', unit: 'per child per month', who: 'One coach and two children', perChild: true },
};
export const CLASS_FORMAT = 'Eight 30-minute classes per month, usually scheduled twice a week';

/** Phases of the 30-unit curriculum. A Home Course "part" is a purchase package, not a phase. */
export const PHASES = [
  { id: 1, units: [1, 6], title: 'Meet the pieces', milestone: 'Knight', color: '#B5452F',
    outcome: 'How each piece moves, and how to read the board.',
    topics: ['The Rook', 'The Bishops', 'The Queen', 'The King', 'The Pawn', 'The Knight'] },
  { id: 2, units: [7, 12], title: 'Check and checkmate', milestone: 'Bishop', color: '#E0A93B',
    outcome: 'Spotting a king in danger, and winning the game.',
    topics: ['Check', 'Checkmate', 'Stalemate', 'Teamwork for checkmate', 'King and Queen mate', 'The rook roller'] },
  { id: 3, units: [13, 18], title: 'Special rules and first moves', milestone: 'Rook', color: '#6F8F5C',
    outcome: 'Castling, special pawn moves and a sensible way to start a game.',
    topics: ['Castling', 'Special pawn moves', 'Back-rank mates', 'Starting the game, part 1', 'Starting the game, part 2', 'Hanging pieces'] },
  { id: 4, units: [19, 24], title: 'Tactics', milestone: 'Queen', color: '#8A786C',
    outcome: 'Small tricks that win pieces, and looking before moving.',
    topics: ['Counting', 'Double attack', 'The fork', 'The pin', 'The skewer', 'Discovered attacks'] },
  { id: 5, units: [25, 30], title: 'Playing real games', milestone: 'King', color: '#2B1E18',
    outcome: 'Playing full games with a plan.',
    topics: ['King and Rook mate', 'Your opponent', 'The three parts of a game', 'Passed pawns', 'The opposition', 'The weak square'] },
];

export const UNIT_BLURBS = [
  'Straight lines — the easiest piece for little eyes.', 'Diagonals, and never changing colour.', 'The strongest piece on the board.',
  'Slow, important, always kept safe.', 'Moves forward, captures one square diagonally forward.', 'The tricky L-shaped jumper.',
  'Spotting a king in danger — and three ways out.', 'How a game is actually won.', 'The draw kids find funny.', 'Pieces working together to deliver checkmate.',
  'Their first real checkmate.', 'Two rooks push the king to the edge.', 'Tucking the king away safely.', 'Promotion and en passant.',
  'The trap behind the pawns.', 'Take the middle, bring pieces out.', 'Castle early, queen later.', 'The habit that wins games.',
  'Attackers versus defenders.', 'One move, two threats.', 'Attacking two pieces at once.', 'A piece that can’t move.',
  'The big piece has to run.', 'Including double check.', 'Harder than it looks.', 'What are they trying to do?',
  'Opening, middle and end.', 'The run to become a queen.', 'When the two kings face off.', 'The f7/f2 traps, and how to stop them.',
];

/** All 30 units in syllabus order. */
export const UNITS = PHASES.flatMap((phase) => phase.topics.map((title, i) => ({ n: phase.units[0] + i, title, phase: phase.id })))
  .map((unit) => ({ ...unit, blurb: UNIT_BLURBS[unit.n - 1] }));

export const phaseOf = (unit) => PHASES.find((p) => unit >= p.units[0] && unit <= p.units[1]);

/** Home Course packages: ten units each. */
export const PARTS = [
  { id: 1, units: [1, 10], title: 'Meet the pieces, then check and checkmate', blurb: 'Every piece, then check, checkmate and stalemate. Covers all of phase 1 and the beginning of phase 2.', std: 999, per: 1999, color: '#B5452F' },
  { id: 2, units: [11, 20], title: 'First checkmates and special moves', blurb: 'Real checkmates, castling, pawn tricks and starting a game. The rest of phase 2, all of phase 3 and the start of phase 4.', std: 1499, per: 2499, color: '#C98A1B' },
  { id: 3, units: [21, 30], title: 'Tactics and real games', blurb: 'Forks, pins, skewers, then full games with a plan. The rest of phase 4 and all of phase 5.', std: 1999, per: 2999, color: '#4F6E41' },
];
export const BUNDLE = { std: 3999, per: 6499 };
export const unitsOfPart = (part) => UNITS.filter((u) => u.n >= part.units[0] && u.n <= part.units[1]);
export const inr = (n) => `₹${n.toLocaleString('en-IN')}`;

export const COUNTRIES = [
  { id: 'IN', name: 'India', personal: '₹4,800', paired: '₹3,200' },
  { id: 'AE', name: 'UAE', personal: 'AED 260', paired: 'AED 175' },
  { id: 'US', name: 'USA', personal: '$65', paired: '$43' },
  { id: 'GB', name: 'UK', personal: '£49', paired: '£33' },
  { id: 'CA', name: 'Canada', personal: 'CA$85', paired: 'CA$57' },
  { id: 'AU', name: 'Australia', personal: 'A$95', paired: 'A$63' },
  { id: 'SG', name: 'Singapore', personal: 'S$85', paired: 'S$57' },
  { id: 'MY', name: 'Malaysia', personal: 'RM210', paired: 'RM140' },
];

export const CERT_NOTE = 'After completing the course, message us to arrange a coach assessment. Certificates are awarded after the assessment confirms the relevant skills.';
export const ASSESS_SHORT = 'Completed the course? Message us to arrange an assessment with a coach. The coach will check the skills your child has learned before awarding the certificate.';

export const PHONE = '917448408684';
export const wa = (text) => `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
export const HELP = wa('Hi! I need help with my parent login for The Thinking Academy.');
