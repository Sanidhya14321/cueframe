import { describe, expect, it } from 'bun:test';
import { EASING_IDS, resolveEasing } from '@/compositions/kit/easing';
import { clamp01, lerp, ramp } from '@/compositions/kit/motion';

describe('motion helpers', () => {
  it('clamps to the unit interval', () => {
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(0.5)).toBe(0.5);
    expect(clamp01(2)).toBe(1);
  });

  it('interpolates linearly with lerp', () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(-10, 10, 0.25)).toBe(-5);
  });

  it('ramps and clamps at the edges', () => {
    expect(ramp(0, 0, 10)).toBe(0);
    expect(ramp(10, 0, 10)).toBe(1);
    expect(ramp(-5, 0, 10)).toBe(0);
    expect(ramp(50, 0, 10)).toBe(1);
  });
});

describe('easing', () => {
  it('resolves linear as identity', () => {
    expect(resolveEasing('linear')(0.5)).toBe(0.5);
  });

  it('exposes four easing presets', () => {
    expect(EASING_IDS).toHaveLength(4);
  });
});
