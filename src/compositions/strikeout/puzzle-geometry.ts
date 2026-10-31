import * as THREE from 'three';
import { memo } from '../promo/phone-geometry';

type Edge = -1 | 0 | 1;

export interface PieceEdges {
  top: Edge;
  right: Edge;
  bottom: Edge;
  left: Edge;
}

export const PIECE_DEPTH = 0.16;
export const PIECE_BEVEL = 0.035;

type Point = [number, number];

const edgePoints = (from: Point, to: Point, edge: Edge): Point[] => {
  const [ax, ay] = from;
  const [bx, by] = to;
  const dx = bx - ax;
  const dy = by - ay;
  const nx = dy;
  const ny = -dx;
  const at = (along: number, out: number): Point => [
    ax + dx * along + nx * out * edge,
    ay + dy * along + ny * out * edge,
  ];
  if (edge === 0) {
    return [from, to];
  }
  return [
    from,
    at(0.36, 0),
    at(0.4, 0.02),
    at(0.36, 0.12),
    at(0.33, 0.22),
    at(0.4, 0.29),
    at(0.5, 0.3),
    at(0.6, 0.29),
    at(0.67, 0.22),
    at(0.64, 0.12),
    at(0.6, 0.02),
    at(0.64, 0),
    to,
  ];
};

const pieceShape = (size: number, edges: PieceEdges): THREE.Shape => {
  const half = size / 2;
  const corners: Point[] = [
    [-half, -half],
    [half, -half],
    [half, half],
    [-half, half],
  ];
  const sides: Edge[] = [edges.bottom, edges.right, edges.top, edges.left];
  const points: Point[] = [];
  sides.forEach((edge, index) => {
    const from = corners[index] ?? [0, 0];
    const to = corners[(index + 1) % 4] ?? [0, 0];
    points.push(...edgePoints(from, to, edge).slice(0, -1));
  });
  const curve = new THREE.CatmullRomCurve3(
    points.map(([x, y]) => new THREE.Vector3(x, y, 0)),
    true,
    'centripetal',
    0.3,
  );
  const outline = curve.getSpacedPoints(220).map((point) => new THREE.Vector2(point.x, point.y));
  return new THREE.Shape(outline);
};

export const pieceGeometry = (size: number, edges: PieceEdges): THREE.BufferGeometry =>
  memo(`puzzle:${size}:${JSON.stringify(edges)}`, () => {
    const geometry = new THREE.ExtrudeGeometry(pieceShape(size, edges), {
      depth: PIECE_DEPTH,
      bevelEnabled: true,
      bevelThickness: PIECE_BEVEL,
      bevelSize: PIECE_BEVEL,
      bevelSegments: 6,
      curveSegments: 4,
    });
    geometry.translate(0, 0, -PIECE_DEPTH / 2);
    geometry.computeVertexNormals();
    return geometry;
  });
