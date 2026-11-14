import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { Check, Clapperboard, FileText, Flag, Gamepad2, Gift, LockKeyhole, Sparkles, Users, X } from 'lucide-react';
import { useKids } from './KidsShell';
import { KidsNav } from './KidsNav';
import { ChestReveal } from './ChestReveal';
import { kidsWorlds } from './kidsWorlds';
import { CourseChessPiece } from '../components/CourseChessPiece';
import { Landmark } from './Landmarks';
import { Character, CREW } from './Characters';
import { GoldStar } from './KidsBoard';
import { playEffect, speak } from './kidsAudio';
import { navigateWithTransition, tweenScroll } from './kidsMotion';
import { dailyPuzzles, markChestOpened, markSeenOpen, pickUnlockToCelebrate, readKidsState } from './kidsProgress';

const STOP_X = [50, 74, 36, 20, 42, 72, 78, 54, 24, 34, 56];
const badgeGlyph = { check: '!', mate: '#', draw: '=', team: '+', crown: '♛' };
const DAILY_GOAL = 3;
const PIP_LINES = ["Let's climb!", 'Wheee!', 'I love chess!', 'Hehe, that tickles!', 'Tap a world and I will walk there!', 'One more star?'];
const TRICKS = [
  { y: [0, -42, 0], rotate: [0, 360, 360], transition: { duration: 0.7, ease: 'easeOut' } },
  { scaleX: [1, 1.3, 0.85, 1.08, 1], scaleY: [1, 0.75, 1.2, 0.95, 1], transition: { duration: 0.6 } },
  { rotate: [0, -16, 16, -12, 12, 0], transition: { duration: 0.6 } },
  { y: [0, -30, 0, -18, 0, -8, 0], transition: { duration: 0.8, ease: 'easeOut' } },
];

export function WorldDisc({ world, size = 'md' }) {
  return (
    <span className={`kw-disc kw-disc-${size}`} style={{ '--c': world.color, '--d': world.deep }}>
      <CourseChessPiece type={world.piece} color="w" />
      {world.badge && <i className="kw-disc-badge" aria-hidden="true">{badgeGlyph[world.badge]}</i>}
    </span>
  );
}

// Catmull-Rom curve through the stops; segments use their real neighbours so they match the trail.
function curveSegment(p0, p1, p2, p3) {
  const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
  const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
  return ` C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`;
}
function trailPath(points, from, to) {
  if (!points.length || to <= from) return '';
  let d = `M ${points[from].x} ${points[from].y}`;
  for (let i = from; i < to; i += 1) d += curveSegment(points[i - 1] || points[i], points[i], points[i + 1], points[i + 2] || points[i + 1]);
  return d;
}

// ---------- the four things to do in every world ----------
function worldActivities(world, entry) {
  const hasGames = Boolean(world.practice);
  return [
    { kind: 'video', icon: Clapperboard, label: 'Watch', sub: 'Animated lesson', done: entry.watched, open: entry.unlocked },
    hasGames
      ? { kind: 'games', icon: Gamepad2, label: 'Play', sub: `${entry.solved}/${entry.total} puzzles`, done: entry.solved === entry.total, open: entry.unlocked && entry.watched, why: 'Watch the video first!' }
      : { kind: 'games', icon: Gamepad2, label: 'Play', sub: 'Coming soon', done: false, open: false, why: 'New games are on their way!' },
    { kind: 'worksheet', icon: FileText, label: 'Print', sub: 'Worksheet', done: entry.worksheetDone, open: entry.unlocked },
    { kind: 'chest', icon: Gift, label: 'Chest', sub: entry.chestOpened ? 'Opened!' : 'Surprise inside', done: entry.chestOpened, open: entry.chestReady || entry.chestOpened, ready: entry.chestReady, why: hasGames ? 'Finish the video and every game!' : 'Watch the video first!' },
  ];
}

// ---------- chill animated scenery (transform-only loops; frozen on lite/reduced) ----------
function Scenery({ height, still }) {
  const { scrollY } = useScroll();
  const farY = useTransform(scrollY, (v) => (still ? 0 : v * 0.22));
  const midY = useTransform(scrollY, (v) => (still ? 0 : v * 0.1));
  const [poked, setPoked] = useState(null);
  const poke = (id) => { setPoked(id); playEffect('pop', true); window.setTimeout(() => setPoked((p) => (p === id ? null : p)), 650); };
  const clouds = [[6, 0.08, 1.1], [62, 0.16, 0.8], [14, 0.3, 0.9], [70, 0.42, 1.2], [8, 0.56, 0.8], [66, 0.7, 1], [30, 0.84, 0.9]];
  const trees = [[4, 0.93], [10, 0.89], [90, 0.95], [95, 0.88], [3, 0.76], [96, 0.74], [8, 0.62], [92, 0.6], [5, 0.47], [94, 0.44]];
  const snow = Array.from({ length: 14 }, (_, i) => i);
  return (
    <div className="km-scenery" aria-hidden="true">
      <div className="km-sun" style={{ top: height * 0.03 }}><i /></div>
      <motion.svg className="km-range km-far" style={{ top: height * 0.1, y: farY }} viewBox="0 0 1000 300" preserveAspectRatio="none">
        <path d="M0 300 L120 120 L200 190 L330 40 L460 200 L560 110 L700 230 L820 70 L1000 220 V300 Z" fill="#D7DEF2" />
        <path d="M330 40 L362 92 L344 86 L330 100 L314 84 L298 94 Z M820 70 L846 112 L830 108 L818 118 L806 106 L794 112 Z" fill="#fff" />
      </motion.svg>
      <motion.svg className="km-range km-mid" style={{ top: height * 0.42, y: midY }} viewBox="0 0 1000 300" preserveAspectRatio="none">
        <path d="M0 300 Q140 120 300 190 T620 150 T1000 120 V300 Z" fill="#CBE3CF" />
      </motion.svg>
      <svg className="km-range km-near" viewBox="0 0 1000 220" preserveAspectRatio="none" style={{ bottom: 0 }}>
        <path d="M0 120 Q170 40 340 100 T700 80 T1000 70 V220 H0 Z" fill="#B8DE9C" />
        <path d="M0 170 Q220 110 450 160 T1000 140 V220 H0 Z" fill="#A6D485" />
      </svg>
      {clouds.map(([x, at, s], i) => (
        <button type="button" tabIndex={-1} key={`c${i}`} className={`km-cloud km-cloud-${i % 3} ${poked === `c${i}` ? 'is-poked' : ''}`} style={{ left: `${x}%`, top: height * at, width: 130 * s }} onClick={() => poke(`c${i}`)}>
          <svg viewBox="0 0 130 56"><path d="M20 50 a16 16 0 0 1 4 -31 a22 22 0 0 1 41 -7 a18 18 0 0 1 32 10 a14 14 0 0 1 5 28 Z" fill="#fff" /></svg>
        </button>
      ))}
      {trees.map(([x, at], i) => (
        <button type="button" tabIndex={-1} key={`t${i}`} className={`km-tree ${poked === `t${i}` ? 'is-poked' : ''}`} style={{ left: `${x}%`, top: height * at, width: 40 + (i % 3) * 12, animationDelay: `${(i % 5) * -0.9}s` }} onClick={() => poke(`t${i}`)}>
          <svg viewBox="0 0 44 66"><rect x="19" y="50" width="6" height="14" rx="2" fill="#8B6A48" /><path d="M22 2 L38 28 H30 L42 50 H2 L14 28 H6 Z" fill={i % 2 ? '#58B26E' : '#46A05F'} /></svg>
        </button>
      ))}
      <div className="km-birds" style={{ top: height * 0.22 }}><i /><i /><i /></div>
      <div className="km-birds km-birds-2" style={{ top: height * 0.5 }}><i /><i /></div>
      <div className="km-snow" style={{ height: height * 0.16 }}>{snow.map((i) => <i key={i} style={{ left: `${(i * 7.3) % 100}%`, animationDelay: `${(i % 7) * -1.3}s`, animationDuration: `${7 + (i % 5)}s` }} />)}</div>
    </div>
  );
}

// ---------- world card ----------
function WorldCard({ world, entry, onClose, onPick }) {
  const acts = worldActivities(world, entry);
  const crew = CREW[world.crew];
  return (
    <motion.section
      className="km-card"
      style={{ '--c': world.color, '--d': world.deep }}
      initial={{ y: 60, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      role="dialog" aria-label={`${world.title}: choose what to do`}
    >
      <header className="km-card-head">
        <div className="km-card-host"><Character id={world.crew} mood="happy" size={86} /></div>
        <div className="km-card-title">
          <small>Day {world.day} · with {crew.name}</small>
          <h2>{world.title}</h2>
          <p>{world.lessonTitle}</p>
        </div>
        <button type="button" className="km-card-close" onClick={onClose} aria-label="Close"><X size={26} strokeWidth={3} /></button>
      </header>
      <div className="km-acts">
        {acts.map((act, i) => {
          const Icon = act.icon;
          return (
            <motion.button
              type="button"
              key={act.kind}
              className={`km-act km-act-${act.kind} ${act.done ? 'is-done' : act.open ? 'is-open' : 'is-locked'} ${act.ready ? 'is-ready' : ''}`}
              onClick={(event) => onPick(act, event.currentTarget)}
              initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.06 * i + 0.05, type: 'spring', stiffness: 420, damping: 26 }}
              whileTap={{ scale: 0.94 }}
              aria-label={`${act.label}: ${act.sub}${act.open ? '' : '. Locked'}`}
            >
              <span className="km-act-icon"><Icon size={34} strokeWidth={2.5} />{act.done && act.kind !== 'chest' && <i className="km-act-check"><Check size={14} strokeWidth={4} /></i>}{!act.open && <i className="km-act-lock"><LockKeyhole size={13} strokeWidth={3} /></i>}</span>
              <b>{act.label}</b>
              <small>{act.sub}</small>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
}

// ---------- page ----------
export default function KidsWorldPage() {
  const { summary, motionTier: tier, sound, voice, refresh } = useKids();
  const navigate = useNavigate();
  const location = useLocation();
  const columnRef = useRef(null);
  const trailRef = useRef(null);
  const stepTimer = useRef(null);
  const [width, setWidth] = useState(0);
  const [stopLen, setStopLen] = useState(null);
  const [plan] = useState(() => pickUnlockToCelebrate(summary.worlds, readKidsState().seenOpen));
  // Course 1 is fully open, so there is nothing to unlock or celebrate on arrival.
  const fresh = null;
  const startIndex = fresh ? Math.max(0, fresh - 2) : Math.max(0, kidsWorlds.findIndex((w) => w.id === (location.state?.chest || summary.currentId)));
  const [avatar, setAvatar] = useState(startIndex);
  const [walk, setWalk] = useState(null);
  const [card, setCard] = useState(() => (location.state?.chest ? location.state.chest : null));
  const [chest, setChest] = useState(null);
  const [bubble, setBubble] = useState(() => ({ text: summary.worlds[0].watched ? "Let's keep climbing!" : 'Tap Rook Castle to start!', mood: 'wave' }));
  const [trick, setTrick] = useState(0);
  const [shakeId, setShakeId] = useState(null);
  const [toast, setToast] = useState(null);
  const still = tier !== 'full';
  const instant = tier === 'reduced';

  useEffect(() => { document.title = 'Crown Quest | The Thinking Academy'; }, []);
  useEffect(() => { markSeenOpen(plan.seenOpen); }, [plan]);

  useLayoutEffect(() => {
    const node = columnRef.current;
    if (!node) return undefined;
    const update = () => setWidth(node.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const n = kidsWorlds.length;
  const narrow = width < 560;
  const spacing = narrow ? 210 : 240;
  const top = narrow ? 330 : 360;
  const bottom = 330;
  const height = top + (n - 1) * spacing + bottom;
  const points = kidsWorlds.map((_, i) => ({ x: (STOP_X[i] / 100) * width, y: top + (n - 1 - i) * spacing }));
  const fullPath = trailPath(points, 0, n - 1);
  const currentIndex = Math.max(0, kidsWorlds.findIndex((w) => w.id === summary.currentId));
  const donePath = trailPath(points, 0, currentIndex);
  const side = (i) => (STOP_X[i] < 50 ? 1 : -1);
  const rest = (i) => ({ x: points[i].x + side(i) * (narrow ? 62 : 78), y: points[i].y + 6 });

  // Where every stop sits along the trail (so Pip can walk the real curve).
  useLayoutEffect(() => {
    const path = trailRef.current;
    if (!path || !width) return;
    const total = path.getTotalLength();
    const samples = 700;
    const lengths = points.map((p) => {
      let best = 0;
      let bestD = Infinity;
      for (let k = 0; k <= samples; k += 1) {
        const at = (total * k) / samples;
        const q = path.getPointAtLength(at);
        const d = (q.x - p.x) ** 2 + (q.y - p.y) ** 2;
        if (d < bestD) { bestD = d; best = at; }
      }
      return best;
    });
    setStopLen(lengths);
  }, [width]);

  const scrollTargetFor = useCallback((i) => {
    const node = columnRef.current;
    if (!node || !points[i]) return window.scrollY;
    return Math.max(0, node.getBoundingClientRect().top + window.scrollY + points[i].y - window.innerHeight * 0.55);
  }, [width]);

  const say = (text, mood = 'happy', ms = 2600) => {
    setBubble({ text, mood });
    if (ms) window.setTimeout(() => setBubble((b) => (b?.text === text ? null : b)), ms);
  };

  // Pip walks along the trail from his stop to another, with the camera following.
  const walkTo = useCallback((to, then) => {
    if (walk) return;
    const from = avatar;
    setCard(null);
    if (from === to || instant || !stopLen || !trailRef.current) {
      setAvatar(to);
      if (instant) window.scrollTo({ top: scrollTargetFor(to), behavior: 'instant' });
      then?.();
      return;
    }
    const path = trailRef.current;
    const steps = 30;
    const xs = [rest(from).x];
    const ys = [rest(from).y];
    for (let k = 0; k <= steps; k += 1) {
      const q = path.getPointAtLength(stopLen[from] + ((stopLen[to] - stopLen[from]) * k) / steps);
      xs.push(q.x);
      ys.push(q.y);
    }
    xs.push(rest(to).x);
    ys.push(rest(to).y);
    const perStop = tier === 'full' ? 0.55 : 0.3;
    const duration = Math.min(2.6, Math.max(0.6, Math.abs(to - from) * perStop));
    setBubble(null);
    setWalk({ xs, ys, duration, to, then, up: to > from });
    tweenScroll(scrollTargetFor(to), duration * 1000);
    clearInterval(stepTimer.current);
    stepTimer.current = setInterval(() => playEffect('step', sound), 190);
  }, [avatar, walk, instant, stopLen, tier, sound, scrollTargetFor, width]);

  const finishWalk = () => {
    clearInterval(stepTimer.current);
    if (!walk) return;
    const { to, then } = walk;
    setAvatar(to);
    setWalk(null);
    then?.();
  };
  useEffect(() => () => clearInterval(stepTimer.current), []);

  // First arrival: show Pip's stop; a newly opened world makes Pip walk there by himself.
  const arrived = width > 0 && stopLen;
  useEffect(() => {
    if (!arrived) return undefined;
    window.scrollTo({ top: scrollTargetFor(avatar), behavior: 'instant' });
    if (!fresh) return undefined;
    const world = kidsWorlds[fresh - 1];
    setToast(`New world open: ${world.title}!`);
    playEffect('unlock', sound);
    speak(`Hooray! ${world.title} is open!`, voice);
    const t1 = setTimeout(() => walkTo(fresh - 1, () => { say('A new world! Tap it to play!', 'cheer', 3200); }), instant ? 0 : 700);
    const t2 = setTimeout(() => setToast(null), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [arrived]);

  function tapStop(i) {
    const world = kidsWorlds[i];
    const entry = summary.worlds[i];
    if (walk) return;
    if (!entry.unlocked) {
      setShakeId(world.id);
      playEffect('oops', sound);
      const msg = `${world.title} is locked. Finish ${kidsWorlds[i - 1].title} first!`;
      say(msg, 'oops', 2800);
      speak(msg, voice);
      window.setTimeout(() => setShakeId(null), 500);
      return;
    }
    playEffect('tap', sound);
    walkTo(i, () => { setCard(world.id); setBubble(null); });
  }

  function tapPip() {
    if (walk) return;
    playEffect('boing', sound);
    setTrick((t) => t + 1);
    const line = PIP_LINES[trick % PIP_LINES.length];
    say(line, 'cheer', 2200);
  }

  function pick(world, act, el) {
    if (!act.open) { playEffect('oops', sound); say(act.why || 'Not yet!', 'oops', 2400); return; }
    if (act.kind === 'chest') { setCard(null); setChest(world); return; }
    playEffect('tap', sound);
    navigateWithTransition(navigate, `/play/${world.id}/${act.kind}`, { tier, kind: 'enter', originEl: el, waitFor: '.kl-page' });
  }

  const cardWorld = card ? kidsWorlds.find((w) => w.id === card) || null : null;
  const collected = summary.worlds.filter((w) => w.chestOpened).length;
  const today = Math.min(dailyPuzzles(), DAILY_GOAL);
  const pipPos = walk ? null : rest(avatar);
  const pipMood = walk ? 'happy' : bubble?.mood || 'idle';

  return (
    <div className={`kids-root kp-page km-page ${still ? 'km-still' : ''}`}>
      <KidsNav active="learn" />
      <main className="km-main">
        <div className="km-hud">
          <span className="km-chip"><GoldStar className="km-chip-star" /> <b>{summary.totalStars}</b></span>
          <span className="km-chip km-chip-crew"><Users size={20} strokeWidth={2.6} /> <b>{collected}</b></span>
          <span className="km-chip km-chip-quest" title="Daily quest: solve 3 puzzles"><Sparkles size={20} strokeWidth={2.6} /> <b>{today}/{DAILY_GOAL}</b></span>
        </div>

        <section className="km-map" style={{ height }} aria-label="Crown Mountain">
          <Scenery height={height} still={still} />
          <div className="km-column" ref={columnRef}>
            <svg className="km-trail" width={width} height={height} aria-hidden="true">
              <path d={fullPath} className="km-trail-edge" />
              <path ref={trailRef} d={fullPath} className="km-trail-base" />
              <path d={fullPath} className="km-trail-dots" />
              {donePath && <path d={donePath} className="km-trail-done" />}
            </svg>

            <div className="km-summit" style={{ top: Math.max(30, top - 290) }}>
              <div className="km-summit-flag"><Flag size={34} fill="#FFC23D" color="#E09A12" /></div>
              <b>{summary.courseComplete ? 'Course 1 complete!' : 'Crown Summit'}</b>
              <span>{summary.courseComplete ? 'Pip became a queen. Amazing climbing!' : 'Finish all 6 days to reach the top!'}</span>
            </div>

            {kidsWorlds.map((world, i) => {
              const entry = summary.worlds[i];
              const p = points[i];
              const isCurrent = i === currentIndex;
              const state = !entry.unlocked ? 'locked' : entry.mastered && entry.chestOpened ? 'mastered' : isCurrent ? 'current' : entry.opensNext ? 'done' : 'open';
              const steps = [entry.watched, world.practice ? entry.solved === entry.total : entry.watched, entry.worksheetDone, entry.chestOpened];
              const landmarkSide = side(i) > 0 ? 'left' : 'right';
              return (
                <div key={world.id} className={`km-stop is-${state} ${fresh === world.id ? 'is-fresh' : ''}`} style={{ left: p.x, top: p.y, '--c': world.color, '--d': world.deep }}>
                  <Landmark worldId={world.id} color={world.color} deep={world.deep} className={`km-landmark ${landmarkSide}`} />
                  {entry.chestOpened && <span className="km-flag" aria-hidden="true"><i /></span>}
                  <motion.button
                    type="button"
                    className="km-node"
                    onClick={() => tapStop(i)}
                    animate={shakeId === world.id ? { x: [0, -9, 9, -6, 6, 0] } : { x: 0 }}
                    whileHover={entry.unlocked && !instant ? { scale: 1.06, y: -4 } : undefined}
                    whileTap={{ scale: 0.92 }}
                    transition={{ duration: 0.4 }}
                    aria-label={`${world.title}. ${entry.unlocked ? 'Open' : 'Locked'}`}
                  >
                    {state === 'current' && !still && <span className="km-pulse" />}
                    <WorldDisc world={world} size="lg" />
                    {!entry.unlocked && <span className="km-lock"><LockKeyhole size={20} strokeWidth={2.8} /></span>}
                    {state === 'mastered' && <span className="km-done"><Check size={18} strokeWidth={3.6} /></span>}
                  </motion.button>
                  <div className="km-label">
                    <small className="km-day">Day {world.day}</small>
                    <b>{world.title}</b>
                    {entry.unlocked
                      ? <span className="km-steps" aria-label={`${steps.filter(Boolean).length} of 4 done`}>{steps.map((ok, k) => <i key={k} className={ok ? 'on' : ''} />)}</span>
                      : <small>Locked</small>}
                  </div>
                </div>
              );
            })}

            {/* Pip, the climber */}
            <motion.div
              className={`km-pip ${walk ? 'is-walking' : ''}`}
              initial={false}
              animate={walk ? { x: walk.xs, y: walk.ys } : { x: pipPos?.x ?? 0, y: pipPos?.y ?? 0 }}
              transition={walk ? { duration: walk.duration, ease: 'easeInOut' } : { duration: 0 }}
              onAnimationComplete={() => { if (walk) finishWalk(); }}
            >
              <AnimatePresence>
                {bubble && !walk && (
                  <motion.button type="button" key={bubble.text} className="km-bubble" onClick={tapPip}
                    initial={{ opacity: 0, y: 8, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                    {bubble.text}
                  </motion.button>
                )}
              </AnimatePresence>
              <motion.button type="button" className="km-pip-body" onClick={tapPip} aria-label="Pip. Tap me!"
                key={trick} animate={still || trick === 0 ? undefined : TRICKS[(trick - 1) % TRICKS.length]}>
                <span className="km-pip-hop"><Character id="pawn" mood={pipMood} size={narrow ? 60 : 72} /></span>
                <span className="km-pip-shadow" />
                {walk && <span className="km-dust"><i /><i /><i /></span>}
              </motion.button>
            </motion.div>

            {!summary.worlds[0].watched && (
              <button type="button" className="km-start" style={{ top: points[0].y + (narrow ? 132 : 142) }} onClick={() => tapStop(0)}>
                <Flag size={20} /> Start here
              </button>
            )}
          </div>
        </section>
      </main>

      <AnimatePresence>
        {cardWorld && (
          <>
            <motion.div key="shade" className="km-card-shade" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCard(null)} />
            <WorldCard key={`card-${cardWorld.id}`} world={cardWorld} entry={summary.byId(cardWorld.id)} onClose={() => setCard(null)} onPick={(act, el) => pick(cardWorld, act, el)} />
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div className="kp-toast" role="status" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
            <Sparkles size={22} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chest && (
          <ChestReveal
            key="chest"
            world={chest}
            tier={tier}
            sound={sound}
            onClose={() => {
              if (!summary.byId(chest.id).chestOpened) markChestOpened(chest.id);
              setChest(null);
              refresh();
              navigate('.', { replace: true, state: null });
              say(`Yay! ${CREW[chest.crew].name} joined your crew!`, 'cheer', 3000);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
