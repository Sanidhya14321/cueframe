import { describe, expect, it } from 'bun:test';
import { entranceStyle } from '@/compositions/project/entrance';

describe('entranceStyle', () => {
  it('returns identity without an animation', () => {
    expect(entranceStyle(undefined, 0)).toEqual({ opacity: 1, translateY: 0, scale: 1 });
  });

  it('returns identity for a none animation', () => {
    const style = entranceStyle({ kind: 'none', easing: 'linear', durationInFrames: 10 }, 0);
    expect(style.opacity).toBe(1);
  });

  it('returns identity for a zero-length animation', () => {
    const style = entranceStyle({ kind: 'fade', easing: 'linear', durationInFrames: 0 }, 5);
    expect(style.opacity).toBe(1);
  });

  it('fades opacity from zero to one', () => {
    const start = entranceStyle({ kind: 'fade', easing: 'linear', durationInFrames: 10 }, 0);
    const end = entranceStyle({ kind: 'fade', easing: 'linear', durationInFrames: 10 }, 10);
    expect(start.opacity).toBe(0);
    expect(end.opacity).toBe(1);
  });

  it('slides vertically into place', () => {
    const start = entranceStyle({ kind: 'slide', easing: 'linear', durationInFrames: 10 }, 0);
    const end = entranceStyle({ kind: 'slide', easing: 'linear', durationInFrames: 10 }, 10);
    expect(start.translateY).toBeGreaterThan(0);
    expect(end.translateY).toBe(0);
  });

  it('scales up into place', () => {
    const start = entranceStyle({ kind: 'scale', easing: 'linear', durationInFrames: 10 }, 0);
    const end = entranceStyle({ kind: 'scale', easing: 'linear', durationInFrames: 10 }, 10);
    expect(start.scale).toBeLessThan(1);
    expect(end.scale).toBeCloseTo(1, 5);
  });
});
