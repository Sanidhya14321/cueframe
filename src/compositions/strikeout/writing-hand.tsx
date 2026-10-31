import * as THREE from 'three';
import type { ProblemStrikeoutProps } from '@/schemas';
import { HAND_UNITS, HandModel, palmFromModel, useHandScene } from '../promo/desk/hand-model';
import { applyHandPose, type HandRig } from '../promo/desk/hand-rig';

type HandLook = ProblemStrikeoutProps['hand'];

const UP = new THREE.Vector3(0, 1, 0);
const BACK_OF_HAND = new THREE.Vector3(1, 0, 0);

const modelPoint = (root: THREE.Object3D, bone: THREE.Bone | undefined): THREE.Vector3 => {
  if (bone === undefined) {
    return new THREE.Vector3();
  }
  const relative = root.matrixWorld.clone().invert().multiply(bone.matrixWorld);
  return new THREE.Vector3().setFromMatrixPosition(relative);
};

const gripLine = (root: THREE.Object3D, rig: HandRig) => {
  root.updateMatrixWorld(true);
  const pinch = modelPoint(root, rig.fingers.index[3]?.bone)
    .lerp(modelPoint(root, rig.thumb[2]?.bone), 0.5)
    .lerp(modelPoint(root, rig.fingers.middle[3]?.bone), 0.25);
  const web = modelPoint(root, rig.fingers.index[1]?.bone).lerp(
    modelPoint(root, rig.thumb[1]?.bone),
    0.5,
  );
  return { pinch, toTip: pinch.clone().sub(web).normalize() };
};

const basis = (forward: THREE.Vector3, up: THREE.Vector3): THREE.Matrix4 => {
  const f = forward.clone().normalize();
  const u = up
    .clone()
    .sub(f.clone().multiplyScalar(up.dot(f)))
    .normalize();
  return new THREE.Matrix4().makeBasis(f, u, new THREE.Vector3().crossVectors(f, u));
};

const placeHand = (
  root: THREE.Object3D,
  rig: HandRig,
  tip: THREE.Vector3,
  axis: THREE.Vector3,
  hand: HandLook,
) => {
  const { pinch, toTip } = gripLine(root, rig);
  const down = axis.clone().negate();
  const side = new THREE.Vector3().crossVectors(axis, UP).normalize();
  const back = UP.clone().applyAxisAngle(axis, hand.roll);
  const rotation = basis(down, back).multiply(basis(toTip, BACK_OF_HAND).invert());
  const target = tip.clone().addScaledVector(axis, hand.grip).addScaledVector(side, hand.offset);
  const modelToWorld = new THREE.Matrix4()
    .makeTranslation(target.x, target.y, target.z)
    .multiply(rotation)
    .multiply(new THREE.Matrix4().makeScale(HAND_UNITS, HAND_UNITS, HAND_UNITS))
    .multiply(new THREE.Matrix4().makeTranslation(-pinch.x, -pinch.y, -pinch.z));
  const elbow = target
    .clone()
    .addScaledVector(axis, 2.6)
    .addScaledVector(side, -0.8)
    .addScaledVector(UP, -0.9);
  return { palm: palmFromModel(modelToWorld), elbow };
};

export const WritingHand = ({
  hand,
  tip,
  axis,
  frame,
}: {
  hand: HandLook;
  tip: THREE.Vector3;
  axis: THREE.Vector3;
  frame: number;
}) => {
  const scene = useHandScene();
  const life = Math.sin(frame / 9) * 0.02;
  applyHandPose(scene.rig, {
    curl: {
      index: hand.indexCurl + life,
      middle: hand.indexCurl + 0.3,
      ring: hand.indexCurl + 0.75,
      pinky: hand.indexCurl + 0.95,
    },
    spread: -0.3,
    thumbCurl: hand.thumbCurl,
    thumbReach: hand.thumbReach,
    wristBend: hand.wristBend,
    wristTwist: 0,
  });
  const { palm, elbow } = placeHand(scene.scene, scene.rig, tip, axis, hand);
  return (
    <HandModel
      hand={scene}
      palm={palm}
      skin={hand.skin}
      roughness={0.55}
      detail={1}
      arm={{
        style: hand.sleeve ? 'sleeve' : 'bare',
        sleeveColor: hand.sleeveColor,
        length: 0.9,
        looseness: 0.4,
        knit: 0.004,
        band: false,
        bandColor: '#222222',
      }}
      elbow={elbow}
    />
  );
};
