import { useMemo } from 'react';
import * as THREE from 'three';

const COLUMNS = 10;
const ROWS = 18;
const DRAPE = 0.5;

const capePoint = (across: number, down: number, frame: number, sway: number): THREE.Vector3 => {
  const width = 0.16 + down * 0.17;
  let y: number;
  let z: number;
  if (down < DRAPE) {
    const t = down / DRAPE;
    y = 0.57 - t * 0.5;
    z = -0.12 - t * 0.1 - Math.sin(Math.PI * t) * 0.05;
  } else {
    const t = (down - DRAPE) / (1 - DRAPE);
    const fold = Math.sin(Math.min(1, t * 2.2) * Math.PI * 0.5);
    y = 0.07 - t * 0.42;
    z = -0.22 - fold * 0.12;
  }
  const flutter = sway * down;
  const x = across * width + Math.sin(frame / 31 + down * 2.4 + across) * 0.018 * flutter;
  const ripple = Math.sin(across * 5 + down * 3) * 0.012 * down;
  const lift = (Math.sin(frame / 23 + down * 3 + across * 1.7) * 0.5 + 0.5) * 0.02 * flutter;
  return new THREE.Vector3(x, y, z - ripple - lift);
};

export const Cape = ({ color, sway, frame }: { color: string; sway: number; frame: number }) => {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.72,
        side: THREE.DoubleSide,
      }),
    [color],
  );
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const indices: number[] = [];
    for (let row = 0; row <= ROWS; row++) {
      for (let column = 0; column <= COLUMNS; column++) {
        const point = capePoint((column / COLUMNS) * 2 - 1, row / ROWS, frame, sway);
        positions.push(point.x, point.y, point.z);
      }
    }
    for (let row = 0; row < ROWS; row++) {
      for (let column = 0; column < COLUMNS; column++) {
        const a = row * (COLUMNS + 1) + column;
        const b = a + COLUMNS + 1;
        indices.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
    const shape = new THREE.BufferGeometry();
    shape.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    shape.setIndex(indices);
    shape.computeVertexNormals();
    return shape;
  }, [frame, sway]);
  return <mesh geometry={geometry} material={material} castShadow receiveShadow />;
};
