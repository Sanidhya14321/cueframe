import type { UnveilCamera, UnveilTiming } from '@/schemas';

export type Vec3 = [number, number, number];

export const BOARD = {
  width: 13,
  height: 17.33,
  centerY: 27,
  depth: 1.1,
} as const;

export const CLOTH = {
  width: BOARD.width + 2,
  height: BOARD.height + 0.6,
  columns: 44,
  rows: 60,
} as const;

export const RIG = {
  barDrop: 4,
  drop: 3.4,
  span: BOARD.width + 0.4,
} as const;

const SLING = 2.4;

export const ROTOR_HEIGHT = SLING + 2.2;

const boardTop = BOARD.centerY + BOARD.height / 2;

const HOVER: Vec3 = [0, boardTop + 0.3 + RIG.barDrop + RIG.drop, 1.6];

const smoothstep = (value: number): number => {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
};

const ramp = (frame: number, start: number, length: number): number =>
  smoothstep((frame - start) / Math.max(1, length));

const rampedDistance = (time: number, speed: number, rampFrames: number): number => {
  if (time <= 0) {
    return 0;
  }
  if (time <= rampFrames) {
    return (speed * time * time) / (2 * rampFrames);
  }
  return speed * (time - rampFrames / 2);
};

const TENSION_FRAMES = 30;

export const hookAt = (frame: number, timing: UnveilTiming): Vec3 => {
  const tension = ramp(frame, timing.liftStart - TENSION_FRAMES, TENSION_FRAMES + 24) * 0.7;
  const bob =
    Math.sin(frame / 23) *
    0.22 *
    (1 - ramp(frame, timing.liftStart - TENSION_FRAMES, TENSION_FRAMES));
  const sway = Math.sin(frame / 37 + 1.2) * 0.18;
  const time = frame - timing.liftStart;
  const climb = rampedDistance(time, 0.6 * (96 / timing.climb), timing.climb * 0.6);
  const drift = rampedDistance(time - 6, 0.62 * (96 / timing.climb), timing.climb * 0.8);
  return [HOVER[0] + sway + drift, HOVER[1] + tension + bob + climb, HOVER[2] - drift * 0.12];
};

const hookVelocity = (frame: number, timing: UnveilTiming): Vec3 => {
  const ahead = hookAt(frame + 0.5, timing);
  const behind = hookAt(frame - 0.5, timing);
  return [ahead[0] - behind[0], ahead[1] - behind[1], ahead[2] - behind[2]];
};

export interface HelicopterPose {
  position: Vec3;
  pitch: number;
  roll: number;
}

export const helicopterPose = (frame: number, timing: UnveilTiming): HelicopterPose => {
  const hook = hookAt(frame, timing);
  const velocity = hookVelocity(frame, timing);
  const accel = hookVelocity(frame + 4, timing)[0] - hookVelocity(frame - 4, timing)[0];
  return {
    position: [hook[0], hook[1] + SLING, hook[2]],
    pitch: -Math.min(0.32, velocity[0] * 0.38 + accel * 2.2) + Math.sin(frame / 29) * 0.02,
    roll: Math.sin(frame / 41) * 0.025,
  };
};

export interface CameraShot {
  position: Vec3;
  target: Vec3;
}

export const cameraShot = (frame: number, total: number, camera: UnveilCamera): CameraShot => {
  const push = 1 - camera.pushIn * smoothstep(frame / total);
  const driftX = Math.sin(frame / 90) * 1.1 * camera.drift;
  const driftY = Math.cos(frame / 120) * 0.5 * camera.drift;
  return {
    position: [10 + driftX, camera.height + driftY, camera.distance * push],
    target: [1.5 + driftX * 0.3, 29.5 + driftY * 0.3, 0],
  };
};
