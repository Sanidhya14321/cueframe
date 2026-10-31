import { useMemo } from 'react';
import * as THREE from 'three';
import type { ReaderTiming } from '@/schemas';
import { smooth } from '../promo/timing';
import { BOARD, BOARD_BOTTOM, BOARD_TOP } from './layout';

export const TOP_LAMPS = [-5.4, -2.3, 6.6] as const;
export const WALK_LAMPS = [-5.6, -1.9, 1.9, 5.6] as const;

const SWITCH_ORDER: number[] = [...TOP_LAMPS, ...WALK_LAMPS].sort((a, b) => a - b);

const POOL_WIDTH = 4.6;
const POOL_STRETCH = 2.6;
const TOP_POOL_HEIGHT = 6.2;
const WALK_POOL_HEIGHT = 4.6;

export const lampLevel = (frame: number, timing: ReaderTiming, x: number): number => {
  const order = SWITCH_ORDER.indexOf(x);
  const start = timing.lampsStart + Math.max(0, order) * timing.lampsStagger;
  const t = Math.min(1, Math.max(0, (frame - start) / Math.max(1, timing.lampsFrames)));
  return smooth(t);
};

const poolTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (context !== null) {
    context.scale(1, POOL_STRETCH);
    const gradient = context.createRadialGradient(128, 0, 0, 128, 0, 126);
    gradient.addColorStop(0, 'rgba(255,255,255,0.85)');
    gradient.addColorStop(0.3, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(0.65, 'rgba(255,255,255,0.14)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 512 / POOL_STRETCH);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const usePoolMaterial = (color: string, level: number, glow: number): THREE.MeshBasicMaterial => {
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: poolTexture(),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
        fog: false,
      }),
    [],
  );
  material.color.set(color);
  material.opacity = Math.min(1, level * glow * 0.6);
  return material;
};

export const LightPool = ({
  x,
  fromTop,
  color,
  level,
  glow,
}: {
  x: number;
  fromTop: boolean;
  color: string;
  level: number;
  glow: number;
}) => {
  const material = usePoolMaterial(color, level, glow);
  const height = fromTop ? TOP_POOL_HEIGHT : WALK_POOL_HEIGHT;
  const y = fromTop ? BOARD_TOP - height / 2 : BOARD_BOTTOM + height / 2;
  const edge = BOARD.width / 2 - POOL_WIDTH / 2;
  return (
    <mesh
      position={[Math.min(edge, Math.max(-edge, x)), y, 0.03]}
      rotation={[0, 0, fromTop ? 0 : Math.PI]}
      material={material}
      renderOrder={2}
      visible={level > 0}
    >
      <planeGeometry args={[POOL_WIDTH, height]} />
    </mesh>
  );
};

export const LampLens = ({
  y,
  color,
  level,
  glow,
}: {
  y: number;
  color: string;
  level: number;
  glow: number;
}) => (
  <mesh position={[0, y, 0]}>
    <boxGeometry args={[0.62, 0.02, 0.32]} />
    <meshStandardMaterial
      color="#15161d"
      emissive={color}
      emissiveIntensity={level * glow * 1.6}
      roughness={0.5}
    />
  </mesh>
);
