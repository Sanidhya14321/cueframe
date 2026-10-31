import * as THREE from 'three';
import type { PhoneFinish } from '@/schemas';

interface FinishPalette {
  frame: string;
  back: string;
  plateau: string;
  ring: string;
}

const FINISHES: Record<PhoneFinish, FinishPalette> = {
  natural: { frame: '#b8b3aa', back: '#c8c4bb', plateau: '#bdb8af', ring: '#a9a49b' },
  black: { frame: '#3a3a3d', back: '#28282b', plateau: '#2f2f33', ring: '#4a4a4e' },
  white: { frame: '#d8d8d4', back: '#ececea', plateau: '#e2e2df', ring: '#c9c9c5' },
  blue: { frame: '#3f4b5e', back: '#46526a', plateau: '#3e4960', ring: '#56637a' },
  desert: { frame: '#bea893', back: '#d2bca6', plateau: '#c7b19c', ring: '#ad9884' },
};

export interface PhoneMaterials {
  frame: THREE.MeshPhysicalMaterial;
  back: THREE.MeshPhysicalMaterial;
  plateau: THREE.MeshPhysicalMaterial;
  ring: THREE.MeshPhysicalMaterial;
  frontGlass: THREE.MeshPhysicalMaterial;
  glare: THREE.MeshStandardMaterial;
  lensGlass: THREE.MeshPhysicalMaterial;
  lensCore: THREE.MeshPhysicalMaterial;
  blackGloss: THREE.MeshPhysicalMaterial;
  antenna: THREE.MeshStandardMaterial;
  hole: THREE.MeshBasicMaterial;
  flash: THREE.MeshStandardMaterial;
}

const cache = new Map<string, PhoneMaterials>();

const build = (finish: PhoneFinish, reflections: number): PhoneMaterials => {
  const palette = FINISHES[finish];
  return {
    frame: new THREE.MeshPhysicalMaterial({
      color: palette.frame,
      metalness: 1,
      roughness: 0.42,
      anisotropy: 0.5,
      envMapIntensity: reflections,
    }),
    back: new THREE.MeshPhysicalMaterial({
      color: palette.back,
      metalness: 0,
      roughness: 0.42,
      clearcoat: 0.35,
      clearcoatRoughness: 0.5,
      envMapIntensity: 1.15 * reflections,
    }),
    plateau: new THREE.MeshPhysicalMaterial({
      color: palette.plateau,
      metalness: 0.05,
      roughness: 0.34,
      clearcoat: 0.4,
      clearcoatRoughness: 0.5,
      envMapIntensity: reflections,
    }),
    ring: new THREE.MeshPhysicalMaterial({
      color: palette.ring,
      metalness: 1,
      roughness: 0.24,
      envMapIntensity: 1.2 * reflections,
    }),
    frontGlass: new THREE.MeshPhysicalMaterial({
      color: '#060607',
      metalness: 0,
      roughness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.4 * reflections,
    }),
    glare: new THREE.MeshStandardMaterial({
      color: '#000000',
      metalness: 1,
      roughness: 0.5,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -6,
      polygonOffsetUnits: -10,
      envMapIntensity: 0.04 * reflections,
    }),
    lensGlass: new THREE.MeshPhysicalMaterial({
      color: '#0b0c14',
      metalness: 0.15,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.3,
      iridescence: 0.7,
      iridescenceIOR: 1.5,
      iridescenceThicknessRange: [220, 480],
      envMapIntensity: 2 * reflections,
    }),
    lensCore: new THREE.MeshPhysicalMaterial({
      color: '#1d2346',
      metalness: 0.6,
      roughness: 0.36,
      iridescence: 0.6,
      iridescenceThicknessRange: [300, 600],
      envMapIntensity: 1.5 * reflections,
    }),
    blackGloss: new THREE.MeshPhysicalMaterial({
      color: '#0b0b0d',
      metalness: 0.2,
      roughness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.35,
      envMapIntensity: reflections,
    }),
    antenna: new THREE.MeshStandardMaterial({
      color: palette.frame,
      metalness: 0.1,
      roughness: 0.7,
    }),
    hole: new THREE.MeshBasicMaterial({ color: '#050505' }),
    flash: new THREE.MeshStandardMaterial({
      color: '#f3ead2',
      emissive: '#3a3324',
      roughness: 0.3,
    }),
  };
};

export const phoneMaterials = (finish: PhoneFinish, reflections: number): PhoneMaterials => {
  const key = `${finish}:${reflections.toFixed(2)}`;
  const hit = cache.get(key);
  if (hit !== undefined) {
    return hit;
  }
  const materials = build(finish, reflections);
  cache.set(key, materials);
  return materials;
};
