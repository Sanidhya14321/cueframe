import { Easing } from 'remotion';
import * as THREE from 'three';
import type { SpillRevealProps } from '@/schemas';
import type { DeskCamera } from '../promo/desk/desk-stage';
import type { HandPose } from '../promo/desk/hand-rig';
import type { PalmFrame } from '../promo/desk/wipe-choreography';
import { settle, smooth, tween } from '../promo/timing';
import { CUP, CUP_SIDE_ANGLE, cupRadiusAt } from './cup';
import type { PuddleShape } from './field';

const ARRIVE = Easing.bezier(0.33, 0, 0.25, 1);
const FALLEN = Math.PI / 2 - CUP_SIDE_ANGLE;
const RELEASE = 0.42;
const TIP_POWER = 2.4;
const BOUNCE_FRAMES = 12;
const CONTACT_GAP = 0.07;

export interface SpillMotion {
  cup: THREE.Matrix4;
  tilt: number;
  fill: number;
  palm: PalmFrame | null;
  pose: HandPose;
  elbow: THREE.Vector3;
  puddle: PuddleShape;
  reach: number;
  drop: number;
  soak: number;
  camera: DeskCamera;
  focus: [number, number, number];
}

const palmBasis = (normal: THREE.Vector3, fingers: THREE.Vector3): THREE.Quaternion => {
  const n = normal.clone().normalize();
  const f = fingers
    .clone()
    .sub(n.clone().multiplyScalar(fingers.dot(n)))
    .normalize();
  const thumb = new THREE.Vector3().crossVectors(f, n);
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(thumb, f, n));
};

const tipMatrix = (cup: SpillRevealProps['cup'], tilt: number, slide: number): THREE.Matrix4 => {
  const { x, z } = cup;
  const pivot = new THREE.Vector3(x - CUP.bottomRadius, 0, z);
  return new THREE.Matrix4()
    .makeTranslation(pivot.x - slide, 0, pivot.z)
    .multiply(new THREE.Matrix4().makeRotationZ(tilt))
    .multiply(new THREE.Matrix4().makeTranslation(CUP.bottomRadius, 0, 0));
};

const tiltAt = (frame: number, start: number, frames: number): number => {
  const progress = THREE.MathUtils.clamp((frame - start) / frames, 0, 1);
  const fall = FALLEN * progress ** TIP_POWER;
  const landed = frame - start - frames;
  if (landed <= 0) {
    return fall;
  }
  const bounce = Math.min(1, landed / BOUNCE_FRAMES);
  return FALLEN - Math.sin(Math.PI * bounce) * 0.07 * (1 - bounce * 0.4);
};

const spillTiming = (timing: SpillRevealProps['timing']) => {
  const contact = timing.reachStart + timing.reachFrames;
  const tipTotal = timing.tipFrames + timing.fallFrames;
  const release = contact + tipTotal * (RELEASE / FALLEN) ** (1 / TIP_POWER);
  const landed = contact + tipTotal;
  const soakStart = timing.dropStart + timing.dropFrames + timing.soakDelay;
  return { contact, tipTotal, release, landed, soakStart };
};

const gripLocal = (props: SpillRevealProps) => {
  const height = CUP.height * props.hand.contactHeight;
  const outward = new THREE.Vector3(Math.cos(CUP_SIDE_ANGLE), -Math.sin(CUP_SIDE_ANGLE), 0);
  return {
    position: new THREE.Vector3(cupRadiusAt(height), height, 0).addScaledVector(
      outward,
      CONTACT_GAP,
    ),
    quaternion: palmBasis(outward.clone().negate(), new THREE.Vector3(0, -0.35, -1)),
  };
};

const handPath = (props: SpillRevealProps, frame: number) => {
  const { timing } = props;
  const marks = spillTiming(timing);
  const grip = gripLocal(props);
  const attached = (tilt: number): PalmFrame => {
    const matrix = tipMatrix(props.cup, tilt, 0);
    return {
      position: grip.position.clone().applyMatrix4(matrix),
      quaternion: new THREE.Quaternion()
        .setFromRotationMatrix(new THREE.Matrix4().makeRotationZ(tilt))
        .multiply(grip.quaternion),
    };
  };
  const rest = attached(0);
  const enterFrom = rest.position.clone().add(new THREE.Vector3(2.8, 1.1, 1.4));
  if (frame < marks.contact) {
    const enter = tween(frame, [timing.reachStart, marks.contact], [0, 1], ARRIVE);
    return {
      palm: { position: enterFrom.clone().lerp(rest.position, enter), quaternion: rest.quaternion },
      grip: enter,
      origin: rest.position,
    };
  }
  if (frame < marks.release) {
    return {
      palm: attached(tiltAt(frame, marks.contact, marks.tipTotal)),
      grip: 1,
      origin: rest.position,
    };
  }
  const released = attached(RELEASE);
  const leave = tween(frame, [marks.release, marks.release + timing.leaveFrames], [0, 1], smooth);
  const exitTo = released.position.clone().add(new THREE.Vector3(3.2, 1.6, 1.6));
  return {
    palm:
      leave >= 1
        ? null
        : {
            position: released.position.clone().lerp(exitTo, leave),
            quaternion: released.quaternion,
          },
    grip: 1 - leave,
    origin: rest.position,
  };
};

const handPose = (props: SpillRevealProps, grip: number): HandPose => {
  const curl = THREE.MathUtils.lerp(0.12, props.hand.curl, grip);
  return {
    curl: { index: curl * 0.85, middle: curl, ring: curl * 1.1, pinky: curl * 1.25 },
    spread: 0.25,
    thumbCurl: 0.2 + grip * 0.15,
    thumbReach: 0.1,
    wristBend: -0.1,
    wristTwist: 0,
  };
};

const cameraAt = (props: SpillRevealProps, frame: number, duration: number): DeskCamera => {
  const { camera, timing } = props;
  const move = tween(
    frame,
    [timing.moveStart, timing.moveStart + timing.moveFrames],
    [0, 1],
    smooth,
  );
  const push = 1 - camera.pushIn * tween(frame, [0, duration], [0, 1], (t) => t);
  const target = new THREE.Vector3(
    THREE.MathUtils.lerp(camera.startTargetX, camera.endTargetX, move),
    0,
    THREE.MathUtils.lerp(camera.startTargetZ, camera.endTargetZ, move),
  );
  const eye = new THREE.Vector3(
    THREE.MathUtils.lerp(camera.startX, camera.endX, move),
    THREE.MathUtils.lerp(camera.startY, camera.endY, move),
    THREE.MathUtils.lerp(camera.startZ, camera.endZ, move),
  );
  const position = target.clone().add(eye.sub(target).multiplyScalar(push));
  return {
    x: position.x,
    y: position.y,
    z: position.z,
    targetX: target.x,
    targetY: target.y,
    targetZ: target.z,
    fieldOfView: camera.fieldOfView,
    handheld: camera.handheld,
  };
};

export const puddleShape = (
  cup: SpillRevealProps['cup'],
  water: SpillRevealProps['water'],
): PuddleShape => {
  const mouth = new THREE.Vector3(0, CUP.height + 0.02, 0).applyMatrix4(tipMatrix(cup, FALLEN, 0));
  return {
    originX: mouth.x - 0.06,
    originZ: mouth.z,
    angle: water.angle,
    length: water.length,
    width: water.width,
    lead: 0.82,
    ragged: water.ragged,
  };
};

export const spillMotion = (
  props: SpillRevealProps,
  frame: number,
  duration: number,
  puddle: PuddleShape,
): SpillMotion => {
  const { timing } = props;
  const marks = spillTiming(timing);
  const tilt = tiltAt(frame, marks.contact, marks.tipTotal);
  const slide = tween(frame, [marks.landed, marks.landed + 14], [0, 0.05], settle);
  const hand = handPath(props, frame);
  const reachStart = marks.landed - 3;
  const reach =
    frame < reachStart
      ? 0
      : tween(frame, [reachStart, reachStart + timing.spreadFrames], [0.04, 1], settle) +
        tween(frame, [reachStart + timing.spreadFrames, duration], [0, 0.05], (t) => t);
  const camera = cameraAt(props, frame, duration);
  const move = tween(
    frame,
    [timing.moveStart, timing.moveStart + timing.moveFrames],
    [0, 1],
    smooth,
  );
  const elbowBase = new THREE.Vector3(
    props.cup.x + props.hand.elbowX,
    props.hand.elbowY,
    props.cup.z + props.hand.elbowZ,
  );
  return {
    cup: tipMatrix(props.cup, tilt, slide).multiply(
      new THREE.Matrix4().makeRotationY(props.cup.turn),
    ),
    tilt,
    fill: THREE.MathUtils.clamp(1 - tilt / 0.9, 0, 1),
    palm: props.hand.show ? hand.palm : null,
    pose: handPose(props, hand.grip),
    elbow:
      hand.palm === null
        ? elbowBase
        : elbowBase.clone().add(hand.palm.position.clone().sub(hand.origin).multiplyScalar(0.85)),
    puddle,
    reach,
    drop: tween(frame, [timing.dropStart, timing.dropStart + timing.dropFrames], [0, 1], (t) => t),
    soak: tween(frame, [marks.soakStart, marks.soakStart + timing.soakFrames], [0, 1.08], smooth),
    camera,
    focus: [
      THREE.MathUtils.lerp(props.cup.x - 0.3, props.napkin.x, move),
      0.15,
      THREE.MathUtils.lerp(props.cup.z, props.napkin.z, move),
    ],
  };
};
