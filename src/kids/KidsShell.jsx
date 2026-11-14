import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { LockKeyhole, Mic, MicOff, ShieldCheck, Volume2, VolumeX, X } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { useExperienceMode } from '../components/ExperienceModeContext';
import { apiRequest } from '../data/apiClient';
import { getLearningStreak, readActivityDays, recordLearningActivity } from '../data/adventureProgress';
import { kidsWorlds } from './kidsWorlds';
import { readKidsState, readPuzzleProgress, summarizeWorlds, KIDS_STATE_KEY } from './kidsProgress';
import { readToggle, writeToggle, SOUND_KEY, VOICE_KEY, voiceSupported, stopSpeaking } from './kidsAudio';
import { GoldStar } from './KidsBoard';
import { Pip } from './Pip';
import { defaultCourse } from '../courses/courseCatalog';
import './kids.css';

// Kids World (Crown Quest) belongs to the Beginner course.
const COURSE = defaultCourse().apiSlug;
const KidsContext = createContext(null);
export const useKids = () => useContext(KidsContext);

function FullScreenMessage({ children }) {
  return <div className="kids-root kids-center"><div className="kids-card">{children}</div></div>;
}

/** Kids World needs a signed-in grown-up with access to the course, checked by the server. */
export function KidsWorldProvider({ children, motionTier = 'full' }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [access, setAccess] = useState({ status: 'idle', userId: null, error: '', free: false });
  const [lessonsById, setLessonsById] = useState({});
  const [version, setVersion] = useState(0);
  const [sound, setSoundState] = useState(() => readToggle(SOUND_KEY));
  const [voice, setVoiceState] = useState(() => voiceSupported() && readToggle(VOICE_KEY));
  const [busy, setBusy] = useState(false);

  const loadAccess = useCallback(async () => {
    if (!user) return;
    setAccess((current) => ({ ...current, status: 'checking', userId: user.id, error: '' }));
    try {
      const [{ enrolled }, { course }] = await Promise.all([
        apiRequest(`/api/courses/${COURSE}/access`),
        apiRequest(`/api/courses/${COURSE}`),
      ]);
      setAccess({ status: enrolled ? 'enrolled' : 'not-enrolled', userId: user.id, error: '', free: Number(course?.price_minor) === 0 && !course?.has_subscription });
      if (enrolled) {
        const { lessons } = await apiRequest(`/api/courses/${COURSE}/lessons`);
        setLessonsById(Object.fromEntries(lessons.map((lesson) => [lesson.id, lesson])));
        // Lessons finished elsewhere (for example in the course player) count here too.
        const state = readKidsState();
        let changed = false;
        for (const world of kidsWorlds) {
          if (lessons.some((lesson) => lesson.id === world.videoLessonId && lesson.completed) && !state.watched[world.id]) {
            state.watched[world.id] = true;
            changed = true;
          }
        }
        if (changed) {
          try { localStorage.setItem(KIDS_STATE_KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
          setVersion((value) => value + 1);
        }
      }
    } catch (error) {
      setAccess({ status: 'error', userId: user.id, error: error.message, free: false });
    }
  }, [user]);

  useEffect(() => { if (!loading && user) loadAccess(); }, [loading, user, loadAccess]);

  const value = useMemo(() => {
    const summary = summarizeWorlds(kidsWorlds, readKidsState(), readPuzzleProgress(), { openAll: true });
    return {
      user,
      motionTier,
      summary,
      lessonsById,
      streak: getLearningStreak(readActivityDays()),
      sound,
      voice,
      setSound: (on) => { writeToggle(SOUND_KEY, on); setSoundState(on); },
      setVoice: (on) => { writeToggle(VOICE_KEY, on); if (!on) stopSpeaking(); setVoiceState(on); },
      refresh: () => setVersion((v) => v + 1),
      recordActivity: recordLearningActivity,
      completeLesson: (lessonId) => apiRequest(`/api/lessons/${encodeURIComponent(lessonId)}/complete`, { method: 'POST', body: { completed: true } })
        .then(() => setLessonsById((current) => ({ ...current, [lessonId]: { ...current[lessonId], completed: true } })))
        .catch(() => { /* progress is still saved on this device */ }),
    };
  }, [user, lessonsById, sound, voice, version, motionTier]);

  if (loading || (user && (access.userId !== user.id || access.status === 'checking' || access.status === 'idle'))) {
    return <FullScreenMessage><Pip mood="idle" size={96} /><p className="kids-loading">Getting the mountain ready…</p></FullScreenMessage>;
  }

  if (!user) {
    return (
      <FullScreenMessage>
        <Pip mood="wave" size={110} />
        <p className="kids-kicker"><ShieldCheck size={16} /> For grown-ups</p>
        <h1>Sign in to open Crown Mountain</h1>
        <p>A grown-up signs in first. Then your child can play, and you can switch to the parent view any time.</p>
        <div className="kids-card-actions">
          <Link className="kid-btn kid-btn-go kid-btn-xl" to="/login" state={{ from: `${location.pathname}${location.search}` }}>Sign in</Link>
          <Link className="kid-btn kid-btn-ghost" to="/signup" state={{ from: `${location.pathname}${location.search}` }}>Create a parent account</Link>
        </div>
      </FullScreenMessage>
    );
  }

  if (access.status === 'error') {
    return (
      <FullScreenMessage>
        <Pip mood="oops" size={96} />
        <h1>We couldn’t reach the academy</h1>
        <p role="alert">{access.error}</p>
        <div className="kids-card-actions"><button type="button" className="kid-btn kid-btn-go" onClick={loadAccess}>Try again</button></div>
      </FullScreenMessage>
    );
  }

  if (access.status === 'not-enrolled') {
    const enrollFree = async () => {
      setBusy(true);
      try {
        await apiRequest('/api/payments/free-enrollment', { method: 'POST', body: { courseSlug: COURSE } });
        await loadAccess();
      } catch (error) {
        setAccess((current) => ({ ...current, error: error.message }));
      } finally { setBusy(false); }
    };
    return (
      <FullScreenMessage>
        <Pip mood="think" size={96} />
        <p className="kids-kicker"><LockKeyhole size={16} /> For grown-ups</p>
        <h1>Unlock Crown Mountain</h1>
        <p>Crown Mountain is part of the Beginner Chess course. Enroll your account to start the adventure.</p>
        {access.error && <p role="alert" className="kids-error">{access.error}</p>}
        <div className="kids-card-actions">
          {access.free
            ? <button type="button" className="kid-btn kid-btn-go kid-btn-xl" onClick={enrollFree} disabled={busy}>{busy ? 'Unlocking…' : 'Enroll for free'}</button>
            : <Link className="kid-btn kid-btn-go kid-btn-xl" to="/courses">See course enrollment</Link>}
        </div>
      </FullScreenMessage>
    );
  }

  return <KidsContext.Provider value={value}>{children}</KidsContext.Provider>;
}

/** A simple grown-up check before leaving the kids area for the parent view. */
function ParentGate({ onClose }) {
  const { setMode } = useExperienceMode();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(() => makeQuestion());
  const [wrong, setWrong] = useState(false);

  function makeQuestion() {
    // Two-digit sums with four choices: easy for grown-ups, hard to guess for young children.
    const a = 12 + Math.floor(Math.random() * 37);
    const b = 11 + Math.floor(Math.random() * 37);
    const answer = a + b;
    const options = new Set([answer]);
    while (options.size < 4) {
      const offset = [-11, -10, -2, -1, 1, 2, 9, 10][Math.floor(Math.random() * 8)];
      options.add(answer + offset);
    }
    return { a, b, answer, options: [...options].sort(() => Math.random() - 0.5) };
  }

  function pick(option) {
    if (option === question.answer) {
      stopSpeaking();
      setMode('parent');
      navigate('/');
      return;
    }
    setWrong(true);
    setQuestion(makeQuestion());
  }

  return (
    <motion.div className="kids-modal-shade" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.section className="kids-modal" role="dialog" aria-modal="true" aria-labelledby="parent-gate-title" initial={{ y: 30, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }}>
        <button type="button" className="kids-modal-close" onClick={onClose} aria-label="Close"><X size={22} /></button>
        <p className="kids-kicker"><ShieldCheck size={16} /> Grown-ups only</p>
        <h2 id="parent-gate-title">What is {question.a} + {question.b}?</h2>
        <p>Answer to open the parent view.</p>
        <motion.div className="kids-gate-options" animate={wrong ? { x: [0, -8, 8, -4, 4, 0] } : {}} key={`${question.a}-${question.b}`}>
          {question.options.map((option) => <button type="button" key={option} onClick={() => pick(option)}>{option}</button>)}
        </motion.div>
        {wrong && <p className="kids-error" role="alert">Not quite. Here is a new one.</p>}
      </motion.section>
    </motion.div>
  );
}

export function ViewToggle() {
  const [gate, setGate] = useState(false);
  return (
    <>
      <div className="kids-view-toggle" role="group" aria-label="Choose view">
        <button type="button" aria-pressed="true">Kids</button>
        <button type="button" aria-pressed="false" onClick={() => setGate(true)}>Grown-ups</button>
      </div>
      {/* Rendered at page level: the sticky header's backdrop blur would otherwise trap the fixed overlay. */}
      {createPortal(
        <div className="kids-portal">
          <AnimatePresence>{gate && <ParentGate onClose={() => setGate(false)} />}</AnimatePresence>
        </div>,
        document.body,
      )}
    </>
  );
}

/** Any button that leads to the parent view; opens the grown-up check first. */
export function GrownUpsButton({ className = '', children }) {
  const [gate, setGate] = useState(false);
  return (
    <>
      <button type="button" className={className} onClick={() => setGate(true)}>{children}</button>
      {createPortal(
        <div className="kids-portal">
          <AnimatePresence>{gate && <ParentGate onClose={() => setGate(false)} />}</AnimatePresence>
        </div>,
        document.body,
      )}
    </>
  );
}

export function AudioToggles() {
  const { sound, voice, setSound, setVoice } = useKids();
  return (
    <div className="kids-icon-group">
      <button type="button" className="kids-icon-btn" onClick={() => setSound(!sound)} aria-pressed={sound} aria-label={sound ? 'Turn sounds off' : 'Turn sounds on'} title={sound ? 'Sounds on' : 'Sounds off'}>
        {sound ? <Volume2 size={22} /> : <VolumeX size={22} />}
      </button>
      {voiceSupported() && (
        <button type="button" className="kids-icon-btn" onClick={() => setVoice(!voice)} aria-pressed={voice} aria-label={voice ? 'Turn Pip’s voice off' : 'Turn Pip’s voice on'} title={voice ? 'Voice on' : 'Voice off'}>
          {voice ? <Mic size={22} /> : <MicOff size={22} />}
        </button>
      )}
    </div>
  );
}

// Kids see one simple treasure: stars. (Crowns and streaks are kept for the grown-up view.)
export function StatChips() {
  const { summary } = useKids();
  return (
    <div className="kids-stats" aria-label="Your treasures">
      <span className="kids-chip kids-chip-gold" title="Stars caught"><GoldStar className="kids-chip-star" /><b>{summary.totalStars}</b><span className="sr-only"> stars caught</span></span>
    </div>
  );
}
