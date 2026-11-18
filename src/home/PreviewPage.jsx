import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Clapperboard, Lock, Play, Printer, Puzzle, ScrollText } from 'lucide-react';
import { Character } from '../kids/Characters';
import { kidsFilms } from '../kids/kidsFilms';
import { kidsWorlds } from '../kids/kidsWorlds';
import { PuzzlePlay } from '../kids/PuzzlePlay';
import { WorksheetSheet } from '../kids/Worksheet';
import '../kids/kids.css';
import { CartoonLesson } from './CartoonLesson';
import { PuzzleSheet } from './PuzzleSheet';
import { BUNDLE, CHECKOUT_MODE, PARENT_VIDEOS, PARTS, PREVIEW_UNITS, UNITS, checkoutPath, inr } from './data';
import { EASE, HOME_COURSE, Reveal, Scribble, SitePage, VideoFacade, wa } from './site';
import './homecourse.css';
import './preview.css';

const KINDS = [
  { id: 'video', short: 'Parent guide', label: 'A video from Rathish', who: 'For you', icon: Clapperboard },
  { id: 'cartoon', short: 'Animated lesson', label: 'An animated lesson', who: 'For your child', icon: Play },
  { id: 'puzzles', short: 'Puzzle sheet', label: 'A puzzle sheet', who: 'Together', icon: Puzzle },
  { id: 'sheet', short: 'Worksheet', label: 'A printable worksheet', who: 'Away from the screen', icon: ScrollText },
];
// The shelf reads like a session: watch, watch, play, print, then the next unit.
const ITEMS = PREVIEW_UNITS.flatMap((unit) => KINDS.map((kind) => ({ unit, kind })));
const worldOf = (unit) => kidsWorlds.find((w) => w.id === unit);
const unitTitle = (unit) => UNITS[unit - 1].title;

function PuzzleViewer({ world }) {
  const [mode, setMode] = useState('play');
  const [index, setIndex] = useState(0);
  const puzzles = world.practice.puzzles;
  return (
    <div className="pv-puzzles">
      <div className="pv-mode" role="tablist" aria-label="Puzzle sheet view">
        <button type="button" role="tab" aria-selected={mode === 'play'} className={mode === 'play' ? 'is-on' : ''} onClick={() => setMode('play')}>Play on screen</button>
        <button type="button" role="tab" aria-selected={mode === 'print'} className={mode === 'print' ? 'is-on' : ''} onClick={() => setMode('print')}>Printable sheet</button>
      </div>
      {mode === 'play' ? (
        <div className="pv-play">
          <div className="pv-play-nav" aria-label="Choose a puzzle">
            {puzzles.slice(0, 4).map((p, i) => <button key={p.id} type="button" className={i === index ? 'is-on' : ''} aria-label={`Puzzle ${i + 1}`} aria-current={i === index} onClick={() => setIndex(i)}>{i + 1}</button>)}
          </div>
          <PuzzlePlay key={`${world.id}-${index}`} world={world} index={index} sound={false} voice={false}
            onContinue={() => setIndex((i) => (i + 1) % Math.min(4, puzzles.length))} continueLabel="Next puzzle">
            {({ body, footer, feedback }) => (
              <div className={`kids-root pv-embed ${feedback ? `is-${feedback.tone}` : ''}`} style={{ '--c': world.color, '--d': world.deep }}>
                {body}
                <div className="pv-embed-bar">{footer}</div>
              </div>
            )}
          </PuzzlePlay>
        </div>
      ) : (
        <div className="pv-printable">
          <button type="button" className="ah-btn ah-btn-dark ah-btn-sm pv-print" onClick={() => window.print()}><Printer size={16} /> Print this puzzle sheet</button>
          <div className="kids-root pv-sheet"><PuzzleSheet world={world} /></div>
        </div>
      )}
    </div>
  );
}

function Viewer({ item }) {
  const { unit, kind } = item;
  const world = worldOf(unit);
  if (kind.id === 'video') {
    const v = PARENT_VIDEOS[unit];
    return <div className="pv-video"><VideoFacade id={v.id} start={v.start} title={`${v.caption}, parent guide`} caption={`Play: ${v.caption}`} /><p className="pv-note">Two minutes before the lesson: what to teach, how to say it, and the mistakes kids usually make.</p></div>;
  }
  if (kind.id === 'cartoon') return <CartoonLesson film={kidsFilms[unit]} label={`${unitTitle(unit)} animated lesson`} />;
  if (kind.id === 'puzzles') return <PuzzleViewer world={world} />;
  return (
    <div className="pv-printable">
      <button type="button" className="ah-btn ah-btn-dark ah-btn-sm pv-print" onClick={() => window.print()}><Printer size={16} /> Print this worksheet</button>
      <div className="kids-root pv-sheet"><WorksheetSheet world={world} /></div>
    </div>
  );
}

export default function PreviewPage() {
  const [active, setActive] = useState(0);
  const viewerRef = useRef(null);
  const item = ITEMS[active];
  const world = worldOf(item.unit);
  const open = (i) => { setActive(i); requestAnimationFrame(() => viewerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })); };
  const locked = UNITS.filter((u) => !PREVIEW_UNITS.includes(u.n));
  const buy = (part, label, className) => (CHECKOUT_MODE === 'demo'
    ? <Link className={className} to={checkoutPath(part, false)}>{label}</Link>
    : <a className={className} href={wa(`Hi! I’d like to buy Part ${part} of the Home Course.`)} target="_blank" rel="noreferrer">{label}</a>);

  return (
    <SitePage title="Course Preview · Units 1 and 2" className="pv-page">
      <section className="ah-wrap pv-hero">
        <div>
          <Reveal><span className="ah-kicker">Course preview · Units 1 and 2</span></Reveal>
          <Reveal delay={0.05}><h1>Try two units <em>before you buy.</em></h1></Reveal>
          <Reveal delay={0.1}><p className="ah-lead">Watch Rathish, meet the Chess Crew, play the puzzles and print the worksheets. <Scribble>No account and no payment needed.</Scribble></p></Reveal>
          <Reveal delay={0.14} className="ah-actions">
            <a className="ah-btn ah-btn-dark" href="#shelf">Start with Unit 1 <ArrowRight size={16} /></a>
            <Link className="ah-btn ah-btn-line" to={HOME_COURSE}>See the full course</Link>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="pv-hero-art" aria-hidden="true">
          {PREVIEW_UNITS.map((unit, i) => (
            <motion.div key={unit} className="pv-hero-card" style={{ '--c': worldOf(unit).color }} animate={{ y: [0, -8, 0] }} transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}>
              <Character id={worldOf(unit).crew} mood="happy" size={104} />
              <b>Unit {unit}</b><span>{unitTitle(unit)}</span>
            </motion.div>
          ))}
        </Reveal>
      </section>

      <section className="ah-wrap pv-shelf-wrap" id="shelf">
        <Reveal><span className="ah-kicker">Your preview pack</span></Reveal>
        <Reveal delay={0.05}><h2>Eight pieces. <em>Two units.</em></h2></Reveal>
        <Reveal delay={0.08}><p className="ah-sub pv-sub">Every unit in the course has the same four parts. Pick any piece below to open it.</p></Reveal>

        <div className="pv-shelf" role="tablist" aria-label="Preview pack">
          {PREVIEW_UNITS.map((unit) => (
            <div className="pv-row" key={unit} style={{ '--c': worldOf(unit).color }}>
              <div className="pv-row-head"><Character id={worldOf(unit).crew} mood="happy" size={46} /><span><small>Unit {unit}</small><b>{unitTitle(unit)}</b></span></div>
              {KINDS.map((kind) => {
                const i = ITEMS.findIndex((it) => it.unit === unit && it.kind.id === kind.id);
                const Icon = kind.icon;
                return (
                  <button key={kind.id} type="button" role="tab" aria-selected={active === i} className={`pv-tile ${active === i ? 'is-on' : ''}`} onClick={() => open(i)}>
                    <span className="pv-tile-icon"><Icon size={20} /></span>
                    <span className="pv-tile-who">{kind.who}</span>
                    <b>{kind.short}</b>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="pv-viewer" ref={viewerRef} role="tabpanel" style={{ '--c': world.color }}>
          <div className="pv-viewer-head">
            <div>
              <span className="pv-viewer-kicker">Unit {item.unit} · {item.kind.who}</span>
              <h3>{unitTitle(item.unit)}: {item.kind.label.charAt(0).toLowerCase() + item.kind.label.slice(1)}</h3>
            </div>
            <div className="pv-step">
              <button type="button" onClick={() => setActive((a) => Math.max(0, a - 1))} disabled={active === 0} aria-label="Previous piece"><ArrowLeft size={18} /></button>
              <span>{active + 1} of {ITEMS.length}</span>
              <button type="button" onClick={() => setActive((a) => Math.min(ITEMS.length - 1, a + 1))} disabled={active === ITEMS.length - 1} aria-label="Next piece"><ArrowRight size={18} /></button>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={active} className="pv-viewer-body" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: EASE }}>
              <Viewer item={item} />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="ah-dark pv-locked">
        <div className="ah-wrap ah-section">
          <div className="ah-head-split">
            <div>
              <Reveal><span className="ah-kicker ah-kicker-light">The rest of the course</span></Reveal>
              <Reveal delay={0.05}><h2>Units 3 to 30 are <em className="ah-gold">in the full course.</em></h2></Reveal>
            </div>
            <Reveal delay={0.1}><p className="ah-sub ah-sub-light">Each unit has the same four parts you just tried: a parent guide, an animated lesson, a puzzle sheet and a worksheet.</p></Reveal>
          </div>
          <div className="pv-lockgrid" aria-label="Units in the full course">
            {locked.map((u) => <span key={u.n} className="pv-lock"><Lock size={13} /><i>{u.n}</i>{u.title}</span>)}
          </div>
          <div className="pv-parts">
            {PARTS.map((p) => (
              <div key={p.id} className="pv-part" style={{ '--c': p.color }}>
                <small>Part {p.id} · units {p.units[0]}–{p.units[1]}</small>
                <b>{inr(p.std)}</b>
                <span>one-time · Standard</span>
                {buy(p.id, <>Unlock Part {p.id} <ArrowRight size={15} /></>, 'ah-btn ah-btn-cream ah-btn-sm')}
              </div>
            ))}
          </div>
          <p className="pv-fine"><Check size={14} strokeWidth={3} /> All 30 units together are {inr(BUNDLE.std)}. The personalised version is available at checkout.</p>
        </div>
      </section>
    </SitePage>
  );
}
