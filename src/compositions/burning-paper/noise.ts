const hash = (x: number, y: number): number => {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return value - Math.floor(value);
};

const fade = (t: number): number => t * t * t * (t * (t * 6 - 15) + 10);

const gradient = (ix: number, iy: number, dx: number, dy: number): number => {
  const angle = hash(ix, iy) * Math.PI * 2;
  return Math.cos(angle) * dx + Math.sin(angle) * dy;
};

const noise2 = (x: number, y: number): number => {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const u = fade(fx);
  const v = fade(fy);
  const a = gradient(ix, iy, fx, fy);
  const b = gradient(ix + 1, iy, fx - 1, fy);
  const c = gradient(ix, iy + 1, fx, fy - 1);
  const d = gradient(ix + 1, iy + 1, fx - 1, fy - 1);
  return (a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v) * 1.41;
};

export const fbm = (x: number, y: number, octaves = 3): number => {
  let total = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let norm = 0;
  for (let octave = 0; octave < octaves; octave++) {
    total += noise2(x * frequency + octave * 17.3, y * frequency - octave * 9.1) * amplitude;
    norm += amplitude;
    amplitude *= 0.5;
    frequency *= 2.03;
  }
  return total / norm;
};

export const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0 || 1)));
  return t * t * (3 - 2 * t);
};

export const monotoneCurve = (points: [number, number][], x: number): number => {
  const first = points[0];
  const last = points.at(-1);
  if (first === undefined || last === undefined) {
    return 0;
  }
  if (x <= first[0]) {
    return first[1];
  }
  if (x >= last[0]) {
    return last[1];
  }
  const slopes = points.slice(1).map(([px, py], slot) => {
    const [qx, qy] = points[slot] ?? first;
    return (py - qy) / Math.max(0.001, px - qx);
  });
  const tangents = points.map((_, slot) => {
    const before = slopes[slot - 1];
    const after = slopes[slot];
    if (before === undefined) {
      return after ?? 0;
    }
    if (after === undefined) {
      return 0;
    }
    return before * after <= 0 ? 0 : (2 * before * after) / (before + after);
  });
  const index = Math.max(0, points.findIndex(([px]) => px > x) - 1);
  const [x0, y0] = points[index] ?? first;
  const [x1, y1] = points[index + 1] ?? last;
  const span = Math.max(0.001, x1 - x0);
  const t = (x - x0) / span;
  const m0 = (tangents[index] ?? 0) * span;
  const m1 = (tangents[index + 1] ?? 0) * span;
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    (2 * t3 - 3 * t2 + 1) * y0 + (t3 - 2 * t2 + t) * m0 + (-2 * t3 + 3 * t2) * y1 + (t3 - t2) * m1
  );
};
