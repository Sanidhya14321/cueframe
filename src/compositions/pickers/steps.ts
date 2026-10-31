import type { PickerSteps } from '@/schemas';
import { pixelTween, smooth, tween } from '../promo/timing';

export type StepState = {
  index: number;
  local: number;
  eased: number;
  progress: number;
};

export const stepState = (
  frame: number,
  timing: PickerSteps,
  easing: (t: number) => number = smooth,
): StepState => {
  const moveFrames = Math.min(timing.moveFrames, timing.interval);
  if (frame <= timing.delay) {
    return { index: timing.start, local: 0, eased: 0, progress: timing.start };
  }
  const elapsed = frame - timing.delay;
  const completed = Math.floor(elapsed / timing.interval);
  const local = elapsed - completed * timing.interval;
  const eased = tween(local, [0, moveFrames], [0, 1], easing);
  const index = timing.start + completed;
  return { index, local, eased, progress: index + eased };
};

export const pixelProgress = (
  state: StepState,
  timing: PickerSteps,
  pitch: number,
  easing: (t: number) => number = smooth,
): number => {
  const moveFrames = Math.min(timing.moveFrames, timing.interval);
  const step = Math.round(pitch);
  return state.index * step + pixelTween(state.local, [0, moveFrames], [0, step], easing);
};

export const wrapIndex = (slot: number, count: number): number =>
  ((Math.round(slot) % count) + count) % count;
