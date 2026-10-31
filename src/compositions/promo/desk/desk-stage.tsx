import { Environment, Lightformer } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { ThreeCanvas } from '@remotion/three';
import type { ReactNode } from 'react';
import { useVideoConfig } from 'remotion';
import type * as THREE from 'three';
import { useCanvasPixelRatio } from '../../kit/pixel-ratio';
import type { Vec3 } from '../stage';
import { DeskEffects, type DeskLens } from './desk-effects';

export interface DeskCamera {
  x: number;
  y: number;
  z: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  fieldOfView: number;
  handheld: number;
}

interface DeskLight {
  key: number;
  keyColor: string;
  keyX: number;
  keyY: number;
  keyZ: number;
  ambient: number;
  softness: number;
  reflections: number;
}

const handheldOffset = (frame: number, amount: number): Vec3 => [
  (Math.sin(frame / 37) * 0.6 + Math.sin(frame / 13.7 + 1.1) * 0.18) * 0.05 * amount,
  (Math.sin(frame / 29 + 0.7) * 0.5 + Math.sin(frame / 11.3 + 2.3) * 0.15) * 0.04 * amount,
  Math.sin(frame / 47 + 0.3) * 0.04 * amount,
];

export const cameraPosition = (camera: DeskCamera, frame: number): Vec3 => {
  const [dx, dy, dz] = handheldOffset(frame, camera.handheld);
  return [camera.x + dx, camera.y + dy, camera.z + dz];
};

const CameraRig = ({ camera, frame }: { camera: DeskCamera; frame: number }) => {
  const three = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const [dx, dy] = handheldOffset(frame + 300, camera.handheld);
  three.position.set(...cameraPosition(camera, frame));
  three.fov = camera.fieldOfView;
  three.near = 0.2;
  three.far = 80;
  three.updateProjectionMatrix();
  three.lookAt(camera.targetX + dx * 0.5, camera.targetY + dy * 0.5, camera.targetZ);
  return null;
};

const Room = ({ reflections }: { reflections: number }) => (
  <Environment resolution={256} frames={1}>
    <color attach="background" args={['#8d877e']} />
    <Lightformer
      form="rect"
      intensity={2.4 * reflections}
      position={[0, 8, 2]}
      rotation={[Math.PI / 2, 0, 0]}
      scale={[10, 4, 1]}
    />
    <Lightformer
      form="rect"
      intensity={2 * reflections}
      color="#fff4e6"
      position={[-8, 3, 3]}
      rotation={[0, Math.PI / 2, 0]}
      scale={[4, 6, 1]}
    />
    <Lightformer
      form="rect"
      intensity={0.8 * reflections}
      position={[6, 2, 6]}
      rotation={[0, -Math.PI / 3, 0]}
      scale={[6, 4, 1]}
    />
    <Lightformer
      form="rect"
      intensity={0.6 * reflections}
      color="#efe7da"
      position={[0, -3, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[12, 12, 1]}
    />
  </Environment>
);

export interface DeskStageProps {
  camera: DeskCamera;
  light: DeskLight;
  frame: number;
  lens: DeskLens | null;
  blurred: boolean;
  focus: Vec3;
  supersample?: boolean;
  children: ReactNode;
}

export const DeskStage = ({
  camera,
  light,
  frame,
  lens,
  focus,
  children,
  blurred,
  supersample = true,
}: DeskStageProps) => {
  const { width, height } = useVideoConfig();
  const pixelRatio = useCanvasPixelRatio(!blurred && supersample ? 2 : 1);
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows="variance"
      dpr={pixelRatio}
      gl={{ antialias: true, alpha: lens === null, preserveDrawingBuffer: true }}
      camera={{ fov: camera.fieldOfView, position: cameraPosition(camera, frame) }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <CameraRig camera={camera} frame={frame} />
      <hemisphereLight args={['#fff8ee', '#d8cfc2', light.ambient]} />
      <directionalLight
        position={[light.keyX, light.keyY, light.keyZ]}
        color={light.keyColor}
        intensity={light.key}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-radius={light.softness}
        shadow-blurSamples={24}
        shadow-bias={-0.0006}
        shadow-normalBias={0.01}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-near={1}
        shadow-camera-far={40}
      />
      <directionalLight position={[6, 4, 5]} intensity={light.key * 0.25} color="#e8eeff" />
      <Room reflections={light.reflections} />
      {children}
      {lens === null ? null : (
        <DeskEffects lens={lens} focus={focus} multisampling={blurred ? 4 : 8} />
      )}
    </ThreeCanvas>
  );
};

export const DeskRoom = ({
  wall,
  desk,
  deskRoughness,
  wallDistance,
}: {
  wall: string;
  desk: string;
  deskRoughness: number;
  wallDistance: number;
}) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshPhysicalMaterial
        color={desk}
        roughness={deskRoughness}
        clearcoat={0.2}
        clearcoatRoughness={0.4}
      />
    </mesh>
    <mesh position={[0, 15, -wallDistance]} receiveShadow>
      <planeGeometry args={[60, 30]} />
      <meshStandardMaterial color={wall} roughness={0.95} />
    </mesh>
  </group>
);
