import { useMemo } from 'react';
import * as THREE from 'three';
import { ROAD_X } from './ground';
import { seeded } from './random';

const TOWERS = 120;

const windowTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  const random = seeded(41);
  if (context !== null) {
    context.fillStyle = '#8b939c';
    context.fillRect(0, 0, 128, 256);
    for (let row = 0; row < 32; row++) {
      for (let column = 0; column < 8; column++) {
        const glass = 70 + Math.floor(random() * 60);
        context.fillStyle = `rgb(${glass}, ${glass + 12}, ${glass + 26})`;
        context.fillRect(column * 16 + 3, row * 8 + 2, 10, 5);
      }
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
};

const placeTowers = (mesh: THREE.InstancedMesh | null, tint: string): void => {
  if (mesh === null) {
    return;
  }
  const random = seeded(19);
  const matrix = new THREE.Matrix4();
  const base = new THREE.Color(tint);
  for (let slot = 0; slot < TOWERS; slot++) {
    const height = 8 + random() ** 2.2 * 70;
    const width = 8 + random() * 16;
    matrix.compose(
      new THREE.Vector3(ROAD_X - 420 + random() * 840, height / 2, -560 - random() * 260),
      new THREE.Quaternion(),
      new THREE.Vector3(width, height, 8 + random() * 14),
    );
    mesh.setMatrixAt(slot, matrix);
    mesh.setColorAt(slot, base.clone().multiplyScalar(0.8 + random() * 0.35));
  }
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor !== null) {
    mesh.instanceColor.needsUpdate = true;
  }
};

const ridgeGeometry = (): THREE.BufferGeometry => {
  const random = seeded(77);
  const shape = new THREE.Shape();
  shape.moveTo(-1600, 0);
  for (let x = -1600; x <= 1600; x += 40) {
    const height = 28 + Math.sin(x * 0.004) * 22 + Math.sin(x * 0.011 + 1.3) * 12 + random() * 5;
    shape.lineTo(x, Math.max(4, height));
  }
  shape.lineTo(1600, 0);
  shape.closePath();
  return new THREE.ShapeGeometry(shape);
};

export const Skyline = ({ tint }: { tint: string }) => {
  const texture = useMemo(windowTexture, []);
  const ridge = useMemo(ridgeGeometry, []);
  return (
    <group>
      <mesh geometry={ridge} position={[ROAD_X, 0, -1150]}>
        <meshStandardMaterial color="#6f7f6a" roughness={1} />
      </mesh>
      <instancedMesh
        args={[undefined, undefined, TOWERS]}
        ref={(mesh) => placeTowers(mesh, tint)}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial map={texture} roughness={0.55} metalness={0.2} />
      </instancedMesh>
    </group>
  );
};
