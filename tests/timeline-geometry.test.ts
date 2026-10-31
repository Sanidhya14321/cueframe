import { describe, expect, it } from 'bun:test';
import {
  buildTicks,
  clampPxPerFrame,
  fitPxPerFrame,
  formatSeconds,
  frameToPx,
  LABEL_WIDTH,
  MAX_PX_PER_FRAME,
  MIN_PX_PER_FRAME,
  pxToFrame,
} from '@/lib/timeline-geometry';

describe('timeline geometry', () => {
  it('converts between frames and pixels', () => {
    expect(frameToPx(10, 6)).toBe(60);
    expect(pxToFrame(60, 6)).toBe(10);
    expect(pxToFrame(61, 6)).toBe(10);
  });

  it('clamps the zoom level', () => {
    expect(clampPxPerFrame(0)).toBe(MIN_PX_PER_FRAME);
    expect(clampPxPerFrame(1000)).toBe(MAX_PX_PER_FRAME);
    expect(clampPxPerFrame(6)).toBe(6);
  });

  it('fits a long project into the viewport', () => {
    const fitted = fitPxPerFrame(1500, 1600);
    expect(frameToPx(1500, fitted) + LABEL_WIDTH).toBeLessThanOrEqual(1600);
    expect(fitted).toBeGreaterThan(MIN_PX_PER_FRAME);
  });

  it('never fits below the minimum zoom', () => {
    expect(fitPxPerFrame(1_000_000, 1600)).toBe(MIN_PX_PER_FRAME);
  });

  it('builds ticks spanning the duration', () => {
    const ticks = buildTicks(150, 30, 6);
    expect(ticks[0]?.frame).toBe(0);
    expect(ticks.at(-1)?.frame).toBeGreaterThanOrEqual(0);
    expect(ticks.every((tick) => tick.seconds === tick.frame / 30)).toBe(true);
  });

  it('widens tick spacing when zoomed out', () => {
    const dense = buildTicks(600, 30, 12);
    const sparse = buildTicks(600, 30, 1);
    expect(sparse.length).toBeLessThan(dense.length);
  });

  it('formats seconds with and without decimals', () => {
    expect(formatSeconds(2)).toBe('2s');
    expect(formatSeconds(1.5)).toBe('1.5s');
  });
});
