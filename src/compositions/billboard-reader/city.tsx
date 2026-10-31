import { useMemo } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { ReaderWorld } from '@/schemas';
import { seeded } from '../unveil/random';
import { ROAD, shoreHeading, shoreX } from './layout';

interface Placement {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  yaw: number;
  tint: number;
}

const TOWERS: readonly [number, number, number, number][] = [
  [120, -180, 58, 10],
  [170, -320, 44, 10],
  [140, -500, 52, 11],
  [95, -700, 40, 10],
  [220, -260, 36, 10],
];

const at = (d: number, z: number) => ({ x: shoreX(z) + d, yaw: shoreHeading(z) });

const buildCity = () => {
  const random = seeded(41);
  const houses: Placement[] = [];
  const towers: Placement[] = [];
  const trees: Placement[] = [];
  for (let z = -1500; z <= 60; z += 15) {
    for (let d = ROAD.city + 5; d <= 460; d += 15) {
      const roll = random();
      const spot = at(d + (random() - 0.5) * 6, z);
      if (roll < 0.5) {
        trees.push({
          ...spot,
          y: 0,
          z: z + random() * 8,
          width: 3 + random() * 3,
          height: 3,
          depth: 3,
          tint: random(),
        });
        continue;
      }
      const width = 6 + random() * 6;
      const depth = 6 + random() * 6;
      const height = 4 + random() * random() * 10;
      houses.push({
        ...spot,
        y: height / 2,
        z: z + (random() - 0.5) * 6,
        width,
        height,
        depth,
        tint: random(),
      });
    }
  }
  for (const [d, z, height, width] of TOWERS) {
    towers.push({
      ...at(d, z),
      y: height / 2,
      z,
      width,
      height,
      depth: width * 0.8,
      tint: random(),
    });
  }
  const palms: Placement[] = [];
  for (let z = -1500; z <= 70; z += 12 + random() * 4) {
    palms.push({
      ...at(ROAD.palms + (random() - 0.5) * 3, z),
      y: 0,
      z,
      width: 1,
      height: 7.5 + random() * 3,
      depth: 1,
      tint: random(),
    });
  }
  return { houses, towers, trees, palms };
};

const matrix = new THREE.Matrix4();
const rotation = new THREE.Quaternion();
const scale = new THREE.Vector3();
const position = new THREE.Vector3();
const up = new THREE.Vector3(0, 1, 0);

const instanced = (
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  items: readonly Placement[],
  place: (item: Placement) => [THREE.Vector3, THREE.Vector3],
  color: (item: Placement) => THREE.Color,
): THREE.InstancedMesh => {
  const mesh = new THREE.InstancedMesh(geometry, material, items.length);
  items.forEach((item, index) => {
    const [where, size] = place(item);
    rotation.setFromAxisAngle(up, item.yaw);
    matrix.compose(where, rotation, size);
    mesh.setMatrixAt(index, matrix);
    mesh.setColorAt(index, color(item));
  });
  mesh.instanceMatrix.needsUpdate = true;
  mesh.frustumCulled = false;
  return mesh;
};

const palmCrown = (): THREE.BufferGeometry => {
  const leaves: THREE.BufferGeometry[] = [];
  for (let index = 0; index < 8; index++) {
    const leaf = new THREE.ConeGeometry(0.42, 3.4, 4, 1);
    leaf.scale(1, 1, 0.25);
    leaf.translate(0, 1.7, 0);
    leaf.rotateX(1.25 + (index % 2) * 0.35);
    leaf.rotateY((index / 8) * Math.PI * 2);
    leaves.push(leaf);
  }
  return mergeGeometries(leaves) ?? new THREE.IcosahedronGeometry(1, 1);
};

const windowTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (context !== null) {
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 64, 256);
    context.fillStyle = '#9aa3ab';
    for (let floor = 0; floor < 22; floor++) {
      context.fillRect(0, 6 + floor * 11.4, 64, 6);
    }
    context.fillStyle = '#ffffff';
    for (let column = 0; column < 6; column++) {
      context.fillRect(4 + column * 10.4, 0, 2, 256);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const litWindowTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (context !== null) {
    context.fillStyle = '#000000';
    context.fillRect(0, 0, 64, 256);
    for (let floor = 0; floor < 22; floor++) {
      for (let column = 0; column < 6; column++) {
        const lit = (floor * 7 + column * 13 + floor * column) % 5;
        if (lit < 2) {
          context.fillStyle = lit === 0 ? '#ffffff' : '#9a9a9a';
          context.fillRect(6 + column * 10.4, 6 + floor * 11.4, 8.4, 6);
        }
      }
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

export const City = ({ world }: { world: ReaderWorld }) => {
  const layout = useMemo(buildCity, []);
  const meshes = useMemo(() => {
    const walls = new THREE.Color(world.walls);
    const roofs = new THREE.Color(world.roofs);
    const foliage = new THREE.Color(world.foliage);
    const white = new THREE.Color('#f4efe6');
    const wallMaterial = new THREE.MeshStandardMaterial({ roughness: 0.9 });
    const towerMaterial = new THREE.MeshStandardMaterial({
      roughness: 0.6,
      map: windowTexture(),
      emissive: new THREE.Color(world.windows),
      emissiveMap: litWindowTexture(),
    });
    const leafMaterial = new THREE.MeshStandardMaterial({ roughness: 1, flatShading: true });
    const trunkMaterial = new THREE.MeshStandardMaterial({ roughness: 1, color: '#5a4a3a' });
    const box = new THREE.BoxGeometry(1, 1, 1);
    const roof = new THREE.ConeGeometry(0.75, 1, 4, 1);
    roof.rotateY(Math.PI / 4);
    const crown = new THREE.IcosahedronGeometry(1, 1);
    const fronds = palmCrown();
    const trunk = new THREE.CylinderGeometry(0.16, 0.24, 1, 6);
    const shade = (base: THREE.Color, item: Placement, spread: number) =>
      base.clone().multiplyScalar(1 - spread / 2 + item.tint * spread);
    const pitched = layout.houses.filter((house) => house.tint > 0.35);
    return [
      instanced(
        box,
        wallMaterial,
        layout.houses,
        (h) => [position.set(h.x, h.y, h.z).clone(), scale.set(h.width, h.height, h.depth).clone()],
        (h) => shade(h.tint > 0.8 ? white : walls, h, 0.3),
      ),
      instanced(
        roof,
        wallMaterial,
        pitched,
        (h) => [
          position.set(h.x, h.height + 1.4, h.z).clone(),
          scale.set(h.width * 1.1, 2.8, h.depth * 1.1).clone(),
        ],
        (h) => shade(roofs, h, 0.4),
      ),
      instanced(
        box,
        towerMaterial,
        layout.towers,
        (t) => [position.set(t.x, t.y, t.z).clone(), scale.set(t.width, t.height, t.depth).clone()],
        (t) => shade(walls, t, 0.2),
      ),
      instanced(
        crown,
        leafMaterial,
        layout.trees,
        (t) => [
          position.set(t.x, t.width * 0.7, t.z).clone(),
          scale.set(t.width, t.width * 0.8, t.width).clone(),
        ],
        (t) => shade(foliage, t, 0.5),
      ),
      instanced(
        trunk,
        trunkMaterial,
        layout.palms,
        (p) => [position.set(p.x, p.height / 2, p.z).clone(), scale.set(1, p.height, 1).clone()],
        () => new THREE.Color('#ffffff'),
      ),
      instanced(
        fronds,
        leafMaterial,
        layout.palms,
        (p) => [position.set(p.x, p.height, p.z).clone(), scale.set(1, 1, 1).clone()],
        (p) => shade(foliage, p, 0.4),
      ),
    ];
  }, [layout, world.walls, world.roofs, world.foliage, world.windows]);
  return (
    <group>
      {meshes.map((mesh) => (
        <primitive key={mesh.uuid} object={mesh} />
      ))}
    </group>
  );
};
