import type { ElevatorNewspaperProps } from '@/schemas';
import { smooth, tween } from '../promo/timing';

const linear = (progress: number) => progress;

export type Framing = { x: number; y: number; scale: number };

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

export const cameraFraming = (
  frame: number,
  camera: ElevatorNewspaperProps['camera'],
  width: number,
  height: number,
): Framing => {
  const pushEnd = camera.pushStart + camera.pushFrames;
  const pullStart = Math.max(camera.pushStart + 1, camera.pullStart);
  const held = tween(frame, [pullStart, pullStart + camera.pullFrames], [1, 0], smooth);
  const pushed = tween(frame, [camera.pushStart, pushEnd], [0, 1], smooth);
  const crept = tween(frame, [camera.pushStart, pullStart + camera.pullFrames / 2], [0, 1], linear);
  const closeness = pushed * held;
  const scale = 1 + ((camera.zoom - 1) * pushed + camera.creep * crept) * held;
  const screenX = camera.focusX + (width / 2 - camera.focusX) * closeness;
  const screenY = camera.focusY + (height / 2 - camera.focusY) * closeness;
  return {
    scale,
    x: clamp(screenX - camera.focusX * scale, width - width * scale, 0),
    y: clamp(screenY - camera.focusY * scale, height - height * scale, 0),
  };
};
