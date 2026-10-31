import type { ArchSaveTheDateProps } from '@/schemas';
import { CENTER_X, fixed } from './camera';

export const WALL_TOP = -2800;

export interface ArchSpec {
  cx: number;
  halfWidth: number;
  apexY: number;
  springY: number;
  floorY: number;
  lobes: number;
}

export interface Pier {
  x: number;
  width: number;
}

export interface Arcade {
  center: ArchSpec;
  sides: ArchSpec[];
  piers: Pier[];
  left: number;
  right: number;
}

const SIDE_BAYS = 3;

const SIDE_SHARE = 0.62;

type Point = [number, number];

const pointAt = (spec: ArchSpec, t: number): Point => {
  const rise = Math.max(1, spec.springY - spec.apexY);
  const h = spec.halfWidth;
  if (rise < h) {
    const angle = (t * Math.PI) / 2;
    return [spec.cx - h * Math.cos(angle), spec.springY - rise * Math.sin(angle)];
  }
  const offset = (rise * rise - h * h) / (2 * h);
  const radius = h + offset;
  const angle = t * Math.acos(offset / radius);
  return [spec.cx + offset - radius * Math.cos(angle), spec.springY - radius * Math.sin(angle)];
};

const mirror = (spec: ArchSpec, [x, y]: Point): Point => [2 * spec.cx - x, y];

const at = ([x, y]: Point): string => `${fixed(x)} ${fixed(y)}`;

interface Segment {
  from: Point;
  to: Point;
  rx: number;
  ry: number;
}

const halfSegments = (spec: ArchSpec, rightSide: boolean): Segment[] => {
  const steps = Math.max(1, spec.lobes);
  const segments: Segment[] = [];
  for (let index = 0; index < steps; index++) {
    const fromT = rightSide ? 1 - index / steps : index / steps;
    const toT = rightSide ? 1 - (index + 1) / steps : (index + 1) / steps;
    const from = rightSide ? mirror(spec, pointAt(spec, fromT)) : pointAt(spec, fromT);
    const to = rightSide ? mirror(spec, pointAt(spec, toT)) : pointAt(spec, toT);
    if (spec.lobes === 0) {
      const rise = spec.springY - spec.apexY;
      const offset = Math.max(0, (rise * rise - spec.halfWidth ** 2) / (2 * spec.halfWidth));
      const radius = spec.halfWidth + offset;
      segments.push({ from, to, rx: radius, ry: rise < spec.halfWidth ? rise : radius });
    } else {
      const radius = Math.hypot(to[0] - from[0], to[1] - from[1]) * 0.56;
      segments.push({ from, to, rx: radius, ry: radius });
    }
  }
  return segments;
};

const segmentsOf = (spec: ArchSpec): Segment[] => [
  ...halfSegments(spec, false),
  ...halfSegments(spec, true),
];

const forward = (segments: Segment[]): string[] =>
  segments.map((segment) => `A ${fixed(segment.rx)} ${fixed(segment.ry)} 0 0 1 ${at(segment.to)}`);

const backward = (segments: Segment[]): string[] =>
  [...segments]
    .reverse()
    .map((segment) => `A ${fixed(segment.rx)} ${fixed(segment.ry)} 0 0 0 ${at(segment.from)}`);

const outline = (spec: ArchSpec): string[] => [
  `M ${fixed(spec.cx - spec.halfWidth)} ${fixed(spec.floorY)}`,
  `L ${fixed(spec.cx - spec.halfWidth)} ${fixed(spec.springY)}`,
  ...forward(segmentsOf(spec)),
  `L ${fixed(spec.cx + spec.halfWidth)} ${fixed(spec.floorY)}`,
];

export const openingPath = (spec: ArchSpec): string => [...outline(spec), 'Z'].join(' ');

const growArch = (spec: ArchSpec, by: number): ArchSpec => ({
  ...spec,
  halfWidth: spec.halfWidth + by,
  apexY: spec.apexY - by * 1.08,
});

export const CAPITAL_SHARE = 0.13;

export const capitalBottom = (spec: ArchSpec): number =>
  spec.springY + (spec.floorY - spec.springY) * CAPITAL_SHARE;

const toCapital = (spec: ArchSpec): ArchSpec => ({ ...spec, floorY: spec.springY + 14 });

export const archEdgePath = (spec: ArchSpec): string => outline(toCapital(spec)).join(' ');

export const ringPath = (spec: ArchSpec, inner: number, outer: number): string => {
  const outside = toCapital(growArch(spec, outer));
  const inside = toCapital(growArch(spec, inner));
  return [
    ...outline(outside),
    `L ${fixed(inside.cx + inside.halfWidth)} ${fixed(inside.floorY)}`,
    `L ${fixed(inside.cx + inside.halfWidth)} ${fixed(inside.springY)}`,
    ...backward(segmentsOf(inside)),
    `L ${fixed(inside.cx - inside.halfWidth)} ${fixed(inside.floorY)}`,
    'Z',
  ].join(' ');
};

export const arcadeFor = (colonnade: ArchSaveTheDateProps['colonnade']): Arcade => {
  const halfWidth = colonnade.openingWidth / 2;
  const pier = colonnade.columnWidth;
  const sideHalf = (colonnade.openingWidth * SIDE_SHARE) / 2;
  const rise = colonnade.springY - colonnade.apexY;
  const center: ArchSpec = {
    cx: CENTER_X,
    halfWidth,
    apexY: colonnade.apexY,
    springY: colonnade.springY,
    floorY: colonnade.floorY,
    lobes: colonnade.lobes,
  };
  const sides: ArchSpec[] = [];
  const piers: Pier[] = [
    { x: CENTER_X - halfWidth - pier, width: pier },
    { x: CENTER_X + halfWidth, width: pier },
  ];
  for (let bay = 0; bay < SIDE_BAYS; bay++) {
    const reach = halfWidth + pier + bay * (2 * sideHalf + pier) + sideHalf;
    for (const direction of [-1, 1]) {
      sides.push({
        ...center,
        cx: CENTER_X + direction * reach,
        halfWidth: sideHalf,
        apexY: colonnade.springY - rise * SIDE_SHARE,
      });
      const outer = reach + sideHalf;
      piers.push({ x: direction < 0 ? CENTER_X - outer - pier : CENTER_X + outer, width: pier });
    }
  }
  const extent = halfWidth + SIDE_BAYS * (2 * sideHalf + pier) + pier;
  return { center, sides, piers, left: CENTER_X - extent, right: CENTER_X + extent };
};
