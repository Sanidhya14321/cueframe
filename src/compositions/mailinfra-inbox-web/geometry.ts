import { random } from 'remotion';
import type { MailinfraInboxWebProps } from '@/schemas';

export type Point = { x: number; y: number };

type Junction = Point & { index: number; fraction: number; radial: number };

export type EnvelopeTarget = Point & { origin: Point; tilt: number; junction: number };

export type WebGeometry = {
  vertices: Point[];
  radialEnds: Point[];
  radialAngles: number[];
  frameStart: Point;
  frameLoop: Point[];
  spiral: Junction[];
  spiralLengths: number[];
  dew: { index: number; phase: number }[];
  envelopes: EnvelopeTarget[];
};

const SPIRAL_START = 0.16;
const SPIRAL_END = 0.93;

const polar = (angle: number, radius: number): Point => ({
  x: Math.cos(angle) * radius,
  y: Math.sin(angle) * radius,
});

const distance = (a: Point, b: Point): number => Math.hypot(a.x - b.x, a.y - b.y);

const rayHitsSegment = (angle: number, a: Point, b: Point): number | null => {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const ex = b.x - a.x;
  const ey = b.y - a.y;
  const denominator = dx * ey - dy * ex;
  if (Math.abs(denominator) < 1e-9) {
    return null;
  }
  const t = (a.x * ey - a.y * ex) / denominator;
  const u = (a.x * dy - a.y * dx) / denominator;
  return t > 0 && u >= -1e-6 && u <= 1 + 1e-6 ? t : null;
};

const rayToPolygon = (angle: number, polygon: Point[]): number => {
  let nearest = Number.POSITIVE_INFINITY;
  polygon.forEach((point, index) => {
    const next = polygon[(index + 1) % polygon.length] ?? point;
    const hit = rayHitsSegment(angle, point, next);
    if (hit !== null && hit < nearest) {
      nearest = hit;
    }
  });
  return Number.isFinite(nearest) ? nearest : 0;
};

const TOP = Math.PI / 2;

const normalizeAngle = (angle: number): number => {
  const turn = Math.PI * 2;
  return (((angle - TOP) % turn) + turn) % turn;
};

const pickEnvelopes = (
  spiral: Junction[],
  count: number,
  size: number,
  key: string,
  keepOut: (point: Point) => boolean,
): EnvelopeTarget[] => {
  const candidates = spiral
    .filter((junction) => junction.fraction > 0.38 && junction.radial !== 0 && !keepOut(junction))
    .map((junction) => ({ junction, order: random(`${key}-pick-${junction.index}`) }))
    .sort((a, b) => a.order - b.order)
    .map((entry) => entry.junction);
  const chosen: Junction[] = [];
  let spacing = size * 0.42;
  while (chosen.length < count && spacing > 1) {
    for (const junction of candidates) {
      if (chosen.length >= count) {
        break;
      }
      if (
        !chosen.includes(junction) &&
        chosen.every((other) => distance(other, junction) >= spacing)
      ) {
        chosen.push(junction);
      }
    }
    spacing *= 0.8;
  }
  return chosen.map((junction, order) => {
    const side = junction.x === 0 ? (order % 2 === 0 ? 1 : -1) : Math.sign(junction.x);
    const lift =
      Math.min(0.35, Math.max(-0.35, junction.y / 600)) +
      (random(`${key}-swerve-${order}`) - 0.5) * 0.2;
    const length = Math.hypot(1, lift);
    const reach = 980 - Math.abs(junction.x);
    return {
      x: junction.x,
      y: junction.y,
      junction: junction.index,
      tilt: (random(`${key}-tilt-${order}`) - 0.5) * 28,
      origin: {
        x: junction.x + (side / length) * reach,
        y: junction.y + (lift / length) * reach,
      },
    };
  });
};

const lockupKeepOut = (props: MailinfraInboxWebProps): ((point: Point) => boolean) => {
  const { wordmark, envelopes, camera } = props;
  const zoom = camera.endZoom;
  const margin = envelopes.size * 0.75;
  const textWidth = Math.max(
    wordmark.size * 0.58 * wordmark.text.length,
    wordmark.taglineSize * 0.5 * wordmark.tagline.length,
    wordmark.urlSize * 0.75 * wordmark.url.length,
  );
  const top = (wordmark.threadLength - wordmark.size * 0.1) / zoom - margin;
  const bottom =
    (wordmark.threadLength +
      wordmark.size * 1.2 +
      wordmark.taglineGap +
      wordmark.taglineSize * 1.5 +
      wordmark.urlGap +
      wordmark.urlSize * 2.2) /
      zoom +
    margin;
  const half = textWidth / 2 / zoom + margin;
  return (point) => point.y > top && point.y < bottom && Math.abs(point.x) < half;
};

export const buildWeb = (props: MailinfraInboxWebProps): WebGeometry => {
  const { web, envelopes } = props;
  const key = `inbox-web-${web.seed}`;
  const sides = Math.max(3, Math.round(web.frameSides));
  const radialCount = Math.max(3, Math.round(web.radials));
  const vertices = Array.from({ length: sides }, (_, index) => {
    const jitter = (random(`${key}-vertex-angle-${index}`) - 0.5) * (Math.PI / sides) * 0.9;
    const angle = TOP + ((index + 0.5) / sides) * Math.PI * 2 + jitter;
    const radius = web.size * (1 - web.wobble * random(`${key}-vertex-radius-${index}`));
    return polar(angle, radius);
  });
  const radialAngles = Array.from({ length: radialCount }, (_, index) => {
    const jitter =
      index === 0
        ? 0
        : (random(`${key}-radial-${index}`) - 0.5) * ((Math.PI * 2) / radialCount) * web.wobble * 2;
    return TOP + (index / radialCount) * Math.PI * 2 + jitter;
  });
  const radialEnds = radialAngles.map((angle) => polar(angle, rayToPolygon(angle, vertices)));
  const frameStart = radialEnds[0] ?? { x: 0, y: web.size };
  const ordered = vertices
    .map((point) => ({ point, angle: normalizeAngle(Math.atan2(point.y, point.x)) }))
    .sort((a, b) => a.angle - b.angle)
    .map((entry) => entry.point);
  const frameLoop = [frameStart, ...ordered, frameStart];
  const turns = Math.max(1, Math.round(web.spiralTurns));
  const steps = turns * radialCount;
  const spiral: Junction[] = Array.from({ length: steps + 1 }, (_, index) => {
    const radial = index % radialCount;
    const spacing = (SPIRAL_END - SPIRAL_START) / turns;
    const jitter =
      index === 0 || index === steps
        ? 0
        : (random(`${key}-spiral-${index}`) - 0.5) * spacing * web.wobble * 1.6;
    const fraction = SPIRAL_START + (SPIRAL_END - SPIRAL_START) * (index / steps) + jitter;
    const end = radialEnds[radial] ?? frameStart;
    return { x: end.x * fraction, y: end.y * fraction, index, fraction, radial };
  });
  const spiralLengths = polylineLength(spiral);
  const dew = spiral
    .filter((junction) => random(`${key}-dew-${junction.index}`) < web.dew * 0.4)
    .map((junction) => ({
      index: junction.index,
      phase: random(`${key}-dew-phase-${junction.index}`) * Math.PI * 2,
    }));
  return {
    vertices,
    radialEnds,
    radialAngles,
    frameStart,
    frameLoop,
    spiral,
    spiralLengths,
    dew,
    envelopes: pickEnvelopes(
      spiral,
      Math.round(envelopes.count),
      web.size,
      key,
      lockupKeepOut(props),
    ),
  };
};

export const sagPath = (points: Point[], sag: number): string => {
  const first = points[0];
  if (first === undefined) {
    return '';
  }
  const segments = points.slice(1).map((point, index) => {
    const previous = points[index] ?? first;
    const mid = { x: (previous.x + point.x) / 2, y: (previous.y + point.y) / 2 };
    return `Q ${(mid.x * (1 - sag)).toFixed(2)} ${(mid.y * (1 - sag)).toFixed(2)} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  });
  return `M ${first.x.toFixed(2)} ${first.y.toFixed(2)} ${segments.join(' ')}`;
};

export const linePath = (from: Point, to: Point): string =>
  `M ${from.x.toFixed(2)} ${from.y.toFixed(2)} L ${to.x.toFixed(2)} ${to.y.toFixed(2)}`;

const polylineLength = (points: Point[]): number[] =>
  points.reduce<number[]>((lengths, point, index) => {
    const previous = points[index - 1];
    lengths.push(previous === undefined ? 0 : (lengths.at(-1) ?? 0) + distance(previous, point));
    return lengths;
  }, []);

export const loopFractionOf = (loop: Point[], point: Point): number => {
  const lengths = polylineLength(loop);
  const total = lengths.at(-1) ?? 0;
  let best = { gap: Number.POSITIVE_INFINITY, at: 0 };
  for (let index = 1; index < loop.length; index++) {
    const a = loop[index - 1];
    const b = loop[index];
    if (a === undefined || b === undefined) {
      continue;
    }
    const span = distance(a, b);
    const t =
      span > 0
        ? Math.min(
            1,
            Math.max(
              0,
              ((point.x - a.x) * (b.x - a.x) + (point.y - a.y) * (b.y - a.y)) / span ** 2,
            ),
          )
        : 0;
    const gap = distance(point, { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    if (gap < best.gap) {
      best = { gap, at: (lengths[index - 1] ?? 0) + span * t };
    }
  }
  return total > 0 ? best.at / total : 0;
};
