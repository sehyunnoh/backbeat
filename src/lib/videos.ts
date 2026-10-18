import data from '../data/videos.json';
import type { Video } from './types';

const all = (data as { videos: Video[] }).videos;

export const allVideos: Video[] = all;

/** Videos for one lesson, in the recommended watch order. */
export const videosForLesson = (lessonId: string): Video[] => all.filter((v) => v.lessons.includes(lessonId));
