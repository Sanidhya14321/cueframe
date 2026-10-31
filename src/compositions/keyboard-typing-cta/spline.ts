const solveTridiagonal = (
  lower: number[],
  diagonal: number[],
  upper: number[],
  right: number[],
): number[] => {
  const size = right.length;
  const pivot = [...diagonal];
  const value = [...right];
  for (let row = 1; row < size; row++) {
    const factor = (lower[row] ?? 0) / (pivot[row - 1] ?? 1);
    pivot[row] = (pivot[row] ?? 0) - factor * (upper[row - 1] ?? 0);
    value[row] = (value[row] ?? 0) - factor * (value[row - 1] ?? 0);
  }
  const result = new Array<number>(size).fill(0);
  for (let row = size - 1; row >= 0; row--) {
    result[row] =
      ((value[row] ?? 0) - (upper[row] ?? 0) * (result[row + 1] ?? 0)) / (pivot[row] ?? 1);
  }
  return result;
};

export const clampedSlopes = (frames: number[], values: number[]): number[] => {
  const inner = frames.slice(1, -1).map((frame, offset) => {
    const before = frame - (frames[offset] ?? 0);
    const after = (frames[offset + 2] ?? 0) - frame;
    const here = values[offset + 1] ?? 0;
    const rise = (here - (values[offset] ?? 0)) / before;
    const run = ((values[offset + 2] ?? 0) - here) / after;
    return { before, after, right: 3 * (after * rise + before * run) };
  });
  const solved = solveTridiagonal(
    inner.map((row) => row.after),
    inner.map((row) => 2 * (row.before + row.after)),
    inner.map((row) => row.before),
    inner.map((row) => row.right),
  );
  return frames.length < 3 ? frames.map(() => 0) : [0, ...solved, 0];
};

export type Point = [number, number];

export const hermite = (
  from: Point,
  to: Point,
  slopes: [Point, Point],
  span: number,
  t: number,
): Point => {
  const [m0, m1] = slopes;
  const h00 = 2 * t ** 3 - 3 * t ** 2 + 1;
  const h10 = t ** 3 - 2 * t ** 2 + t;
  const h01 = -2 * t ** 3 + 3 * t ** 2;
  const h11 = t ** 3 - t ** 2;
  return [
    h00 * from[0] + h10 * span * m0[0] + h01 * to[0] + h11 * span * m1[0],
    h00 * from[1] + h10 * span * m0[1] + h01 * to[1] + h11 * span * m1[1],
  ];
};
