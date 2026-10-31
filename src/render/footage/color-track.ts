import type { Corners } from './plane-track';

export type BoardColor = { rgb: [number, number, number]; reach: number };

export type ColorMask = { data: Uint8Array; width: number; height: number };

const PAD = 70;
const MIN_PIXELS = 400;
const SIGMA = 1.2;
const MIN_SATURATION = 0.12;

export const colorMask = (
  rgb: Uint8Array,
  width: number,
  height: number,
  { rgb: [r, g, b], reach }: BoardColor,
): ColorMask => {
  const sum = r + g + b;
  const [kr, kg] = [r / sum, g / sum];
  const data = new Uint8Array(width * height);
  for (let index = 0; index < width * height; index += 1) {
    const red = rgb[index * 3] ?? 0;
    const green = rgb[index * 3 + 1] ?? 0;
    const blue = rgb[index * 3 + 2] ?? 0;
    const total = red + green + blue;
    const high = Math.max(red, green, blue);
    const saturation = high === 0 ? 0 : (high - Math.min(red, green, blue)) / high;
    if (total > 120 && saturation > MIN_SATURATION) {
      const dr = red / total - kr;
      const dg = green / total - kg;
      data[index] = dr * dr + dg * dg < reach * reach ? 1 : 0;
    }
  }
  return { data, width, height };
};

type Box = { left: number; right: number; top: number; bottom: number };

const searchBox = (mask: ColorMask, around: Corners): Box => {
  const xs = around.map(([x]) => x);
  const ys = around.map(([, y]) => y);
  return {
    left: Math.max(0, Math.floor(Math.min(...xs) - PAD)),
    right: Math.min(mask.width - 1, Math.ceil(Math.max(...xs) + PAD)),
    top: Math.max(0, Math.floor(Math.min(...ys) - PAD)),
    bottom: Math.min(mask.height - 1, Math.ceil(Math.max(...ys) + PAD)),
  };
};

const seedNear = (mask: ColorMask, around: Corners, box: Box): number | null => {
  const cx = Math.round(around.reduce((sum, [x]) => sum + x, 0) / 4);
  const cy = Math.round(around.reduce((sum, [, y]) => sum + y, 0) / 4);
  for (let radius = 0; radius < 60; radius += 2) {
    for (const [dx, dy] of [
      [radius, 0],
      [-radius, 0],
      [0, radius],
      [0, -radius],
    ] as const) {
      const [x, y] = [cx + dx, cy + dy];
      const inside = x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;
      if (inside && mask.data[y * mask.width + x] === 1) {
        return y * mask.width + x;
      }
    }
  }
  return null;
};

const connected = (mask: ColorMask, seed: number, box: Box): number[] => {
  const seen = new Uint8Array(mask.data.length);
  const stack = [seed];
  const found: number[] = [];
  seen[seed] = 1;
  while (stack.length > 0) {
    const index = stack.pop() as number;
    found.push(index);
    const x = index % mask.width;
    const y = (index - x) / mask.width;
    for (const [nx, ny] of [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ] as const) {
      const next = ny * mask.width + nx;
      const inside = nx >= box.left && nx <= box.right && ny >= box.top && ny <= box.bottom;
      if (inside && seen[next] === 0 && mask.data[next] === 1) {
        seen[next] = 1;
        stack.push(next);
      }
    }
  }
  return found;
};

type Line = { slope: number; offset: number };

const fitLine = (points: [number, number][]): Line | null => {
  let kept = points;
  for (let round = 0; round < 4; round += 1) {
    if (kept.length < 12) {
      return null;
    }
    const n = kept.length;
    const ma = kept.reduce((sum, [along]) => sum + along, 0) / n;
    const mc = kept.reduce((sum, [, across]) => sum + across, 0) / n;
    let covariance = 0;
    let variance = 0;
    for (const [along, across] of kept) {
      covariance += (along - ma) * (across - mc);
      variance += (along - ma) ** 2;
    }
    const slope = variance === 0 ? 0 : covariance / variance;
    const line = { slope, offset: mc - slope * ma };
    const residuals = kept.map(([along, across]) =>
      Math.abs(across - line.slope * along - line.offset),
    );
    const sorted = [...residuals].sort((x, y) => x - y);
    const limit = Math.max(1.5, 2.5 * (sorted[Math.floor(sorted.length / 2)] ?? 0));
    if (round === 3) {
      return line;
    }
    kept = kept.filter((_, index) => (residuals[index] ?? 0) <= limit);
  }
  return null;
};

const cross = (row: Line, column: Line): [number, number] => {
  const y = (row.slope * column.offset + row.offset) / (1 - row.slope * column.slope);
  return [column.slope * y + column.offset, y];
};

const edgePoints = (pixels: number[], width: number) => {
  const rows = new Map<number, [number, number]>();
  const columns = new Map<number, [number, number]>();
  for (const index of pixels) {
    const x = index % width;
    const y = (index - x) / width;
    const row = rows.get(y) ?? [x, x];
    rows.set(y, [Math.min(row[0], x), Math.max(row[1], x)]);
    const column = columns.get(x) ?? [y, y];
    columns.set(x, [Math.min(column[0], y), Math.max(column[1], y)]);
  }
  const trim = <T>(map: Map<number, T>) => {
    const keys = [...map.keys()].sort((p, q) => p - q);
    const cut = Math.floor(keys.length * 0.12);
    return keys.slice(cut, keys.length - cut).map((key) => [key, map.get(key) as T] as const);
  };
  return { rows: trim(rows), columns: trim(columns) };
};

const edgeCorners = (pixels: number[], width: number): Corners | null => {
  const { rows, columns } = edgePoints(pixels, width);
  const left = fitLine(rows.map(([y, [low]]) => [y, low]));
  const right = fitLine(rows.map(([y, [, high]]) => [y, high]));
  const top = fitLine(columns.map(([x, [low]]) => [x, low]));
  const bottom = fitLine(columns.map(([x, [, high]]) => [x, high]));
  if (left === null || right === null || top === null || bottom === null) {
    return null;
  }
  return [cross(top, left), cross(top, right), cross(bottom, right), cross(bottom, left)];
};

const fitCorners = (mask: ColorMask, around: Corners): Corners | null => {
  const box = searchBox(mask, around);
  const seed = seedNear(mask, around, box);
  if (seed === null) {
    return null;
  }
  const pixels = connected(mask, seed, box);
  return pixels.length < MIN_PIXELS ? null : edgeCorners(pixels, mask.width);
};

const EDGE = 4;

const keepShape = (found: Corners, previous: Corners, width: number, height: number): Corners => {
  const clipped = found.map(
    ([x, y]) => x < EDGE || y < EDGE || x > width - 1 - EDGE || y > height - 1 - EDGE,
  );
  const free = found.filter((_, corner) => !clipped[corner]);
  if (free.length === 4 || free.length === 0) {
    return found;
  }
  const shift = free.reduce(
    ([sx, sy], point) => {
      const before = previous[found.indexOf(point)] ?? point;
      return [sx + (point[0] - before[0]) / free.length, sy + (point[1] - before[1]) / free.length];
    },
    [0, 0],
  );
  return previous.map(([x, y]) => [x + shift[0], y + shift[1]]) as Corners;
};

const smoothRun = (poses: Map<number, Corners>, order: number[]) =>
  new Map(
    order.flatMap((index, at) => {
      const own = poses.get(index);
      if (own === undefined) {
        return [];
      }
      const smoothed = own.map((_, corner) => {
        let weight = 0;
        const sum: [number, number] = [0, 0];
        for (let offset = -3; offset <= 3; offset += 1) {
          const point = poses.get(order[at + offset] ?? -1)?.[corner];
          if (point !== undefined) {
            const w = Math.exp(-(offset * offset) / (2 * SIGMA * SIGMA));
            sum[0] += point[0] * w;
            sum[1] += point[1] * w;
            weight += w;
          }
        }
        return [sum[0] / weight, sum[1] / weight];
      }) as Corners;
      return [[index, smoothed] as const];
    }),
  );

export const trackByColor = (
  masks: ColorMask[],
  frames: number[],
  anchorIndex: number,
  anchor: Corners,
): Map<number, Corners> => {
  const poses = new Map<number, Corners>([[anchorIndex, anchor]]);
  const walk = (order: number[]) => {
    let previous = anchor;
    for (const index of order) {
      const mask = masks[index];
      const found = mask === undefined ? null : fitCorners(mask, previous);
      if (found !== null && mask !== undefined) {
        previous = keepShape(found, previous, mask.width, mask.height);
        poses.set(index, previous);
      }
    }
  };
  walk(frames.filter((index) => index > anchorIndex));
  walk(frames.filter((index) => index < anchorIndex).reverse());
  return smoothRun(
    poses,
    [...frames].sort((a, b) => a - b),
  );
};
