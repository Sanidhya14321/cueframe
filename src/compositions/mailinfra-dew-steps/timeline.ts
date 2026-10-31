import { Easing } from 'remotion';
import type { MailinfraDewStepsProps } from '@/schemas';
import { smooth, tween } from '../promo/timing';

export const FRAME_WIDTH = 1920;
export const FRAME_HEIGHT = 1080;
const CENTER_X = FRAME_WIDTH / 2;
const CENTER_Y = FRAME_HEIGHT / 2;
const END_HOLD = 56;
const MIN_STOP = 24;
const MIN_WHIP = 8;

const whipEase = Easing.bezier(0.6, 0, 0.14, 1);

export type DewStop = {
  index: number;
  leave: number;
  arrive: number;
  nextLeave: number;
  dropX: number;
  screenX: number;
  cameraX: number;
  side: 'left' | 'right';
  direction: number;
};

export type DewPlan = {
  stops: DewStop[];
  pullStart: number;
  pullEnd: number;
  lockStart: number;
  wide: { x: number; y: number; zoom: number };
  dropTop: number;
  dropBottom: number;
  worldEnd: number;
  endFrame: number;
};

export type Camera = { x: number; y: number; zoom: number };

export const planOf = (props: MailinfraDewStepsProps, sceneDuration: number): DewPlan => {
  const { timing, layout, drop, silk, steps } = props;
  const count = steps.length;
  const whip = timing.whipFrames;
  const room = (sceneDuration - END_HOLD - timing.introFrames - timing.pullBackFrames) / count;
  const stop = Math.max(MIN_STOP, Math.min(timing.stopFrames, room - whip));
  const firstScreenX =
    steps[0]?.textSide === 'left' ? FRAME_WIDTH - layout.dropInset : layout.dropInset;
  const firstDrop = layout.whipDistance + firstScreenX;
  const placed = steps.map((step, index) => {
    const screenX = step.textSide === 'left' ? FRAME_WIDTH - layout.dropInset : layout.dropInset;
    const dropX = firstDrop + index * layout.whipDistance;
    return { step, index, screenX, dropX, cameraX: dropX + CENTER_X - screenX };
  });
  const distances = placed.map((item, index) =>
    Math.abs(item.cameraX - (placed[index - 1]?.cameraX ?? CENTER_X)),
  );
  const meanDistance = distances.reduce((sum, value) => sum + value, 0) / Math.max(1, count) || 1;
  let clock = timing.introFrames;
  const stops = placed.map((item, index) => {
    const leave = clock;
    const length = Math.max(MIN_WHIP, (whip * (distances[index] ?? meanDistance)) / meanDistance);
    const arrive = leave + length;
    clock = arrive + stop;
    const previous = placed[index - 1]?.cameraX ?? CENTER_X;
    return {
      index,
      leave,
      arrive,
      nextLeave: clock,
      dropX: item.dropX,
      screenX: item.screenX,
      cameraX: item.cameraX,
      side: item.step.textSide,
      direction: Math.sign(item.cameraX - previous) || 1,
    };
  });
  const pullStart = clock;
  const pullEnd = pullStart + timing.pullBackFrames;
  const lastDrop = firstDrop + (count - 1) * layout.whipDistance;
  const span = lastDrop - firstDrop + drop.size * 2 + 260;
  const zoom = Math.max(0.2, Math.min(1, (FRAME_WIDTH * 0.84) / span));
  const dropTop = silk.height - silk.sag;
  const dropBottom = silk.height + silk.sag + drop.neck + drop.size * 2.1;
  const middle = (dropTop + dropBottom) / 2;
  return {
    stops,
    pullStart,
    pullEnd,
    lockStart: pullStart + timing.pullBackFrames * 0.45,
    wide: { x: (firstDrop + lastDrop) / 2, y: middle + (CENTER_Y - 300) / zoom, zoom },
    dropTop,
    dropBottom,
    worldEnd: lastDrop + 3600,
    endFrame: sceneDuration,
  };
};

const baseCamera = (frame: number, plan: DewPlan): Camera => {
  const first = plan.stops[0];
  if (first === undefined || frame <= first.leave) {
    return { x: CENTER_X, y: CENTER_Y, zoom: 1 };
  }
  for (let index = 0; index < plan.stops.length; index++) {
    const stop = plan.stops[index];
    const next = plan.stops[index + 1];
    if (stop === undefined) {
      continue;
    }
    const from = plan.stops[index - 1]?.cameraX ?? CENTER_X;
    if (frame < stop.arrive) {
      const progress = tween(frame, [stop.leave, stop.arrive], [0, 1], whipEase);
      const arc = Math.sin(Math.PI * tween(frame, [stop.leave, stop.arrive], [0, 1], smooth));
      return {
        x: from + (stop.cameraX - from) * progress,
        y: CENTER_Y - 26 * arc,
        zoom: 1 - 0.07 * arc,
      };
    }
    if (next === undefined || frame < next.leave) {
      if (frame < plan.pullStart || next !== undefined) {
        return { x: stop.cameraX, y: CENTER_Y, zoom: 1 };
      }
      const progress = tween(frame, [plan.pullStart, plan.pullEnd], [0, 1], smooth);
      const zoom = Math.exp(Math.log(plan.wide.zoom) * progress);
      const blend = (1 - zoom) / (1 - plan.wide.zoom || 1);
      return {
        x: stop.cameraX + (plan.wide.x - stop.cameraX) * blend,
        y: CENTER_Y + (plan.wide.y - CENTER_Y) * blend,
        zoom,
      };
    }
  }
  return { x: CENTER_X, y: CENTER_Y, zoom: 1 };
};

export const cameraAt = (frame: number, plan: DewPlan, drift: number): Camera => {
  const camera = baseCamera(frame, plan);
  const settleOut = 1 - 0.05 * tween(frame, [plan.pullStart, plan.endFrame], [0, 1], (t) => t);
  return {
    x: camera.x + (Math.sin(frame / 70) * 40 * drift) / camera.zoom,
    y: camera.y + (Math.cos(frame / 90) * 20 * drift) / camera.zoom,
    zoom: camera.zoom * settleOut * (1 + Math.sin(frame / 160) * 0.006 * drift),
  };
};

export const screenSpeed = (frame: number, plan: DewPlan, drift: number): number => {
  const before = cameraAt(frame - 0.5, plan, drift);
  const after = cameraAt(frame + 0.5, plan, drift);
  return (after.x - before.x) * after.zoom;
};

export const swingAt = (frame: number, stop: DewStop, amount: number, phase = 0): number => {
  const time = frame - (stop.arrive - 20) - phase;
  if (time <= 0) {
    return 0;
  }
  return amount * stop.direction * Math.exp(-time / 24) * Math.sin((time * Math.PI * 2) / 40);
};

const bobAt = (frame: number, stop: DewStop): number => {
  const time = frame - stop.arrive + 4;
  if (time <= 0) {
    return 0;
  }
  return Math.exp(-time / 18) * Math.sin((time * Math.PI * 2) / 30);
};

export const glintAt = (frame: number, at: number, length = 16): number => {
  const progress = (frame - at) / length;
  if (progress <= 0 || progress >= 1) {
    return 0;
  }
  return Math.sin(Math.PI * progress) ** 2;
};

export const strandY = (x: number, frame: number, props: MailinfraDewStepsProps, plan: DewPlan) => {
  const width = props.drop.size * 1.7;
  let y = props.silk.height + Math.sin(x / 900) * 10 + Math.sin(frame / 50 + x / 700) * 2.5;
  for (const stop of plan.stops) {
    const distance = (x - stop.dropX) / width;
    if (Math.abs(distance) < 4) {
      y += props.silk.sag * (1 + 0.14 * bobAt(frame, stop)) * Math.exp(-distance * distance);
    }
  }
  return y;
};
