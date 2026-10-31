import * as THREE from 'three';

const cache = new Map<string, THREE.MeshPhysicalMaterial>();

export const clayMaterial = (color: string, roughness = 0.82, reflections = 1) => {
  const key = `${color}:${roughness.toFixed(2)}:${reflections.toFixed(2)}`;
  const hit = cache.get(key);
  if (hit !== undefined) {
    return hit;
  }
  const material = new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0,
    roughness,
    sheen: 0.25,
    sheenRoughness: 0.8,
    sheenColor: new THREE.Color(color),
    envMapIntensity: 0.45 * reflections,
  });
  cache.set(key, material);
  return material;
};
