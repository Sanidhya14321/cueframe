import * as THREE from 'three';
import { seeded } from '../unveil/random';

export interface CrumpleShape {
  width: number;
  height: number;
  ballRadius: number;
  lumps: number;
  creases: number;
  creaseDepth: number;
  leftoverWrinkles: number;
  seed: number;
}

interface Crease {
  x: number;
  y: number;
  dx: number;
  dy: number;
  half: number;
  reach: number;
  depth: number;
}

interface Lump {
  direction: THREE.Vector3;
  frequency: number;
  phase: number;
  amplitude: number;
}

interface CrumplePattern {
  creases: Crease[];
  lumps: Lump[];
}

const FLAT_RADIUS = 60;
const WRAP_LIMIT = Math.PI * 0.93;
const UNFOLD_LAG = 0.7;
const BALL_WRAP = 1.6;
const EDGE_CURL = 3;
const EDGE_BAND = 0.32;
const LEFTOVER = 6.5;
const GEOMETRY_SHARE = 0.5;
const WAVE = 1.3;

const patterns = new Map<string, CrumplePattern>();

const patternFor = (shape: CrumpleShape): CrumplePattern => {
  const key = `${shape.seed}:${shape.creases}:${shape.width}:${shape.height}`;
  const hit = patterns.get(key);
  if (hit !== undefined) {
    return hit;
  }
  const random = seeded(shape.seed * 7919);
  const span = Math.max(shape.width, shape.height);
  const creases = Array.from({ length: Math.round(shape.creases) }, () => {
    const angle = random() * Math.PI;
    const long = random() < 0.45;
    return {
      x: (random() - 0.5) * shape.width * 1.1,
      y: (random() - 0.5) * shape.height * 1.1,
      dx: Math.cos(angle),
      dy: Math.sin(angle),
      half: span * (long ? 0.12 + random() * 0.22 : 0.04 + random() * 0.07),
      reach: span * (long ? 0.035 + random() * 0.045 : 0.015 + random() * 0.025),
      depth: (random() < 0.5 ? -1 : 1) * (0.45 + random() * 0.55),
    };
  });
  const lumps = Array.from({ length: 9 }, (_unused, index) => ({
    direction: new THREE.Vector3(random() - 0.5, random() - 0.5, random() - 0.5).normalize(),
    frequency: 1.6 + index * 0.55 + random(),
    phase: random() * Math.PI * 2,
    amplitude: 1 / (1 + index * 0.45),
  }));
  const pattern = { creases, lumps };
  patterns.set(key, pattern);
  return pattern;
};

export const smoothstep = (edge0: number, edge1: number, value: number): number => {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

const creaseAt = (crease: Crease, x: number, y: number): number => {
  const rx = x - crease.x;
  const ry = y - crease.y;
  const across = Math.abs(rx * crease.dy - ry * crease.dx);
  if (across >= crease.reach) {
    return 0;
  }
  const along = Math.abs(rx * crease.dx + ry * crease.dy) / crease.half;
  const fade = 1 - smoothstep(0.6, 1, along);
  return fade <= 0 ? 0 : crease.depth * crease.reach * (1 - across / crease.reach) * fade;
};

const edgeBoost = (shape: CrumpleShape, x: number, y: number, opened: number): number => {
  const inset = Math.min(shape.width / 2 - Math.abs(x), shape.height / 2 - Math.abs(y));
  return 1 + EDGE_CURL * opened * (1 - smoothstep(0, EDGE_BAND, inset));
};

const creaseField = (creases: Crease[], x: number, y: number): number => {
  let sum = 0;
  for (const crease of creases) {
    sum += creaseAt(crease, x, y);
  }
  return sum;
};

const lumpField = (lumps: Lump[], direction: THREE.Vector3): number =>
  lumps.reduce(
    (sum, lump) =>
      sum +
      Math.sin(direction.dot(lump.direction) * lump.frequency * 3 + lump.phase) * lump.amplitude,
    0,
  ) / 3;

export interface CrumpleState {
  unfold: number;
  scale: number;
}

const sphereDirection = new THREE.Vector3();

export const crumplePoint = (
  shape: CrumpleShape,
  state: CrumpleState,
  x: number,
  y: number,
  target: THREE.Vector3,
  withRelief = true,
): THREE.Vector3 => {
  const pattern = patternFor(shape);
  const corner = Math.hypot(shape.width, shape.height) / 2;
  const flatDistance = Math.hypot(x, y);
  const creases = withRelief ? creaseField(pattern.creases, x, y) : 0;
  const angle = Math.atan2(y, x);
  const ragged =
    1 + 0.32 * Math.sin(angle * 3 + shape.seed) + 0.18 * Math.sin(angle * 5 - shape.seed * 1.7);
  const local = Math.min(
    1,
    Math.max(0, state.unfold * (1 + UNFOLD_LAG) - (UNFOLD_LAG * flatDistance * ragged) / corner),
  );
  const opened = smoothstep(0, 1, local);
  const radius = shape.ballRadius / Math.max(1 - opened, shape.ballRadius / FLAT_RADIUS);
  const edge = Math.min(
    shape.width / 2 / Math.max(1e-6, Math.abs(Math.cos(angle))),
    shape.height / 2 / Math.max(1e-6, Math.abs(Math.sin(angle))),
  );
  const ballArc = shape.ballRadius * BALL_WRAP * WRAP_LIMIT * (flatDistance / edge) ** 0.85;
  const arc = ballArc + (flatDistance - ballArc) * opened;
  const wrap = arc / radius;
  const theta = WRAP_LIMIT * Math.tanh(wrap / WRAP_LIMIT);
  const squeeze = theta > 1e-6 ? Math.max(1, flatDistance / radius / theta) : 1;
  sphereDirection.set(
    Math.sin(theta) * Math.cos(angle),
    Math.sin(theta) * Math.sin(angle),
    Math.cos(theta),
  );
  const balled = 1 - opened;
  const depth = reliefDepth(shape, opened, squeeze);
  const lump =
    shape.ballRadius * shape.lumps * 0.45 * lumpField(pattern.lumps, sphereDirection) * balled;
  const relief =
    creases * depth * (balled + opened * GEOMETRY_SHARE) * edgeBoost(shape, x, y, opened);
  const limit = shape.ballRadius * 0.16 + opened * 0.4;
  const wave =
    opened *
    shape.creaseDepth *
    WAVE *
    (Math.sin(1.9 * x + shape.seed) * Math.cos(1.4 * y - shape.seed * 0.7) +
      0.5 * Math.sin(3.1 * y + 2.3 * x + shape.seed));
  const surface = radius + lump + wave + Math.max(-limit, Math.min(limit, relief));
  const ballLift = shape.ballRadius * (1 - smoothstep(0, 1, state.unfold));
  return target
    .copy(sphereDirection)
    .multiplyScalar(surface)
    .setZ(radius - sphereDirection.z * surface - ballLift)
    .multiplyScalar(state.scale);
};

const reliefDepth = (shape: CrumpleShape, opened: number, squeeze = 1.4): number =>
  shape.creaseDepth *
  ((1 - opened) * 6 * Math.sqrt(squeeze) +
    shape.leftoverWrinkles * LEFTOVER * (0.35 + 0.65 * opened));

export const SEGMENTS_X = 120;
export const SEGMENTS_Y = 166;

export const deformSheet = (
  geometry: THREE.BufferGeometry,
  rest: Float32Array,
  shape: CrumpleShape,
  state: CrumpleState,
): void => {
  const position = geometry.getAttribute('position');
  if (!(position instanceof THREE.BufferAttribute)) {
    return;
  }
  const array = position.array as Float32Array;
  const point = new THREE.Vector3();
  const place = (withRelief: boolean) => {
    for (let index = 0; index < position.count; index++) {
      crumplePoint(shape, state, rest[index * 3] ?? 0, rest[index * 3 + 1] ?? 0, point, withRelief);
      array[index * 3] = point.x;
      array[index * 3 + 1] = point.y;
      array[index * 3 + 2] = point.z;
    }
    position.needsUpdate = true;
  };
  place(false);
  geometry.computeVertexNormals();
  place(true);
  geometry.computeBoundingSphere();
};
