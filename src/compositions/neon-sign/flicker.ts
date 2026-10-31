import type { NeonSignFlickerProps } from '@/schemas';

type Flicker = NeonSignFlickerProps['flicker'];

export interface FlickerLevels {
  letter: number;
  lamp: number;
}

const STEADY_GAPS = 3;

const burstLength = (flicker: Flicker, index: number): number =>
  index === 0
    ? flicker.firstBurst
    : Math.max(1, flicker.firstBurst + flicker.period / 2 - flicker.burstShrink * index);

const gapLength = (flicker: Flicker, index: number): number =>
  Math.max(1, flicker.gap - flicker.gapShrink * Math.max(0, index + 1 - STEADY_GAPS));

const wave = (offset: number, period: number, fromLit: boolean): number =>
  0.5 - 0.5 * Math.cos((2 * Math.PI * (offset + 1)) / period + (fromLit ? Math.PI : 0));

export const flickerLevels = (frame: number, flicker: Flicker, idle: number): FlickerLevels => {
  let start = flicker.holdFrames;
  if (frame < start) {
    return { letter: 1, lamp: 1 };
  }
  const bursts = Math.round(flicker.bursts);
  let cursor = start;
  for (let index = 0; index < bursts; index++) {
    cursor += burstLength(flicker, index);
    const end = Math.round(cursor);
    if (frame < end) {
      const letter = wave(frame - start, flicker.period, index === 0);
      return { letter, lamp: idle + (1 - idle) * letter };
    }
    if (index === bursts - 1) {
      break;
    }
    cursor += gapLength(flicker, index);
    start = Math.round(cursor);
    if (frame < start) {
      return { letter: 0, lamp: idle };
    }
  }
  return flicker.staysDead ? { letter: 0, lamp: 0 } : { letter: 1, lamp: 1 };
};
