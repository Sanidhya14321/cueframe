import { Environment, Lightformer, RoundedBox } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { ThreeCanvas } from '@remotion/three';
import { useMemo } from 'react';
import { useVideoConfig } from 'remotion';
import * as THREE from 'three';
import type { ProblemStrikeoutProps } from '@/schemas';
import { useCanvasPixelRatio } from '../kit/pixel-ratio';
import { useCanvasFont } from '../promo/desk/canvas-texture';
import { bodyFont, bodyFontReady } from '../promo/fonts';
import { memo } from '../promo/phone-geometry';
import { settle, smooth, tween } from '../promo/timing';
import { PIECE_BEVEL, PIECE_DEPTH, pieceGeometry } from './puzzle-geometry';

type Card = ProblemStrikeoutProps['card'];

const CAMERA_DISTANCE = 24;
const FIELD_OF_VIEW = 20;
const PIECE = 1.25;

const pixelsPerUnit = (height: number): number =>
  height / (2 * CAMERA_DISTANCE * Math.tan(THREE.MathUtils.degToRad(FIELD_OF_VIEW / 2)));

const CardCamera = () => {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  camera.position.set(0, 0, CAMERA_DISTANCE);
  camera.fov = FIELD_OF_VIEW;
  camera.near = 1;
  camera.far = 60;
  camera.updateProjectionMatrix();
  camera.lookAt(0, 0, 0);
  return null;
};

const Studio = () => (
  <Environment resolution={256} frames={1}>
    <color attach="background" args={['#b8a89a']} />
    <Lightformer form="rect" intensity={3} position={[-4, 6, 6]} scale={[8, 5, 1]} />
    <Lightformer
      form="rect"
      intensity={1.6}
      color="#ffe2c4"
      position={[6, 2, 4]}
      scale={[4, 8, 1]}
    />
    <Lightformer form="rect" intensity={0.8} position={[0, -6, 3]} scale={[10, 3, 1]} />
  </Environment>
);

const useLabel = (text: string, color: string) => {
  useCanvasFont(`700 120px "${bodyFont}"`, bodyFontReady);
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    if (context !== null) {
      context.font = `700 120px "${bodyFont}"`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = color;
      context.shadowColor = 'rgba(80,0,0,0.35)';
      context.shadowBlur = 8;
      context.fillText(text, 512, 132);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }, [text, color]);
};

const Puzzle = ({ card, frame, y }: { card: Card; frame: number; y: number }) => {
  const label = useLabel(card.solution, card.labelInk);
  const grow = tween(frame, [0, 18], [0.08, 1], settle);
  const arrive = tween(frame, [4, 24], [0, 1], settle);
  const bob = Math.sin(frame / 14) * 0.04;
  const white = pieceGeometry(PIECE, { top: 1, right: -1, bottom: 1, left: -1 });
  const red = pieceGeometry(PIECE, { top: -1, right: 1, bottom: -1, left: 1 });
  return (
    <group position={[0, y, 0]} scale={grow} rotation={[-0.62, 0.18, -0.08 * (1 - grow)]}>
      <group position={[-0.5, -0.25, 0]}>
        <mesh geometry={white} castShadow receiveShadow>
          <meshPhysicalMaterial
            color={card.pieceLight}
            roughness={0.28}
            clearcoat={0.6}
            clearcoatRoughness={0.2}
          />
        </mesh>
        <group
          position={[
            PIECE + 0.08 + 0.9 * (1 - arrive),
            0.32 + 1.1 * (1 - arrive) + bob,
            0.34 + 0.6 * (1 - arrive),
          ]}
          rotation={[0.1 + 0.5 * (1 - arrive), -0.22, 0.42 + 0.6 * (1 - arrive)]}
        >
          <mesh geometry={red} castShadow receiveShadow>
            <meshPhysicalMaterial
              color={card.pieceAccent}
              roughness={0.3}
              clearcoat={0.7}
              clearcoatRoughness={0.15}
            />
          </mesh>
          <mesh position={[0, 0, PIECE_DEPTH / 2 + PIECE_BEVEL + 0.003]} rotation={[0, 0, 0.62]}>
            <planeGeometry args={[PIECE * 1.15, PIECE * 0.29]} />
            <meshBasicMaterial map={label} transparent toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

const arrowCurve = () =>
  new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.3, -0.62, 0.45),
    new THREE.Vector3(-0.5, -0.46, 0.45),
    new THREE.Vector3(0.25, -0.12, 0.45),
    new THREE.Vector3(0.72, 0.36, 0.45),
    new THREE.Vector3(0.98, 0.86, 0.45),
  ]);

const ARROW_SEGMENTS = 120;
const ARROW_RADIAL = 16;

const Chart = ({ card, frame, y }: { card: Card; frame: number; y: number }) => {
  const curve = useMemo(arrowCurve, []);
  const tube = memo(
    'strikeout-arrow',
    () => new THREE.TubeGeometry(curve, ARROW_SEGMENTS, 0.085, ARROW_RADIAL, false),
  );
  const heights = [0.42, 0.72, 1.05, 1.5];
  const shown = tween(frame, [0, 10], [0, 1], smooth);
  const draw = tween(frame, [8, 30], [0, 1], smooth);
  const head = tween(frame, [8, 16], [0, 1], smooth);
  tube.setDrawRange(0, Math.round(draw * ARROW_SEGMENTS) * ARROW_RADIAL * 6);
  const tip = curve.getPointAt(Math.max(0.02, draw));
  const tangent = curve.getTangentAt(Math.max(0.02, draw));
  const headRotation = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    tangent,
  );
  return (
    <group position={[0, y, 0]} rotation={[-0.22, -0.32, 0]} scale={0.92 + 0.08 * shown}>
      {heights.map((height, index) => {
        const rise = tween(frame, [index * 4, index * 4 + 18], [0.02, 1], settle);
        return (
          <RoundedBox
            key={height}
            args={[0.4, height * rise, 0.4]}
            radius={0.035}
            smoothness={4}
            position={[-0.9 + index * 0.6, -1.0 + (height * rise) / 2, 0]}
            castShadow
            receiveShadow
          >
            <meshPhysicalMaterial
              color={card.bar}
              metalness={0.35}
              roughness={0.22}
              clearcoat={0.6}
              clearcoatRoughness={0.15}
              transparent
              opacity={shown}
            />
          </RoundedBox>
        );
      })}
      <mesh geometry={tube} castShadow>
        <meshPhysicalMaterial
          color={card.arrow}
          roughness={0.25}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
        />
      </mesh>
      <mesh position={tip} quaternion={headRotation} scale={head} castShadow>
        <coneGeometry args={[0.24, 0.42, 32]} />
        <meshPhysicalMaterial
          color={card.arrow}
          roughness={0.25}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </group>
  );
};

export const CardObjects = ({
  card,
  frame,
  puzzleY,
  chartY,
}: {
  card: Card;
  frame: number;
  puzzleY: number;
  chartY: number;
}) => {
  const { width, height } = useVideoConfig();
  const unit = pixelsPerUnit(height);
  const toWorld = (pixelY: number) => (height / 2 - pixelY) / unit;
  const pixelRatio = useCanvasPixelRatio(1);
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows="variance"
      dpr={pixelRatio}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <CardCamera />
      <Studio />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[-3, 6, 8]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-radius={14}
        shadow-blurSamples={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <mesh position={[0, 0, -0.6]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <shadowMaterial opacity={0.22} />
      </mesh>
      {frame >= 0 ? <Puzzle card={card} frame={frame} y={toWorld(puzzleY)} /> : null}
      {frame >= card.stagger * 3 ? (
        <Chart card={card} frame={frame - card.stagger * 3} y={toWorld(chartY)} />
      ) : null}
    </ThreeCanvas>
  );
};
