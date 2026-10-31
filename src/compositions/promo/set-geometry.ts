import * as THREE from 'three';
import { memo, roundedShape, roundedSlab } from './phone-geometry';

export interface ReliefRingSpec {
  outer: number;
  band: number;
  depth: number;
}

export interface ReliefLayout {
  count: number;
  core: number;
  band: number;
  gap: number;
  growth: number;
  depth: number;
  depthStep: number;
}

export const reliefRings = (layout: ReliefLayout): ReliefRingSpec[] => {
  const rings: ReliefRingSpec[] = [];
  let inner = layout.core;
  for (let index = 0; index < layout.count; index++) {
    const band = layout.band * layout.growth ** index;
    const outer = inner + band * 2;
    rings.push({
      outer,
      band,
      depth: layout.depth + (layout.count - 1 - index) * layout.depthStep,
    });
    inner = outer + layout.gap * 2 * layout.growth ** index;
  }
  return rings;
};

const RELIEF_CORNER = 0.24;

export const reliefRingGeometry = (ring: ReliefRingSpec, bevel: number) =>
  memo(`relief:${ring.outer}:${ring.band}:${ring.depth}:${bevel}`, () => {
    const outer = ring.outer - bevel * 2;
    const inner = ring.outer - ring.band * 2 + bevel * 2;
    const shape = roundedShape(outer, outer, outer * RELIEF_CORNER);
    shape.holes.push(roundedShape(inner, inner, inner * RELIEF_CORNER));
    const core = Math.max(0.0001, ring.depth - bevel * 2);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: core,
      bevelEnabled: bevel > 0,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 6,
      curveSegments: 40,
    });
    geometry.translate(0, 0, bevel);
    geometry.computeVertexNormals();
    return geometry;
  });

export const reliefTop = (layout: ReliefLayout): number =>
  layout.depth + layout.count * layout.depthStep;

export const reliefCoreGeometry = (size: number, depth: number, bevel: number) =>
  roundedSlab(size, size, size * RELIEF_CORNER, depth, bevel);

export const pedestalGeometry = (size: number, bevel: number) =>
  roundedSlab(size, size, bevel * 1.5, size, bevel);

export const iconTileGeometry = (size: number, depth: number) =>
  roundedSlab(size, size, size * 0.23, depth, depth * 0.3);

export interface RibbonSpec {
  length: number;
  width: number;
  thickness: number;
  amplitude: number;
  waves: number;
  phase: number;
  curl: number;
}

export const ribbonHeight = (spec: RibbonSpec, x: number): number =>
  spec.thickness +
  spec.amplitude *
    (0.5 + 0.5 * Math.sin((x / spec.length) * Math.PI * 2 * spec.waves + spec.phase));

export const ribbonCurl = (spec: RibbonSpec, x: number): number =>
  spec.curl * Math.sin((x / spec.length) * Math.PI * spec.waves + 0.7);

const crown = (across: number): number => Math.cos((Math.PI * across) / 2) ** 0.45;

const ALONG = 220;
const ACROSS = 24;

export const ribbonGeometry = (spec: RibbonSpec) =>
  memo(
    `ribbon:${spec.length}:${spec.width}:${spec.thickness}:${spec.amplitude}:${spec.waves}:${spec.phase}:${spec.curl}`,
    () => {
      const positions: number[] = [];
      const indices: number[] = [];
      for (let i = 0; i <= ALONG; i++) {
        const x = -spec.length / 2 + (spec.length * i) / ALONG;
        const lift = ribbonHeight(spec, x);
        const shift = ribbonCurl(spec, x);
        for (let j = 0; j <= ACROSS; j++) {
          const across = (j / ACROSS) * 2 - 1;
          positions.push(x, (across * spec.width) / 2 + shift, lift * crown(across));
        }
      }
      for (let i = 0; i < ALONG; i++) {
        for (let j = 0; j < ACROSS; j++) {
          const a = i * (ACROSS + 1) + j;
          const b = a + ACROSS + 1;
          indices.push(a, b, a + 1, a + 1, b, b + 1);
        }
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      return geometry;
    },
  );
