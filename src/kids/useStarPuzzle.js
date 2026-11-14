import { useCallback, useEffect, useRef, useState } from 'react';
import {
  applyCoursePieceMove,
  createCoursePiecePracticeGame,
  didCoursePieceMoveFail,
  getCoursePieceLegalMoves,
} from '../data/coursePiecePracticeData';

// Star-collecting puzzle state. The rules come entirely from the existing practice engine
// (coursePiecePracticeData.js); this hook only adds stable piece ids so pieces can glide.
function initialIds(game) {
  return Object.fromEntries(Object.keys(game.pieces).map((square) => [square, `piece-${square}`]));
}

export function useStarPuzzle(lesson, puzzle, { onStar, onIllegal, onSolved, onFailed, onMove } = {}) {
  const make = useCallback(() => {
    const game = createCoursePiecePracticeGame(lesson, puzzle);
    return {
      game,
      ids: initialIds(game),
      stars: [...puzzle.targets],
      selected: '',
      legal: [],
      lastMove: null,
      moves: 0,
      failed: false,
      solved: false,
      pendingPromotion: null,
      showHints: true,
      burst: '',
      shake: '',
    };
  }, [lesson, puzzle]);

  const [state, setState] = useState(make);
  const stateRef = useRef(state);
  stateRef.current = state;
  const callbacks = useRef({});
  callbacks.current = { onStar, onIllegal, onSolved, onFailed, onMove };
  const timers = useRef([]);

  const later = (fn, ms) => { timers.current.push(window.setTimeout(fn, ms)); };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const reset = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setState(make());
  }, [make]);

  // Callers key the component by puzzle id, so a new puzzle always mounts a fresh board.

  const legalFor = (s, square) => getCoursePieceLegalMoves(s.game, square, { ...puzzle, targets: s.stars });

  const select = useCallback((square) => {
    const s = stateRef.current;
    if (s.solved || s.failed || s.pendingPromotion) return false;
    const piece = s.game.pieces[square];
    if (!piece || piece.color !== s.game.activeColor) return false;
    setState({ ...s, selected: square, legal: legalFor(s, square) });
    return true;
  }, [puzzle]);

  const deselect = useCallback(() => {
    setState((s) => ({ ...s, selected: '', legal: [] }));
  }, []);

  const move = useCallback((from, to, promotion = null) => {
    const s = stateRef.current;
    if (!from || !to || s.solved || s.failed) return false;
    const moving = s.game.pieces[from];
    if (!moving) return false;
    const legal = legalFor(s, from);
    if (!legal.includes(to)) {
      setState({ ...s, selected: from, legal, shake: to });
      later(() => setState((current) => ({ ...current, shake: '' })), 420);
      callbacks.current.onIllegal?.({ from, to });
      return false;
    }
    if (moving.type === 'p' && (to.endsWith('8') || to.endsWith('1')) && !promotion) {
      setState({ ...s, selected: '', legal: [], pendingPromotion: { from, to } });
      return true;
    }
    const game = applyCoursePieceMove(s.game, from, to, promotion || 'q');
    const ids = { ...s.ids, [to]: s.ids[from] };
    delete ids[from];
    const caught = s.stars.includes(to);
    const stars = s.stars.filter((square) => square !== to);
    const moves = s.moves + 1;
    const failed = didCoursePieceMoveFail(game, { ...puzzle, targets: stars });
    const solved = !failed && stars.length === 0;
    setState({
      ...s,
      game, ids, stars, moves, failed, solved,
      selected: '', legal: [], pendingPromotion: null, showHints: false,
      lastMove: { from, to }, burst: caught ? to : '',
    });
    if (caught) later(() => setState((current) => ({ ...current, burst: '' })), 650);
    callbacks.current.onMove?.({ from, to, caught });
    if (caught && !solved) callbacks.current.onStar?.({ square: to, left: stars.length });
    if (failed) callbacks.current.onFailed?.();
    if (solved) callbacks.current.onSolved?.({ moves });
    return true;
  }, [puzzle]);

  const promote = useCallback((role) => {
    const pending = stateRef.current.pendingPromotion;
    if (pending) move(pending.from, pending.to, role);
  }, [move]);

  return { ...state, select, deselect, move, promote, reset };
}
