import { Environment, Lightformer } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { ThreeCanvas } from '@remotion/three';
import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type * as THREE from 'three';
import { DoubleSide } from 'three';
import type { PromoCardId, PromoStage } from '@/schemas';
import { useCanvasPixelRatio } from '../kit/pixel-ratio';
import { cardUrl } from './screen-assets';
import { useTexture } from './use-texture';

export type Vec3 = [number, number, number];

const CameraRig = ({
  position,
  target,
  fov,
  far,
}: {
  position: Vec3;
  target: Vec3;
  fov: number;
  far: number;
}) => {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  camera.position.set(...position);
  camera.fov = fov;
  camera.near = 1;
  camera.far = far;
  camera.updateProjectionMatrix();
  camera.lookAt(...target);
  return null;
};

const Studio = ({ reflections, dark }: { reflections: number; dark: boolean }) => (
  <Environment resolution={512} frames={1}>
    <color attach="background" args={[dark ? '#1f1f24' : '#6c6c73']} />
    <Lightformer
      form="rect"
      intensity={1.1 * reflections}
      position={[-3.5, 3, 7]}
      rotation={[-0.35, -0.45, 0]}
      scale={[7, 9, 1]}
    />
    <Lightformer
      form="rect"
      intensity={3.2 * reflections}
      position={[0, 7, 3]}
      rotation={[Math.PI / 2.2, 0, 0]}
      scale={[16, 3, 1]}
    />
    <Lightformer
      form="rect"
      intensity={2.6 * reflections}
      position={[-7, 0.5, 2]}
      rotation={[0, Math.PI / 2.3, 0]}
      scale={[1.2, 12, 1]}
    />
    <Lightformer
      form="rect"
      intensity={2.2 * reflections}
      position={[7, 0.5, 2]}
      rotation={[0, -Math.PI / 2.3, 0]}
      scale={[1.2, 12, 1]}
    />
    <Lightformer
      form="rect"
      intensity={1.4 * reflections}
      position={[0, 0, -9]}
      rotation={[0, Math.PI, 0]}
      scale={[12, 8, 1]}
    />
    <Lightformer
      form="rect"
      intensity={(dark ? 0.2 : 0.7) * reflections}
      position={[0, -7, 2]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[16, 4, 1]}
    />
    <Lightformer form="circle" intensity={1.6 * reflections} position={[3, 3, 9]} scale={2.4} />
  </Environment>
);

interface CameraFraming {
  target?: Vec3;
  cameraOffset?: Vec3;
  distanceScale?: number;
}

const stageCamera = (
  stage: PromoStage,
  frame: number,
  { target = [0, 0, 0], cameraOffset = [0, 0, 0], distanceScale = 1 }: CameraFraming,
): { position: Vec3; aim: Vec3 } => {
  const driftX = Math.sin(frame / 110) * 0.6 * stage.cameraDrift;
  const driftY = Math.cos(frame / 140) * 0.3 * stage.cameraDrift;
  return {
    position: [
      cameraOffset[0] + driftX,
      cameraOffset[1] + driftY,
      stage.cameraDistance * distanceScale + cameraOffset[2],
    ],
    aim: [target[0] + driftX * 0.4, target[1] + driftY * 0.4, target[2]],
  };
};

export const offscreenDrop = (stage: PromoStage, scale: number, distanceScale = 1): number =>
  Math.tan((stage.fieldOfView * Math.PI) / 360) * stage.cameraDistance * distanceScale +
  1.8 * scale +
  0.6;

export interface StageProps {
  stage: PromoStage;
  dark?: boolean;
  target?: Vec3;
  cameraOffset?: Vec3;
  distanceScale?: number;
  backdropZ?: number;
  keyPosition?: Vec3;
  shadowExtent?: number;
  far?: number;
  children: ReactNode;
}

export const Stage = ({
  stage,
  dark = false,
  target = [0, 0, 0],
  cameraOffset = [0, 0, 0],
  distanceScale = 1,
  backdropZ = -1.8,
  keyPosition = [-2.5, 4, 12],
  shadowExtent = 1,
  far = 120,
  children,
}: StageProps) => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  const { position, aim } = stageCamera(stage, frame, { target, cameraOffset, distanceScale });
  const pixelRatio = useCanvasPixelRatio(2);
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows="variance"
      dpr={pixelRatio}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      camera={{ fov: stage.fieldOfView, position }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <CameraRig position={position} target={aim} fov={stage.fieldOfView} far={far} />
      <ambientLight intensity={dark ? 0.25 : 0.55} />
      <directionalLight
        position={keyPosition}
        intensity={stage.keyLight}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-radius={stage.shadowSoftness}
        shadow-blurSamples={24}
        shadow-bias={-0.0004}
        shadow-camera-left={-16 * shadowExtent}
        shadow-camera-right={16 * shadowExtent}
        shadow-camera-top={11 * shadowExtent}
        shadow-camera-bottom={-11 * shadowExtent}
        shadow-camera-near={1}
        shadow-camera-far={40 * shadowExtent}
      />
      <directionalLight position={[5, 2, -6]} intensity={dark ? 1.6 : 0.8} color="#ffffff" />
      <Studio reflections={stage.reflections} dark={dark} />
      <mesh position={[0, 0, backdropZ]} receiveShadow>
        <planeGeometry args={[160, 100]} />
        <shadowMaterial transparent opacity={stage.shadow} color={dark ? '#000000' : '#15151a'} />
      </mesh>
      {children}
    </ThreeCanvas>
  );
};

export const FloatingCard = ({
  card,
  width = 2.2,
  opacity = 1,
}: {
  card: PromoCardId;
  width?: number;
  opacity?: number;
}) => {
  const map = useTexture(cardUrl(card));
  return (
    <mesh>
      <planeGeometry args={[width, width * (340 / 720)]} />
      <meshBasicMaterial
        map={map}
        transparent
        opacity={opacity}
        toneMapped={false}
        depthWrite={false}
        side={DoubleSide}
      />
    </mesh>
  );
};
