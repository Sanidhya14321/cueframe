import { Environment, Lightformer } from '@react-three/drei';
import { ThreeCanvas } from '@remotion/three';
import { useVideoConfig } from 'remotion';
import * as THREE from 'three';
import type { BurningPaperRevealProps } from '@/schemas';
import { useCanvasPixelRatio } from '../kit/pixel-ratio';
import type { ArmLook } from '../promo/desk/arm';
import { HandModel, useHandScene } from '../promo/desk/hand-model';
import { applyHandPose, type HandPose } from '../promo/desk/hand-rig';
import { palmBasis } from '../promo/desk/wipe-choreography';
import { type BurnCues, edgeXAt, paperToScreen } from './burn-cues';

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

const ARM: Omit<ArmLook, 'band' | 'bandColor'> = {
  style: 'bare',
  sleeveColor: '#eef2f7',
  length: 0.9,
  looseness: 0.5,
  knit: 0.003,
  bandMetal: 1,
};

const Room = () => (
  <Environment resolution={128} frames={1}>
    <color attach="background" args={['#6f6a66']} />
    <Lightformer
      form="rect"
      intensity={1.3}
      color="#fff1e2"
      position={[-6, 6, 4]}
      rotation={[0, Math.PI / 4, 0]}
      scale={[6, 6, 1]}
    />
    <Lightformer
      form="rect"
      intensity={0.5}
      color="#cfe0ff"
      position={[6, 1, 4]}
      rotation={[0, -Math.PI / 3, 0]}
      scale={[5, 4, 1]}
    />
    <Lightformer
      form="rect"
      intensity={0.5}
      color="#3a2c26"
      position={[0, -5, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[12, 12, 1]}
    />
  </Environment>
);

const gripPose = (grip: number, thumb: number, spread: number): HandPose => ({
  curl: { index: grip * 0.92, middle: grip, ring: grip * 1.05, pinky: grip * 1.1 },
  spread: 0.08,
  thumbCurl: thumb,
  thumbReach: spread,
  wristBend: 0,
  wristTwist: 0,
});

const Hand = ({ props, frame }: { props: BurningPaperRevealProps; frame: number }) => {
  const hand = useHandScene();
  const { hand: look } = props;
  applyHandPose(hand.rig, gripPose(look.grip, look.thumb, look.thumbSpread));
  const sway = Math.sin(frame / 47) * 0.02;
  const orient = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(look.pitch, look.yaw + sway, look.turn, 'YXZ'),
  );
  const palm = {
    position: new THREE.Vector3(0, 0, 0),
    quaternion: orient.multiply(palmBasis(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1, 0))),
  };
  const elbow = new THREE.Vector3(0, -1, 0)
    .applyQuaternion(palm.quaternion)
    .multiplyScalar(2.6)
    .add(new THREE.Vector3(look.elbowX, look.elbowY, 0.6));
  return (
    <group scale={[-1, 1, 1]}>
      <HandModel
        hand={hand}
        palm={palm}
        skin={look.skin}
        roughness={0.48}
        detail={1}
        arm={{
          ...ARM,
          style: look.sleeve ? 'sleeve' : 'bare',
          sleeveColor: look.sleeveColor,
          band: look.bracelet,
          bandColor: look.braceletColor,
        }}
        elbow={elbow}
      />
    </group>
  );
};

export const HeldHand = ({ props, cues }: { props: BurningPaperRevealProps; cues: BurnCues }) => {
  const { width, height } = useVideoConfig();
  const { paper, hand } = props;
  const pixelRatio = useCanvasPixelRatio(2);
  if (!hand.show) {
    return null;
  }
  const anchor = paperToScreen(props, cues, hand.x, hand.y);
  const fireY = paper.height * 0.2;
  const fire = paperToScreen(props, cues, edgeXAt(cues.edge, fireY, paper.width), fireY);
  const corner = paperToScreen(props, cues, 0, 0);
  const angle = toRadians(paper.tilt + cues.shake.angle);
  const world = (point: { x: number; y: number }) =>
    [point.x - width / 2, height / 2 - point.y] as const;
  const [ax, ay] = world(anchor);
  const [cx, cy] = world(corner);
  const unit = hand.scale * cues.zoom;
  return (
    <ThreeCanvas
      width={width}
      height={height}
      orthographic
      shadows
      dpr={pixelRatio}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      camera={{ zoom: 1, position: [0, 0, 2000], near: 1, far: 4000 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <hemisphereLight args={['#eef3ff', '#4a3f3a', 0.3]} />
      <directionalLight
        position={[-900, 1000, 1200]}
        intensity={3.4}
        color="#fff3e4"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-radius={6}
        shadow-blurSamples={20}
        shadow-bias={-0.0004}
        shadow-camera-left={-1300}
        shadow-camera-right={1300}
        shadow-camera-top={1300}
        shadow-camera-bottom={-1300}
        shadow-camera-near={10}
        shadow-camera-far={5000}
      />
      <directionalLight position={[700, -300, 900]} intensity={0.3} color="#bcd4ff" />
      <directionalLight position={[600, 400, -900]} intensity={1.1} color="#ffe2c4" />
      <pointLight
        position={[fire.x - width / 2, height / 2 - fire.y, 260]}
        intensity={props.flame.handGlow * 2.4 * cues.strength * cues.flicker}
        color={props.flame.mid}
        distance={0}
        decay={0}
      />
      <Room />
      <group position={[cx, cy, 0]} rotation={[0, 0, -angle]}>
        <mesh
          position={[(paper.width * cues.zoom) / 2, (-paper.height * cues.zoom) / 2, 0]}
          renderOrder={-1}
        >
          <planeGeometry args={[paper.width * cues.zoom, paper.height * cues.zoom]} />
          <meshBasicMaterial colorWrite={false} />
        </mesh>
        <mesh
          position={[(paper.width * cues.zoom) / 2, (-paper.height * cues.zoom) / 2, 0.5]}
          receiveShadow
        >
          <planeGeometry args={[paper.width * cues.zoom, paper.height * cues.zoom]} />
          <shadowMaterial transparent opacity={hand.shadow} depthWrite={false} />
        </mesh>
      </group>
      <group
        position={[ax, ay, hand.depth * unit]}
        rotation={[0, 0, -angle]}
        scale={[unit, unit, unit]}
      >
        <Hand props={props} frame={cues.frame} />
      </group>
    </ThreeCanvas>
  );
};
