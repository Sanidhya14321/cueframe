import type { BadgeTiming } from '@/schemas';

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export const badgePhase = (frame: number, delay: number, timing: BadgeTiming) => ({
  draw: clamp01((frame - delay) / timing.drawFrames),
  erase: clamp01((frame - delay - timing.eraseAt) / timing.eraseFrames),
});
