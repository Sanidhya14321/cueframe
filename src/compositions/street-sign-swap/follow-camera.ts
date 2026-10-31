import type { StreetSignSwapProps } from '@/schemas';
import { type FootageTrack, frameAt } from '../footage/footage-track';

export type Framing = { x: number; y: number; scale: number };

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

const SMOOTH = 6;

const boardCenter = (track: FootageTrack, frame: number): [number, number] | null => {
  const points = Object.values(frameAt(track, frame).quads).flat();
  if (points.length === 0) {
    return null;
  }
  return [
    points.reduce((sum, [x]) => sum + x, 0) / points.length,
    points.reduce((sum, [, y]) => sum + y, 0) / points.length,
  ];
};

const smoothedCenter = (track: FootageTrack, frame: number): [number, number] => {
  const fallback: [number, number] = [track.width / 2, track.height / 2];
  let weight = 0;
  const sum: [number, number] = [0, 0];
  for (let offset = -SMOOTH * 2; offset <= SMOOTH * 2; offset += 1) {
    const center = boardCenter(track, frame + offset) ?? fallback;
    {
      const w = Math.exp(-(offset * offset) / (2 * SMOOTH * SMOOTH));
      sum[0] += center[0] * w;
      sum[1] += center[1] * w;
      weight += w;
    }
  }
  return [sum[0] / weight, sum[1] / weight];
};

export const followFraming = (
  track: FootageTrack,
  frame: number,
  camera: StreetSignSwapProps['camera'],
): Framing => {
  const { width, height } = track;
  const [cx, cy] = smoothedCenter(track, frame);
  const focusX = width / 2 + (cx - width / 2) * camera.follow;
  const focusY = height / 2 + (cy - height / 2) * camera.follow - camera.headroom * height;
  const scale = camera.zoom;
  return {
    scale,
    x: clamp(width / 2 - focusX * scale, width - width * scale, 0),
    y: clamp(height / 2 - focusY * scale, height - height * scale, 0),
  };
};
