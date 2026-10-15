import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, RotateCcw, Star, Volume2, VolumeX } from 'lucide-react';
import { CourseChessPiece } from './CourseChessPiece';
import {
  applyCoursePieceMove,
  coursePiecePracticeLessons,
  createCoursePiecePracticeGame,
  didCoursePieceMoveFail,
  getCoursePieceLegalMoves,
} from '../data/coursePiecePracticeData';
import './CoursePiecePracticeView.css';

const files = 'abcdefgh';
const progressKey = 'course-lichess-learn-v1';
const pieceNames = { r: 'rook', b: 'bishop', q: 'queen', k: 'king', n: 'knight', p: 'pawn' };
const findLesson = (id) => coursePiecePracticeLessons.find((item) => item.id === id) || coursePiecePracticeLessons[0];
const clampPuzzle = (value, count) => Math.max(0, Math.min(count - 1, Number.isInteger(Number(value)) ? Number(value) : 0));

function readProgress() {
  try {
    const value = JSON.parse(localStorage.getItem(progressKey) || '{}');
    return value && typeof value === 'object' ? value : {};
  } catch {
    return {};
  }
}

function playSuccessSound() {
  try {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = 690;
    gain.gain.value = 0.045;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.onended = () => context.close();
    oscillator.start();
    oscillator.stop(context.currentTime + 0.18);
  } catch {
    // Audio is optional; browsers without Web Audio still get the visual reward.
  }
}

function LessonStar({ className = '' }) {
  const gradientId = useId().replaceAll(':', '');
  return (
    <svg className={`learn-star-svg ${className}`.trim()} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#fff27b" />
          <stop offset="0.45" stopColor="#ffc527" />
          <stop offset="1" stopColor="#ff8b0a" />
        </linearGradient>
      </defs>
      <path
        d="m50 5 12.6 28.8 31.2 2.9-23.5 20.7 6.7 30.6L50 72.2 23 88l6.7-30.6L6.2 36.7l31.2-2.9L50 5Z"
        fill={`url(#${gradientId})`}
        stroke="#e98312"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="m39 40 11-25 10 25" fill="none" stroke="#fff9c6" strokeOpacity=".65" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function CoursePiecePracticeView({
  pieceId = 'rook',
  initialPuzzle = 0,
  onLessonComplete,
  courseSidebarOpen = true,
  onShowCourseContent,
  onSelectPuzzle,
  onSelectPiece,
  compact = false,
}) {
  const [activeId, setActiveId] = useState(() => findLesson(pieceId).id);
  const lesson = findLesson(activeId);
  const [open, setOpen] = useState(() => findLesson(pieceId).id);
  const [challenge, setChallenge] = useState(() => clampPuzzle(initialPuzzle, findLesson(pieceId).puzzles.length));
  const puzzle = lesson.puzzles[challenge] || lesson.puzzles[0];
  const [game, setGame] = useState(() => createCoursePiecePracticeGame(lesson, puzzle));
  const [remainingStars, setRemainingStars] = useState(() => [...puzzle.targets]);
  const [selected, setSelected] = useState('');
  const [legal, setLegal] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [focusedSquare, setFocusedSquare] = useState(() => Object.keys(game.pieces)[0] || 'e4');
  const [moveCount, setMoveCount] = useState(0);
  const [failed, setFailed] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const [pendingPromotion, setPendingPromotion] = useState(null);
  const [complete, setComplete] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [status, setStatus] = useState(puzzle.prompt);
  const [progress, setProgress] = useState(readProgress);
  const [sound, setSound] = useState(() => localStorage.getItem('course-practice-sound') !== 'off');
  const [drag, setDrag] = useState(null);
  const [motion, setMotion] = useState(null);
  const [starBurst, setStarBurst] = useState('');

  const boardRef = useRef(null);
  const dragRef = useRef(null);
  const progressionTimer = useRef(null);
  const motionTimer = useRef(null);
  const burstTimer = useRef(null);
  const animationFrame = useRef(null);
  const motionId = useRef(0);
  const completionLock = useRef(false);
  const completedCallbackLock = useRef(false);

  const completedChallenges = progress[activeId]?.completed || [];
  const capturedStars = puzzle.targets.length - remainingStars.length;

  useEffect(() => {
    const nextId = findLesson(pieceId).id;
    setActiveId(nextId);
    setOpen(nextId);
    setChallenge(clampPuzzle(initialPuzzle, findLesson(pieceId).puzzles.length));
  }, [pieceId, initialPuzzle]);

  useEffect(() => {
    clearTimeout(progressionTimer.current);
    clearTimeout(motionTimer.current);
    clearTimeout(burstTimer.current);
    cancelAnimationFrame(animationFrame.current);
    completionLock.current = false;
    completedCallbackLock.current = false;
    const resetGame = createCoursePiecePracticeGame(lesson, puzzle);
    setGame(resetGame);
    setRemainingStars([...puzzle.targets]);
    setSelected('');
    setLegal([]);
    setLastMove(null);
    setFocusedSquare(Object.keys(resetGame.pieces)[0] || 'e4');
    setMoveCount(0);
    setFailed(false);
    setShowHints(true);
    setPendingPromotion(null);
    setComplete(false);
    setLessonComplete(false);
    setDrag(null);
    setMotion(null);
    setStarBurst('');
    dragRef.current = null;
    setStatus(puzzle.prompt);

    return () => {
      clearTimeout(progressionTimer.current);
      clearTimeout(motionTimer.current);
      clearTimeout(burstTimer.current);
      cancelAnimationFrame(animationFrame.current);
    };
  }, [activeId, challenge]);

  function animatePiece(piece, from, to, size, toSquare) {
    if (!piece || !from || !to) return;
    clearTimeout(motionTimer.current);
    cancelAnimationFrame(animationFrame.current);
    const id = ++motionId.current;
    setMotion({ id, piece: { ...piece }, from, to, toSquare, size, phase: 'waiting' });
    animationFrame.current = requestAnimationFrame(() => {
      setMotion((current) => current?.id === id ? { ...current, phase: 'settling' } : current);
    });
    motionTimer.current = window.setTimeout(() => {
      setMotion((current) => current?.id === id ? null : current);
    }, 230);
  }

  function boardSquareRect(square) {
    return boardRef.current?.querySelector(`[data-square="${square}"]`)?.getBoundingClientRect() || null;
  }

  function squareCenter(square) {
    const rect = boardSquareRect(square);
    return rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, size: rect.width } : null;
  }

  function completePuzzle() {
    if (completionLock.current) return;
    completionLock.current = true;
    setComplete(true);

    const stored = readProgress();
    const pieceProgress = stored[activeId] || { completed: [], stars: 0 };
    if (!pieceProgress.completed.includes(challenge)) {
      pieceProgress.completed = [...pieceProgress.completed, challenge].sort((a, b) => a - b);
      pieceProgress.stars = pieceProgress.completed.length;
    }
    stored[activeId] = pieceProgress;
    localStorage.setItem(progressKey, JSON.stringify(stored));
    setProgress(stored);

    if (sound) playSuccessSound();
    progressionTimer.current = window.setTimeout(() => {
      const nextInSequence = challenge + 1;
      if (nextInSequence < lesson.puzzles.length) {
        selectPuzzle(nextInSequence);
        return;
      }

      const nextIncomplete = lesson.puzzles.findIndex((_, index) => !pieceProgress.completed.includes(index));
      if (nextIncomplete >= 0) {
        selectPuzzle(nextIncomplete);
        return;
      }

      setLessonComplete(true);
      if (!completedCallbackLock.current) {
        completedCallbackLock.current = true;
        onLessonComplete?.();
      }
    }, 520);
  }

  function showStarBurst(square) {
    clearTimeout(burstTimer.current);
    setStarBurst(square);
    burstTimer.current = window.setTimeout(() => setStarBurst(''), 420);
  }

  function movePiece(from, to, dragStart = null, promotion = null) {
    if (!from || !to || complete || failed || completionLock.current) return false;
    const movingPiece = game.pieces[from];
    const source = dragStart || squareCenter(from);
    const destination = squareCenter(to);
    const pieceSize = source?.size || destination?.size || boardRef.current?.clientWidth / 8 || 56;
    const level = { ...puzzle, targets: remainingStars };
    if (!getCoursePieceLegalMoves(game, from, level).includes(to)) {
      if (dragStart && movingPiece) animatePiece(movingPiece, dragStart, squareCenter(from), pieceSize, from);
      setStatus(`That square is not reachable. ${lesson.rule}.`);
      setSelected('');
      setLegal([]);
      return false;
    }

    if (movingPiece.type === 'p' && (to.endsWith('8') || to.endsWith('1')) && !promotion) {
      setPendingPromotion({ from, to, dragStart });
      setSelected('');
      setLegal([]);
      setStatus('Your pawn reached the other side. Choose what it becomes.');
      return true;
    }

    const nextGame = applyCoursePieceMove(game, from, to, promotion || 'q');
    const nextStars = remainingStars.filter((square) => square !== to);
    setGame(nextGame);
    setRemainingStars(nextStars);
    setMoveCount((count) => count + 1);
    setShowHints(false);
    setLastMove({ from, to });
    setSelected('');
    setLegal([]);
    setFocusedSquare(to);
    setPendingPromotion(null);
    if (movingPiece) animatePiece(movingPiece, source, destination, pieceSize, to);

    if (remainingStars.includes(to)) showStarBurst(to);
    if (didCoursePieceMoveFail(nextGame, { ...puzzle, targets: nextStars })) {
      setFailed(true);
      setStatus('That move misses the lesson path. Reset the exercise and try again.');
    } else if (!nextStars.length) {
      setStatus('Every star collected. Great work!');
      completePuzzle();
    } else if (remainingStars.includes(to)) {
      setStatus(`Star collected. ${nextStars.length} left to find.`);
    } else {
      setStatus(`Good move. ${lesson.rule}. Keep going to a star.`);
    }
    return true;
  }

  function choosePromotion(role) {
    if (!pendingPromotion) return;
    const pending = pendingPromotion;
    setPendingPromotion(null);
    movePiece(pending.from, pending.to, pending.dragStart, role);
  }

  function selectPuzzle(index) {
    const next = clampPuzzle(index, lesson.puzzles.length);
    setChallenge(next);
    onSelectPuzzle?.(next);
  }

  function selectSquare(square) {
    if (complete || failed || pendingPromotion || completionLock.current) return;
    const piece = game.pieces[square];

    if (selected) {
      if (selected === square) {
        setSelected('');
        setLegal([]);
        setStatus(puzzle.prompt);
        return;
      }
      if (movePiece(selected, square)) return;
      if (piece?.color === 'w') {
        setSelected(square);
        setLegal(getCoursePieceLegalMoves(game, square, { ...puzzle, targets: remainingStars }));
        setStatus('Choose a glowing legal destination.');
      }
      return;
    }

    if (piece?.color === 'w') {
      setSelected(square);
      setLegal(getCoursePieceLegalMoves(game, square, { ...puzzle, targets: remainingStars }));
      setStatus('Choose a glowing legal destination.');
    }
  }

  function squareAt(clientX, clientY) {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect || clientX < rect.left || clientY < rect.top || clientX >= rect.right || clientY >= rect.bottom) return null;
    const x = Math.floor((clientX - rect.left) / (rect.width / 8));
    const row = Math.floor((clientY - rect.top) / (rect.height / 8));
    return `${files[x]}${8 - row}`;
  }

  function pointerDown(event) {
    const square = squareAt(event.clientX, event.clientY);
    if (!square || dragRef.current) return;
    const piece = game.pieces[square];
    if (piece?.color !== game.activeColor || complete || failed || pendingPromotion || completionLock.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const size = boardRect.width / 8;
    const file = files.indexOf(square[0]);
    const row = 8 - Number(square[1]);
    const centerX = boardRect.left + (file + 0.5) * size;
    const centerY = boardRect.top + (row + 0.5) * size;
    setSelected(square);
    setLegal(getCoursePieceLegalMoves(game, square, { ...puzzle, targets: remainingStars }));
    setFocusedSquare(square);
    dragRef.current = {
      from: square,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      x: centerX,
      y: centerY,
      offsetX: event.clientX - centerX,
      offsetY: event.clientY - centerY,
      size,
      moved: false,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }

  function pointerMove(event) {
    const current = dragRef.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const moved = current.moved || Math.hypot(event.clientX - current.startX, event.clientY - current.startY) > 5;
    const next = {
      ...current,
      x: event.clientX - current.offsetX,
      y: event.clientY - current.offsetY,
      moved,
    };
    dragRef.current = next;
    if (moved) setDrag(next);
  }

  function returnDraggedPiece(current, message = 'Piece returned. Try another square.') {
    const piece = game.pieces[current.from];
    if (piece) animatePiece(piece, { x: current.x, y: current.y, size: current.size }, squareCenter(current.from), current.size, current.from);
    setSelected('');
    setLegal([]);
    setStatus(message);
  }

  function pointerUp(event) {
    const current = dragRef.current;
    const destination = squareAt(event.clientX, event.clientY);
    if (current && current.pointerId === event.pointerId) {
      const dragStart = { x: event.clientX - current.offsetX, y: event.clientY - current.offsetY, size: current.size };
      if (current.moved && destination) {
        movePiece(current.from, destination, dragStart);
      } else if (current.moved) {
        returnDraggedPiece({ ...current, ...dragStart }, 'Drop your piece on the board.');
      }
      dragRef.current = null;
      setDrag(null);
      return;
    }
    if (destination) selectSquare(destination);
  }

  function pointerCancel(event) {
    const current = dragRef.current;
    if (current && (event.pointerId == null || current.pointerId === event.pointerId) && current.moved) {
      returnDraggedPiece(current);
    }
    dragRef.current = null;
    setDrag(null);
  }

  function handleBoardKey(event) {
    const directions = { ArrowUp: [0, 1], ArrowDown: [0, -1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
    if (directions[event.key]) {
      const [dx, dy] = directions[event.key];
      const file = Math.max(0, Math.min(7, files.indexOf(focusedSquare[0]) + dx));
      const rank = Math.max(1, Math.min(8, Number(focusedSquare[1]) + dy));
      const nextSquare = `${files[file]}${rank}`;
      event.preventDefault();
      setFocusedSquare(nextSquare);
      boardRef.current?.querySelector(`[data-square="${nextSquare}"]`)?.focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectSquare(focusedSquare);
    }
  }

  function resetPuzzle() {
    clearTimeout(progressionTimer.current);
    clearTimeout(motionTimer.current);
    clearTimeout(burstTimer.current);
    cancelAnimationFrame(animationFrame.current);
    completionLock.current = false;
    completedCallbackLock.current = false;
    const resetGame = createCoursePiecePracticeGame(lesson, puzzle);
    setGame(resetGame);
    setRemainingStars([...puzzle.targets]);
    setSelected('');
    setLegal([]);
    setLastMove(null);
    setFocusedSquare(Object.keys(resetGame.pieces)[0] || 'e4');
    setMoveCount(0);
    setFailed(false);
    setShowHints(true);
    setPendingPromotion(null);
    setComplete(false);
    setLessonComplete(false);
    setDrag(null);
    setMotion(null);
    setStarBurst('');
    dragRef.current = null;
    setStatus(puzzle.prompt);
  }

  function choosePiece(item) {
    const courseIndex = ['rook', 'bishop', 'queen', 'king', 'pawn', 'knight'].indexOf(item.id);
    onSelectPiece?.(courseIndex);
    setActiveId(item.id);
    selectPuzzle(0);
    setOpen(item.id);
  }

  return (
    <div className={`learn-chess-shell ${courseSidebarOpen ? 'course-sidebar-open' : ''} ${compact ? 'learn-compact' : ''}`}>
      <aside className="learn-piece-menu" aria-label="Chess piece lessons">
        <div className="learn-menu-head"><div className="learn-menu-mark">♟</div><span>Menu</span>{!courseSidebarOpen && <button className="learn-course-content-button" onClick={onShowCourseContent}>Course content</button>}</div>
        <div className="learn-menu-title">Chess pieces</div>
        {coursePiecePracticeLessons.map((item) => (
          <React.Fragment key={item.id}>
            <button
              className={`learn-piece-row ${activeId === item.id ? 'selected' : ''}`}
              onClick={() => choosePiece(item)}
              aria-expanded={open === item.id && activeId === item.id}
            >
              <span className="learn-piece-icon" style={{ background: item.color }}>
                <CourseChessPiece type={item.type} color="w" />
              </span>
              {item.name}
            </button>
            {open === item.id && activeId === item.id && (
              <div className="learn-piece-submenu" aria-label={`${item.name} puzzles`}>
                {item.puzzles.map((entry, index) => (
                  <button key={entry.id} className={challenge === index ? 'selected' : ''} onClick={() => selectPuzzle(index)}>
                    <span>{completedChallenges.includes(index) ? <Check size={13} /> : index + 1}</span>{entry.title}
                  </button>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}
        <div className="learn-menu-categories"><span>Fundamentals</span><span>Intermediate</span><span>Advanced</span></div>
      </aside>

      <section className="learn-board-stage" key={`${activeId}-${challenge}`} aria-label={`${lesson.name} board`}>
        <div className="learn-board-frame">
          <div
            ref={boardRef}
            className="learn-board"
            role="grid"
            aria-label={`${lesson.name} practice board`}
            tabIndex={0}
            onKeyDown={handleBoardKey}
            onPointerDown={pointerDown}
            onPointerMove={pointerMove}
            onPointerUp={pointerUp}
            onPointerCancel={pointerCancel}
            onLostPointerCapture={pointerCancel}
          >
            {Array.from({ length: 64 }, (_, index) => {
              const x = index % 8;
              const rank = 8 - Math.floor(index / 8);
              const square = `${files[x]}${rank}`;
              const piece = game.pieces[square];
              const isDark = (x + rank) % 2 === 1;
              const isTarget = remainingStars.includes(square) && !complete;
              const isLastMove = lastMove && (square === lastMove.from || square === lastMove.to);
              const isArrival = motion && motion.toSquare === square;
              const classes = [
                'learn-square', isDark ? 'dark' : 'light',
                selected === square ? 'selected' : '', legal.includes(square) ? 'legal' : '',
                isTarget ? 'star-square' : '', drag?.from === square ? 'drag-source' : '',
                isLastMove ? 'last-move' : '', isArrival ? 'move-arrival' : '',
              ].filter(Boolean).join(' ');

              return (
                <div
                  key={square}
                  data-square={square}
                  className={classes}
                  role="gridcell"
                  aria-label={`${square}${piece ? `, ${piece.color === 'w' ? 'white' : 'black'} ${pieceNames[piece.type]}` : ''}${isTarget ? ', star target' : ''}`}
                  aria-selected={selected === square}
                  tabIndex={focusedSquare === square ? 0 : -1}
                  onFocus={() => setFocusedSquare(square)}
                  onClick={(event) => { if (event.detail === 0) selectSquare(square); }}
                >
                  {isTarget && <LessonStar className="learn-star" />}
                  {legal.includes(square) && <span className={`learn-legal-indicator ${piece || (isTarget && !puzzle.emptyApples) ? 'capture' : ''}`} />}
                  {piece && <span className={`learn-chess-piece ${piece.color === 'b' ? 'black' : ''}`}><CourseChessPiece type={piece.type} color={piece.color} /></span>}
                  {starBurst === square && <LessonStar className="learn-star-burst" />}
                  {x === 7 && <i className="learn-rank">{rank}</i>}
                  {rank === 1 && <i className="learn-file">{files[x]}</i>}
                </div>
              );
            })}
            {showHints && puzzle.hintMoves.length > 0 && (
              <svg className="learn-hint-arrows" viewBox="0 0 8 8" aria-hidden="true">
                <defs><marker id="learn-hint-arrowhead" markerWidth="5" markerHeight="5" refX="3.8" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#779454" /></marker></defs>
                {puzzle.hintMoves.map((move, index) => {
                  const fromX = files.indexOf(move[0]) + 0.5;
                  const fromY = 8.5 - Number(move[1]);
                  const toX = files.indexOf(move[2]) + 0.5;
                  const toY = 8.5 - Number(move[3]);
                  return <line key={`${move}-${index}`} x1={fromX} y1={fromY} x2={toX} y2={toY} markerEnd="url(#learn-hint-arrowhead)" />;
                })}
              </svg>
            )}
          </div>
        </div>
      </section>

      <aside className="learn-challenge-card" aria-label={`${lesson.name} lesson controls`}>
        <header>
          <span className="learn-card-piece"><CourseChessPiece type={lesson.type} color="w" /></span>
          <div><h1>{lesson.name}</h1><p>{lesson.rule}</p></div>
          <div className="learn-card-actions">
            <button className="learn-card-action" aria-label="Reset puzzle" title="Reset puzzle" onClick={resetPuzzle}><RotateCcw size={17} /></button>
            <button
              className="learn-card-action"
              aria-label={sound ? 'Mute sound' : 'Enable sound'}
              title={sound ? 'Mute sound' : 'Enable sound'}
              onClick={() => setSound((value) => {
                localStorage.setItem('course-practice-sound', value ? 'off' : 'on');
                return !value;
              })}
            >{sound ? <Volume2 size={17} /> : <VolumeX size={17} />}</button>
          </div>
        </header>
        {complete ? (
          <div className="learn-success">
            <strong>{lessonComplete ? 'Lesson complete!' : 'Perfect!'}</strong>
            <div className="success-stars" aria-label={`${puzzle.targets.length} stars captured`}>
              <Star size={25} fill="currentColor" aria-hidden="true" />
              <span>{puzzle.targets.length}</span>
            </div>
            <p>{lessonComplete ? lesson.complete : 'Every star collected. Great work!'}</p>
          </div>
        ) : (
          <div className="learn-card-instruction" aria-live="polite">
            <span>{status}</span>
            <small>Moves {moveCount} · target {puzzle.nbMoves}</small>
            <div className="learn-star-count" aria-label={`${capturedStars} of ${puzzle.targets.length} stars captured`}>
              <Star size={15} fill="currentColor" aria-hidden="true" />
              <span>{capturedStars} / {puzzle.targets.length} captured</span>
            </div>
          </div>
        )}
        <nav className="learn-challenge-numbers" aria-label="Choose a puzzle" style={{ gridTemplateColumns: `repeat(${lesson.puzzles.length}, minmax(0, 1fr))` }}>
          {lesson.puzzles.map((entry, index) => (
            <button
              key={entry.id}
              aria-label={`Puzzle ${index + 1}: ${entry.title}${completedChallenges.includes(index) ? ', completed' : ''}`}
              aria-current={challenge === index ? 'step' : undefined}
              className={`${challenge === index ? 'active' : ''} ${completedChallenges.includes(index) ? 'done' : ''}`}
              onClick={() => selectPuzzle(index)}
            >
              {completedChallenges.includes(index) ? <Star size={16} fill="currentColor" /> : index + 1}
            </button>
          ))}
        </nav>
        {pendingPromotion && (
          <div className="learn-promotion-dialog" role="dialog" aria-modal="true" aria-label="Choose a promotion piece">
            <strong>Choose your new piece</strong>
            <div>{['q', 'r', 'b', 'n'].map((type) => (
              <button key={type} aria-label={`Promote to ${pieceNames[type]}`} onClick={() => choosePromotion(type)}>
                <CourseChessPiece type={type} color="w" />
              </button>
            ))}</div>
          </div>
        )}
      </aside>
      {(drag || motion) && createPortal(
        <>
          {drag && (
            <div className="learn-drag-piece" style={{ left: drag.x, top: drag.y, width: drag.size, height: drag.size }}>
              <CourseChessPiece type={game.pieces[drag.from]?.type || lesson.type} color="w" />
            </div>
          )}
          {motion && (
            <div
              className={`learn-snap-piece ${motion.phase === 'settling' ? 'settling' : ''}`}
              style={{
                left: motion.phase === 'settling' ? motion.to.x : motion.from.x,
                top: motion.phase === 'settling' ? motion.to.y : motion.from.y,
                width: motion.size,
                height: motion.size,
              }}
              onTransitionEnd={(event) => {
                if (event.propertyName === 'left' || event.propertyName === 'top') {
                  const id = motion.id;
                  setMotion((current) => current?.id === id ? null : current);
                }
              }}
            >
              <CourseChessPiece type={motion.piece.type} color={motion.piece.color} />
            </div>
          )}
        </>,
        document.body,
      )}
    </div>
  );
}
