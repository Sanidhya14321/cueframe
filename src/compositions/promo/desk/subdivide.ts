import * as THREE from 'three';

interface Mesh {
  positions: number[];
  weights: Float32Array[];
  triangles: number[];
}

const weld = (geometry: THREE.BufferGeometry, bones: number): Mesh => {
  const position = geometry.getAttribute('position');
  const skinIndex = geometry.getAttribute('skinIndex');
  const skinWeight = geometry.getAttribute('skinWeight');
  const index = geometry.getIndex();
  const remap = new Map<string, number>();
  const lookup: number[] = [];
  const positions: number[] = [];
  const weights: Float32Array[] = [];
  for (let vertex = 0; vertex < position.count; vertex++) {
    const x = position.getX(vertex);
    const y = position.getY(vertex);
    const z = position.getZ(vertex);
    const key = `${x.toFixed(6)}:${y.toFixed(6)}:${z.toFixed(6)}`;
    const existing = remap.get(key);
    if (existing !== undefined) {
      lookup.push(existing);
      continue;
    }
    const dense = new Float32Array(bones);
    for (let slot = 0; slot < 4; slot++) {
      const bone = skinIndex.getComponent(vertex, slot);
      dense[bone] = (dense[bone] ?? 0) + skinWeight.getComponent(vertex, slot);
    }
    remap.set(key, positions.length / 3);
    lookup.push(positions.length / 3);
    positions.push(x, y, z);
    weights.push(dense);
  }
  const source = index === null ? Array.from({ length: position.count }, (_, i) => i) : index.array;
  const triangles = Array.from(source, (vertex) => lookup[vertex] ?? 0);
  return { positions, weights, triangles };
};

const edgeKey = (a: number, b: number): string => (a < b ? `${a}:${b}` : `${b}:${a}`);

interface Edge {
  a: number;
  b: number;
  opposite: number[];
}

type Stencil = [number, number][];

const triangleCorners = (triangles: number[], face: number): [number, number, number] => [
  triangles[face] ?? 0,
  triangles[face + 1] ?? 0,
  triangles[face + 2] ?? 0,
];

const buildEdges = (triangles: number[], vertexCount: number) => {
  const edges = new Map<string, Edge>();
  const neighbors = Array.from({ length: vertexCount }, () => new Set<number>());
  for (let face = 0; face < triangles.length; face += 3) {
    const corners = triangleCorners(triangles, face);
    for (let side = 0; side < 3; side++) {
      const a = corners[side] ?? 0;
      const b = corners[(side + 1) % 3] ?? 0;
      const key = edgeKey(a, b);
      const edge = edges.get(key) ?? { a, b, opposite: [] };
      edge.opposite.push(corners[(side + 2) % 3] ?? 0);
      edges.set(key, edge);
      neighbors[a]?.add(b);
      neighbors[b]?.add(a);
    }
  }
  return { edges, neighbors };
};

const rimNeighbors = (edges: Map<string, Edge>, vertexCount: number): number[][] => {
  const rims = Array.from({ length: vertexCount }, () => [] as number[]);
  for (const edge of edges.values()) {
    if (edge.opposite.length === 1) {
      rims[edge.a]?.push(edge.b);
      rims[edge.b]?.push(edge.a);
    }
  }
  return rims;
};

const vertexStencil = (vertex: number, ring: number[], rim: number[]): Stencil => {
  if (rim.length === 2) {
    return [[vertex, 0.75], ...rim.map((other): [number, number] => [other, 0.125])];
  }
  const beta = ring.length > 3 ? 3 / (8 * ring.length) : 3 / 16;
  return [
    [vertex, 1 - ring.length * beta],
    ...ring.map((other): [number, number] => [other, beta]),
  ];
};

const edgeStencil = (edge: Edge): Stencil =>
  edge.opposite.length === 2
    ? [
        [edge.a, 0.375],
        [edge.b, 0.375],
        [edge.opposite[0] ?? 0, 0.125],
        [edge.opposite[1] ?? 0, 0.125],
      ]
    : [
        [edge.a, 0.5],
        [edge.b, 0.5],
      ];

const applyStencil = (positions: number[], stencil: Stencil, out: number[]): void => {
  for (let axis = 0; axis < 3; axis++) {
    out.push(
      stencil.reduce((sum, [other, share]) => sum + (positions[other * 3 + axis] ?? 0) * share, 0),
    );
  }
};

const averageWeights = (weights: Float32Array[], a: number, b: number): Float32Array => {
  const left = weights[a] ?? new Float32Array(0);
  const right = weights[b] ?? new Float32Array(0);
  return left.map((value, bone) => (value + (right[bone] ?? 0)) / 2);
};

const loopStep = ({ positions, weights, triangles }: Mesh): Mesh => {
  const vertexCount = positions.length / 3;
  const { edges, neighbors } = buildEdges(triangles, vertexCount);
  const rims = rimNeighbors(edges, vertexCount);
  const next: number[] = [];
  const nextWeights: Float32Array[] = [];
  for (let vertex = 0; vertex < vertexCount; vertex++) {
    applyStencil(
      positions,
      vertexStencil(vertex, [...(neighbors[vertex] ?? [])], rims[vertex] ?? []),
      next,
    );
    nextWeights.push(weights[vertex] ?? new Float32Array(0));
  }
  const midpoint = new Map<string, number>();
  for (const [key, edge] of edges) {
    midpoint.set(key, next.length / 3);
    applyStencil(positions, edgeStencil(edge), next);
    nextWeights.push(averageWeights(weights, edge.a, edge.b));
  }
  const nextTriangles: number[] = [];
  for (let face = 0; face < triangles.length; face += 3) {
    const [a, b, c] = triangleCorners(triangles, face);
    const ab = midpoint.get(edgeKey(a, b)) ?? 0;
    const bc = midpoint.get(edgeKey(b, c)) ?? 0;
    const ca = midpoint.get(edgeKey(c, a)) ?? 0;
    nextTriangles.push(a, ab, ca, ab, b, bc, ca, bc, c, ab, bc, ca);
  }
  return { positions: next, weights: nextWeights, triangles: nextTriangles };
};

const packWeights = (weights: Float32Array[]) => {
  const indices: number[] = [];
  const values: number[] = [];
  for (const dense of weights) {
    const strongest = Array.from(dense, (weight, bone) => ({ weight, bone }))
      .sort((left, right) => right.weight - left.weight)
      .slice(0, 4);
    const total = strongest.reduce((sum, entry) => sum + entry.weight, 0) || 1;
    for (const entry of strongest) {
      indices.push(entry.bone);
      values.push(entry.weight / total);
    }
  }
  return { indices, values };
};

export const subdivideSkinned = (
  geometry: THREE.BufferGeometry,
  bones: number,
  levels: number,
): THREE.BufferGeometry => {
  let mesh = weld(geometry, bones);
  for (let level = 0; level < levels; level++) {
    mesh = loopStep(mesh);
  }
  const { indices, values } = packWeights(mesh.weights);
  const result = new THREE.BufferGeometry();
  result.setAttribute('position', new THREE.Float32BufferAttribute(mesh.positions, 3));
  result.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(indices, 4));
  result.setAttribute('skinWeight', new THREE.Float32BufferAttribute(values, 4));
  result.setIndex(mesh.triangles);
  result.computeVertexNormals();
  return result;
};
