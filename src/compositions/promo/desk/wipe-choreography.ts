import { Easing } from 'remotion';
import * as THREE from 'three';
import { glide, smooth, tween } from '../timing';
import { LAPTOP, SCREEN_FACE } from './laptop-geometry';
import { WIPE_POINTS } from './wipe-material';

export interface WipeTiming {
  enterFrames: number;
  wipeStart: number;
  wipeFrames: number;
  turnStart: number;
  turnFrames: number;
  revealFrames: number;
}

export interface WipePath {
  startX: number;
  endX: number;
  centerY: number;
  amplitude: number;
  passes: number;
  yaw: number;
  yawSwing: number;
}

interface HoldPlacement {
  x: number;
  y: number;
  z: number;
  roll: number;
  lean: number;
  sway: number;
  lift: number;
}

const ARRIVE = Easing.bezier(0.33, 0, 0.25, 1);

const HINGE_Z = -LAPTOP.depth / 2 + 0.04;

const lidMatrix = (lidAngle: number): THREE.Matrix4 =>
  new THREE.Matrix4()
    .makeTranslation(0, LAPTOP.baseThickness + 0.01, HINGE_Z)
    .multiply(new THREE.Matrix4().makeRotationX(-lidAngle));

const wipePoint = (path: WipePath, progress: number): THREE.Vector2 =>
  new THREE.Vector2(
    path.startX + (path.endX - path.startX) * progress,
    path.centerY + Math.sin(progress * path.passes * Math.PI * 2) * path.amplitude,
  );

const wipeProgress = (frame: number, timing: WipeTiming): number =>
  tween(frame, [timing.wipeStart, timing.wipeStart + timing.wipeFrames], [0, 1], glide);

export const shaderPoints = (
  path: WipePath,
  aspect: number,
  offset: THREE.Vector2,
): THREE.Vector2[] =>
  Array.from({ length: WIPE_POINTS }, (_unused, index) => {
    const point = wipePoint(path, index / (WIPE_POINTS - 1));
    return new THREE.Vector2(point.x * aspect + offset.x, point.y + offset.y);
  });

const screenToWorld = (lid: THREE.Matrix4, point: THREE.Vector2, lift: number) =>
  new THREE.Vector3(
    (point.x - 0.5) * LAPTOP.screenWidth,
    LAPTOP.screenBottom + point.y * LAPTOP.screenHeight,
    SCREEN_FACE + lift,
  ).applyMatrix4(lid);

export interface PalmFrame {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
}

export const palmBasis = (normal: THREE.Vector3, fingers: THREE.Vector3): THREE.Quaternion => {
  const n = normal.clone().normalize();
  const f = fingers
    .clone()
    .sub(n.clone().multiplyScalar(fingers.dot(n)))
    .normalize();
  const thumb = new THREE.Vector3().crossVectors(f, n);
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(thumb, f, n));
};

export interface Choreography {
  palm: PalmFrame;
  wipe: number;
  reveal: number;
  turn: number;
  press: number;
}

export interface ChoreographyInput {
  frame: number;
  timing: WipeTiming;
  path: WipePath;
  hold: HoldPlacement;
  lidAngle: number;
  camera: THREE.Vector3;
  contactGap: number;
  enterFrom: THREE.Vector3;
}

const cubic = (
  a: THREE.Vector3,
  b: THREE.Vector3,
  c: THREE.Vector3,
  d: THREE.Vector3,
  t: number,
) => {
  const u = 1 - t;
  return a
    .clone()
    .multiplyScalar(u * u * u)
    .add(b.clone().multiplyScalar(3 * u * u * t))
    .add(c.clone().multiplyScalar(3 * u * t * t))
    .add(d.clone().multiplyScalar(t * t * t));
};

const wipeFrame = (input: ChoreographyInput, wipe: number): PalmFrame => {
  const lid = lidMatrix(input.lidAngle);
  const rotation = new THREE.Matrix3().setFromMatrix4(lid);
  const lidNormal = new THREE.Vector3(0, 0, 1).applyMatrix3(rotation).normalize();
  const lidUp = new THREE.Vector3(0, 1, 0).applyMatrix3(rotation).normalize();
  const point = wipePoint(input.path, wipe);
  const ahead = wipePoint(input.path, Math.min(1, wipe + 0.01));
  const behind = wipePoint(input.path, Math.max(0, wipe - 0.01));
  const slope = (ahead.y - behind.y) / Math.max(1e-4, Math.abs(ahead.x - behind.x) * 8);
  const yaw = input.path.yaw - Math.atan(slope) * input.path.yawSwing;
  const fingers = lidUp.clone().applyAxisAngle(lidNormal, yaw);
  return {
    position: screenToWorld(lid, point, input.contactGap),
    quaternion: palmBasis(lidNormal.clone().negate(), fingers),
  };
};

const holdFrame = (input: ChoreographyInput): PalmFrame => {
  const position = new THREE.Vector3(input.hold.x, input.hold.y, input.hold.z);
  const toCamera = input.camera.clone().sub(position).normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const normal = toCamera.lerp(up.clone().multiplyScalar(-1), -input.hold.lean).normalize();
  const fingers = up.applyAxisAngle(normal, input.hold.roll);
  return { position, quaternion: palmBasis(normal, fingers) };
};

const ROLL_AXIS = new THREE.Vector3(0, 1, 0);

export const choreograph = (input: ChoreographyInput): Choreography => {
  const { frame, timing } = input;
  const wipe = wipeProgress(frame, timing);
  const wiping = wipeFrame(input, wipe);
  const enter = tween(frame, [0, timing.enterFrames], [0, 1], ARRIVE);
  const turn = tween(
    frame,
    [timing.turnStart, timing.turnStart + timing.turnFrames],
    [0, 1],
    smooth,
  );
  const reveal = tween(
    frame,
    [timing.turnStart, timing.turnStart + timing.revealFrames],
    [0, 1],
    smooth,
  );
  const press = Math.min(enter, 1 - turn);
  const approach = wiping.position.clone().add(input.enterFrom.clone().multiplyScalar(1 - enter));
  if (turn <= 0) {
    return {
      palm: { position: approach, quaternion: wiping.quaternion },
      wipe,
      reveal,
      turn,
      press,
    };
  }
  const hold = holdFrame(input);
  const lid = lidMatrix(input.lidAngle);
  const lidNormal = new THREE.Vector3(0, 0, 1)
    .applyMatrix3(new THREE.Matrix3().setFromMatrix4(lid))
    .normalize();
  const swayFrame = frame - timing.turnStart - timing.turnFrames;
  const sway = new THREE.Vector3(
    Math.sin(swayFrame / 26) * 0.03,
    Math.sin(swayFrame / 33 + 1.2) * 0.025,
    0,
  ).multiplyScalar(input.hold.sway * turn);
  const position = cubic(
    wiping.position,
    wiping.position.clone().add(lidNormal.clone().multiplyScalar(input.hold.lift)),
    hold.position.clone().add(new THREE.Vector3(0, input.hold.lift * 0.6, 0)),
    hold.position,
    turn,
  ).add(sway);
  const fingers = ROLL_AXIS.clone().applyQuaternion(wiping.quaternion);
  const spin = new THREE.Quaternion().setFromAxisAngle(fingers, Math.PI * turn);
  const spun = spin.multiply(wiping.quaternion);
  const swayTurn = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 0, 1),
    Math.sin(swayFrame / 40) * 0.03 * input.hold.sway * turn,
  );
  const quaternion = spun.slerp(hold.quaternion, turn).premultiply(swayTurn);
  return { palm: { position, quaternion }, wipe, reveal, turn, press };
};
