import type { MailinfraThreadFeaturesProps } from '@/schemas';
import { pixelTween, smooth, tween } from '../promo/timing';

const whip = (t: number): number => 1 - (1 - t ** 2.4) ** 5;

export interface StopWindow {
  whipStart: number;
  arrive: number;
  end: number;
}

export interface ThreadSchedule {
  stops: StopWindow[];
  diveStart: number;
  land: number;
  spacing: number;
  endTop: number;
}

const MIN_HOLD = 8;

export const buildSchedule = (
  { opening, titles, camera, endCard }: MailinfraThreadFeaturesProps,
  duration: number,
): ThreadSchedule => {
  const travel = opening.hold + titles.length * camera.whipFrames + camera.diveFrames;
  const room = Math.max(0, duration - endCard.hold - travel);
  const wanted = titles.reduce((sum, item) => sum + item.hold, 0);
  const squeeze = wanted > room && wanted > 0 ? room / wanted : 1;
  let cursor = opening.hold;
  const stops = titles.map((item) => {
    const whipStart = cursor;
    const arrive = whipStart + camera.whipFrames;
    cursor = arrive + Math.max(MIN_HOLD, Math.floor(item.hold * squeeze));
    return { whipStart, arrive, end: cursor };
  });
  return {
    stops,
    diveStart: cursor,
    land: cursor + camera.diveFrames,
    spacing: camera.spacing,
    endTop: (titles.length + 1) * camera.spacing,
  };
};

export const stopTop = (schedule: ThreadSchedule, index: number): number =>
  (index + 1) * schedule.spacing;

export const cameraY = (frame: number, schedule: ThreadSchedule): number => {
  const moves = [
    ...schedule.stops.map((stop) => [stop.whipStart, stop.arrive] as [number, number]),
    [schedule.diveStart, schedule.land] as [number, number],
  ];
  let position = 0;
  for (const range of moves) {
    if (frame <= range[0]) {
      return position;
    }
    if (frame < range[1]) {
      return position + pixelTween(frame, range, [0, schedule.spacing], whip);
    }
    position += schedule.spacing;
  }
  return position;
};

export const swingAt = (frame: number, arrive: number, amplitude: number): number =>
  frame < arrive + 14
    ? amplitude * tween(frame, [arrive - 6, arrive + 14], [1, -0.4], smooth)
    : amplitude * tween(frame, [arrive + 14, arrive + 46], [-0.4, 0], smooth);

export const nearness = (camera: number, target: number, spacing: number): number =>
  tween(Math.abs(camera - target), [spacing * 0.25, spacing * 0.75], [1, 0]);
