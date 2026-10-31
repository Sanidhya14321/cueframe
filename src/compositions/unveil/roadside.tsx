import { useMemo } from 'react';
import * as THREE from 'three';
import { bodyFont } from '../promo/fonts';
import { ROAD_HALF, ROAD_X } from './ground';

const NEAR = 70;
const FAR = -720;
const LENGTH = NEAR - FAR;
const MIDDLE = (NEAR + FAR) / 2;
const POST_GAP = 4;
const LAMP_GAP = 42;
const GANTRY_Z = -96;
const RAIL_X = [ROAD_X - ROAD_HALF - 0.45, ROAD_X + ROAD_HALF + 0.45] as const;
const SIGNS = [
  { label: 'City Centre', exit: 'Exit 14', x: ROAD_X - 6.2 },
  { label: 'Harbour Rd', exit: 'Exit 15', x: ROAD_X + 2.4 },
  { label: 'Airport', exit: 'Keep left', x: ROAD_X + 8.4 },
] as const;

const Concrete = () => <meshStandardMaterial color="#a39f96" roughness={0.9} />;
const Steel = () => <meshStandardMaterial color="#9aa1a8" roughness={0.38} metalness={0.75} />;

const fillPosts = (mesh: THREE.InstancedMesh | null): void => {
  if (mesh === null) {
    return;
  }
  const matrix = new THREE.Matrix4();
  let slot = 0;
  for (const x of RAIL_X) {
    for (let z = NEAR; z > FAR; z -= POST_GAP) {
      matrix.makeTranslation(x, 0.38, z);
      mesh.setMatrixAt(slot, matrix);
      slot += 1;
    }
  }
  mesh.instanceMatrix.needsUpdate = true;
};

const POST_COUNT = RAIL_X.length * Math.ceil(LENGTH / POST_GAP);

const Lamp = ({ z }: { z: number }) => (
  <group position={[ROAD_X, 0, z]}>
    <mesh position={[0, 5.6, 0]} castShadow>
      <cylinderGeometry args={[0.09, 0.15, 11.2, 10]} />
      <Steel />
    </mesh>
    {[-1, 1].map((side) => (
      <group key={side}>
        <mesh position={[side * 1.4, 11, 0]} rotation={[0, 0, side * -0.12]}>
          <boxGeometry args={[2.8, 0.08, 0.08]} />
          <Steel />
        </mesh>
        <mesh position={[side * 2.75, 10.82, 0]}>
          <boxGeometry args={[0.7, 0.14, 0.28]} />
          <meshStandardMaterial color="#5a6067" roughness={0.5} metalness={0.4} />
        </mesh>
      </group>
    ))}
  </group>
);

const signTexture = (label: string, exit: string): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (context !== null) {
    context.fillStyle = '#0f6b3a';
    context.fillRect(0, 0, 512, 256);
    context.strokeStyle = '#f2f2ee';
    context.lineWidth = 8;
    context.strokeRect(12, 12, 488, 232);
    context.fillStyle = '#f2f2ee';
    context.font = `600 34px "${bodyFont}"`;
    context.fillText(exit, 40, 72);
    context.font = `600 62px "${bodyFont}"`;
    context.fillText(label, 40, 160);
    context.beginPath();
    context.moveTo(440, 216);
    context.lineTo(440, 120);
    context.lineTo(420, 140);
    context.moveTo(440, 120);
    context.lineTo(460, 140);
    context.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
};

const Gantry = () => {
  const textures = useMemo(() => SIGNS.map((sign) => signTexture(sign.label, sign.exit)), []);
  return (
    <group position={[0, 0, GANTRY_Z]}>
      {RAIL_X.map((x) => (
        <mesh key={x} position={[x, 4, 0]} castShadow>
          <boxGeometry args={[0.45, 8, 0.45]} />
          <Steel />
        </mesh>
      ))}
      <mesh position={[ROAD_X, 7.7, 0]}>
        <boxGeometry args={[ROAD_HALF * 2 + 1.4, 0.7, 0.9]} />
        <Steel />
      </mesh>
      {SIGNS.map((sign, slot) => (
        <mesh key={sign.label} position={[sign.x, 6.6, 0.5]}>
          <planeGeometry args={[5.2, 2.6]} />
          <meshStandardMaterial map={textures[slot] ?? null} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
};

export const Roadside = () => (
  <group>
    <mesh position={[ROAD_X, 0.48, MIDDLE]} castShadow receiveShadow>
      <boxGeometry args={[0.55, 0.96, LENGTH]} />
      <Concrete />
    </mesh>
    {RAIL_X.map((x) => (
      <mesh key={x} position={[x, 0.66, MIDDLE]} castShadow>
        <boxGeometry args={[0.07, 0.32, LENGTH]} />
        <Steel />
      </mesh>
    ))}
    <instancedMesh args={[undefined, undefined, POST_COUNT]} ref={fillPosts} castShadow>
      <boxGeometry args={[0.12, 0.76, 0.12]} />
      <Steel />
    </instancedMesh>
    {Array.from({ length: Math.ceil(LENGTH / LAMP_GAP) }, (_, slot) => (
      <Lamp key={slot} z={NEAR - 20 - slot * LAMP_GAP} />
    ))}
    <Gantry />
  </group>
);
