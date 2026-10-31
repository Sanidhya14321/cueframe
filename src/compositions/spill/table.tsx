import { useMemo } from 'react';
import * as THREE from 'three';
import type { SpillRevealProps } from '@/schemas';
import { tiledFbm, tiledNoise } from './field';

const WOOD_SIZE = 1024;
const WOOD_REPEAT = 2;
const TABLE_DEPTH = 0.32;
const DRAWER_DEPTH = 1.1;
const TABLE_HALF_WIDTH = 9;
const GRAIN_ANGLE = 1.12;

type TableLook = SpillRevealProps['table'];

const mixColor = (from: THREE.Color, to: THREE.Color, amount: number): THREE.Color =>
  from.clone().lerp(to, Math.max(0, Math.min(1, amount)));

const paintWood = (look: TableLook): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = WOOD_SIZE;
  canvas.height = WOOD_SIZE;
  const context = canvas.getContext('2d');
  if (context === null) {
    return canvas;
  }
  const image = context.createImageData(WOOD_SIZE, WOOD_SIZE);
  const wood = new THREE.Color(look.wood);
  const grain = new THREE.Color(look.grain);
  const highlight = new THREE.Color(look.highlight);
  for (let row = 0; row < WOOD_SIZE; row++) {
    for (let column = 0; column < WOOD_SIZE; column++) {
      const u = column / WOOD_SIZE;
      const v = row / WOOD_SIZE;
      const line = v + (tiledFbm(u, v, 2, 3, 3) - 0.5) * 0.035;
      const figure = tiledFbm(u, line, 2, 40, 9);
      const streak = tiledFbm(u, line, 8, 320, 21);
      const fine = tiledNoise(u * 60, line * 1400, 60, 1400, 5);
      const darkness =
        THREE.MathUtils.smoothstep(figure, 0.5, 0.75) * 0.25 +
        (streak - 0.5) * 0.9 +
        THREE.MathUtils.smoothstep(fine, 0.7, 0.95) * 0.3;
      const lightness = THREE.MathUtils.smoothstep(0.45 - figure, 0, 0.2) * 0.2;
      const color = mixColor(mixColor(wood, grain, darkness), highlight, lightness);
      const index = (row * WOOD_SIZE + column) * 4;
      image.data[index] = Math.round(color.r * 255);
      image.data[index + 1] = Math.round(color.g * 255);
      image.data[index + 2] = Math.round(color.b * 255);
      image.data[index + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  return canvas;
};

const woodTextures = new Map<string, THREE.CanvasTexture>();

const woodTexture = (look: TableLook): THREE.CanvasTexture => {
  const key = `${look.wood}:${look.grain}:${look.highlight}`;
  const cached = woodTextures.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const texture = new THREE.CanvasTexture(paintWood(look));
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16;
  woodTextures.set(key, texture);
  return texture;
};

const repeated = (base: THREE.CanvasTexture, repeatX: number, repeatY: number, rotation = 0) => {
  const texture = base.clone();
  texture.repeat.set(repeatX, repeatY);
  texture.center.set(0.5, 0.5);
  texture.rotation = rotation;
  texture.needsUpdate = true;
  return texture;
};

export const SpillTable = ({ look }: { look: TableLook }) => {
  const base = woodTexture(look);
  const width = TABLE_HALF_WIDTH * 2;
  const span = WOOD_REPEAT / look.grainScale;
  const top = useMemo(
    () => repeated(base, width / span, width / span, GRAIN_ANGLE),
    [base, width, span],
  );
  const front = useMemo(() => repeated(base, width / span / 2, 0.06, 0), [base, width, span]);
  const drawer = useMemo(() => repeated(base, width / span / 2, 0.3, 0.01), [base, width, span]);
  return (
    <group>
      <mesh
        position={[0, 0, look.edgeZ - TABLE_HALF_WIDTH]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, width]} />
        <meshPhysicalMaterial
          map={top}
          bumpMap={top}
          bumpScale={0.6}
          roughness={0.55 - look.gloss * 0.3}
          clearcoat={look.gloss}
          clearcoatRoughness={0.28}
        />
      </mesh>
      <mesh position={[0, -TABLE_DEPTH / 2, look.edgeZ]} receiveShadow>
        <boxGeometry args={[width, TABLE_DEPTH, 0.02]} />
        <meshPhysicalMaterial map={front} roughness={0.5} clearcoat={look.gloss * 0.6} />
      </mesh>
      <mesh
        position={[0, -TABLE_DEPTH - DRAWER_DEPTH / 2 - 0.02, look.edgeZ - 0.05]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[width, DRAWER_DEPTH, 0.02]} />
        <meshPhysicalMaterial
          map={drawer}
          color="#d9c3ad"
          roughness={0.5}
          clearcoat={look.gloss * 0.5}
        />
      </mesh>
      <DrawerHandle x={-1.2} y={-TABLE_DEPTH - 0.32} z={look.edgeZ - 0.04} />
      <mesh position={[0, -6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#8a6a50" roughness={0.8} />
      </mesh>
      <mesh position={[0, 6, -8]} receiveShadow>
        <planeGeometry args={[60, 24]} />
        <meshStandardMaterial color={look.wall} roughness={0.95} />
      </mesh>
      <mesh position={[2.5, 4, -7.95]}>
        <planeGeometry args={[10, 5]} />
        <meshBasicMaterial
          color="#f4f8f0"
          toneMapped={false}
          transparent
          opacity={0.45 * look.window}
        />
      </mesh>
    </group>
  );
};

const chrome = new THREE.MeshPhysicalMaterial({
  color: '#d9dcdf',
  metalness: 1,
  roughness: 0.16,
  clearcoat: 0.4,
  clearcoatRoughness: 0.2,
});

const DrawerHandle = ({ x, y, z }: { x: number; y: number; z: number }) => (
  <group position={[x, y, z]}>
    <mesh material={chrome} rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0.16]} castShadow>
      <capsuleGeometry args={[0.035, 1.1, 8, 24]} />
    </mesh>
    {[-0.5, 0.5].map((offset) => (
      <mesh
        key={offset}
        material={chrome}
        rotation={[Math.PI / 2, 0, 0]}
        position={[offset, 0, 0.08]}
        castShadow
      >
        <cylinderGeometry args={[0.03, 0.04, 0.16, 20]} />
      </mesh>
    ))}
  </group>
);
