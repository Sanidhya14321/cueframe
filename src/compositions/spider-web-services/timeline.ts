import { Easing } from 'remotion';
import type { SpiderWebServicesProps } from '@/schemas';
import { pixelTween } from '../promo/timing';

const whip = Easing.bezier(0.5, 0, 0.04, 1);

const CARD_WEB_Y = 8;

const CARD_PAN_EXTRA = 4;

type Pan = { start: number; distance: number; frames: number };

export type WebTimeline = {
  pans: Pan[];
  panFrames: number;
  distance: number;
  cardAnchor: number;
  webWorldY: number;
};

export const webTimeline = ({ services, timing }: SpiderWebServicesProps): WebTimeline => {
  const first = timing.threadStart + timing.threadFrames;
  const pans: Pan[] = [{ start: first, distance: timing.panDistance, frames: timing.panFrames }];
  for (const [index, service] of services.entries()) {
    const previous = pans.at(-1)?.start ?? first;
    const last = index === services.length - 1;
    pans.push({
      start: previous + service.holdFrames,
      distance: last ? timing.cardDistance : timing.panDistance,
      frames: last ? timing.panFrames + CARD_PAN_EXTRA : timing.panFrames,
    });
  }
  const cardAnchor = services.length * timing.panDistance + timing.cardDistance;
  return {
    pans,
    panFrames: timing.panFrames,
    distance: timing.panDistance,
    cardAnchor,
    webWorldY: cardAnchor + CARD_WEB_Y,
  };
};

export const panStart = (timeline: WebTimeline, index: number): number =>
  timeline.pans[index]?.start ?? Number.POSITIVE_INFINITY;

export const cameraY = (timeline: WebTimeline, frame: number): number =>
  timeline.pans.reduce(
    (total, pan) =>
      total + pixelTween(frame, [pan.start, pan.start + pan.frames], [0, pan.distance], whip),
    0,
  );

export const panFramesAt = (timeline: WebTimeline, index: number): number =>
  timeline.pans[index]?.frames ?? timeline.panFrames;

export const panProgress = (timeline: WebTimeline, frame: number, index: number): number =>
  whip(
    Math.min(1, Math.max(0, (frame - panStart(timeline, index)) / panFramesAt(timeline, index))),
  );

export const cameraBlur = (timeline: WebTimeline, frame: number, amount: number): number => {
  const speed = Math.abs(cameraY(timeline, frame) - cameraY(timeline, frame - 1));
  return Math.min(70, speed * amount);
};

export const serviceAnchor = (timeline: WebTimeline, index: number): number =>
  (index + 1) * timeline.distance;
