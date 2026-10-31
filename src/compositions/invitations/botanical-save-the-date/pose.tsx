import type { ReactNode } from 'react';
import { accelerate, settle, smooth, TAU, tween } from '../../promo/timing';
import { fixed, type Point } from './paint';

export interface Stay {
  start: number;
  end: number;
}

export interface Drift {
  enterFrames: number;
  exitFrames: number;
  slide: number;
  sway: number;
  swayPeriod: number;
}

export const stayOpen = (frame: number, stay: Stay, drift: Drift): number =>
  tween(frame, [stay.start, stay.start + drift.enterFrames], [0, 1], settle) *
  tween(frame, [stay.end, stay.end + drift.exitFrames], [1, 0], smooth);

export const swayAt = (frame: number, stay: Stay, drift: Drift, phase: number, amount = 1) =>
  drift.sway * amount * Math.sin(((frame - stay.start) / drift.swayPeriod) * TAU + phase);

const SHOW_SHARE = 0.4;

const shownAt = (frame: number, stay: Stay, drift: Drift): number =>
  tween(frame, [stay.start, stay.start + drift.enterFrames * SHOW_SHARE], [0, 1], smooth) *
  tween(
    frame,
    [stay.end + drift.exitFrames * (1 - SHOW_SHARE), stay.end + drift.exitFrames],
    [1, 0],
    smooth,
  );

export const isStaying = (frame: number, stay: Stay, drift: Drift): boolean =>
  frame >= stay.start - 1 && frame <= stay.end + drift.exitFrames + 1;

export const Placed = ({
  frame,
  stay,
  drift,
  at,
  from,
  rotation = 0,
  scale = 1,
  flip = false,
  phase = 0,
  children,
}: {
  frame: number;
  stay: Stay;
  drift: Drift;
  at: Point;
  from: Point;
  rotation?: number;
  scale?: number;
  flip?: boolean;
  phase?: number;
  children: ReactNode;
}) => {
  if (!isStaying(frame, stay, drift)) {
    return null;
  }
  const arrive = tween(frame, [stay.start, stay.start + drift.enterFrames], [0, 1], settle);
  const leave = tween(frame, [stay.end, stay.end + drift.exitFrames], [0, 1], accelerate);
  const away = 1 - arrive + leave;
  const length = Math.hypot(from[0], from[1]) || 1;
  const x = at[0] + (from[0] / length) * drift.slide * away;
  const y = at[1] + (from[1] / length) * drift.slide * away;
  const sway = swayAt(frame, stay, drift, phase);
  const turn = rotation + sway + away * 7 * Math.sign(from[0] || 1);
  const size = scale * (0.95 + 0.05 * (1 - away));
  return (
    <g
      transform={`translate(${fixed(x)} ${fixed(y)}) rotate(${fixed(turn)}) scale(${flip ? '-' : ''}${size.toFixed(4)} ${size.toFixed(4)})`}
      opacity={shownAt(frame, stay, drift)}
    >
      {children}
    </g>
  );
};
