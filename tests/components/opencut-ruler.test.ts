import { describe, expect, it } from 'bun:test';
import {
  formatRulerLabel,
  getRulerConfig,
  shouldShowLabel,
} from '@/components/opencut-timeline/ruler-utils';

describe('OpenCut ruler adapter', () => {
  it('keeps frame ticks aligned with labels at every supported zoom and frame rate', () => {
    for (const fps of [24, 25, 30, 60]) {
      for (const scale of [0.25, 1, 6, 24]) {
        const config = getRulerConfig({ fps, zoomLevel: (scale * fps) / 150 });
        const labelFrames = Math.round(config.labelIntervalSeconds * fps);
        const tickFrames = Math.round(config.tickIntervalSeconds * fps);
        expect(tickFrames).toBeGreaterThan(0);
        expect(labelFrames % tickFrames).toBe(0);
        expect(
          shouldShowLabel({
            time: config.labelIntervalSeconds * 3,
            labelIntervalSeconds: config.labelIntervalSeconds,
          }),
        ).toBe(true);
      }
    }
  });
  it('formats frame subdivisions and hour boundaries without float drift', () => {
    expect(formatRulerLabel({ timeInSeconds: 1 / 30, fps: 30 })).toBe('1f');
    expect(formatRulerLabel({ timeInSeconds: 3601, fps: 30 })).toBe('1:00:01');
  });
});
