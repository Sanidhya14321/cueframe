import { Easing } from 'remotion';
import type { DominoWordsProps } from '@/schemas';
import { chainAngles, chainBounds, type Domino } from './chain';

export interface CameraState {
  offset: number;
  zoom: number;
}

const STEP = 0.25;
const pullEase = Easing.bezier(0.2, 0, 0, 1);
const rampEase = Easing.inOut(Easing.sin);
const REST_FRAME = 100000;

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const panVelocity = (camera: DominoWordsProps['camera'], frame: number): number => {
  if (frame <= camera.panStart || frame >= camera.panEnd) {
    return 0;
  }
  const rise = rampEase(clamp01((frame - camera.panStart) / camera.panRamp));
  const decelStart = camera.panStart + camera.panRamp + camera.panHold;
  const decel = clamp01((frame - decelStart) / Math.max(1, camera.panEnd - decelStart));
  return rise * (1 - decel) ** camera.panEase;
};

const panProfile = (camera: DominoWordsProps['camera']): number[] => {
  const areas = [0];
  let area = 0;
  for (let frame = camera.panStart + 1; frame <= camera.panEnd; frame += 1) {
    for (let time = frame - 1; time < frame; time += STEP) {
      area += panVelocity(camera, time + STEP / 2) * STEP;
    }
    areas.push(area);
  }
  return areas;
};

const pixelPan = (camera: DominoWordsProps['camera'], distance: number, frame: number): number => {
  const areas = panProfile(camera);
  const total = areas.at(-1) ?? 0;
  const target = Math.round(distance);
  if (total <= 0 || target <= 0) {
    return 0;
  }
  const elapsed = Math.floor(frame - camera.panStart);
  let travelled = 0;
  for (let step = 1; step <= Math.min(elapsed, areas.length - 1) && travelled < target; step += 1) {
    const ideal = (((areas[step] ?? 0) - (areas[step - 1] ?? 0)) * target) / total;
    travelled = Math.min(target, travelled + Math.max(1, Math.round(ideal)));
  }
  if (elapsed >= areas.length - 1) {
    return target;
  }
  return travelled;
};

export const cameraAt = (
  props: DominoWordsProps,
  chain: Domino[],
  frame: number,
  width: number,
): CameraState => {
  const { camera, floor } = props;
  const last = chain.at(-1);
  const distance = Math.max(0, (last?.pivot ?? 0) - camera.landingX);
  const panned = pixelPan(camera, distance, frame);
  const rest = chainBounds(chain, chainAngles(chain, REST_FRAME));
  const lineLeft = floor.inset + camera.fitPadding;
  const lineRight = width - floor.inset - camera.fitPadding;
  const span = Math.max(1, rest.max - rest.min);
  const fitZoom = Math.min(1, Math.max(0.05, (lineRight - lineLeft) / span));
  const fitOffset = (lineLeft + lineRight) / 2 - (fitZoom * (rest.min + rest.max)) / 2;
  const pull = pullEase(clamp01((frame - camera.zoomStart) / camera.zoomFrames));
  return {
    zoom: 1 + (fitZoom - 1) * pull,
    offset: -panned + (fitOffset + panned) * pull,
  };
};
