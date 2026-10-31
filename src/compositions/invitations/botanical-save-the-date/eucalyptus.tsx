import { settle, tween } from '../../promo/timing';
import { LeafDefs } from './leaf';
import { type Point, seeded, shade, tint } from './paint';
import { BranchLeaves, type BranchSpec, growBranch } from './spray';

interface Edge {
  from: Point;
  to: Point;
  count: number;
  leaf: number;
}

const EDGES: Edge[] = [
  { from: [-20, 430], to: [760, 440], count: 9, leaf: 124 },
  { from: [190, 360], to: [170, 1180], count: 9, leaf: 122 },
  { from: [1120, 1470], to: [340, 1450], count: 9, leaf: 124 },
  { from: [920, 1560], to: [930, 700], count: 9, leaf: 122 },
  { from: [880, 420], to: [1060, 380], count: 3, leaf: 86 },
  { from: [230, 1470], to: [40, 1560], count: 3, leaf: 86 },
];

const growEdge = (edge: Edge, edgeIndex: number) => {
  const random = seeded(301 + edgeIndex * 31);
  const along = (Math.atan2(edge.to[1] - edge.from[1], edge.to[0] - edge.from[0]) * 180) / Math.PI;
  return Array.from({ length: edge.count }, (_, index) => {
    const t = edge.count === 1 ? 0 : index / (edge.count - 1);
    const origin: Point = [
      edge.from[0] + (edge.to[0] - edge.from[0]) * t + (random() - 0.5) * 40,
      edge.from[1] + (edge.to[1] - edge.from[1]) * t + (random() - 0.5) * 40,
    ];
    const spec: BranchSpec = {
      angle: along + (random() - 0.5) * 70 + (index % 3 === 1 ? 180 : 0),
      length: 220 + random() * 140,
      curve: (random() - 0.5) * 0.3,
      leaf: edge.leaf * (0.8 + random() * 0.35),
      count: 5 + Math.floor(random() * 2),
      girth: 1.75,
      spread: 46,
    };
    return { branch: growBranch(origin, spec, 61 + edgeIndex * 97 + index * 13), order: index };
  });
};

const BRANCHES = EDGES.flatMap((edge, index) => growEdge(edge, index));

export const EucalyptusFrame = ({
  id,
  base,
  card,
  paper,
  frame,
  start,
  swing,
}: {
  id: string;
  base: string;
  card: { x: number; y: number; width: number; height: number };
  paper: string;
  frame: number;
  start: number;
  swing: (index: number) => number;
}) => {
  const greens = { id, base };
  const pale = { id: `${id}-pale`, base: tint(base, 0.28) };
  return (
    <g>
      <defs>
        <LeafDefs greens={greens} />
        <LeafDefs greens={pale} />
      </defs>
      {BRANCHES.map(({ branch, order }, index) => {
        const delay = start + order * 2.4;
        return (
          <BranchLeaves
            key={branch.stem}
            branch={branch}
            greens={index % 3 === 2 ? pale : greens}
            stemColor={shade(base, 0.25)}
            swing={swing(index)}
            grow={(leaf) =>
              tween(frame, [delay + leaf * 1.4, delay + leaf * 1.4 + 18], [0.001, 1], settle)
            }
          />
        );
      })}
      <rect x={card.x} y={card.y} width={card.width} height={card.height} fill={paper} />
    </g>
  );
};
