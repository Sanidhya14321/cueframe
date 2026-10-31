import { parse } from 'culori';
import type {
  DesignElement,
  EllipseElement,
  PathElement,
  PolygonElement,
  RectElement,
  StarElement,
} from './element';
import { createPath } from './factories';
import type { Box } from './geometry';
import { boxesIntersect, polygonPoints, starPoints } from './geometry';

type PatternShape = RectElement | EllipseElement | PolygonElement | StarElement;

const MIN_PATTERN_SIZE = 3;

const isPatternShape = (element: DesignElement): element is PatternShape =>
  (element.type === 'rect' ||
    element.type === 'ellipse' ||
    element.type === 'polygon' ||
    element.type === 'star') &&
  typeof element.fill === 'string' &&
  element.rotation === 0 &&
  element.strokeWidth === 0 &&
  element.shadow === undefined &&
  !element.hidden;

const runKey = (shape: PatternShape): string =>
  `${shape.type}\u0000${shape.name}\u0000${shape.groupId ?? ''}`;

const isOpaque = (shape: PatternShape): boolean =>
  shape.opacity === 1 && typeof shape.fill === 'string' && (parse(shape.fill)?.alpha ?? 1) === 1;

const round = (value: number): number => Math.round(value * 100) / 100;

const pointsPath = (points: readonly number[], x: number, y: number): string => {
  const pairs: string[] = [];
  for (let index = 0; index + 1 < points.length; index += 2) {
    pairs.push(
      `${index === 0 ? 'M' : 'L'}${round(x + (points[index] ?? 0))} ${round(y + (points[index + 1] ?? 0))}`,
    );
  }
  return `${pairs.join(' ')} Z`;
};

const rectPath = (shape: RectElement, x: number, y: number): string => {
  const { width, height } = shape;
  const radius = Math.min(shape.cornerRadius, width / 2, height / 2);
  if (radius <= 0) {
    return `M${round(x)} ${round(y)} H${round(x + width)} V${round(y + height)} H${round(x)} Z`;
  }
  const r = round(radius);
  const arc = `A${r} ${r} 0 0 1`;
  return [
    `M${round(x + radius)} ${round(y)}`,
    `H${round(x + width - radius)}`,
    `${arc} ${round(x + width)} ${round(y + radius)}`,
    `V${round(y + height - radius)}`,
    `${arc} ${round(x + width - radius)} ${round(y + height)}`,
    `H${round(x + radius)}`,
    `${arc} ${round(x)} ${round(y + height - radius)}`,
    `V${round(y + radius)}`,
    `${arc} ${round(x + radius)} ${round(y)}`,
    'Z',
  ].join(' ');
};

const ellipsePath = (shape: EllipseElement, x: number, y: number): string => {
  const rx = round(shape.width / 2);
  const ry = round(shape.height / 2);
  const cy = round(y + shape.height / 2);
  const arc = `A${rx} ${ry} 0 1 1`;
  return `M${round(x)} ${cy} ${arc} ${round(x + shape.width)} ${cy} ${arc} ${round(x)} ${cy} Z`;
};

const shapePath = (shape: PatternShape, x: number, y: number): string => {
  switch (shape.type) {
    case 'rect':
      return rectPath(shape, x, y);
    case 'ellipse':
      return ellipsePath(shape, x, y);
    case 'polygon':
      return pointsPath(polygonPoints(shape.sides, shape.width, shape.height), x, y);
    default:
      return pointsPath(
        starPoints(shape.points, shape.innerRatio, shape.width, shape.height),
        x,
        y,
      );
  }
};

const shapeBox = (shape: PatternShape): Box => ({
  x: shape.x,
  y: shape.y,
  width: shape.width,
  height: shape.height,
});

const overlaps = (shapes: readonly PatternShape[], others: readonly PatternShape[]): boolean =>
  shapes.some((shape) =>
    others.some((other) => shape !== other && boxesIntersect(shapeBox(shape), shapeBox(other))),
  );

const toPattern = (shapes: readonly PatternShape[]): PathElement => {
  const first = shapes[0];
  if (first === undefined) {
    throw new Error('A pattern needs at least one shape');
  }
  const left = Math.min(...shapes.map((shape) => shape.x));
  const top = Math.min(...shapes.map((shape) => shape.y));
  const width = Math.max(1, Math.max(...shapes.map((shape) => shape.x + shape.width)) - left);
  const height = Math.max(1, Math.max(...shapes.map((shape) => shape.y + shape.height)) - top);
  return createPath({
    id: first.id,
    name: `${first.name} pattern`,
    x: left,
    y: top,
    width,
    height,
    viewWidth: width,
    viewHeight: height,
    fill: first.fill,
    opacity: first.opacity,
    locked: true,
    ...(first.groupId === undefined ? {} : { groupId: first.groupId }),
    data: shapes.map((shape) => shapePath(shape, shape.x - left, shape.y - top)).join(' '),
  });
};

const splitByStyle = (
  run: readonly PatternShape[],
  styleKey: (shape: PatternShape) => string,
): PatternShape[][] => {
  const buckets = new Map<string, PatternShape[]>();
  for (const shape of run) {
    const key = styleKey(shape);
    buckets.set(key, [...(buckets.get(key) ?? []), shape]);
  }
  const groups = [...buckets.values()];
  const safe =
    groups.every((group, index) =>
      groups.slice(index + 1).every((other) => !overlaps(group, other)),
    ) && groups.every((group) => group.every(isOpaque) || !overlaps(group, group));
  if (safe) {
    return groups;
  }
  const consecutive: PatternShape[][] = [];
  for (const shape of run) {
    const last = consecutive.at(-1);
    if (last !== undefined && last[0] !== undefined && styleKey(last[0]) === styleKey(shape)) {
      last.push(shape);
    } else {
      consecutive.push([shape]);
    }
  }
  return consecutive;
};

export interface MergedPatterns {
  elements: DesignElement[];
  aliases: ReadonlyMap<string, string>;
}

export const mergePatterns = (
  elements: readonly DesignElement[],
  bindingOf: (id: string) => string = () => '',
): MergedPatterns => {
  const styleKey = (shape: PatternShape): string =>
    `${shape.fill}\u0000${shape.opacity}\u0000${bindingOf(shape.id)}`;
  const merged: DesignElement[] = [];
  const aliases = new Map<string, string>();
  let run: PatternShape[] = [];
  const flush = () => {
    if (run.length < MIN_PATTERN_SIZE) {
      merged.push(...run);
    } else {
      for (const group of splitByStyle(run, styleKey)) {
        if (group.length > 1) {
          const pattern = toPattern(group);
          for (const shape of group) {
            aliases.set(shape.id, pattern.id);
          }
          merged.push(pattern);
        } else {
          merged.push(...group);
        }
      }
    }
    run = [];
  };
  for (const element of elements) {
    const first = run[0];
    if (isPatternShape(element) && (first === undefined || runKey(first) === runKey(element))) {
      run.push(element);
      continue;
    }
    flush();
    if (isPatternShape(element)) {
      run.push(element);
    } else {
      merged.push(element);
    }
  }
  flush();
  return { elements: merged, aliases };
};
