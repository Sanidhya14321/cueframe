import { random } from 'remotion';
import { smooth, tween } from '../../promo/timing';
import { type Gold, useSvgId } from './gold';

const FOUNTAIN_SPOTS: [number, number, number][] = [
  [470, 905, 1],
  [1450, 905, 1],
  [250, 960, 1.25],
  [1670, 960, 1.25],
  [640, 850, 0.8],
  [1280, 850, 0.8],
  [80, 1010, 1.45],
  [1840, 1010, 1.45],
  [360, 860, 0.75],
  [1560, 860, 0.75],
  [760, 1020, 1.3],
  [1160, 1020, 1.3],
];

const PARTICLES = 26;
const LIFE = 42;

export const Sparklers = ({
  frame,
  from,
  count,
  gold,
}: {
  frame: number;
  from: number;
  count: number;
  gold: Gold;
}) => {
  const coreId = useSvgId('sparkler-core');
  if (count <= 0 || frame < from) {
    return null;
  }
  return (
    <g>
      <defs>
        <linearGradient id={coreId} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={gold.highlight} />
          <stop offset="0.25" stopColor={gold.light} stopOpacity={0.9} />
          <stop offset="0.7" stopColor={gold.mid} stopOpacity={0.35} />
          <stop offset="1" stopColor={gold.mid} stopOpacity={0} />
        </linearGradient>
      </defs>
      {FOUNTAIN_SPOTS.slice(0, count).map(([x, y, depth], index) => {
        const seed = `fountain-${index}`;
        const start = from + random(`${seed}-delay`) * 40;
        const grow = tween(frame, [start, start + 34], [0, 1], smooth);
        if (grow <= 0) {
          return null;
        }
        const height =
          (190 + random(`${seed}-h`) * 90) *
          depth *
          grow *
          (0.97 + 0.03 * Math.sin(frame * 0.3 + index));
        return (
          <g key={seed}>
            <rect
              x={x - 1.6 * depth}
              y={y - height}
              width={3.2 * depth}
              height={height}
              fill={`url(#${coreId})`}
              rx={1.6 * depth}
            />
            {Array.from({ length: PARTICLES }, (_, particle) => {
              const pSeed = `${seed}-${particle}`;
              const born = start + (particle / PARTICLES) * LIFE;
              const age = ((((frame - born) % LIFE) + LIFE) % LIFE) / LIFE;
              if (frame < born) {
                return null;
              }
              const speed = (0.75 + random(`${pSeed}-v`) * 0.5) * height;
              const rise = speed * (age * 1.25 - 0.4 * age * age);
              const drift = (random(`${pSeed}-x`) - 0.5) * 34 * depth * age;
              const size = (0.8 + random(`${pSeed}-s`) * 1.6) * depth;
              const fade = Math.min(1, age * 8) * (1 - age) * grow;
              return (
                <circle
                  key={pSeed}
                  cx={(x + drift).toFixed(2)}
                  cy={(y - rise).toFixed(2)}
                  r={size.toFixed(2)}
                  fill={particle % 3 === 0 ? gold.highlight : gold.light}
                  opacity={fade.toFixed(3)}
                />
              );
            })}
          </g>
        );
      })}
    </g>
  );
};

const BURST_SPOTS: [number, number][] = [
  [470, 360],
  [1440, 430],
  [330, 560],
  [1580, 300],
  [620, 220],
  [1310, 600],
  [240, 300],
  [1700, 520],
  [760, 580],
  [1150, 260],
];

const SPARKS = 54;
const BURST_LIFE = 64;

export const Bursts = ({
  frame,
  from,
  count,
  gold,
}: {
  frame: number;
  from: number;
  count: number;
  gold: Gold;
}) => (
  <g>
    {BURST_SPOTS.slice(0, count).map(([x, y], index) => {
      const seed = `burst-${index}`;
      const period = 150 + random(`${seed}-p`) * 60;
      const offset = from + index * 23;
      if (frame < offset) {
        return null;
      }
      const age = ((frame - offset) % period) / BURST_LIFE;
      if (age >= 1) {
        return null;
      }
      const radius = 120 + random(`${seed}-r`) * 70;
      const spread = radius * (1 - (1 - age) ** 3);
      const fall = 60 * age * age;
      const flash = tween(age, [0, 0.06], [0, 1], smooth);
      return (
        <g key={seed} opacity={(flash * (1 - age) ** 1.4).toFixed(3)}>
          {Array.from({ length: SPARKS }, (_, spark) => {
            const angle = (spark / SPARKS) * Math.PI * 2 + random(`${seed}-${spark}-a`) * 0.2;
            const reach = spread * (0.55 + random(`${seed}-${spark}-d`) * 0.45);
            const cx = x + Math.cos(angle) * reach;
            const cy = y + Math.sin(angle) * reach + fall;
            const tail = Math.min(18, spread * 0.12);
            const twinkle = 0.55 + 0.45 * Math.sin(frame * 1.7 + spark * 2.3);
            return (
              <g key={spark.toString()}>
                <line
                  x1={(cx - Math.cos(angle) * tail).toFixed(2)}
                  y1={(cy - Math.sin(angle) * tail).toFixed(2)}
                  x2={cx.toFixed(2)}
                  y2={cy.toFixed(2)}
                  stroke={gold.light}
                  strokeOpacity={0.45}
                  strokeWidth={1.2}
                />
                <circle
                  cx={cx.toFixed(2)}
                  cy={cy.toFixed(2)}
                  r={1.7}
                  fill={gold.highlight}
                  opacity={twinkle.toFixed(3)}
                />
              </g>
            );
          })}
        </g>
      );
    })}
  </g>
);

export const Dust = ({
  frame,
  count,
  color,
  width = 1920,
  height = 1080,
  seed = 'dust',
}: {
  frame: number;
  count: number;
  color: string;
  width?: number;
  height?: number;
  seed?: string;
}) => (
  <g>
    {Array.from({ length: count }, (_, index) => {
      const key = `${seed}-${index}`;
      const big = index % 7 === 0;
      const speed = 0.25 + random(`${key}-v`) * 0.55;
      const travelled = random(`${key}-y`) * (height + 80) - frame * speed;
      const y = (((travelled % (height + 80)) + height + 80) % (height + 80)) - 40;
      const x = random(`${key}-x`) * width + Math.sin(frame / 60 + index) * 10;
      const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame / 18 + index * 1.9));
      return (
        <circle
          key={key}
          cx={x.toFixed(2)}
          cy={y.toFixed(2)}
          r={big ? 7 + random(`${key}-r`) * 6 : 1 + random(`${key}-r`) * 1.8}
          fill={color}
          opacity={((big ? 0.12 : 0.75) * twinkle).toFixed(3)}
        />
      );
    })}
  </g>
);
