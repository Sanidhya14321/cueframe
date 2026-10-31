import { useMemo } from 'react';
import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { ROAD_HALF, ROAD_X } from './ground';
import { seeded } from './random';

const VARIANTS = 3;
const PER_VARIANT = 320;

const lump = (x: number, y: number, z: number): number =>
  Math.sin(x * 3.1 + y * 1.7) * Math.cos(z * 2.9 - x * 1.3) * 0.5 +
  Math.sin(y * 5.3 + z * 4.1) * 0.25 +
  Math.sin(x * 9.7 - z * 8.3 + y * 6.1) * 0.12;

const paint = (
  geometry: THREE.BufferGeometry,
  color: (y: number, shade: number) => THREE.Color,
) => {
  const positions = geometry.getAttribute('position') as THREE.BufferAttribute;
  const colors = new Float32Array(positions.count * 3);
  for (let vertex = 0; vertex < positions.count; vertex++) {
    const shade = lump(positions.getX(vertex), positions.getY(vertex), positions.getZ(vertex));
    color(positions.getY(vertex), shade).toArray(colors, vertex * 3);
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geometry;
};

const crownBlob = (random: () => number, height: number): THREE.BufferGeometry => {
  const radius = 0.55 + random() * 0.45;
  const sphere = new THREE.IcosahedronGeometry(radius, 3);
  sphere.deleteAttribute('normal');
  sphere.deleteAttribute('uv');
  const blob = mergeVertices(sphere);
  const positions = blob.getAttribute('position') as THREE.BufferAttribute;
  for (let vertex = 0; vertex < positions.count; vertex++) {
    const point = new THREE.Vector3().fromBufferAttribute(positions, vertex);
    const bump = 1 + lump(point.x * 1.7, point.y * 1.7, point.z * 1.7) * 0.28;
    point.multiplyScalar(bump);
    positions.setXYZ(vertex, point.x, point.y, point.z);
  }
  blob.translate((random() - 0.5) * 1.3, height + random() * 1.1, (random() - 0.5) * 1.3);
  blob.computeVertexNormals();
  return blob;
};

const buildTree = (variant: number): THREE.BufferGeometry => {
  const random = seeded(101 + variant * 17);
  const leaf = new THREE.Color().setHSL(0.23 + variant * 0.02, 0.45, 0.13);
  const blobs = Array.from({ length: 7 + variant }, () => crownBlob(random, 1.6));
  const crown = paint(mergeGeometries(blobs), (y, shade) =>
    leaf
      .clone()
      .multiplyScalar(0.55 + Math.min(1, Math.max(0, (y - 1.2) / 2)) * 0.7 + shade * 0.18),
  );
  const trunk = new THREE.CylinderGeometry(0.09, 0.16, 2, 7);
  trunk.translate(0, 1, 0);
  trunk.deleteAttribute('uv');
  const bark = new THREE.Color('#3b3024');
  return mergeGeometries([crown, paint(trunk, () => bark)]);
};

const FOLIAGE = `
float leafHash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float leafNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(leafHash(i), leafHash(i + vec3(1, 0, 0)), f.x),
        mix(leafHash(i + vec3(0, 1, 0)), leafHash(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(leafHash(i + vec3(0, 0, 1)), leafHash(i + vec3(1, 0, 1)), f.x),
        mix(leafHash(i + vec3(0, 1, 1)), leafHash(i + vec3(1, 1, 1)), f.x), f.y),
    f.z);
}
`;

const foliageMaterial = (): THREE.MeshStandardMaterial => {
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 });
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vLeafWorld;')
      .replace(
        '#include <worldpos_vertex>',
        '#include <worldpos_vertex>\nvLeafWorld = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;',
      );
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vLeafWorld;\n${FOLIAGE}`)
      .replace(
        '#include <color_fragment>',
        '#include <color_fragment>\nfloat leaves = leafNoise(vLeafWorld * 3.2) * 0.6 + leafNoise(vLeafWorld * 9.0) * 0.4;\ndiffuseColor.rgb *= 0.45 + leaves * 0.95;',
      );
  };
  material.customProgramCacheKey = () => 'unveil-foliage';
  return material;
};

interface TreeSpot {
  position: THREE.Vector3;
  scale: THREE.Vector3;
  turn: number;
  tint: THREE.Color;
}

const plantTrees = (variant: number): TreeSpot[] => {
  const random = seeded(7 + variant * 31);
  return Array.from({ length: PER_VARIANT }, () => {
    const side = random() < 0.55 ? -1 : 1;
    const offset = ROAD_HALF + 4 + random() ** 1.6 * 70;
    const size = 1.9 + random() * 1.8;
    return {
      position: new THREE.Vector3(ROAD_X + side * offset, 0, -8 - random() * 560),
      scale: new THREE.Vector3(size * (0.9 + random() * 0.3), size * (0.85 + random() * 0.4), size),
      turn: random() * Math.PI * 2,
      tint: new THREE.Color().setHSL(0.2 + random() * 0.1, 0.35, 0.42 + random() * 0.18),
    };
  });
};

const fillTrees = (mesh: THREE.InstancedMesh | null, spots: TreeSpot[]): void => {
  if (mesh === null) {
    return;
  }
  const matrix = new THREE.Matrix4();
  spots.forEach((spot, slot) => {
    matrix.compose(
      spot.position,
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), spot.turn),
      spot.scale,
    );
    mesh.setMatrixAt(slot, matrix);
    mesh.setColorAt(slot, spot.tint.clone().multiplyScalar(1.5));
  });
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor !== null) {
    mesh.instanceColor.needsUpdate = true;
  }
};

export const Trees = ({ tone }: { tone: string }) => {
  const forests = useMemo(
    () =>
      Array.from({ length: VARIANTS }, (_, variant) => ({
        geometry: buildTree(variant),
        spots: plantTrees(variant),
      })),
    [],
  );
  const material = useMemo(foliageMaterial, []);
  material.color.set(tone);
  return (
    <group>
      {forests.map((forest, variant) => (
        <instancedMesh
          key={variant}
          args={[forest.geometry, material, PER_VARIANT]}
          ref={(mesh) => fillTrees(mesh, forest.spots)}
          castShadow
          receiveShadow
          frustumCulled={false}
        />
      ))}
    </group>
  );
};
