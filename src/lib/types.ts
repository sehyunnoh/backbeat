export interface Video {
  id: string;
  lessons: string[];
  title: string;
  channel: string;
  durationMin: number | null;
  summary: string;
  level: number;
  start: number | null;
  koSubs?: boolean;
}
