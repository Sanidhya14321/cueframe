import * as THREE from 'three';
import { FINGERS, type Finger, type HandRig } from '../promo/desk/hand-rig';

const FAN: Record<Finger, number> = { index: 0.1, middle: 0.02, ring: -0.06, pinky: -0.13 };

const PALM_NORMAL = new THREE.Vector3(1, 0, 0);

const pivot = new THREE.Vector3();
const swing = new THREE.Matrix4();
const toPivot = new THREE.Matrix4();
const fromPivot = new THREE.Matrix4();

export const fanFingers = (rig: HandRig, amount: number): void => {
  if (amount === 0) {
    return;
  }
  for (const finger of FINGERS) {
    const chain = rig.fingers[finger];
    const knuckle = chain[1];
    if (knuckle === undefined) {
      continue;
    }
    pivot.setFromMatrixPosition(knuckle.bone.matrix);
    toPivot.makeTranslation(pivot.x, pivot.y, pivot.z);
    fromPivot.makeTranslation(-pivot.x, -pivot.y, -pivot.z);
    swing.makeRotationAxis(PALM_NORMAL, FAN[finger] * amount);
    const transform = toPivot.clone().multiply(swing).multiply(fromPivot);
    for (const joint of chain.slice(1)) {
      joint.bone.matrix.premultiply(transform);
      joint.bone.matrixWorldNeedsUpdate = true;
    }
  }
};
