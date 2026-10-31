import { Easing } from 'remotion';
import type { ScrollerWallProps } from '@/schemas';
import { tween } from '../promo/timing';

export type SquareTarget = { x: number; top: number };

export type SquarePose = {
  x: number;
  y: number;
  angle: number;
};

type Square = ScrollerWallProps['square'];

const roll = Easing.inOut(Easing.sin);
const fall = Easing.bezier(0.4, 0, 0.4, 1);
const drop = Easing.bezier(0.45, 0, 0.3, 1);
const swing = Easing.inOut(Easing.sin);

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export const landingFrames = (square: Square, letters: number): number[] =>
  Array.from({ length: letters }, (_, index) =>
    Math.round(square.landAt + index * (square.rollGap + square.rollFrames)),
  );

export const impact = (frame: number, landing: number): number => {
  const since = frame - landing;
  if (since <= -1 || since >= 3) {
    return 0;
  }
  return since < 0 ? 1 + since : (1 - since / 3) ** 2;
};

const pivotLift = (size: number, turn: number): number =>
  (size / 2) * Math.SQRT2 * Math.sin(Math.PI / 4 + (turn * Math.PI) / 2);

export const squarePose = (frame: number, square: Square, targets: SquareTarget[]): SquarePose => {
  const half = square.size / 2;
  const restOf = (target: SquareTarget): number => target.top - half;
  const lands = landingFrames(square, targets.length);
  const first = targets[0];
  const firstLand = lands[0];
  if (first === undefined || firstLand === undefined) {
    return { x: 0, y: -square.size * 2, angle: 0 };
  }
  if (frame < firstLand) {
    return {
      x: first.x,
      y: tween(frame, [0, firstLand - 1], [-square.size, restOf(first)], fall),
      angle: 0,
    };
  }
  for (let index = 0; index < targets.length - 1; index++) {
    const from = targets[index];
    const to = targets[index + 1];
    const land = lands[index];
    const next = lands[index + 1];
    if (from === undefined || to === undefined || land === undefined || next === undefined) {
      continue;
    }
    const end = next - 0.5;
    const start = end - square.rollFrames;
    if (frame < start) {
      return { x: from.x, y: restOf(from) + impact(frame, land) * square.dip, angle: index * 90 };
    }
    if (frame < next) {
      const turn = roll(clamp01((frame - start) / square.rollFrames));
      const lift = pivotLift(square.size, turn) - half + square.hop * Math.sin(Math.PI * turn);
      const rest = restOf(from) + (restOf(to) - restOf(from)) * turn;
      return {
        x: from.x + (to.x - from.x) * turn,
        y: rest - lift + impact(frame, next) * square.dip,
        angle: (index + turn) * 90,
      };
    }
  }
  const last = targets.at(-1) ?? first;
  const lastLand = lands.at(-1) ?? firstLand;
  const turns = (targets.length - 1) * 90;
  const exitStart = lastLand + square.rollGap - 0.5;
  const rest = restOf(last);
  if (frame < exitStart) {
    return { x: last.x, y: rest + impact(frame, lastLand) * square.dip, angle: turns };
  }
  const peakAt = exitStart + square.exitFrames * 0.3;
  const sideAt = exitStart + square.exitFrames * 0.43;
  const end = exitStart + square.exitFrames;
  const up = rest - square.exitLift;
  return {
    x: tween(frame, [exitStart, sideAt], [last.x, square.exitX], swing),
    y:
      frame < peakAt
        ? tween(frame, [exitStart, peakAt], [rest, up], Easing.out(Easing.quad))
        : tween(frame, [peakAt, end], [up, square.floorY], drop),
    angle: turns + tween(frame, [exitStart, sideAt], [0, 90], swing),
  };
};
