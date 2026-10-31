import { describe, expect, it } from 'bun:test';
import {
  iconTileGeometry,
  pedestalGeometry,
  reliefRingGeometry,
  reliefRings,
  ribbonCurl,
  ribbonGeometry,
  ribbonHeight,
} from '@/compositions/promo/set-geometry';
import { clayMaterial } from '@/compositions/promo/set-materials';

const LAYOUT = {
  count: 5,
  core: 1.2,
  band: 0.3,
  gap: 0.12,
  growth: 1.15,
  depth: 0.1,
  depthStep: 0.08,
};

const RIBBON = {
  length: 20,
  width: 1.4,
  thickness: 0.2,
  amplitude: 0.3,
  waves: 1.5,
  phase: 0.4,
  curl: 0,
};

describe('relief rings', () => {
  it('nests every ring outside the previous one without overlap', () => {
    const rings = reliefRings(LAYOUT);
    expect(rings).toHaveLength(5);
    for (let index = 1; index < rings.length; index++) {
      const previous = rings[index - 1];
      const current = rings[index];
      if (previous === undefined || current === undefined) {
        throw new Error('missing ring');
      }
      expect(current.outer - current.band * 2).toBeGreaterThan(previous.outer);
    }
  });

  it('steps inner rings further out than outer rings', () => {
    const rings = reliefRings(LAYOUT);
    expect(rings[0]?.depth).toBeGreaterThan(rings.at(-1)?.depth ?? 0);
    expect(rings.at(-1)?.depth).toBeCloseTo(LAYOUT.depth);
  });

  it('builds a ring that spans its depth from the wall', () => {
    const [ring] = reliefRings(LAYOUT);
    if (ring === undefined) {
      throw new Error('missing ring');
    }
    const geometry = reliefRingGeometry(ring, 0.02);
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    expect(box?.min.z).toBeCloseTo(0, 3);
    expect(box?.max.z).toBeCloseTo(ring.depth, 3);
    expect(box?.max.x).toBeCloseTo(ring.outer / 2, 3);
  });

  it('memoizes geometry by its parameters', () => {
    const [ring] = reliefRings(LAYOUT);
    if (ring === undefined) {
      throw new Error('missing ring');
    }
    expect(reliefRingGeometry(ring, 0.02)).toBe(reliefRingGeometry(ring, 0.02));
  });
});

describe('ribbon surface', () => {
  it('keeps the wave between the base thickness and its amplitude', () => {
    for (let x = -10; x <= 10; x += 0.5) {
      const height = ribbonHeight(RIBBON, x);
      expect(height).toBeGreaterThanOrEqual(RIBBON.thickness - 1e-9);
      expect(height).toBeLessThanOrEqual(RIBBON.thickness + RIBBON.amplitude + 1e-9);
    }
  });

  it('lays the ribbon along x with its width on y and height toward the camera', () => {
    const geometry = ribbonGeometry(RIBBON);
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    expect((box?.max.x ?? 0) - (box?.min.x ?? 0)).toBeCloseTo(RIBBON.length, 3);
    expect((box?.max.y ?? 0) - (box?.min.y ?? 0)).toBeCloseTo(RIBBON.width, 3);
    expect(box?.max.z).toBeLessThanOrEqual(RIBBON.thickness + RIBBON.amplitude + 1e-6);
    expect(box?.min.z).toBeGreaterThanOrEqual(-1e-6);
  });

  it('curls every ribbon sideways by the same offset so neighbours stay seamless', () => {
    const curled = { ...RIBBON, curl: 0.5 };
    expect(ribbonCurl(curled, 3)).toBeCloseTo(ribbonCurl({ ...curled, phase: 2 }, 3));
    expect(Math.abs(ribbonCurl(curled, 3))).toBeLessThanOrEqual(0.5);
  });
});

describe('solid set pieces', () => {
  it('builds a cube pedestal of the requested size', () => {
    const geometry = pedestalGeometry(4, 0.08);
    geometry.computeBoundingBox();
    expect(geometry.boundingBox?.max.x).toBeCloseTo(2, 3);
    expect(geometry.boundingBox?.max.z).toBeCloseTo(2, 3);
  });

  it('builds an icon tile slab', () => {
    const geometry = iconTileGeometry(1, 0.2);
    geometry.computeBoundingBox();
    expect(geometry.boundingBox?.max.y).toBeCloseTo(0.5, 3);
    expect((geometry.boundingBox?.max.z ?? 0) * 2).toBeCloseTo(0.2, 3);
  });

  it('shares one clay material per color and finish', () => {
    expect(clayMaterial('#d9d9d6')).toBe(clayMaterial('#d9d9d6'));
    expect(clayMaterial('#d9d9d6', 0.5)).not.toBe(clayMaterial('#d9d9d6'));
    expect(clayMaterial('#ff6b3d').roughness).toBeCloseTo(0.82);
  });
});
