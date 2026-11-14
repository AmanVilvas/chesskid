import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Lightbulb, RotateCcw, X as XIcon } from 'lucide-react';
import { KidsBoard, FILES, GoldStar, pieceNames } from './KidsBoard';
import { CourseChessPiece } from '../components/CourseChessPiece';
import { PipBubble } from './Pip';
import { FeedbackTitle } from './LessonShell';
import { useStarPuzzle } from './useStarPuzzle';
import { crownsFor } from './kidsProgress';
import { playEffect, speak } from './kidsAudio';

const cheers = ['Yay!', 'Super!', 'Wow!', 'Brilliant!', 'Nice one!'];

/**
 * One star puzzle. The game rules come from the existing practice engine (useStarPuzzle).
 * `children` is a render function ({ body, footer, feedback }) so the lesson shell owns layout.
 */
export function PuzzlePlay({ world, index, sound, voice, onSolved, onContinue, continueLabel = 'Continue', children: renderShell }) {
  const lesson = world.practice;
  const puzzle = lesson.puzzles[index];
  const pieceName = pieceNames[lesson.type] || 'piece';
  const [pip, setPip] = useState({ mood: 'wave', text: world.kidGoal });
  const [result, setResult] = useState(null);
  const [focusSquare, setFocusSquare] = useState('');
  const [drag, setDrag] = useState(null);
  const [hintOn, setHintOn] = useState(false);
  const boardRef = useRef(null);
  const dragRef = useRef(null);
  const misses = useRef(0);

  const say = (mood, text, { voiceLine = false } = {}) => {
    setPip({ mood, text });
    if (voiceLine) speak(text, voice);
  };

  const puzzleState = useStarPuzzle(lesson, puzzle, {
    onMove: ({ caught }) => { misses.current = 0; setHintOn(false); if (!caught) { playEffect('move', sound); say('idle', 'Good move! Keep going.'); } },
    onStar: ({ left }) => { playEffect('star', sound); say('happy', `${cheers[left % cheers.length]} ${left} more star${left === 1 ? '' : 's'}!`); },
    onIllegal: () => {
      misses.current += 1;
      playEffect('oops', sound);
      say('think', 'Hmm, not there. Try a glowing spot!', { voiceLine: misses.current > 1 });
      if (misses.current > 1 && puzzle.hintMoves?.length) setHintOn(true);
    },
    onFailed: () => { playEffect('oops', sound); say('oops', "Uh-oh, that path won't work.", { voiceLine: true }); },
    onSolved: ({ moves }) => {
      playEffect('solved', sound);
      setResult({ moves });
      say('cheer', 'Hooray! You caught every star!', { voiceLine: true });
      onSolved?.({ index, puzzle, moves, crowns: crownsFor(moves, puzzle.nbMoves) });
    },
  });
  const { game, ids, stars, selected, legal, lastMove, burst, shake, failed, solved, pendingPromotion, moves } = puzzleState;

  useEffect(() => {
    speak(world.kidGoal, voice);
    setFocusSquare(Object.keys(game.pieces)[0] || 'e4');
  }, []);

  useEffect(() => {
    if (pendingPromotion) say('cheer', 'Your pawn made it! Pick a new piece!', { voiceLine: true });
  }, [Boolean(pendingPromotion)]);

  const pieces = Object.entries(game.pieces).map(([sq, piece]) => ({ id: ids[sq] || sq, type: piece.type, color: piece.color, sq }));
  const arrows = hintOn && puzzle.hintMoves?.length && !moves ? puzzle.hintMoves.map((m) => [m.slice(0, 2), m.slice(2, 4)]) : [];
  const locked = solved || failed || Boolean(pendingPromotion);

  function squareAt(clientX, clientY) {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect || clientX < rect.left || clientY < rect.top || clientX >= rect.right || clientY >= rect.bottom) return null;
    return `${FILES[Math.floor((clientX - rect.left) / (rect.width / 8))]}${8 - Math.floor((clientY - rect.top) / (rect.height / 8))}`;
  }
  function choose(square) {
    const piece = game.pieces[square];
    if (piece && piece.color === game.activeColor) {
      if (selected === square) { puzzleState.deselect(); return; }
      playEffect('tap', sound); puzzleState.select(square); say('think', 'Now tap a glowing spot!');
      return;
    }
    if (selected) puzzleState.move(selected, square);
  }
  function onPointerDown(event) {
    if (locked || event.button > 0) return;
    const square = squareAt(event.clientX, event.clientY);
    if (!square) return;
    setFocusSquare(square);
    const piece = game.pieces[square];
    if (piece && piece.color === game.activeColor) {
      const wasSelected = selected === square;
      if (!wasSelected) { playEffect('tap', sound); puzzleState.select(square); say('think', 'Now tap a glowing spot!'); }
      dragRef.current = { from: square, id: ids[square], pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, moved: false, wasSelected };
      event.currentTarget.setPointerCapture?.(event.pointerId);
      event.preventDefault();
      return;
    }
    if (selected) puzzleState.move(selected, square);
  }
  function onPointerMove(event) {
    const current = dragRef.current;
    if (!current || current.pointerId !== event.pointerId) return;
    if (!current.moved && Math.hypot(event.clientX - current.startX, event.clientY - current.startY) < 8) return;
    current.moved = true;
    const rect = boardRef.current.getBoundingClientRect();
    setDrag({ id: current.id, x: ((event.clientX - rect.left) / rect.width) * 100 - 6.25, y: ((event.clientY - rect.top) / rect.height) * 100 - 6.25 });
  }
  function onPointerUp(event) {
    const current = dragRef.current;
    dragRef.current = null;
    setDrag(null);
    if (!current || current.pointerId !== event.pointerId) return;
    if (current.moved) {
      const target = squareAt(event.clientX, event.clientY);
      if (target && target !== current.from) puzzleState.move(current.from, target);
      return;
    }
    if (current.wasSelected) puzzleState.deselect();
  }
  function onPointerCancel() { dragRef.current = null; setDrag(null); }
  function onKeyDown(event) {
    const dirs = { ArrowUp: [0, 1], ArrowDown: [0, -1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
    const from = focusSquare || 'e4';
    if (dirs[event.key]) {
      event.preventDefault();
      const [dx, dy] = dirs[event.key];
      const next = `${FILES[Math.max(0, Math.min(7, FILES.indexOf(from[0]) + dx))]}${Math.max(1, Math.min(8, Number(from[1]) + dy))}`;
      setFocusSquare(next);
      boardRef.current?.querySelector(`[data-square="${next}"]`)?.focus();
    } else if ((event.key === 'Enter' || event.key === ' ') && !locked) { event.preventDefault(); choose(from); }
    else if (event.key === 'Escape') puzzleState.deselect();
  }
  function help() {
    if (locked) return;
    const mover = selected || Object.keys(game.pieces).find((sq) => game.pieces[sq].color === game.activeColor);
    if (mover) puzzleState.select(mover);
    if (puzzle.hintMoves?.length && !moves) setHintOn(true);
    say('think', `Tap the ${pieceName}, then a glowing spot. Try to reach a star!`, { voiceLine: true });
  }
  function retry() {
    setResult(null); setHintOn(false); misses.current = 0;
    puzzleState.reset();
    say('wave', world.kidGoal);
  }

  const body = (
    <div className="kg-stage">
      <PipBubble mood={pip.mood} size={78} who={world.crew}>{pip.text}</PipBubble>
      <div className="kg-board">
        <KidsBoard
          ref={boardRef}
          pieces={pieces} stars={stars} legal={legal} selected={selected} lastMove={lastMove}
          burst={burst} shake={shake} arrows={arrows} drag={drag}
          focusSquare={focusSquare} onSquareFocus={setFocusSquare} interactive
          label={`${world.title} puzzle ${index + 1}. ${world.kidGoal}`}
          boardProps={{ tabIndex: -1, onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onLostPointerCapture: onPointerCancel, onKeyDown }}
        >
          <AnimatePresence>
            {pendingPromotion && (
              <motion.div key="promo" className="kb-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Choose your new piece">
                <div className="kb-promo">
                  <strong>Pick your new piece!</strong>
                  <div>
                    {['q', 'r', 'b', 'n'].map((type) => (
                      <button type="button" key={type} onClick={() => puzzleState.promote(type)} aria-label={`Become a ${pieceNames[type]}`}>
                        <CourseChessPiece type={type} color="w" />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </KidsBoard>
      </div>
      <div className="kg-stars" aria-label={`${puzzle.targets.length - stars.length} of ${puzzle.targets.length} stars caught`}>
        {puzzle.targets.map((target, i) => (
          <span key={target} className={i < puzzle.targets.length - stars.length ? 'caught' : ''}><GoldStar className="kb-mini-star" /></span>
        ))}
      </div>
    </div>
  );

  let feedback = null;
  let footer;
  if (result) {
    feedback = { tone: 'good' };
    footer = (
      <>
        <FeedbackTitle icon={<Check size={30} strokeWidth={3.4} />} title="Hooray!" text={`You caught ${puzzle.targets.length} star${puzzle.targets.length === 1 ? '' : 's'}!`} />
        <button type="button" className="kid-btn kid-btn-go kid-btn-xl" onClick={onContinue} autoFocus>{continueLabel}</button>
      </>
    );
  } else if (failed) {
    feedback = { tone: 'bad' };
    footer = (
      <>
        <FeedbackTitle icon={<XIcon size={30} strokeWidth={3.4} />} title="Oops!" text="That path won't work. Let's try again." />
        <button type="button" className="kid-btn kid-btn-red kid-btn-xl" onClick={retry} autoFocus><RotateCcw size={22} /> Try again</button>
      </>
    );
  } else {
    footer = (
      <>
        <div className="ks-footer-left">
          <button type="button" className="kid-btn kid-btn-ghost" onClick={help} disabled={locked}><Lightbulb size={22} /> Help</button>
          <button type="button" className="kid-btn kid-btn-ghost" onClick={retry}><RotateCcw size={22} /> Restart</button>
        </div>
        <span className="ks-footer-hint">Catch every star!</span>
      </>
    );
  }
  return renderShell({ body, footer, feedback });
}
