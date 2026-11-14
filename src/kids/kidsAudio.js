// Small Web Audio sound effects and optional speech guidance. Everything here is
// optional: browsers without Web Audio or speech synthesis still get visual feedback.
export const SOUND_KEY = 'course-practice-sound'; // shared with the course player
export const VOICE_KEY = 'kids-world-voice';

export function readToggle(key, fallback = true) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value !== 'off';
  } catch {
    return fallback;
  }
}

export function writeToggle(key, on) {
  try { localStorage.setItem(key, on ? 'on' : 'off'); } catch { /* storage unavailable */ }
}

let context = null;
function audio() {
  try {
    if (!context) context = new (window.AudioContext || window.webkitAudioContext)();
    if (context.state === 'suspended') context.resume();
    return context;
  } catch {
    return null;
  }
}

function tone(ctx, { freq, start = 0, length = 0.14, type = 'sine', volume = 0.05, slideTo = null }) {
  const now = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, now + length);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + length);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + length + 0.02);
}

const effects = {
  tap: [{ freq: 520, length: 0.06, type: 'triangle', volume: 0.03 }],
  move: [{ freq: 330, length: 0.09, type: 'triangle', volume: 0.04, slideTo: 440 }],
  star: [
    { freq: 784, length: 0.12, type: 'triangle' },
    { freq: 1047, start: 0.07, length: 0.16, type: 'triangle' },
  ],
  oops: [{ freq: 280, length: 0.18, type: 'sine', volume: 0.04, slideTo: 220 }],
  step: [{ freq: 600, length: 0.05, type: 'sine', volume: 0.025, slideTo: 420 }],
  boing: [{ freq: 220, length: 0.28, type: 'sine', volume: 0.05, slideTo: 660 }],
  pop: [{ freq: 900, length: 0.07, type: 'triangle', volume: 0.03, slideTo: 1300 }],
  solved: [
    { freq: 523, length: 0.14, type: 'triangle' },
    { freq: 659, start: 0.1, length: 0.14, type: 'triangle' },
    { freq: 784, start: 0.2, length: 0.14, type: 'triangle' },
    { freq: 1047, start: 0.3, length: 0.3, type: 'triangle', volume: 0.06 },
  ],
  unlock: [
    { freq: 392, length: 0.16, type: 'sine' },
    { freq: 587, start: 0.12, length: 0.16, type: 'sine' },
    { freq: 784, start: 0.24, length: 0.4, type: 'sine', volume: 0.06 },
  ],
};

export function playEffect(name, enabled = true) {
  if (!enabled) return;
  const ctx = audio();
  if (!ctx || !effects[name]) return;
  try { effects[name].forEach((note) => tone(ctx, note)); } catch { /* ignore */ }
}

let preferredVoice;
function pickVoice() {
  if (preferredVoice !== undefined) return preferredVoice;
  const voices = window.speechSynthesis?.getVoices?.() || [];
  if (!voices.length) return null;
  preferredVoice = voices.find((v) => /en[-_](GB|US|IN)/i.test(v.lang) && /female|zira|samantha|google uk english female|aria|jenny/i.test(v.name))
    || voices.find((v) => /^en/i.test(v.lang)) || null;
  return preferredVoice;
}

export function voiceSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
}

/** Speaks a short line. Returns a promise that resolves when speech ends (or right away). */
export function speak(text, enabled = true) {
  if (!enabled || !text || !voiceSupported()) return Promise.resolve(false);
  return new Promise((resolve) => {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/…/g, ', '));
      const voice = pickVoice();
      if (voice) utterance.voice = voice;
      utterance.rate = 0.95;
      utterance.pitch = 1.15;
      utterance.onend = () => resolve(true);
      utterance.onerror = () => resolve(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      resolve(false);
    }
  });
}

export function stopSpeaking() {
  try { window.speechSynthesis?.cancel(); } catch { /* ignore */ }
}
