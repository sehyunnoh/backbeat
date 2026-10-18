import { getCollection, type CollectionEntry } from 'astro:content';
import { url } from './url';

export type Lesson = CollectionEntry<'lessons'>;

export async function getLessons(): Promise<Lesson[]> {
  const all = await getCollection('lessons');
  return all.sort((a, b) => a.data.level - b.data.level || a.data.order - b.data.order);
}

export const lessonHref = (l: Lesson) => url(`lessons/${l.id}/`);

/** Numbering like "1.3" is derived from level + position, so reordering never leaves stale numbers. */
export function lessonNumber(l: Lesson, all: Lesson[]): string {
  const idx = all.filter((x) => x.data.level === l.data.level).findIndex((x) => x.id === l.id);
  return `${l.data.level}.${idx + 1}`;
}
