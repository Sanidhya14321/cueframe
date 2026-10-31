import { random } from 'remotion';
import { type Gold, useSvgId, withAlpha } from './gold';
import type { Point } from './ornament';

type Segment = [Point, Point, Point, Point];

const SEGMENTS: Segment[] = [
  [
    [-220, 1010],
    [380, 1070],
    [1000, 920],
    [1090, 640],
  ],
  [
    [1090, 640],
    [1160, 400],
    [720, 150],
    [300, 220],
  ],
  [
    [300, 220],
    [60, 262],
    [-80, 420],
    [-160, 540],
  ],
];

const pathOf = (offset: number) =>
  SEGMENTS.map(
    ([a, b, c, d], index) =>
      `${index === 0 ? `M ${a[0]} ${a[1] + offset}` : ''} C ${b[0]} ${b[1] + offset} ${c[0]} ${c[1] + offset} ${d[0]} ${d[1] + offset}`,
  ).join(' ');

const pointOnCurve = (param: number): Point => {
  const scaled = Math.max(0, Math.min(0.99999, param)) * SEGMENTS.length;
  const segment = SEGMENTS[Math.floor(scaled)];
  if (segment === undefined) {
    return [0, 0];
  }
  const t = scaled - Math.floor(scaled);
  const [a, b, c, d] = segment;
  const u = 1 - t;
  const blend = (index: 0 | 1) =>
    u * u * u * a[index] +
    3 * u * u * t * b[index] +
    3 * u * t * t * c[index] +
    t * t * t * d[index];
  return [blend(0), blend(1)];
};

const SAMPLES = 360;

const LENGTHS = Array.from({ length: SAMPLES + 1 }, (_, index) =>
  pointOnCurve(index / SAMPLES),
).reduce<number[]>((total, point, index, points) => {
  const previous = points[index - 1] ?? point;
  total.push((total.at(-1) ?? 0) + Math.hypot(point[0] - previous[0], point[1] - previous[1]));
  return total;
}, []);

const pointAt = (share: number): Point => {
  const full = LENGTHS.at(-1) ?? 1;
  const target = Math.max(0, Math.min(1, share)) * full;
  const index = Math.max(
    1,
    LENGTHS.findIndex((length) => length >= target),
  );
  const before = LENGTHS[index - 1] ?? 0;
  const after = LENGTHS[index] ?? full;
  const t = after > before ? (target - before) / (after - before) : 0;
  return pointOnCurve((index - 1 + t) / SAMPLES);
};

const TAIL = 0.34;
const LANES = [-18, 0, 16];

export const LightStreak = ({ head, gold }: { head: number; gold: Gold }) => {
  const glowId = useSvgId('streak-glow');
  const flareId = useSvgId('streak-flare');
  if (head <= 0 || head - TAIL >= 1) {
    return null;
  }
  const dashFor = (length: number) => {
    const start = Math.max(0, head - length);
    const visible = Math.max(0.0001, Math.min(1, head) - start);
    return { strokeDasharray: `0 ${start.toFixed(4)} ${visible.toFixed(4)} 3` };
  };
  const tip = pointAt(Math.min(1, head));
  const tipFade = head > 1 ? Math.max(0, 1 - (head - 1) / 0.12) : Math.min(1, head / 0.04);
  return (
    <g>
      <defs>
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={16} />
        </filter>
        <filter id={flareId} x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation={22} />
        </filter>
      </defs>
      <g fill="none" strokeLinecap="round">
        {LANES.map((offset, lane) => (
          <g key={offset}>
            <path
              d={pathOf(offset)}
              pathLength={1}
              stroke={withAlpha(gold.mid, 0.55)}
              strokeWidth={22}
              filter={`url(#${glowId})`}
              style={dashFor(TAIL)}
            />
            {[TAIL, TAIL * 0.6, TAIL * 0.3].map((length, layer) => (
              <path
                key={length}
                d={pathOf(offset)}
                pathLength={1}
                stroke={layer === 2 ? gold.highlight : gold.light}
                strokeOpacity={0.22 + layer * 0.3}
                strokeWidth={(lane === 1 ? 5 : 3) + layer}
                style={dashFor(length)}
              />
            ))}
          </g>
        ))}
      </g>
      {Array.from({ length: 34 }, (_, index) => {
        const lag = (index / 34) * TAIL;
        const share = head - lag;
        if (share <= 0 || share >= 1) {
          return null;
        }
        const [x, y] = pointAt(share);
        const drift = lag * 260;
        return (
          <circle
            key={index.toString()}
            cx={x + (random(`streak-x-${index}`) - 0.5) * 60}
            cy={y + drift + (random(`streak-y-${index}`) - 0.5) * 50}
            r={1.4 + random(`streak-r-${index}`) * 3}
            fill={gold.highlight}
            opacity={(1 - lag / TAIL) * 0.85}
          />
        );
      })}
      <g opacity={tipFade}>
        <circle
          cx={tip[0]}
          cy={tip[1]}
          r={46}
          fill={withAlpha(gold.light, 0.75)}
          filter={`url(#${flareId})`}
        />
        <circle cx={tip[0]} cy={tip[1]} r={9} fill={gold.highlight} />
        <path
          d={`M ${tip[0] - 70} ${tip[1]} L ${tip[0] + 70} ${tip[1]} M ${tip[0]} ${tip[1] - 34} L ${tip[0]} ${tip[1] + 34}`}
          stroke={gold.highlight}
          strokeOpacity={0.7}
          strokeWidth={2}
        />
      </g>
    </g>
  );
};
