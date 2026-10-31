import type { DominoWordsProps } from '@/schemas';
import { CAP_HEIGHT, textAdvance } from './glyphs';

export interface Domino {
  text: string;
  size: number;
  pivot: number;
  thickness: number;
  length: number;
  start: number;
  target: number;
  frames: number;
  launch: number;
  curve: number;
}

const HALF_TURN = Math.PI / 2;
const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const buildChain = ({ words, type, layout, orb, fall }: DominoWordsProps): Domino[] => {
  const dominoes: Domino[] = [];
  let edge = layout.startX;
  let carried = 0;
  words.forEach((word, index) => {
    const thickness = word.size * CAP_HEIGHT;
    const length = Math.max(1, textAdvance(word.text) * word.size * type.condense);
    const left = index === 0 ? edge : edge + word.gap;
    const pivot = left + thickness;
    const next = words[index + 1];
    const isLast = next === undefined;
    const target = isLast ? HALF_TURN : Math.asin(clamp((next?.gap ?? 0) / length, 0, 1));
    const frames = Math.max(1, isLast ? fall.lastFrames : fall.stepFrames);
    const floor = (fall.nudge * target) / frames;
    const ceiling = ((isLast ? fall.lastLaunch : 0.8) * target) / frames;
    const launch =
      index === 0 ? (fall.push * target) / frames : clamp(carried * fall.transfer, floor, ceiling);
    const curve = isLast ? fall.lastCurve : fall.curve;
    carried = launch + (curve * (target - launch * frames)) / frames;
    dominoes.push({
      text: word.text,
      size: word.size,
      pivot,
      thickness,
      length,
      start: orb.hitFrame + index * fall.stepFrames,
      target,
      frames,
      launch,
      curve,
    });
    edge = pivot;
  });
  return dominoes;
};

const freeFall = (domino: Domino, elapsed: number): number => {
  const progress = clamp(elapsed / domino.frames, 0, 1);
  const linear = domino.launch * Math.min(elapsed, domino.frames);
  return linear + (domino.target - domino.launch * domino.frames) * progress ** domino.curve;
};

const cornerLean = (pusher: Domino, next: Domino, angle: number): number => {
  const reach = (next.pivot - pusher.pivot) * Math.cos(angle) - next.thickness;
  return angle + Math.asin(clamp(reach / pusher.length, -1, 1));
};

const faceLean = (pusher: Domino, next: Domino, angle: number): number => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const x = next.pivot - pusher.pivot - next.thickness * cos;
  const y = next.thickness * sin;
  return Math.hypot(x, y) <= pusher.length ? Math.atan2(x, y) : HALF_TURN;
};

const restingLean = (pusher: Domino, next: Domino, angle: number): number =>
  clamp(Math.min(cornerLean(pusher, next, angle), faceLean(pusher, next, angle)), 0, HALF_TURN);

export const chainAngles = (chain: Domino[], frame: number): number[] => {
  const angles = chain.map(() => 0);
  for (let index = chain.length - 1; index >= 0; index -= 1) {
    const domino = chain[index];
    if (domino === undefined || frame <= domino.start) {
      continue;
    }
    const next = chain[index + 1];
    const nextAngle = angles[index + 1] ?? 0;
    angles[index] =
      next === undefined || frame <= next.start
        ? clamp(freeFall(domino, frame - domino.start), 0, HALF_TURN)
        : restingLean(domino, next, nextAngle);
  }
  return angles;
};

export const landFrame = (chain: Domino[]): number => {
  const last = chain.at(-1);
  return last === undefined ? 0 : last.start + last.frames;
};

export const chainBounds = (chain: Domino[], angles: number[]): { min: number; max: number } => {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  chain.forEach((domino, index) => {
    const angle = angles[index] ?? 0;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    for (const [dx, dy] of [
      [0, 0],
      [-domino.thickness, 0],
      [-domino.thickness, domino.length],
      [0, domino.length],
    ] as const) {
      const x = domino.pivot + dx * cos + dy * sin;
      min = Math.min(min, x);
      max = Math.max(max, x);
    }
  });
  return { min, max };
};
