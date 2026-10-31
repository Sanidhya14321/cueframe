import { useMemo } from 'react';
import * as THREE from 'three';
import { memo } from './phone-geometry';
import { useTexture } from './use-texture';

const FRONT = 40;
const WALL = 70;
const HALF_WIDTH = 90;
const ARC_STEPS = 24;

const profile = (depth: number, curve: number): [number, number][] => {
  const points: [number, number][] = [
    [FRONT, 0],
    [-depth, 0],
  ];
  for (let step = 1; step <= ARC_STEPS; step++) {
    const angle = (step / ARC_STEPS) * (Math.PI / 2);
    points.push([-depth - Math.sin(angle) * curve, curve - Math.cos(angle) * curve]);
  }
  points.push([-depth - curve, WALL]);
  return points;
};

const sweepGeometry = (depth: number, curve: number): THREE.BufferGeometry =>
  memo(`sweep:${depth}:${curve}`, () => {
    const points = profile(depth, curve);
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    let travelled = 0;
    points.forEach(([z, y], index) => {
      const previous = points[index - 1];
      if (previous !== undefined) {
        travelled += Math.hypot(z - previous[0], y - previous[1]);
      }
      for (const side of [-1, 1]) {
        positions.push(side * HALF_WIDTH, y, z);
        uvs.push((side * HALF_WIDTH) / 10, travelled / 10);
      }
      if (index > 0) {
        const base = (index - 1) * 2;
        indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
      }
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  });

export interface SweepProps {
  color: string;
  texture: string;
  textureRepeat: number;
  roughness: number;
  curve: number;
  depth: number;
}

const TexturedMaterial = ({
  url,
  repeat,
  color,
  roughness,
}: {
  url: string;
  repeat: number;
  color: string;
  roughness: number;
}) => {
  const base = useTexture(url);
  const map = useMemo(() => {
    const tiled = base.clone();
    tiled.wrapS = THREE.RepeatWrapping;
    tiled.wrapT = THREE.RepeatWrapping;
    tiled.repeat.set(repeat / 18, repeat / 18);
    tiled.needsUpdate = true;
    return tiled;
  }, [base, repeat]);
  return <meshStandardMaterial map={map} color={color} roughness={roughness} metalness={0} />;
};

export const Sweep = ({ color, texture, textureRepeat, roughness, curve, depth }: SweepProps) => (
  <mesh geometry={sweepGeometry(depth, curve)}>
    {texture === '' ? (
      <meshStandardMaterial color={color} roughness={roughness} metalness={0} />
    ) : (
      <TexturedMaterial url={texture} repeat={textureRepeat} color={color} roughness={roughness} />
    )}
  </mesh>
);

const CATCHER_SIZE = 70;
const CATCHER_LIFT = 0.001;

export const ShadowCatcher = ({ opacity, dark }: { opacity: number; dark: boolean }) => (
  <mesh position={[0, CATCHER_LIFT, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
    <planeGeometry args={[CATCHER_SIZE, CATCHER_SIZE]} />
    <shadowMaterial transparent opacity={opacity} color={dark ? '#000000' : '#15151a'} />
  </mesh>
);
