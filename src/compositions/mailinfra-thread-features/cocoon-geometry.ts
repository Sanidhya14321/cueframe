import { random } from 'remotion';
import type { ThreadTitle, ThreadWeb } from '@/schemas';
import type { TitleMetrics } from './extruded-title';

export interface Point {
  x: number;
  y: number;
}

export interface Strand {
  kx: number;
  near: number;
  far: number;
  lead: number;
  tail: number;
}

export interface CocoonShape {
  top: number;
  bottom: number;
  rx: number;
  strands: Strand[];
  links: string[];
  halfWidth: number;
  halfHeight: number;
}

const BULGE = 4 / 3;

const LINK_BANDS: [number, number][] = [
  [0.06, 0.3],
  [0.7, 0.94],
];

const meridianPoint = (shape: CocoonShape, strand: Strand, t: number): Point => {
  const span = shape.bottom - shape.top;
  const u = 1 - t;
  const x =
    3 * u * u * t * strand.kx * BULGE * strand.near +
    3 * u * t * t * strand.kx * BULGE * strand.far;
  const y =
    u * u * u * shape.top +
    3 * u * u * t * (shape.top + span * strand.lead) +
    3 * u * t * t * (shape.top + span * strand.tail) +
    t * t * t * shape.bottom;
  return { x, y };
};

export const meridianPath = (shape: CocoonShape, strand: Strand): string => {
  const span = shape.bottom - shape.top;
  const near = strand.kx * BULGE * strand.near;
  const far = strand.kx * BULGE * strand.far;
  return `M0 ${shape.top.toFixed(1)}C${near.toFixed(1)} ${(shape.top + span * strand.lead).toFixed(1)} ${far.toFixed(1)} ${(shape.top + span * strand.tail).toFixed(1)} 0 ${shape.bottom.toFixed(1)}`;
};

const crossLinks = (shape: Omit<CocoonShape, 'links'>, index: number): string[] =>
  shape.strands.slice(1).flatMap((strand, step) => {
    const previous = shape.strands[step] ?? strand;
    return LINK_BANDS.flatMap(([from, to], band) =>
      [0, 1].map((slot) => {
        const seed = (key: string) => random(`thread-link-${index}-${step}-${band}-${slot}-${key}`);
        const t = from + (to - from) * seed('t');
        const a = meridianPoint({ ...shape, links: [] }, previous, t);
        const b = meridianPoint({ ...shape, links: [] }, strand, t + (seed('skew') - 0.5) * 0.06);
        const sag = 4 + seed('sag') * 10;
        return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${((a.x + b.x) / 2).toFixed(1)} ${((a.y + b.y) / 2 + sag).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
      }),
    );
  });

export const cocoonShape = (metrics: TitleMetrics, web: ThreadWeb, index: number): CocoonShape => {
  const seed = (key: string) => random(`thread-cocoon-${index}-${key}`);
  const rx = (metrics.width / 2) * (0.74 + seed('rx') * 0.1) + 20;
  const reach = web.reach * (0.9 + seed('reach') * 0.2);
  const count = Math.max(2, web.strands);
  const strands = Array.from({ length: count }, (_, step) => {
    const along = -1 + (2 * step) / (count - 1);
    const outer = step === 0 || step === count - 1;
    const wobble = (key: string, amount: number) => 1 + (seed(`${key}${step}`) - 0.5) * amount;
    return {
      kx: rx * along * (outer ? 1 : wobble('k', 0.22)),
      near: wobble('n', 0.3),
      far: wobble('f', 0.3),
      lead: 0.2 + seed(`l${step}`) * 0.12,
      tail: 0.7 + seed(`t${step}`) * 0.12,
    };
  });
  const base = {
    top: -metrics.height / 2 - reach,
    bottom: metrics.height / 2 + reach * (0.85 + seed('bottom') * 0.3),
    rx,
    strands,
    halfWidth: 820,
    halfHeight: metrics.height / 2 + web.reach * 1.3 + 260,
  };
  return { ...base, links: crossLinks(base, index) };
};

const edgeStrand = (shape: CocoonShape, sign: number): Strand => ({
  kx: sign * shape.rx,
  near: 1,
  far: 1,
  lead: 0.26,
  tail: 0.74,
});

export interface SideWebShape {
  hub: Point;
  spokes: Point[];
  rings: string[];
  anchors: string[];
  nests: Point[];
}

export const sideWebShape = (
  shape: CocoonShape,
  metrics: TitleMetrics,
  side: 'left' | 'right',
  index: number,
): SideWebShape => {
  const sign = side === 'right' ? 1 : -1;
  const seed = (key: string) => random(`thread-side-${index}-${key}`);
  const hub = { x: sign * Math.min(shape.rx + 40, 290), y: metrics.height / 2 + 170 };
  const facing = sign > 0 ? 0.55 : Math.PI - 0.55;
  const count = 9;
  const lengths = Array.from(
    { length: count },
    (_, step) => 300 * (0.82 + seed(`len${step}`) * 0.36),
  );
  const angles = Array.from(
    { length: count },
    (_, step) => facing + (-1.45 + (2.9 * step) / (count - 1)) * sign,
  );
  const spokeAt = (step: number, share: number): Point => ({
    x: hub.x + Math.cos(angles[step] ?? 0) * (lengths[step] ?? 0) * share,
    y: hub.y + Math.sin(angles[step] ?? 0) * (lengths[step] ?? 0) * share,
  });
  const spokes = angles.map((_, step) => spokeAt(step, 1));
  const rings = Array.from({ length: 6 }, (_unused, ringIndex) => {
    const share = 0.18 + ringIndex * 0.14;
    return angles
      .map((_, step) => {
        const point = spokeAt(step, share);
        return `${step === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
      })
      .join('');
  });
  const edge = edgeStrand(shape, sign);
  const anchors = [0.36, 0.62].map((t) => {
    const point = meridianPoint(shape, edge, t);
    return `M${hub.x.toFixed(1)} ${hub.y.toFixed(1)}L${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
  });
  const nests = [2, 6, 4].map((step) => spokeAt(step, 0.42));
  return { hub, spokes, rings, anchors, nests };
};

export interface Hanging {
  anchor: Point;
  at: Point;
  sway: number;
}

export const hangingEnvelopes = (
  shape: CocoonShape,
  sideWeb: SideWebShape | null,
  item: ThreadTitle,
  index: number,
): Hanging[] =>
  Array.from({ length: item.caught }, (_, step) => {
    const nest = sideWeb?.nests[step];
    if (nest !== undefined) {
      return { anchor: nest, at: nest, sway: random(`thread-sway-${index}-${step}`) };
    }
    const sign = step % 2 === 0 ? 1 : -1;
    const strand = edgeStrand(shape, sign * (step === 2 ? 0.55 : 0.92));
    const anchor = meridianPoint(shape, strand, 0.72);
    const drop = 70 + random(`thread-drop-${index}-${step}`) * 50;
    return {
      anchor,
      at: { x: anchor.x, y: anchor.y + drop },
      sway: random(`thread-sway-${index}-${step}`),
    };
  });

export const dewDrops = (shape: CocoonShape, index: number): (Point & { r: number })[] =>
  shape.strands.flatMap((strand, step) =>
    [0, 1].map((slot) => {
      const t = 0.08 + random(`thread-dew-${index}-${step}-${slot}`) * 0.84;
      const point = meridianPoint(shape, strand, t);
      return { ...point, r: 3 + random(`thread-dew-r-${index}-${step}-${slot}`) * 3.5 };
    }),
  );
