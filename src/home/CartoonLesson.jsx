import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { KidsBoard } from '../kids/KidsBoard';

const toPieces = (scene) => scene.pieces.map((piece) => ({ id: piece.id, color: piece.p[0], type: piece.p[1].toLowerCase(), sq: piece.sq }));
const sceneMs = (scene) => Math.max(2600, scene.caption.length * 58);

/** An animated board lesson: scenes play on their own, or step through with the arrows. */
export function CartoonLesson({ film, label = 'Animated lesson' }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const scene = film[index];
  const last = index === film.length - 1;
  useEffect(() => {
    if (!playing) return undefined;
    if (last) { const done = setTimeout(() => setPlaying(false), sceneMs(scene)); return () => clearTimeout(done); }
    const id = setTimeout(() => setIndex((i) => i + 1), sceneMs(scene));
    return () => clearTimeout(id);
  }, [playing, index, last, scene]);
  const toggle = () => { if (!playing && last) setIndex(0); setPlaying((p) => !p); };
  return (
    <div className="hc-cartoon">
      <div className="hc-cartoon-board"><KidsBoard pieces={toPieces(scene)} highlight={scene.highlight || []} arrows={scene.arrows || []} stars={scene.stars || []} label={label} /></div>
      <div className="hc-cartoon-side">
        <AnimatePresence mode="wait"><motion.p key={index} className="hc-cartoon-caption" aria-live="polite" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{scene.caption}</motion.p></AnimatePresence>
        <div className="hc-cartoon-controls">
          <button type="button" onClick={() => { setPlaying(false); setIndex((i) => Math.max(0, i - 1)); }} aria-label="Previous scene" disabled={index === 0}><ArrowLeft size={18} /></button>
          <button type="button" className="is-main" onClick={toggle} aria-label={playing ? 'Pause the lesson' : 'Play the lesson'}>{playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}{playing ? 'Pause' : last ? 'Watch again' : 'Play'}</button>
          <button type="button" onClick={() => { setPlaying(false); setIndex((i) => Math.min(film.length - 1, i + 1)); }} aria-label="Next scene" disabled={last}><ArrowRight size={18} /></button>
        </div>
        <span className="hc-cartoon-step">Scene {index + 1} of {film.length}</span>
      </div>
    </div>
  );
}
