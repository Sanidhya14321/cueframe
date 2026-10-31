import type { BatteryChargeSuccessProps } from '@/schemas';
import { ascending, type Key, monotone } from './curves';

export const CABLE_IDS = ['leftTop', 'leftBottom', 'bottom', 'rightBottom', 'rightTop'] as const;

export type CableId = (typeof CABLE_IDS)[number];

export type Pose = {
  x: number;
  y: number;
  angle: number;
  anchorX: number;
  anchorY: number;
  anchorAngle: number;
};

export const PLUG = { connector: 40, body: 73, neck: 14, width: 36 } as const;

const PLUG_DEPTH = PLUG.connector - 3;

export const TAIL = PLUG.connector + PLUG.body + PLUG.neck;

export type BatteryBox = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX: number;
  width: number;
  height: number;
};

export const batteryBox = (battery: BatteryChargeSuccessProps['battery'], width: number) => {
  const left = width / 2 - battery.width / 2;
  return {
    left,
    right: left + battery.width,
    top: battery.top,
    bottom: battery.top + battery.height,
    centerX: width / 2,
    width: battery.width,
    height: battery.height,
  } satisfies BatteryBox;
};

const pose = (
  x: number,
  y: number,
  angle: number,
  anchorX: number,
  anchorY: number,
  anchorAngle = -90,
): Pose => ({ x, y, angle, anchorX, anchorY, anchorAngle });

const DANGLE: Record<CableId, Pose> = {
  leftTop: pose(81, 1288, -75, -60, 2060),
  leftBottom: pose(316, 1523, -80, 240, 2060),
  bottom: pose(586, 1304, -95, 560, 2060),
  rightBottom: pose(732, 1552, -95, 780, 2060),
  rightTop: pose(1032, 1418, -92, 1010, 2060),
};

const RISE: Record<CableId, Pose> = {
  leftTop: pose(309, 1163, -35, -120, 1650, -20),
  leftBottom: pose(442, 1272, -60, 150, 2060),
  bottom: pose(580, 1199, -90, 620, 2060),
  rightBottom: pose(747, 1191, -105, 930, 2060),
  rightTop: pose(859, 1280, -130, 1200, 1750, -160),
};

const FALL: Record<CableId, Pose> = {
  leftTop: pose(230, 1002, -30, -100, 1500, -30),
  leftBottom: pose(325, 1164, -35, -100, 1760, -40),
  bottom: pose(559, 1210, -90, 560, 2060),
  rightBottom: pose(741, 1190, -128, 1180, 1760, -140),
  rightTop: pose(854, 1040, -150, 1180, 1500, -150),
};

const plugged = (id: CableId, box: BatteryBox, battery: BatteryChargeSuccessProps['battery']) => {
  const upper = box.top + box.height * battery.upperRow;
  const lower = box.top + box.height * battery.lowerRow;
  switch (id) {
    case 'leftTop':
      return pose(box.left + PLUG_DEPTH, upper, 0, -80, upper - 20, 0);
    case 'leftBottom':
      return pose(box.left + PLUG_DEPTH, lower, 0, -80, lower + 30, 0);
    case 'rightTop':
      return pose(box.right - PLUG_DEPTH, upper, -180, 1160, upper - 20, -180);
    case 'rightBottom':
      return pose(box.right - PLUG_DEPTH, lower, -180, 1160, lower - 40, -180);
    default:
      return pose(box.centerX, box.bottom - PLUG_DEPTH, -90, 500, 2060);
  }
};

const shift = (from: Pose, back: number, tilt: number, drop = 0): Pose => {
  const radians = (from.angle * Math.PI) / 180;
  return {
    ...from,
    x: from.x - Math.cos(radians) * back,
    y: from.y - Math.sin(radians) * back + drop,
    angle: from.angle + tilt,
  };
};

const lift = (from: Pose, amount: number): Pose => ({ ...from, y: from.y - amount });

const isLeft = (id: CableId) => id === 'leftTop' || id === 'leftBottom';

const isRight = (id: CableId) => id === 'rightTop' || id === 'rightBottom';

type Keyed = [number, Pose][];

const keyedPoses = (
  id: CableId,
  props: BatteryChargeSuccessProps,
  box: BatteryBox,
  duration: number,
): { body: Keyed; anchor: Keyed; plugAt: number; unplugAt: number } => {
  const { timing } = props;
  const rest = DANGLE[id];
  const rise = RISE[id];
  const fall = FALL[id];
  const socket = plugged(id, box, props.battery);
  const side = isLeft(id) ? -1 : isRight(id) ? 1 : 0;
  const approach = side === 0 ? shift(socket, 40, 0) : shift(socket, 70, side * 18);
  const near = side === 0 ? shift(socket, 28, 0) : shift(socket, 38, side * 5);
  const loose = side === 0 ? shift(socket, 16, 2, 4) : shift(socket, 22, side * -8, 8);
  const out = side === 0 ? shift(socket, 50, 4, 14) : shift(socket, 64, side * -18, 36);
  const plugAt = id === 'bottom' ? timing.bottomPlugFrame : timing.plugFrame;
  const unplugAt = timing.unplugFrame + (id === 'bottom' ? 3 : 0);
  const end = duration - 1;
  const bodyFrames = ascending([
    0,
    timing.riseStart,
    timing.plugFrame - 34,
    timing.plugFrame - 16,
    plugAt - 6,
    plugAt,
    unplugAt,
    unplugAt + 5,
    unplugAt + 10,
    unplugAt + 15,
    unplugAt + 22,
    end,
  ]);
  const bodyPoses = [
    rest,
    lift(rest, 34),
    rise,
    approach,
    near,
    socket,
    socket,
    loose,
    out,
    fall,
    lift(rest, 12),
    rest,
  ];
  const anchorFrames = ascending([
    0,
    timing.riseStart,
    timing.plugFrame - 34,
    timing.plugFrame - 6,
    unplugAt + 2,
    unplugAt + 16,
    unplugAt + 26,
    end,
  ]);
  const anchorPoses = [rest, rest, rise, socket, socket, fall, rest, rest];
  return {
    body: bodyPoses.map((value, index) => [bodyFrames[index] ?? end, value]),
    anchor: anchorPoses.map((value, index) => [anchorFrames[index] ?? end, value]),
    plugAt: bodyFrames[5] ?? 0,
    unplugAt: bodyFrames[6] ?? duration,
  };
};

const BODY_FIELDS = ['x', 'y', 'angle'] as const;

const ANCHOR_FIELDS = ['anchorX', 'anchorY', 'anchorAngle'] as const;

const sample = (frame: number, keys: Keyed, name: keyof Pose) =>
  monotone(
    frame,
    keys.map(([at, value]) => [at, value[name]] as Key),
  );

export const cablePose = (
  id: CableId,
  frame: number,
  props: BatteryChargeSuccessProps,
  box: BatteryBox,
  duration: number,
): Pose => {
  const { body, anchor, plugAt, unplugAt } = keyedPoses(id, props, box, duration);
  const result = Object.fromEntries([
    ...BODY_FIELDS.map((name) => [name, sample(frame, body, name)]),
    ...ANCHOR_FIELDS.map((name) => [name, sample(frame, anchor, name)]),
  ]) as Pose;
  const free = monotone(frame, [
    [0, 1],
    [body[1]?.[0] ?? 0, 1],
    [plugAt - 14, 0],
    [unplugAt + 6, 0],
    [unplugAt + 24, 1],
    [duration - 1, 1],
  ]);
  const seed = CABLE_IDS.indexOf(id) * 1.37;
  const cycle = (frame / duration) * Math.PI * 2;
  const amount = free * props.cableShape.sway;
  return {
    ...result,
    x: result.x + amount * 14 * Math.sin(cycle * 2 + seed),
    y: result.y + amount * 9 * Math.sin(cycle * 3 + seed * 0.6),
    angle: result.angle + amount * 5 * Math.sin(cycle * 3 + seed * 1.7),
  };
};

export const usesMirroredLabel = isLeft;

const CHARGE_CURVE: Key[] = [
  [0, 0],
  [0.033, 0.01],
  [0.179, 0.03],
  [0.39, 0.1],
  [0.585, 0.3],
  [0.65, 0.44],
  [0.715, 0.72],
  [0.78, 0.88],
  [0.846, 0.94],
  [0.878, 0.96],
  [1, 1],
];

const DRAIN_CURVE: Key[] = [
  [0, 1],
  [0.065, 0.98],
  [0.194, 0.91],
  [0.323, 0.74],
  [0.452, 0.58],
  [0.58, 0.42],
  [0.677, 0.26],
  [0.774, 0.17],
  [0.871, 0.06],
  [0.968, 0.02],
  [1, 0],
];

export const drainEnd = (timing: BatteryChargeSuccessProps['timing']) =>
  timing.unplugFrame + timing.drainFrames;

export const chargeLevel = (frame: number, timing: BatteryChargeSuccessProps['timing']) => {
  const chargeSpan = Math.max(2, timing.fullFrame - timing.chargeStart);
  const drainStart = Math.max(timing.unplugFrame + 1, timing.fullFrame + 1);
  const raw: Key[] = [
    [0, 0],
    ...CHARGE_CURVE.map(([t, value]) => [timing.chargeStart + t * chargeSpan, value] as Key),
    ...DRAIN_CURVE.map(([t, value]) => [drainStart + t * timing.drainFrames, value] as Key),
  ];
  const frames = ascending(
    raw.map(([at]) => at),
    0.5,
  );
  return monotone(
    frame,
    raw.map(([, value], index) => [frames[index] ?? 0, value] as Key),
  );
};

export const chargePhase = (frame: number, timing: BatteryChargeSuccessProps['timing']) => {
  const end = drainEnd(timing);
  const frames = ascending(
    [
      0,
      timing.colorShiftStart,
      timing.colorShiftStart + timing.colorShiftFrames,
      end - 13,
      end - 1,
    ],
    1,
  );
  return monotone(frame, [
    [frames[0] ?? 0, 0],
    [frames[1] ?? 0, 0],
    [frames[2] ?? 0, 1],
    [frames[3] ?? 0, 1],
    [frames[4] ?? 0, 0],
  ]);
};
