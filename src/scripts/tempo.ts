// Shared BPM control: − / + buttons (hold to repeat), slider and typed number stay in sync.

export interface TempoHandle {
  get: () => number;
  set: (bpm: number) => void;
}

export function bindTempo(root: HTMLElement, onChange: (bpm: number) => void): TempoHandle {
  const min = Number(root.dataset.min ?? 40);
  const max = Number(root.dataset.max ?? 200);
  const slider = root.querySelector<HTMLInputElement>('[data-slider]')!;
  const field = root.querySelector<HTMLInputElement>('[data-bpm]')!;
  const dec = root.querySelector<HTMLButtonElement>('[data-dec]')!;
  const inc = root.querySelector<HTMLButtonElement>('[data-inc]')!;

  let bpm = Number(field.value) || min;
  const clamp = (n: number) => Math.min(max, Math.max(min, Math.round(n)));

  const set = (n: number, notify = true) => {
    bpm = clamp(n);
    slider.value = String(bpm);
    field.value = String(bpm);
    if (notify) onChange(bpm);
  };

  slider.addEventListener('input', () => set(Number(slider.value)));
  field.addEventListener('change', () => set(Number(field.value) || bpm));
  field.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') field.blur();
  });

  const hold = (btn: HTMLButtonElement, delta: number) => {
    let delay = 0;
    let repeat = 0;
    const stop = () => {
      window.clearTimeout(delay);
      window.clearInterval(repeat);
    };
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      set(bpm + delta);
      delay = window.setTimeout(() => {
        repeat = window.setInterval(() => set(bpm + delta), 70);
      }, 400);
    });
    for (const ev of ['pointerup', 'pointerleave', 'pointercancel'] as const) btn.addEventListener(ev, stop);
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        set(bpm + delta);
      }
    });
  };
  hold(dec, -1);
  hold(inc, 1);

  set(bpm, false);
  return { get: () => bpm, set: (n) => set(n, false) };
}
