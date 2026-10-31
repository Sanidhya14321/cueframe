import type { ReaderCamera } from '@/schemas';

export type Vec3 = [number, number, number];

export const BOARD = {
  width: 15,
  height: 9,
  centerY: 80,
  depth: 0.7,
} as const;

export const BOARD_TOP = BOARD.centerY + BOARD.height / 2;
export const BOARD_BOTTOM = BOARD.centerY - BOARD.height / 2;

export const ROAD = {
  rocks: 18,
  palms: 24,
  roadNear: 30,
  roadFar: 46,
  city: 54,
} as const;

const SHORE_BASE = -48;

export const shoreX = (z: number): number =>
  SHORE_BASE + 5 * Math.sin(z * 0.005) + 1.5 * (Math.sin(z * 0.017 + 1.3) - Math.sin(1.3));

export const SHORE_GLSL = `
float shoreX(float z) {
  return ${SHORE_BASE.toFixed(1)} + 5.0 * sin(z * 0.005) + 1.5 * (sin(z * 0.017 + 1.3) - ${Math.sin(1.3).toFixed(6)});
}
`;

export const shoreHeading = (z: number): number => {
  const slope = (shoreX(z + 0.5) - shoreX(z - 0.5)) / 1;
  return Math.atan(slope);
};

const smoothstep = (value: number): number => {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
};

export interface CameraShot {
  position: Vec3;
  target: Vec3;
}

const mix = (from: number, to: number, amount: number): number => from + (to - from) * amount;

const cameraProgress = (frame: number, total: number, ease: number): number => {
  const t = Math.min(1, Math.max(0, frame / Math.max(1, total - 1)));
  return mix(t, smoothstep(t), ease);
};

export const cameraShot = (frame: number, total: number, camera: ReaderCamera): CameraShot => {
  const p = cameraProgress(frame, total, camera.ease);
  const shake = camera.handheld;
  const wobbleX = (Math.sin(frame / 37) * 0.16 + Math.sin(frame / 23 + 1.1) * 0.07) * shake;
  const wobbleY = (Math.cos(frame / 41) * 0.12 + Math.sin(frame / 29 + 0.4) * 0.05) * shake;
  const side = mix(camera.startSide, camera.endSide, p);
  const height = mix(camera.startHeight, camera.endHeight, p);
  const distance = mix(camera.startDistance, camera.endDistance, p);
  const aim = mix(camera.startAim, camera.endAim, p);
  return {
    position: [side + wobbleX, BOARD.centerY + height + wobbleY, distance],
    target: [side * 0.12 + wobbleX * 0.4, BOARD.centerY + aim + wobbleY * 0.4, 0],
  };
};
