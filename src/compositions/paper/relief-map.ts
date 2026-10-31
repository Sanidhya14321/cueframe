import * as THREE from 'three';
import { seeded } from '../unveil/random';
import type { CrumpleShape } from './crumple';

const MAP_WIDTH = 2048;
const CRINKLES = 2600;

const CRINKLE_SLOPE = 0.18;

const maps = new Map<string, THREE.DataTexture>();

interface Grid {
  width: number;
  height: number;
  rows: number;
  pixel: number;
}

const columnX = (grid: Grid, column: number) => (column + 0.5) * grid.pixel - grid.width / 2;

const rowY = (grid: Grid, row: number) => grid.height / 2 - (row + 0.5) * grid.pixel;

const bounds = (grid: Grid, x: number, y: number, extentX: number, extentY: number) => ({
  left: Math.max(0, Math.floor((x - extentX + grid.width / 2) / grid.pixel)),
  right: Math.min(MAP_WIDTH - 1, Math.ceil((x + extentX + grid.width / 2) / grid.pixel)),
  top: Math.max(0, Math.floor((grid.height / 2 - (y + extentY)) / grid.pixel)),
  bottom: Math.min(grid.rows - 1, Math.ceil((grid.height / 2 - (y - extentY)) / grid.pixel)),
});

interface FacetLayer {
  size: number;
  slope: number;
  sign: number;
}

const FACET_LAYERS: FacetLayer[] = [
  { size: 0.26, slope: 0.62, sign: 1 },
  { size: 0.09, slope: 0.3, sign: -1 },
];

interface FacetSeed {
  x: number;
  y: number;
  lift: number;
  cos: number;
  sin: number;
  stretch: number;
}

const coneAt = (seed: FacetSeed, x: number, y: number, slope: number) => {
  const u = (x - seed.x) * seed.cos + (y - seed.y) * seed.sin;
  const v = (y - seed.y) * seed.cos - (x - seed.x) * seed.sin;
  return seed.lift - slope * Math.hypot(u / seed.stretch, v * seed.stretch);
};

const peakAt = (
  seeds: FacetSeed[],
  columns: number,
  cellX: number,
  cellY: number,
  x: number,
  y: number,
  slope: number,
): number => {
  let peak = Number.NEGATIVE_INFINITY;
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const seed = seeds[(cellY + dy) * columns + cellX + dx];
      peak = seed === undefined ? peak : Math.max(peak, coneAt(seed, x, y, slope));
    }
  }
  return Number.isFinite(peak) ? peak : 0;
};

const bakeFacets = (
  grid: Grid,
  shape: CrumpleShape,
  layer: FacetLayer,
  layerIndex: number,
  heights: Float32Array,
) => {
  const random = seeded(shape.seed * 6151 + layerIndex * 97 + 3);
  const columns = Math.ceil(grid.width / layer.size) + 4;
  const cellRows = Math.ceil(grid.height / layer.size) + 4;
  const seeds: FacetSeed[] = Array.from({ length: columns * cellRows }, (_unused, index) => {
    const angle = random() * Math.PI;
    return {
      x: ((index % columns) - 2 + random()) * layer.size - grid.width / 2,
      y: (Math.floor(index / columns) - 2 + random()) * layer.size - grid.height / 2,
      lift: random() * layer.size * layer.slope * 0.7,
      cos: Math.cos(angle),
      sin: Math.sin(angle),
      stretch: 0.6 + random() * 0.9,
    };
  });
  for (let row = 0; row < grid.rows; row++) {
    const y = rowY(grid, row);
    const cellY = Math.floor((y + grid.height / 2) / layer.size) + 2;
    for (let column = 0; column < MAP_WIDTH; column++) {
      const x = columnX(grid, column);
      const cellX = Math.floor((x + grid.width / 2) / layer.size) + 2;
      const index = row * MAP_WIDTH + column;
      heights[index] =
        (heights[index] ?? 0) +
        layer.sign * peakAt(seeds, columns, cellX, cellY, x, y, layer.slope);
    }
  }
};

const bakeCrinkles = (grid: Grid, seed: number, heights: Float32Array) => {
  const random = seeded(seed * 104_729 + 17);
  for (let index = 0; index < CRINKLES; index++) {
    const x = (random() - 0.5) * grid.width;
    const y = (random() - 0.5) * grid.height;
    const angle = random() * Math.PI;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    const half = 0.025 + random() * 0.09;
    const reach = 0.01 + random() * 0.025;
    const depth = (random() < 0.5 ? -1 : 1) * (0.35 + random() * 0.65);
    const box = bounds(grid, x, y, Math.abs(dx) * half + reach, Math.abs(dy) * half + reach);
    for (let row = box.top; row <= box.bottom; row++) {
      const py = rowY(grid, row) - y;
      for (let column = box.left; column <= box.right; column++) {
        const px = columnX(grid, column) - x;
        const across = Math.abs(px * dy - py * dx);
        const along = Math.abs(px * dx + py * dy) / half;
        if (across >= reach || along >= 1) {
          continue;
        }
        const cell = row * MAP_WIDTH + column;
        heights[cell] =
          (heights[cell] ?? 0) + CRINKLE_SLOPE * depth * (reach - across) * (1 - along * along);
      }
    }
  }
};

export const reliefMap = (shape: CrumpleShape): THREE.DataTexture => {
  const key = `${shape.width}:${shape.height}:${shape.seed}:${shape.creases}`;
  const hit = maps.get(key);
  if (hit !== undefined) {
    return hit;
  }
  const rows = Math.round((MAP_WIDTH * shape.height) / shape.width);
  const grid: Grid = {
    width: shape.width,
    height: shape.height,
    rows,
    pixel: shape.width / MAP_WIDTH,
  };
  const heights = new Float32Array(MAP_WIDTH * rows);
  FACET_LAYERS.forEach((layer, index) => {
    bakeFacets(grid, shape, layer, index, heights);
  });
  bakeCrinkles(grid, shape.seed, heights);
  const data = new Uint8Array(MAP_WIDTH * rows * 4);
  const at = (column: number, row: number) =>
    heights[
      Math.min(rows - 1, Math.max(0, row)) * MAP_WIDTH +
        Math.min(MAP_WIDTH - 1, Math.max(0, column))
    ] ?? 0;
  const normal = new THREE.Vector3();
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < MAP_WIDTH; column++) {
      const slopeX = (at(column + 1, row) - at(column - 1, row)) / (2 * grid.pixel);
      const slopeY = (at(column, row - 1) - at(column, row + 1)) / (2 * grid.pixel);
      normal.set(-slopeX, -slopeY, 1).normalize();
      const offset = ((rows - 1 - row) * MAP_WIDTH + column) * 4;
      data[offset] = Math.round((normal.x * 0.5 + 0.5) * 255);
      data[offset + 1] = Math.round((normal.y * 0.5 + 0.5) * 255);
      data[offset + 2] = Math.round((normal.z * 0.5 + 0.5) * 255);
      data[offset + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(data, MAP_WIDTH, rows, THREE.RGBAFormat);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  maps.set(key, texture);
  return texture;
};
