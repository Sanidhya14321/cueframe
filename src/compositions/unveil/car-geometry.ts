import * as THREE from 'three';

type Profile = [number, number][];

export interface CarModel {
  body: THREE.BufferGeometry;
  glass: THREE.BufferGeometry;
  length: number;
  width: number;
  axle: number;
}

const extrude = (profile: Profile, width: number, bevel: number): THREE.BufferGeometry => {
  const shape = new THREE.Shape(profile.map(([x, y]) => new THREE.Vector2(x, y)));
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: width - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 4,
  });
  geometry.translate(0, 0, -(width - bevel * 2) / 2);
  geometry.computeVertexNormals();
  return geometry;
};

const model = (body: Profile, glass: Profile, width: number, axle: number): CarModel => {
  const xs = body.map(([x]) => x);
  return {
    body: extrude(body, width, 0.09),
    glass: extrude(glass, width + 0.02, 0.05),
    length: Math.max(...xs) - Math.min(...xs),
    width,
    axle,
  };
};

export const CAR_MODELS: CarModel[] = [
  model(
    [
      [-2.3, 0.32],
      [2.3, 0.32],
      [2.32, 0.72],
      [2.05, 0.88],
      [0.95, 0.96],
      [0.3, 1.38],
      [-1.05, 1.42],
      [-1.85, 1.02],
      [-2.3, 0.96],
    ],
    [
      [0.88, 0.98],
      [0.3, 1.34],
      [-1.0, 1.37],
      [-1.75, 1.03],
    ],
    1.78,
    1.42,
  ),
  model(
    [
      [-2.35, 0.38],
      [2.35, 0.38],
      [2.38, 0.86],
      [2.1, 1.05],
      [1.25, 1.12],
      [0.55, 1.72],
      [-2.2, 1.76],
      [-2.38, 1.1],
    ],
    [
      [1.18, 1.15],
      [0.55, 1.68],
      [-2.1, 1.7],
      [-2.26, 1.18],
    ],
    1.9,
    1.48,
  ),
  model(
    [
      [-2.6, 0.4],
      [2.6, 0.4],
      [2.62, 1.0],
      [2.3, 1.15],
      [1.75, 1.95],
      [-2.6, 2.0],
    ],
    [
      [2.25, 1.18],
      [1.75, 1.88],
      [1.0, 1.9],
      [1.0, 1.2],
    ],
    1.95,
    1.7,
  ),
];

export const WHEEL = new THREE.CylinderGeometry(0.34, 0.34, 0.24, 18).rotateX(Math.PI / 2);

const shadowCanvas = (): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (context !== null) {
    const gradient = context.createRadialGradient(32, 64, 4, 32, 64, 60);
    gradient.addColorStop(0, 'rgba(0,0,0,0.75)');
    gradient.addColorStop(0.55, 'rgba(0,0,0,0.45)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 128);
  }
  return canvas;
};

export const contactShadowTexture = (): THREE.CanvasTexture =>
  new THREE.CanvasTexture(shadowCanvas());
