import { useMemo } from 'react';
import { type Gold, useSvgId } from './gold';
import { damaskTile } from './ornament';
import { OrnamentArt } from './ornament-art';

export const DamaskFill = ({
  gold,
  size,
  x = 0,
  y = 0,
  width = 1920,
  height = 1080,
  strength,
  offset = 0,
}: {
  gold: Gold;
  size: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  strength: number;
  offset?: number;
}) => {
  const patternId = useSvgId('damask');
  const metalId = useSvgId('damask-metal');
  const layers = useMemo(() => damaskTile(size), [size]);
  return (
    <>
      <defs>
        <linearGradient
          id={metalId}
          gradientUnits="userSpaceOnUse"
          x1={0}
          y1={0}
          x2={size * 0.4}
          y2={size}
        >
          <stop offset="0" stopColor={gold.highlight} />
          <stop offset="0.3" stopColor={gold.light} />
          <stop offset="0.55" stopColor={gold.mid} />
          <stop offset="0.75" stopColor={gold.light} />
          <stop offset="1" stopColor={gold.deep} />
        </linearGradient>
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width={size}
          height={size}
          x={offset}
          y={offset * 0.5}
        >
          <g transform="translate(1.4 2)" opacity={0.85}>
            <OrnamentArt layers={layers} color={gold.deep} />
          </g>
          <OrnamentArt layers={layers} color={`url(#${metalId})`} />
        </pattern>
      </defs>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={`url(#${patternId})`}
        opacity={strength}
      />
    </>
  );
};
