import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown, ArrowRight, BookOpen, Check, ChevronDown, ChevronRight,
  CircleHelp, Compass, Flame, GraduationCap, Heart, Lock, Menu,
  Puzzle, ShieldCheck, Sparkles, Star, Trophy, X, Zap,
} from 'lucide-react';
import { CourseChessPiece } from './CourseChessPiece';
import { coursePiecePracticeLessons } from '../data/coursePiecePracticeData';
import { unitsData } from '../data/unitsData';
import { getLearningStreak, readActivityDays } from '../data/adventureProgress';
import './AdventureHome.css';

const pieceUnits = [1, 2, 3, 4, 5, 6];
const pieceCards = [
  { id: 'pawn', unit: 5, color: '#88bd67', hello: 'Small steps can go a long way.', move: 'Forward, with a diagonal capture.' },
  { id: 'rook', unit: 1, color: '#f3a566', hello: 'Steady, strong, and loves a straight path.', move: 'Across ranks and files.' },
  { id: 'bishop', unit: 2, color: '#a18ad8', hello: 'A quiet explorer of diagonals.', move: 'Diagonally, on one colour.' },
  { id: 'knight', unit: 6, color: '#63a9d2', hello: 'The board’s happiest jumper.', move: 'In an L-shape, over pieces.' },
  { id: 'queen', unit: 3, color: '#e687a3', hello: 'A queen combines two kinds of movement.', move: 'Straight or diagonal.' },
  { id: 'king', unit: 4, color: '#e7b84e', hello: 'Every careful step keeps the king safe.', move: 'One square in any direction.' },
];
const worldDecor = [
  { name: 'Rook Castle', emoji: '🏰', color: '#f5ad67' },
  { name: 'Bishop Forest', emoji: '🌲', color: '#9b86d1' },
  { name: 'Queen’s Garden', emoji: '🌷', color: '#e57f9d' },
  { name: 'King’s Keep', emoji: '👑', color: '#e8b64c' },
  { name: 'Pawn Meadow', emoji: '🌱', color: '#85b766' },
  { name: 'Knight’s Crossing', emoji: '🌉', color: '#61a6ce' },
  { name: 'Check Lookout', emoji: '🔭', color: '#67b9bd' },
  { name: 'Checkmate Arena', emoji: '🏟️', color: '#ee8b65' },
  { name: 'Stalemate Shore', emoji: '⛵', color: '#67a8cb' },
  { name: 'Teamwork Tower', emoji: '🛡️', color: '#899bd0' },
  { name: 'Crown Summit', emoji: '🏆', color: '#dfaa44' },
];
const badgeInfo = [
  { id: 'first', title: 'First Move', desc: 'Finish your first lesson or puzzle.', icon: '♟', color: '#dff4c5' },
  { id: 'pawn', title: 'Pawn Explorer', desc: 'Collect a star in a pawn challenge.', icon: '♙', color: '#e4f3cc' },
  { id: 'knight', title: 'Knight Hopper', desc: 'Complete a knight challenge.', icon: '♘', color: '#d9edfb' },
  { id: 'solver', title: 'Puzzle Solver', desc: 'Solve five piece challenges.', icon: '✦', color: '#fff0bf' },
  { id: 'streak', title: 'Seven-Day Learner', desc: 'Learn on seven days in a row.', icon: '🔥', color: '#ffe0ce' },
  { id: 'checkmate', title: 'Checkmate Champion', desc: 'Complete the checkmate unit.', icon: '♔', color: '#f4dffa' },
];

function safeRead(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    return value && typeof value === 'object' ? value : fallback;
  } catch {
    return fallback;
  }
}

function readAdventureData() {
  const lessons = safeRead('course-completed-items', {});
  const puzzleProgress = safeRead('course-lichess-learn-v1', {});
  const solvedByPiece = Object.fromEntries(coursePiecePracticeLessons.map((piece) => {
    const completed = Array.isArray(puzzleProgress[piece.id]?.completed) ? puzzleProgress[piece.id].completed : [];
    const stars = completed.reduce((sum, index) => sum + (piece.puzzles[index]?.targets.length || 0), 0);
    return [piece.id, { challenges: completed.length, stars }];
  }));
  const puzzlesSolved = Object.values(solvedByPiece).reduce((sum, piece) => sum + piece.challenges, 0);
  const starsCaptured = Object.values(solvedByPiece).reduce((sum, piece) => sum + piece.stars, 0);
  const lessonCount = Object.values(lessons).filter(Boolean).length;
  const days = readActivityDays();
  const streak = getLearningStreak(days);
  const unitProgress = unitsData.map((unit, index) => {
    const marked = unit.unitLessons.filter((lesson) => lessons[lesson.id]).length;
    const piece = pieceUnits.includes(unit.id) ? coursePiecePracticeLessons.find((entry) => entry.id === pieceCards.find((card) => card.unit === unit.id)?.id) : null;
    const solved = piece ? solvedByPiece[piece.id]?.challenges || 0 : 0;
    const denominator = piece ? 1 + piece.puzzles.length : unit.unitLessons.length;
    const numerator = piece ? Number(Boolean(lessons[unit.unitLessons[0]?.id])) + solved : marked;
    const percent = Math.round((numerator / Math.max(denominator, 1)) * 100);
    const level = percent === 100 ? 'World mastered' : percent >= 60 ? 'Growing confidence' : percent > 0 ? 'Getting started' : 'Ready to begin';
    const xp = marked * 20 + solved * 25;
    return { ...unit, index, solved, puzzleTotal: piece?.puzzles.length || 0, percent, level, xp };
  });
  const xp = puzzlesSolved * 25 + lessonCount * 20;
  const piecesMastered = coursePiecePracticeLessons.filter((piece) => solvedByPiece[piece.id]?.challenges >= piece.puzzles.length).length;
  const hasActivity = lessonCount > 0 || puzzlesSolved > 0;
  const earned = {
    first: hasActivity,
    pawn: solvedByPiece.pawn.challenges > 0,
    knight: solvedByPiece.knight.challenges > 0,
    solver: puzzlesSolved >= 5,
    streak: streak.best >= 7,
    checkmate: Boolean(lessons['u8-l1'] && lessons['u8-l2']),
  };
  return { lessons, solvedByPiece, puzzlesSolved, starsCaptured, lessonCount, xp, piecesMastered, streak, earned, unitProgress };
}

function playerLink(unit, lecture = `u${unit}-l1`, puzzle = 1) {
  const params = new URLSearchParams({ view: 'player', unit: String(unit), lecture });
  if (lecture.endsWith('-l2') && unit <= 6) params.set('puzzle', String(puzzle));
  return `/curriculum?${params.toString()}`;
}

function SiteNav() {
  const [open, setOpen] = useState(false);
  const links = [
    ['Learn Chess', '#pieces'], ['Adventure Map', '#adventure-map'],
    ['Puzzles', '#learn-through-play'], ['Achievements', '#badges'],
  ];
  return (
    <header className="adventure-nav-wrap">
      <div className="adventure-nav">
        <Link className="adventure-brand" to="/" aria-label="The Thinking Academy home">
          <span className="brand-mark">♞</span><span>The Thinking <span>Academy</span><small>CHESS · CURIOSITY · CONFIDENCE</small></span>
        </Link>
        <nav className="adventure-nav-links" aria-label="Main navigation">
          <Link to="/">Home</Link>{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
          <Link to="/curriculum">Lesson planner</Link>
        </nav>
        <div className="adventure-nav-actions">
          <a className="adventure-profile" href="#progress" aria-label="View learner progress"><span>♙</span></a>
          <Link className="adventure-button adventure-button-green nav-cta" to={playerLink(1)}>Start learning <ArrowRight size={16}/></Link>
          <button className="adventure-mobile-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X/> : <Menu/>}</button>
        </div>
      </div>
      {open && <nav className="adventure-mobile-menu" aria-label="Mobile navigation">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}<ChevronRight size={16}/></a>)}<Link to="/curriculum" onClick={() => setOpen(false)}>Original lesson planner<ChevronRight size={16}/></Link><Link className="adventure-button adventure-button-green" to={playerLink(1)} onClick={() => setOpen(false)}>Start learning <ArrowRight size={16}/></Link></nav>}
    </header>
  );
}

function SectionTitle({ kicker, title, text, dark = false }) {
  return <div className={`adventure-section-title ${dark ? 'is-dark' : ''}`}><span>{kicker}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

function ChessboardHero() {
  const tiles = Array.from({ length: 64 }, (_, i) => ({ row: Math.floor(i / 8), col: i % 8 }));
  const pieces = [
    { type: 'k', color: 'w', square: 3, label: 'King' },
    { type: 'q', color: 'b', square: 12, label: 'Queen' },
    { type: 'n', color: 'w', square: 20, label: 'Knight' },
    { type: 'r', color: 'b', square: 25, label: 'Rook' },
    { type: 'b', color: 'w', square: 35, label: 'Bishop' },
    { type: 'p', color: 'b', square: 44, label: 'Pawn' },
  ];
  const bySquare = Object.fromEntries(pieces.map((piece) => [piece.square, piece]));
  return (
    <div className="hero-art" aria-label="A chessboard with six chess pieces">
      <div className="hero-art-cloud cloud-one"/><div className="hero-art-cloud cloud-two"/>
      <div className="hero-board-shadow"/>
      <div className="hero-board" role="img" aria-label="Illustrated chessboard">
        {tiles.map(({ row, col }, i) => {
          const piece = bySquare[i];
          return <div key={i} className={`hero-tile ${(row + col) % 2 ? 'tile-dark' : ''} ${[19, 28, 37].includes(i) ? 'tile-path' : ''}`}>{piece && <span className={`hero-board-piece ${piece.color === 'b' ? 'piece-black' : ''}`} title={piece.label}><CourseChessPiece type={piece.type} color={piece.color}/></span>}</div>;
        })}
      </div>
      <div className="float-label label-star"><Star size={17} fill="currentColor"/> First star!</div>
      <div className="float-label label-xp"><Zap size={16} fill="currentColor"/> +25 XP</div>
      <div className="float-label label-badge"><Trophy size={16}/> New badge</div>
      <div className="hero-spark spark-a">✦</div><div className="hero-spark spark-b">✧</div><div className="hero-spark spark-c">✦</div>
      <div className="hero-caption"><span>✦</span> Every move is a little discovery</div>
    </div>
  );
}

function JourneyMap({ data }) {
  const nextIndex = data.unitProgress.findIndex((unit) => unit.percent < 100);
  const focusIndex = nextIndex < 0 ? 10 : nextIndex;
  return (
    <section id="adventure-map" className="adventure-map-section">
      <div className="adventure-container">
        <SectionTitle kicker="YOUR LEARNING JOURNEY" title="A kingdom full of clever moves" text="Small adventures build big chess confidence. Pick up where you left off, or explore a new world." />
        <div className="map-summary"><span className="map-summary-icon"><Compass size={18}/></span><div><b>{data.unitProgress[focusIndex]?.title.replace(/^Unit \d+ - /, '') || 'Your next adventure'}</b><small>Your next step in the kingdom</small></div><Link className="map-summary-cta" to={playerLink(focusIndex + 1)}>{data.puzzlesSolved || data.lessonCount ? 'Continue journey' : 'Begin journey'} <ArrowRight size={15}/></Link></div>
        <div className="adventure-map-grid">
          <svg className="map-trail" viewBox="0 0 1000 140" preserveAspectRatio="none" aria-hidden="true"><path d="M30 80 C100 20 180 20 250 80 S400 140 500 80 S650 20 750 80 S900 140 970 80"/></svg>
          {data.unitProgress.map((unit, i) => {
            const decor = worldDecor[i];
            const unlocked = i === 0 || data.unitProgress[i - 1].percent > 0;
            const active = i === focusIndex;
            const complete = unit.percent === 100;
            return (
              <article className={`world-node ${active ? 'world-current' : ''} ${complete ? 'world-complete' : ''} ${!unlocked ? 'world-locked' : ''}`} key={unit.id}>
                {i > 0 && <span className="world-step-label">WORLD {String(i + 1).padStart(2, '0')}</span>}
                <div className="world-node-orb" style={{ '--world-color': decor.color }}>
                  <span className="world-emoji" aria-hidden="true">{decor.emoji}</span>
                  {complete && <span className="world-check"><Check size={12}/></span>}
                  {!unlocked && <span className="world-lock"><Lock size={12}/></span>}
                  {active && <span className="world-pulse"/>}
                </div>
                <div className="world-node-copy"><small>{i === 0 ? 'START HERE' : `UNIT ${String(i + 1).padStart(2, '0')}`}</small><h3>{decor.name}</h3><p>{unit.title.replace(/^Unit \d+ - /, '')}</p><div className="world-progress"><i style={{ width: `${unit.percent}%` }}/></div><span className="world-progress-caption">{complete ? 'World explored' : unit.percent ? `${unit.percent}% explored` : `${unit.puzzleTotal ? unit.puzzleTotal + 1 : unit.unitLessons.length} activities`}</span></div>
                {unlocked ? <Link className="world-node-link" to={playerLink(unit.id, `u${unit.id}-l1`)} aria-label={`Open ${unit.title}`}>{complete ? 'Explore again' : active ? 'Continue' : 'Explore'} <ArrowRight size={14}/></Link> : <Link className="world-locked-hint" to={playerLink(data.unitProgress[i - 1].id, `u${data.unitProgress[i - 1].id}-l1`)} title={`Explore ${data.unitProgress[i - 1].title} to unlock this world.`}>Explore the previous world to unlock <ArrowRight size={12}/></Link>}
              </article>
            );
          })}
        </div>
        <div className="map-footer-note"><Sparkles size={16}/> Every world opens a new chess idea. No rush—learning is the adventure.</div>
      </div>
    </section>
  );
}

function PieceCard({ piece, completed, stars }) {
  const lesson = coursePiecePracticeLessons.find((entry) => entry.id === piece.id);
  const href = playerLink(piece.unit, `u${piece.unit}-l2`, 1);
  const totalStars = lesson?.puzzles.reduce((sum, puzzle) => sum + puzzle.targets.length, 0) || 0;
  return (
    <article className="piece-adventure-card" style={{ '--piece-accent': piece.color }}>
      <div className="piece-card-top"><span className="piece-number">PIECE QUEST</span><span className="piece-complete"><Star size={14} fill="currentColor"/> {stars}/{totalStars} stars</span></div>
      <div className="piece-character"><div className="piece-glow"/><CourseChessPiece type={lesson?.type || 'p'} color="w"/></div>
      <h3>{piece.id[0].toUpperCase() + piece.id.slice(1)}</h3>
      <p className="piece-hello">{piece.hello}<span>{completed}/{lesson?.puzzles.length || 0} challenges complete</span></p>
      <div className="piece-move"><ArrowDown size={14}/><span>{piece.move}</span></div>
      <div className="piece-progress-track"><i style={{ width: `${lesson?.puzzles.length ? Math.min(100, (completed / lesson.puzzles.length) * 100) : 0}%` }}/></div>
      <Link className="piece-card-link" to={href}>{completed ? 'Keep exploring' : 'Meet this piece'} <ArrowRight size={15}/></Link>
    </article>
  );
}

function ProgressJourney({ data }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <section id="progress" className="progress-section">
      <div className="adventure-container">
        <div className="progress-heading-row"><SectionTitle kicker="A LITTLE PROGRESS, EVERY DAY" title="Your learning journey" text="A parent-friendly view of what’s been explored and what comes next."/><div className="streak-pill"><Flame size={17} fill={data.streak.current ? 'currentColor' : 'none'}/><span><b>{data.streak.current}</b> day current <small>· best {data.streak.best}</small></span></div></div>
        <div className="stats-row">
          <div className="stat-card"><span className="stat-icon stat-blue"><BookOpen size={18}/></span><b>{data.lessonCount}</b><small>lessons completed</small></div>
          <div className="stat-card"><span className="stat-icon stat-gold"><Star size={18} fill="currentColor"/></span><b>{data.starsCaptured}</b><small>stars collected · {data.puzzlesSolved} puzzles</small></div>
          <div className="stat-card"><span className="stat-icon stat-coral"><Zap size={18}/></span><b>{data.xp}</b><small>experience points</small></div>
          <div className="stat-card"><span className="stat-icon stat-green"><Trophy size={18}/></span><b>{data.piecesMastered} / 6</b><small>pieces mastered</small></div>
        </div>
        <div className="journey-list" aria-label="Unit progress">
          {data.unitProgress.map((unit, i) => {
            const isOpen = expanded === unit.id;
            return <article key={unit.id} className={`journey-row ${isOpen ? 'journey-row-open' : ''}`}>
              <button className="journey-row-toggle" onClick={() => setExpanded(isOpen ? null : unit.id)} aria-expanded={isOpen}>
                <span className="journey-row-index" style={{ '--world-color': worldDecor[i].color }}>{worldDecor[i].emoji}</span>
                <span className="journey-row-main"><b>{unit.title.replace(/^Unit \d+ - /, '')}</b><small>{unit.level} · {unit.solved} of {unit.puzzleTotal} puzzles · {unit.xp} XP</small></span>
                <span className="journey-row-percent">{unit.percent}%</span><span className="journey-row-bar"><i style={{ width: `${unit.percent}%` }}/></span><ChevronDown size={18}/>
              </button>
              {isOpen && <div className="journey-row-details"><p>{unit.description}</p><div className="journey-row-milestones"><strong>Learning focus</strong>{unit.educationalObjectives.keyObjectives?.slice(0, 4).map((goal) => <span key={goal}><Check size={13}/>{goal}</span>)}</div><div className="journey-detail-meta"><span><Compass size={13}/>{unit.level}</span><span><Zap size={13}/>{unit.xp} XP earned</span></div><Link to={playerLink(unit.id, `u${unit.id}-l1`)}>{unit.percent ? 'Continue this unit' : 'Explore this unit'} <ArrowRight size={14}/></Link></div>}
            </article>;
          })}
        </div>
      </div>
    </section>
  );
}

function BadgeGallery({ data }) {
  return <section id="badges" className="badge-section"><div className="adventure-container"><SectionTitle kicker="LITTLE WINS ADD UP" title="Badges along the way" text="Earned through real learning activity. Keep going to unlock the next one."/><div className="badge-grid">{badgeInfo.map((badge) => {
    const unlocked = data.earned[badge.id];
    return <article className={`badge-card ${unlocked ? 'badge-unlocked' : ''}`} key={badge.id}><span className="badge-art" style={{ '--badge-color': badge.color }}>{badge.icon}</span><div><h3>{badge.title}</h3><p>{unlocked ? 'You earned this!' : badge.desc}</p></div>{unlocked ? <Check size={17} className="badge-check"/> : <Lock size={15} className="badge-lock"/>}</article>;
  })}</div></div></section>;
}

export function AdventureHome() {
  const data = useMemo(() => readAdventureData(), []);
  const firstPuzzle = playerLink(1, 'u1-l2', 1);
  return (
    <div className="adventure-home">
      <SiteNav/>
      <main>
        <section className="kingdom-hero" id="home">
          <div className="hero-wash hero-wash-one"/><div className="hero-wash hero-wash-two"/>
          <div className="adventure-container hero-inner">
            <div className="hero-copy">
              <div className="hero-eyebrow"><span className="hero-eyebrow-spark">✦</span> WELCOME TO YOUR CHESS KINGDOM <span className="hero-ages">AGES 4–6</span></div>
              <h1>Your chess<br/>adventure <em>starts here!</em></h1>
              <p>Meet the pieces, discover clever moves, and grow a little more confident with every puzzle—one happy step at a time.</p>
              <div className="hero-actions"><Link className="adventure-button adventure-button-green adventure-button-large" to={playerLink(1)}>Start your adventure <ArrowRight size={18}/></Link><a className="hero-secondary" href="#pieces"><CircleHelp size={17}/> Explore the pieces</a></div>
              <div className="hero-trust"><span className="trust-avatars"><i>♙</i><i>♘</i><i>♗</i></span><span>Made for curious kids<br/><b>and the grown-ups who cheer</b></span><span className="trust-separator"/><span className="trust-rating"><Star size={15} fill="currentColor"/> Learn by playing</span></div>
            </div>
            <ChessboardHero/>
          </div>
          <div className="hero-bottom-wave" aria-hidden="true"/>
        </section>

        <section className="getting-started-section" id="learn-through-play"><div className="adventure-container"><div className="getting-heading"><SectionTitle kicker="A FRIENDLY FIRST STEP" title="Getting started is easy" text="No chess experience needed. Just bring your curiosity."/><span className="getting-doodle">Let’s play! <span>↘</span></span></div><div className="starter-grid">
          <article className="starter-card starter-green"><div className="starter-illustration piece-trio"><span>♙</span><span>♘</span><span>♖</span><i>✦</i></div><span className="starter-step">01 · MEET</span><h3>Meet the pieces</h3><p>Every piece has its own special way to move. Let’s get to know them.</p><Link to={playerLink(1, 'u1-l2')}>Meet a piece <ArrowRight size={15}/></Link></article>
          <article className="starter-card starter-yellow"><div className="starter-illustration tiny-board"><div>{['♜','','','','','♙','','','', '✦','','','', '', '', ''].map((sq,i)=><span key={i}>{sq}</span>)}</div><i>↗</i></div><span className="starter-step">02 · TRY</span><h3>Solve a first puzzle</h3><p>Follow the board, find a star, and celebrate a clever move.</p><Link to={firstPuzzle}>Solve a puzzle <ArrowRight size={15}/></Link></article>
          <article className="starter-card starter-violet"><div className="starter-illustration trophy-art"><span>🏆</span><i>✦</i><b>+25 XP</b></div><span className="starter-step">03 · GROW</span><h3>Play and progress</h3><p>Complete little challenges and see your chess confidence grow.</p><a href="#adventure-map">See the map <ArrowRight size={15}/></a></article>
        </div></div></section>

        <JourneyMap data={data}/>

        <section className="pieces-section" id="pieces"><div className="adventure-container"><SectionTitle kicker="MEET YOUR CHESS TEAM" title="Six pieces. Six personalities." text="Choose a friend and learn what makes their moves special. Each path opens a real interactive practice board."/><div className="pieces-grid">{pieceCards.map((piece) => <PieceCard key={piece.id} piece={piece} completed={data.solvedByPiece[piece.id]?.challenges || 0} stars={data.solvedByPiece[piece.id]?.stars || 0}/>)}</div><div className="pieces-footnote"><ShieldCheck size={17}/><span>Rules and moves are taught using the original interactive piece exercises.</span><Link to="/curriculum">Browse the full lesson planner <ArrowRight size={14}/></Link></div></div></section>

        <section className="play-section"><div className="adventure-container"><SectionTitle kicker="LEARNING THAT FEELS LIKE PLAY" title="Explore, practise, and celebrate" text="The best way to learn chess is to try a move, see what happens, and try again."/><div className="play-cards">
          <Link className="play-card play-lesson" to="/curriculum"><span className="play-card-icon"><GraduationCap size={25}/></span><div><small>THE COURSE</small><h3>Interactive lessons</h3><p>Explore all 11 units, learning goals, and family-friendly activities.</p></div><ArrowRight className="play-arrow" size={19}/></Link>
          <Link className="play-card play-puzzle" to={firstPuzzle}><span className="play-card-icon"><Puzzle size={25}/></span><div><small>YOUR NEXT MOVE</small><h3>Chess puzzles</h3><p>Play directly on the board and collect the stars along the way.</p></div><ArrowRight className="play-arrow" size={19}/></Link>
          <a className="play-card play-map" href="#adventure-map"><span className="play-card-icon"><Compass size={25}/></span><div><small>KEEP GOING</small><h3>Adventure map</h3><p>Unlock new chess worlds one discovery at a time.</p></div><ArrowRight className="play-arrow" size={19}/></a>
        </div></div></section>

        <ProgressJourney data={data}/>
        <BadgeGallery data={data}/>

        <section id="about" className="encouragement-section"><div className="adventure-container encouragement-inner"><div className="encouragement-art"><span className="encourage-sun">☀</span><span className="encourage-piece">♘</span><span className="encourage-star">✦</span><span className="encourage-cloud">☁</span></div><div><span className="encouragement-kicker"><Heart size={15} fill="currentColor"/> A NOTE FOR PARENTS</span><h2>Thinking grows with every try.</h2><p>Chess is full of small decisions. We make room for questions, experiments, and do-overs—so children can enjoy the process, not just the result.</p><Link to="/curriculum">See the teaching approach <ArrowRight size={15}/></Link></div></div></section>

        <section className="final-cta"><div className="adventure-container final-cta-inner"><div className="cta-stars">✦　✧　✦</div><div className="cta-mini-board">♜<span>♙</span>♔</div><div className="cta-copy"><span>YOUR NEXT ADVENTURE IS READY</span><h2>Every champion starts<br/>with one little move.</h2><p>Start with the rook. Stay for the “aha!” moments.</p><Link className="adventure-button adventure-button-green adventure-button-large" to={playerLink(1)}>Continue your adventure <ArrowRight size={18}/></Link></div><div className="cta-piece cta-knight">♘</div><div className="cta-piece cta-queen">♕</div></div></section>
      </main>
      <footer className="adventure-footer"><div className="adventure-container footer-inner"><Link className="adventure-brand" to="/"><span className="brand-mark">♞</span><span>The Thinking <span>Academy</span><small>CHESS · CURIOSITY · CONFIDENCE</small></span></Link><p>Made for curious minds and the grown-ups who cheer them on.</p><div><Link to="/curriculum">Lesson planner</Link><a href="#pieces">Chess pieces</a><a href="#badges">Achievements</a><Link to="/pricing">1:1 coaching</Link></div><span className="footer-copyright">© The Thinking Academy</span></div></footer>
    </div>
  );
}
