// Wires every progress-aware element on the page to localStorage.
// Pages only render data-* attributes; this script fills in the live state.
import { PROGRESS_EVENT, getProgress, resetProgress, setLessonDone, setVideoWatched } from './progress';

const $$ = <T extends HTMLElement>(sel: string) => Array.from(document.querySelectorAll<T>(sel));

function render(): void {
  const p = getProgress();
  const isDone = (id: string) => p.lessons[id]?.done === true;

  // Per-lesson checkmarks (lists, headers)
  for (const el of $$('[data-lesson-check]')) {
    el.toggleAttribute('data-done', isDone(el.dataset.lessonCheck ?? ''));
  }

  // "Mark as done" buttons
  for (const btn of $$<HTMLButtonElement>('[data-complete-btn]')) {
    const done = isDone(btn.dataset.completeBtn ?? '');
    btn.setAttribute('aria-pressed', String(done));
    btn.classList.toggle('is-done', done);
    const label = btn.querySelector('[data-label]');
    if (label) label.textContent = done ? 'Done. Nice work!' : 'Mark lesson as done';
  }

  // Progress bars / counters: data-progress-ids="a,b,c"
  for (const el of $$('[data-progress-ids]')) {
    const ids = (el.dataset.progressIds ?? '').split(',').filter(Boolean);
    const done = ids.filter(isDone).length;
    const pct = ids.length ? Math.round((done / ids.length) * 100) : 0;
    el.style.setProperty('--pct', `${pct}%`);
    el.dataset.complete = String(ids.length > 0 && done === ids.length);
    el.dataset.empty = String(done === 0);
    for (const c of el.querySelectorAll<HTMLElement>('[data-progress-count]')) c.textContent = `${done} / ${ids.length}`;
    for (const c of el.querySelectorAll<HTMLElement>('[data-progress-pct]')) c.textContent = `${pct}%`;
  }

  // "Continue" link: first lesson (in order) that is not done yet
  for (const link of $$<HTMLAnchorElement>('[data-continue]')) {
    const lessons = JSON.parse(link.dataset.continue ?? '[]') as { id: string; href: string; title: string }[];
    const next = lessons.find((l) => !isDone(l.id));
    const started = lessons.some((l) => isDone(l.id));
    const label = link.querySelector('[data-continue-label]') ?? link;
    if (!next) {
      link.href = lessons[0]?.href ?? '#';
      label.textContent = 'All lessons done. Review from the start';
    } else {
      link.href = next.href;
      label.textContent = started ? `Continue: ${next.title}` : `Start: ${next.title}`;
    }
  }

  // Videos watched
  for (const btn of $$<HTMLButtonElement>('[data-watched-btn]')) {
    const watched = p.videos[btn.dataset.watchedBtn ?? ''] === true;
    btn.setAttribute('aria-pressed', String(watched));
    btn.classList.toggle('is-done', watched);
    const label = btn.querySelector('[data-label]');
    if (label) label.textContent = watched ? 'Watched' : 'Mark as watched';
  }
  for (const el of $$('[data-video-count]')) {
    const ids = (el.dataset.videoCount ?? '').split(',').filter(Boolean);
    el.textContent = `${ids.filter((id) => p.videos[id]).length} / ${ids.length}`;
  }
}

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const complete = target.closest<HTMLElement>('[data-complete-btn]');
  if (complete) {
    const id = complete.dataset.completeBtn ?? '';
    setLessonDone(id, !(getProgress().lessons[id]?.done === true));
    return;
  }
  const watched = target.closest<HTMLElement>('[data-watched-btn]');
  if (watched) {
    const id = watched.dataset.watchedBtn ?? '';
    setVideoWatched(id, !getProgress().videos[id]);
    return;
  }
  if (target.closest('[data-reset-progress]')) {
    if (window.confirm('Reset all lesson and video progress on this device? This cannot be undone.')) resetProgress();
  }
});

window.addEventListener(PROGRESS_EVENT, render);
window.addEventListener('storage', render);
render();
