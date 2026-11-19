// Sonidos sintetizados con WebAudio (no requiere archivos de audio).

import { Settings } from './SettingsStore.js';

let ctx = null;
function ac() {
  if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; } }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
}
function tone(freq, dur, type, vol, slide) {
  if (!Settings.get('sound')) return;
  const a = ac(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type || 'square';
  o.frequency.setValueAtTime(freq, a.currentTime);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), a.currentTime + dur);
  const v = (vol || 0.2) * Settings.get('volume');
  g.gain.setValueAtTime(v, a.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
  o.connect(g); g.connect(a.destination);
  o.start(); o.stop(a.currentTime + dur);
}
export const Sfx = {
  unlock: ac,
  click: () => tone(660, 0.06, 'square', 0.15),
  move: () => tone(440, 0.04, 'square', 0.1),
  bounce: () => tone(120, 0.07, 'sine', 0.35, -40),
  pass: () => tone(500, 0.08, 'triangle', 0.2, 200),
  shoot: () => tone(300, 0.15, 'triangle', 0.2, 300),
  swish: () => { tone(900, 0.2, 'sine', 0.2, -500); },
  rim: () => tone(220, 0.12, 'square', 0.25, -80),
  block: () => tone(160, 0.12, 'sawtooth', 0.3, -60),
  steal: () => tone(700, 0.1, 'square', 0.2, -300),
  whistle: () => { tone(1500, 0.25, 'sine', 0.25); setTimeout(() => tone(1500, 0.25, 'sine', 0.25), 280); },
  buzzer: () => tone(180, 0.8, 'sawtooth', 0.3),
  win: () => { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.2, 'square', 0.2), i * 150)); },
  lose: () => { [400, 330, 262, 196].forEach((f, i) => setTimeout(() => tone(f, 0.25, 'square', 0.2), i * 180)); }
};
