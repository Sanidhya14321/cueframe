import * as THREE from 'three';

const SHADE_SIZE = 1.1;

export const SHADE_OPENING = 0.2 * SHADE_SIZE;

export const SHADE_DEPTH = 0.16 * SHADE_SIZE;

const shadeProfile = (): THREE.Vector2[] =>
  [
    new THREE.Vector2(0.0001, 0.3),
    new THREE.Vector2(0.03, 0.3),
    new THREE.Vector2(0.042, 0.29),
    new THREE.Vector2(0.044, 0.22),
    new THREE.Vector2(0.058, 0.2),
    new THREE.Vector2(0.1, 0.15),
    new THREE.Vector2(0.142, 0.08),
    new THREE.Vector2(0.172, 0.0),
    new THREE.Vector2(0.192, -0.08),
    new THREE.Vector2(0.2, -0.135),
    new THREE.Vector2(0.212, -0.152),
    new THREE.Vector2(0.206, -0.16),
    new THREE.Vector2(0.19, -0.16),
  ].map((point) => point.multiplyScalar(SHADE_SIZE));

const baseProfile = (): THREE.Vector2[] => [
  new THREE.Vector2(0.0001, 0),
  new THREE.Vector2(0.29, 0),
  new THREE.Vector2(0.305, 0.01),
  new THREE.Vector2(0.31, 0.04),
  new THREE.Vector2(0.3, 0.07),
  new THREE.Vector2(0.27, 0.085),
  new THREE.Vector2(0.0001, 0.085),
];

let cache: {
  shade: THREE.LatheGeometry;
  base: THREE.LatheGeometry;
  rod: THREE.CylinderGeometry;
  joint: THREE.CylinderGeometry;
  bulb: THREE.SphereGeometry;
  opening: THREE.CircleGeometry;
} | null = null;

export const lampGeometries = () => {
  if (cache === null) {
    const rod = new THREE.CylinderGeometry(0.012, 0.012, 1, 12);
    rod.translate(0, 0.5, 0);
    const joint = new THREE.CylinderGeometry(0.045, 0.045, 0.1, 20);
    joint.rotateX(Math.PI / 2);
    const opening = new THREE.CircleGeometry(SHADE_OPENING * 0.92, 48);
    opening.rotateX(Math.PI / 2);
    cache = {
      shade: new THREE.LatheGeometry(shadeProfile(), 64),
      base: new THREE.LatheGeometry(baseProfile(), 64),
      rod,
      joint,
      bulb: new THREE.SphereGeometry(0.075, 24, 16),
      opening,
    };
  }
  return cache;
};

const UP = new THREE.Vector3(0, 1, 0);

export const rodTransform = (
  from: THREE.Vector3,
  to: THREE.Vector3,
): { position: THREE.Vector3; quaternion: THREE.Quaternion; length: number } => {
  const direction = to.clone().sub(from);
  const length = direction.length();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(UP, direction.normalize());
  return { position: from.clone(), quaternion, length };
};

const DOWN = new THREE.Vector3(0, -1, 0);

export const aimQuaternion = (from: THREE.Vector3, to: THREE.Vector3): THREE.Quaternion =>
  new THREE.Quaternion().setFromUnitVectors(DOWN, to.clone().sub(from).normalize());
