import { getRemotionEnvironment, useCurrentScale } from 'remotion';

const MIN_PREVIEW_RATIO = 0.5;
const RATIO_STEP = 0.125;

export const useCanvasPixelRatio = (renderRatio: number): number => {
  const scale = useCurrentScale({ dontThrowIfOutsideOfRemotion: true });
  if (getRemotionEnvironment().isRendering) {
    return renderRatio;
  }
  const device = typeof window === 'undefined' ? 1 : window.devicePixelRatio;
  const shown = Math.ceil((scale * device) / RATIO_STEP) * RATIO_STEP;
  return Math.min(1, Math.max(MIN_PREVIEW_RATIO, shown));
};
