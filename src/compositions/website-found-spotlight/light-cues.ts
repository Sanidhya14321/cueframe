import type { WebsiteFoundSpotlightProps } from '@/schemas';

type Timing = WebsiteFoundSpotlightProps['timing'];

interface Switch {
  at: number;
  on: boolean;
}

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const easeOut = (value: number): number => 1 - (1 - value) ** 2.4;

const switches = (timing: Timing): Switch[] =>
  [
    { at: timing.offStart1, on: false },
    { at: timing.onStart1, on: true },
    { at: timing.offStart2, on: false },
    { at: timing.onStart2, on: true },
    { at: timing.offStart3, on: false },
    { at: timing.onStart3, on: true },
  ].sort((first, second) => first.at - second.at);

const switchOn = (timing: Timing, from: number, elapsed: number): number => {
  const progress = clamp01((elapsed + 1) / timing.onFrames);
  const lit = timing.snap + (1 - timing.snap) * easeOut(progress);
  return from + (1 - from) * (elapsed < 0 ? 0 : lit);
};

const switchOff = (timing: Timing, from: number, elapsed: number): number =>
  from * (1 - clamp01((elapsed + 1) / timing.offFrames));

export interface LightCue {
  level: number;
  question: number;
}

export const lightCue = (timing: Timing, frame: number): LightCue => {
  let level = 1;
  let litAt = Number.NEGATIVE_INFINITY;
  for (const change of switches(timing)) {
    if (frame < change.at) {
      break;
    }
    const elapsed = frame - change.at;
    if (change.on) {
      level = switchOn(timing, level, elapsed);
      litAt = change.at;
    } else {
      level = switchOff(timing, level, elapsed);
    }
  }
  const grown = Number.isFinite(litAt) ? clamp01((frame - litAt + 1) / timing.questionFrames) : 1;
  return { level, question: easeOut(grown) };
};
