import { Easing } from 'remotion';
import type { MailinfraInboxWebProps } from '@/schemas';
import { smooth, tween } from '../promo/timing';
import type { Point, WebGeometry } from './geometry';

export type Phases = {
  drop: number;
  settle: number;
  runOut: [number, number];
  frame: [number, number];
  back: [number, number];
  radials: [number, number];
  spiral: [number, number];
  turn: [number, number];
  recenter: [number, number];
  envelopesAt: number;
  flight: number;
  stagger: number;
  countRange: [number, number];
  zoom: [number, number];
};

const DOWN = Math.PI / 2;
const BOUNCE = 9;
const CHECK_DONE = 18;
const MIN_END_CARD = 105;

const scalePhases = (phases: Phases, factor: number): Phases => {
  const pair = ([from, to]: [number, number]): [number, number] => [from * factor, to * factor];
  return {
    drop: phases.drop * factor,
    settle: phases.settle * factor,
    runOut: pair(phases.runOut),
    frame: pair(phases.frame),
    back: pair(phases.back),
    radials: pair(phases.radials),
    spiral: pair(phases.spiral),
    turn: pair(phases.turn),
    recenter: pair(phases.recenter),
    envelopesAt: phases.envelopesAt * factor,
    flight: phases.flight * factor,
    stagger: phases.stagger * factor,
    countRange: pair(phases.countRange),
    zoom: pair(phases.zoom),
  };
};

export const phasesFor = (props: MailinfraInboxWebProps, lastFrame: number): Phases => {
  const { timing, envelopes } = props;
  const drop = timing.dropFrames;
  const settle = drop + BOUNCE;
  const weave = timing.weaveFrames;
  const at = (share: number) => settle + weave * share;
  const envelopesAt = settle + weave - 14;
  const flight = envelopes.flightFrames;
  const stagger = envelopes.stagger;
  const count = Math.max(0, Math.round(envelopes.count));
  const firstLand = envelopesAt + flight;
  const lastLand = firstLand + Math.max(0, count - 1) * stagger;
  const countRange: [number, number] = [firstLand, Math.max(lastLand + CHECK_DONE, firstLand + 30)];
  const zoomStart = countRange[1] + timing.holdFrames;
  const phases: Phases = {
    drop,
    settle,
    runOut: [settle - 1, at(0.14)],
    frame: [at(0.09), at(0.4)],
    back: [at(0.38), at(0.56)],
    radials: [at(0.48), at(0.66)],
    spiral: [at(0.66), at(1)],
    turn: [at(0.26), at(0.37)],
    recenter: [at(0.22), at(0.36)],
    envelopesAt,
    flight,
    stagger,
    countRange,
    zoom: [zoomStart, zoomStart + timing.zoomFrames],
  };
  const limit = lastFrame - MIN_END_CARD * props.motion.speed;
  return phases.zoom[1] > limit && limit > 0 ? scalePhases(phases, limit / phases.zoom[1]) : phases;
};

export const frameProgress = (frame: number, phases: Phases): number =>
  tween(frame, phases.frame, [0, 1], smooth);

export const framePassFrame = (fraction: number, phases: Phases): number => {
  let low = phases.frame[0];
  let high = phases.frame[1];
  for (let step = 0; step < 24; step++) {
    const middle = (low + high) / 2;
    if (frameProgress(middle, phases) < fraction) {
      low = middle;
    } else {
      high = middle;
    }
  }
  return (low + high) / 2;
};

export const spiralProgress = (frame: number, phases: Phases): number =>
  tween(frame, phases.spiral, [0, 1], smooth);

const dropStart = (props: MailinfraInboxWebProps): number =>
  -props.web.size * 0.55 - 540 / props.camera.startZoom + props.spider.size * 0.15;

const lerpPoint = (a: Point, b: Point, t: number): Point => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

const HUB: Point = { x: 0, y: 0 };

const dropEase = Easing.bezier(0.45, 0.1, 0.6, 1);

export const spiderAt = (
  frame: number,
  web: WebGeometry,
  phases: Phases,
  props: MailinfraInboxWebProps,
): Point => {
  const bottom = web.frameStart;
  const overshoot = props.spider.size * 0.45;
  if (frame <= phases.drop) {
    return { x: 0, y: tween(frame, [0, phases.drop], [dropStart(props), overshoot], dropEase) };
  }
  if (frame <= phases.runOut[0]) {
    return { x: 0, y: tween(frame, [phases.drop, phases.settle], [overshoot, 0], smooth) };
  }
  if (frame <= phases.runOut[1]) {
    return lerpPoint(HUB, bottom, tween(frame, phases.runOut, [0, 1], smooth));
  }
  return lerpPoint(bottom, HUB, tween(frame, phases.back, [0, 1], smooth));
};

export const spiderHeading = (frame: number, phases: Phases): number =>
  DOWN + tween(frame, phases.turn, [0, Math.PI], smooth);

const IDLE_STEP = 0.16;

export const gaitPhase = (
  frame: number,
  web: WebGeometry,
  phases: Phases,
  props: MailinfraInboxWebProps,
): number => {
  let phase = 0;
  let previous = spiderAt(phases.drop, web, phases, props);
  for (let step = Math.floor(phases.drop) + 1; step <= frame; step++) {
    const point = spiderAt(step, web, phases, props);
    const travel =
      Math.hypot(point.x - previous.x, point.y - previous.y) / (props.spider.size * 0.12);
    const turning = Math.abs(spiderHeading(step, phases) - spiderHeading(step - 1, phases)) * 2.5;
    const weaving = step >= phases.frame[0] && step <= phases.spiral[1] ? IDLE_STEP : 0;
    phase += Math.min(1.1, travel + turning + weaving);
    previous = point;
  }
  return phase;
};

export type Camera = { x: number; y: number; scale: number; blurY: number; blur: number };

const whip = Easing.bezier(0.6, 0, 0.25, 1);

const cameraBase = (
  frame: number,
  web: WebGeometry,
  phases: Phases,
  props: MailinfraInboxWebProps,
): Omit<Camera, 'blurY' | 'blur'> => {
  const { camera, wordmark } = props;
  const dropY = tween(frame, [0, phases.settle], [-props.web.size * 0.55, 0], whip);
  const followIn = tween(frame, [phases.drop, phases.runOut[1]], [0, 1], smooth);
  const followOut = tween(frame, phases.recenter, [0, 1], smooth);
  const weight = camera.follow * Math.max(0, followIn - followOut);
  let followX = 0;
  let followY = 0;
  if (weight > 0) {
    for (let offset = -10; offset <= 10; offset += 2) {
      const point = spiderAt(frame + offset, web, phases, props);
      followX += point.x / 11;
      followY += point.y / 11;
    }
  }
  const pull = tween(
    frame,
    [phases.drop, phases.spiral[1] + 10],
    [Math.log(camera.startZoom), Math.log(camera.webZoom)],
    smooth,
  );
  const zoomT = tween(frame, phases.zoom, [0, 1], whip);
  const endY = (540 - wordmark.hubY) / camera.endZoom;
  const drift = camera.drift * (1 - zoomT) * tween(frame, [0, phases.runOut[1]], [0, 1], smooth);
  return {
    x: followX * weight + Math.sin(frame / 90) * 10 * drift,
    y: dropY + followY * weight + endY * zoomT + Math.cos(frame / 120) * 7 * drift,
    scale: Math.exp(pull + (Math.log(camera.endZoom) - Math.log(camera.webZoom)) * zoomT),
  };
};

export const cameraAt = (
  frame: number,
  web: WebGeometry,
  phases: Phases,
  props: MailinfraInboxWebProps,
): Camera => {
  const now = cameraBase(frame, web, phases, props);
  const before = cameraBase(frame - 1, web, phases, props);
  const strength = props.camera.motionBlur;
  const vertical = Math.abs(now.y - before.y) * now.scale;
  const zoom = Math.abs(Math.log(now.scale) - Math.log(before.scale)) * 540;
  const dropping = frame <= phases.settle + 2 ? 1 : 0;
  return {
    ...now,
    blurY: Math.min(18, vertical * 0.22 * strength * dropping),
    blur: Math.min(14, zoom * 0.08 * strength),
  };
};
