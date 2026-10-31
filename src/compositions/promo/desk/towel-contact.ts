import * as THREE from 'three';
import { FINGERS, type HandRig } from './hand-rig';

export interface Capsule {
  a: THREE.Vector3;
  b: THREE.Vector3;
  radius: number;
  thumb: boolean;
}

const FINGER_RADII = [0.0125, 0.0092, 0.0082, 0.0076];

const THUMB_RADII = [0.0165, 0.0118, 0.0106];

const PALM_RADIUS = 0.026;

const ARM_REACH = 0.32;

const ARM_RADIUS = 0.034;

const jointOf = (matrix: THREE.Matrix4) => new THREE.Vector3().setFromMatrixPosition(matrix);

export const handCapsules = (
  rig: HandRig,
  toTarget: THREE.Matrix4,
  units: number,
  elbow: THREE.Vector3,
): Capsule[] => {
  const capsules: Capsule[] = [];
  const add = (a: THREE.Vector3, b: THREE.Vector3, radius: number, thumb: boolean) => {
    capsules.push({
      a: a.clone().applyMatrix4(toTarget),
      b: b.clone().applyMatrix4(toTarget),
      radius: radius * units,
      thumb,
    });
  };
  const wrist = jointOf(rig.wrist.bone.matrix);
  for (const finger of FINGERS) {
    const joints = rig.fingers[finger].map((joint) => jointOf(joint.bone.matrix));
    add(wrist, joints[1] ?? wrist, PALM_RADIUS, false);
    joints.slice(1).forEach((joint, index) => {
      const next = joints[index + 2];
      if (next !== undefined) {
        add(joint, next, FINGER_RADII[index + 1] ?? 0.008, false);
      }
    });
  }
  const thumbJoints = rig.thumb.map((joint) => jointOf(joint.bone.matrix));
  thumbJoints.forEach((joint, index) => {
    const next = thumbJoints[index + 1];
    if (next !== undefined) {
      add(joint, next, THUMB_RADII[index] ?? 0.01, true);
    }
  });
  const forearm = elbow.clone().sub(wrist).normalize().multiplyScalar(ARM_REACH).add(wrist);
  add(wrist, forearm, ARM_RADIUS, false);
  return capsules;
};

const closestOnSegment = (x: number, y: number, capsule: Capsule) => {
  const dx = capsule.b.x - capsule.a.x;
  const dy = capsule.b.y - capsule.a.y;
  const length = dx * dx + dy * dy;
  const t =
    length < 1e-9
      ? 0
      : THREE.MathUtils.clamp(((x - capsule.a.x) * dx + (y - capsule.a.y) * dy) / length, 0, 1);
  const px = capsule.a.x + dx * t;
  const py = capsule.a.y + dy * t;
  return {
    distance: Math.hypot(x - px, y - py),
    z: capsule.a.z + (capsule.b.z - capsule.a.z) * t,
  };
};

export const thumbEdgeShift = (capsules: Capsule[], half: number, margin: number): number => {
  for (const capsule of capsules) {
    if (!capsule.thumb || Math.sign(capsule.a.z) === Math.sign(capsule.b.z)) {
      continue;
    }
    const t = capsule.a.z / (capsule.a.z - capsule.b.z);
    const x = capsule.a.x + (capsule.b.x - capsule.a.x) * t;
    const y = capsule.a.y + (capsule.b.y - capsule.a.y) * t;
    const clear = half + capsule.radius + margin;
    if (Math.abs(x) < clear && Math.abs(y) < clear) {
      return x - Math.sign(x || 1) * clear;
    }
  }
  return 0;
};

const cellAverage = (source: Float32Array, side: number, row: number, column: number): number => {
  let sum = 0;
  let count = 0;
  for (let r = Math.max(0, row - 1); r <= Math.min(side - 1, row + 1); r++) {
    for (let c = Math.max(0, column - 1); c <= Math.min(side - 1, column + 1); c++) {
      sum += source[r * side + c] ?? 0;
      count += 1;
    }
  }
  return sum / count;
};

const blur = (field: Float32Array, side: number, passes: number): Float32Array => {
  let source = field;
  for (let pass = 0; pass < passes; pass++) {
    const target = new Float32Array(source.length);
    for (let row = 0; row < side; row++) {
      for (let column = 0; column < side; column++) {
        target[row * side + column] = cellAverage(source, side, row, column);
      }
    }
    source = target;
  }
  return source;
};

export interface ContactInput {
  position: THREE.BufferAttribute;
  side: number;
  capsules: Capsule[];
  clearance: number;
  drape: number;
  strength: number;
}

const bounds = (x: number, y: number, z: number, input: ContactInput) => {
  let floor = Number.NEGATIVE_INFINITY;
  let ceiling = Number.POSITIVE_INFINITY;
  for (const capsule of input.capsules) {
    const reach = capsule.radius + input.clearance;
    const { distance, z: center } = closestOnSegment(x, y, capsule);
    if (distance >= reach) {
      continue;
    }
    const half = Math.sqrt(reach * reach - distance * distance);
    if (capsule.thumb && capsule.a.z + capsule.b.z < 0) {
      floor = Math.max(floor, center + half);
    } else {
      ceiling = Math.min(ceiling, center - half);
    }
  }
  if (floor > ceiling) {
    return (floor + ceiling) / 2 - z;
  }
  return THREE.MathUtils.clamp(z, floor, ceiling) - z;
};

export const resolveContact = (input: ContactInput): void => {
  const { position, side } = input;
  const pull = new Float32Array(position.count);
  const push = new Float32Array(position.count);
  for (let index = 0; index < position.count; index++) {
    const move = bounds(position.getX(index), position.getY(index), position.getZ(index), input);
    pull[index] = Math.min(0, move);
    push[index] = Math.max(0, move);
  }
  const softPull = blur(pull, side, input.drape);
  const softPush = blur(push, side, input.drape);
  for (let index = 0; index < position.count; index++) {
    const towardCamera = Math.min(pull[index] ?? 0, (softPull[index] ?? 0) * 1.6);
    const awayFromCamera = Math.max(push[index] ?? 0, (softPush[index] ?? 0) * 1.6);
    position.setZ(index, position.getZ(index) + (towardCamera + awayFromCamera) * input.strength);
  }
};

export interface TowelFloor {
  height: (x: number, z: number) => number;
}

export const restOnFloor = (
  position: THREE.BufferAttribute,
  placement: THREE.Matrix4,
  floor: TowelFloor,
): void => {
  const inverse = placement.clone().invert();
  const point = new THREE.Vector3();
  for (let index = 0; index < position.count; index++) {
    point.fromBufferAttribute(position, index).applyMatrix4(placement);
    const height = floor.height(point.x, point.z);
    if (point.y < height) {
      point.y = height;
      point.applyMatrix4(inverse);
      position.setXYZ(index, point.x, point.y, point.z);
    }
  }
};
