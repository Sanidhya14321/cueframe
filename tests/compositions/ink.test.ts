import { describe, expect, it } from 'bun:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { arrowHead, arrowShaft, scalePoints } from '@/compositions/promo/arrow-paths';
import {
  brushOutline,
  hash,
  noise,
  pathLength,
  resample,
  slicePath,
  smoothstep,
  wobble,
} from '@/compositions/promo/ink-geometry';
import { InkFilter, InkStroke, strokeWidthAt } from '@/compositions/promo/ink-stroke';
import { ARROW_SHAPES } from '@/schemas';

const line = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
];

describe('ink geometry', () => {
  it('hashes deterministically into the unit interval', () => {
    for (let index = 0; index < 50; index++) {
      const value = hash(7, index);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
      expect(hash(7, index)).toBe(value);
    }
  });

  it('interpolates noise continuously between cells', () => {
    expect(Math.abs(noise(3, 1.999) - noise(3, 2))).toBeLessThan(0.01);
    expect(Math.abs(noise(3, 2.5))).toBeLessThanOrEqual(1);
  });

  it('clamps smoothstep at its edges', () => {
    expect(smoothstep(0, 1, -1)).toBe(0);
    expect(smoothstep(0, 1, 2)).toBe(1);
    expect(smoothstep(0, 1, 0.5)).toBe(0.5);
  });

  it('resamples evenly along the arc length', () => {
    const points = resample(line, 11);
    expect(points).toHaveLength(11);
    expect(points[5]?.x).toBeCloseTo(50, 5);
    expect(pathLength(points)).toBeCloseTo(100, 5);
  });

  it('slices a fraction of the path', () => {
    const part = slicePath(resample(line, 11), 0.25, 0.75);
    expect(part[0]?.x).toBeCloseTo(25, 5);
    expect(part.at(-1)?.x).toBeCloseTo(75, 5);
    expect(slicePath(line, 0.6, 0.4)).toEqual([]);
  });

  it('keeps endpoints fixed in count and offsets along the normal', () => {
    const shaken = wobble(resample(line, 20), 4, 1, 1 / 10);
    expect(shaken).toHaveLength(20);
    expect(shaken.every((point, index) => point.x === resample(line, 20)[index]?.x)).toBe(true);
    expect(wobble(line, 0, 1, 1)).toEqual(line);
  });

  it('outlines a closed brush shape with outward round caps', () => {
    const outline = brushOutline(resample(line, 5), () => 10);
    expect(outline.startsWith('M ')).toBe(true);
    expect(outline.endsWith(' Z')).toBe(true);
    expect(outline.match(/ A 5\.00 5\.00 0 0 0 /g)).toHaveLength(2);
    expect(brushOutline([{ x: 0, y: 0 }], () => 10)).toBe('');
  });
});

describe('arrow paths', () => {
  it('builds every shape from tail to a tip on the right', () => {
    for (const shape of ARROW_SHAPES) {
      const shaft = arrowShaft(shape);
      expect(shaft.length).toBeGreaterThan(100);
      expect(shaft.every((point) => Number.isFinite(point.x) && Number.isFinite(point.y))).toBe(
        true,
      );
      expect(shaft.at(-1)?.x ?? 0).toBeGreaterThan(shaft[0]?.x ?? 0);
    }
  });

  it('adds two barbs that end at the tip', () => {
    const shaft = scalePoints(arrowShaft('straight'), 200);
    const barbs = arrowHead(shaft, 40);
    const tip = shaft.at(-1);
    expect(barbs).toHaveLength(2);
    for (const barb of barbs) {
      expect(barb.at(-1)?.x).toBeCloseTo(tip?.x ?? 0, 5);
      expect(pathLength(barb)).toBeCloseTo(40, 3);
    }
  });
});

describe('ink stroke', () => {
  const base = {
    points: resample(line, 40),
    width: 10,
    color: '#000000',
    leadColor: '#ff0000',
    leadOffset: 6,
    seed: 3,
  };

  it('tapers the width at both ends', () => {
    expect(strokeWidthAt(10, 1, 0)).toBeLessThan(strokeWidthAt(10, 1, 0.5));
    expect(strokeWidthAt(10, 1, 1)).toBeLessThan(strokeWidthAt(10, 1, 0.5));
  });

  it('renders nothing before drawing or after erasing', () => {
    const empty = { ...base, leadOpacity: 0, flecks: 0 };
    expect(renderToStaticMarkup(createElement(InkStroke, { ...empty, draw: 0, erase: 0 }))).toBe(
      '',
    );
    expect(renderToStaticMarkup(createElement(InkStroke, { ...empty, draw: 1, erase: 1 }))).toBe(
      '',
    );
  });

  it('draws the lead stroke and flecks while active', () => {
    const markup = renderToStaticMarkup(
      createElement(InkStroke, { ...base, draw: 0.9, erase: 0, leadOpacity: 1, flecks: 1 }),
    );
    expect(markup).toContain('fill="#ff0000"');
    expect(markup).toContain('<ellipse');
  });

  it('breaks into fewer fragments as it erases', () => {
    const count = (erase: number) =>
      (
        renderToStaticMarkup(
          createElement(InkStroke, { ...base, draw: 1, erase, leadOpacity: 0, flecks: 0 }),
        ).match(/<path/g) ?? []
      ).length;
    expect(count(0.9)).toBeLessThan(count(0));
  });

  it('builds a dry brush filter', () => {
    const markup = renderToStaticMarkup(
      createElement(
        'svg',
        null,
        createElement(InkFilter, { id: 'ink', seed: 2, roughness: 3, dryness: 0.5 }),
      ),
    );
    expect(markup).toContain('feDisplacementMap');
    expect(markup).toContain('id="ink"');
  });
});
