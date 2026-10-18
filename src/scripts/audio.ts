// Tiny drum synth + look-ahead step scheduler built on the Web Audio clock.
// No audio files: every sound is synthesised, so the site stays light.

export type Voice =
  | 'click'
  | 'clickAccent'
  | 'kick'
  | 'snare'
  | 'hihat'
  | 'hihatOpen'
  | 'tom1'
  | 'tom2'
  | 'tom3'
  | 'crash'
  | 'ride';

let ctx: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;

export function getCtx(): AudioContext {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function getNoise(c: AudioContext): AudioBuffer {
  if (!noiseBuffer) {
    noiseBuffer = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

function envelope(c: AudioContext, when: number, peak: number, decay: number): GainNode {
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), when + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, when + decay);
  g.connect(c.destination);
  return g;
}

function tone(c: AudioContext, when: number, type: OscillatorType, from: number, to: number, sweep: number, peak: number, decay: number) {
  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(from, when);
  osc.frequency.exponentialRampToValueAtTime(to, when + sweep);
  osc.connect(envelope(c, when, peak, decay));
  osc.start(when);
  osc.stop(when + decay + 0.05);
}

function hiss(c: AudioContext, when: number, filter: BiquadFilterType, freq: number, peak: number, decay: number, q = 0.7) {
  const src = c.createBufferSource();
  src.buffer = getNoise(c);
  const f = c.createBiquadFilter();
  f.type = filter;
  f.frequency.value = freq;
  f.Q.value = q;
  src.connect(f);
  f.connect(envelope(c, when, peak, decay));
  src.start(when, Math.random());
  src.stop(when + decay + 0.05);
}

export function playVoice(voice: Voice, when: number, level = 1): void {
  const c = getCtx();
  switch (voice) {
    case 'click':
      tone(c, when, 'sine', 1000, 1000, 0.01, 0.5 * level, 0.05);
      break;
    case 'clickAccent':
      tone(c, when, 'sine', 1600, 1600, 0.01, 0.8 * level, 0.06);
      break;
    case 'kick':
      tone(c, when, 'sine', 150, 42, 0.12, 1.0 * level, 0.4);
      hiss(c, when, 'lowpass', 400, 0.15 * level, 0.03);
      break;
    case 'snare':
      tone(c, when, 'triangle', 220, 170, 0.08, 0.35 * level, 0.12);
      hiss(c, when, 'highpass', 1400, 0.7 * level, 0.2);
      break;
    case 'hihat':
      hiss(c, when, 'highpass', 7500, 0.35 * level, 0.05);
      break;
    case 'hihatOpen':
      hiss(c, when, 'highpass', 7000, 0.35 * level, 0.35);
      break;
    case 'tom1':
      tone(c, when, 'sine', 320, 190, 0.12, 0.8 * level, 0.35);
      break;
    case 'tom2':
      tone(c, when, 'sine', 250, 145, 0.12, 0.8 * level, 0.4);
      break;
    case 'tom3':
      tone(c, when, 'sine', 190, 105, 0.14, 0.85 * level, 0.5);
      break;
    case 'crash':
      hiss(c, when, 'highpass', 4500, 0.5 * level, 1.4);
      break;
    case 'ride':
      hiss(c, when, 'bandpass', 8000, 0.3 * level, 0.6, 1.5);
      tone(c, when, 'square', 3400, 3400, 0.01, 0.04 * level, 0.3);
      break;
  }
}

/** Only one thing makes noise at a time: starting a player stops the others. */
const PLAY_EVENT = 'backbeat:play';
export function announcePlaying(owner: object): void {
  window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: owner }));
}
export function onOtherPlaying(owner: object, stop: () => void): void {
  window.addEventListener(PLAY_EVENT, (e) => {
    if ((e as CustomEvent).detail !== owner) stop();
  });
}

interface SchedulerOptions {
  /** Seconds per step, read on every step so tempo changes apply instantly. */
  stepDuration: () => number;
  /** Called a little ahead of time with the exact audio time to play at. */
  onStep: (step: number, time: number) => void;
  /** Called (on animation frames) when a step actually becomes audible. */
  onVisual: (step: number) => void;
}

export class StepScheduler {
  private timer = 0;
  private raf = 0;
  private nextTime = 0;
  private step = 0;
  private queue: { step: number; time: number }[] = [];
  running = false;

  constructor(private opts: SchedulerOptions) {}

  start(): void {
    if (this.running) return;
    const c = getCtx();
    this.running = true;
    this.step = 0;
    this.queue = [];
    this.nextTime = c.currentTime + 0.08;
    this.tick();
    this.draw();
  }

  stop(): void {
    this.running = false;
    window.clearTimeout(this.timer);
    cancelAnimationFrame(this.raf);
    this.queue = [];
  }

  private tick = (): void => {
    if (!this.running) return;
    const c = getCtx();
    while (this.nextTime < c.currentTime + 0.12) {
      this.opts.onStep(this.step, this.nextTime);
      this.queue.push({ step: this.step, time: this.nextTime });
      this.nextTime += this.opts.stepDuration();
      this.step++;
    }
    this.timer = window.setTimeout(this.tick, 25);
  };

  private draw = (): void => {
    if (!this.running) return;
    const now = getCtx().currentTime;
    let latest = -1;
    while (this.queue.length && this.queue[0].time <= now) latest = this.queue.shift()!.step;
    if (latest >= 0) this.opts.onVisual(latest);
    this.raf = requestAnimationFrame(this.draw);
  };
}
