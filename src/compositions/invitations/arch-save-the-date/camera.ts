import { Easing } from 'remotion';
import type { ArchSaveTheDateProps } from '@/schemas';

export const FRAME_WIDTH = 1080;

export const FRAME_HEIGHT = 1920;

export const CENTER_X = FRAME_WIDTH / 2;

export const NEAREST_DEPTH = 0.09;

const dolly = Easing.bezier(0.2, 0.32, 0.3, 1);

export interface View {
  remaining: number;
  eyeLevel: number;
}

export const viewAt = (time: number, camera: ArchSaveTheDateProps['camera']): View => {
  const progress = Math.min(1, Math.max(0, time / Math.max(1, camera.dollyFrames)));
  return {
    remaining: (camera.startDepth - 1) * (1 - dolly(progress)),
    eyeLevel: camera.eyeLevel,
  };
};

export const depthOf = (view: View, endDepth: number): number => endDepth + view.remaining;

export const planeMatrix = (view: View, depth: number): string => {
  const scale = 1 / depth;
  const x = CENTER_X * (1 - scale);
  const y = view.eyeLevel * (1 - scale);
  return `matrix(${scale.toFixed(6)} 0 0 ${scale.toFixed(6)} ${x.toFixed(3)} ${y.toFixed(3)})`;
};

export const relativeMatrix = (view: View, endDepth: number): string =>
  planeMatrix(view, depthOf(view, endDepth) / endDepth);

export const seeded = (index: number, salt: number): number => {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

export const wrap = (value: number, span: number): number => ((value % span) + span) % span;

export const fixed = (value: number): string => value.toFixed(2);
