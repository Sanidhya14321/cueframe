import { useThree } from '@react-three/fiber';
import { ThreeCanvas } from '@remotion/three';
import type { ReactNode } from 'react';
import { useVideoConfig } from 'remotion';
import type * as THREE from 'three';
import { useCanvasPixelRatio } from '../kit/pixel-ratio';
import { useAnimator } from './frame-composer';

export type Vec3 = [number, number, number];

export interface TypeCamera {
  position: Vec3;
  target: Vec3;
  fov: number;
  roll?: number;
}

const aimCamera = (
  camera: THREE.PerspectiveCamera,
  { position, target, fov, roll = 0 }: TypeCamera,
) => {
  camera.position.set(...position);
  camera.fov = fov;
  camera.near = 0.5;
  camera.far = 200;
  camera.up.set(Math.sin(roll), Math.cos(roll), 0);
  camera.updateProjectionMatrix();
  camera.lookAt(...target);
};

const TypeCameraRig = (shot: TypeCamera) => {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  aimCamera(camera, shot);
  return null;
};

export const CameraShot = ({ shot }: { shot: (time: number) => TypeCamera }) => {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  useAnimator((time) => aimCamera(camera, shot(time)));
  return null;
};

export const TypeCanvas = ({
  camera,
  fov = camera?.fov ?? 30,
  children,
}: {
  camera?: TypeCamera;
  fov?: number;
  children: ReactNode;
}) => {
  const { width, height } = useVideoConfig();
  const pixelRatio = useCanvasPixelRatio(2);
  return (
    <ThreeCanvas
      width={width}
      height={height}
      dpr={pixelRatio}
      gl={{ antialias: true, alpha: true, stencil: true, preserveDrawingBuffer: true }}
      camera={{ fov, position: camera?.position ?? [0, 0, 12] }}
      style={{ position: 'absolute', inset: 0 }}
    >
      {camera === undefined ? null : <TypeCameraRig {...camera} />}
      {children}
    </ThreeCanvas>
  );
};

export const driftCamera = (
  frame: number,
  distance: number,
  fov: number,
  drift: number,
  target: Vec3 = [0, 0, 0],
): TypeCamera => {
  const x = Math.sin(frame / 96) * 0.9 * drift;
  const y = Math.cos(frame / 124) * 0.45 * drift;
  return {
    position: [target[0] + x, target[1] + y, target[2] + distance],
    target: [target[0] + x * 0.35, target[1] + y * 0.35, target[2]],
    fov,
    roll: Math.sin(frame / 150) * 0.012 * drift,
  };
};

export const viewHeight = (distance: number, fov: number): number =>
  2 * distance * Math.tan((fov * Math.PI) / 360);
