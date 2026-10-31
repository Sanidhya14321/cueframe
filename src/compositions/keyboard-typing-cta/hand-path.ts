import type { KeyboardTypingCtaProps } from '@/schemas';
import type { Finger, HandPose } from '../promo/desk/hand-rig';
import { FINGERS, mixPose } from '../promo/desk/hand-rig';
import { accelerate, settle, smooth, tween } from '../promo/timing';
import { type HandSetup, type HandSide, sideReach } from './hand-assign';
import { PANEL } from './layout';
import { clampedSlopes, hermite, type Point } from './spline';
import type { TypingPlan } from './typing-plan';

type Props = KeyboardTypingCtaProps;

export type { Point };

const pose = (
  curl: [number, number, number, number],
  spread: number,
  thumbCurl: number,
  thumbReach: number,
  wristBend = 0,
): HandPose => ({
  curl: { index: curl[0], middle: curl[1], ring: curl[2], pinky: curl[3] },
  spread,
  thumbCurl,
  thumbReach,
  wristBend,
  wristTwist: 0,
});

export const NEUTRAL_POSE = pose([0, 0, 0, 0], 0, 0, 0);

const RELAXED = pose([0.6, 0.75, 0.85, 0.95], 0.4, 0.4, 0.2, 0.1);

const HOVER = pose([0.3, 0.32, 0.36, 0.42], 1.6, 0.35, 0.2, 0.06);

const FINGER_REACH: Record<Finger, Point> = {
  index: [-140, 47],
  middle: [0, 0],
  ring: [149, 64],
  pinky: [232, 171],
};

export const panelToScreen = (point: Point, keyboard: Props['keyboard']): Point => [
  PANEL.left + keyboard.x + PANEL.width / 2 + (point[0] - PANEL.width / 2) * keyboard.scale,
  keyboard.y + point[1] * keyboard.scale,
];

const ENTRY: Record<HandSide, Point> = { right: [1120, 2150], left: [-40, 2150] };

const EXIT: Record<HandSide, Point> = { right: [1260, 2260], left: [-180, 2260] };

const reachOf = (finger: Finger, size: number, side: HandSide): Point => {
  const scale = size / 1.3;
  return sideReach([FINGER_REACH[finger][0] * scale, FINGER_REACH[finger][1] * scale], side);
};

export const handSetup = (props: Props): HandSetup => {
  const scale = props.hand.size / 1.3 / props.keyboard.scale;
  return {
    reach: Object.fromEntries(
      FINGERS.map((finger) => [
        finger,
        [FINGER_REACH[finger][0] * scale, FINGER_REACH[finger][1] * scale],
      ]),
    ),
    split: props.hand.twoHands ? PANEL.width / 2 : undefined,
  };
};

export interface Waypoint {
  frame: number;
  point: Point;
  slope: Point;
  finger: Finger;
  press: boolean;
}

export const handWaypoints = (props: Props, plan: TypingPlan, side: HandSide): Waypoint[] => {
  const { timing, keyboard } = props;
  const presses = plan.steps
    .filter((step) => step.hand === side)
    .map((step) => ({
      frame: step.frame,
      point: panelToScreen(step.anchor, keyboard),
      finger: step.finger,
      press: true,
    }));
  const first = presses[0];
  const last = presses.at(-1);
  if (first === undefined || last === undefined) {
    return [];
  }
  const rest = Math.max(last.frame + 8, timing.handExit);
  const drift: Point = [REST_DRIFT[0] * (side === 'left' ? -1 : 1), REST_DRIFT[1]];
  const settled: Point = [last.point[0] + drift[0], last.point[1] + drift[1]];
  const knots = [...presses, { ...last, frame: rest, point: settled, press: false }];
  const frames = knots.map((knot) => knot.frame);
  const xs = clampedSlopes(
    frames,
    knots.map((knot) => knot.point[0]),
  );
  const ys = clampedSlopes(
    frames,
    knots.map((knot) => knot.point[1]),
  );
  const still: Point = [0, 0];
  return [
    {
      frame: Math.min(timing.handIn, first.frame - 12),
      point: ENTRY[side],
      slope: still,
      finger: first.finger,
      press: false,
    },
    ...knots.map((knot, index) => ({ ...knot, slope: [xs[index] ?? 0, ys[index] ?? 0] as Point })),
    { frame: rest + 34, point: EXIT[side], slope: still, finger: last.finger, press: false },
  ];
};

const segmentAt = (points: Waypoint[], frame: number): number => {
  for (let index = 0; index < points.length - 1; index++) {
    if (frame < (points[index + 1]?.frame ?? Number.POSITIVE_INFINITY)) {
      return index;
    }
  }
  return points.length - 2;
};

const REST_DRIFT: Point = [36, 60];

const HOP_BASE = 4;

const BANK = 0.0012;

const LOOP_SHARE = 0.35;

const LOOP_MAX = 18;

const HOP_FRAMES = 8;

const HOP_MAX = 22;

const HOP_SHARE = 0.1;

const lerp = (from: Point, to: Point, t: number): Point => [
  from[0] + (to[0] - from[0]) * t,
  from[1] + (to[1] - from[1]) * t,
];

const progressAt = (points: Waypoint[], frame: number) => {
  const index = segmentAt(points, frame);
  const from = points[index];
  const to = points[index + 1];
  const span = Math.max(1, (to?.frame ?? 0) - (from?.frame ?? 0));
  const t = Math.min(1, Math.max(0, (frame - (from?.frame ?? 0)) / span));
  return { index, from, to, span, t };
};

const anchorAt = (points: Waypoint[], frame: number): Point => {
  const { index, from, to, span, t } = progressAt(points, frame);
  if (from === undefined || to === undefined) {
    return ENTRY.right;
  }
  if (index === 0) {
    return lerp(from.point, to.point, settle(t));
  }
  if (index === points.length - 2) {
    return lerp(from.point, to.point, accelerate(t));
  }
  const glide = hermite(from.point, to.point, [from.slope, to.slope], span, t);
  const brief = Math.min(1, span / HOP_FRAMES);
  const hop =
    brief *
    (HOP_BASE +
      Math.min(
        HOP_MAX,
        HOP_SHARE * Math.hypot(to.point[0] - from.point[0], to.point[1] - from.point[1]),
      ));
  return [
    glide[0] + Math.min(LOOP_MAX, LOOP_SHARE * span) * Math.sin(2 * Math.PI * t),
    glide[1] - hop * Math.sin(Math.PI * t),
  ];
};

const fingerWeights = (points: Waypoint[], frame: number): Record<Finger, number> => {
  const { from, to, t } = progressAt(points, frame);
  const weights: Record<Finger, number> = { index: 0, middle: 0, ring: 0, pinky: 0 };
  const blend = smooth(t);
  weights[from?.finger ?? 'middle'] += 1 - blend;
  weights[to?.finger ?? 'middle'] += blend;
  return weights;
};

export const fingertipAt = (
  points: Waypoint[],
  frame: number,
  size: number,
  side: HandSide,
): Point => {
  const anchor = anchorAt(points, frame);
  const weights = fingerWeights(points, frame);
  return FINGERS.reduce<Point>((tip, finger) => {
    const reach = reachOf(finger, size, side);
    return [tip[0] + reach[0] * weights[finger], tip[1] + reach[1] * weights[finger]];
  }, anchor);
};

const DIP_FRAMES = 4;

const smoothstep = (t: number) => t * t * (3 - 2 * t);

const pressCurve = (since: number): number => {
  if (Math.abs(since) >= DIP_FRAMES) {
    return 0;
  }
  return since <= 0
    ? smoothstep((since + DIP_FRAMES) / DIP_FRAMES)
    : 1 - smoothstep(since / DIP_FRAMES);
};

export interface HandCue {
  tip: Point;
  weights: Record<Finger, number>;
  depth: number;
  pose: HandPose;
  lean: number;
}

export const handCue = (
  props: Props,
  points: Waypoint[],
  side: HandSide,
  frame: number,
): HandCue => {
  const { hand, timing } = props;
  const anchor = anchorAt(points, frame);
  const ready = tween(frame, [timing.handIn, timing.typeStart - 16], [0, 1], smooth);
  const done = tween(frame, [timing.handExit + 6, timing.handExit + 30], [0, 1], smooth);
  const shaped = mixPose(mixPose(RELAXED, HOVER, ready), RELAXED, done);
  const curl = { ...shaped.curl };
  let dip = 0;
  for (const point of points) {
    const amount = point.press ? pressCurve(frame - point.frame) : 0;
    if (amount > 0) {
      curl[point.finger] += amount * hand.tap * 0.35;
      dip = Math.max(dip, amount);
    }
  }
  const across = side === 'left' ? 1080 - anchor[0] : anchor[0];
  const drift = anchorAt(points, frame + 0.5)[0] - anchorAt(points, frame - 0.5)[0];
  const sway = side === 'left' ? -drift : drift;
  const phase = side === 'left' ? 2.1 : 0;
  return {
    tip: fingertipAt(points, frame, hand.size, side),
    weights: fingerWeights(points, frame),
    depth:
      hand.depth +
      (1 - ready + done) * hand.lift -
      dip * hand.press +
      Math.sin(frame / 11 + phase) * 0.03,
    pose: { ...shaped, curl },
    lean:
      hand.lean +
      (hand.follow * (640 - across)) / 1000 +
      BANK * sway +
      Math.sin(frame / 13 + phase) * 0.03,
  };
};
