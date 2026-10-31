import type { ArchSaveTheDateProps } from '@/schemas';
import { CAPITAL_SHARE } from './arch-geometry';
import { fixed } from './camera';

type Wall = ArchSaveTheDateProps['wall'];

export interface ColumnIds {
  round: string;
  reflection: string;
}

export const ColumnDefs = ({
  ids,
  wall,
  reflections,
}: {
  ids: ColumnIds;
  wall: Wall;
  reflections: number;
}) => (
  <>
    <linearGradient id={ids.round} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor={wall.shade} />
      <stop offset="0.18" stopColor={wall.light} />
      <stop offset="0.42" stopColor={wall.relief} />
      <stop offset="0.7" stopColor={wall.light} />
      <stop offset="0.9" stopColor={wall.color} />
      <stop offset="1" stopColor={wall.shade} />
    </linearGradient>
    <linearGradient id={ids.reflection} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={wall.color} stopOpacity={reflections} />
      <stop offset="0.45" stopColor={wall.light} stopOpacity={reflections * 0.35} />
      <stop offset="1" stopColor={wall.light} stopOpacity={0} />
    </linearGradient>
  </>
);

const Leaf = ({ x, y, size, wall }: { x: number; y: number; size: number; wall: Wall }) => {
  const tip = `M ${fixed(x)} ${fixed(y)} C ${fixed(x - size * 0.55)} ${fixed(y - size * 0.4)} ${fixed(x - size * 0.4)} ${fixed(y - size * 1.05)} ${fixed(x)} ${fixed(y - size * 1.2)} C ${fixed(x + size * 0.4)} ${fixed(y - size * 1.05)} ${fixed(x + size * 0.55)} ${fixed(y - size * 0.4)} ${fixed(x)} ${fixed(y)} Z`;
  return (
    <g>
      <path d={tip} fill={wall.light} stroke={wall.shade} strokeWidth={1.4} />
      <path
        d={`M ${fixed(x)} ${fixed(y - size * 0.1)} V ${fixed(y - size * 1.05)}`}
        stroke={wall.relief}
        strokeWidth={1.6}
      />
    </g>
  );
};

export const Column = ({
  x,
  width,
  top,
  floorY,
  wall,
  ids,
  detailed,
}: {
  x: number;
  width: number;
  top: number;
  floorY: number;
  wall: Wall;
  ids: ColumnIds;
  detailed: boolean;
}) => {
  const height = floorY - top;
  const cx = x + width / 2;
  const pedestalTop = floorY - height * 0.17;
  const capitalBottom = top + height * CAPITAL_SHARE;
  const shaftBottom = width * 0.33;
  const shaftTop = width * 0.28;
  const shaft = `M ${fixed(cx - shaftBottom)} ${fixed(pedestalTop)} L ${fixed(cx - shaftTop)} ${fixed(capitalBottom)} L ${fixed(cx + shaftTop)} ${fixed(capitalBottom)} L ${fixed(cx + shaftBottom)} ${fixed(pedestalTop)} Z`;
  const bell = `M ${fixed(cx - shaftTop)} ${fixed(capitalBottom)} C ${fixed(cx - shaftTop)} ${fixed(top + height * 0.07)} ${fixed(x - width * 0.02)} ${fixed(top + height * 0.06)} ${fixed(x - width * 0.04)} ${fixed(top + height * 0.025)} L ${fixed(x + width * 1.04)} ${fixed(top + height * 0.025)} C ${fixed(x + width * 1.02)} ${fixed(top + height * 0.06)} ${fixed(cx + shaftTop)} ${fixed(top + height * 0.07)} ${fixed(cx + shaftTop)} ${fixed(capitalBottom)} Z`;
  const flutes = [-0.6, -0.3, 0, 0.3, 0.6];
  const leafCount = 5;
  return (
    <g>
      <rect
        x={fixed(x)}
        y={fixed(floorY)}
        width={fixed(width)}
        height={fixed(height * 0.4)}
        fill={`url(#${ids.reflection})`}
      />
      <rect
        x={fixed(x - width * 0.06)}
        y={fixed(floorY - height * 0.04)}
        width={fixed(width * 1.12)}
        height={fixed(height * 0.04)}
        fill={`url(#${ids.round})`}
      />
      <rect
        x={fixed(x)}
        y={fixed(pedestalTop)}
        width={fixed(width)}
        height={fixed(floorY - pedestalTop - height * 0.04)}
        fill={`url(#${ids.round})`}
      />
      <rect
        x={fixed(x - width * 0.04)}
        y={fixed(pedestalTop - height * 0.018)}
        width={fixed(width * 1.08)}
        height={fixed(height * 0.022)}
        fill={wall.light}
        stroke={wall.shade}
        strokeWidth={1.2}
      />
      <path d={shaft} fill={`url(#${ids.round})`} />
      {detailed
        ? flutes.map((share) => (
            <path
              key={share}
              d={`M ${fixed(cx + share * shaftBottom * 0.9)} ${fixed(pedestalTop - height * 0.03)} L ${fixed(cx + share * shaftTop * 0.9)} ${fixed(capitalBottom + height * 0.03)}`}
              stroke={share < 0 ? wall.relief : wall.shade}
              strokeOpacity={0.55}
              strokeWidth={2}
            />
          ))
        : null}
      {[pedestalTop - height * 0.05, capitalBottom + height * 0.012].map((y) => (
        <rect
          key={y}
          x={fixed(cx - shaftBottom * 1.04)}
          y={fixed(y)}
          width={fixed(shaftBottom * 2.08)}
          height={fixed(height * 0.014)}
          rx={fixed(height * 0.007)}
          fill={wall.light}
          stroke={wall.shade}
          strokeWidth={1}
        />
      ))}
      <path d={bell} fill={`url(#${ids.round})`} stroke={wall.shade} strokeWidth={1.2} />
      {detailed
        ? Array.from({ length: leafCount }, (_, index) => (
            <Leaf
              key={index}
              x={x + (width * (index + 0.5)) / leafCount}
              y={capitalBottom - height * 0.004}
              size={height * 0.07}
              wall={wall}
            />
          ))
        : null}
      <rect
        x={fixed(x - width * 0.07)}
        y={fixed(top)}
        width={fixed(width * 1.14)}
        height={fixed(height * 0.028)}
        fill={wall.light}
        stroke={wall.shade}
        strokeWidth={1.4}
      />
      {detailed ? (
        <g>
          <rect
            x={fixed(x + width * 0.18)}
            y={fixed(pedestalTop + height * 0.025)}
            width={fixed(width * 0.64)}
            height={fixed(height * 0.075)}
            fill="none"
            stroke={wall.shade}
            strokeOpacity={0.7}
            strokeWidth={1.6}
          />
          <circle
            cx={fixed(cx)}
            cy={fixed(pedestalTop + height * 0.0625)}
            r={fixed(width * 0.12)}
            fill={wall.relief}
            stroke={wall.shade}
            strokeWidth={1.2}
          />
        </g>
      ) : null}
    </g>
  );
};
