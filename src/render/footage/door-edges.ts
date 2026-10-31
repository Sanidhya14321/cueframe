import type { FootageTracking } from '@/footage/footage-spec';
import type { Plane } from './plane-track';

const DARK_LUMA = 80;

const range = (from: number, to: number) =>
  Array.from(
    { length: Math.max(0, Math.floor(to) - Math.ceil(from) + 1) },
    (_, index) => Math.ceil(from) + index,
  );

export const doorEdges = (
  plane: Plane,
  { band, doorway }: NonNullable<FootageTracking['doors']>,
): [number, number] => {
  const [top, bottom] = band;
  const [left, right] = doorway;
  const center = (left + right) / 2;
  const bandLuma = (x: number) => {
    const values = range(top, bottom).map((y) => plane.gray[y * plane.width + x] ?? 0);
    values.sort((a, b) => a - b);
    return values[Math.floor(values.length / 2)] ?? 255;
  };
  const dark = range(left, right).filter((x) => bandLuma(x) < DARK_LUMA);
  if (dark.length === 0) {
    return [center, center];
  }
  const nearest = dark.reduce((best, x) =>
    Math.abs(x - center) < Math.abs(best - center) ? x : best,
  );
  let low = nearest;
  while (low > left && bandLuma(low - 1) < DARK_LUMA) {
    low -= 1;
  }
  let high = nearest;
  while (high < right && bandLuma(high + 1) < DARK_LUMA) {
    high += 1;
  }
  return [low - 0.5, high + 0.5];
};
