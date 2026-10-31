import * as THREE from 'three';

const SEGMENTS_X = 48;
const SEGMENTS_Y = 16;

export const spherePatch = (radius: number, arcX: number, arcY: number): THREE.BufferGeometry => {
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  for (let row = 0; row <= SEGMENTS_Y; row++) {
    const v = row / SEGMENTS_Y;
    const latitude = (v - 0.5) * arcY;
    for (let column = 0; column <= SEGMENTS_X; column++) {
      const u = column / SEGMENTS_X;
      const longitude = (u - 0.5) * arcX;
      const x = Math.sin(longitude) * Math.cos(latitude);
      const y = Math.sin(latitude);
      const z = Math.cos(longitude) * Math.cos(latitude);
      positions.push(x * radius, y * radius, z * radius);
      normals.push(x, y, z);
      uvs.push(u, v);
    }
  }
  const stride = SEGMENTS_X + 1;
  for (let row = 0; row < SEGMENTS_Y; row++) {
    for (let column = 0; column < SEGMENTS_X; column++) {
      const at = row * stride + column;
      indices.push(at, at + 1, at + stride, at + 1, at + stride + 1, at + stride);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  return geometry;
};

export const faceTurn = (direction: THREE.Vector3, roll: number): THREE.Quaternion => {
  const aim = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    direction.clone().normalize(),
  );
  return aim.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), roll));
};
