import type { DesignElement } from './element';

export interface Point {
  x: number;
  y: number;
}

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const polygonPoints = (sides: number, width: number, height: number): number[] =>
  Array.from({ length: sides }, (_, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / sides;
    return [width / 2 + (Math.cos(angle) * width) / 2, height / 2 + (Math.sin(angle) * height) / 2];
  }).flat();

export const starPoints = (
  points: number,
  innerRatio: number,
  width: number,
  height: number,
): number[] =>
  Array.from({ length: points * 2 }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI) / points;
    const scale = index % 2 === 0 ? 1 : innerRatio;
    return [
      width / 2 + (Math.cos(angle) * width * scale) / 2,
      height / 2 + (Math.sin(angle) * height * scale) / 2,
    ];
  }).flat();

const rotatePoint = (point: Point, origin: Point, degrees: number): Point => {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;
  return { x: origin.x + dx * cos - dy * sin, y: origin.y + dx * sin + dy * cos };
};

export const elementHeight = (element: DesignElement, measuredHeight?: number): number => {
  if (element.type === 'line') {
    return element.strokeWidth;
  }
  if (element.type === 'text') {
    return measuredHeight ?? element.fontSize * element.lineHeight;
  }
  return element.height;
};

export const boundingBox = (box: Box, rotation: number): Box => {
  const origin = { x: box.x, y: box.y };
  const corners = [
    origin,
    { x: box.x + box.width, y: box.y },
    { x: box.x + box.width, y: box.y + box.height },
    { x: box.x, y: box.y + box.height },
  ].map((corner) => rotatePoint(corner, origin, rotation));
  const xs = corners.map((corner) => corner.x);
  const ys = corners.map((corner) => corner.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
};

export const elementBounds = (element: DesignElement, measuredHeight?: number): Box =>
  boundingBox(
    {
      x: element.x,
      y: element.y,
      width: element.width,
      height: elementHeight(element, measuredHeight),
    },
    element.rotation,
  );

export const boxesIntersect = (a: Box, b: Box): boolean =>
  a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;

export const unionBox = (boxes: readonly Box[]): Box | null => {
  if (boxes.length === 0) {
    return null;
  }
  const x = Math.min(...boxes.map((box) => box.x));
  const y = Math.min(...boxes.map((box) => box.y));
  const right = Math.max(...boxes.map((box) => box.x + box.width));
  const bottom = Math.max(...boxes.map((box) => box.y + box.height));
  return { x, y, width: right - x, height: bottom - y };
};

export const ALIGNMENTS = ['left', 'center', 'right', 'top', 'middle', 'bottom'] as const;

export type Alignment = (typeof ALIGNMENTS)[number];

export type Offsets = Record<string, Point>;

const ALIGN_DELTAS: Record<Alignment, (box: Box, target: Box) => Point> = {
  left: (box, target) => ({ x: target.x - box.x, y: 0 }),
  center: (box, target) => ({ x: target.x + target.width / 2 - (box.x + box.width / 2), y: 0 }),
  right: (box, target) => ({ x: target.x + target.width - (box.x + box.width), y: 0 }),
  top: (box, target) => ({ x: 0, y: target.y - box.y }),
  middle: (box, target) => ({ x: 0, y: target.y + target.height / 2 - (box.y + box.height / 2) }),
  bottom: (box, target) => ({ x: 0, y: target.y + target.height - (box.y + box.height) }),
};

export const alignOffsets = (
  boxes: Record<string, Box>,
  target: Box,
  alignment: Alignment,
): Offsets =>
  Object.fromEntries(
    Object.entries(boxes).map(([id, box]) => [id, ALIGN_DELTAS[alignment](box, target)]),
  );

export type Axis = 'horizontal' | 'vertical';

export const distributeOffsets = (boxes: Record<string, Box>, axis: Axis): Offsets => {
  const entries = Object.entries(boxes);
  if (entries.length < 3) {
    return {};
  }
  const start = (box: Box) => (axis === 'horizontal' ? box.x : box.y);
  const size = (box: Box) => (axis === 'horizontal' ? box.width : box.height);
  const sorted = [...entries].sort(([, a], [, b]) => start(a) - start(b));
  const first = sorted[0]?.[1];
  const last = sorted.at(-1)?.[1];
  if (first === undefined || last === undefined) {
    return {};
  }
  const span = start(last) + size(last) - start(first);
  const occupied = sorted.reduce((sum, [, box]) => sum + size(box), 0);
  const gap = (span - occupied) / (sorted.length - 1);
  let cursor = start(first);
  const offsets: Offsets = {};
  for (const [id, box] of sorted) {
    const delta = cursor - start(box);
    offsets[id] = axis === 'horizontal' ? { x: delta, y: 0 } : { x: 0, y: delta };
    cursor += size(box) + gap;
  }
  return offsets;
};

export interface SnapResult {
  delta: number;
  guide: number | null;
}

export const snapAxis = (
  edges: readonly number[],
  targets: readonly number[],
  threshold: number,
): SnapResult => {
  let best: SnapResult = { delta: 0, guide: null };
  let bestDistance = threshold;
  for (const edge of edges) {
    for (const target of targets) {
      const distance = Math.abs(target - edge);
      if (distance <= bestDistance) {
        bestDistance = distance;
        best = { delta: target - edge, guide: target };
      }
    }
  }
  return best;
};
