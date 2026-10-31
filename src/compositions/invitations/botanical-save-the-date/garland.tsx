import { settle, smooth, tween } from '../../promo/timing';
import { LeafDefs } from './leaf';
import { fixed, type Point, seeded, shade, tint } from './paint';
import { BranchLeaves, growBranch } from './spray';

const petal = (length: number, width: number): string =>
  [
    'M0 0',
    `C${fixed(length * 0.05)} ${fixed(-width * 0.75)} ${fixed(length * 1.1)} ${fixed(-width * 0.95)} ${fixed(length)} 0`,
    `C${fixed(length * 1.1)} ${fixed(width * 0.95)} ${fixed(length * 0.05)} ${fixed(width * 0.75)} 0 0`,
    'Z',
  ].join(' ');

const RINGS = [
  { count: 9, length: 1, width: 0.9, depth: 0, twist: 0 },
  { count: 8, length: 0.78, width: 0.82, depth: 0.35, twist: 20 },
  { count: 7, length: 0.56, width: 0.74, depth: 0.65, twist: 8 },
  { count: 6, length: 0.34, width: 0.7, depth: 1, twist: 30 },
];

const Peony = ({
  id,
  at,
  radius,
  color,
  heart,
  open,
  seed,
  turn,
}: {
  id: string;
  turn: number;
  at: Point;
  radius: number;
  color: string;
  heart: string;
  open: number;
  seed: number;
}) => {
  if (open <= 0) {
    return null;
  }
  const random = seeded(seed);
  const dots = Array.from({ length: 16 }, (_, index) => ({
    key: index,
    angle: random() * Math.PI * 2,
    distance: random() * radius * 0.16,
    r: 2 + random() * 3.5,
  }));
  return (
    <g
      transform={`translate(${fixed(at[0])} ${fixed(at[1])}) rotate(${fixed((1 - open) * -30 + turn)}) scale(${(0.5 + 0.5 * open).toFixed(4)} ${(0.5 + 0.5 * open).toFixed(4)})`}
      opacity={Math.min(1, open * 1.4)}
    >
      <defs>
        {RINGS.map((ring, index) => (
          <linearGradient key={ring.count} id={`${id}-ring-${index}`} x1="0" x2="1">
            <stop
              offset="0"
              stopColor={shade(color, 0.14 + ring.depth * 0.12)}
              stopOpacity={0.95}
            />
            <stop
              offset="0.6"
              stopColor={tint(color, 0.08 - ring.depth * 0.06)}
              stopOpacity={0.92}
            />
            <stop offset="1" stopColor={tint(color, 0.5 - ring.depth * 0.2)} stopOpacity={0.95} />
          </linearGradient>
        ))}
      </defs>
      {RINGS.map((ring, ringIndex) =>
        Array.from({ length: ring.count }, (_, index) => {
          const angle = (index / ring.count) * 360 + ring.twist + seed * 7;
          const length = radius * ring.length * (0.92 + random() * 0.16);
          return (
            <g key={`${ring.count}:${index}`} transform={`rotate(${fixed(angle)})`}>
              <path
                d={petal(length, length * ring.width)}
                fill={`url(#${id}-ring-${ringIndex})`}
                stroke={shade(color, 0.32)}
                strokeOpacity={0.42}
                strokeWidth={1.5}
              />
              <path
                d={petal(length * 0.7, length * ring.width * 0.6)}
                fill={index % 2 === 0 ? tint(color, 0.6) : shade(color, 0.1)}
                fillOpacity={0.12 + random() * 0.16}
              />
              <path
                d={`M${fixed(length * 0.55)} ${fixed(-length * ring.width * 0.32)} Q${fixed(length * 0.86)} 0 ${fixed(length * 0.55)} ${fixed(length * ring.width * 0.32)}`}
                fill="none"
                stroke={tint(color, 0.7)}
                strokeOpacity={0.55}
                strokeWidth={2}
              />
            </g>
          );
        }),
      )}
      <circle r={fixed(radius * 0.17)} fill={heart} fillOpacity={0.7} />
      {dots.map((dot) => (
        <circle
          key={dot.key}
          cx={fixed(Math.cos(dot.angle) * dot.distance)}
          cy={fixed(Math.sin(dot.angle) * dot.distance)}
          r={fixed(dot.r)}
          fill={shade(heart, 0.1)}
          fillOpacity={0.85}
        />
      ))}
    </g>
  );
};

export interface Hexagon {
  center: Point;
  rx: number;
  ry: number;
}

const hexagonPoints = (hexagon: Hexagon): Point[] => {
  const { center, rx, ry } = hexagon;
  return [
    [center[0], center[1] - ry],
    [center[0] + rx, center[1] - ry * 0.42],
    [center[0] + rx, center[1] + ry * 0.42],
    [center[0], center[1] + ry],
    [center[0] - rx, center[1] + ry * 0.42],
    [center[0] - rx, center[1] - ry * 0.42],
  ];
};

const garlandBranch = (
  origin: Point,
  angle: number,
  length: number,
  curve: number,
  leaf: number,
  count: number,
) => ({
  origin,
  spec: { angle, length, curve, leaf, count, girth: 1.1 },
});

const BRANCHES = [
  garlandBranch([450, 1270], -150, 600, 0.14, 128, 10),
  garlandBranch([630, 1270], -30, 600, -0.14, 128, 10),
  garlandBranch([380, 1300], 172, 300, -0.1, 96, 5),
  garlandBranch([700, 1300], 8, 300, 0.1, 96, 5),
  garlandBranch([500, 1330], 120, 220, 0.1, 90, 4),
  garlandBranch([580, 1330], 60, 220, -0.1, 90, 4),
].map((item, index) => growBranch(item.origin, item.spec, 101 + index * 9));

const FILLERS: { from: Point; angle: number; length: number }[] = [
  { from: [420, 1290], angle: 150, length: 150 },
  { from: [660, 1290], angle: 30, length: 150 },
  { from: [440, 1330], angle: 118, length: 120 },
  { from: [640, 1320], angle: 66, length: 130 },
  { from: [230, 1160], angle: -140, length: 110 },
  { from: [860, 1140], angle: -40, length: 110 },
];

const BUDS = [0.45, 0.62, 0.78, 0.92, 1];

const Filler = ({
  from,
  angle,
  length,
  color,
}: {
  from: Point;
  angle: number;
  length: number;
  color: string;
}) => {
  const radians = (angle * Math.PI) / 180;
  return (
    <g>
      <path
        d={`M${fixed(from[0])} ${fixed(from[1])} l${fixed(Math.cos(radians) * length)} ${fixed(Math.sin(radians) * length)}`}
        stroke={shade(color, 0.3)}
        strokeOpacity={0.55}
        strokeWidth={1.4}
      />
      {BUDS.map((t, index) => (
        <circle
          key={t}
          cx={fixed(from[0] + Math.cos(radians) * length * t + (index % 2 === 0 ? 7 : -7))}
          cy={fixed(from[1] + Math.sin(radians) * length * t)}
          r={fixed(5 + (index % 3) * 1.5)}
          fill={color}
          fillOpacity={0.8}
        />
      ))}
    </g>
  );
};

const BLOOMS = [
  { at: [178, 1104] as Point, radius: 62, delay: 16 },
  { at: [904, 1094] as Point, radius: 64, delay: 20 },
  { at: [312, 1190] as Point, radius: 124, delay: 0 },
  { at: [772, 1180] as Point, radius: 130, delay: 12 },
  { at: [540, 1256] as Point, radius: 150, delay: 6 },
];

export const PeonyGarland = ({
  id,
  hexagon,
  gold,
  lineWidth,
  greens,
  color,
  heart,
  filler,
  frame,
  start,
  swing,
}: {
  id: string;
  hexagon: Hexagon;
  swing: (index: number) => number;
  filler: string;
  gold: string;
  lineWidth: number;
  greens: string;
  color: string;
  heart: string;
  frame: number;
  start: number;
}) => {
  const points = hexagonPoints(hexagon);
  const d = `${points.map((point, index) => `${index === 0 ? 'M' : 'L'}${fixed(point[0])} ${fixed(point[1])}`).join(' ')} Z`;
  const perimeter = points.reduce((sum, point, index) => {
    const next = points[(index + 1) % points.length] ?? point;
    return sum + Math.hypot(next[0] - point[0], next[1] - point[1]);
  }, 0);
  const draw = tween(frame, [start, start + 44], [0, 1], smooth);
  const leaves = { id, base: greens };
  return (
    <g>
      <defs>
        <LeafDefs greens={leaves} />
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={tint(gold, 0.25)} />
          <stop offset="0.5" stopColor={shade(gold, 0.12)} />
          <stop offset="1" stopColor={tint(gold, 0.15)} />
        </linearGradient>
      </defs>
      {draw > 0 ? (
        <path
          d={d}
          fill="none"
          stroke={`url(#${id}-gold)`}
          strokeWidth={lineWidth}
          strokeDasharray={`${fixed(perimeter * draw)} ${fixed(perimeter)}`}
          strokeLinejoin="miter"
        />
      ) : null}
      {BRANCHES.map((branch, index) => (
        <BranchLeaves
          key={branch.stem}
          branch={branch}
          greens={leaves}
          stemColor={shade(greens, 0.3)}
          swing={swing(index)}
          grow={(leaf) =>
            tween(
              frame,
              [start + 8 + index * 3 + leaf * 2, start + 24 + index * 3 + leaf * 2],
              [0.001, 1],
              settle,
            )
          }
        />
      ))}
      <g opacity={tween(frame, [start + 16, start + 40], [0, 1], smooth)}>
        {FILLERS.map((item) => (
          <Filler key={`${item.from[0]}:${item.angle}`} {...item} color={filler} />
        ))}
      </g>
      {BLOOMS.map((bloom, index) => (
        <Peony
          key={bloom.radius}
          id={`${id}-peony-${index}`}
          at={bloom.at}
          radius={bloom.radius}
          color={color}
          heart={heart}
          seed={index + 3}
          turn={swing(index + 7) * 1.5}
          open={tween(frame, [start + 10 + bloom.delay, start + 40 + bloom.delay], [0, 1], settle)}
        />
      ))}
    </g>
  );
};
