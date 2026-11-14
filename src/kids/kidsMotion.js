import { useEffect, useState } from 'react';

// Motion tiers for Kids World:
//   full    – the complete storyboard (camera moves, Pip walking, page transitions)
//   lite    – short, transform/opacity-only versions for low-end devices; no page transitions
//   reduced – the person asked the OS for less motion: instant state changes plus text/toast feedback
export const MOTION_OVERRIDE_KEY = 'kids-motion';

/** Pure tier decision so it can be unit tested. */
export function decideMotionTier({ prefersReduced = false, cores, memory, saveData = false, override } = {}) {
  if (override === 'full' || override === 'lite' || override === 'reduced') return override;
  if (prefersReduced) return 'reduced';
  if (saveData) return 'lite';
  if (Number.isFinite(memory) && memory <= 2) return 'lite';
  if (Number.isFinite(cores) && cores <= 2) return 'lite';
  if (Number.isFinite(memory) && Number.isFinite(cores) && memory <= 4 && cores <= 4) return 'lite';
  return 'full';
}

function readOverride() {
  try { return localStorage.getItem(MOTION_OVERRIDE_KEY) || undefined; } catch { return undefined; }
}

function currentTier() {
  if (typeof window === 'undefined') return 'full';
  return decideMotionTier({
    prefersReduced: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    cores: navigator.hardwareConcurrency,
    memory: navigator.deviceMemory,
    saveData: Boolean(navigator.connection?.saveData),
    override: readOverride(),
  });
}

/** Live motion tier; follows the OS reduced-motion setting if it changes. */
export function useMotionTier() {
  const [tier, setTier] = useState(currentTier);
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return undefined;
    const update = () => setTier(currentTier());
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);
  return tier;
}

// Waits for the new page to be in the DOM. Uses a MutationObserver + timer, NOT
// requestAnimationFrame: rendering (and rAF) is paused while a view transition captures.
function waitForSelector(selector, timeout = 600) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) { resolve(); return; }
    let timer = 0;
    const observer = new MutationObserver(() => {
      if (!document.querySelector(selector)) return;
      observer.disconnect();
      clearTimeout(timer);
      resolve();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    timer = window.setTimeout(() => { observer.disconnect(); resolve(); }, timeout);
  });
}

let activeTransition = null;

/**
 * Navigates inside a View Transition when the tier allows it and the browser supports it.
 * kind 'enter': circle reveal from `originEl`, whose disc morphs into the level header disc.
 * kind 'back': short crossfade.
 */
export function navigateWithTransition(navigate, to, { tier, kind = 'enter', originEl = null, waitFor, state } = {}) {
  const go = () => navigate(to, state ? { state } : undefined);
  if (tier !== 'full' || typeof document.startViewTransition !== 'function' || activeTransition) {
    go();
    return;
  }
  const root = document.documentElement;
  const disc = originEl?.querySelector?.('.kw-disc') || null;
  if (kind === 'enter' && originEl) {
    const rect = originEl.getBoundingClientRect();
    root.style.setProperty('--vt-x', `${Math.round(rect.left + rect.width / 2)}px`);
    root.style.setProperty('--vt-y', `${Math.round(rect.top + rect.height / 2)}px`);
    if (disc) disc.style.viewTransitionName = 'kw-world-disc';
  }
  root.dataset.vt = kind;
  try {
    activeTransition = document.startViewTransition(async () => {
      if (disc) disc.style.viewTransitionName = '';
      go();
      await waitForSelector(waitFor || (kind === 'enter' ? '.kl-page' : '.kw-map'));
    });
  } catch {
    delete root.dataset.vt;
    go();
    return;
  }
  activeTransition.finished.finally(() => {
    delete root.dataset.vt;
    activeTransition = null;
  });
}

/**
 * Smoothly scrolls the window to `top` over `duration` ms. Any wheel, touch, key or pointer
 * input cancels it immediately (no scroll hijacking). Returns a cancel function.
 */
export function tweenScroll(top, duration, onDone) {
  const start = window.scrollY;
  const distance = top - start;
  const began = performance.now();
  let frame = 0;
  let stopped = false;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
  const stop = () => {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(frame);
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((type) => window.removeEventListener(type, stop, true));
    onDone?.();
  };
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((type) => window.addEventListener(type, stop, { capture: true, passive: true }));
  const step = (now) => {
    const t = Math.min(1, (now - began) / duration);
    window.scrollTo(0, start + distance * ease(t));
    if (t < 1) frame = requestAnimationFrame(step);
    else stop();
  };
  frame = requestAnimationFrame(step);
  return stop;
}
