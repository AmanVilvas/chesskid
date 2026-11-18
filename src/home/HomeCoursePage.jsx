import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, CreditCard, Gift, Lock, MessageCircle, Pause, Play, Printer, ShieldCheck, Sparkles, Star, UserRound } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { CourseChessPiece } from '../components/CourseChessPiece';
import { Character } from '../kids/Characters';
import { KidsBoard } from '../kids/KidsBoard';
import { kidsFilms } from '../kids/kidsFilms';
import { ASSESS_SHORT, BUNDLE, CHECKOUT_MODE, COLOURS, FAVS, INTRO, PARTS, PHASES, UNITS, checkoutPath, inr, phaseOf, unitsOfPart } from './data';
import { KnightBoard } from './KnightBoard';
import { EASE, Faq, Reveal, Scribble, SitePage, wa } from './site';
import './homecourse.css';

const CREW = { 1: ['rook', 'Rocco'], 2: ['bishop', 'Bea'], 3: ['queen', 'Queenie'], 4: ['king', 'King Kip'], 5: ['pawn', 'Pip'], 6: ['knight', 'Kit'] };
const fullPrice = (key) => PARTS.reduce((sum, part) => sum + part[key], 0);

const FAQS = [
  ['Is the Home Course a paid course?', 'Yes. The Home Course is a paid course, bought in parts. The sample unit on this page is a preview only, and an introductory live session does not include the full course.'],
  ['I don’t know chess. Can I teach this?', 'Each unit includes a parent guide that shows what to teach and how to say it. You learn together.'],
  ['Which part should we start with?', 'New to chess? Start with Part 1, covering units 1–10. Already familiar with the basics? Message us and we can help you choose where to begin.'],
  ['How long does each unit take?', 'As long as your child needs. You can split an activity across shorter sittings and repeat it before moving on.'],
  ['How do I buy a part?', 'Choose your course part and version, then send us a message on WhatsApp. Our team will share the payment link and explain how to access your course.'],
  ['What happens after I buy?', 'We share the payment link, then explain how to access your course. For the personalised version, we will also ask for your child’s name, favourite things and favourite colours.'],
  ['How does my child earn a certificate?', ASSESS_SHORT + ' Finishing a unit or buying a part does not award a certificate by itself.'],
  ['We’re in live classes. Do we pay for this?', 'Message us on WhatsApp and we will tell you what applies to your plan.'],
];

/** Buy button: the demo checkout while CHECKOUT_MODE is 'demo', otherwise a prepared WhatsApp message. */
function BuyLink({ part, what, personalised, price, label, className }) {
  if (CHECKOUT_MODE === 'demo') return <Link className={className} to={checkoutPath(part, personalised)}><CreditCard size={15} /> {label}</Link>;
  return <a className={className} href={buyMessage(what, personalised, price)} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Message us to buy {what}</a>;
}

function buyMessage(what, personalised, price) {
  return wa(`Hi! I’d like to buy the Home Course: ${what}, ${personalised ? 'Personalised' : 'Standard'} version, ${inr(price)}. Please send me the payment link.`);
}

/* ---------------------------------------------------------------- toggle */
function VersionToggle({ personalised, onChange, size = 'md' }) {
  return (
    <div className={`hc-toggle hc-toggle-${size}`} role="radiogroup" aria-label="Course version">
      {[['standard', 'Standard'], ['personalised', 'Personalised']].map(([id, label]) => {
        const on = (id === 'personalised') === personalised;
        return (
          <button key={id} type="button" role="radio" aria-checked={on} className={on ? 'is-on' : ''} onClick={() => onChange(id === 'personalised')}>
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
        <div className="hc-kit-bar"><i /><i /><i /><span>Unit 6 · The Knight</span></div>
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
        <span><b>Rathish · parent guide</b><small><Play size={11} fill="currentColor" /> what to teach today</small></span>
      </div>

      <div className="hc-kit-game">
        <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
        <span>Activity</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- four things */
function FourThings() {
  const items = [
    { no: '1 · For you', title: 'A parent guide video', text: <>Before each unit, Rathish explains to <b>you</b> what to teach, how to say it, and the mistakes kids usually make.</>, tint: '#EAD5BF',
      art: <div className="hc-art-video"><span style={{ backgroundImage: 'url(/academy/coach-rathish.avif)' }} /><i><Play size={18} fill="currentColor" /></i><small>For grown-ups</small></div> },
    { no: '2 · For your child', title: 'An animated lesson', text: 'A short cartoon story where a Chess Crew friend shows how their piece moves. Stories are how little kids remember best.', tint: '#DDE3D0',
      art: <div className="hc-art-cartoon"><Character id="bishop" mood="happy" size={86} /><span className="hc-art-path" /></div> },
    { no: '3 · Together', title: 'An activity to play', text: 'A tiny game you play together, on screen or on a real board. Move the piece, catch the stars, hear a cheer.', tint: '#F2DFB5',
      art: <div className="hc-art-game">{Array.from({ length: 9 }, (_, i) => <i key={i} className={i % 2 ? 'd' : ''}>{i === 2 || i === 6 ? <Star size={16} fill="currentColor" /> : i === 4 ? <CourseChessPiece type="r" color="w" /> : null}</i>)}</div> },
    { no: '4 · Away from the screen', title: 'A printable worksheet', text: 'Print it out. Colour, circle and draw to practise the same idea. No screen needed.', tint: '#F5E9F0',
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

/* ---------------------------------------------------------------- parts vs phases */
function Structure() {
  const [hover, setHover] = useState(null);
  const lit = (unit) => hover && ((hover.kind === 'phase' && phaseOf(unit).id === hover.id) || (hover.kind === 'part' && unit >= PARTS[hover.id - 1].units[0] && unit <= PARTS[hover.id - 1].units[1]));
  return (
    <div className="hc-struct">
      <div className="hc-struct-labels"><span>How the curriculum is grouped</span></div>
      <div className="hc-struct-row hc-struct-phases">
        {PHASES.map((p) => (
          <button key={p.id} type="button" className="hc-struct-block" style={{ '--c': p.color, '--span': 6 }} onMouseEnter={() => setHover({ kind: 'phase', id: p.id })} onMouseLeave={() => setHover(null)} onFocus={() => setHover({ kind: 'phase', id: p.id })} onBlur={() => setHover(null)}>
            <small>Phase {p.id} · units {p.units[0]}–{p.units[1]}</small><b>{p.title}</b>
          </button>
        ))}
      </div>
      <div className="hc-struct-units" aria-hidden="true">
        {UNITS.map((u) => <i key={u.n} className={lit(u.n) ? 'is-lit' : ''} style={{ '--c': phaseOf(u.n).color }}>{u.n}</i>)}
      </div>
      <div className="hc-struct-row hc-struct-parts">
        {PARTS.map((p) => (
          <button key={p.id} type="button" className="hc-struct-block is-part" style={{ '--c': p.color, '--span': 10 }} onMouseEnter={() => setHover({ kind: 'part', id: p.id })} onMouseLeave={() => setHover(null)} onFocus={() => setHover({ kind: 'part', id: p.id })} onBlur={() => setHover(null)}>
            <small>Part {p.id} · units {p.units[0]}–{p.units[1]}</small><b>{inr(p.std)} one-time</b>
          </button>
        ))}
      </div>
      <div className="hc-struct-labels"><span>What you buy</span></div>
      <div className="hc-struct-notes">
        <p><b>Phases</b> are groups of six units. They describe what your child learns.</p>
        <p><b>Parts</b> are packages of ten units. They describe what you buy. A part is not a learning phase or a certificate level.</p>
        <p><b>Certificates</b> follow a coach assessment. {ASSESS_SHORT}</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- units */
function Units({ personalised, signedIn }) {
  const [part, setPart] = useState(0);
  const item = PARTS[part];
  const price = personalised ? item.per : item.std;
  const units = unitsOfPart(item);
  return (
    <div className="hc-sessions">
      <div className="hc-part-tabs" role="tablist" aria-label="Course parts">
        {PARTS.map((p, i) => (
          <button key={p.id} type="button" role="tab" aria-selected={part === i} className={part === i ? 'is-on' : ''} style={{ '--c': p.color }} onClick={() => setPart(i)}>
            <span className="hc-part-no">{p.id}</span>
            <span><b>Part {p.id}</b><small>Units {p.units[0]}–{p.units[1]} · {inr(personalised ? p.per : p.std)}</small></span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={part} className="hc-part" role="tabpanel" style={{ '--c': item.color }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.32, ease: EASE }}>
          <div className="hc-part-head">
            <div>
              <span className="hc-part-kicker">Part {item.id} · Units {item.units[0]}–{item.units[1]}</span>
              <h3>{item.title}</h3>
              <p>{item.blurb}</p>
            </div>
            <div className="hc-part-buy">
              <AnimatePresence mode="popLayout"><motion.b key={price} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>{inr(price)}</motion.b></AnimatePresence>
              <small>one-time{personalised ? ' · personalised' : ' · standard'}</small>
              {signedIn
                ? <Link className="ah-btn ah-btn-dark ah-btn-sm" to="/parents">Open your course</Link>
                : <BuyLink className="ah-btn ah-btn-dark ah-btn-sm" part={item.id} what={`Part ${item.id} (units ${item.units[0]}–${item.units[1]})`} personalised={personalised} price={price} label={`Buy Part ${item.id}`} />}
            </div>
          </div>
          <ol className="hc-sess-list">
            {units.map((u) => {
              const crew = CREW[u.n];
              const phase = phaseOf(u.n);
              return (
                <motion.li key={u.n} className="hc-sess" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * (u.n - item.units[0]) }}>
                  <span className="hc-sess-no">{u.n}</span>
                  <span className="hc-sess-copy"><b>{u.title}</b><small>{u.blurb}</small><em className="hc-sess-phase" style={{ '--pc': phase.color }}>Phase {phase.id}</em></span>
                  {crew && <span className="hc-sess-crew" title={`with ${crew[1]}`}><Character id={crew[0]} mood="happy" size={44} /><em>with {crew[1]}</em></span>}
                </motion.li>
              );
            })}
          </ol>
        </motion.div>
      </AnimatePresence>
      <p className="hc-help">New to chess? Start with Part 1, covering units 1–10. Already familiar with the basics? Message us and we can help you choose where to begin.</p>
      <Reveal className="hc-bundle">
        <span className="hc-bundle-ribbon"><Gift size={15} /> Best value · all 30 units</span>
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
          : <BuyLink className="ah-btn ah-btn-cream" part="all" what="all 30 units (Parts 1–3)" personalised={personalised} price={personalised ? BUNDLE.per : BUNDLE.std} label="Buy all 30 units" />}
      </Reveal>
    </div>
  );
}

/* ---------------------------------------------------------------- sample unit (real material) */
const KNIGHT_FILM = kidsFilms[6];
const toPieces = (scene) => scene.pieces.map((piece) => ({ id: piece.id, color: piece.p[0], type: piece.p[1].toLowerCase(), sq: piece.sq }));
const sceneMs = (scene) => Math.max(2600, scene.caption.length * 58);

function CartoonSample() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const scene = KNIGHT_FILM[index];
  const last = index === KNIGHT_FILM.length - 1;
  useEffect(() => {
    if (!playing) return undefined;
    if (last) { const done = setTimeout(() => setPlaying(false), sceneMs(scene)); return () => clearTimeout(done); }
    const id = setTimeout(() => setIndex((i) => i + 1), sceneMs(scene));
    return () => clearTimeout(id);
  }, [playing, index, last, scene]);
  const toggle = () => { if (!playing && last) setIndex(0); setPlaying((p) => !p); };
  return (
    <div className="hc-cartoon">
      <div className="hc-cartoon-board"><KidsBoard pieces={toPieces(scene)} highlight={scene.highlight || []} arrows={scene.arrows || []} stars={scene.stars || []} label="The Knight animated lesson" /></div>
      <div className="hc-cartoon-side">
        <AnimatePresence mode="wait"><motion.p key={index} className="hc-cartoon-caption" aria-live="polite" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{scene.caption}</motion.p></AnimatePresence>
        <div className="hc-cartoon-controls">
          <button type="button" onClick={() => { setPlaying(false); setIndex((i) => Math.max(0, i - 1)); }} aria-label="Previous scene" disabled={index === 0}><ArrowLeft size={18} /></button>
          <button type="button" className="is-main" onClick={toggle} aria-label={playing ? 'Pause the lesson' : 'Play the lesson'}>{playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}{playing ? 'Pause' : last ? 'Watch again' : 'Play'}</button>
          <button type="button" onClick={() => { setPlaying(false); setIndex((i) => Math.min(KNIGHT_FILM.length - 1, i + 1)); }} aria-label="Next scene" disabled={last}><ArrowRight size={18} /></button>
        </div>
        <span className="hc-cartoon-step">Scene {index + 1} of {KNIGHT_FILM.length}</span>
      </div>
    </div>
  );
}

function ParentGuideSample() {
  return (
    <div className="hc-guide">
      <div className="hc-guide-head">
        <span style={{ backgroundImage: 'url(/academy/coach-rathish.avif)' }} />
        <div><b>Rathish · parent guide</b><small>Unit 6: The Knight · an excerpt, shown here as text</small></div>
      </div>
      <ol>
        <li><b>Say it simply.</b> “The knight jumps in an L: two squares, then one to the side.”</li>
        <li><b>Say it aloud together.</b> Count “one, two, turn” as the knight hops.</li>
        <li><b>Expect a common mistake.</b> Children often slide the knight diagonally. Gently ask them to count the L again.</li>
        <li><b>Celebrate the jump.</b> The knight is the only piece that can hop over others.</li>
      </ol>
    </div>
  );
}

function WorksheetSample({ name }) {
  const kid = name.trim() || 'Your child';
  return (
    <div className="hc-wsample">
      <div className="hc-maker-sheet" style={{ '--sw': '#3E8EDE' }}>
        <div className="hc-maker-top"><span className="hc-maker-badge">Unit 6</span><h4>{kid === 'Your child' ? 'Knight Hunt' : `${kid}’s Knight Hunt`}</h4></div>
        <p className="hc-maker-q">Circle every square the knight can land on. What do you notice about the colour of each square?</p>
        <div className="hc-maker-board">
          {Array.from({ length: 25 }, (_, i) => <i key={i} className={(Math.floor(i / 5) + (i % 5)) % 2 ? 'd' : ''}>{i === 12 ? <CourseChessPiece type="n" color="w" /> : [1, 3, 5, 9, 15, 19, 21, 23].includes(i) ? <span className="hc-ring" aria-hidden="true" /> : null}</i>)}
        </div>
      </div>
      <p className="hc-wsample-note"><Printer size={15} /> A preview. In the course, every unit has a printable worksheet like this one.</p>
    </div>
  );
}

function SampleUnit({ name }) {
  const [tab, setTab] = useState('guide');
  const tabs = [['guide', '1 · For you', 'Parent guide'], ['cartoon', '2 · For your child', 'Animated lesson'], ['play', '3 · Together', 'Activity'], ['sheet', '4 · Away from the screen', 'Worksheet']];
  return (
    <div className="hc-sample">
      <div className="hc-sample-tag"><Gift size={15} /> Sample unit: a preview of one unit. The full course is a paid product.</div>
      <div className="hc-sample-tabs" role="tablist" aria-label="Sample unit">
        {tabs.map(([id, kicker, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? 'is-on' : ''} onClick={() => setTab(id)}><small>{kicker}</small><b>{label}</b></button>
        ))}
      </div>
      <div className="hc-sample-stage" role="tabpanel">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {tab === 'guide' && <ParentGuideSample />}
            {tab === 'cartoon' && <CartoonSample />}
            {tab === 'play' && <div className="hc-play"><KnightBoard /><p>Play it together: take turns hopping the knight. Child first, then you.</p></div>}
            {tab === 'sheet' && <WorksheetSample name={name} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- personalise */
function Personaliser({ name, setName, fav, setFav, colour, setColour }) {
  const kid = name.trim() || 'Your child';
  return (
    <div className="hc-maker">
      <div className="hc-maker-form">
        <span className="hc-maker-step">After you buy, we ask for 3 things</span>
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
        <p className="hc-maker-note"><ShieldCheck size={15} /> No photos needed. This preview is an illustration and stays on your device.</p>
      </div>
      <motion.div className="hc-maker-sheet" style={{ '--sw': colour }} layout>
        <div className="hc-maker-top">
          <span className="hc-maker-badge">Unit 6</span>
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
    ['The same 30 chess units, in the same order', true, true],
    ['Parent guide, animated lesson, activity and worksheet in each unit', true, true],
    [<>Animations use <b>your child’s name</b></>, false, true],
    [<>Worksheets use <b>your child’s favourite things</b></>, false, true],
    [<>Pages in <b>your child’s chosen colours</b></>, false, true],
  ];
  return (
    <div className="hc-table-wrap">
      <table className={`hc-table ${personalised ? 'is-per' : 'is-std'}`}>
        <caption className="sr-only">What changes between the Standard and Personalised versions, with prices</caption>
        <thead><tr><th scope="col">What you get</th><th scope="col">Standard</th><th scope="col" className="hc-col-per">Personalised</th></tr></thead>
        <tbody>
          {rows.map(([label, std, per], i) => (
            <tr key={i}><td className="hc-cell-label">{label}</td><td data-label="Standard">{std ? <><Check size={18} strokeWidth={3} /><span className="sr-only">Included</span></> : <><span className="hc-dash" aria-hidden="true">—</span><span className="sr-only">Not included</span></>}</td><td className="hc-col-per" data-label="Personalised">{per ? <><Check size={18} strokeWidth={3} /><span className="sr-only">Included</span></> : '—'}</td></tr>
          ))}
          {PARTS.map((p) => <tr key={p.id} className="hc-price-row"><td className="hc-cell-label"><b>Part {p.id}</b> · units {p.units[0]}–{p.units[1]}</td><td data-label="Standard">{inr(p.std)}</td><td className="hc-col-per" data-label="Personalised">{inr(p.per)}</td></tr>)}
          <tr className="hc-price-row is-total"><td className="hc-cell-label"><b>All 30 units</b></td><td data-label="Standard">{inr(BUNDLE.std)}</td><td className="hc-col-per" data-label="Personalised">{inr(BUNDLE.per)}</td></tr>
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
  const part1 = personalised ? PARTS[0].per : PARTS[0].std;
  const fromPrice = part1;

  return (
    <SitePage title="The Home Course · Ages 4–6" className="hc-page">
      <section className="ah-wrap hc-hero">
        <div className="hc-hero-copy">
          <Reveal><span className="ah-kicker">The Home Course · Ages 4–6 · Paid, parent-guided</span></Reveal>
          <Reveal delay={0.05}><h1>30 learning units.<br />Three course parts.<br /><em>Learn together at home.</em></h1></Reveal>
          <Reveal delay={0.1}><p className="ah-lead">A paid, parent-guided chess course for children aged 4–6. Each unit includes a parent guide video, a child’s animated lesson, an activity to play together and <Scribble>a printable worksheet.</Scribble> Repeat any unit whenever your child needs more practice.</p></Reveal>
          <Reveal delay={0.14}><VersionToggle personalised={personalised} onChange={setPersonalised} /></Reveal>
          <Reveal delay={0.18} className="ah-actions">
            {user ? (
              <>
                <Link className="ah-btn ah-btn-dark" to="/parents">Open your course <ArrowRight size={16} /></Link>
                <a className="ah-btn ah-btn-line" href="#units">Explore the 30 Units</a>
              </>
            ) : (
              <>
                <Link className="ah-btn ah-btn-clay" to="/courses/beginner-chess/preview"><Play size={16} fill="currentColor" /> Try 2 units now</Link>
                <a className="ah-btn ah-btn-line" href="#units">Explore the 30 Units</a>
              </>
            )}
          </Reveal>
          <Reveal delay={0.22}>
            <p className="hc-from">
              From <AnimatePresence mode="popLayout"><motion.b key={fromPrice} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}>{inr(fromPrice)}</motion.b></AnimatePresence>
              <span>· one-time payment per part · {personalised ? 'Personalised' : 'Standard'} version</span>
            </p>
            <p className="hc-login-line">Try two full units first. No account needed. <a href="#prices">See prices</a></p>
            {!user && <p className="hc-login-line">Already purchased? <Link to="/login" state={{ from: '/parents' }}><UserRound size={14} /> Parent Login</Link></p>}
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
          {[['30', 'learning units, from first piece to full game'], ['3 parts', 'of ten units each, bought one at a time'], ['4', 'things in every unit'], ['6', 'Chess Crew friends to meet']].map(([v, l]) => <div key={l}><b>{v}</b><span>{l}</span></div>)}
        </div>
        <div className="hc-crew-line" aria-hidden="true">
          {['pawn', 'rook', 'bishop', 'knight', 'queen', 'king'].map((id, i) => (
            <motion.span key={id} initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08, type: 'spring', stiffness: 220, damping: 14 }}><Character id={id} mood="happy" size={52} /></motion.span>
          ))}
        </div>
      </section>

      <section className="ah-section ah-wrap">
        <Reveal><span className="ah-kicker">Inside every unit</span></Reveal>
        <Reveal delay={0.05}><h2>Four things, <em>every single time.</em></h2></Reveal>
        <Reveal delay={0.08}><p className="ah-sub hc-sub">So you always know what to do, even if you’ve never played chess.</p></Reveal>
        <FourThings />
      </section>

      <section className="ah-section ah-wrap">
        <Reveal><span className="ah-kicker">Parts and phases</span></Reveal>
        <Reveal delay={0.05}><h2>What you buy, and <em>what your child learns.</em></h2></Reveal>
        <Reveal delay={0.08}><p className="ah-sub hc-sub">The course is one 30-unit curriculum. Hover or tap a block to see which units it covers.</p></Reveal>
        <Reveal delay={0.1}><Structure /></Reveal>
      </section>

      <section className="ah-section ah-wrap" id="units">
        <div className="ah-head-split">
          <div>
            <Reveal><span className="ah-kicker">All 30 units</span></Reveal>
            <Reveal delay={0.05}><h2>From the first piece to <em>a full game.</em></h2></Reveal>
          </div>
          <Reveal delay={0.1} className="hc-head-aside">
            <p className="ah-sub">Pick a part to see its ten units, in syllabus order.</p>
            <VersionToggle personalised={personalised} onChange={setPersonalised} size="sm" />
          </Reveal>
        </div>
        <Units personalised={personalised} signedIn={Boolean(user)} />
      </section>

      <section className="ah-dark" id="sample">
        <div className="ah-wrap ah-section">
          <Reveal><span className="ah-kicker ah-kicker-light">Try one unit</span></Reveal>
          <Reveal delay={0.05}><h2>Unit 6: <em className="ah-gold">the Knight.</em></h2></Reveal>
          <Reveal delay={0.08}><p className="ah-sub ah-sub-light">Here is what one unit looks like at home. Lessons take as long as your child needs. You can split an activity across shorter sittings and repeat it before moving on.</p></Reveal>
          <Reveal delay={0.1}><SampleUnit name={name} /></Reveal>
          <Reveal delay={0.12} className="ah-more"><Link className="ah-link-light" to="/courses/beginner-chess/preview">Open the full course preview: two complete units <ArrowRight size={14} /></Link></Reveal>
        </div>
      </section>

      <section className="ah-section ah-wrap" id="prices">
        <Reveal><span className="ah-kicker">Prices and how to buy · Standard or personalised</span></Reveal>
        <Reveal delay={0.05}><h2>Same units. One is <em>made for them.</em></h2></Reveal>
        <Reveal delay={0.08}><p className="ah-sub hc-sub">Both versions teach the same chess topics. The personalised version adds your child’s name, favourite things and chosen colours, where delivered. It costs ₹1,000 more per part.</p></Reveal>
        <Reveal delay={0.1} className="hc-version-row"><VersionToggle personalised={personalised} onChange={setPersonalised} /></Reveal>
        <div className="hc-compare">
          <Reveal><CompareTable personalised={personalised} /></Reveal>
          <div className="hc-how">
            <Reveal className="hc-buy-card">
              <h3>{CHECKOUT_MODE === 'demo' ? 'Buy Part 1' : 'Message us to buy Part 1'}</h3>
              <p>{CHECKOUT_MODE === 'demo' ? 'Choose your course part and version, then pay at checkout. Your course opens on your parent account.' : 'Choose your course part and version, then send us a message on WhatsApp. Our team will share the payment link and explain how to access your course.'}</p>
              {user
                ? <Link className="ah-btn ah-btn-dark" to="/parents">Open your course <ArrowRight size={16} /></Link>
                : <BuyLink className="ah-btn ah-btn-clay" part={1} what="Part 1 (units 1–10)" personalised={personalised} price={part1} label="Buy Part 1" />}
              <small>{CHECKOUT_MODE === 'demo' ? 'Checkout is in test mode for now, so no real payment is taken.' : 'This opens WhatsApp with a prepared message. Review it and press Send to contact us.'}</small>
            </Reveal>
            {[['Choose a part and version', 'Pick Part 1, 2, 3 or all 30 units, Standard or Personalised.'], ['Send the prepared message', 'It includes your part, version and price.'], ['We share the payment link', 'We send the payment link and explain how to access your course.']].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.08} className="hc-how-step"><span>{i + 1}</span><div><b>{t}</b><p>{d}</p></div></Reveal>
            ))}
          </div>
        </div>
        <Reveal delay={0.1}><h3 className="hc-maker-title">See what personalising looks like</h3></Reveal>
        <Reveal delay={0.1}><Personaliser name={name} setName={setName} fav={fav} setFav={setFav} colour={colour} setColour={setColour} /></Reveal>
      </section>

      <section className="ah-section ah-wrap hc-assess-wrap">
        <Reveal className="hc-assess">
          <span className="hc-assess-icon"><Star size={26} fill="currentColor" /></span>
          <div>
            <h3>After the course: a coach assessment</h3>
            <p>{ASSESS_SHORT}</p>
            <small>Finishing a unit or buying a part does not award a certificate by itself.</small>
          </div>
          <a className="ah-btn ah-btn-line" href={wa('Hi! I have completed the Home Course and would like to arrange a coach assessment.')} target="_blank" rel="noreferrer">Message us about an assessment</a>
        </Reveal>
      </section>

      <section className="ah-section ah-wrap hc-grown">
        <div>
          <Reveal><span className="ah-kicker">Made for grown-ups too</span></Reveal>
          <Reveal delay={0.05}><h2>You don’t need to <em>know chess.</em></h2></Reveal>
        </div>
        <div className="hc-grown-grid">
          {[
            [Check, 'Lesson planner', 'Goals, activities and talking points for every unit.'],
            [Lock, 'Grown-up check', 'A quick check before the parent area, so little hands stay on the kids’ side.'],
            [Star, 'Gentle rewards', 'Stars, chests and crew friends. No leaderboards, no pressure.'],
            [UserRound, 'Your own login', 'Everything lives in your parent dashboard.'],
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
            <p>Units 1–10 · {inr(part1)} one-time · {personalised ? 'Personalised' : 'Standard'} version</p>
            <div className="ah-cta-actions">
              {user
                ? <Link className="ah-btn ah-btn-cream" to="/parents">Open your course <ArrowRight size={16} /></Link>
                : <BuyLink className="ah-btn ah-btn-cream" part={1} what="Part 1 (units 1–10)" personalised={personalised} price={part1} label="Buy Part 1" />}
              <Link className="ah-btn ah-btn-outline-light" to="/book">{INTRO.cta}</Link>
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
