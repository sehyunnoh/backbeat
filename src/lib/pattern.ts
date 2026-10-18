// Build-time parsing of the tiny pattern notation used in lesson files.
//
//   x o X O  = a hit (X / O = accent)      - or .  = rest
//   hi-hat lane: x = closed, o = open      bars are separated by a space
//   sticking: R L (hands), - = no stroke
//
// Every lane (and the sticking row) must have the same number of bars and steps,
// so a typo fails the build instead of silently shipping a misaligned chart.

import type { Voice } from '../scripts/audio';

export type LaneId = 'crash' | 'ride' | 'hh' | 'tom1' | 'tom2' | 'tom3' | 'sn' | 'bd';

export const LANE_ORDER: LaneId[] = ['crash', 'ride', 'hh', 'tom1', 'tom2', 'tom3', 'sn', 'bd'];

export const LANE_META: Record<LaneId, { label: string; voice: Voice; cymbal: boolean }> = {
  crash: { label: 'Crash', voice: 'crash', cymbal: true },
  ride: { label: 'Ride', voice: 'ride', cymbal: true },
  hh: { label: 'Hi-hat', voice: 'hihat', cymbal: true },
  tom1: { label: 'Tom 1', voice: 'tom1', cymbal: false },
  tom2: { label: 'Tom 2', voice: 'tom2', cymbal: false },
  tom3: { label: 'Tom 3', voice: 'tom3', cymbal: false },
  sn: { label: 'Snare', voice: 'snare', cymbal: false },
  bd: { label: 'Kick', voice: 'kick', cymbal: false },
};

export interface HitEvent {
  lane: LaneId;
  voice: Voice;
  accent: boolean;
}

export interface Cell {
  kind: 'hit' | 'open' | 'rest';
  accent: boolean;
}

export interface ParsedPattern {
  bars: number;
  stepsPerBar: number;
  stepsPerBeat: number;
  lanes: { id: LaneId; label: string; cymbal: boolean; bars: Cell[][] }[];
  sticking: string[][] | null;
  counts: string[];
  events: HitEvent[][];
}

const COUNT_LABELS: Record<number, string[]> = {
  1: ['{n}'],
  2: ['{n}', '&'],
  3: ['{n}', 'tr', 'lt'],
  4: ['{n}', 'e', '&', 'a'],
};

function splitBars(s: string): string[] {
  return s.trim().split(/[\s|]+/).filter(Boolean);
}

export function parsePattern(
  laneStrings: Partial<Record<LaneId, string>>,
  sticking: string | undefined,
  beats: number,
): ParsedPattern {
  const present = LANE_ORDER.filter((id) => laneStrings[id] !== undefined);
  if (present.length === 0) throw new Error('Pattern needs at least one lane');

  const parsed = present.map((id) => ({ id, bars: splitBars(laneStrings[id]!) }));
  const bars = parsed[0].bars.length;
  const stepsPerBar = parsed[0].bars[0].length;

  for (const lane of parsed) {
    if (lane.bars.length !== bars) throw new Error(`Pattern lane "${lane.id}" has ${lane.bars.length} bars, expected ${bars}`);
    for (const b of lane.bars) {
      if (b.length !== stepsPerBar) throw new Error(`Pattern lane "${lane.id}": bar "${b}" has ${b.length} steps, expected ${stepsPerBar}`);
    }
  }
  if (stepsPerBar % beats !== 0) throw new Error(`Pattern: ${stepsPerBar} steps do not divide into ${beats} beats`);
  const stepsPerBeat = stepsPerBar / beats;
  const labels = COUNT_LABELS[stepsPerBeat];
  if (!labels) throw new Error(`Pattern: ${stepsPerBeat} steps per beat is not supported (use 1, 2, 3 or 4)`);

  let stickingBars: string[][] | null = null;
  if (sticking !== undefined) {
    const sb = splitBars(sticking);
    if (sb.length !== bars || sb.some((b) => b.length !== stepsPerBar)) throw new Error('Pattern: sticking does not match the lanes');
    stickingBars = sb.map((b) => b.split(''));
  }

  const lanes = parsed.map(({ id, bars: b }) => ({
    id,
    label: LANE_META[id].label,
    cymbal: LANE_META[id].cymbal,
    bars: b.map((bar) =>
      bar.split('').map<Cell>((ch) => {
        if (ch === '-' || ch === '.') return { kind: 'rest', accent: false };
        if (!'xoXO'.includes(ch)) throw new Error(`Pattern lane "${id}": unknown symbol "${ch}"`);
        return { kind: id === 'hh' && ch.toLowerCase() === 'o' ? 'open' : 'hit', accent: ch === 'X' || ch === 'O' };
      }),
    ),
  }));

  const counts: string[] = [];
  for (let i = 0; i < stepsPerBar; i++) {
    counts.push(labels[i % stepsPerBeat].replace('{n}', String(Math.floor(i / stepsPerBeat) + 1)));
  }

  const events: HitEvent[][] = [];
  for (let bar = 0; bar < bars; bar++) {
    for (let step = 0; step < stepsPerBar; step++) {
      const hits: HitEvent[] = [];
      for (const lane of lanes) {
        const cell = lane.bars[bar][step];
        if (cell.kind === 'rest') continue;
        hits.push({
          lane: lane.id,
          voice: cell.kind === 'open' ? 'hihatOpen' : LANE_META[lane.id].voice,
          accent: cell.accent,
        });
      }
      events.push(hits);
    }
  }

  return { bars, stepsPerBar, stepsPerBeat, lanes, sticking: stickingBars, counts, events };
}
