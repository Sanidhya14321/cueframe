import { ThreeCanvas } from '@remotion/three';
import * as THREE from 'three';
import type { KeyboardTypingCtaProps } from '@/schemas';
import { useCanvasPixelRatio } from '../kit/pixel-ratio';
import { forearmAim } from '../promo/desk/arm';
import {
  HAND_UNITS,
  HandModel,
  palmFromModel,
  palmToWorld,
  useHandScene,
} from '../promo/desk/hand-model';
import { applyHandPose, FINGERS, type HandRig } from '../promo/desk/hand-rig';
import type { HandSide } from './hand-assign';
import { fanFingers } from './hand-fan';
import { type HandCue, NEUTRAL_POSE } from './hand-path';

type HandLook = KeyboardTypingCtaProps['hand'];

const WIDTH = 1080;
const HEIGHT = 1920;
const CAMERA_Z = 12;
const FOV = 28;
const BEADS = 19;
const BEAD_RADIUS = 0.0046;
const BEAD_RING: [number, number] = [0.0282, 0.0216];
const BEAD_ALONG = 0.034;

const halfHeight = (depth: number) => (CAMERA_Z - depth) * Math.tan(((FOV / 2) * Math.PI) / 180);

const screenToWorld = ([x, y]: [number, number], depth: number): THREE.Vector3 => {
  const unitsPerPixel = (2 * halfHeight(depth)) / HEIGHT;
  return new THREE.Vector3(
    (x - WIDTH / 2) * unitsPerPixel,
    -(y - HEIGHT / 2) * unitsPerPixel,
    depth,
  );
};

interface Landmarks {
  wrist: THREE.Vector3;
  tip: THREE.Vector3;
  indexKnuckle: THREE.Vector3;
  pinkyKnuckle: THREE.Vector3;
}

const landmarkCache = new WeakMap<HandRig, Landmarks>();

const modelPoint = (root: THREE.Object3D, bone: THREE.Bone | undefined): THREE.Vector3 => {
  if (bone === undefined) {
    return new THREE.Vector3();
  }
  const relative = root.matrixWorld.clone().invert().multiply(bone.matrixWorld);
  return new THREE.Vector3().setFromMatrixPosition(relative);
};

const landmarks = (root: THREE.Object3D, rig: HandRig): Landmarks => {
  const hit = landmarkCache.get(rig);
  if (hit !== undefined) {
    return hit;
  }
  applyHandPose(rig, NEUTRAL_POSE);
  root.updateMatrixWorld(true);
  const found = {
    wrist: modelPoint(root, rig.wrist.bone),
    tip: modelPoint(root, rig.fingers.middle[4]?.bone),
    indexKnuckle: modelPoint(root, rig.fingers.index[1]?.bone),
    pinkyKnuckle: modelPoint(root, rig.fingers.pinky[1]?.bone),
  };
  landmarkCache.set(rig, found);
  return found;
};

const frameOf = (up: THREE.Vector3, side: THREE.Vector3): THREE.Matrix4 => {
  const u = up.clone().normalize();
  const s = side
    .clone()
    .sub(u.clone().multiplyScalar(side.dot(u)))
    .normalize();
  return new THREE.Matrix4().makeBasis(s, u, new THREE.Vector3().crossVectors(s, u));
};

const Bracelet = ({
  placement,
  wrist,
  forearm,
  color,
}: {
  placement: THREE.Matrix4;
  wrist: THREE.Matrix4;
  forearm: THREE.Matrix4;
  color: string;
}) => (
  <group matrixAutoUpdate={false} matrix={placement}>
    <group matrixAutoUpdate={false} matrix={wrist}>
      <group position={[0.001, 0, 0]}>
        <group matrixAutoUpdate={false} matrix={forearm}>
          {Array.from({ length: BEADS }, (_unused, index) => {
            const angle = (index / BEADS) * Math.PI * 2;
            return (
              <mesh
                key={angle}
                position={[
                  Math.cos(angle) * BEAD_RING[0],
                  Math.sin(angle) * BEAD_RING[1],
                  BEAD_ALONG,
                ]}
                castShadow
              >
                <sphereGeometry args={[BEAD_RADIUS, 20, 14]} />
                <meshPhysicalMaterial
                  color={color}
                  roughness={0.28}
                  clearcoat={0.6}
                  clearcoatRoughness={0.25}
                />
              </mesh>
            );
          })}
        </group>
      </group>
    </group>
  </group>
);

const PlacedHand = ({
  look,
  cue,
  bracelet,
}: {
  look: HandLook;
  cue: HandCue;
  bracelet: boolean;
}) => {
  const { tip, pose, lean, depth, weights } = cue;
  const hand = useHandScene();
  const marks = landmarks(hand.scene, hand.rig);
  applyHandPose(hand.rig, { ...pose, spread: 0 });
  fanFingers(hand.rig, pose.spread);
  hand.scene.updateMatrixWorld(true);
  const pad = FINGERS.reduce(
    (sum, finger) =>
      sum.addScaledVector(
        modelPoint(hand.scene, hand.rig.fingers[finger][4]?.bone),
        weights[finger],
      ),
    new THREE.Vector3(),
  );
  const modelUp = marks.tip.clone().sub(marks.wrist);
  const modelSide = marks.pinkyKnuckle.clone().sub(marks.indexKnuckle);
  const worldUp = new THREE.Vector3(-Math.sin(lean), Math.cos(lean), -look.reach);
  const worldSide = new THREE.Vector3(Math.cos(lean), Math.sin(lean), 0);
  const rotation = frameOf(worldUp, worldSide).multiply(frameOf(modelUp, modelSide).invert());
  const modelToWorld = rotation
    .clone()
    .multiply(new THREE.Matrix4().makeScale(HAND_UNITS, HAND_UNITS, HAND_UNITS))
    .multiply(new THREE.Matrix4().makeTranslation(-marks.tip.x, -marks.tip.y, -marks.tip.z));
  const contact = pad.applyMatrix4(modelToWorld).negate();
  const palm = palmFromModel(modelToWorld);
  const wristInner = marks.wrist.clone().applyMatrix4(modelToWorld);
  const elbow = wristInner
    .clone()
    .addScaledVector(worldUp.clone().normalize(), -4)
    .add(new THREE.Vector3(1.1, 0, 1.2));
  const placement = palmToWorld(palm);
  const wrist = hand.rig.wrist.bone.matrix.clone();
  const forearm = forearmAim(wrist, elbow.clone().applyMatrix4(placement.clone().invert()));
  return (
    <group position={screenToWorld(tip, depth)} scale={look.size}>
      <group position={contact}>
        <HandModel
          hand={hand}
          palm={palm}
          skin={look.skin}
          roughness={0.6}
          detail={1}
          arm={{
            style: 'bare',
            sleeveColor: '#000000',
            length: 0.9,
            looseness: 0,
            knit: 0,
            band: false,
            bandColor: '#000000',
          }}
          elbow={elbow}
        />
        {bracelet ? (
          <Bracelet placement={placement} wrist={wrist} forearm={forearm} color={look.bracelet} />
        ) : null}
      </group>
    </group>
  );
};

export interface SideCue {
  side: HandSide;
  cue: HandCue;
}

const mirrored = (cue: HandCue): HandCue => ({ ...cue, tip: [WIDTH - cue.tip[0], cue.tip[1]] });

export const TypingHand = ({ look, hands }: { look: HandLook; hands: SideCue[] }) => {
  const pixelRatio = useCanvasPixelRatio(1.5);
  return (
    <ThreeCanvas
      width={WIDTH}
      height={HEIGHT}
      shadows="variance"
      dpr={pixelRatio}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      camera={{ fov: FOV, position: [0, 0, CAMERA_Z], near: 1, far: 60 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <hemisphereLight args={['#fff6ea', '#a89482', 0.6]} />
      <directionalLight
        position={[look.lightX, look.lightY, 8]}
        intensity={3.2}
        color="#fff1e2"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-radius={look.shadowSoftness}
        shadow-blurSamples={24}
        shadow-bias={-0.0006}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-camera-near={1}
        shadow-camera-far={30}
      />
      <directionalLight position={[-4, -2, 6]} intensity={0.45} color="#f3e8ff" />
      <mesh receiveShadow>
        <planeGeometry args={[30, 30]} />
        <shadowMaterial opacity={look.shadow} transparent />
      </mesh>
      {hands.map(({ side, cue }) =>
        side === 'left' ? (
          <group key={side} scale={[-1, 1, 1]}>
            <PlacedHand look={look} cue={mirrored(cue)} bracelet={false} />
          </group>
        ) : (
          <PlacedHand key={side} look={look} cue={cue} bracelet />
        ),
      )}
    </ThreeCanvas>
  );
};
