import * as THREE from 'three';

const SEGMENTS = 48;

export const bentPlane = (width: number, height: number, bend: number): THREE.PlaneGeometry => {
  const geometry = new THREE.PlaneGeometry(width, height, SEGMENTS, 1);
  if (Math.abs(bend) < 1e-4) {
    return geometry;
  }
  const radius = width / bend;
  const positions = geometry.getAttribute('position');
  if (positions !== undefined) {
    for (let index = 0; index < positions.count; index++) {
      const x = positions.getX(index);
      positions.setX(index, radius * Math.sin(x / radius));
      positions.setZ(index, radius * (Math.cos(x / radius) - 1));
    }
    positions.needsUpdate = true;
  }
  return geometry;
};
