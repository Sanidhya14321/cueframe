import type { ArchSaveTheDateProps } from '@/schemas';
import { CENTER_X, fixed, seeded } from './camera';
import { FloweringStalk, RoseBush } from './plants';

type Terrace = ArchSaveTheDateProps['terrace'];
type Garden = ArchSaveTheDateProps['garden'];

export interface TerraceIds {
  stone: string;
  baluster: string;
}

const LEFT = -1400;

const RIGHT = 2500;

const BAY = 660;

const BALUSTER_PITCH = 46;

export const TerraceDefs = ({ ids, terrace }: { ids: TerraceIds; terrace: Terrace }) => (
  <>
    <linearGradient id={ids.stone} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={terrace.stone} />
      <stop offset="0.7" stopColor={terrace.stone} />
      <stop offset="1" stopColor={terrace.shade} />
    </linearGradient>
    <linearGradient id={ids.baluster} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor={terrace.shade} />
      <stop offset="0.35" stopColor={terrace.stone} />
      <stop offset="0.6" stopColor={terrace.stone} />
      <stop offset="1" stopColor={terrace.shade} />
    </linearGradient>
  </>
);

const balusterPath = (x: number, top: number, bottom: number): string => {
  const h = bottom - top;
  const w = BALUSTER_PITCH * 0.36;
  return [
    `M ${fixed(x - w * 0.55)} ${fixed(top)}`,
    `L ${fixed(x + w * 0.55)} ${fixed(top)}`,
    `C ${fixed(x + w * 0.3)} ${fixed(top + h * 0.2)} ${fixed(x + w * 1.05)} ${fixed(top + h * 0.45)} ${fixed(x + w)} ${fixed(top + h * 0.7)}`,
    `C ${fixed(x + w * 0.95)} ${fixed(top + h * 0.86)} ${fixed(x + w * 0.5)} ${fixed(top + h * 0.9)} ${fixed(x + w * 0.65)} ${fixed(bottom)}`,
    `L ${fixed(x - w * 0.65)} ${fixed(bottom)}`,
    `C ${fixed(x - w * 0.5)} ${fixed(top + h * 0.9)} ${fixed(x - w * 0.95)} ${fixed(top + h * 0.86)} ${fixed(x - w)} ${fixed(top + h * 0.7)}`,
    `C ${fixed(x - w * 1.05)} ${fixed(top + h * 0.45)} ${fixed(x - w * 0.3)} ${fixed(top + h * 0.2)} ${fixed(x - w * 0.55)} ${fixed(top)}`,
    'Z',
  ].join(' ');
};

const Urn = ({
  x,
  y,
  terrace,
  garden,
}: {
  x: number;
  y: number;
  terrace: Terrace;
  garden: Garden;
}) => (
  <g>
    <path
      d={`M ${fixed(x - 26)} ${fixed(y - 46)} C ${fixed(x - 30)} ${fixed(y - 10)} ${fixed(x - 14)} ${fixed(y - 4)} ${fixed(x - 12)} ${fixed(y)} L ${fixed(x + 12)} ${fixed(y)} C ${fixed(x + 14)} ${fixed(y - 4)} ${fixed(x + 30)} ${fixed(y - 10)} ${fixed(x + 26)} ${fixed(y - 46)} Z`}
      fill={terrace.stone}
      stroke={terrace.shade}
      strokeWidth={2}
    />
    {[-18, -6, 6, 18, -12, 12, 0].map((dx, index) => (
      <g key={`${dx}:${index}`}>
        <ellipse
          cx={fixed(x + dx * 1.3)}
          cy={fixed(y - 50 - index * 4)}
          rx={12}
          ry={6}
          fill={garden.leafDark}
        />
        <circle
          cx={fixed(x + dx)}
          cy={fixed(y - 58 - index * 5)}
          r={8}
          fill={index % 2 === 0 ? garden.rose : garden.blossom}
        />
      </g>
    ))}
  </g>
);

export const Balustrade = ({
  ground,
  terrace,
  garden,
  ids,
}: {
  ground: number;
  terrace: Terrace;
  garden: Garden;
  ids: TerraceIds;
}) => {
  const height = terrace.railHeight;
  const railTop = ground - height;
  const railBottom = railTop + height * 0.15;
  const plinthTop = ground - height * 0.15;
  const posts: number[] = [];
  for (let x = CENTER_X - BAY / 2 - BAY * 3; x <= RIGHT; x += BAY) {
    if (x >= LEFT) {
      posts.push(x);
    }
  }
  const balusters: number[] = [];
  for (let x = LEFT; x <= RIGHT; x += BALUSTER_PITCH) {
    if (posts.every((post) => Math.abs(post - x) > 52)) {
      balusters.push(x);
    }
  }
  const bushes = Array.from({ length: 20 }, (_, index) => CENTER_X - 2090 + index * 220);
  return (
    <g>
      <rect
        x={LEFT}
        y={fixed(plinthTop)}
        width={RIGHT - LEFT}
        height={fixed(height * 0.15)}
        fill={`url(#${ids.stone})`}
      />
      {balusters.map((x) => (
        <path key={x} d={balusterPath(x, railBottom, plinthTop)} fill={`url(#${ids.baluster})`} />
      ))}
      <rect
        x={LEFT}
        y={fixed(railTop)}
        width={RIGHT - LEFT}
        height={fixed(height * 0.15)}
        fill={`url(#${ids.stone})`}
      />
      <rect
        x={LEFT}
        y={fixed(railTop - 8)}
        width={RIGHT - LEFT}
        height={10}
        fill={terrace.stone}
        stroke={terrace.shade}
        strokeWidth={1.5}
      />
      {posts.map((x) => (
        <g key={x}>
          <rect
            x={fixed(x - 34)}
            y={fixed(railTop - 24)}
            width={68}
            height={fixed(height + 24)}
            fill={`url(#${ids.baluster})`}
          />
          <rect
            x={fixed(x - 42)}
            y={fixed(railTop - 34)}
            width={84}
            height={14}
            fill={terrace.stone}
            stroke={terrace.shade}
            strokeWidth={1.5}
          />
          <rect
            x={fixed(x - 22)}
            y={fixed(railTop + height * 0.25)}
            width={44}
            height={fixed(height * 0.45)}
            fill="none"
            stroke={terrace.shade}
            strokeWidth={2}
          />
          <Urn x={x} y={railTop - 34} terrace={terrace} garden={garden} />
        </g>
      ))}
      {bushes.map((x, index) =>
        index % 3 === 2 ? (
          <FloweringStalk
            key={x}
            x={x}
            base={ground + 6}
            height={height * 0.8}
            garden={garden}
            seed={x}
            flower={garden.rose}
          />
        ) : (
          <RoseBush
            key={x}
            x={x + (seeded(index, 3) - 0.5) * 40}
            base={ground + 6}
            height={height * (0.72 + seeded(index, 5) * 0.25)}
            garden={garden}
            seed={x}
          />
        ),
      )}
    </g>
  );
};
