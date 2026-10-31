import * as THREE from 'three';

export const FINGERS = ['index', 'middle', 'ring', 'pinky'] as const;

export type Finger = (typeof FINGERS)[number];

export interface HandPose {
  curl: Record<Finger, number>;
  spread: number;
  thumbCurl: number;
  thumbReach: number;
  wristBend: number;
  wristTwist: number;
}

const FINGER_CHAIN = (finger: Finger): string[] => [
  `${finger}-finger-metacarpal`,
  `${finger}-finger-phalanx-proximal`,
  `${finger}-finger-phalanx-intermediate`,
  `${finger}-finger-phalanx-distal`,
  `${finger}-finger-tip`,
];

const THUMB_CHAIN = [
  'thumb-metacarpal',
  'thumb-phalanx-proximal',
  'thumb-phalanx-distal',
  'thumb-tip',
];

const SPREAD_SIGN: Record<Finger, number> = { index: -1, middle: -0.2, ring: 0.5, pinky: 1 };

const CURL_SHARE = [0, 0.85, 1.05, 0.75, 0];

const THUMB_SHARE = [0.35, 0.7, 0.9, 0];

interface RestJoint {
  bone: THREE.Bone;
  rest: THREE.Matrix4;
}

export interface HandRig {
  wrist: RestJoint;
  fingers: Record<Finger, RestJoint[]>;
  thumb: RestJoint[];
}

const restOf = (bones: Map<string, THREE.Bone>, name: string): RestJoint => {
  const bone = bones.get(name);
  if (bone === undefined) {
    throw new Error(`Hand model is missing the ${name} joint`);
  }
  bone.updateMatrix();
  bone.matrixAutoUpdate = false;
  return { bone, rest: bone.matrix.clone() };
};

export const buildHandRig = (skeleton: THREE.Skeleton): HandRig => {
  const bones = new Map(skeleton.bones.map((bone) => [bone.name, bone]));
  const chain = (names: string[]) => names.map((name) => restOf(bones, name));
  return {
    wrist: restOf(bones, 'wrist'),
    fingers: {
      index: chain(FINGER_CHAIN('index')),
      middle: chain(FINGER_CHAIN('middle')),
      ring: chain(FINGER_CHAIN('ring')),
      pinky: chain(FINGER_CHAIN('pinky')),
    },
    thumb: chain(THUMB_CHAIN),
  };
};

const X_AXIS = new THREE.Vector3(1, 0, 0);
const Y_AXIS = new THREE.Vector3(0, 1, 0);

const scratch = {
  relative: new THREE.Matrix4(),
  inverse: new THREE.Matrix4(),
  rotation: new THREE.Matrix4(),
  spread: new THREE.Matrix4(),
};

const poseChain = (
  parentRest: THREE.Matrix4,
  parentPosed: THREE.Matrix4,
  chain: RestJoint[],
  bend: (index: number) => THREE.Matrix4,
): void => {
  let restParent = parentRest;
  let posedParent = parentPosed;
  chain.forEach((joint, index) => {
    scratch.inverse.copy(restParent).invert();
    scratch.relative.multiplyMatrices(scratch.inverse, joint.rest);
    joint.bone.matrix.multiplyMatrices(posedParent, scratch.relative).multiply(bend(index));
    joint.bone.matrixWorldNeedsUpdate = true;
    restParent = joint.rest;
    posedParent = joint.bone.matrix;
  });
};

export const applyHandPose = (rig: HandRig, pose: HandPose): void => {
  const wrist = rig.wrist;
  wrist.bone.matrix
    .copy(wrist.rest)
    .multiply(scratch.rotation.makeRotationAxis(X_AXIS, pose.wristBend))
    .multiply(scratch.spread.makeRotationAxis(Y_AXIS, pose.wristTwist));
  wrist.bone.matrixWorldNeedsUpdate = true;
  for (const finger of FINGERS) {
    const curl = pose.curl[finger];
    poseChain(wrist.rest, wrist.rest, rig.fingers[finger], (index) => {
      scratch.rotation.makeRotationAxis(X_AXIS, -curl * (CURL_SHARE[index] ?? 0));
      if (index === 1) {
        scratch.spread.makeRotationAxis(Y_AXIS, pose.spread * SPREAD_SIGN[finger] * 0.16);
        return scratch.rotation.premultiply(scratch.spread);
      }
      return scratch.rotation;
    });
  }
  poseChain(wrist.rest, wrist.rest, rig.thumb, (index) => {
    scratch.rotation.makeRotationAxis(X_AXIS, -pose.thumbCurl * (THUMB_SHARE[index] ?? 0));
    if (index === 0) {
      scratch.spread.makeRotationAxis(Y_AXIS, pose.thumbReach * 0.5);
      return scratch.rotation.premultiply(scratch.spread);
    }
    return scratch.rotation;
  });
};

export const mixPose = (from: HandPose, to: HandPose, amount: number): HandPose => {
  const mix = (a: number, b: number) => a + (b - a) * amount;
  return {
    curl: {
      index: mix(from.curl.index, to.curl.index),
      middle: mix(from.curl.middle, to.curl.middle),
      ring: mix(from.curl.ring, to.curl.ring),
      pinky: mix(from.curl.pinky, to.curl.pinky),
    },
    spread: mix(from.spread, to.spread),
    thumbCurl: mix(from.thumbCurl, to.thumbCurl),
    thumbReach: mix(from.thumbReach, to.thumbReach),
    wristBend: mix(from.wristBend, to.wristBend),
    wristTwist: mix(from.wristTwist, to.wristTwist),
  };
};
