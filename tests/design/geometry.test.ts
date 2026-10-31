import { describe, expect, it } from 'bun:test';
import {
  alignOffsets,
  boundingBox,
  boxesIntersect,
  createLine,
  createRect,
  createText,
  distributeOffsets,
  elementBounds,
  linearGradientLine,
  polygonPoints,
  snapAxis,
  starPoints,
  unionBox,
} from '@/design';

describe('shape points', () => {
  it('polygon starts at the top centre and has one point per side', () => {
    const points = polygonPoints(4, 100, 100);
    expect(points).toHaveLength(8);
    expect(points[0]).toBeCloseTo(50);
    expect(points[1]).toBeCloseTo(0);
  });

  it('star alternates outer and inner radius', () => {
    const points = starPoints(5, 0.5, 100, 100);
    expect(points).toHaveLength(20);
    expect(points[1]).toBeCloseTo(0);
    const innerY = points[3] ?? 0;
    const innerX = points[2] ?? 0;
    expect(Math.hypot(innerX - 50, innerY - 50)).toBeCloseTo(25);
  });
});

describe('bounds', () => {
  it('rotated box grows to contain all corners', () => {
    const box = boundingBox({ x: 0, y: 0, width: 100, height: 100 }, 90);
    expect(box.x).toBeCloseTo(-100);
    expect(box.width).toBeCloseTo(100);
    expect(box.height).toBeCloseTo(100);
  });

  it('text uses measured height and line uses stroke width', () => {
    const text = createText({ x: 10, y: 20, width: 200 });
    expect(elementBounds(text, 90).height).toBeCloseTo(90);
    expect(elementBounds(text).height).toBeCloseTo(64 * 1.15);
    expect(elementBounds(createLine({ strokeWidth: 6 })).height).toBe(6);
  });

  it('detects overlapping boxes', () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    expect(boxesIntersect(a, { x: 5, y: 5, width: 10, height: 10 })).toBe(true);
    expect(boxesIntersect(a, { x: 20, y: 0, width: 5, height: 5 })).toBe(false);
  });

  it('union covers every box and is null when empty', () => {
    expect(unionBox([])).toBeNull();
    expect(
      unionBox([
        { x: 0, y: 0, width: 10, height: 10 },
        { x: 20, y: 5, width: 10, height: 30 },
      ]),
    ).toEqual({ x: 0, y: 0, width: 30, height: 35 });
  });
});

describe('alignment', () => {
  const page = { x: 0, y: 0, width: 1000, height: 1000 };
  const boxes = { a: elementBounds(createRect({ x: 100, y: 100, width: 200, height: 100 })) };

  it('centres horizontally and vertically on the page', () => {
    expect(alignOffsets(boxes, page, 'center')).toEqual({ a: { x: 300, y: 0 } });
    expect(alignOffsets(boxes, page, 'middle')).toEqual({ a: { x: 0, y: 350 } });
  });

  it('aligns to every edge', () => {
    expect(alignOffsets(boxes, page, 'left')).toEqual({ a: { x: -100, y: 0 } });
    expect(alignOffsets(boxes, page, 'right')).toEqual({ a: { x: 700, y: 0 } });
    expect(alignOffsets(boxes, page, 'top')).toEqual({ a: { x: 0, y: -100 } });
    expect(alignOffsets(boxes, page, 'bottom')).toEqual({ a: { x: 0, y: 800 } });
  });

  it('distributes equal gaps between three or more boxes', () => {
    const offsets = distributeOffsets(
      {
        a: { x: 0, y: 0, width: 100, height: 10 },
        b: { x: 120, y: 0, width: 100, height: 10 },
        c: { x: 500, y: 0, width: 100, height: 10 },
      },
      'horizontal',
    );
    expect(offsets).toEqual({ a: { x: 0, y: 0 }, b: { x: 130, y: 0 }, c: { x: 0, y: 0 } });
    expect(distributeOffsets({ a: page }, 'vertical')).toEqual({});
  });

  it('vertical distribution moves along y', () => {
    const offsets = distributeOffsets(
      {
        a: { x: 0, y: 0, width: 10, height: 100 },
        b: { x: 0, y: 300, width: 10, height: 100 },
        c: { x: 0, y: 400, width: 10, height: 100 },
      },
      'vertical',
    );
    expect(offsets).toMatchObject({ b: { x: 0, y: -100 } });
  });
});

describe('snapping and gradients', () => {
  it('snaps to the nearest target inside the threshold', () => {
    expect(snapAxis([98, 300], [0, 100, 500], 5)).toEqual({ delta: 2, guide: 100 });
    expect(snapAxis([50], [0, 100], 5)).toEqual({ delta: 0, guide: null });
  });

  it('a 90 degree gradient runs left to right', () => {
    const line = linearGradientLine(90, 200, 100);
    expect(line.start.x).toBeCloseTo(0);
    expect(line.end.x).toBeCloseTo(200);
    expect(line.start.y).toBeCloseTo(50);
  });
});
