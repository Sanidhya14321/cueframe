import { useThree } from '@react-three/fiber';
import { ThreeCanvas } from '@remotion/three';
import { type ReactNode, useMemo } from 'react';
import { useVideoConfig } from 'remotion';
import * as THREE from 'three';
import type { ReaderLight, ReaderWorld } from '@/schemas';
import { useCanvasPixelRatio } from '../kit/pixel-ratio';
import { hazeDensity } from './ground';
import { BOARD, type CameraShot } from './layout';

const KEY = new THREE.Vector3(-0.72, 0.42, 0.56).normalize();
const KEY_DISTANCE = 90;

const CameraRig = ({ shot, fov }: { shot: CameraShot; fov: number }) => {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const renderer = useThree((state) => state.gl);
  renderer.toneMapping = THREE.NoToneMapping;
  camera.position.set(...shot.position);
  camera.fov = fov;
  camera.near = 1;
  camera.far = 9000;
  camera.updateProjectionMatrix();
  camera.lookAt(...shot.target);
  return null;
};

const SunLight = ({ light }: { light: ReaderLight }) => {
  const target = useMemo(() => {
    const object = new THREE.Object3D();
    object.position.set(0, BOARD.centerY, 0);
    return object;
  }, []);
  const position = KEY.clone().multiplyScalar(KEY_DISTANCE).add(target.position);
  return (
    <>
      <primitive object={target} />
      <directionalLight
        position={[position.x, position.y, position.z]}
        target={target}
        intensity={light.sun * light.exposure}
        color={light.sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-camera-near={20}
        shadow-camera-far={180}
      />
    </>
  );
};

export const ReaderStage = ({
  shot,
  fov,
  world,
  light,
  showBackdrop,
  children,
}: {
  shot: CameraShot;
  fov: number;
  world: ReaderWorld;
  light: ReaderLight;
  showBackdrop: boolean;
  children: ReactNode;
}) => {
  const { width, height } = useVideoConfig();
  const pixelRatio = useCanvasPixelRatio(2);
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows
      dpr={pixelRatio}
      gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }}
      camera={{ fov, position: shot.position }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <CameraRig shot={shot} fov={fov} />
      {showBackdrop ? <fogExp2 attach="fog" args={[world.haze, hazeDensity(world) * 1.2]} /> : null}
      <hemisphereLight
        args={[light.fillColor, world.road, light.fill * light.exposure * Math.PI]}
      />
      <SunLight light={light} />
      {children}
    </ThreeCanvas>
  );
};
