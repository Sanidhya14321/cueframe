import * as THREE from 'three';

const hash = (x: number, y: number, seed: number): number => {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(seed, 2147483647);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

const fade = (t: number) => t * t * (3 - 2 * t);

const valueNoise = (x: number, y: number, seed = 1): number => {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = fade(x - ix);
  const fy = fade(y - iy);
  const a = hash(ix, iy, seed);
  const b = hash(ix + 1, iy, seed);
  const c = hash(ix, iy + 1, seed);
  const d = hash(ix + 1, iy + 1, seed);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
};

const wrap = (value: number, period: number) => ((value % period) + period) % period;

export const tiledNoise = (x: number, y: number, periodX: number, periodY: number, seed = 1) => {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = fade(x - ix);
  const fy = fade(y - iy);
  const x0 = wrap(ix, periodX);
  const x1 = wrap(ix + 1, periodX);
  const y0 = wrap(iy, periodY);
  const y1 = wrap(iy + 1, periodY);
  const a = hash(x0, y0, seed);
  const b = hash(x1, y0, seed);
  const c = hash(x0, y1, seed);
  const d = hash(x1, y1, seed);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
};

export const tiledFbm = (u: number, v: number, cellsX: number, cellsY: number, seed = 1) => {
  let value = 0;
  let amplitude = 0.5;
  let total = 0;
  for (let octave = 0; octave < 4; octave++) {
    const scale = 2 ** octave;
    value +=
      tiledNoise(
        u * cellsX * scale,
        v * cellsY * scale,
        cellsX * scale,
        cellsY * scale,
        seed + octave,
      ) * amplitude;
    total += amplitude;
    amplitude *= 0.5;
  }
  return value / total;
};

export const fbm = (x: number, y: number, seed = 1, octaves = 4): number => {
  let value = 0;
  let amplitude = 0.5;
  let total = 0;
  let px = x * 0.87 - y * 0.5;
  let py = x * 0.5 + y * 0.87;
  for (let octave = 0; octave < octaves; octave++) {
    value += valueNoise(px, py, seed + octave * 17) * amplitude;
    total += amplitude;
    const nextX = (px * 0.8 - py * 0.6) * 2.03 + 11.7;
    py = (px * 0.6 + py * 0.8) * 2.03 + 5.3;
    px = nextX;
    amplitude *= 0.5;
  }
  return value / total;
};

export interface PuddleShape {
  originX: number;
  originZ: number;
  angle: number;
  length: number;
  width: number;
  lead: number;
  ragged: number;
}

export const puddleDistance = (shape: PuddleShape, x: number, z: number): number => {
  const dx = x - shape.originX;
  const dz = z - shape.originZ;
  const cos = Math.cos(shape.angle);
  const sin = Math.sin(shape.angle);
  const along = dx * cos + dz * sin;
  const across = -dx * sin + dz * cos;
  const ahead = along - shape.length * shape.lead;
  const reach = ahead > 0 ? shape.length * (1 - shape.lead) : shape.length * shape.lead;
  const base = Math.hypot(ahead / reach, across / shape.width);
  const warp = (fbm(x * 1.6, z * 1.6, 7) - 0.5) * 0.9 + (fbm(x * 4, z * 4, 13) - 0.5) * 0.12;
  const toOrigin = Math.min(1, Math.hypot(dx, dz) / 0.25);
  return Math.max(0, base * (0.42 + 0.58 * toOrigin) + warp * shape.ragged * toOrigin);
};

export const halfFloatField = (
  size: number,
  sample: (u: number, v: number) => number,
): THREE.DataTexture => {
  const data = new Uint16Array(size * size);
  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      data[row * size + column] = THREE.DataUtils.toHalfFloat(
        sample((column + 0.5) / size, (row + 0.5) / size),
      );
    }
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RedFormat, THREE.HalfFloatType);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
};
