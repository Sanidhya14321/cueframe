import type { DominoWordsProps } from '@/schemas';

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const mix = (from: string, to: string, amount: number): string => {
  if (amount <= 0) {
    return from;
  }
  if (amount >= 1) {
    return to;
  }
  return `color-mix(in srgb, ${to} ${(amount * 100).toFixed(1)}%, ${from})`;
};

export interface FinaleState {
  landed: boolean;
  flashing: boolean;
  progress: number;
}

export const finaleState = (
  finale: DominoWordsProps['finale'],
  frame: number,
  landFrame: number,
): FinaleState => {
  const since = frame - landFrame;
  return {
    landed: since >= 0,
    flashing: since >= 0 && since < finale.flashFrames,
    progress: clamp01((since + 1) / Math.max(1, finale.flashFrames + 1)),
  };
};

export const wordInk = ({
  index,
  count,
  start,
  frame,
  type,
  finale,
  state,
}: {
  index: number;
  count: number;
  start: number;
  frame: number;
  type: DominoWordsProps['type'];
  finale: DominoWordsProps['finale'];
  state: FinaleState;
}): { color: string; fill: number; glow: number } => {
  if (index === count - 1 && state.landed) {
    return state.flashing
      ? { color: finale.flashColor, fill: 1, glow: finale.glow * 1.6 }
      : { color: finale.color, fill: 1, glow: finale.glow };
  }
  const activeAt = index === 0 && type.firstActive ? Number.NEGATIVE_INFINITY : start;
  const active = clamp01((frame - activeAt) / Math.max(1, type.colorFrames));
  const lit = mix(type.idleColor, type.activeColor, active);
  const spill = index === count - 2 && state.landed ? finale.spill * state.progress : 0;
  return {
    color: mix(lit, finale.color, spill),
    fill: type.outline > 0 ? active : 1,
    glow: 0,
  };
};
