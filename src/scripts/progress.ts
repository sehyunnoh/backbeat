// Progress lives in the browser only (localStorage). If storage is blocked
// (private window, strict settings) we fall back to memory for this visit.

const KEY = 'backbeat:v1';
export const PROGRESS_EVENT = 'backbeat:progress';

export interface LessonState {
  done: boolean;
  at?: number;
  bpm?: number;
}
export interface Progress {
  lessons: Record<string, LessonState>;
  videos: Record<string, boolean>;
}

const empty = (): Progress => ({ lessons: {}, videos: {} });
let memory: Progress | null = null;

export function getProgress(): Progress {
  if (memory) return memory;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Progress>;
      return { lessons: parsed.lessons ?? {}, videos: parsed.videos ?? {} };
    }
  } catch {
    // unreadable or blocked: start fresh
  }
  return empty();
}

function save(p: Progress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
    memory = null;
  } catch {
    memory = p;
  }
  window.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
}

export function setLessonDone(id: string, done: boolean): void {
  const p = getProgress();
  p.lessons[id] = { ...p.lessons[id], done, at: done ? Date.now() : undefined };
  save(p);
}

export function setLessonBpm(id: string, bpm: number): void {
  const p = getProgress();
  const prev = p.lessons[id] as LessonState | undefined;
  p.lessons[id] = { done: prev?.done ?? false, at: prev?.at, bpm };
  save(p);
}

export function setVideoWatched(id: string, watched: boolean): void {
  const p = getProgress();
  if (watched) p.videos[id] = true;
  else delete p.videos[id];
  save(p);
}

export function resetProgress(): void {
  memory = null;
  try {
    localStorage.removeItem(KEY);
  } catch {
    // nothing to clear
  }
  window.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
}
