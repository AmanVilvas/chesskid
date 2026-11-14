import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Pause, Play, RotateCcw } from 'lucide-react';
import { KidsBoard } from './KidsBoard';
import { PipBubble } from './Pip';
import { FeedbackTitle } from './LessonShell';
import { kidsFilms } from './kidsFilms';
import { speak, stopSpeaking } from './kidsAudio';

const toPieces = (scene) => scene.pieces.map((piece) => ({ id: piece.id, color: piece.p[0], type: piece.p[1].toLowerCase(), sq: piece.sq }));
const sceneMs = (scene) => Math.max(2600, scene.caption.length * 58);

/**
 * The world's video. When an animated video has been uploaded for this lesson it plays that;
 * until then it plays an animated board "cartoon" narrated by the world's character.
 * `children` is a render function ({ body, footer, feedback }) for the lesson shell.
 */
export function LessonFilm({ world, voice, onFinished, mediaUrl = null, alreadyWatched = false, onContinue, continueLabel = 'Continue', children: renderShell }) {
  const scenes = kidsFilms[world.id];
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const finishedOnce = useRef(false);
  const scene = scenes[index];

  const finish = () => {
    setPlaying(false);
    setFinished(true);
    if (!finishedOnce.current) { finishedOnce.current = true; onFinished?.(); }
  };

  useEffect(() => {
    if (!playing || mediaUrl) return undefined;
    let cancelled = false;
    const duration = sceneMs(scene);
    const wait = new Promise((resolve) => { window.setTimeout(resolve, duration); });
    const talk = voice ? Promise.race([speak(scene.caption, true), new Promise((r) => { window.setTimeout(r, duration * 2.2); })]) : Promise.resolve();
    Promise.all([wait, talk]).then(() => {
      if (cancelled) return;
      if (index >= scenes.length - 1) finish();
      else setIndex((value) => value + 1);
    });
    return () => { cancelled = true; };
  }, [playing, index, voice]);

  useEffect(() => () => stopSpeaking(), []);

  const play = () => { if (finished) { setIndex(0); setFinished(false); } setStarted(true); setPlaying(true); };
  const pause = () => { setPlaying(false); stopSpeaking(); };

  const caption = !started ? `Hi! I'm here to show you ${world.lessonTitle.replace(/^Meet the /i, 'the ').replace(/!$/, '')}. Press play!` : finished ? 'Great watching! Ready to play?' : scene.caption;

  const body = (
    <div className="kv-stage">
      <PipBubble mood={!started ? 'wave' : finished ? 'cheer' : scene.mood || 'idle'} size={78} who={world.crew}>{caption}</PipBubble>
      <div className="kv-screen">
        {mediaUrl ? (
          <video src={mediaUrl} controls playsInline preload="metadata" onEnded={finish} onPlay={() => setStarted(true)} title={`${world.title} lesson video`} />
        ) : (
          <>
            <div className="kv-board">
              <KidsBoard pieces={toPieces(scene)} highlight={scene.highlight || []} arrows={scene.arrows || []} stars={scene.stars || []} label={`${world.title} lesson animation`} dim={!started} />
            </div>
            <span className="kv-tag">Cartoon preview</span>
            <AnimatePresence>
              {!started && (
                <motion.button key="play" type="button" className="kv-play" onClick={play} aria-label={`Play the ${world.title} lesson`}
                  initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.3, opacity: 0 }} whileTap={{ scale: 0.92 }}>
                  <Play size={46} fill="currentColor" />
                </motion.button>
              )}
            </AnimatePresence>
            <div className="kv-scrub" aria-hidden="true">
              {scenes.map((s, i) => (
                <span key={i} className={`${i < index || finished ? 'seen' : ''} ${i === index && started && !finished ? 'now' : ''}`}>
                  {i === index && playing && <i style={{ animationDuration: `${sceneMs(scene)}ms` }} />}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );

  const canContinue = finished || alreadyWatched;
  const footer = finished ? (
    <>
      <FeedbackTitle icon={<Check size={30} strokeWidth={3.4} />} title="Lesson watched!" text="You earned a star." />
      <button type="button" className="kid-btn kid-btn-go kid-btn-xl" onClick={onContinue} autoFocus>{continueLabel}</button>
    </>
  ) : (
    <>
      <div className="ks-footer-left">
        {!mediaUrl && (playing
          ? <button type="button" className="kid-btn kid-btn-ghost" onClick={pause}><Pause size={22} fill="currentColor" /> Pause</button>
          : <button type="button" className="kid-btn kid-btn-ghost" onClick={play}>{alreadyWatched && !started ? <RotateCcw size={22} /> : <Play size={22} fill="currentColor" />} {started ? 'Play' : alreadyWatched ? 'Watch again' : 'Watch'}</button>)}
      </div>
      <button type="button" className="kid-btn kid-btn-go kid-btn-xl" onClick={onContinue} disabled={!canContinue}>{canContinue ? continueLabel : 'Watch to continue'}</button>
    </>
  );
  return renderShell({ body, footer, feedback: finished ? { tone: 'good' } : null });
}
