// Turns a parsed pattern into drawing primitives for a small five-line drum staff.
// Deliberately limited: 4/4-style bars on a quarter / eighth / full-sixteenth grid,
// two voices (hands up, kick down). Anything else fails the build instead of drawing nonsense.

import type { Cell, LaneId, ParsedPattern } from './pattern';

/** Vertical position of each drum. Staff lines sit at y = 40, 50, 60, 70, 80 (top to bottom). */
export const NOTE_Y: Record<LaneId, number> = {
  crash: 30, // x on a ledger line above the staff
  hh: 35, // x in the space above the top line
  ride: 40, // x on the top line
  tom1: 45, // top space
  tom2: 50, // fourth line
  sn: 55, // third space
  tom3: 65, // second space (floor tom)
  bd: 75, // bottom space
};

export const STAFF_LINES = [40, 50, 60, 70, 80];
export const X0 = 70;
export const BEAT_W = 80;

export type Prim =
  | { k: 'head'; x: number; y: number; shape: 'oval' | 'x' }
  | { k: 'line'; x1: number; y1: number; x2: number; y2: number; w: number }
  | { k: 'beam'; x1: number; x2: number; y: number; down: boolean }
  | { k: 'flag'; x: number; y: number; down: boolean }
  | { k: 'rest'; kind: 'q' | 'e'; x: number; y: number }
  | { k: 'accent'; x: number; y: number }
  | { k: 'ghost'; x: number; y: number }
  | { k: 'open'; x: number; y: number }
  | { k: 'text'; x: number; y: number; t: string; cls: string };

interface Note {
  lane: LaneId;
  cell: Cell;
}

export interface BarLayout {
  prims: Prim[];
  width: number;
  endX: number;
}

export function layoutBar(p: ParsedPattern, bar: number, beats: number): BarLayout {
  const spb = p.stepsPerBeat;
  if (![1, 2, 4].includes(spb)) throw new Error(`Notation: ${spb} steps per beat is not supported (use 1, 2 or 4)`);

  const prims: Prim[] = [];
  const endX = X0 + beats * BEAT_W;
  const slotW = BEAT_W / spb;
  const slotX = (beat: number, k: number) => X0 + beat * BEAT_W + 14 + k * slotW;

  const upLanes = p.lanes.filter((l) => l.id !== 'bd');
  const kickLane = p.lanes.find((l) => l.id === 'bd');

  const upAt = (step: number): Note[] =>
    upLanes.flatMap((l) => {
      const cell = l.bars[bar][step];
      return cell.kind === 'rest' ? [] : [{ lane: l.id, cell }];
    });
  const kickAt = (step: number): Note[] => {
    const cell = kickLane?.bars[bar][step];
    return cell && cell.kind !== 'rest' ? [{ lane: 'bd' as LaneId, cell }] : [];
  };

  /** Heads, ledger lines and markings for one chord. Returns its vertical extent. */
  const heads = (chord: Note[], x: number): { minY: number; maxY: number } => {
    let minY = Infinity;
    let maxY = -Infinity;
    for (const n of chord) {
      const y = NOTE_Y[n.lane];
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      if (y < STAFF_LINES[0] - 4) {
        for (let ly = STAFF_LINES[0] - 10; ly >= y - 1; ly -= 10) prims.push({ k: 'line', x1: x - 10, y1: ly, x2: x + 10, y2: ly, w: 1.6 });
      }
      const isCymbal = n.lane === 'hh' || n.lane === 'ride' || n.lane === 'crash';
      prims.push({ k: 'head', x, y, shape: isCymbal ? 'x' : 'oval' });
      if (n.cell.kind === 'open') prims.push({ k: 'open', x, y: y - 12 });
      if (n.cell.ghost) prims.push({ k: 'ghost', x, y });
    }
    return { minY, maxY };
  };

  const stem = (x: number, fromY: number, toY: number) => prims.push({ k: 'line', x1: x, y1: fromY, x2: x, y2: toY, w: 1.8 });

  const accentOf = (chord: Note[]) => chord.some((n) => n.cell.accent);

  /** Draw one voice for one beat. */
  const voiceBeat = (beat: number, chordAt: (step: number) => Note[], down: boolean) => {
    const slots = Array.from({ length: spb }, (_, k) => chordAt(beat * spb + k));
    const present = slots.map((c) => c.length > 0);
    const restY = down ? 70 : 47;
    const restX = X0 + beat * BEAT_W + BEAT_W / 2 - 4;
    const sx = (x: number) => (down ? x - 5.5 : x + 5.5);

    /** Draws heads for a chord and returns its stem-side extreme (top for up voice, bottom for down voice). */
    const drawChord = (chord: Note[], x: number) => {
      const ext = heads(chord, x);
      return down ? ext.maxY : ext.minY;
    };
    const reach = (edge: number) => (down ? edge + 30 : edge - 30);
    const stemFrom = (chord: Note[]) => {
      const ys = chord.map((n) => NOTE_Y[n.lane]);
      return down ? Math.min(...ys) : Math.max(...ys);
    };
    const mark = (chord: Note[], x: number, tipY: number) => {
      if (accentOf(chord)) prims.push({ k: 'accent', x, y: down ? tipY + 10 : tipY - 8 });
    };

    if (!present.some(Boolean)) {
      prims.push({ k: 'rest', kind: 'q', x: restX, y: restY });
      return;
    }

    if (spb === 1 || (spb === 2 && present[0] && !present[1])) {
      // quarter note
      const x = slotX(beat, 0);
      const chord = slots[0];
      const edge = drawChord(chord, x);
      const tip = reach(edge);
      stem(sx(x), stemFrom(chord), tip);
      mark(chord, x, tip);
      return;
    }

    if (spb === 2 && !present[0] && present[1]) {
      // eighth rest, then a flagged eighth note
      prims.push({ k: 'rest', kind: 'e', x: slotX(beat, 0), y: restY });
      const x = slotX(beat, 1);
      const chord = slots[1];
      const edge = drawChord(chord, x);
      const tip = reach(edge);
      stem(sx(x), stemFrom(chord), tip);
      prims.push({ k: 'flag', x: sx(x), y: tip, down });
      mark(chord, x, tip);
      return;
    }

    if (spb === 2 && present[0] && present[1]) {
      const edges = slots.map((c, k) => drawChord(c, slotX(beat, k)));
      const beamY = down ? Math.max(...edges) + 30 : Math.min(...edges) - 30;
      slots.forEach((c, k) => {
        const x = slotX(beat, k);
        stem(sx(x), stemFrom(c), beamY);
        mark(c, x, beamY);
      });
      prims.push({ k: 'beam', x1: sx(slotX(beat, 0)) - 0.9, x2: sx(slotX(beat, 1)) + 0.9, y: beamY, down });
      return;
    }

    if (spb === 4 && present.every(Boolean)) {
      const edges = slots.map((c, k) => drawChord(c, slotX(beat, k)));
      const beamY = down ? Math.max(...edges) + 30 : Math.min(...edges) - 30;
      slots.forEach((c, k) => {
        const x = slotX(beat, k);
        stem(sx(x), stemFrom(c), beamY);
        mark(c, x, beamY);
      });
      const x1 = sx(slotX(beat, 0)) - 0.9;
      const x2 = sx(slotX(beat, 3)) + 0.9;
      prims.push({ k: 'beam', x1, x2, y: beamY, down });
      prims.push({ k: 'beam', x1, x2, y: down ? beamY - 7 : beamY + 7, down });
      return;
    }

    throw new Error(
      `Notation: beat ${beat + 1} of bar ${bar + 1} uses a rhythm the staff view does not draw (supported: quarter, eighth and four beamed sixteenths per beat)`,
    );
  };

  for (let beat = 0; beat < beats; beat++) {
    if (upLanes.length) voiceBeat(beat, upAt, false);
    if (kickLane) voiceBeat(beat, kickAt, true);
    for (let k = 0; k < spb; k++) {
      prims.push({ k: 'text', x: slotX(beat, k), y: 128, t: p.counts[beat * spb + k], cls: k === 0 ? 'count beat' : 'count' });
    }
  }

  return { prims, width: endX + 24, endX };
}
