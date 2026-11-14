import { useEffect } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Check, Printer } from 'lucide-react';
import { useKids } from './KidsShell';
import { findWorld } from './kidsWorlds';
import { markLessonItem, markWatched, markWorksheetDone, readPuzzleProgress, recordDailyPuzzle, recordPuzzleSolved } from './kidsProgress';
import { LessonFilm } from './LessonFilm';
import { PuzzlePlay } from './PuzzlePlay';
import { LessonShell, FeedbackTitle } from './LessonShell';
import { WorksheetSheet } from './Worksheet';
import { navigateWithTransition } from './kidsMotion';

const ACTIVITIES = ['video', 'games', 'worksheet'];

function solvedSet(world) {
  const puzzles = world.practice?.puzzles || [];
  return new Set((readPuzzleProgress()[world.practice?.id]?.completed || []).filter((i) => i >= 0 && i < puzzles.length));
}

function Activity({ world, activity }) {
  const { summary, sound, voice, refresh, completeLesson, lessonsById, recordActivity, motionTier } = useKids();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const entry = summary.byId(world.id);
  const puzzles = world.practice?.puzzles || [];

  useEffect(() => { document.title = `${world.title} | Crown Quest`; }, [world]);

  const toMap = (state) => navigateWithTransition(navigate, '/play', { tier: motionTier, kind: 'back', state });
  const afterLearning = () => {
    // A finished world sends the child back to open their chest.
    const fresh = summary.byId(world.id);
    toMap(fresh.chestReady ? { chest: world.id } : null);
  };

  if (activity === 'video') {
    const media = lessonsById[world.videoLessonId]?.media_available ? `/api/lessons/${encodeURIComponent(world.videoLessonId)}/video` : null;
    return (
      <LessonFilm
        world={world}
        voice={voice}
        mediaUrl={media}
        alreadyWatched={entry.watched}
        onFinished={() => { markWatched(world.id, world.videoLessonId); recordActivity(); completeLesson(world.videoLessonId); refresh(); }}
        onContinue={() => (world.practice ? navigate(`/play/${world.id}/games`, { replace: true }) : afterLearning())}
        continueLabel={world.practice ? 'Play the games' : 'Continue'}
      >
        {({ body, footer, feedback }) => (
          <LessonShell world={world} progress={entry.watched ? 1 : 0.08} stars={summary.totalStars} onClose={() => toMap()} footer={footer} feedback={feedback}>{body}</LessonShell>
        )}
      </LessonFilm>
    );
  }

  if (activity === 'games') {
    if (!world.practice || !entry.watched) return <Navigate to={`/play/${world.id}/video`} replace />;
    const solved = solvedSet(world);
    const fromUrl = Number(params.get('p'));
    const firstOpen = puzzles.findIndex((_, i) => !solved.has(i));
    const index = Number.isInteger(fromUrl) && fromUrl >= 1 && fromUrl <= puzzles.length ? fromUrl - 1 : Math.max(0, firstOpen);
    const nextIndex = () => {
      const now = solvedSet(world);
      for (let step = 1; step <= puzzles.length; step += 1) {
        const i = (index + step) % puzzles.length;
        if (!now.has(i)) return i;
      }
      return null;
    };
    return (
      <PuzzlePlay
        key={puzzles[index].id}
        world={world}
        index={index}
        sound={sound}
        voice={voice}
        onSolved={({ index: i, puzzle, crowns }) => {
          const result = recordPuzzleSolved(world.practice.id, i, puzzle.id, crowns);
          recordDailyPuzzle();
          if (result.firstCompletion) recordActivity();
          if (result.progress[world.practice.id].completed.length >= puzzles.length) {
            markLessonItem(world.practiceLessonId);
            completeLesson(world.practiceLessonId);
          }
          refresh();
        }}
        onContinue={() => {
          const next = nextIndex();
          if (next === null) afterLearning();
          else setParams({ p: String(next + 1) }, { replace: true });
        }}
        continueLabel={solved.size >= puzzles.length - (solved.has(index) ? 0 : 1) ? 'Back to the map' : 'Next puzzle'}
      >
        {({ body, footer, feedback }) => (
          <LessonShell world={world} progress={solvedSet(world).size / puzzles.length} stars={summary.totalStars} onClose={() => toMap()} footer={footer} feedback={feedback}>{body}</LessonShell>
        )}
      </PuzzlePlay>
    );
  }

  // worksheet
  const done = entry.worksheetDone;
  return (
    <LessonShell
      world={world}
      progress={done ? 1 : 0.5}
      stars={summary.totalStars}
      onClose={() => toMap()}
      feedback={done ? { tone: 'good' } : null}
      footer={done ? (
        <>
          <FeedbackTitle icon={<Check size={30} strokeWidth={3.4} />} title="Worksheet done!" text="Brilliant work. Show a grown-up!" />
          <div className="ks-footer-left">
            <button type="button" className="kid-btn kid-btn-ghost" onClick={() => window.print()}><Printer size={22} /> Print again</button>
            <button type="button" className="kid-btn kid-btn-go kid-btn-xl" onClick={() => toMap()}>Back to the map</button>
          </div>
        </>
      ) : (
        <>
          <div className="ks-footer-left">
            <button type="button" className="kid-btn kid-btn-ghost" onClick={() => window.print()}><Printer size={22} /> Print or save PDF</button>
          </div>
          <button type="button" className="kid-btn kid-btn-go kid-btn-xl" onClick={() => { markWorksheetDone(world.id); recordActivity(); refresh(); }}>I finished it!</button>
        </>
      )}
    >
      <div className="kw-sheet-wrap">
        <WorksheetSheet world={world} />
      </div>
    </LessonShell>
  );
}

export default function KidsLevelPage() {
  const { worldId, activity } = useParams();
  const world = findWorld(worldId);
  const { summary } = useKids();
  if (!world) return <Navigate to="/play" replace />;
  const entry = summary.byId(world.id);
  if (!entry.unlocked) return <Navigate to="/play" replace />;
  if (!ACTIVITIES.includes(activity)) return <Navigate to={`/play/${world.id}/${entry.watched ? 'games' : 'video'}`} replace />;
  // Keyed so moving between worlds or activities always starts fresh.
  return <Activity key={`${world.id}-${activity}`} world={world} activity={activity} />;
}
