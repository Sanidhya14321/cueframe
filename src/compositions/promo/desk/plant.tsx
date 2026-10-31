import { useMemo } from 'react';
import * as THREE from 'three';
import { memo } from '../phone-geometry';

export interface PlantLook {
  leaf: string;
  variegation: string;
  pot: string;
}

const LEAVES = 13;

const seeded = (index: number, salt: number): number => {
  const value = Math.sin(index * 91.7 + salt * 47.3) * 43758.5453;
  return value - Math.floor(value);
};

const leafGeometry = (length: number, width: number, droop: number) =>
  memo(`leaf:${length}:${width}:${droop}`, () => {
    const rows = 18;
    const columns = 8;
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    for (let row = 0; row <= rows; row++) {
      const t = row / rows;
      const half = width * Math.sin(Math.PI * t ** 0.8) ** 0.9 * (1 - t * 0.25) * 0.5;
      const y = t * length * Math.cos(droop * t);
      const z = -length * Math.sin(droop * t) * t;
      for (let column = 0; column <= columns; column++) {
        const s = column / columns - 0.5;
        const x = s * 2 * half;
        positions.push(x, y, z + Math.abs(s) * half * 0.35);
        uvs.push(column / columns, t);
      }
    }
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const a = row * (columns + 1) + column;
        const b = a + columns + 1;
        indices.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  });

const leafTexture = (look: PlantLook): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (context !== null) {
    context.fillStyle = look.leaf;
    context.fillRect(0, 0, 256, 512);
    for (let spot = 0; spot < 420; spot++) {
      const x = seeded(spot, 1) * 256;
      const y = seeded(spot, 2) * 512;
      const fromRib = Math.abs(x - 128) / 128;
      context.globalAlpha = 0.25 + (1 - fromRib) * 0.55 * seeded(spot, 3);
      context.fillStyle = look.variegation;
      context.beginPath();
      context.ellipse(x, y, 3 + seeded(spot, 4) * 9, 2 + seeded(spot, 5) * 5, 0.6, 0, Math.PI * 2);
      context.fill();
    }
    context.globalAlpha = 0.8;
    context.strokeStyle = look.variegation;
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(128, 0);
    context.lineTo(128, 512);
    context.stroke();
    context.globalAlpha = 1;
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const POT_PROFILE = [
  [0, 0],
  [0.36, 0],
  [0.4, 0.04],
  [0.44, 0.7],
  [0.47, 0.74],
  [0.43, 0.74],
  [0.41, 0.66],
  [0, 0.66],
].map(([x, y]) => new THREE.Vector2(x ?? 0, y ?? 0));

export const Plant = ({ look, frame }: { look: PlantLook; frame: number }) => {
  const texture = useMemo(
    () => leafTexture({ leaf: look.leaf, variegation: look.variegation, pot: look.pot }),
    [look.leaf, look.variegation, look.pot],
  );
  const leafMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: texture,
        roughness: 0.45,
        clearcoat: 0.3,
        clearcoatRoughness: 0.35,
        sheen: 0.2,
        side: THREE.DoubleSide,
      }),
    [texture],
  );
  return (
    <group>
      <mesh castShadow receiveShadow>
        <latheGeometry args={[POT_PROFILE, 48]} />
        <meshPhysicalMaterial color={look.pot} roughness={0.35} clearcoat={0.5} />
      </mesh>
      <mesh position={[0, 0.67, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.41, 32]} />
        <meshStandardMaterial color="#3b2f25" roughness={1} />
      </mesh>
      {Array.from({ length: LEAVES }, (_unused, index) => {
        const around = index * 2.39996 + seeded(index, 7) * 0.4;
        const tilt = 0.25 + seeded(index, 8) * 0.75;
        const stem = 0.5 + seeded(index, 9) * 1.1;
        const sway = Math.sin(frame / 45 + index) * 0.015;
        const tip = new THREE.Vector3(
          Math.sin(around) * Math.sin(tilt) * stem,
          0.66 + Math.cos(tilt) * stem,
          Math.cos(around) * Math.sin(tilt) * stem,
        );
        return (
          <group key={around}>
            <mesh
              position={[tip.x / 2, 0.66 + (tip.y - 0.66) / 2, tip.z / 2]}
              quaternion={new THREE.Quaternion().setFromUnitVectors(
                new THREE.Vector3(0, 1, 0),
                tip
                  .clone()
                  .sub(new THREE.Vector3(0, 0.66, 0))
                  .normalize(),
              )}
              castShadow
            >
              <cylinderGeometry args={[0.012, 0.018, stem, 6]} />
              <meshStandardMaterial color="#6f8a4c" roughness={0.6} />
            </mesh>
            <group position={tip} rotation={[0, around, 0]}>
              <mesh
                geometry={leafGeometry(
                  1 + seeded(index, 10) * 0.5,
                  0.42 + seeded(index, 11) * 0.12,
                  0.6 + seeded(index, 12) * 0.5,
                )}
                material={leafMaterial}
                rotation={[tilt * 0.9 - 0.1 + sway, 0, (seeded(index, 13) - 0.5) * 0.6]}
                castShadow
                receiveShadow
              />
            </group>
          </group>
        );
      })}
    </group>
  );
};
