import { Flecks } from './leaf';
import { fixed, type Point, seeded, shade, tint } from './paint';

const catmull = (points: readonly Point[]): string => {
  const first = points[0];
  if (first === undefined) {
    return '';
  }
  const parts = [`M${fixed(first[0])} ${fixed(first[1])}`];
  for (let index = 0; index < points.length - 1; index++) {
    const p0 = points[Math.max(0, index - 1)] ?? first;
    const p1 = points[index] ?? first;
    const p2 = points[index + 1] ?? p1;
    const p3 = points[Math.min(points.length - 1, index + 2)] ?? p2;
    const c1: Point = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Point = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    parts.push(
      `C${fixed(c1[0])} ${fixed(c1[1])} ${fixed(c2[0])} ${fixed(c2[1])} ${fixed(p2[0])} ${fixed(p2[1])}`,
    );
  }
  return parts.join(' ');
};

const ribbonPath = (spine: readonly Point[], widths: readonly number[], seed: number) => {
  const random = seeded(seed);
  const left: Point[] = [];
  const right: Point[] = [];
  spine.forEach((point, index) => {
    const before = spine[Math.max(0, index - 1)] ?? point;
    const after = spine[Math.min(spine.length - 1, index + 1)] ?? point;
    const dx = after[0] - before[0];
    const dy = after[1] - before[1];
    const length = Math.hypot(dx, dy) || 1;
    const half = (widths[index] ?? 0) / 2;
    const wobble = () => 1 + (random() - 0.5) * 0.35;
    left.push([
      point[0] - (dy / length) * half * wobble(),
      point[1] + (dx / length) * half * wobble(),
    ]);
    right.push([
      point[0] + (dy / length) * half * wobble(),
      point[1] - (dx / length) * half * wobble(),
    ]);
  });
  const back = catmull([...right].reverse()).replace(/^M/, 'L');
  return `${catmull(left)} ${back} Z`;
};

const RIBBONS: { spine: Point[]; widths: number[]; opacity: number }[] = [
  {
    spine: [
      [1180, 180],
      [940, 470],
      [760, 760],
      [560, 1010],
      [300, 1230],
      [-80, 1420],
    ],
    widths: [120, 330, 420, 380, 300, 160],
    opacity: 0.8,
  },
  {
    spine: [
      [1150, 320],
      [900, 620],
      [700, 900],
      [470, 1130],
      [140, 1340],
    ],
    widths: [60, 200, 260, 220, 90],
    opacity: 0.66,
  },
  {
    spine: [
      [1120, 90],
      [980, 330],
      [880, 560],
      [820, 760],
    ],
    widths: [40, 150, 120, 30],
    opacity: 0.6,
  },
  {
    spine: [
      [620, 1180],
      [420, 1300],
      [180, 1480],
      [-60, 1600],
    ],
    widths: [30, 170, 210, 80],
    opacity: 0.55,
  },
];

const STREAKS: Point[][] = [
  [
    [1100, 260],
    [880, 560],
    [690, 860],
    [460, 1100],
  ],
  [
    [1060, 220],
    [860, 500],
    [700, 760],
    [520, 990],
    [260, 1220],
  ],
  [
    [980, 480],
    [800, 760],
    [600, 1000],
    [330, 1260],
    [40, 1430],
  ],
];

export const PeachWash = ({ id, color, gold }: { id: string; color: string; gold: string }) => (
  <g>
    <defs>
      <linearGradient id={`${id}-wash`} x1="1" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={tint(color, 0.3)} stopOpacity={0.3} />
        <stop offset="0.35" stopColor={color} stopOpacity={0.85} />
        <stop offset="0.7" stopColor={tint(color, 0.15)} stopOpacity={0.7} />
        <stop offset="1" stopColor={tint(color, 0.4)} stopOpacity={0.2} />
      </linearGradient>
    </defs>
    <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" />
    </filter>
    <g filter={`url(#${id}-soft)`} opacity={0.55}>
      {RIBBONS.slice(0, 2).map((ribbon, index) => (
        <path
          key={ribbon.widths.join(':')}
          d={ribbonPath(
            ribbon.spine,
            ribbon.widths.map((width) => width * 1.25),
            7 + index * 5,
          )}
          fill={tint(color, 0.1)}
        />
      ))}
    </g>
    {RIBBONS.map((ribbon, index) => {
      const d = ribbonPath(ribbon.spine, ribbon.widths, 31 + index * 17);
      const inner = ribbonPath(
        ribbon.spine.slice(1, -1),
        ribbon.widths.slice(1, -1).map((width) => width * 0.45),
        53 + index * 11,
      );
      return (
        <g key={d.slice(0, 24)} opacity={ribbon.opacity * 0.75}>
          <path d={d} fill={`url(#${id}-wash)`} />
          <path d={inner} fill={tint(color, 0.45)} fillOpacity={0.4} />
          <path
            d={d}
            fill="none"
            stroke={shade(color, 0.16)}
            strokeOpacity={0.4}
            strokeWidth={2.4}
          />
        </g>
      );
    })}
    {STREAKS.map((streak) => (
      <path
        key={`${streak[0]?.[0]}:${streak[0]?.[1]}`}
        d={catmull(streak)}
        fill="none"
        stroke={shade(color, 0.14)}
        strokeOpacity={0.45}
        strokeWidth={1.6}
      />
    ))}
    <path
      d={catmull([
        [1120, 120],
        [930, 420],
        [770, 700],
        [600, 930],
      ])}
      fill="none"
      stroke={gold}
      strokeOpacity={0.55}
      strokeWidth={1.4}
    />
    <Flecks center={[930, 470]} spread={[90, 110]} count={60} color={gold} seed={7} />
    <Flecks center={[600, 1240]} spread={[80, 70]} count={44} color={gold} seed={19} />
  </g>
);
