import type { ArchSaveTheDateProps } from '@/schemas';
import { fixed, seeded, wrap } from './camera';

type Sky = ArchSaveTheDateProps['sky'];
type Birds = ArchSaveTheDateProps['birds'];

export interface SkyIds {
  sky: string;
  glow: string;
  cloud: string;
  soft: string;
  wisp: string;
}

const CLOUD_SPAN = 2700;

const CLOUD_LEFT = -800;

export const SkyDefs = ({ ids, sky }: { ids: SkyIds; sky: Sky }) => (
  <>
    <linearGradient id={ids.sky} gradientUnits="userSpaceOnUse" x1="0" y1="-300" x2="0" y2="1700">
      <stop offset="0" stopColor={sky.top} />
      <stop offset="0.3" stopColor={sky.top} />
      <stop offset="0.62" stopColor={sky.middle} />
      <stop offset="0.9" stopColor={sky.horizon} />
      <stop offset="1" stopColor={sky.horizon} />
    </linearGradient>
    <linearGradient id={ids.glow} gradientUnits="userSpaceOnUse" x1="0" y1="200" x2="0" y2="1650">
      <stop offset="0" stopColor={sky.glow} stopOpacity={0} />
      <stop offset="0.45" stopColor={sky.glow} stopOpacity={0.35} />
      <stop offset="1" stopColor={sky.glow} stopOpacity={1} />
    </linearGradient>
    <linearGradient id={ids.cloud} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={sky.cloud} />
      <stop offset="0.55" stopColor={sky.cloud} />
      <stop offset="1" stopColor={sky.cloudShade} />
    </linearGradient>
    <filter id={ids.soft} x="-30%" y="-40%" width="160%" height="180%">
      <feGaussianBlur stdDeviation="7" />
    </filter>
    <filter id={ids.wisp} x="-30%" y="-200%" width="160%" height="500%">
      <feGaussianBlur stdDeviation="16" />
    </filter>
  </>
);

const Cloud = ({
  x,
  y,
  width,
  ids,
  sky,
  seed,
}: {
  x: number;
  y: number;
  width: number;
  ids: SkyIds;
  sky: Sky;
  seed: number;
}) => {
  const puffs = 7;
  return (
    <g>
      <ellipse
        cx={fixed(x)}
        cy={fixed(y + width * 0.04)}
        rx={fixed(width * 0.8)}
        ry={fixed(width * 0.08)}
        fill={sky.cloud}
        opacity={0.6}
        filter={`url(#${ids.wisp})`}
      />
      <g filter={`url(#${ids.soft})`} opacity={0.9}>
        <ellipse
          cx={fixed(x)}
          cy={fixed(y - width * 0.02)}
          rx={fixed(width * 0.44)}
          ry={fixed(width * 0.08)}
          fill={sky.cloudShade}
          opacity={0.7}
        />
        {Array.from({ length: puffs }, (_, index) => {
          const share = index / (puffs - 1) - 0.5 + (seeded(index, seed + 3) - 0.5) * 0.08;
          const swell = 1 - Math.abs(share) * 1.5;
          const radius = width * (0.07 + 0.12 * swell + seeded(index, seed) * 0.06);
          const lift = width * swell * seeded(index, seed + 5) * 0.12;
          return (
            <circle
              key={index}
              cx={fixed(x + share * width * 0.85)}
              cy={fixed(y - radius * 0.6 - lift)}
              r={fixed(radius)}
              fill={`url(#${ids.cloud})`}
            />
          );
        })}
      </g>
    </g>
  );
};

const Bird = ({
  x,
  y,
  size,
  flap,
  color,
}: {
  x: number;
  y: number;
  size: number;
  flap: number;
  color: string;
}) => {
  const tip = flap * size * 0.55;
  return (
    <path
      d={`M ${fixed(x - size)} ${fixed(y - tip)} Q ${fixed(x - size * 0.45)} ${fixed(y - size * 0.3 - tip * 0.3)} ${fixed(x)} ${fixed(y)} Q ${fixed(x + size * 0.45)} ${fixed(y - size * 0.3 - tip * 0.3)} ${fixed(x + size)} ${fixed(y - tip)}`}
      fill="none"
      stroke={color}
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
};

const glowAmount = (time: number, sky: Sky): number => {
  if (time <= sky.glowAt) {
    return 0;
  }
  const phase = ((time - sky.glowAt) / sky.glowFrames) * Math.PI * 2;
  return sky.glowStrength * (0.5 - 0.5 * Math.cos(phase));
};

export const SkyLayer = ({
  sky,
  birds,
  ids,
  time,
}: {
  sky: Sky;
  birds: Birds;
  ids: SkyIds;
  time: number;
}) => {
  const flight = (time - birds.at) / birds.frames;
  return (
    <g>
      <rect x={-400} y={-600} width={1880} height={3000} fill={`url(#${ids.sky})`} />
      {Array.from({ length: sky.clouds }, (_, index) => {
        const width = 300 + seeded(index, 11) * 220;
        const drift = time * sky.cloudSpeed * (0.6 + seeded(index, 13) * 0.7);
        const x = wrap(seeded(index, 17) * CLOUD_SPAN + drift, CLOUD_SPAN) + CLOUD_LEFT;
        const y = 280 + ((index * 0.618) % 1) * 960 + seeded(index, 19) * 80;
        return <Cloud key={index} x={x} y={y} width={width} ids={ids} sky={sky} seed={index} />;
      })}
      <rect
        x={-400}
        y={-600}
        width={1880}
        height={3000}
        fill={`url(#${ids.glow})`}
        opacity={glowAmount(time, sky)}
      />
      {Array.from({ length: birds.count }, (_, index) => {
        const delay = seeded(index, 23) * 0.22;
        const progress = (flight - delay) / 0.78;
        if (progress <= 0 || progress >= 1) {
          return null;
        }
        const size = 11 + seeded(index, 29) * 8;
        const x = -240 + progress * 1500 + seeded(index, 31) * 90;
        const y = 1180 + seeded(index, 37) * 170 - progress * 150 + Math.sin(time / 9 + index) * 3;
        const flap = Math.sin(time * 0.62 + seeded(index, 41) * 6);
        return <Bird key={index} x={x} y={y} size={size} flap={flap} color={birds.color} />;
      })}
    </g>
  );
};
