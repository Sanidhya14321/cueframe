import { useMemo } from 'react';
import * as THREE from 'three';
import type { ArmStyle } from '@/schemas';
import { memo } from '../phone-geometry';

export interface ArmLook {
  style: ArmStyle;
  sleeveColor: string;
  length: number;
  looseness: number;
  knit: number;
  band: boolean;
  bandColor: string;
  bandMetal?: number;
}

const RINGS = 40;
const SEGMENTS = 56;

interface TubeShape {
  start: number;
  length: number;
  near: [number, number];
  far: [number, number];
  folds: number;
  cuff: number;
}

const tube = (shape: TubeShape) =>
  memo(`sleeve:${JSON.stringify(shape)}`, () => {
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    for (let ring = 0; ring <= RINGS; ring++) {
      const t = ring / RINGS;
      const z = shape.start + t * shape.length;
      const rx = shape.near[0] + (shape.far[0] - shape.near[0]) * t;
      const ry = shape.near[1] + (shape.far[1] - shape.near[1]) * t;
      const cuffBand = shape.cuff * Math.exp(-((t * shape.length - 0.03) ** 2) / 0.0004);
      for (let segment = 0; segment <= SEGMENTS; segment++) {
        const angle = (segment / SEGMENTS) * Math.PI * 2;
        const fold =
          1 +
          shape.folds *
            (Math.sin(angle * 3 + t * 9) * 0.5 + Math.sin(angle * 5 - t * 14 + 1.3) * 0.3) *
            Math.min(1, t * 6) +
          cuffBand;
        positions.push(Math.cos(angle) * rx * fold, Math.sin(angle) * ry * fold, z);
        uvs.push(segment / SEGMENTS, t);
      }
    }
    for (let ring = 0; ring < RINGS; ring++) {
      for (let segment = 0; segment < SEGMENTS; segment++) {
        const a = ring * (SEGMENTS + 1) + segment;
        const b = a + SEGMENTS + 1;
        indices.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  });

const knitTexture = (() => {
  let texture: THREE.CanvasTexture | undefined;
  return () => {
    if (texture !== undefined) {
      return texture;
    }
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    if (context !== null) {
      context.fillStyle = '#808080';
      context.fillRect(0, 0, 256, 256);
      for (let column = 0; column < 16; column++) {
        for (let row = 0; row < 32; row++) {
          const x = column * 16 + 8;
          const y = row * 8;
          const gradient = context.createLinearGradient(x - 8, 0, x + 8, 0);
          gradient.addColorStop(0, '#5a5a5a');
          gradient.addColorStop(0.5, '#c8c8c8');
          gradient.addColorStop(1, '#5a5a5a');
          context.fillStyle = gradient;
          context.beginPath();
          context.ellipse(x - 3, y + 4, 5, 4.5, 0.5, 0, Math.PI * 2);
          context.ellipse(x + 3, y + 4, 5, 4.5, -0.5, 0, Math.PI * 2);
          context.fill();
        }
      }
    }
    texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 22);
    texture.anisotropy = 8;
    return texture;
  };
})();

const BARE_NEAR: [number, number] = [0.0262, 0.0194];
const BARE_FAR: [number, number] = [0.043, 0.038];
const BAND_START = -0.018;
const BAND_LENGTH = 0.032;

const bandMaterials = new Map<string, THREE.MeshPhysicalMaterial>();

const bandMaterial = (color: string, metal = 0) => {
  const key = `${color}:${metal}`;
  const hit = bandMaterials.get(key);
  if (hit !== undefined) {
    return hit;
  }
  const material = new THREE.MeshPhysicalMaterial({
    color,
    metalness: metal,
    roughness: 0.55 - metal * 0.3,
    sheen: 0.6 * (1 - metal),
    sheenRoughness: 0.5,
    clearcoat: 0.2,
    clearcoatRoughness: 0.5,
    side: THREE.DoubleSide,
  });
  bandMaterials.set(key, material);
  return material;
};

const widen = ([x, y]: [number, number], amount: number, along: number): [number, number] => [
  x + (BARE_FAR[0] - BARE_NEAR[0]) * along + amount,
  y + (BARE_FAR[1] - BARE_NEAR[1]) * along + amount,
];

const FORWARD = new THREE.Vector3(0, 0, 1);

export const forearmAim = (wrist: THREE.Matrix4, elbow: THREE.Vector3): THREE.Matrix4 => {
  const local = elbow.clone().applyMatrix4(wrist.clone().invert());
  if (local.lengthSq() < 1e-12) {
    return new THREE.Matrix4();
  }
  return new THREE.Matrix4().makeRotationFromQuaternion(
    new THREE.Quaternion().setFromUnitVectors(FORWARD, local.normalize()),
  );
};

export const Arm = ({
  look,
  skin,
  forearm,
}: {
  look: ArmLook;
  skin: THREE.Material;
  forearm: THREE.Matrix4;
}) => {
  const fabric = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: look.sleeveColor,
        roughness: 0.92,
        sheen: 1,
        sheenRoughness: 0.7,
        sheenColor: new THREE.Color(look.sleeveColor).lerp(new THREE.Color('#ffffff'), 0.35),
        bumpMap: knitTexture(),
        bumpScale: look.knit,
        side: THREE.DoubleSide,
      }),
    [look.sleeveColor, look.knit],
  );
  const bandAt = BAND_START / look.length;
  const bandEnd = (BAND_START + BAND_LENGTH) / look.length;
  return (
    <group position={[0.001, 0, 0]}>
      <group matrixAutoUpdate={false} matrix={forearm}>
        <mesh
          geometry={tube({
            start: 0.006,
            length: look.length,
            near: BARE_NEAR,
            far: BARE_FAR,
            folds: 0,
            cuff: 0,
          })}
          material={skin}
          castShadow
          receiveShadow
        />
        {look.style === 'sleeve' ? (
          <mesh
            geometry={tube({
              start: 0.05,
              length: look.length,
              near: widen(BARE_NEAR, 0.004 + look.looseness * 0.008, 0.15),
              far: widen(BARE_FAR, 0.01 + look.looseness * 0.016, 1),
              folds: 0.035 * (0.5 + look.looseness),
              cuff: 0.06,
            })}
            material={fabric}
            castShadow
            receiveShadow
          />
        ) : null}
      </group>
      {look.band ? (
        <mesh
          geometry={tube({
            start: BAND_START,
            length: BAND_LENGTH,
            near: widen(BARE_NEAR, 0.0026, bandAt),
            far: widen(BARE_NEAR, 0.0022, bandEnd),
            folds: 0,
            cuff: 0,
          })}
          material={bandMaterial(look.bandColor, look.bandMetal)}
          castShadow
          receiveShadow
        />
      ) : null}
    </group>
  );
};
