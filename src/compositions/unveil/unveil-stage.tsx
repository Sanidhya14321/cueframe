import { Environment } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { ThreeCanvas } from '@remotion/three';
import type { ReactNode } from 'react';
import { useVideoConfig } from 'remotion';
import * as THREE from 'three';
import type { UnveilSky } from '@/schemas';
import { useCanvasPixelRatio } from '../kit/pixel-ratio';
import type { CameraShot } from './flight';
import { SkyDome, sunDirection } from './sky';
import { VisibleSky } from './sky-gradient';

const SUN_DISTANCE = 140;

const CameraRig = ({
  shot,
  fov,
  exposure,
}: {
  shot: CameraShot;
  fov: number;
  exposure: number;
}) => {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const renderer = useThree((state) => state.gl);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = exposure;
  camera.position.set(...shot.position);
  camera.fov = fov;
  camera.near = 1;
  camera.far = 4000;
  camera.updateProjectionMatrix();
  camera.lookAt(...shot.target);
  return null;
};

const SkyLight = ({ sky }: { sky: UnveilSky }) => (
  <Environment resolution={256} frames={1} environmentIntensity={0.38}>
    <SkyDome sky={sky} />
    <mesh position={[0, -40, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[4000, 4000]} />
      <meshBasicMaterial color="#47533a" />
    </mesh>
  </Environment>
);

export const UnveilStage = ({
  shot,
  fov,
  sky,
  children,
}: {
  shot: CameraShot;
  fov: number;
  sky: UnveilSky;
  children: ReactNode;
}) => {
  const { width, height } = useVideoConfig();
  const pixelRatio = useCanvasPixelRatio(2);
  const sun = new THREE.Vector3(...sunDirection(sky)).normalize().multiplyScalar(SUN_DISTANCE);
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows="variance"
      dpr={pixelRatio}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      camera={{ fov, position: shot.position }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <CameraRig shot={shot} fov={fov} exposure={sky.exposure} />
      <fogExp2 attach="fog" args={[sky.haze, sky.fog]} />
      <VisibleSky sky={sky} />
      <SkyLight sky={sky} />
      <directionalLight
        position={[sun.x, sun.y, sun.z]}
        intensity={sky.sun}
        color={sky.sunColor}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-radius={5}
        shadow-blurSamples={16}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={60}
        shadow-camera-bottom={-40}
        shadow-camera-near={20}
        shadow-camera-far={320}
      />
      {children}
    </ThreeCanvas>
  );
};
