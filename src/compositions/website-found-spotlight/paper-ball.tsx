import { useMemo } from 'react';
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { seeded } from '../unveil/random';

interface Fold {
  center: THREE.Vector3;
  normal: THREE.Vector3;
  reach: number;
  width: number;
  depth: number;
}

const ballGeometries = new Map<string, THREE.BufferGeometry>();

const randomDirection = (random: () => number): THREE.Vector3 =>
  new THREE.Vector3(random() - 0.5, random() - 0.5, random() - 0.5).normalize();

const foldsFor = (random: () => number, count: number): Fold[] =>
  Array.from({ length: count }, () => {
    const center = randomDirection(random);
    const normal = randomDirection(random).cross(center).normalize();
    return {
      center,
      normal,
      reach: 0.35 + random() * 0.5,
      width: 0.06 + random() * 0.14,
      depth: (0.05 + random() * 0.08) * (random() < 0.55 ? 1 : -1),
    };
  });

const foldAt = (fold: Fold, point: THREE.Vector3): number => {
  const across = Math.abs(point.dot(fold.normal));
  if (across >= fold.width) {
    return 0;
  }
  const spread = point.distanceToSquared(fold.center) / (fold.reach * fold.reach);
  return fold.depth * (1 - across / fold.width) * Math.exp(-spread);
};

const buildBall = (seed: number, crumple: number, facets: number): THREE.BufferGeometry => {
  const random = seeded(seed * 4093 + 17);
  const raw = new THREE.IcosahedronGeometry(1, facets * 7);
  raw.deleteAttribute('normal');
  raw.deleteAttribute('uv');
  const geometry = mergeVertices(raw);
  const folds = foldsFor(random, 80);
  const squash = new THREE.Vector3(
    0.94 + random() * 0.1,
    0.9 + random() * 0.08,
    0.94 + random() * 0.1,
  );
  const position = geometry.getAttribute('position');
  const point = new THREE.Vector3();
  for (let index = 0; index < position.count; index++) {
    point.fromBufferAttribute(position, index);
    let radius = 1;
    for (const fold of folds) {
      radius += foldAt(fold, point) * crumple;
    }
    point.multiplyScalar(radius).multiply(squash);
    position.setXYZ(index, point.x, point.y, point.z);
  }
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
};

const ballGeometry = (seed: number, crumple: number, facets: number): THREE.BufferGeometry => {
  const key = `${seed}:${crumple}:${facets}`;
  const hit = ballGeometries.get(key);
  if (hit !== undefined) {
    return hit;
  }
  const geometry = buildBall(seed, crumple, facets);
  ballGeometries.set(key, geometry);
  return geometry;
};

export interface PaperBallProps {
  x: number;
  z: number;
  radius: number;
  seed: number;
  spin: number;
  color: string;
  crumple: number;
  facets: number;
  roughness: number;
}

export const PaperBall = ({
  x,
  z,
  radius,
  seed,
  spin,
  color,
  crumple,
  facets,
  roughness,
}: PaperBallProps) => {
  const geometry = ballGeometry(seed, crumple, facets);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness,
        metalness: 0,
      }),
    [color, roughness],
  );
  return (
    <mesh
      geometry={geometry}
      material={material}
      position={[x, radius * 0.9, z]}
      rotation={[spin * 0.7, spin, spin * 0.4]}
      scale={radius}
      castShadow
      receiveShadow
    />
  );
};
