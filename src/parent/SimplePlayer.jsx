import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, FileText, Gamepad2, Lock, Printer, X } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { apiRequest } from '../data/apiClient';
import { recordLearningActivity } from '../data/adventureProgress';
import { coursePiecePracticeLessons } from '../data/coursePiecePracticeData';
import CoursePiecePracticeView from '../components/CoursePiecePracticeView';
import { Character } from '../kids/Characters';
import { kidsWorlds } from '../kids/kidsWorlds';
import { WorksheetSheet } from '../kids/Worksheet';
import { course1Sections } from './course1Sections';
import '../kids/kids.css';
import './simple-font.css';
import './simple.css';

// The existing fallback video while the unit-specific recordings are being uploaded.
const YOUTUBE_VIDEO_ID = 'hiopZjoYfMA';
const YOUTUBE_START_SEC = 5;
const PIECE_ORDER = ['rook', 'bishop', 'queen', 'king', 'pawn', 'knight'];
const CHECKOUT = '/checkout?part=1&version=standard';

/** One row per lecture: each Day has one video; the three Chess Basics videos are listed too. */
const ITEMS = course1Sections.flatMap((section) => {
  const game = section.lectures.find((l) => l.type === 'game') || null;
  return section.lectures.filter((l) => l.type === 'video').map((lecture) => ({
    id: lecture.id,
    sectionId: section.id,
    section,
    lecture,
    game: section.day ? game : null,
    sub: section.day ? `Day ${section.day} · ${lecture.duration}` : `Chess Basics · ${lecture.duration}`,
  }));
}).map((item, i) => ({ ...item, n: i + 1 }));

const itemForLecture = (lectureId, unitId) => {
  if (lectureId) {
    const direct = ITEMS.find((it) => it.id === lectureId);
    if (direct) return direct;
    // a practice link (…-l2) belongs to that unit's video lecture
    const m = lectureId.match(/^u(\d+)-/);
    if (m) return ITEMS.find((it) => it.sectionId === Number(m[1])) || null;
  }
  if (unitId) return ITEMS.find((it) => it.sectionId === Number(unitId)) || null;
  return null;
};

function Modal({ title, onClose, children, wide = false, dark = false }) {
  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <motion.div className="sp-modal-shade" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.section className={`sp-modal ${wide ? 'is-wide' : ''} ${dark ? 'is-dark' : ''}`} role="dialog" aria-modal="true" aria-label={title}
        initial={{ y: 24, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 12, opacity: 0, transition: { duration: 0.15 } }} transition={{ type: 'spring', stiffness: 320, damping: 28 }}>
        <header className="sp-modal-head"><b>{title}</b><button type="button" onClick={onClose} aria-label="Close"><X size={20} /></button></header>
        <div className="sp-modal-body">{children}</div>
      </motion.section>
    </motion.div>
  );
}

export function SimplePlayer({ initialUnitId = 1, initialLectureId = null, onAdvanced, onBackToOverview }) {
  const { user, signOut } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [lessons, setLessons] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [panel, setPanel] = useState(null); // 'puzzles' | 'worksheet' | null

  useEffect(() => { document.title = 'Your lessons | The Thinking Academy'; }, []);
  useEffect(() => {
    let live = true;
    apiRequest('/api/courses/beginner-chess/lessons')
      .then(({ lessons: list }) => { if (live) { setLessons(Object.fromEntries(list.map((l) => [l.id, l]))); setLoaded(true); } })
      .catch(() => { if (live) setLoaded(true); });
    return () => { live = false; };
  }, []);

  const lectureParam = searchParams.get('lecture') || initialLectureId;
  const unitParam = searchParams.get('unit') || initialUnitId;
  const active = itemForLecture(lectureParam, searchParams.get('lecture') ? null : unitParam) || ITEMS[0];
  const opensPuzzles = Boolean(lectureParam && /-l2$/.test(lectureParam));
  const startPuzzle = Math.max(0, Number(searchParams.get('puzzle') || 1) - 1);

  // A dashboard link to a unit's practice opens that unit's puzzles straight away.
  useEffect(() => { if (opensPuzzles && loaded) setPanel('puzzles'); }, [opensPuzzles, loaded]);

  const isLocked = (item) => Boolean(lessons[item.id]?.locked);
  const done = (item) => Boolean(lessons[item.id]?.completed);
  const locked = isLocked(active);
  const watched = ITEMS.filter(done).length;
  const world = kidsWorlds.find((w) => w.id === active.sectionId) || null;
  const piece = active.game ? coursePiecePracticeLessons.find((l) => l.id === PIECE_ORDER[active.sectionId - 1]) : null;
  const solved = piece ? (() => { try { return (JSON.parse(localStorage.getItem('course-lichess-learn-v1') || '{}')[piece.id]?.completed || []).length; } catch { return 0; } })() : 0;
  const nextItem = ITEMS[active.n] || null;
  const allDaysDone = ITEMS.filter((it) => it.section.day).every(done);

  const select = (item) => {
    const next = new URLSearchParams(searchParams);
    next.set('view', 'player');
    next.set('unit', String(item.sectionId));
    next.set('lecture', item.id);
    next.delete('puzzle');
    next.delete('mode');
    setPanel(null);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setComplete = async (lectureId, completed) => {
    try {
      await apiRequest(`/api/lessons/${encodeURIComponent(lectureId)}/complete`, { method: 'POST', body: { completed } });
      if (completed) recordLearningActivity();
      setLessons((prev) => ({ ...prev, [lectureId]: { ...prev[lectureId], id: lectureId, completed } }));
    } catch (error) {
      console.error('Could not save lesson progress:', error.message);
    }
  };

  const mediaAvailable = lessons[active.id]?.media_available;

  return (
    <div className="sp-root">
      <header className="sp-top">
        <Link to="/" className="sp-logo">the thinking academy<span>.</span></Link>
        <div className="sp-top-end">
          <div className="sp-mode" role="group" aria-label="Lesson view">
            <button type="button" className="is-on" aria-pressed="true">Simple</button>
            <button type="button" aria-pressed="false" onClick={onAdvanced}>Advanced</button>
          </div>
          <Link to="/play" className="sp-top-link">Kids view</Link>
          {onBackToOverview && <button type="button" className="sp-top-link" onClick={onBackToOverview}>Course overview</button>}
          {user && <button type="button" className="sp-top-link" onClick={signOut}>Sign out</button>}
        </div>
      </header>

      <div className="sp-layout">
        <main className="sp-stage">
          <div className="sp-video">
            {!loaded ? (
              <div className="sp-video-wait" aria-busy="true" />
            ) : locked ? (
              <div className="sp-locked">
                <span className="sp-locked-icon"><Lock size={26} /></span>
                <h2>This lecture is part of the full course.</h2>
                <p>Day 1 and Day 2 are open to try. Buy a course part to unlock the rest.</p>
                <div className="sp-locked-actions">
                  <Link to={CHECKOUT} className="sp-btn sp-btn-dark">Unlock the course</Link>
                  <button type="button" className="sp-btn sp-btn-line" onClick={() => select(ITEMS[0])}>Open Day 1</button>
                </div>
              </div>
            ) : mediaAvailable ? (
              <video key={active.id} src={`/api/lessons/${encodeURIComponent(active.id)}/video`} title={active.lecture.title} controls playsInline preload="metadata" onEnded={() => setComplete(active.id, true)} />
            ) : (
              <iframe key={active.id} src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?start=${YOUTUBE_START_SEC}&rel=0&modestbranding=1`} title={active.lecture.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
            )}
          </div>

          <h1><span>{active.n}.</span> {active.lecture.title}</h1>

          <div className="sp-meta">
            <span className="sp-avatar">{world && active.section.day ? <Character id={world.crew} mood="happy" size={46} /> : <Character id="pawn" mood="happy" size={46} />}</span>
            <div className="sp-meta-text"><b>{active.section.day ? `${active.section.piece}, Day ${active.section.day}` : 'Chess Basics'}</b><small>{active.lecture.duration}</small></div>
            {!locked && (
              <div className="sp-actions">
                {piece && <button type="button" className="sp-btn sp-btn-line" onClick={() => setPanel('puzzles')}><Gamepad2 size={17} /> Puzzles <i>{solved}/{piece.puzzles.length}</i></button>}
                {world && active.section.day && <button type="button" className="sp-btn sp-btn-green" onClick={() => setPanel('worksheet')}><FileText size={17} /> Worksheet</button>}
              </div>
            )}
          </div>

          {!locked && loaded && (
            <div className="sp-done-row">
              <button type="button" className={`sp-btn ${done(active) ? 'sp-btn-ok' : 'sp-btn-dark'}`} aria-pressed={done(active)} onClick={() => setComplete(active.id, !done(active))}>
                <Check size={17} strokeWidth={3} /> {done(active) ? 'Watched' : 'Mark as watched'}
              </button>
              {nextItem && <button type="button" className="sp-btn sp-btn-ghost" onClick={() => select(nextItem)}>Next lecture <ArrowRight size={16} /></button>}
            </div>
          )}

          <p className="sp-desc">{active.section.description}</p>
        </main>

        <aside className="sp-list" aria-label="Lectures">
          <header><b>Chess Course 1</b><span>{watched} / {ITEMS.length} watched</span></header>
          <ol>
            {ITEMS.map((item) => {
              const itemWorld = kidsWorlds.find((w) => w.id === item.sectionId);
              const crew = item.section.day && itemWorld ? itemWorld.crew : 'pawn';
              return (
                <li key={item.id}>
                  <button type="button" className={`sp-row ${item.id === active.id ? 'is-on' : ''}`} onClick={() => select(item)} aria-current={item.id === active.id ? 'true' : undefined}>
                    <span className="sp-num">{item.n}</span>
                    <span className="sp-thumb" style={{ '--c': itemWorld?.color || '#B5452F' }}>
                      <Character id={crew} mood="happy" size={46} />
                      {isLocked(item) ? <em className="sp-badge is-lock"><Lock size={11} /> Full course</em> : done(item) ? <em className="sp-badge">Watched</em> : null}
                    </span>
                    <span className="sp-row-text"><b>{item.lecture.title}</b><small>{item.sub}</small></span>
                  </button>
                </li>
              );
            })}
          </ol>
          {allDaysDone && (
            <div className="sp-finish">
              <b>All six days done.</b>
              <p>If your child enjoyed it, we can arrange a coach for live one-to-one classes.</p>
              <Link to="/book" className="sp-btn sp-btn-dark">Request a 1:1 coach</Link>
            </div>
          )}
        </aside>
      </div>

      <AnimatePresence>
        {panel === 'worksheet' && world && (
          <Modal key="ws" title={`Worksheet · ${active.lecture.title}`} wide onClose={() => setPanel(null)}>
            <div className="sp-modal-tools"><button type="button" className="sp-btn sp-btn-green" onClick={() => window.print()}><Printer size={17} /> Print worksheet</button></div>
            <div className="kids-root sp-sheet"><WorksheetSheet world={world} /></div>
          </Modal>
        )}
        {panel === 'puzzles' && piece && (
          <Modal key="pz" title={`Puzzles · ${active.lecture.title}`} wide dark onClose={() => setPanel(null)}>
            <div className="pp-root pp-practice sp-practice">
              <CoursePiecePracticeView
                key={`${active.sectionId}-${startPuzzle}`}
                pieceId={piece.id}
                initialPuzzle={opensPuzzles ? startPuzzle : 0}
                courseSidebarOpen={false}
                onShowCourseContent={() => setPanel(null)}
                onSelectPuzzle={() => {}}
                onSelectPiece={() => {}}
                compact
                onLessonComplete={() => active.game && setComplete(active.game.id, true)}
              />
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
