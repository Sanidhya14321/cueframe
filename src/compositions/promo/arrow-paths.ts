import type { ArrowShape } from '@/schemas';
import { type Point, resample, smoothstep } from './ink-geometry';

const SAMPLES = 180;

const sample = (count: number, at: (t: number) => Point): Point[] =>
  Array.from({ length: count }, (_, index) => at(index / (count - 1)));

const cubic = (p0: Point, p1: Point, p2: Point, p3: Point) => (t: number) => {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
};

const join = (...parts: Point[][]): Point[] =>
  parts.flatMap((part, index) => (index === 0 ? part : part.slice(1)));

const straight = (): Point[] =>
  sample(60, cubic({ x: -1, y: 0.34 }, { x: -0.35, y: 0.24 }, { x: 0.4, y: 0 }, { x: 1, y: -0.3 }));

const arc = (): Point[] =>
  sample(
    90,
    cubic(
      { x: -0.92, y: 0.5 },
      { x: -1.02, y: -0.62 },
      { x: 0.25, y: -0.74 },
      { x: 0.96, y: -0.38 },
    ),
  );

const wave = (): Point[] =>
  sample(140, (t) => ({
    x: -1 + 1.72 * t + 0.28 * smoothstep(0.7, 1, t),
    y:
      0.2 * Math.sin(t * Math.PI * 3.6) * (1 - smoothstep(0.6, 0.86, t)) -
      0.66 * smoothstep(0.66, 1, t) +
      0.18,
  }));

const zigzag = (): Point[] =>
  resample(
    [
      { x: -1, y: 0.42 },
      { x: -0.62, y: -0.08 },
      { x: -0.48, y: 0.36 },
      { x: -0.08, y: -0.12 },
      { x: 0.06, y: 0.3 },
      { x: 0.98, y: -0.5 },
    ],
    120,
  );

const loop = (): Point[] =>
  sample(150, (t) => {
    const theta = t * Math.PI * 2;
    return {
      x: -1 + 2 * t - 0.42 * Math.sin(theta),
      y: 0.12 - 0.36 * (1 - Math.cos(theta)) * 0.9 + 0.1 * t,
    };
  });

const spiral = (): Point[] => {
  const turns = 1.7;
  const coil = sample(140, (t) => {
    const theta = t * Math.PI * 2 * turns;
    const radius = 0.05 + 0.4 * t;
    return {
      x: -0.42 + radius * Math.cos(theta + Math.PI),
      y: 0.08 + radius * Math.sin(theta + Math.PI),
    };
  });
  const end = coil.at(-1) as Point;
  const previous = coil.at(-4) as Point;
  const tangent = { x: end.x - previous.x, y: end.y - previous.y };
  const scale = 0.5 / (Math.hypot(tangent.x, tangent.y) || 1);
  const tail = sample(
    60,
    cubic(
      end,
      { x: end.x + tangent.x * scale, y: end.y + tangent.y * scale },
      { x: 0.55, y: -0.25 },
      { x: 1, y: -0.52 },
    ),
  );
  return join(coil, tail);
};

const heartPoint = (t: number): Point => {
  const s = Math.sin(t);
  return {
    x: 0.024 * 16 * s * s * s,
    y:
      -0.024 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) -
      0.12,
  };
};

const heart = (): Point[] => {
  const bottom = heartPoint(Math.PI);
  const lead = sample(
    50,
    cubic({ x: -1, y: 0.5 }, { x: -0.6, y: 0.48 }, { x: -0.2, y: 0.44 }, bottom),
  );
  const shape = sample(130, (t) => heartPoint(Math.PI + t * Math.PI * 2));
  const tail = sample(
    50,
    cubic(bottom, { x: 0.25, y: 0.42 }, { x: 0.6, y: 0.2 }, { x: 1, y: 0.02 }),
  );
  return join(lead, shape, tail);
};

const squiggle = (): Point[] =>
  sample(150, (t) => ({
    x: -1 + 2 * t,
    y:
      0.14 * Math.sin(t * Math.PI * 7) * (0.6 + 0.4 * t) * (1 - smoothstep(0.82, 1, t)) -
      0.34 * t +
      0.16,
  }));

const SHAFTS: Record<ArrowShape, () => Point[]> = {
  straight,
  arc,
  wave,
  zigzag,
  loop,
  spiral,
  heart,
  squiggle,
};

export const arrowShaft = (shape: ArrowShape): Point[] => resample(SHAFTS[shape](), SAMPLES);

const rotate = (vector: Point, angle: number): Point => ({
  x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
  y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle),
});

export const arrowHead = (shaft: readonly Point[], size: number, spread = 0.5): Point[][] => {
  const tip = shaft.at(-1) as Point;
  const before = shaft.at(-Math.min(shaft.length, 10)) as Point;
  const length = Math.hypot(tip.x - before.x, tip.y - before.y) || 1;
  const back = { x: (before.x - tip.x) / length, y: (before.y - tip.y) / length };
  return [spread, -spread].map((angle) => {
    const barb = rotate(back, angle);
    const outer = { x: tip.x + barb.x * size, y: tip.y + barb.y * size };
    return resample([outer, tip], 24);
  });
};

export const scalePoints = (points: readonly Point[], scale: number): Point[] =>
  points.map((point) => ({ x: point.x * scale, y: point.y * scale }));
