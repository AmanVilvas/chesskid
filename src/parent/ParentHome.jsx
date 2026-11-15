import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check, Gamepad2, PlayCircle, Star } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { apiRequest } from '../data/apiClient';
import { coursePiecePracticeLessons } from '../data/coursePiecePracticeData';
import { getLearningStreak, readActivityDays } from '../data/adventureProgress';
import { BASICS_UNIT_ID } from '../courses/beginnerSyllabus';
import { kidsWorlds } from '../kids/kidsWorlds';
import { readKidsState, readPuzzleProgress, summarizeWorlds } from '../kids/kidsProgress';
import { Character } from '../kids/Characters';
import { course1Days, findCourse1Section } from './course1Sections';
import './parent.css';

const PIECE_ID = { 1: 'rook', 2: 'bishop', 3: 'queen', 4: 'king', 5: 'pawn', 6: 'knight' };

export function playerHref(unitId, lectureId, puzzle) {
  const params = new URLSearchParams({ view: 'player', unit: String(unitId), lecture: lectureId });
  if (puzzle) params.set('puzzle', String(puzzle));
  return `/curriculum?${params.toString()}`;
}

function readLocalCompleted() {
  try { return JSON.parse(localStorage.getItem('course-completed-items') || '{}') || {}; } catch { return {}; }
}

// Same sources the lesson player uses: completed lessons from the server, puzzles from this browser.
function useCourseProgress(userId) {
  const [state, setState] = useState({ loading: true, enrolled: null, done: {} });
  useEffect(() => {
    let live = true;
    apiRequest('/api/courses/beginner-chess/access')
      .then(({ enrolled }) => {
        if (!enrolled) { if (live) setState({ loading: false, enrolled: false, done: {} }); return; }
        return apiRequest('/api/courses/beginner-chess/lessons').then(({ lessons }) => {
          if (live) setState({ loading: false, enrolled: true, done: Object.fromEntries(lessons.filter((l) => l.completed).map((l) => [l.id, true])) });
        });
      })
      .catch(() => { if (live) setState({ loading: false, enrolled: null, done: readLocalCompleted() }); });
    return () => { live = false; };
  }, [userId]);
  return state;
}

function summarizeDays(done, puzzleProgress) {
  return course1Days.map((section) => {
    const video = section.lectures.find((l) => l.type === 'video');
    const game = section.lectures.find((l) => l.type === 'game');
    const pieceId = PIECE_ID[section.id];
    const piece = coursePiecePracticeLessons.find((p) => p.id === pieceId);
    const total = piece?.puzzles.length || 0;
    const solvedSet = new Set((puzzleProgress[pieceId]?.completed || []).filter((i) => Number.isInteger(i) && i >= 0 && i < total));
    const solved = solvedSet.size;
    const watched = Boolean(done[video?.id]);
    const practiced = Boolean(done[game?.id]) || (total > 0 && solved >= total);
    const status = watched && practiced ? 'done' : watched || solved > 0 ? 'progress' : 'new';
    const firstOpen = Array.from({ length: total }, (_, i) => i).find((i) => !solvedSet.has(i));
    const next = !watched
      ? { kind: 'video', label: `Watch: ${video?.title}`, meta: video?.duration, href: playerHref(section.id, video?.id) }
      : { kind: 'game', label: `Practise: puzzle ${(firstOpen ?? 0) + 1} of ${total}`, meta: `${solved} of ${total} solved`, href: playerHref(section.id, game?.id, (firstOpen ?? 0) + 1) };
    return { section, pieceId, video, game, total, solved, watched, practiced, status, next, steps: Number(watched) + Number(practiced) };
  });
}

function Ring({ value, size = 132 }) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg className="ph-ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,.08)" strokeWidth="10" fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--accent)" strokeWidth="10" fill="none" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - value)} transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: 'stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)' }} />
    </svg>
  );
}

function Rise({ children, delay = 0, className = '' }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5, delay, ease: [0.2, 0.8, 0.2, 1] }}>
      {children}
    </motion.div>
  );
}

function greeting(now = new Date()) {
  const h = now.getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

const STATUS = { done: 'Done', progress: 'In progress', new: 'Not started' };

export function ParentHome() {
  const { user, signOut } = useAuth();
  const progress = useCourseProgress(user?.id);
  const puzzleProgress = useMemo(() => readPuzzleProgress(), []);
  const days = useMemo(() => summarizeDays(progress.done, puzzleProgress), [progress.done, puzzleProgress]);
  const kids = useMemo(() => summarizeWorlds(kidsWorlds, readKidsState(), puzzleProgress, { openAll: true }), [puzzleProgress]);
  const activity = useMemo(() => readActivityDays(), []);
  const streak = getLearningStreak(activity);
  const basics = findCourse1Section(BASICS_UNIT_ID);

  const stepsDone = days.reduce((sum, d) => sum + d.steps, 0);
  const stepsTotal = days.length * 2;
  const complete = stepsDone === stepsTotal;
  const current = days.find((d) => d.status !== 'done');
  const puzzlesSolved = days.reduce((sum, d) => sum + d.solved, 0);
  const firstName = (user?.name || '').trim().split(/\s+/)[0];

  const week = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return { key, label: date.toLocaleDateString(undefined, { weekday: 'narrow' }), active: activity.includes(key), today: i === 6 };
  });

  useEffect(() => { document.title = 'Home · Parents | The Thinking Academy'; }, []);

  return (
    <div className="pp-root pp-overview ph-root">
      <header className="pp-top">
        <Link to="/" className="pp-wordmark">The Thinking Academy <span>/ Parents</span></Link>
        <nav aria-label="Parent navigation">
          <Link to="/" className="is-active">Home</Link>
          <Link to="/curriculum">Course</Link>
          <Link to="/pricing">1:1 coaching</Link>
          <Link to="/play">Kids view</Link>
        </nav>
        <button type="button" className="pp-account" onClick={signOut}>Sign out</button>
      </header>

      <section className="ph-hero">
        <div className="ph-hero-copy">
          <Rise><span className="pp-kicker">Chess Course 1 · Beginner</span></Rise>
          <Rise delay={0.04}><h1 className="pp-serif">{greeting()}{firstName ? `, ${firstName}` : ''}.</h1></Rise>
          <Rise delay={0.08}>
            <p className="ph-sub">
              {progress.enrolled === false ? 'Your account doesn’t have Chess Course 1 yet.'
                : complete ? 'Your child has finished all six days of Course 1.'
                : stepsDone === 0 ? 'Six days, one chess piece a day. Day 1 starts with the rook.'
                : `Day ${current.section.day} is next: the ${current.section.piece.toLowerCase()}.`}
            </p>
          </Rise>
        </div>
        <Rise delay={0.1} className="ph-ring-card">
          <div className="ph-ring-wrap">
            <Ring value={stepsDone / stepsTotal} />
            <span><b>{Math.round((stepsDone / stepsTotal) * 100)}%</b><small>complete</small></span>
          </div>
          <dl className="ph-ring-facts">
            <div><dt>Days done</dt><dd>{days.filter((d) => d.status === 'done').length} / {days.length}</dd></div>
            <div><dt>Videos watched</dt><dd>{days.filter((d) => d.watched).length} / {days.length}</dd></div>
            <div><dt>Puzzles solved</dt><dd>{puzzlesSolved} / {days.reduce((s, d) => s + d.total, 0)}</dd></div>
          </dl>
        </Rise>
      </section>

      <section className="ph-wrap">
        <Rise>
          {progress.enrolled === false ? (
            <div className="ph-next">
              <div className="ph-next-copy">
                <span className="pp-kicker">Get started</span>
                <h2 className="pp-serif">Enroll in Chess Course 1</h2>
                <p>Once your account is enrolled, the six days and their practice puzzles open here.</p>
              </div>
              <Link to="/courses" className="pp-btn pp-btn-primary pp-btn-lg">View enrollment <ArrowRight size={17} /></Link>
            </div>
          ) : complete ? (
            <div className="ph-next ph-next-done">
              <div className="ph-next-crew" aria-hidden="true">{['rook', 'bishop', 'queen', 'king', 'knight', 'pawn'].map((id) => <Character key={id} id={id} mood="cheer" size={46} crown={id === 'pawn'} />)}</div>
              <div className="ph-next-copy">
                <span className="pp-kicker">Course 1 complete</span>
                <h2 className="pp-serif">Ready for one-to-one classes?</h2>
                <p>If your child is enjoying chess, we’ll arrange a coach for live one-to-one classes.</p>
              </div>
              <Link to="/book" className="pp-btn pp-btn-accent pp-btn-lg">Request a 1:1 coach <ArrowRight size={17} /></Link>
            </div>
          ) : (
            <Link to={current.next.href} className="ph-next" aria-label={`Continue Day ${current.section.day}: ${current.next.label}`}>
              <span className="ph-next-art" style={{ '--tint': kidsWorlds.find((w) => w.id === current.section.id)?.color }}><Character id={current.pieceId} mood="wave" size={92} /></span>
              <div className="ph-next-copy">
                <span className="pp-kicker">{stepsDone === 0 ? 'Start here' : 'Continue where you left off'}</span>
                <h2 className="pp-serif">Day {current.section.day}: {current.section.piece}</h2>
                <p>{current.next.kind === 'video' ? <PlayCircle size={15} /> : <Gamepad2 size={15} />} {current.next.label}<span>· {current.next.meta}</span></p>
              </div>
              <span className="pp-btn pp-btn-primary pp-btn-lg">{stepsDone === 0 ? 'Start Day 1' : 'Continue'} <ArrowRight size={17} /></span>
            </Link>
          )}
        </Rise>
      </section>

      <section className="ph-wrap">
        <div className="ph-head">
          <h2 className="pp-serif">The six days</h2>
          <Link to="/curriculum" className="ph-link">Course overview <ArrowRight size={14} /></Link>
        </div>
        <div className="ph-days">
          {days.map((d, i) => (
            <Rise key={d.section.id} delay={Math.min(i, 5) * 0.04}>
              <Link to={d.status === 'done' ? playerHref(d.section.id, d.video?.id) : d.next.href} className={`ph-day is-${d.status}`}>
                <div className="ph-day-top">
                  <span className="ph-day-num">Day {d.section.day}</span>
                  <span className={`ph-chip is-${d.status}`}>{d.status === 'done' && <Check size={12} strokeWidth={3} />}{STATUS[d.status]}</span>
                </div>
                <div className="ph-day-mid">
                  <Character id={d.pieceId} mood={d.status === 'done' ? 'cheer' : 'idle'} size={58} />
                  <h3>{d.section.piece}</h3>
                </div>
                <ul className="ph-day-steps">
                  <li className={d.watched ? 'is-done' : ''}><PlayCircle size={14} /> Instructor video {d.watched && <Check size={13} strokeWidth={3} />}</li>
                  <li className={d.practiced ? 'is-done' : ''}><Gamepad2 size={14} /> {d.solved} / {d.total} puzzles {d.practiced && <Check size={13} strokeWidth={3} />}</li>
                </ul>
                <span className="ph-bar"><i style={{ width: `${(d.total ? (Number(d.watched) + d.solved / d.total) / 2 : Number(d.watched)) * 100}%` }} /></span>
              </Link>
            </Rise>
          ))}
        </div>
      </section>

      <section className="ph-wrap ph-split">
        <Rise className="ph-panel">
          <span className="pp-kicker">Additional videos</span>
          <h3 className="pp-serif">Chess Basics</h3>
          <ul className="ph-basics">
            {basics.lectures.map((lesson) => (
              <li key={lesson.id}>
                <Link to={playerHref(BASICS_UNIT_ID, lesson.id)}>
                  <span className={`ph-tick ${progress.done[lesson.id] ? 'is-done' : ''}`}>{progress.done[lesson.id] ? <Check size={13} strokeWidth={3} /> : <PlayCircle size={14} />}</span>
                  <span><b>{lesson.title}</b><small>{lesson.duration}</small></span>
                  <ArrowRight size={15} className="pp-row-arrow" />
                </Link>
              </li>
            ))}
          </ul>
        </Rise>
        <Rise className="ph-panel" delay={0.06}>
          <span className="pp-kicker">This week</span>
          <h3 className="pp-serif">{streak.current ? `${streak.current}-day streak` : 'A little chess, most days'}</h3>
          <div className="ph-week" role="list" aria-label="Days with learning this week">
            {week.map((day) => (
              <span key={day.key} role="listitem" className={`${day.active ? 'is-on' : ''} ${day.today ? 'is-today' : ''}`} aria-label={`${day.key}${day.active ? ': learned' : ''}`}>
                <i>{day.active && <Check size={12} strokeWidth={3} />}</i>{day.label}
              </span>
            ))}
          </div>
          <dl className="ph-kids-stats">
            <div><dt><Star size={13} /> Stars in Kids view</dt><dd>{kids.totalStars}</dd></div>
            <div><dt>Crowns earned</dt><dd>{kids.totalCrowns}</dd></div>
            <div><dt>Best streak</dt><dd>{streak.best} {streak.best === 1 ? 'day' : 'days'}</dd></div>
          </dl>
          <Link to="/play" className="ph-link">Open Kids view <ArrowRight size={14} /></Link>
        </Rise>
      </section>

      {!complete && progress.enrolled !== false && (
        <section className="ph-wrap">
          <Rise>
            <div className="pp-kids-band pp-next-band">
              <span className="pp-next-mark" aria-hidden="true">1:1</span>
              <div>
                <span className="pp-kicker">After Course 1</span>
                <h3 className="pp-serif">Live one-to-one classes with a coach</h3>
                <p>When your child finishes the six days, we’ll arrange a coach for live one-to-one classes.</p>
              </div>
              <Link to="/pricing" className="pp-btn pp-btn-ghost pp-btn-lg">About 1:1 coaching</Link>
            </div>
          </Rise>
        </section>
      )}

      <footer className="pp-foot">The Thinking Academy · Chess as the tool. Thinking as the outcome.</footer>
    </div>
  );
}
