import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowRight, Check, Gift, Lock, Play, Printer, ShieldCheck, Sparkles, Star, UserRound } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { CourseChessPiece } from '../components/CourseChessPiece';
import { Character } from '../kids/Characters';
import { EASE, Faq, Reveal, Scribble, SitePage, wa } from './site';
import './homecourse.css';

const inr = (n) => `₹${n.toLocaleString('en-IN')}`;

const CREW = { 1: ['rook', 'Rocco'], 2: ['bishop', 'Bea'], 3: ['queen', 'Queenie'], 4: ['king', 'King Kip'], 5: ['pawn', 'Pip'], 6: ['knight', 'Kit'] };

const PARTS = [
  { id: 1, title: 'Meet the pieces', blurb: 'Every piece, then check, checkmate and stalemate.', std: 999, per: 1999, color: '#B5452F',
    sessions: [['The Rook', 'Straight lines — the easiest piece for little eyes.'], ['The Bishops', 'Diagonals, and never changing colour.'], ['The Queen', 'The strongest piece on the board.'], ['The King', 'Slow, important, always kept safe.'], ['The Pawn', 'The little soldier with surprises.'], ['The Knight', 'The tricky L-shaped jumper.'], ['Check', 'Spotting a king in danger — and three ways out.'], ['Checkmate', 'How a game is actually won.'], ['Stalemate', 'The draw kids find funny.'], ['Teamwork for checkmate', 'Pieces working together.']] },
  { id: 2, title: 'First checkmates & special moves', blurb: 'Real checkmates, castling, pawn tricks and starting a game.', std: 1499, per: 2499, color: '#C98A1B',
    sessions: [['King and Queen mate', 'Their first real checkmate.'], ['The rook roller', 'Two rooks push the king to the edge.'], ['Castling', 'Tucking the king away safely.'], ['Special pawn moves', 'Promotion and en passant.'], ['Back-rank mates', 'The trap behind the pawns.'], ['Starting the game, part 1', 'Take the middle, bring pieces out.'], ['Starting the game, part 2', 'Castle early, queen later.'], ['Hanging pieces', 'The habit that wins games.'], ['Counting', 'Attackers versus defenders.'], ['Double attack', 'One move, two threats.']] },
  { id: 3, title: 'Tactics & real games', blurb: 'Forks, pins, skewers — then full games with a plan.', std: 1999, per: 2999, color: '#4F6E41',
    sessions: [['The fork', 'Attacking two pieces at once.'], ['The pin', 'A piece that can’t move.'], ['The skewer', 'The big piece has to run.'], ['Discovered attacks', 'Including double check.'], ['King and Rook mate', 'Harder than it looks.'], ['Your opponent', 'What are they trying to do?'], ['The three parts of a game', 'Opening, middle and end.'], ['Passed pawns', 'The run to become a queen.'], ['The opposition', 'When the two kings face off.'], ['The weak square', 'The f7/f2 traps, and how to stop them.']] },
];
const BUNDLE = { std: 3999, per: 6499 };
const fullPrice = (key) => PARTS.reduce((sum, part) => sum + part[key], 0);

const FAVS = [['🦖', 'Dinosaurs'], ['🏏', 'Cricket'], ['🚀', 'Space'], ['🐱', 'Cats'], ['⚽', 'Football'], ['🦋', 'Butterflies']];
const COLOURS = [['#E2584A', 'Red'], ['#F2A93B', 'Orange'], ['#4F9D69', 'Green'], ['#3E8EDE', 'Blue'], ['#9B7BF7', 'Purple'], ['#F07AB0', 'Pink']];

const FAQS = [
  ['I don’t know chess. Can I teach this?', 'Yes. Rathish’s video before every session shows you exactly what to say and do. You learn together.'],
  ['Which part should we start with?', 'Part 1, if your child is new to chess. It starts from the very first piece.'],
  ['How long does each session take?', 'About 20–30 minutes in total. Split it across the day if your child wants a break — there’s no rush.'],
  ['What happens after I pay?', 'You get your Crown Quest parent login. For the personalised version, we’ll first ask for your child’s name, favourite things and colours.'],
  ['We’re in live classes. Do we pay for this?', 'No — live-class families get the Home Course included. Just use your parent login.'],
];

function buyLink(what, personalised, price) {
  return wa(`Hi! I’d like to buy the Home Course: ${what} (${personalised ? 'Personalised' : 'Standard'}) for ${inr(price)}.`);
}

/* ---------------------------------------------------------------- toggle */
function VersionToggle({ personalised, onChange, size = 'md' }) {
  return (
    <div className={`hc-toggle hc-toggle-${size}`} role="radiogroup" aria-label="Course version">
      {[['standard', 'Standard'], ['personalised', 'Personalised']].map(([id, label]) => {
        const on = (id === 'personalised') === personalised;
        return (
          <button key={id} type="button" role="radio" aria-checked={on} className={on ? 'is-on' : ''} onClick={() => onChange(id === 'personalised')}>
            {on && <motion.span layoutId={`hc-toggle-${size}`} className="hc-toggle-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span>{id === 'personalised' && <Sparkles size={14} />}{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------- hero kit */
function SessionKit({ personalised, name, fav, colour }) {
  const kid = name.trim() || 'Aarav';
  const reduce = useReducedMotion();
  return (
    <div className="hc-kit" style={{ '--accent': personalised ? colour : '#B5452F' }} aria-hidden="true">
      <div className="hc-kit-screen">
        <div className="hc-kit-bar"><i /><i /><i /><span>Session 6 · The Knight</span></div>
        <div className="hc-kit-stage">
          <motion.span animate={reduce ? undefined : { y: [0, -14, 0], rotate: [0, -4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}><Character id="knight" mood="happy" size={118} /></motion.span>
          <AnimatePresence mode="wait">
            <motion.p key={personalised ? kid : 'std'} className="hc-kit-bubble" initial={{ opacity: 0, y: 8, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.28 }}>
              {personalised ? <>Hi <b>{kid}</b>! I’m Kit. I jump in an L!</> : <>Hi! I’m Kit. I jump in an L!</>}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <motion.div className="hc-kit-sheet" animate={{ rotate: personalised ? 5 : 3 }} transition={{ type: 'spring', stiffness: 160, damping: 14 }}>
        <span className="hc-sheet-tag">Worksheet</span>
        <AnimatePresence mode="wait">
          <motion.b key={personalised ? `${kid}-${fav}` : 'std'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {personalised ? `${kid}’s Knight Hunt ${fav}` : 'Knight Hunt'}
          </motion.b>
        </AnimatePresence>
        <div className="hc-sheet-grid">
          {Array.from({ length: 16 }, (_, i) => <i key={i} className={[1, 6, 8, 13].includes(i) ? 'is-ring' : (Math.floor(i / 4) + i) % 2 ? 'is-dark' : ''} />)}
          <span className="hc-sheet-knight"><CourseChessPiece type="n" color="w" /></span>
        </div>
        <small>Circle every square the knight can land on.</small>
      </motion.div>

      <div className="hc-kit-video">
        <span className="hc-kit-face" style={{ backgroundImage: 'url(/academy/coach-rathish.avif)' }} />
        <span><b>Rathish · what to teach today</b><small><Play size={11} fill="currentColor" /> 2 min · for you</small></span>
      </div>

      <div className="hc-kit-game">
        <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
        <span>Mini-game</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- four things */
function FourThings() {
  const items = [
    { no: '1 · For you', title: 'A video from Rathish', text: <>Before each lesson, Rathish explains to <b>you</b> what to teach, how to say it, and the mistakes kids usually make. Two minutes, and you’re ready.</>, tint: '#EAD5BF',
      art: <div className="hc-art-video"><span style={{ backgroundImage: 'url(/academy/coach-rathish.avif)' }} /><i><Play size={18} fill="currentColor" /></i><small>For grown-ups</small></div> },
    { no: '2 · For your child', title: 'An animated video', text: 'A short cartoon story where a Chess Crew friend shows how their piece moves. Stories are how little kids remember best.', tint: '#DDE3D0',
      art: <div className="hc-art-cartoon"><Character id="bishop" mood="happy" size={86} /><span className="hc-art-path" /></div> },
    { no: '3 · Together', title: 'A mini-game', text: 'A tiny game you play together — on screen or on a real board. Move the piece, catch the stars, hear a cheer.', tint: '#F2DFB5',
      art: <div className="hc-art-game">{Array.from({ length: 9 }, (_, i) => <i key={i} className={i % 2 ? 'd' : ''}>{i === 2 || i === 6 ? <Star size={16} fill="currentColor" /> : i === 4 ? <CourseChessPiece type="r" color="w" /> : null}</i>)}</div> },
    { no: '4 · Away from the screen', title: 'A worksheet', text: 'Print it out. Colour, circle and draw to practise the same idea — no screen needed.', tint: '#F5E9F0',
      art: <div className="hc-art-sheet"><Printer size={18} /><span /><span /><span className="short" /><em>✎</em></div> },
  ];
  return (
    <div className="hc-four">
      {items.map((item, i) => (
        <Reveal key={item.title} delay={i * 0.07} className="hc-four-card">
          <div className="hc-four-art" style={{ background: item.tint }}>{item.art}</div>
          <span className="hc-four-no">{item.no}</span>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </Reveal>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- sessions */
function Sessions({ personalised, signedIn }) {
  const [part, setPart] = useState(0);
  const item = PARTS[part];
  const price = personalised ? item.per : item.std;
  return (
    <div className="hc-sessions">
      <div className="hc-part-tabs" role="tablist" aria-label="Course parts">
        {PARTS.map((p, i) => (
          <button key={p.id} type="button" role="tab" aria-selected={part === i} className={part === i ? 'is-on' : ''} style={{ '--c': p.color }} onClick={() => setPart(i)}>
            <span className="hc-part-no">{p.id}</span>
            <span><b>Part {p.id}</b><small>Sessions {p.id * 10 - 9}–{p.id * 10}</small></span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={part} className="hc-part" role="tabpanel" style={{ '--c': item.color }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.32, ease: EASE }}>
          <div className="hc-part-head">
            <div>
              <span className="hc-part-kicker">Part {item.id} · Sessions {item.id * 10 - 9}–{item.id * 10}</span>
              <h3>{item.title}</h3>
              <p>{item.blurb}</p>
            </div>
            <div className="hc-part-buy">
              <AnimatePresence mode="popLayout"><motion.b key={price} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>{inr(price)}</motion.b></AnimatePresence>
              <small>one-time{personalised ? ' · personalised' : ''}</small>
              {signedIn
                ? <Link className="ah-btn ah-btn-dark ah-btn-sm" to="/parents">Open your course</Link>
                : <a className="ah-btn ah-btn-dark ah-btn-sm" href={buyLink(`Part ${item.id}`, personalised, price)} target="_blank" rel="noreferrer">Buy Part {item.id}</a>}
            </div>
          </div>
          <ol className="hc-sess-list">
            {item.sessions.map(([title, text], i) => {
              const n = item.id * 10 - 9 + i;
              const crew = CREW[n];
              return (
                <motion.li key={title} className="hc-sess" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i }}>
                  <span className="hc-sess-no">{n}</span>
                  <span className="hc-sess-copy"><b>{title}</b><small>{text}</small></span>
                  {crew && <span className="hc-sess-crew" title={`with ${crew[1]}`}><Character id={crew[0]} mood="happy" size={44} /><em>with {crew[1]}</em></span>}
                </motion.li>
              );
            })}
          </ol>
        </motion.div>
      </AnimatePresence>
      <Reveal className="hc-bundle">
        <span className="hc-bundle-ribbon"><Gift size={15} /> Best value · all 30 sessions</span>
        <div>
          <h3>Get all three parts</h3>
          <p>Part 1 + Part 2 + Part 3, in one go.</p>
        </div>
        <div className="hc-bundle-price">
          <s>{inr(fullPrice(personalised ? 'per' : 'std'))}</s>
          <b>{inr(personalised ? BUNDLE.per : BUNDLE.std)}</b>
        </div>
        {signedIn
          ? <Link className="ah-btn ah-btn-cream" to="/parents">Open your course <ArrowRight size={16} /></Link>
          : <a className="ah-btn ah-btn-cream" href={buyLink('all 30 sessions', personalised, personalised ? BUNDLE.per : BUNDLE.std)} target="_blank" rel="noreferrer">Buy all 30 sessions <ArrowRight size={16} /></a>}
      </Reveal>
    </div>
  );
}

/* ---------------------------------------------------------------- session 6 */
const KNIGHT_STEPS = [
  ['You watch Rathish', 'He shows you the knight’s L-shaped jump and how to explain “one, two, turn”.', '#9A3F2B'],
  ['Your child meets Kit', 'Kit the knight hops through a cartoon story, jumping over everything in the way.', '#A06E12'],
  ['You play Knight Race', 'Two knights race to each other’s starting square. Child goes first, then you.', '#4E6A3E'],
  ['Print the worksheet', 'Circle every square the knight can land on. Spot how it always changes colour.', '#2A1E1A'],
];

function StepVisual({ step }) {
  if (step === 0) return <div className="hc-v hc-v-video"><span style={{ backgroundImage: 'url(/academy/coach-rathish.avif)' }} /><p>“One, two, <b>turn</b>.”</p></div>;
  if (step === 1) return <div className="hc-v hc-v-kit"><motion.span animate={{ x: [0, 60, 120], y: [0, -40, 0] }} transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.4, ease: 'easeInOut' }}><Character id="knight" mood="happy" size={92} /></motion.span></div>;
  if (step === 2) {
    return (
      <div className="hc-v hc-v-race">
        <div className="hc-race-board">
          {Array.from({ length: 16 }, (_, i) => <i key={i} className={(Math.floor(i / 4) + i) % 2 ? 'd' : ''} />)}
          <motion.span className="hc-race-n" initial={{ left: '0%', top: '75%' }} animate={{ left: ['0%', '25%', '75%'], top: ['75%', '25%', '0%'] }} transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 0.6 }}><CourseChessPiece type="n" color="w" /></motion.span>
          <motion.span className="hc-race-n" initial={{ left: '75%', top: '0%' }} animate={{ left: ['75%', '50%', '0%'], top: ['0%', '50%', '75%'] }} transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 0.6, delay: 0.3 }}><CourseChessPiece type="n" color="b" /></motion.span>
        </div>
      </div>
    );
  }
  return (
    <div className="hc-v hc-v-sheet">
      <div className="hc-v-paper">
        {Array.from({ length: 16 }, (_, i) => <i key={i} className={(Math.floor(i / 4) + i) % 2 ? 'd' : ''}>{[2, 7, 9, 14].includes(i) && <motion.em initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.03, type: 'spring' }} />}</i>)}
      </div>
    </div>
  );
}

function KnightSession() {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const running = inView && !paused && !reduce;
  useEffect(() => {
    if (!running) return undefined;
    const id = setTimeout(() => setStep((s) => (s + 1) % KNIGHT_STEPS.length), 3800);
    return () => clearTimeout(id);
  }, [running, step]);
  return (
    <div className="hc-knight" ref={ref} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="hc-knight-stage">
        <AnimatePresence mode="wait">
          <motion.div key={step} className="hc-knight-stage-in" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}><StepVisual step={step} /></motion.div>
        </AnimatePresence>
        <span className="hc-clock">About 20–30 minutes</span>
      </div>
      <ol className="hc-knight-steps" role="tablist" aria-label="Session 6 steps">
        {KNIGHT_STEPS.map(([title, text, color], i) => (
          <li key={title}>
            <button type="button" role="tab" aria-selected={step === i} className={step === i ? 'is-on' : ''} style={{ '--c': color }} onClick={() => { setStep(i); setPaused(true); }}>
              <b className="hc-big">{i + 1}</b>
              <span><strong>{title}</strong><small>{text}</small></span>
              <span className="hc-step-bar">{step === i && <motion.i key={`${step}-${running}`} initial={{ scaleX: running ? 0 : 1 }} animate={{ scaleX: 1 }} transition={{ duration: running ? 3.8 : 0, ease: 'linear' }} />}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------------------------------------------------------------- personalise */
function Personaliser({ name, setName, fav, setFav, colour, setColour }) {
  const kid = name.trim() || 'Your child';
  return (
    <div className="hc-maker">
      <div className="hc-maker-form">
        <span className="hc-maker-step">You tell us 3 things</span>
        <label className="hc-maker-field">
          <span>1 · Your child’s name</span>
          <input value={name} onChange={(e) => setName(e.target.value.slice(0, 20))} placeholder="e.g. Aarav" aria-label="Your child’s name" />
        </label>
        <div className="hc-maker-field">
          <span>2 · Favourite things</span>
          <div className="hc-fav-row">
            {FAVS.map(([emoji, label]) => (
              <button key={label} type="button" className={fav === emoji ? 'is-on' : ''} aria-pressed={fav === emoji} onClick={() => setFav(emoji)}><span aria-hidden="true">{emoji}</span>{label}</button>
            ))}
          </div>
        </div>
        <div className="hc-maker-field">
          <span>3 · Favourite colour</span>
          <div className="hc-colour-row">
            {COLOURS.map(([hex, label]) => (
              <button key={hex} type="button" className={colour === hex ? 'is-on' : ''} aria-pressed={colour === hex} aria-label={label} style={{ '--sw': hex }} onClick={() => setColour(hex)} />
            ))}
          </div>
        </div>
        <p className="hc-maker-note"><ShieldCheck size={15} /> No photos needed. This preview stays on your device.</p>
      </div>
      <motion.div className="hc-maker-sheet" style={{ '--sw': colour }} layout>
        <div className="hc-maker-top">
          <span className="hc-maker-badge">Session 6</span>
          <AnimatePresence mode="wait"><motion.h4 key={`${kid}${fav}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{kid}’s Knight Hunt</motion.h4></AnimatePresence>
          <span className="hc-maker-fav" aria-hidden="true">{fav}</span>
        </div>
        <p className="hc-maker-q">Help Kit find the squares! Circle every square the knight can land on.</p>
        <div className="hc-maker-board">
          {Array.from({ length: 25 }, (_, i) => {
            const target = [7, 11, 13, 17].includes(i);
            return <i key={i} className={(Math.floor(i / 5) + (i % 5)) % 2 ? 'd' : ''}>{i === 12 ? <CourseChessPiece type="n" color="w" /> : target ? <span aria-hidden="true">{fav}</span> : null}</i>;
          })}
        </div>
        <div className="hc-maker-foot"><Character id="knight" mood="cheer" size={54} /><span>Great hopping, <b>{kid}</b>!</span></div>
      </motion.div>
    </div>
  );
}

function CompareTable({ personalised }) {
  const rows = [
    ['Rathish’s parent video for every lesson', true, true],
    ['Animated video for every lesson', true, true],
    ['Mini-game for every lesson', true, true],
    ['Printable worksheet for every lesson', true, true],
    [<>Animations say <b>your child’s name</b></>, false, true],
    [<>Worksheets use <b>your child’s favourite things</b></>, false, true],
    [<>Pages in <b>your child’s favourite colours</b></>, false, true],
  ];
  return (
    <div className="hc-table-wrap">
      <table className={`hc-table ${personalised ? 'is-per' : 'is-std'}`}>
        <thead><tr><th scope="col">What you get</th><th scope="col">Standard</th><th scope="col" className="hc-col-per">Personalised</th></tr></thead>
        <tbody>
          {rows.map(([label, std, per], i) => (
            <tr key={i}><td>{label}</td><td>{std ? <Check size={18} strokeWidth={3} /> : <span className="hc-dash">—</span>}</td><td className="hc-col-per">{per ? <Check size={18} strokeWidth={3} /> : '—'}</td></tr>
          ))}
          {PARTS.map((p) => <tr key={p.id} className="hc-price-row"><td><b>Part {p.id}</b> · sessions {p.id * 10 - 9}–{p.id * 10}</td><td>{inr(p.std)}</td><td className="hc-col-per">{inr(p.per)}</td></tr>)}
          <tr className="hc-price-row is-total"><td><b>All 30 sessions</b></td><td>{inr(BUNDLE.std)}</td><td className="hc-col-per">{inr(BUNDLE.per)}</td></tr>
        </tbody>
      </table>
    </div>
  );
}

/* ---------------------------------------------------------------- page */
export default function HomeCoursePage() {
  const { user } = useAuth();
  const [personalised, setPersonalised] = useState(false);
  const [name, setName] = useState('');
  const [fav, setFav] = useState('🦖');
  const [colour, setColour] = useState('#3E8EDE');
  const fromPrice = personalised ? PARTS[0].per : PARTS[0].std;

  return (
    <SitePage title="The Home Course · Ages 4–6" className="hc-page">
      <section className="ah-wrap hc-hero">
        <div className="hc-hero-copy">
          <Reveal><span className="ah-kicker">The Home Course · Ages 4–6</span></Reveal>
          <Reveal delay={0.05}><h1>30 sessions.<br />3 parts.<br /><em>You and your child.</em></h1></Reveal>
          <Reveal delay={0.1}><p className="ah-lead">Teach chess at home, side by side. Every session comes with a video for you, a cartoon for them, a game to play together and <Scribble>a worksheet to print.</Scribble></p></Reveal>
          <Reveal delay={0.14}><VersionToggle personalised={personalised} onChange={setPersonalised} /></Reveal>
          <Reveal delay={0.18} className="ah-actions">
            {user ? (
              <>
                <Link className="ah-btn ah-btn-dark" to="/parents">Open your course <ArrowRight size={16} /></Link>
                <Link className="ah-btn ah-btn-line" to="/play">Kids view</Link>
              </>
            ) : (
              <>
                <a className="ah-btn ah-btn-dark" href="#sessions">See all 30 sessions <ArrowRight size={16} /></a>
                <Link className="ah-btn ah-btn-line" to="/login" state={{ from: '/parents' }}><UserRound size={16} /> I already have a login</Link>
              </>
            )}
          </Reveal>
          <Reveal delay={0.22}>
            <p className="hc-from">
              From <AnimatePresence mode="popLayout"><motion.b key={fromPrice} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}>{inr(fromPrice)}</motion.b></AnimatePresence>
              <span>· One-time payment · Included for live-class families</span>
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="hc-hero-art">
          <SessionKit personalised={personalised} name={name} fav={fav} colour={colour} />
          <AnimatePresence>
            {personalised && (
              <motion.label className="hc-hero-name" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                <span>Try it with your child’s name</span>
                <input value={name} onChange={(e) => setName(e.target.value.slice(0, 20))} placeholder="Aarav" />
              </motion.label>
            )}
          </AnimatePresence>
        </Reveal>
      </section>

      <section className="ah-stats hc-stats" aria-label="The Home Course in numbers">
        <div className="ah-wrap ah-stats-row">
          {[['30', 'sessions, from first piece to full game'], ['3 parts', '10 sessions each — buy one at a time'], ['4', 'things in every session'], ['6', 'Chess Crew friends to collect']].map(([v, l]) => <div key={l}><b>{v}</b><span>{l}</span></div>)}
        </div>
        <div className="hc-crew-line" aria-hidden="true">
          {['pawn', 'rook', 'bishop', 'knight', 'queen', 'king'].map((id, i) => (
            <motion.span key={id} initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08, type: 'spring', stiffness: 220, damping: 14 }}><Character id={id} mood="happy" size={52} /></motion.span>
          ))}
        </div>
      </section>

      <section className="ah-section ah-wrap">
        <Reveal><span className="ah-kicker">Inside every session</span></Reveal>
        <Reveal delay={0.05}><h2>Four things, <em>every single time.</em></h2></Reveal>
        <Reveal delay={0.08}><p className="ah-sub hc-sub">So you always know what to do — even if you’ve never played chess.</p></Reveal>
        <FourThings />
      </section>

      <section className="ah-section ah-wrap" id="sessions">
        <div className="ah-head-split">
          <div>
            <Reveal><span className="ah-kicker">All 30 sessions</span></Reveal>
            <Reveal delay={0.05}><h2>From the first piece to <em>a full game.</em></h2></Reveal>
          </div>
          <Reveal delay={0.1} className="hc-head-aside">
            <p className="ah-sub">Pick a part to see its 10 sessions. Start with Part 1 if your child is new to chess.</p>
            <VersionToggle personalised={personalised} onChange={setPersonalised} size="sm" />
          </Reveal>
        </div>
        <Sessions personalised={personalised} signedIn={Boolean(user)} />
      </section>

      <section className="ah-dark">
        <div className="ah-wrap ah-section">
          <Reveal><span className="ah-kicker ah-kicker-light">A session, step by step</span></Reveal>
          <Reveal delay={0.05}><h2>Session 6: <em className="ah-gold">the Knight.</em></h2></Reveal>
          <Reveal delay={0.08}><p className="ah-sub ah-sub-light">Here’s what one session looks like at home. About 20–30 minutes, split however you like.</p></Reveal>
          <Reveal delay={0.1}><KnightSession /></Reveal>
        </div>
      </section>

      <section className="ah-section ah-wrap" id="personalised">
        <Reveal><span className="ah-kicker">Standard or personalised · +₹1,000 per part</span></Reveal>
        <Reveal delay={0.05}><h2>Same sessions. One is <em>made for them.</em></h2></Reveal>
        <Reveal delay={0.08}><p className="ah-sub hc-sub">Both versions teach exactly the same things. The personalised one makes your child the star of every story. Try it:</p></Reveal>
        <Reveal delay={0.1}><Personaliser name={name} setName={setName} fav={fav} setFav={setFav} colour={colour} setColour={setColour} /></Reveal>
        <div className="hc-compare">
          <Reveal><CompareTable personalised={personalised} /></Reveal>
          <div className="hc-how">
            {[['You buy', 'Pick Personalised and pay with Razorpay.'], ['You tell us 3 things', 'Your child’s name, favourite things (dinosaurs, cricket, space…) and favourite colours. No photos needed.'], ['We make it for them', 'Their name in the cartoons, their favourite things and colours in the worksheets — ready in your parent login.']].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.08} className="hc-how-step"><span>{i + 1}</span><div><b>{t}</b><p>{d}</p></div></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="ah-section ah-wrap hc-grown">
        <div>
          <Reveal><span className="ah-kicker">Made for grown-ups too</span></Reveal>
          <Reveal delay={0.05}><h2>You don’t need to <em>know chess.</em></h2></Reveal>
        </div>
        <div className="hc-grown-grid">
          {[
            [Check, 'Lesson planner', 'Goals, activities and talking points for every session.'],
            [Lock, 'Grown-up check', 'A quick check before the parent area, so little hands stay on the kids’ side.'],
            [Star, 'Gentle rewards', 'Stars, chests and crew friends. No leaderboards, no pressure.'],
            [UserRound, 'Your own login', 'Everything lives in your Crown Quest parent dashboard.'],
          ].map(([Icon, t, d], i) => (
            <Reveal key={t} delay={i * 0.06} className="hc-grown-card"><span><Icon size={20} /></span><b>{t}</b><p>{d}</p></Reveal>
          ))}
        </div>
      </section>

      <section className="ah-section ah-wrap pg-faq-section">
        <div>
          <Reveal><span className="ah-kicker">Good to know</span></Reveal>
          <Reveal delay={0.05}><h2>Questions <em>parents ask.</em></h2></Reveal>
        </div>
        <Reveal delay={0.1}><Faq items={FAQS} /></Reveal>
      </section>

      <section className="ah-wrap ah-cta-wrap">
        <Reveal className="ah-cta hc-final">
          <div className="ah-cta-copy">
            <h2>Start with <em className="ah-gold">Part 1.</em></h2>
            <p>Sessions 1–10 · {inr(personalised ? PARTS[0].per : PARTS[0].std)} one-time{personalised ? ' · personalised' : ''}</p>
            <div className="ah-cta-actions">
              {user
                ? <Link className="ah-btn ah-btn-cream" to="/parents">Open your course <ArrowRight size={16} /></Link>
                : <a className="ah-btn ah-btn-cream" href={buyLink('Part 1', personalised, personalised ? PARTS[0].per : PARTS[0].std)} target="_blank" rel="noreferrer">Buy Part 1 <ArrowRight size={16} /></a>}
              <Link className="ah-btn ah-btn-outline-light" to="/book">Or try a free live class</Link>
            </div>
          </div>
          <div className="hc-final-crew" aria-hidden="true">
            {['rook', 'bishop', 'queen', 'king', 'pawn', 'knight'].map((id, i) => (
              <motion.span key={id} animate={{ y: [0, -10, 0] }} transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}><Character id={id} mood={i === 4 ? 'cheer' : 'happy'} size={i === 4 ? 84 : 62} /></motion.span>
            ))}
          </div>
        </Reveal>
      </section>
    </SitePage>
  );
}
