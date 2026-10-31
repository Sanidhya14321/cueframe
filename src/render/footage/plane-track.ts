import { type Quad, squareToQuad } from '@/compositions/footage/homography';

export type Plane = { gray: Uint8Array; usable: Uint8Array; width: number; height: number };

export type Corners = [[number, number], [number, number], [number, number], [number, number]];

const SKIN_TINT = 0.24;
const MIN_COVERAGE = 0.35;
const HUBER = 1;
const EPSILON = 0.25;

export const toPlane = (rgb: Uint8Array, width: number, height: number): Plane => {
  const gray = new Uint8Array(width * height);
  const usable = new Uint8Array(width * height);
  for (let index = 0; index < width * height; index += 1) {
    const red = rgb[index * 3] ?? 0;
    const green = rgb[index * 3 + 1] ?? 0;
    const blue = rgb[index * 3 + 2] ?? 0;
    const high = Math.max(red, green, blue);
    const tint = high === 0 ? 0 : (high - Math.min(red, green, blue)) / high;
    gray[index] = Math.round(0.2126 * red + 0.7152 * green + 0.0722 * blue);
    usable[index] = tint > SKIN_TINT && high > 60 ? 0 : 1;
  }
  return { gray, usable, width, height };
};

export const halve = (plane: Plane): Plane => {
  const width = Math.floor(plane.width / 2);
  const height = Math.floor(plane.height / 2);
  const gray = new Uint8Array(width * height);
  const usable = new Uint8Array(width * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const a = 2 * y * plane.width + 2 * x;
      const b = a + plane.width;
      const sum =
        (plane.gray[a] ?? 0) +
        (plane.gray[a + 1] ?? 0) +
        (plane.gray[b] ?? 0) +
        (plane.gray[b + 1] ?? 0);
      gray[y * width + x] = Math.round(sum / 4);
      usable[y * width + x] =
        (plane.usable[a] ?? 0) &
        (plane.usable[a + 1] ?? 0) &
        (plane.usable[b] ?? 0) &
        (plane.usable[b + 1] ?? 0);
    }
  }
  return { gray, usable, width, height };
};

const pixel = (plane: Plane, x: number, y: number) => plane.gray[y * plane.width + x] ?? 0;

const sample = (plane: Plane, x: number, y: number): number => {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const top = pixel(plane, x0, y0) * (1 - fx) + pixel(plane, x0 + 1, y0) * fx;
  const bottom = pixel(plane, x0, y0 + 1) * (1 - fx) + pixel(plane, x0 + 1, y0 + 1) * fx;
  return top * (1 - fy) + bottom * fy;
};

export type Grid = { u: Float64Array; v: Float64Array };

export const makeGrid = (columns: number, rows: number, margin: number): Grid => {
  const u = new Float64Array(columns * rows);
  const v = new Float64Array(columns * rows);
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      u[row * columns + column] = -margin + ((1 + 2 * margin) * column) / (columns - 1);
      v[row * columns + column] = -margin + ((1 + 2 * margin) * row) / (rows - 1);
    }
  }
  return { u, v };
};

const warp = (corners: Corners, grid: Grid, scale: number): Float64Array => {
  const scaled = corners.map(([x, y]) => [x * scale, y * scale] as const) as unknown as Quad;
  const map = squareToQuad(scaled);
  const points = new Float64Array(grid.u.length * 2);
  for (let index = 0; index < grid.u.length; index += 1) {
    const [x, y] = map(grid.u[index] ?? 0, grid.v[index] ?? 0);
    points[index * 2] = x;
    points[index * 2 + 1] = y;
  }
  return points;
};

const inside = (plane: Plane, x: number, y: number) =>
  x >= 1 && y >= 1 && x < plane.width - 2 && y < plane.height - 2;

export const sampleTemplate = (plane: Plane, corners: Corners, grid: Grid, scale: number) => {
  const points = warp(corners, grid, scale);
  return Float64Array.from(grid.u, (_, index) => {
    const x = points[index * 2] ?? 0;
    const y = points[index * 2 + 1] ?? 0;
    return inside(plane, x, y) ? sample(plane, x, y) : Number.NaN;
  });
};

const pivotRow = (rows: number[][], column: number): number => {
  let pivot = column;
  for (let row = column + 1; row < rows.length; row += 1) {
    if (Math.abs(rows[row]?.[column] ?? 0) > Math.abs(rows[pivot]?.[column] ?? 0)) {
      pivot = row;
    }
  }
  return pivot;
};

const eliminate = (rows: number[][], column: number) => {
  const lead = rows[column] ?? [];
  const leadValue = lead[column] ?? 0;
  rows.forEach((row, index) => {
    if (index === column) {
      return;
    }
    const factor = (row[column] ?? 0) / leadValue;
    for (let k = column; k < row.length; k += 1) {
      row[k] = (row[k] ?? 0) - factor * (lead[k] ?? 0);
    }
  });
};

const solve = (matrix: number[][], vector: number[]): number[] => {
  const size = vector.length;
  const rows = matrix.map((row, index) => [...row, vector[index] ?? 0]);
  for (let column = 0; column < size; column += 1) {
    const pivot = pivotRow(rows, column);
    [rows[column], rows[pivot]] = [rows[pivot] ?? [], rows[column] ?? []];
    if (Math.abs(rows[column]?.[column] ?? 0) < 1e-12) {
      return new Array(size).fill(0);
    }
    eliminate(rows, column);
  }
  return rows.map((row, index) => (row[size] ?? 0) / (row[index] ?? 1));
};

const stats = (values: number[]) => {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return { mean, deviation: Math.sqrt(variance) || 1 };
};

export type Align = {
  plane: Plane;
  template: Float64Array;
  grid: Grid;
  scale: number;
  allowed: (x: number) => boolean;
};

export type Motion = 'full' | 'shift';

const DIRECTIONS: Record<Motion, number[][]> = {
  full: Array.from({ length: 8 }, (_, axis) =>
    Array.from({ length: 8 }, (__, k) => (k === axis ? 1 : 0)),
  ),
  shift: [
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
  ],
};

const move = (corners: Corners, direction: number[], amount: number): Corners =>
  corners.map(([x, y], corner) => [
    x + (direction[corner * 2] ?? 0) * amount,
    y + (direction[corner * 2 + 1] ?? 0) * amount,
  ]) as Corners;

const usableIndices = (points: Float64Array, { plane, template, grid, scale, allowed }: Align) => {
  const chosen: number[] = [];
  for (let index = 0; index < grid.u.length; index += 1) {
    const x = points[index * 2] ?? 0;
    const y = points[index * 2 + 1] ?? 0;
    if (
      inside(plane, x, y) &&
      !Number.isNaN(template[index] ?? Number.NaN) &&
      allowed(x / scale) &&
      (plane.usable[Math.round(y) * plane.width + Math.round(x)] ?? 0) === 1
    ) {
      chosen.push(index);
    }
  }
  return chosen;
};

const normalEquations = (
  points: Float64Array,
  moved: Float64Array[],
  chosen: number[],
  { plane, template }: Align,
) => {
  const size = moved.length;
  const image = chosen.map((index) =>
    sample(plane, points[index * 2] ?? 0, points[index * 2 + 1] ?? 0),
  );
  const imageStats = stats(image);
  const referenceStats = stats(chosen.map((index) => template[index] ?? 0));
  const normal = Array.from({ length: size }, () => new Array(size).fill(0) as number[]);
  const gradient = new Array(size).fill(0) as number[];
  chosen.forEach((index, at) => {
    const x = points[index * 2] ?? 0;
    const y = points[index * 2 + 1] ?? 0;
    const gx = (sample(plane, x + 1, y) - sample(plane, x - 1, y)) / 2;
    const gy = (sample(plane, x, y + 1) - sample(plane, x, y - 1)) / 2;
    const residual =
      ((image[at] ?? 0) - imageStats.mean) / imageStats.deviation -
      ((template[index] ?? 0) - referenceStats.mean) / referenceStats.deviation;
    const weight = Math.abs(residual) < HUBER ? 1 : HUBER / Math.abs(residual);
    const jacobian = moved.map(
      (shifted) =>
        (gx * ((shifted[index * 2] ?? 0) - x) + gy * ((shifted[index * 2 + 1] ?? 0) - y)) /
        EPSILON /
        imageStats.deviation,
    );
    jacobian.forEach((ja, a) => {
      gradient[a] = (gradient[a] ?? 0) - weight * ja * residual;
      jacobian.forEach((jb, b) => {
        (normal[a] as number[])[b] = (normal[a]?.[b] ?? 0) + weight * ja * jb;
      });
    });
  });
  normal.forEach((row, a) => {
    row[a] = (row[a] ?? 0) * 1.05 + 1e-6;
  });
  return solve(normal, gradient);
};

const step = (corners: Corners, align: Align, motion: Motion) => {
  const points = warp(corners, align.grid, align.scale);
  const chosen = usableIndices(points, align);
  const coverage = chosen.length / align.grid.u.length;
  if (chosen.length < 64) {
    return { delta: null, coverage };
  }
  const moved = DIRECTIONS[motion].map((direction) =>
    warp(move(corners, direction, EPSILON), align.grid, align.scale),
  );
  return { delta: normalEquations(points, moved, chosen, align), coverage };
};

export const alignCorners = (start: Corners, align: Align, motion: Motion, iterations = 25) => {
  let corners = start.map(([x, y]) => [x, y]) as Corners;
  for (let round = 0; round < iterations; round += 1) {
    const { delta, coverage } = step(corners, align, motion);
    if (delta === null || coverage < MIN_COVERAGE) {
      return start;
    }
    corners = DIRECTIONS[motion].reduce(
      (current, direction, axis) => move(current, direction, delta[axis] ?? 0),
      corners,
    );
    if (Math.max(...delta.map(Math.abs)) < 0.01) {
      break;
    }
  }
  return corners;
};
