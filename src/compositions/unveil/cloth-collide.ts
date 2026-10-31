import { BOARD } from './flight';

const THICKNESS = 0.07;
const FRICTION = 0.55;
const TOP = BOARD.centerY + BOARD.height / 2;
const BOTTOM = BOARD.centerY - BOARD.height / 2;

interface Box {
  min: [number, number, number];
  max: [number, number, number];
}

const SOLIDS: Box[] = [
  {
    min: [-BOARD.width / 2 - 0.32, BOTTOM - 0.32, -BOARD.depth - 0.5],
    max: [BOARD.width / 2 + 0.32, TOP + 0.32, 0.18],
  },
  {
    min: [-BOARD.width / 2 - 0.55, BOTTOM - 0.82, -0.4],
    max: [BOARD.width / 2 + 0.55, BOTTOM - 0.4, 1.5],
  },
];

const COLLIDERS: Box[] = SOLIDS.map((box) => ({
  min: [box.min[0] - THICKNESS, box.min[1] - THICKNESS, box.min[2] - THICKNESS],
  max: [box.max[0] + THICKNESS, box.max[1] + THICKNESS, box.max[2] + THICKNESS],
}));

const shallowestFace = (
  point: [number, number, number],
  box: Box,
): { axis: number; depth: number } | undefined => {
  let best: { axis: number; depth: number } | undefined;
  for (let axis = 0; axis < 3; axis++) {
    const below = (point[axis] ?? 0) - (box.min[axis] ?? 0);
    const above = (box.max[axis] ?? 0) - (point[axis] ?? 0);
    if (below <= 0 || above <= 0) {
      return undefined;
    }
    const depth = below < above ? -below : above;
    if (best === undefined || Math.abs(depth) < Math.abs(best.depth)) {
      best = { axis, depth };
    }
  }
  return best;
};

const resolve = (positions: Float64Array, previous: Float64Array, slot: number, box: Box): void => {
  const point: [number, number, number] = [
    positions[slot] ?? 0,
    positions[slot + 1] ?? 0,
    positions[slot + 2] ?? 0,
  ];
  const face = shallowestFace(point, box);
  if (face === undefined) {
    return;
  }
  positions[slot + face.axis] = (point[face.axis] ?? 0) + face.depth;
  for (let axis = 0; axis < 3; axis++) {
    if (axis !== face.axis) {
      const current = positions[slot + axis] ?? 0;
      previous[slot + axis] = current - (current - (previous[slot + axis] ?? 0)) * (1 - FRICTION);
    }
  }
};

export const collide = (positions: Float64Array, previous: Float64Array, count: number): void => {
  for (let particle = 0; particle < count; particle++) {
    for (const box of COLLIDERS) {
      resolve(positions, previous, particle * 3, box);
    }
  }
};
