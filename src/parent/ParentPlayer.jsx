import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, Check, ChevronDown, ChevronLeft, ChevronRight, Columns2, Gamepad2, ListTree, PlayCircle, Sparkles, X } from 'lucide-react';
import { course1Sections, course1Days } from './course1Sections';
import { coursePiecePracticeLessons } from '../data/coursePiecePracticeData';
import CoursePiecePracticeView from '../components/CoursePiecePracticeView';
import { apiRequest } from '../data/apiClient';
import { recordLearningActivity } from '../data/adventureProgress';
import { useAuth } from '../components/AuthContext';
import { kidsWorlds } from '../kids/kidsWorlds';
import { Character } from '../kids/Characters';
import './parent.css';

// Parents see the instructor video and the practice puzzles for each unit (no worksheets).
const OUTLINE_TYPES = new Set(['video', 'game']);
const PIECE_ORDER = ['rook', 'bishop', 'queen', 'king', 'pawn', 'knight'];
// Existing fallback while instructor videos are being uploaded (unchanged behaviour).
const YOUTUBE_VIDEO_ID = 'hiopZjoYfMA';
const YOUTUBE_START_SEC = 5;

function readPuzzleProgress() {
  try { return JSON.parse(localStorage.getItem('course-lichess-learn-v1') || '{}'); } catch { return {}; }
}

export function ParentPlayer({ initialUnitId = 1, initialLectureId = null, onBackToOverview }) {
  const { user, signOut } = useAuth();
  const reduce = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();

  // ---- selection (same state model and URL contract as the previous player) ----
  const [activeUnitId, setActiveUnitId] = useState(initialUnitId);
  const currentSection = course1Sections.find((s) => s.id === activeUnitId) || course1Sections[0];
  const [activeLectureId, setActiveLectureId] = useState(initialLectureId || currentSection.lectures[0]?.id || 'u1-l1');
  const [practicePuzzle, setPracticePuzzle] = useState(() => Math.max(0, Number(searchParams.get('puzzle') || 1) - 1));
  const activeLecture = currentSection.lectures.find((l) => l.id === activeLectureId) || currentSection.lectures[0];
  const isPiecePractice = activeLecture.type === 'game' && activeUnitId <= 6;
  const isPracticeSoon = activeLecture.type === 'game' && activeUnitId > 6;
  const activePieceId = PIECE_ORDER[activeUnitId - 1] || 'rook';
  const practiceLecture = currentSection.lectures.find((l) => l.type === 'game');
  const videoLecture = currentSection.lectures.find((l) => l.type === 'video');
  const isSplitMode = searchParams.get('mode') === 'split' && !isPiecePractice && activeUnitId <= 6 && !!practiceLecture;
  const world = kidsWorlds.find((w) => w.id === activeUnitId) || null;

  const [openSections, setOpenSections] = useState({ [activeUnitId]: true });
  const [sidebarOpen, setSidebarOpen] = useState(() => searchParams.get('mode') !== 'split' && (typeof window === 'undefined' || window.innerWidth > 1100));
  const [activeTab, setActiveTab] = useState('overview');
  const [videoRatio, setVideoRatio] = useState(55);
  const [videoEnded, setVideoEnded] = useState(false);
  const [cheer, setCheer] = useState(null);

  // ---- server progress ----
  const [completedItems, setCompletedItems] = useState({});
  const [courseLessons, setCourseLessons] = useState([]);
  useEffect(() => {
    let mounted = true;
    apiRequest('/api/courses/beginner-chess/lessons')
      .then(({ lessons }) => {
        if (!mounted) return;
        setCourseLessons(lessons);
        setCompletedItems(Object.fromEntries(lessons.filter((l) => l.completed).map((l) => [l.id, true])));
      })
      .catch(() => { if (mounted) { setCourseLessons([]); setCompletedItems({}); } });
    return () => { mounted = false; };
  }, []);
  const activeCourseLesson = courseLessons.find((l) => l.id === activeLectureId);

  // ---- notes (same storage as before) ----
  const [notesByLesson, setNotesByLesson] = useState(() => {
    try { return JSON.parse(localStorage.getItem('course-lesson-notes') || '{}'); } catch { return {}; }
  });
  const [newNoteText, setNewNoteText] = useState('');
  const noteKey = `${activeUnitId}:${activeLectureId}`;
  const notes = notesByLesson[noteKey] || [];

  useEffect(() => { setOpenSections((prev) => ({ ...prev, [activeUnitId]: true })); }, [activeUnitId]);
  useEffect(() => {
    const unitFromUrl = Number(searchParams.get('unit'));
    const lectureFromUrl = searchParams.get('lecture');
    const puzzleFromUrl = Number(searchParams.get('puzzle') || 1);
    if (Number.isInteger(unitFromUrl) && unitFromUrl > 0) setActiveUnitId(unitFromUrl);
    if (lectureFromUrl) setActiveLectureId(lectureFromUrl);
    setPracticePuzzle(Math.max(0, puzzleFromUrl - 1));
  }, [searchParams]);
  useEffect(() => { setVideoEnded(false); }, [activeLectureId]);

  const handleSelectLecture = (unitId, lectureId, puzzleIndex = 0, mode = null) => {
    setActiveUnitId(unitId);
    setActiveLectureId(lectureId);
    setPracticePuzzle(puzzleIndex);
    const next = new URLSearchParams(searchParams);
    next.set('view', 'player');
    next.set('unit', String(unitId));
    next.set('lecture', lectureId);
    if ((lectureId.endsWith('-l2') && unitId <= 6) || (unitId <= 6 && (mode === 'split' || mode === 'video'))) next.set('puzzle', String(puzzleIndex + 1));
    else next.delete('puzzle');
    if (mode === 'split') next.set('mode', 'split');
    else next.delete('mode');
    setSearchParams(next);
    if (window.innerWidth <= 1100) setSidebarOpen(false);
  };
  const handlePracticePuzzleChange = (puzzleIndex) => {
    setPracticePuzzle(puzzleIndex);
    const next = new URLSearchParams(searchParams);
    next.set('puzzle', String(puzzleIndex + 1));
    setSearchParams(next, { replace: true });
  };
  const handlePracticePieceChange = (pieceIndex) => handleSelectLecture(pieceIndex + 1, `u${pieceIndex + 1}-l2`, 0);
  const handlePlayerMode = (mode) => {
    if (mode === 'split') setSidebarOpen(false);
    if (mode === 'practice' && practiceLecture) handleSelectLecture(activeUnitId, practiceLecture.id, practicePuzzle);
    else if ((mode === 'video' || mode === 'split') && videoLecture) handleSelectLecture(activeUnitId, videoLecture.id, practicePuzzle, mode);
  };

  // ---- outline + navigation ----
  const outline = useMemo(() => course1Sections.map((section) => ({ ...section, items: section.lectures.filter((l) => OUTLINE_TYPES.has(l.type)) })), []);
  const curriculumItems = outline.flatMap((section) => section.items.map((lecture) => ({ sectionId: section.id, lecture })));
  const currentIndex = curriculumItems.findIndex((item) => item.sectionId === activeUnitId && item.lecture.id === activeLectureId);
  const navigateCurriculum = (offset) => {
    const target = curriculumItems[currentIndex + offset];
    if (target) handleSelectLecture(target.sectionId, target.lecture.id);
  };
  const nextItem = curriculumItems[currentIndex + 1] || null;

  const toggleComplete = async (lectureId, event) => {
    event?.stopPropagation();
    const completed = !completedItems[lectureId];
    try {
      await apiRequest(`/api/lessons/${encodeURIComponent(lectureId)}/complete`, { method: 'POST', body: { completed } });
      if (completed) recordLearningActivity();
      setCompletedItems((prev) => ({ ...prev, [lectureId]: completed }));
    } catch (error) {
      console.error('Could not save lesson progress:', error.message);
    }
  };
  const completeLecture = async (lectureId) => {
    if (completedItems[lectureId]) return;
    try {
      await apiRequest(`/api/lessons/${encodeURIComponent(lectureId)}/complete`, { method: 'POST', body: { completed: true } });
      recordLearningActivity();
      setCompletedItems((prev) => ({ ...prev, [lectureId]: true }));
    } catch (error) {
      console.error('Could not save lesson progress:', error.message);
    }
  };

  const allItems = curriculumItems.map((item) => item.lecture);
  // Course 1 is complete when every day's video and practice are done (the extra videos are optional).
  const courseComplete = course1Days.every((section) => section.lectures.filter((l) => OUTLINE_TYPES.has(l.type)).every((l) => completedItems[l.id]));
  const [celebrated, setCelebrated] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  useEffect(() => {
    if (courseLessons.length === 0) return;
    if (courseComplete && !celebrated) { setCelebrated(true); setShowComplete(true); }
  }, [courseComplete, courseLessons.length]);
  const completedCount = allItems.filter((l) => completedItems[l.id]).length;
  const progressPercent = Math.round((completedCount / allItems.length) * 100);

  const handleAddNote = (event) => {
    event.preventDefault();
    if (!newNoteText.trim()) return;
    const note = { id: Date.now(), text: newNoteText.trim(), date: new Date().toLocaleDateString() };
    setNotesByLesson((prev) => {
      const next = { ...prev, [noteKey]: [note, ...(prev[noteKey] || [])] };
      localStorage.setItem('course-lesson-notes', JSON.stringify(next));
      return next;
    });
    setNewNoteText('');
  };

  const onPracticeComplete = () => {
    if (practiceLecture) completeLecture(practiceLecture.id);
    setCheer({ title: 'Every star collected!', text: `${world?.title || 'This unit'} practice is complete.` });
    window.setTimeout(() => setCheer(null), 3600);
  };

  const puzzleProgress = readPuzzleProgress();
  const mode = isPiecePractice ? 'practice' : isSplitMode ? 'split' : 'video';
  const showVideo = !isPiecePractice && !isPracticeSoon;
  const showBoard = (isPiecePractice || isSplitMode) && !!practiceLecture;
  const isVideoLecture = activeLecture.type === 'video';
  const stageKey = isPracticeSoon ? 'soon' : mode;

  const video = showVideo && (
    <div className="pp-video">
      {activeCourseLesson?.media_available ? (
        <video key={activeLectureId} src={`/api/lessons/${encodeURIComponent(activeLectureId)}/video`} title={activeLecture.title || 'Chess lesson'} controls playsInline preload="metadata"
          onEnded={() => { setVideoEnded(true); if (isVideoLecture) completeLecture(activeLectureId); }} />
      ) : (
        <iframe
          key={`${YOUTUBE_VIDEO_ID}-${activeUnitId}-${activeLectureId}`}
          src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?start=${YOUTUBE_START_SEC}&rel=0&modestbranding=1&color=white`}
          title={activeLecture.title || 'Chess lesson'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}
      <AnimatePresence>
        {videoEnded && nextItem && !isSplitMode && (
          <motion.div className="pp-upnext" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <span className="pp-kicker">Up next</span>
            <h3 className="pp-serif">{nextItem.lecture.title}</h3>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="pp-btn pp-btn-primary pp-btn-lg" onClick={() => handleSelectLecture(nextItem.sectionId, nextItem.lecture.id)}>Continue</button>
              <button type="button" className="pp-btn pp-btn-ghost pp-btn-lg" onClick={() => setVideoEnded(false)}>Watch again</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const board = showBoard && (
    <div className="pp-practice">
      <CoursePiecePracticeView
        key={`${activeUnitId}-${practicePuzzle}`}
        pieceId={activePieceId}
        initialPuzzle={practicePuzzle}
        courseSidebarOpen
        onShowCourseContent={() => setSidebarOpen(true)}
        onSelectPuzzle={handlePracticePuzzleChange}
        onSelectPiece={handlePracticePieceChange}
        compact={isSplitMode}
        onLessonComplete={onPracticeComplete}
      />
    </div>
  );

  return (
    <div className="pp-root pp-player">
      <header className="pp-bar">
        <button type="button" className="pp-icon-btn" onClick={onBackToOverview} aria-label="Back to course overview"><ArrowLeft size={18} /></button>
        <div className="pp-crumb">
          <span className="pp-dot" style={{ background: world?.color || 'var(--accent)' }} />
          <span>{currentSection.label}</span>
          <b>{currentSection.day ? currentSection.piece : 'Additional videos'}</b>
        </div>
        <div className="pp-seg" role="group" aria-label="Lesson mode">
          {[
            { id: 'video', label: 'Video', icon: PlayCircle, disabled: !videoLecture },
            { id: 'practice', label: 'Practice', icon: Gamepad2, disabled: !practiceLecture },
            { id: 'split', label: 'Together', icon: Columns2, disabled: activeUnitId > 6 || !practiceLecture },
          ].map((item) => {
            const Icon = item.icon;
            const pressed = mode === item.id && !isPracticeSoon ? true : (isPracticeSoon && item.id === 'practice');
            return (
              <button key={item.id} type="button" aria-pressed={pressed} disabled={item.disabled} onClick={() => handlePlayerMode(item.id)} aria-label={item.label}>
                {pressed && <motion.span layoutId="pp-seg-pill" className="pp-seg-pill" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
                <Icon size={15} /> {item.label}
              </button>
            );
          })}
        </div>
        <div className="pp-bar-end">
          <span className="pp-progress" title={`${completedCount} of ${allItems.length} lessons complete`}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle className="track" cx="12" cy="12" r="10" /><circle className="fill" cx="12" cy="12" r="10" style={{ strokeDasharray: `${(progressPercent / 100) * 62.8} 62.8` }} /></svg>
            <span>{progressPercent}%</span>
          </span>
          <button type="button" className="pp-icon-btn" onClick={() => navigateCurriculum(-1)} disabled={currentIndex <= 0} aria-label="Previous lesson"><ChevronLeft size={18} /></button>
          <button type="button" className="pp-icon-btn" onClick={() => navigateCurriculum(1)} disabled={currentIndex < 0 || currentIndex >= curriculumItems.length - 1} aria-label="Next lesson"><ChevronRight size={18} /></button>
          <Link to="/play" className="pp-kids-link"><Sparkles size={14} /><span>Kids view</span></Link>
          <button type="button" className="pp-icon-btn" onClick={() => setSidebarOpen((v) => !v)} aria-label={sidebarOpen ? 'Hide course outline' : 'Show course outline'} aria-expanded={sidebarOpen}><ListTree size={18} /></button>
          {user ? <button type="button" className="pp-account" onClick={signOut} title={`Signed in as ${user.email}`}>Sign out</button> : <Link to="/login" className="pp-account">Sign in</Link>}
        </div>
      </header>

      <div className={`pp-body ${sidebarOpen ? 'with-outline' : ''}`}>
        <main className="pp-main">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={stageKey}
              className={`pp-stage pp-stage-${mode}`}
              style={isSplitMode ? { '--video': `${videoRatio}fr`, '--board': `${100 - videoRatio}fr` } : undefined}
              initial={reduce ? false : { opacity: 0, y: 10, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {isSplitMode && (
                <label className="pp-balance"><span>Video</span><input type="range" min="35" max="65" value={videoRatio} onChange={(e) => setVideoRatio(Number(e.target.value))} aria-label="Video and board balance" /><span>Board</span></label>
              )}
              {isPracticeSoon ? (
                <div className="pp-soon">
                  <span className="pp-kicker">Practice · {currentSection.label}</span>
                  <h2 className="pp-serif">Practice puzzles are on their way.</h2>
                  <p>Interactive puzzles for this unit are being prepared. In the meantime, watch the lesson and try the activity in the overview together.</p>
                  {videoLecture && <button type="button" className="pp-btn pp-btn-primary pp-btn-lg" onClick={() => handlePlayerMode('video')}>Watch the lesson</button>}
                </div>
              ) : (
                <>{video}{board}</>
              )}
            </motion.div>
          </AnimatePresence>

          <section className="pp-lesson">
            <div className="pp-lesson-head">
              <div>
                <span className="pp-kicker">{currentSection.heading} · {activeLecture.type === 'game' ? 'Practice' : 'Lesson'}</span>
                <h1 className="pp-serif">{activeLecture.title}</h1>
                <div className="pp-lesson-meta">
                  <span>{activeLecture.duration}</span>
                  {activeLecture.type === 'game' && practiceLecture && activeUnitId <= 6 && <span>{coursePiecePracticeLessons.find((l) => l.id === activePieceId)?.puzzles.length} puzzles</span>}
                  {currentSection.suggestedTime?.total && <span>Unit time · {currentSection.suggestedTime.total}</span>}
                </div>
              </div>
              <div className="pp-lesson-actions">
                <button type="button" className="pp-btn pp-btn-ghost pp-done-btn" aria-pressed={Boolean(completedItems[activeLectureId])} onClick={() => toggleComplete(activeLectureId)}
                  aria-label={completedItems[activeLectureId] ? 'Mark as incomplete' : 'Mark as complete'}>
                  <Check size={16} /> {completedItems[activeLectureId] ? 'Completed' : 'Mark complete'}
                </button>
                {nextItem && <button type="button" className="pp-btn pp-btn-primary" onClick={() => handleSelectLecture(nextItem.sectionId, nextItem.lecture.id)} aria-label={`Next lesson: ${nextItem.lecture.title}`}>Next <ChevronRight size={16} /></button>}
              </div>
            </div>

            {courseComplete && (
              <div className="pp-course-done">
                <div>
                  <span className="pp-kicker">Chess Course 1 · Complete</span>
                  <h3 className="pp-serif">Your child finished the Beginner course.</h3>
                  <p>If they’d like to keep going, we can arrange a coach for live 1:1 classes.</p>
                </div>
                <Link to="/pricing" className="pp-btn pp-btn-accent pp-btn-lg">Request a 1:1 coach</Link>
              </div>
            )}
            <div className="pp-tabs" role="tablist" aria-label="Lesson details">
              {[['overview', 'Overview'], ['notes', `Notes${notes.length ? ` · ${notes.length}` : ''}`]].map(([id, label]) => (
                <button key={id} type="button" role="tab" className="pp-tab" aria-selected={activeTab === id} onClick={() => setActiveTab(id)}>
                  {label}
                  {activeTab === id && <motion.span layoutId="pp-tab-line" className="pp-tab-line" />}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="pp-panel" role="tabpanel">
                <p className="pp-prose">{currentSection.description}</p>
                <div className="pp-grid-2">
                  {currentSection.educationalObjectives?.intro && (
                    <div className="pp-card"><span className="pp-kicker">Why it matters</span><h3>What your child is building</h3><p>{currentSection.educationalObjectives.intro}</p></div>
                  )}
                  {currentSection.educationalObjectives?.extendedQuestions && (
                    <div className="pp-card"><span className="pp-kicker">Ask together</span><h3>Questions to talk about</h3><p>{currentSection.educationalObjectives.extendedQuestions}</p></div>
                  )}
                  {currentSection.classroomMaterials?.instructions && (
                    <div className="pp-card"><span className="pp-kicker">Try together</span><h3>{currentSection.classroomMaterials.activityName?.replace(/"/g, '')}</h3><p>{currentSection.classroomMaterials.instructions}</p></div>
                  )}
                  {typeof currentSection.reviewPreviousUnit === 'string' && (
                    <div className="pp-card"><span className="pp-kicker">Warm up</span><h3>Review first</h3><p>{currentSection.reviewPreviousUnit}</p></div>
                  )}
                </div>
                {currentSection.educationalObjectives?.keyObjectives?.length > 0 && (
                  <div className="pp-chips">{currentSection.educationalObjectives.keyObjectives.map((k) => <span key={k} className="pp-chip">{k}</span>)}</div>
                )}
                {currentSection.authors && <p className="pp-author">Curriculum by {currentSection.authors}</p>}
              </div>
            )}
            {activeTab === 'notes' && (
              <div className="pp-panel pp-notes" role="tabpanel">
                <form onSubmit={handleAddNote}>
                  <textarea value={newNoteText} onChange={(e) => setNewNoteText(e.target.value)} placeholder="What did your child notice? Questions they asked, moves to practise next time…" aria-label="New note" />
                  <button type="submit" className="pp-btn pp-btn-primary" disabled={!newNoteText.trim()}>Save note</button>
                </form>
                <div className="pp-note-list">
                  {notes.length === 0 && <p className="pp-empty">No notes for this lesson yet.</p>}
                  {notes.map((note) => <div key={note.id} className="pp-note"><small>{note.date}</small><p>{note.text}</p></div>)}
                </div>
              </div>
            )}
          </section>
        </main>

        {sidebarOpen && (
          <aside className="pp-outline" aria-label="Course outline">
            <div className="pp-outline-head">
              <h2>Course outline</h2>
              <button type="button" className="pp-icon-btn" onClick={() => setSidebarOpen(false)} aria-label="Close course outline"><X size={16} /></button>
            </div>
            <div className="pp-outline-progress">
              <span className="pp-kicker">{completedCount} of {allItems.length} complete</span>
              <div className="pp-outline-bar"><i style={{ width: `${progressPercent}%` }} /></div>
            </div>
            <div className="pp-outline-list">
              {outline.map((section) => {
                const open = !!openSections[section.id];
                const done = section.items.filter((l) => completedItems[l.id]).length;
                const piece = section.id <= 6 ? coursePiecePracticeLessons.find((l) => l.id === PIECE_ORDER[section.id - 1]) : null;
                const solved = piece ? (puzzleProgress[piece.id]?.completed || []) : [];
                return (
                  <div key={section.id} className="pp-unit">
                    <button type="button" className="pp-unit-head" aria-expanded={open} onClick={() => setOpenSections((p) => ({ ...p, [section.id]: !p[section.id] }))}>
                      <span className="pp-unit-num">{section.day ? String(section.day).padStart(2, '0') : '+'}</span>
                      <span><span className="pp-unit-title">{section.heading}</span><span className="pp-unit-sub">{section.day ? '' : 'Additional videos · '}{done}/{section.items.length} complete</span></span>
                      <ChevronDown size={16} />
                    </button>
                    {open && section.items.map((lecture) => {
                      const isCurrent = section.id === activeUnitId && lecture.id === activeLectureId;
                      const isDone = !!completedItems[lecture.id];
                      const isGame = lecture.type === 'game';
                      const soon = isGame && section.id > 6;
                      return (
                        <div key={lecture.id}>
                          <div className={`pp-item ${isCurrent ? 'is-current' : ''}`}>
                            <button type="button" className="pp-item-main" onClick={() => handleSelectLecture(section.id, lecture.id)} aria-current={isCurrent ? 'true' : undefined}>
                              {isGame ? <Gamepad2 size={16} /> : <PlayCircle size={16} />}
                              <span>
                                <span className="pp-item-title">{lecture.title}</span>
                                <span className="pp-item-meta">{soon ? 'Coming soon' : isGame && piece ? `${solved.length}/${piece.puzzles.length} puzzles` : lecture.duration}</span>
                              </span>
                            </button>
                            <button type="button" className="pp-check" aria-pressed={isDone} onClick={(e) => toggleComplete(lecture.id, e)} aria-label={`${isDone ? 'Mark as incomplete' : 'Mark as complete'}: ${lecture.title}`}>
                              <Check size={14} strokeWidth={3} />
                            </button>
                          </div>
                          {isGame && piece && isCurrent && (
                            <div className="pp-puzzles" aria-label="Puzzles">
                              {piece.puzzles.map((p, i) => (
                                <button key={p.id} type="button" className={`${i === practicePuzzle ? 'now' : ''} ${solved.includes(i) ? 'done' : ''}`} onClick={() => handleSelectLecture(section.id, lecture.id, i)} aria-label={`Puzzle ${i + 1}`}>{i + 1}</button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </aside>
        )}
      </div>

      <AnimatePresence>
        {showComplete && (
          <motion.div className="pp-modal-shade" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowComplete(false)}>
            <motion.section className="pp-modal" role="dialog" aria-modal="true" aria-labelledby="pp-complete-title" onClick={(e) => e.stopPropagation()}
              initial={{ y: 24, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 12, opacity: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 28 }}>
              <div className="pp-modal-crew">{['rook', 'bishop', 'queen', 'king', 'knight', 'pawn'].map((id) => <Character key={id} id={id} mood="cheer" size={54} crown={id === 'pawn'} />)}</div>
              <span className="pp-kicker">Chess Course 1 · Complete</span>
              <h2 id="pp-complete-title" className="pp-serif">All six days, done.</h2>
              <p>Your child has met every chess piece. If they’re enjoying it, we’ll arrange a coach for live 1:1 classes.</p>
              <div className="pp-modal-actions">
                <Link to="/pricing" className="pp-btn pp-btn-accent pp-btn-lg">Request a 1:1 coach</Link>
                <button type="button" className="pp-btn pp-btn-ghost pp-btn-lg" onClick={() => setShowComplete(false)}>Maybe later</button>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {cheer && (
          <motion.div className="pp-cheer" role="status" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
            <Character id={world?.crew || 'pawn'} mood="cheer" size={46} />
            <div><b>{cheer.title}</b><span>{cheer.text}</span></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
