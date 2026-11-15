import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, MessageCircle, Star } from 'lucide-react';
import { CourseChessPiece } from '../components/CourseChessPiece';
import { Character } from '../kids/Characters';
import { CHAT, COACHES, EASE, HOME_COURSE, Reveal, Scribble, SiteFooter, SiteHeader, TESTIMONIALS } from './site';
import { CERT_NOTE, INTRO, PARTS, PLANS, inr } from './data';
import { KnightBoard } from './KnightBoard';

/* ---------------------------------------------------------------- stats */
function CountUp({ to, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return undefined;
    const controls = animate(0, to, { duration: 1.4, ease: EASE, onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, reduce, to]);
  return <b ref={ref}>{value}{suffix}</b>;
}

const STATS = [
  { to: 200, suffix: '+', label: 'students taught' },
  { to: 6, label: 'FIDE-rated coaches' },
  { to: 7, suffix: '+ years', label: 'Rathish has coached children' },
  { to: 3, suffix: ' countries', label: 'families in India, the US & the UK' },
];

/* ---------------------------------------------------------------- two ways */
const WAYS = {
  coach: {
    label: 'Live classes', kicker: 'Coach-led · monthly payment', title: 'A coach teaches your child, online',
    points: ['Personal (one child) or paired (two children)', 'Eight 30-minute classes per month', 'Your coach adapts to your child’s pace'],
    prices: [[PLANS.paired.price, 'per child / month', 'Paired classes'], [PLANS.personal.price, '/ month', 'Personal classes']],
    note: 'The free first class is always one coach and one child.',
    cta: { label: 'See live classes and prices', href: '/programs' },
  },
  home: {
    label: 'Home Course', kicker: 'Parent-guided · paid', title: 'You and your child learn together at home',
    points: ['A paid course, bought in three parts of ten units', 'Parent guide, child lesson, activity and worksheet in each unit', 'Standard or personalised version'],
    prices: [['From ' + inr(PARTS[0].std), 'one-time, per part', 'Home Course']],
    note: 'Both options follow the same 30-unit curriculum.',
    cta: { label: 'Explore the Home Course', href: HOME_COURSE },
  },
};

function CoachScene() {
  return (
    <div className="ah-scene ah-scene-call" aria-hidden="true">
      <div className="ah-call-top"><i /><i /><i /><span>Live class · 30 min</span></div>
      <div className="ah-call-grid">
        <div className="ah-call-tile ah-call-coach"><span>R</span><small>Coach</small></div>
        <div className="ah-call-tile ah-call-kid"><Character id="pawn" mood="happy" size={74} /><small>Your child</small></div>
      </div>
      <div className="ah-call-board">
        {Array.from({ length: 16 }, (_, i) => <i key={i} className={(Math.floor(i / 4) + i) % 2 ? 'd' : ''} />)}
        <motion.span className="ah-call-rook" animate={{ x: ['0%', '300%', '300%', '0%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}><CourseChessPiece type="r" color="w" /></motion.span>
      </div>
    </div>
  );
}
function HomeScene() {
  const tiles = [['Video', 'Unit 1 · The Rook', '#EAD5BF'], ['Worksheet', 'Draw the rook’s roads', '#DDE3D0'], ['Mini-game', 'Collect 3 stars', '#F2DFB5']];
  return (
    <div className="ah-scene ah-scene-home" aria-hidden="true">
      {tiles.map(([kind, text, tint], i) => (
        <motion.div key={kind} className="ah-home-tile" style={{ background: tint, zIndex: 3 - i }} initial={{ rotate: 0, y: 0 }} animate={{ rotate: [-6, 3, 8][i], y: i * 26, x: i * 30 }} transition={{ type: 'spring', stiffness: 180, damping: 18, delay: i * 0.06 }}>
          <span>{kind}</span><b>{text}</b>
        </motion.div>
      ))}
      <div className="ah-home-name"><Character id="rook" mood="wave" size={58} /><span>Made for <b>Aarav</b></span></div>
    </div>
  );
}

function TwoWays() {
  const [way, setWay] = useState('coach');
  const data = WAYS[way];
  return (
    <div className="ah-ways">
      <div className="ah-switch" role="tablist" aria-label="Choose how your child learns">
        {Object.entries(WAYS).map(([id, item]) => (
          <button key={id} type="button" role="tab" aria-selected={way === id} className={way === id ? 'is-on' : ''} onClick={() => setWay(id)}>
            {way === id && <motion.span layoutId="ah-switch-pill" className="ah-switch-pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={way} className="ah-way" role="tabpanel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease: EASE }}>
          <div className="ah-way-copy">
            <span className="ah-kicker">{data.kicker}</span>
            <h3>{data.title}</h3>
            <ul>{data.points.map((point, i) => <motion.li key={point} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.07 }}><Check size={16} strokeWidth={3} />{point}</motion.li>)}</ul>
            <div className="ah-prices">{data.prices.map(([amount, unit, label]) => <p key={label} className="ah-price"><small>{label}</small><b>{amount}</b> {unit}</p>)}</div>
            <p className="ah-way-note">{data.note}</p>
            {data.cta.external
              ? <a className="ah-btn ah-btn-dark" href={data.cta.href} target="_blank" rel="noreferrer">{data.cta.label} <ArrowRight size={16} /></a>
              : <Link className="ah-btn ah-btn-dark" to={data.cta.href}>{data.cta.label} <ArrowRight size={16} /></Link>}
          </div>
          {way === 'coach' ? <CoachScene /> : <HomeScene />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------------- class steps */
const STEPS = [
  { title: 'Story first', text: 'Every idea starts as a short story — that’s how young children remember best.' },
  { title: 'Then we play', text: 'Mini-games and puzzles on the board. Lots of them, and lots of praise.' },
  { title: 'Then they show us', text: 'When your child can do it on their own, we move to the next unit. Never rushed.' },
];
const STEP_MS = 4200;

function StepScene({ step }) {
  if (step === 0) {
    return (
      <div className="ah-stage-story">
        <Character id="rook" mood="happy" size={120} />
        <motion.p className="ah-bubble" initial={{ opacity: 0, scale: 0.9, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.2 }}>
          “Rocco the rook only likes straight roads. Up, down, left, right — never wobbly!”
        </motion.p>
      </div>
    );
  }
  if (step === 1) {
    return (
      <div className="ah-stage-play">
        <div className="ah-mini">
          {Array.from({ length: 16 }, (_, i) => <i key={i} className={(Math.floor(i / 4) + i) % 2 ? 'd' : ''} />)}
          <motion.span className="ah-mini-star" animate={{ scale: [1, 1, 0] }} transition={{ duration: 1.6, times: [0, 0.6, 0.75] }}><Star size={20} fill="currentColor" /></motion.span>
          <motion.span className="ah-mini-rook" initial={{ x: '0%' }} animate={{ x: '300%' }} transition={{ duration: 1, delay: 0.5, ease: EASE }}><CourseChessPiece type="r" color="w" /></motion.span>
        </div>
        <motion.span className="ah-praise" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>Brilliant!</motion.span>
      </div>
    );
  }
  return (
    <div className="ah-stage-show">
      <Character id="pawn" mood="cheer" size={110} />
      <motion.div className="ah-unlock" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25, type: 'spring', stiffness: 260, damping: 16 }}>
        <Check size={18} strokeWidth={3} /> Did it alone · next unit
      </motion.div>
    </div>
  );
}

function ClassSteps() {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const running = inView && !paused && !reduce;
  useEffect(() => {
    if (!running) return undefined;
    const id = setTimeout(() => setStep((s) => (s + 1) % STEPS.length), STEP_MS);
    return () => clearTimeout(id);
  }, [running, step]);

  return (
    <div className="ah-steps" ref={ref} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="ah-step-list" role="tablist" aria-label="What a class looks like">
        {STEPS.map((item, i) => (
          <button key={item.title} type="button" role="tab" aria-selected={step === i} className={`ah-step ${step === i ? 'is-on' : ''}`} onClick={() => { setStep(i); setPaused(true); }}>
            <span className="ah-step-no">{i + 1}</span>
            <span className="ah-step-text"><b>{item.title}</b><span>{item.text}</span></span>
            <span className="ah-step-bar">{step === i && <motion.i key={`${step}-${running}`} initial={{ scaleX: running ? 0 : 1 }} animate={{ scaleX: 1 }} transition={{ duration: running ? STEP_MS / 1000 : 0, ease: 'linear' }} />}</span>
          </button>
        ))}
      </div>
      <div className="ah-stage" role="tabpanel" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div key={step} className="ah-stage-inner" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }}>
            <StepScene step={step} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- pawn to king */
const LADDER = [
  { type: 'p', name: 'Pawn', when: 'Where every child starts', phase: null },
  { type: 'n', name: 'Knight', when: 'Units 1–6 · Meet the pieces', phase: 1 },
  { type: 'b', name: 'Bishop', when: 'Units 7–12 · Check and checkmate', phase: 2 },
  { type: 'r', name: 'Rook', when: 'Units 13–18 · Special rules and first moves', phase: 3 },
  { type: 'q', name: 'Queen', when: 'Units 19–24 · Tactics', phase: 4 },
  { type: 'k', name: 'King', when: 'Units 25–30 · Playing real games', phase: 5 },
];

function PieceLadder() {
  const [active, setActive] = useState(0);
  const item = LADDER[active];
  const onKey = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') { event.preventDefault(); setActive((a) => Math.min(LADDER.length - 1, a + 1)); }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') { event.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
  };
  return (
    <div className="ah-ladder-wrap">
      <div className="ah-ladder" role="listbox" aria-label="Syllabus milestones from Pawn to King" tabIndex={0} onKeyDown={onKey}>
        <div className="ah-ladder-track"><motion.i animate={{ width: `${(active / (LADDER.length - 1)) * 100}%` }} transition={{ type: 'spring', stiffness: 200, damping: 26 }} /></div>
        {LADDER.map((piece, i) => (
          <button key={piece.name} type="button" role="option" aria-selected={active === i} className={`ah-rung ${i <= active ? 'is-reached' : ''} ${active === i ? 'is-on' : ''}`}
            style={{ '--step': i }} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)}>
            <motion.span className="ah-rung-piece" animate={{ y: active === i ? -14 : 0, scale: active === i ? 1.15 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
              <CourseChessPiece type={piece.type} color="w" />
            </motion.span>
            <span className="ah-rung-name">{piece.name}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={item.name} className="ah-cert" initial={{ opacity: 0, y: 14, rotate: -1.5 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }}>
          <span className="ah-cert-seal"><CourseChessPiece type={item.type} color="w" /></span>
          <div>
            <span className="ah-cert-kicker">{item.phase ? `Milestone · phase ${item.phase}` : 'The starting line'}</span>
            <h3>{item.name}</h3>
            <p>{item.when}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------------- quotes */
const QUOTES = [
  { quote: 'My kid is 6 years old and she is shy, but she liked Lakshaya sir. He is soft, with a low voice. She enjoys her class.', who: 'Parent of a 6-year-old', coach: 'Coach Lakshaya' },
  { quote: 'I have seen my son go from hating chess to absolutely loving it. Even his teachers were surprised to see the shift.', who: 'Parent', coach: 'Coach Gaayathri' },
  { quote: 'The coach tailors the lessons to her pace, making them both fun and educational.', who: 'Parent', coach: 'A few months with us' },
];

function QuoteDeck() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const go = (delta) => { setDir(delta); setIndex((i) => (i + delta + QUOTES.length) % QUOTES.length); };
  const item = QUOTES[index];
  return (
    <div className="ah-quotes">
      <div className="ah-quote-stage">
        <span className="ah-quote-mark" aria-hidden="true">“</span>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.figure key={index} className="ah-quote" custom={dir}
            initial={{ opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -40 }} transition={{ duration: 0.35, ease: EASE }}
            drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.25} onDragEnd={(_, info) => { if (info.offset.x < -60) go(1); if (info.offset.x > 60) go(-1); }}>
            <blockquote>{item.quote}</blockquote>
            <figcaption><b>{item.who}</b><span>{item.coach}</span></figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      <div className="ah-quote-nav">
        <button type="button" onClick={() => go(-1)} aria-label="Previous parent quote"><ArrowLeft size={18} /></button>
        <div className="ah-dots">{QUOTES.map((q, i) => <button key={q.coach} type="button" className={i === index ? 'is-on' : ''} aria-label={`Quote ${i + 1}`} aria-current={i === index} onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); }} />)}</div>
        <button type="button" onClick={() => go(1)} aria-label="Next parent quote"><ArrowRight size={18} /></button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- coaches */
function Coaches() {
  const [open, setOpen] = useState(null);
  return (
    <div className="ah-coaches">
      {COACHES.map((coach, i) => (
        <Reveal key={coach.id} delay={i * 0.06} as="button" type="button" className={`ah-coach ${open === i ? 'is-open' : ''}`}
          onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
          <span className="ah-coach-arch" style={{ background: coach.tint }}>
            <img className="ah-coach-photo" src={coach.photo} alt="" loading="lazy" style={{ objectPosition: coach.pos }} />
            <span className="ah-coach-blurb">{coach.short}</span>
          </span>
          <span className="ah-coach-role">{coach.role}</span>
          <span className="ah-coach-name">{coach.name}</span>
        </Reveal>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- page */
export function AcademyHome() {
  useEffect(() => { document.title = 'The Thinking Academy | Chess for kids aged 4 to 6'; }, []);

  return (
    <div className="ah-root">
      <SiteHeader />

      <main>
        <section className="ah-hero ah-wrap">
          <div className="ah-hero-copy">
            <Reveal><span className="ah-kicker">Made for little minds</span></Reveal>
            <Reveal delay={0.05}><h1>Chess for kids aged <em>4 to 6.</em></h1></Reveal>
            <Reveal delay={0.1}><p className="ah-lead">Choose online classes with a coach, or a paid Home Course to explore together. <Scribble>Neither you nor your child needs to know chess</Scribble> to begin.</p></Reveal>
            <Reveal delay={0.15} className="ah-actions">
              <Link className="ah-btn ah-btn-dark" to="/book">{INTRO.cta} <ArrowRight size={16} /></Link>
              <a className="ah-btn ah-btn-line" href="#ways">Compare Learning Options</a>
            </Reveal>
            <Reveal delay={0.2} className="ah-chips">
              <span><Check size={14} strokeWidth={3} /> No chess knowledge needed</span>
              <span><Check size={14} strokeWidth={3} /> Built only for ages 4–6</span>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="ah-hero-play">
            <span className="ah-badge">Ages 4–6 only</span>
            <KnightBoard />
          </Reveal>
        </section>

        <section className="ah-stats" aria-label="The academy in numbers">
          <div className="ah-wrap ah-stats-row">
            {STATS.map((stat) => <div key={stat.label}><CountUp to={stat.to} suffix={stat.suffix} /><span>{stat.label}</span></div>)}
          </div>
        </section>

        <section className="ah-section ah-wrap" id="ways">
          <div className="ah-head-split">
            <div>
              <Reveal><span className="ah-kicker">Two ways to learn</span></Reveal>
              <Reveal delay={0.05}><h2>With a coach, or <em>with you.</em></h2></Reveal>
            </div>
            <Reveal delay={0.1}><p className="ah-sub">Both follow the same 30-unit curriculum. Pick what suits your family.</p></Reveal>
          </div>
          <Reveal delay={0.1}><TwoWays /></Reveal>
          <Reveal delay={0.1} as="figure" className="ah-proof-card">
            <blockquote>“{TESTIMONIALS[0].quote}”</blockquote>
            <figcaption><b>{TESTIMONIALS[0].who}</b> · {TESTIMONIALS[0].coach}<Link className="ah-link" to="/little-wins">More parent reviews and student photos <ArrowRight size={14} /></Link></figcaption>
          </Reveal>
        </section>

        <section className="ah-section ah-wrap" id="class">
          <Reveal><span className="ah-kicker">What a class looks like</span></Reveal>
          <Reveal delay={0.05}><h2>Story. Play. <em>Show us.</em></h2></Reveal>
          <Reveal delay={0.1}><ClassSteps /></Reveal>
          <p className="ah-footnote">30 units across five phases, at your child’s pace</p>
        </section>

        <section className="ah-dark" id="little-wins">
          <div className="ah-wrap ah-section">
            <Reveal><span className="ah-kicker ah-kicker-light">Little wins</span></Reveal>
            <Reveal delay={0.05}><h2>Your child starts as a <em className="ah-gold">Pawn.</em></h2></Reveal>
            <Reveal delay={0.08}><p className="ah-sub ah-sub-light">30 units across five phases, at your child’s pace. Each piece marks a milestone in the syllabus. Tap a piece to see it.</p></Reveal>
            <Reveal delay={0.12}><PieceLadder /></Reveal>
            <Reveal delay={0.1} className="ah-assess"><b>How certificates work.</b> {CERT_NOTE}</Reveal>
            <Reveal delay={0.1} className="ah-more"><Link className="ah-link-light" to="/little-wins">See our students’ little wins <ArrowRight size={14} /></Link></Reveal>
          </div>
        </section>

        <section className="ah-section ah-wrap ah-parents">
          <div>
            <Reveal><span className="ah-kicker">From our parents</span></Reveal>
            <Reveal delay={0.05}><h2>What changes <em>at home.</em></h2></Reveal>
          </div>
          <Reveal delay={0.1}><QuoteDeck /></Reveal>
        </section>

        <section className="ah-section ah-wrap" id="about">
          <div className="ah-head-split">
            <div>
              <Reveal><span className="ah-kicker">Meet the coaches</span></Reveal>
              <Reveal delay={0.05}><h2>Patient people. <em>Rated players.</em></h2></Reveal>
            </div>
            <Reveal delay={0.1} className="ah-head-aside"><p className="ah-sub">Tap a coach to meet them.</p><Link className="ah-link" to="/about">About us <ArrowRight size={14} /></Link></Reveal>
          </div>
          <Coaches />
        </section>

        <section className="ah-wrap ah-cta-wrap">
          <Reveal className="ah-cta">
            <div className="ah-cta-copy">
              <h2>Your child’s first class <em className="ah-gold">is free.</em></h2>
              <p>A 30-minute online class with one coach and one child. No payment details needed. We will arrange a suitable time on WhatsApp.</p>
              <div className="ah-cta-actions">
                <Link className="ah-btn ah-btn-cream" to="/book">{INTRO.cta} <ArrowRight size={16} /></Link>
                <a className="ah-btn ah-btn-outline-light" href={CHAT} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Chat on WhatsApp</a>
              </div>
            </div>
            <div className="ah-cta-crew" aria-hidden="true">
              {['rook', 'bishop', 'pawn', 'knight', 'queen'].map((id, i) => (
                <motion.span key={id} animate={{ y: [0, -10, 0] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.25, ease: 'easeInOut' }}>
                  <Character id={id} mood={i === 2 ? 'cheer' : 'happy'} size={i === 2 ? 96 : 70} />
                </motion.span>
              ))}
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
