import { useThree } from '@react-three/fiber';
import { ThreeCanvas } from '@remotion/three';
import { useMemo } from 'react';
import { useVideoConfig } from 'remotion';
import * as THREE from 'three';
import type { WebsiteFoundSpotlightProps } from '@/schemas';
import { useCanvasPixelRatio } from '../kit/pixel-ratio';
import { DeskLamp } from './desk-lamp';
import type { LightCue } from './light-cues';
import { PaperBall } from './paper-ball';

type Camera = WebsiteFoundSpotlightProps['camera'];

const SCATTER: readonly [number, number, number][] = [
  [-0.66, 2.36, 0.119],
  [-0.2, 2.9, 0.122],
  [-0.62, 3.33, 0.118],
  [0.97, 2.47, 0.125],
  [0.8, 3.78, 0.125],
  [-0.24, 4.04, 0.124],
  [0.38, 4.23, 0.128],
  [-0.47, 4.49, 0.128],
  [0.59, 4.72, 0.123],
];

const SCATTER_CENTER = new THREE.Vector2(0.12, 3.6);

const cameraEye = (camera: Camera, frame: number): THREE.Vector3 =>
  new THREE.Vector3(
    frame * 0.0026 * camera.drift,
    camera.height - frame * 0.0008 * camera.drift,
    camera.distance - frame * 0.0014 * camera.drift,
  );

const CameraRig = ({ camera, eye }: { camera: Camera; eye: THREE.Vector3 }) => {
  const three = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  three.position.copy(eye);
  three.fov = camera.fieldOfView;
  three.near = 1;
  three.far = 60;
  three.updateProjectionMatrix();
  three.lookAt(0, 0, camera.targetZ);
  return null;
};

const Floor = ({ color, solid }: { color: string; solid: boolean }) => {
  const material = useMemo(
    () =>
      solid
        ? new THREE.MeshStandardMaterial({ color, roughness: 0.92, metalness: 0 })
        : new THREE.ShadowMaterial({ opacity: 0.45 }),
    [color, solid],
  );
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} material={material} receiveShadow>
      <planeGeometry args={[60, 60]} />
    </mesh>
  );
};

export const SpotlightStage = ({
  props,
  frame,
  cue,
}: {
  props: WebsiteFoundSpotlightProps;
  frame: number;
  cue: LightCue;
}) => {
  const { camera, palette, paper, lamp, look } = props;
  const { width, height } = useVideoConfig();
  const pixelRatio = useCanvasPixelRatio(2);
  const eye = cameraEye(camera, frame);
  const fogNear = camera.distance * (1.6 - camera.fog);
  const fogFar = fogNear + 4 + 22 * (1 - camera.fog);
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows
      dpr={pixelRatio}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      camera={{ fov: camera.fieldOfView, position: [eye.x, eye.y, eye.z] }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <CameraRig camera={camera} eye={eye} />
      {look.showBackdrop ? <fog attach="fog" args={[palette.sky, fogNear, fogFar]} /> : null}
      <ambientLight color={palette.lamp} intensity={camera.ambient} />
      <directionalLight
        position={[-4, 7, 2.5]}
        color={camera.fillColor}
        intensity={camera.fill}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-radius={8}
        shadow-bias={-0.0005}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-camera-near={1}
        shadow-camera-far={20}
      />
      <Floor color={palette.floor} solid={look.showBackdrop} />
      {SCATTER.map(([x, z, radius], index) => (
        <PaperBall
          key={`${x}:${z}`}
          x={SCATTER_CENTER.x + (x - SCATTER_CENTER.x) * paper.spread}
          z={SCATTER_CENTER.y + (z - SCATTER_CENTER.y) * paper.spread}
          radius={radius * paper.size}
          seed={paper.seed + index * 13}
          spin={index * 1.7}
          color={palette.paper}
          crumple={paper.crumple}
          facets={paper.facets}
          roughness={paper.roughness}
        />
      ))}
      <PaperBall
        x={paper.heroX}
        z={paper.heroZ}
        radius={0.133 * paper.size}
        seed={paper.seed + 500}
        spin={0.6}
        color={palette.heroPaper}
        crumple={paper.crumple}
        facets={paper.facets}
        roughness={paper.roughness}
      />
      <pointLight
        position={[paper.heroX, 0.32, paper.heroZ + 0.15]}
        color={palette.glow}
        intensity={lamp.floorGlow * cue.level}
        distance={0}
        decay={2}
      />
      <DeskLamp lamp={lamp} palette={palette} level={cue.level} question={cue.question} eye={eye} />
    </ThreeCanvas>
  );
};
