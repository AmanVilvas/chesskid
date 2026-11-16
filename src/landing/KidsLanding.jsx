import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowRight, Clapperboard, FileText, Gamepad2, Gift, GraduationCap, LockKeyhole, Printer, RotateCcw, Sparkles, Star } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { Character, CREW } from '../kids/Characters';
import { KidsBoard, GoldStar } from '../kids/KidsBoard';
import { Landmark } from '../kids/Landmarks';
import { useStarPuzzle } from '../kids/useStarPuzzle';
import { coursePiecePracticeLessons } from '../data/coursePiecePracticeData';
import { playEffect } from '../kids/kidsAudio';
import '../kids/kids.css';
import './landing.css';

const CREW_ORDER = ['pawn', 'rook', 'bishop', 'knight', 'queen', 'king'];
const FILES = 'abcdefgh';

function useStartLinks(course) {
  const { user } = useAuth();
  const play = course.playPath;
  return user
    ? { primary: { to: play, label: 'Continue climbing' }, secondary: null }
    : { primary: { to: '/signup', state: { from: play }, label: 'Get started' }, secondary: { to: '/login', state: { from: play }, label: 'I already have an account' } };
}

/** Section that rises in once when scrolled into view. */
function Reveal({ children, className = '', delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

// ---------- hero: the Chess Crew tumbling around a little board ----------
const HERO_SPOTS = [
  { id: 'queen', x: 6, y: 4, size: 118, float: 5.2 },
  { id: 'knight', x: 64, y: 0, size: 112, float: 4.4 },
  { id: 'rook', x: 0, y: 52, size: 112, float: 4.8 },
  { id: 'king', x: 70, y: 50, size: 122, float: 5.6 },
  { id: 'bishop', x: 38, y: 64, size: 108, float: 4.2 },
  { id: 'pawn', x: 36, y: 16, size: 140, float: 3.8 },
];

function HeroCrew() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.2 });
  const reduce = useReducedMotion();
  const [poked, setPoked] = useState(null);
  const loop = inView && !reduce;
  const poke = (id) => { setPoked(id); playEffect('boing', true); window.setTimeout(() => setPoked((p) => (p === id ? null : p)), 900); };
  return (
    <div className="kl-hero-art" ref={ref} aria-label="The Chess Crew: Pip, Rocco, Bea, Kit, Queenie and King Kip" role="img">
      <div className="kl-hero-board" aria-hidden="true">{Array.from({ length: 16 }, (_, i) => <i key={i} className={(Math.floor(i / 4) + i) % 2 ? 'dark' : ''} />)}</div>
      {[[20, 10], [86, 30], [12, 86], [92, 86], [54, 2]].map(([x, y], i) => (
        <motion.span key={i} className="kl-hero-star" style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true"
          animate={loop ? { rotate: [0, 18, -10, 0], scale: [1, 1.15, 1] } : undefined} transition={{ duration: 3 + i * 0.6, repeat: Infinity, ease: 'easeInOut' }}>
          <GoldStar className="kl-hero-star-svg" />
        </motion.span>
      ))}
      {HERO_SPOTS.map((spot, i) => (
        <motion.button
          type="button" key={spot.id} className="kl-hero-char" style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
          initial={reduce ? false : { opacity: 0, scale: 0.4, y: 40 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: loop ? [0, -12, 0] : 0 }}
          transition={{ opacity: { delay: 0.1 * i, duration: 0.3 }, scale: { delay: 0.1 * i, type: 'spring', stiffness: 260, damping: 14 }, y: loop ? { duration: spot.float, repeat: Infinity, ease: 'easeInOut', delay: 0.6 + i * 0.3 } : { delay: 0.1 * i, type: 'spring', stiffness: 260, damping: 14 } }}
          whileHover={reduce ? undefined : { scale: 1.08, rotate: i % 2 ? 4 : -4 }}
          onClick={() => poke(spot.id)}
          aria-label={`${CREW[spot.id].name} the ${CREW[spot.id].piece.toLowerCase()}`}
        >
          <Character id={spot.id} size={spot.size} mood={poked === spot.id ? 'cheer' : 'idle'} />
        </motion.button>
      ))}
    </div>
  );
}

// ---------- a real, playable star puzzle (the same engine as the course) ----------
function DemoPuzzle() {
  const lesson = coursePiecePracticeLessons.find((l) => l.id === 'rook');
  const puzzle = lesson.puzzles[1];
  const boardRef = useRef(null);
  const [message, setMessage] = useState('Tap the rook, then a glowing spot!');
  const [won, setWon] = useState(false);
  const state = useStarPuzzle(lesson, puzzle, {
    onStar: ({ left }) => { playEffect('star', true); setMessage(`Yay! ${left} more!`); },
    onIllegal: () => { playEffect('oops', true); setMessage('Rooks go straight. Try a glowing spot!'); },
    onMove: ({ caught }) => { if (!caught) playEffect('move', true); },
    onSolved: () => { playEffect('solved', true); setWon(true); setMessage('You did it! That is how a rook moves.'); },
  });
  const pieces = Object.entries(state.game.pieces).map(([sq, p]) => ({ id: state.ids[sq] || sq, type: p.type, color: p.color, sq }));
  const squareAt = (x, y) => {
    const r = boardRef.current?.getBoundingClientRect();
    if (!r || x < r.left || y < r.top || x >= r.right || y >= r.bottom) return null;
    return `${FILES[Math.floor((x - r.left) / (r.width / 8))]}${8 - Math.floor((y - r.top) / (r.height / 8))}`;
  };
  const onPointerDown = (event) => {
    if (state.solved) return;
    const sq = squareAt(event.clientX, event.clientY);
    if (!sq) return;
    const piece = state.game.pieces[sq];
    if (piece && piece.color === state.game.activeColor) {
      if (state.selected === sq) state.deselect(); else { playEffect('tap', true); state.select(sq); setMessage('Now tap a glowing spot!'); }
    } else if (state.selected) state.move(state.selected, sq);
  };
  const restart = () => { state.reset(); setWon(false); setMessage('Tap the rook, then a glowing spot!'); };
  return (
    <div className="kl-demo">
      <div className="pip-bubble-wrap">
        <Character id="rook" mood={won ? 'cheer' : 'idle'} size={70} />
        <div className="pip-bubble" aria-live="polite">{message}</div>
      </div>
      <div className="kl-demo-board">
        <KidsBoard ref={boardRef} pieces={pieces} stars={state.stars} legal={state.legal} selected={state.selected} lastMove={state.lastMove} burst={state.burst} shake={state.shake}
          interactive label="Try it: move the rook to the stars" boardProps={{ onPointerDown }} />
        <AnimatePresence>
          {won && (
            <motion.div className="kl-demo-win" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div className="kl-demo-stars">{[0, 1, 2].map((i) => <motion.span key={i} initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.1 + i * 0.12, type: 'spring', stiffness: 400, damping: 12 }}><GoldStar className="kl-demo-star" /></motion.span>)}</div>
              <strong>Great job!</strong>
              <button type="button" className="kid-btn kid-btn-ghost" onClick={restart}><RotateCcw size={18} /> Play again</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CrewStrip() {
  const [active, setActive] = useState(null);
  return (
    <div className="kl-crew-strip" role="list">
      {CREW_ORDER.map((id) => (
        <button type="button" role="listitem" key={id} className={`kl-crew-item ${active === id ? 'is-active' : ''}`} style={{ '--c': CREW[id].color }}
          onClick={() => { setActive(id); playEffect('pop', true); }} aria-label={`${CREW[id].name}: ${CREW[id].blurb}`}>
          <Character id={id} size={78} mood={active === id ? 'happy' : 'idle'} />
          <b>{CREW[id].name}</b>
          <small>{CREW[id].piece}</small>
        </button>
      ))}
      <AnimatePresence mode="wait">
        {active && (
          <motion.p key={active} className="kl-crew-line" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            <b>{CREW[active].name}:</b> “{CREW[active].blurb}”
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function MiniMountain() {
  const stops = [[50, 86, 1], [72, 64, 2], [34, 44, 3], [62, 22, 4]];
  return (
    <div className="kl-mountain" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="kl-mountain-bg">
        <path d="M0 100 L18 52 L30 64 L50 14 L70 58 L82 40 L100 100 Z" fill="#D8E9F6" />
        <path d="M50 14 L57 28 L52 26 L49 31 L45 26 L42 29 Z" fill="#fff" />
        <path d="M0 100 Q30 70 60 84 T100 76 V100 Z" fill="#BFE39F" />
      </svg>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="kl-mountain-trail">
        <path d="M50 86 C62 80 76 72 72 64 C68 56 38 54 34 44 C30 34 58 30 62 22" fill="none" stroke="#FFF8EA" strokeWidth="5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      {stops.map(([x, y, id]) => (
        <span key={id} className="kl-mountain-stop" style={{ left: `${x}%`, top: `${y}%` }}><Landmark worldId={id} color={['#FF6B6B', '#9B7BF7', '#FF7EB6', '#33C481'][id - 1]} deep="#00000033" /></span>
      ))}
      <span className="kl-mountain-pip" style={{ left: '56%', top: '78%' }}><Character id="pawn" mood="wave" size={56} /></span>
    </div>
  );
}

/** The landing page for one course; all copy and numbers come from the course catalog. */
export function KidsLanding({ course }) {
  const links = useStartLinks(course);
  const copy = course.landing;
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    document.title = `${course.name} for ages ${course.ages} | The Thinking Academy`;
    const onScroll = () => setScrolled(window.scrollY > 420);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const Primary = ({ big = false }) => (
    <Link to={links.primary.to} state={links.primary.state} className={`kid-btn kid-btn-go ${big ? 'kid-btn-xl kl-wide' : ''}`}>{links.primary.label}</Link>
  );

  return (
    <div className="kids-root kl-landing">
      <header className={`kl-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="kl-wrap kl-header-row">
          <Link to="/" className="kl-logo" aria-label="The Thinking Academy home"><Character id="pawn" size={40} /><span>thinking academy</span></Link>
          <nav className="kl-header-nav" aria-label="Main">
            <Link to={course.playPath}>{course.world}</Link>
            <Link to="/curriculum">Lesson planner</Link>
            <Link to="/courses">All courses</Link>
            <Link to="/parents" className="kl-grownups"><LockKeyhole size={16} /> Grown-ups</Link>
          </nav>
          <AnimatePresence mode="wait">
            {scrolled
              ? <motion.div key="go" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><Primary /></motion.div>
              : links.secondary && <motion.div key="in" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Link to={links.secondary.to} state={links.secondary.state} className="kl-signin">Sign in</Link></motion.div>}
          </AnimatePresence>
        </div>
      </header>

      <main>
        <section className="kl-hero">
          <div className="kl-wrap kl-hero-grid">
            <HeroCrew />
            <div className="kl-hero-copy">
              <motion.span className="kl-course-badge" style={{ '--c': course.theme.color, '--d': course.theme.deep }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <GraduationCap size={18} /> {course.level} course · Ages {course.ages}
              </motion.span>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>{copy.heroTitle}</motion.h1>
              <motion.div className="kl-hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.5 }}>
                <Primary big />
                {links.secondary && <Link to={links.secondary.to} state={links.secondary.state} className="kid-btn kid-btn-ghost kid-btn-xl kl-wide">{links.secondary.label}</Link>}
              </motion.div>
              <p className="kl-hero-note">{copy.heroNote}</p>
            </div>
          </div>
        </section>

        <section className="kl-facts" aria-label={`${course.name} at a glance`}>
          <div className="kl-wrap kl-facts-row">
            {course.facts.map((fact, i) => (
              <Reveal key={fact.label} delay={i * 0.06} className="kl-fact">
                <b>{fact.value}</b><span>{fact.label}</span>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="kl-band-strip">
          <div className="kl-wrap">
            <p className="kl-strip-title">Meet the Chess Crew</p>
            <CrewStrip />
          </div>
        </section>

        <section className="kl-feature">
          <div className="kl-wrap kl-feature-grid">
            <Reveal className="kl-feature-copy">
              <h2>{copy.play.title}</h2>
              <p>{copy.play.text}</p>
            </Reveal>
            <Reveal delay={0.1}><DemoPuzzle /></Reveal>
          </div>
        </section>

        <section className="kl-feature kl-feature-alt">
          <div className="kl-wrap kl-feature-grid kl-reverse">
            <Reveal className="kl-feature-copy">
              <h2>{copy.climb.title}</h2>
              <p>{copy.climb.text}</p>
            </Reveal>
            <Reveal delay={0.1}><MiniMountain /></Reveal>
          </div>
        </section>

        <section className="kl-feature">
          <div className="kl-wrap">
            <Reveal className="kl-feature-copy kl-center">
              <h2>{copy.three.title}</h2>
              <p>{copy.three.text}</p>
            </Reveal>
            <div className="kl-three">
              {[
                { icon: Clapperboard, title: 'Animated lessons', text: 'A friendly character shows how each piece moves.', color: '#FF6B6B', deep: '#D94B4B' },
                { icon: Gamepad2, title: 'Mini games', text: 'Star puzzles that grow with your child, one small win at a time.', color: '#2DA8F0', deep: '#1886C7' },
                { icon: Printer, title: 'Printable worksheets', text: 'Colour, draw and play away from the screen, together.', color: '#FF9F43', deep: '#DB7E1F' },
              ].map((card, i) => {
                const Icon = card.icon;
                return (
                  <Reveal key={card.title} delay={i * 0.08} className="kl-three-card">
                    <span className="kl-three-icon" style={{ '--c': card.color, '--d': card.deep }}><Icon size={34} strokeWidth={2.5} /></span>
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="kl-feature kl-feature-alt">
          <div className="kl-wrap kl-feature-grid">
            <Reveal className="kl-feature-copy">
              <h2>{copy.crew.title}</h2>
              <p>{copy.crew.text}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="kl-chest-demo">
                <span className="kl-chest-icon"><Gift size={54} strokeWidth={2.4} /></span>
                <ArrowRight size={34} className="kl-chest-arrow" />
                <div className="kl-chest-card" style={{ '--c': CREW.bishop.color, '--d': CREW.bishop.shade }}>
                  <span>NEW FRIEND!</span>
                  <Character id="bishop" mood="happy" size={110} />
                  <b>Bea</b>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="kl-feature kl-learns">
          <div className="kl-wrap">
            <Reveal className="kl-feature-copy kl-center">
              <h2>what your child will learn.</h2>
              <p>Chess Course {course.courseNumber}: meet the pieces, one a day, plus the chess basics.</p>
            </Reveal>
            <ol className="kl-learn-list">
              {copy.learns.map((title, i) => (
                <Reveal key={title} delay={i * 0.03} className="kl-learn-item">
                  <span>{i + 1}</span>{title}
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section className="kl-grownups-band">
          <div className="kl-wrap kl-feature-grid">
            <Reveal className="kl-feature-copy">
              <h2>{copy.grownups.title}</h2>
              <p>{copy.grownups.text}</p>
              <div className="kl-grownup-links">
                <Link to="/curriculum" className="kid-btn kid-btn-blue"><GraduationCap size={20} /> Lesson planner</Link>
                <Link to="/book" className="kid-btn kid-btn-ghost">Book an Introductory Session</Link>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="kl-grownup-list">
              {[
                [FileText, 'Unit-by-unit lesson plans'],
                [Printer, 'Printable worksheets'],
                [LockKeyhole, 'A grown-up check before the parent view'],
                [Sparkles, 'Gentle rewards, no leaderboards'],
              ].map(([Icon, text]) => (
                <div key={text}><span><Icon size={22} /></span>{text}</div>
              ))}
            </Reveal>
          </div>
        </section>

        <section className="kl-cta">
          <div className="kl-wrap kl-center">
            <Reveal>
              <div className="kl-cta-crew">{CREW_ORDER.map((id, i) => <motion.span key={id} animate={reduce ? undefined : { y: [0, -8, 0] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}><Character id={id} size={64} mood="happy" /></motion.span>)}</div>
              <h2>{copy.cta}</h2>
              <Primary big />
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="kl-footer">
        <div className="kl-wrap kl-footer-grid">
          <div>
            <h3>{course.name}</h3>
            <Link to={course.playPath}>{course.world}</Link>
            <Link to={`${course.playPath}/crew`}>My crew</Link>
            <Link to="/courses">All courses</Link>
          </div>
          <div>
            <h3>Grown-ups</h3>
            <Link to="/curriculum">Lesson planner</Link>
            <Link to="/courses">Courses</Link>
            <Link to="/book">Book an Introductory Session</Link>
          </div>
          <div>
            <h3>Account</h3>
            <Link to="/login">Sign in</Link>
            <Link to="/signup">Create an account</Link>
            <Link to="/parents">Parent view</Link>
          </div>
          <div className="kl-footer-brand">
            <Character id="pawn" mood="happy" size={70} crown />
            <p>The Thinking Academy</p>
            <small><Star size={14} fill="currentColor" /> Little moves. Big thinkers.</small>
          </div>
        </div>
      </footer>
    </div>
  );
}
