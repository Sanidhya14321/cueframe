export const MIN_PX_PER_FRAME = 0.25;
export const MAX_PX_PER_FRAME = 24;
export const DEFAULT_PX_PER_FRAME = 6;
export const LABEL_WIDTH = 128;
export const ZOOM_STEP = 1.25;

const FIT_GUTTER = 48;

export interface Tick {
  frame: number;
  seconds: number;
}

export const frameToPx = (frame: number, pxPerFrame: number): number => frame * pxPerFrame;

export const pxToFrame = (px: number, pxPerFrame: number): number => Math.round(px / pxPerFrame);

export const clampPxPerFrame = (pxPerFrame: number): number =>
  Math.min(MAX_PX_PER_FRAME, Math.max(MIN_PX_PER_FRAME, pxPerFrame));

export const fitPxPerFrame = (durationInFrames: number, viewportWidth: number): number =>
  clampPxPerFrame((viewportWidth - LABEL_WIDTH - FIT_GUTTER) / Math.max(1, durationInFrames));

export const buildTicks = (durationInFrames: number, fps: number, pxPerFrame: number): Tick[] => {
  const pxPerSecond = Math.max(0.0001, pxPerFrame * fps);
  const secondsPerTick = Math.max(1, Math.ceil(90 / pxPerSecond));
  const framesPerTick = secondsPerTick * fps;
  const ticks: Tick[] = [];
  for (let frame = 0; frame <= durationInFrames; frame += framesPerTick) {
    ticks.push({ frame, seconds: frame / fps });
  }
  return ticks;
};

export const formatSeconds = (seconds: number): string => {
  const whole = Math.round(seconds * 10) / 10;
  return Number.isInteger(whole) ? `${whole}s` : `${whole.toFixed(1)}s`;
};
