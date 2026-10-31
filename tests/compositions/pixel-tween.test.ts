import { describe, expect, it } from 'bun:test';
import { accelerate, pixelTween, settle } from '@/compositions/promo/timing';

const frames = (count: number) => Array.from({ length: count }, (_, index) => index);

describe('pixelTween', () => {
  it('holds whole-pixel endpoints outside the range', () => {
    expect(pixelTween(-5, [0, 32], [50.4, 0], settle)).toBe(50);
    expect(pixelTween(40, [0, 32], [50.4, 0], settle)).toBe(0);
  });

  it('lands with exactly one pixel per frame instead of creeping', () => {
    const path = frames(33).map((frame) => pixelTween(frame, [0, 32], [50, 0], settle));
    const steps = path.slice(1).map((value, index) => (path[index] ?? 0) - value);
    const moving = steps.slice(0, path.indexOf(0));
    expect(path.every(Number.isInteger)).toBe(true);
    expect(moving.every((step) => step >= 1)).toBe(true);
    expect(path.at(-1)).toBe(0);
  });

  it('only ever shortens its steps while settling, so the slowdown reads as even', () => {
    const path = frames(40).map((frame) => pixelTween(frame, [0, 32], [50, 0], settle));
    const steps = path.slice(1).map((value, index) => (path[index] ?? 0) - value);
    const moving = steps.slice(0, path.indexOf(0));
    expect(moving.every((step, index) => index === 0 || step <= (moving[index - 1] ?? 0))).toBe(
      true,
    );
  });

  it('starts an accelerating move at one pixel per frame', () => {
    const path = frames(15).map((frame) => pixelTween(frame, [0, 14], [0, -22], accelerate));
    expect(path[1]).toBe(-1);
    expect(path[2]).toBe(-2);
    expect(path.at(-1)).toBe(-22);
  });

  it('stays put when the distance rounds to nothing', () => {
    expect(pixelTween(10, [0, 20], [0.3, 0], settle)).toBe(0);
  });
});
