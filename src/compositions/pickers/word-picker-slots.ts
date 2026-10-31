import { Easing } from 'remotion';
import type { PickerSteps } from '@/schemas';
import { pixelTween, settle, tween } from '../promo/timing';
import { pixelProgress, type StepState, stepState } from './steps';

export const pick = Easing.bezier(0.4, 0.15, 0.6, 1);

export const listState = (
  frame: number,
  timing: PickerSteps,
  count: number,
  loop: boolean,
  stops: number,
): StepState => {
  const state = stepState(frame, timing, pick);
  const last = Math.min(count - 1, timing.start + stops);
  if (loop || state.progress <= last) {
    return state;
  }
  return { index: last, local: 0, eased: 0, progress: last };
};

export const visibleSlots = (
  progress: number,
  reach: number,
  count: number,
  loop: boolean,
): number[] => {
  const slots: number[] = [];
  for (let slot = Math.floor(progress - reach); slot <= Math.ceil(progress + reach); slot++) {
    if (loop || (slot >= 0 && slot < count)) {
      slots.push(slot);
    }
  }
  return slots;
};

export const mixColor = (from: string, to: string, amount: number): string =>
  `color-mix(in oklab, ${to} ${(Math.min(1, Math.max(0, amount)) * 100).toFixed(2)}%, ${from})`;

export type ListEntrance = {
  delay: number;
  stagger: number;
  frames: number;
  rise: number;
};

export const entranceOf = (
  frame: number,
  entrance: ListEntrance,
  order: number,
): { opacity: number; rise: number } => {
  const start = entrance.delay + Math.max(0, order) * entrance.stagger;
  const range: [number, number] = [start, start + entrance.frames];
  return {
    opacity: tween(frame, range, [0, 1], settle),
    rise: pixelTween(frame, range, [entrance.rise, 0], settle),
  };
};

export const listOffset = (state: StepState, timing: PickerSteps, pitch: number): number =>
  pixelProgress(state, timing, pitch, pick);
