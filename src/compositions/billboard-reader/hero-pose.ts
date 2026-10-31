import * as THREE from 'three';
import type { ReaderTiming } from '@/schemas';
import { smooth, tween } from '../promo/timing';

export const PAGE = { width: 0.34, height: 0.48, vee: 0.22 } as const;

const UPPER_ARM = 0.29;
const FOREARM = 0.28;

export interface HeroPose {
  pelvis: THREE.Vector3;
  chest: THREE.Vector3;
  neck: THREE.Vector3;
  headPitch: number;
  headYaw: number;
  shoulders: [THREE.Vector3, THREE.Vector3];
  elbows: [THREE.Vector3, THREE.Vector3];
  hands: [THREE.Vector3, THREE.Vector3];
  hips: [THREE.Vector3, THREE.Vector3];
  knees: [THREE.Vector3, THREE.Vector3];
  ankles: [THREE.Vector3, THREE.Vector3];
  paperCenter: THREE.Vector3;
  paperRotation: THREE.Euler;
  flip: number;
  curl: number;
  vee: number;
}

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;

const solveElbow = (
  shoulder: THREE.Vector3,
  target: THREE.Vector3,
  pole: THREE.Vector3,
): THREE.Vector3 => {
  const offset = target.clone().sub(shoulder);
  const reach = Math.min(Math.max(offset.length(), 0.05), UPPER_ARM + FOREARM - 0.002);
  const direction = offset.normalize();
  const along = (UPPER_ARM * UPPER_ARM + reach * reach - FOREARM * FOREARM) / (2 * reach);
  const lift = Math.sqrt(Math.max(0, UPPER_ARM * UPPER_ARM - along * along));
  const bend = pole
    .clone()
    .sub(direction.clone().multiplyScalar(pole.dot(direction)))
    .normalize();
  return shoulder.clone().add(direction.multiplyScalar(along)).add(bend.multiplyScalar(lift));
};

export const heroPose = (frame: number, timing: ReaderTiming): HeroPose => {
  const lower = tween(
    frame,
    [timing.lowerStart, timing.lowerStart + timing.lowerFrames],
    [0, 1],
    smooth,
  );
  const turn = tween(
    frame,
    [timing.turnStart, timing.turnStart + timing.turnFrames],
    [0, 1],
    smooth,
  );
  const breath = Math.sin(frame / 19) * 0.006 * timing.breathe;
  const rustle = Math.sin(frame / 17) * 0.018 * timing.breathe;
  const dip = Math.sin(Math.PI * turn) * 0.035;
  const pelvis = v(0, 0.13, -0.04);
  const chest = v(0, 0.44 + breath, 0.01 + lower * 0.02);
  const neck = v(0, 0.63 + breath, 0.03 + lower * 0.035);
  const shoulders: [THREE.Vector3, THREE.Vector3] = [
    v(0.19, 0.56 + breath, 0.0 + lower * 0.02),
    v(-0.19, 0.56 + breath, 0.0 + lower * 0.02),
  ];
  const paperCenter = v(
    mix(0.0, -0.07, lower),
    mix(0.67, 0.47, lower) - dip,
    mix(0.36, 0.38, lower),
  );
  const paperRotation = new THREE.Euler(
    mix(0.06, 0.62, lower) + rustle * 0.5,
    mix(0, 0.28, lower) + rustle,
    mix(0, -0.06, lower),
    'YXZ',
  );
  const vee = PAGE.vee + Math.sin(Math.PI * turn) * 0.9;
  const edge = PAGE.width * Math.cos(vee);
  const sink = -PAGE.width * Math.sin(vee);
  const grip = (side: number) =>
    v(side * (edge - 0.02), -0.02, sink)
      .applyEuler(paperRotation)
      .add(paperCenter);
  const hands: [THREE.Vector3, THREE.Vector3] = [grip(1), grip(-1)];
  const elbows: [THREE.Vector3, THREE.Vector3] = [
    solveElbow(shoulders[0], hands[0], v(0.8, -1, -0.3)),
    solveElbow(shoulders[1], hands[1], v(-0.8, -1, -0.3)),
  ];
  const swing = Math.sin(frame / 26) * 0.035;
  const sway = Math.sin(frame / 33 + 1.4) * 0.02;
  return {
    pelvis,
    chest,
    neck,
    headPitch: mix(0.08, 0.5, lower) + Math.sin(frame / 41) * 0.025,
    headYaw: mix(0, 0.22, lower) + Math.sin(frame / 57) * 0.04,
    shoulders,
    elbows,
    hands,
    hips: [v(0.1, 0.11, 0), v(-0.1, 0.11, 0)],
    knees: [v(0.17, 0.13, 0.42), v(-0.14, 0.11, 0.43)],
    ankles: [v(0.19 + sway, -0.4, 0.34 + sway), v(-0.15, -0.41, 0.39 + swing)],
    paperCenter,
    paperRotation,
    flip: turn,
    curl: Math.sin(Math.PI * turn),
    vee,
  };
};
