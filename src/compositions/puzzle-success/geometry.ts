type Edge = -1 | 0 | 1;

export interface PieceEdges {
  top: Edge;
  right: Edge;
  bottom: Edge;
  left: Edge;
}

export type Corner = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export const CORNERS: readonly Corner[] = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'];

export const CORNER_EDGES: Record<Corner, PieceEdges> = {
  topLeft: { top: 0, right: 1, bottom: -1, left: 0 },
  topRight: { top: 0, right: 0, bottom: 1, left: -1 },
  bottomLeft: { top: 1, right: -1, bottom: 0, left: 0 },
  bottomRight: { top: -1, right: 0, bottom: 0, left: 1 },
};

export const CORNER_SIGN: Record<Corner, [number, number]> = {
  topLeft: [-1, -1],
  topRight: [1, -1],
  bottomLeft: [-1, 1],
  bottomRight: [1, 1],
};

export const CORNER_SHADE_DIRECTION: Record<Corner, [number, number]> = {
  topLeft: [0, -1],
  topRight: [1, 0],
  bottomLeft: [-1, 0],
  bottomRight: [0, 1],
};

export const CORNER_LABEL_ROTATION: Record<Corner, number> = {
  topLeft: 0,
  topRight: 90,
  bottomLeft: -90,
  bottomRight: 0,
};

type Point = [number, number];

const fmt = (value: number): string => value.toFixed(2);

const edgeSegment = (from: Point, to: Point, edge: Edge, size: number, knob: number): string => {
  if (edge === 0) {
    return `L ${fmt(to[0])} ${fmt(to[1])}`;
  }
  const [ax, ay] = from;
  const dx = (to[0] - ax) / size;
  const dy = (to[1] - ay) / size;
  const nx = dy;
  const ny = -dx;
  const radius = knob * size;
  const neck = radius * 0.55;
  const lift = radius * 0.88;
  const rise = lift - Math.sqrt(radius * radius - neck * neck);
  const at = (along: number, out: number): Point => [
    ax + dx * along + nx * out * edge,
    ay + dy * along + ny * out * edge,
  ];
  const half = size / 2;
  const [p1x, p1y] = at(half - neck, 0);
  const [q1x, q1y] = at(half - neck, rise);
  const [q2x, q2y] = at(half + neck, rise);
  const [p2x, p2y] = at(half + neck, 0);
  const sweep = edge > 0 ? 1 : 0;
  return [
    `L ${fmt(p1x)} ${fmt(p1y)}`,
    `L ${fmt(q1x)} ${fmt(q1y)}`,
    `A ${fmt(radius)} ${fmt(radius)} 0 1 ${sweep} ${fmt(q2x)} ${fmt(q2y)}`,
    `L ${fmt(p2x)} ${fmt(p2y)}`,
    `L ${fmt(to[0])} ${fmt(to[1])}`,
  ].join(' ');
};

export const piecePath = (size: number, edges: PieceEdges, knob: number): string => {
  const half = size / 2;
  const corners: Point[] = [
    [-half, -half],
    [half, -half],
    [half, half],
    [-half, half],
  ];
  const sides: Edge[] = [edges.top, edges.right, edges.bottom, edges.left];
  const segments = sides.map((edge, index) => {
    const from = corners[index] ?? [0, 0];
    const to = corners[(index + 1) % 4] ?? [0, 0];
    return edgeSegment(from, to, edge, size, knob);
  });
  return `M ${fmt(-half)} ${fmt(-half)} ${segments.join(' ')} Z`;
};
