import { Easing } from 'remotion';
import type { BlobShape, CirclePopProps } from '@/schemas';
import { pixelTween, tween } from '../promo/timing';

const PEAK_SHARE = 0.55;
const BLOB_POINTS = 720;
const PEAK_SPEED = 1.5;
const TILT_LANDING_SPEED = 0.15;
const swell = Easing.bezier(0.35, 0, 0.15, 1);
const FADE_LAUNCH = 1.5;
const READING_HOLD = 8;

const EDGE_WAVES: Record<BlobShape, (angle: number) => number> = {
  wobble: Math.sin,
  starburst: (angle) => 1 - 2 * Math.abs(Math.sin(angle / 2)),
};

const hermite = (t: number, startSlope: number, endSlope: number): number => {
  const t2 = t * t;
  const t3 = t2 * t;
  return (t3 - 2 * t2 + t) * startSlope + (3 * t2 - 2 * t3) + (t3 - t2) * endSlope;
};

const slopeFor = (speed: number, frames: number, distance: number): number =>
  distance > 0 ? Math.min(3, (speed * frames) / distance) : 0;

export const circlePopTimeline = (
  { pop, wobble, flood, tilt, subline }: CirclePopProps,
  speed = 1,
) => {
  const popStart = pop.delay;
  const popPeak =
    popStart + Math.min(pop.frames - 1, Math.max(1, Math.round(pop.frames * PEAK_SHARE)));
  const popEnd = popStart + pop.frames;
  const fadeEnd = popStart + Math.min(pop.fadeFrames, pop.frames);
  const floodStart = popEnd + wobble.buildFrames;
  const floodEnd = floodStart + flood.frames;
  const growStart = floodStart + flood.wordDelay;
  const growEnd = growStart + flood.wordFrames;
  const tiltStart = floodStart + tilt.delay;
  const tiltEnd = tiltStart + tilt.frames;
  const sublineStart = floodStart + subline.delay;
  const sublineEnd = sublineStart + subline.frames;
  return {
    popStart: popStart / speed,
    popPeak: popPeak / speed,
    popEnd: popEnd / speed,
    fadeEnd: fadeEnd / speed,
    floodStart: floodStart / speed,
    floodEnd: floodEnd / speed,
    growStart: growStart / speed,
    growEnd: growEnd / speed,
    tiltStart: tiltStart / speed,
    tiltEnd: tiltEnd / speed,
    sublineStart: sublineStart / speed,
    sublineEnd: sublineEnd / speed,
  };
};

type Timeline = ReturnType<typeof circlePopTimeline>;

const lastLanding = (timeline: Timeline, props: CirclePopProps): number =>
  Math.max(
    timeline.floodEnd,
    timeline.growEnd,
    timeline.tiltEnd,
    props.subline.text === '' ? 0 : timeline.sublineEnd,
  );

export const playbackSpeed = (props: CirclePopProps, durationInFrames: number): number => {
  const room = Math.max(1, durationInFrames - props.motion.exitFrames - READING_HOLD);
  return Math.max(props.motion.speed, lastLanding(circlePopTimeline(props), props) / room);
};

const popEasings = (timeline: Timeline, restSize: number, overshoot: number) => {
  const peakSize = restSize * (1 + overshoot);
  const riseFrames = timeline.popPeak - timeline.popStart;
  const returnFrames = timeline.popEnd - timeline.popPeak;
  const riseEnd = Math.min(1, slopeFor(PEAK_SPEED, riseFrames, peakSize));
  const returnStart = slopeFor(PEAK_SPEED, returnFrames, peakSize - restSize);
  return {
    peakSize,
    rise: (t: number) => hermite(t, Math.min(2.2, 3 - 2 * riseEnd), riseEnd),
    fall: (t: number) => hermite(t, returnStart, 0),
  };
};

export const fadeIn = (frame: number, timeline: Timeline): number =>
  tween(frame, [timeline.popStart, timeline.fadeEnd], [0, 1], (t) => hermite(t, FADE_LAUNCH, 0));

export const popRadius = (
  frame: number,
  timeline: Timeline,
  restRadius: number,
  overshoot: number,
): number => {
  const { peakSize, rise, fall } = popEasings(timeline, restRadius, overshoot);
  return frame <= timeline.popPeak
    ? tween(frame, [timeline.popStart, timeline.popPeak], [0, peakSize], rise)
    : tween(frame, [timeline.popPeak, timeline.popEnd], [peakSize, restRadius], fall);
};

export const wordSizeAt = (
  frame: number,
  timeline: Timeline,
  startSize: number,
  endSize: number,
  overshoot: number,
): number => {
  const { peakSize, rise, fall } = popEasings(timeline, startSize, overshoot);
  if (frame <= timeline.popPeak) {
    return pixelTween(frame, [timeline.popStart, timeline.popPeak], [0, peakSize], rise);
  }
  if (frame <= timeline.growStart) {
    return pixelTween(frame, [timeline.popPeak, timeline.popEnd], [peakSize, startSize], fall);
  }
  return pixelTween(frame, [timeline.growStart, timeline.growEnd], [startSize, endSize], swell);
};

export const tiltAt = (frame: number, timeline: Timeline, from: number, to: number): number => {
  const frames = timeline.tiltEnd - timeline.tiltStart;
  const landing = Math.min(1, slopeFor(TILT_LANDING_SPEED, frames, Math.abs(to - from)));
  return tween(frame, [timeline.tiltStart, timeline.tiltEnd], [from, to], (t) =>
    hermite(t, 0, landing),
  );
};

export const cornerReach = (width: number, height: number, centerX: number, centerY: number) =>
  Math.max(
    Math.hypot(centerX, centerY),
    Math.hypot(width - centerX, centerY),
    Math.hypot(centerX, height - centerY),
    Math.hypot(width - centerX, height - centerY),
  );

export const blobPath = (
  centerX: number,
  centerY: number,
  radius: number,
  amplitude: number,
  lobes: number,
  phase: number,
  shape: BlobShape,
): string => {
  const points: string[] = [];
  for (let index = 0; index < BLOB_POINTS; index++) {
    const theta = (index / BLOB_POINTS) * Math.PI * 2;
    const distance = radius * (1 + amplitude * EDGE_WAVES[shape](lobes * theta + phase));
    const x = centerX + distance * Math.cos(theta);
    const y = centerY + distance * Math.sin(theta);
    points.push(`${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return `${points.join(' ')} Z`;
};

const channels = (hex: string): number[] => [
  Number.parseInt(hex.slice(1, 3), 16),
  Number.parseInt(hex.slice(3, 5), 16),
  Number.parseInt(hex.slice(5, 7), 16),
  hex.length > 7 ? Number.parseInt(hex.slice(7, 9), 16) : 255,
];

export const mixHex = (from: string, to: string, amount: number): string => {
  const start = channels(from);
  const end = channels(to);
  const [red, green, blue, alpha] = start.map(
    (value, index) => value + ((end[index] ?? value) - value) * amount,
  );
  return `rgba(${Math.round(red ?? 0)}, ${Math.round(green ?? 0)}, ${Math.round(blue ?? 0)}, ${((alpha ?? 255) / 255).toFixed(3)})`;
};

export const invertHex = (hex: string): string =>
  `#${[1, 3, 5]
    .map((start) =>
      (255 - Number.parseInt(hex.slice(start, start + 2), 16)).toString(16).padStart(2, '0'),
    )
    .join('')}${hex.slice(7)}`;
