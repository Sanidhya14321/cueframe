import { Easing, interpolate } from 'remotion';

export const ramp = (
  frame: number,
  from: number,
  to: number,
  easing: (t: number) => number = Easing.out(Easing.cubic),
) =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
