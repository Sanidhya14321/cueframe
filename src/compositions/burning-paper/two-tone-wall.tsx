import { useId } from 'react';
import type { BurningPaperRevealProps } from '@/schemas';
import type { BurnCues } from './burn-cues';
import { mixHex, svgId } from './color';

const LEFT_SLOPE = 0.8;
const RIGHT_SLOPE = 0.74;
const SIDE_SLOPE = 0.95;
const BLEED = 160;

const WALL_STOPS: [number, number][] = [
  [0, 0],
  [0.62, 0],
  [0.7, 0.18],
  [0.79, 0.45],
  [0.88, 0.7],
  [0.94, 0.86],
  [1, 0.72],
];

export const TwoToneWall = ({
  backdrop,
  cues,
}: {
  backdrop: BurningPaperRevealProps['backdrop'];
  cues: BurnCues;
}) => {
  const id = svgId(useId());
  const apexX = backdrop.apexX + cues.shake.x * 0.4;
  const apexY = backdrop.apexY + cues.drift + cues.shake.y * 0.4;
  const left = -BLEED;
  const right = 1080 + BLEED;
  const upperLeft = apexY - LEFT_SLOPE * (apexX - left);
  const upperRight = apexY - RIGHT_SLOPE * (right - apexX);
  const sideBottom = apexY + SIDE_SLOPE * (apexX - left);
  return (
    <g transform={`rotate(${cues.roll.toFixed(4)} ${apexX.toFixed(2)} ${apexY.toFixed(2)})`}>
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
          {WALL_STOPS.map(([offset, amount]) => (
            <stop
              key={offset}
              offset={offset}
              stopColor={mixHex(backdrop.wall, backdrop.wallDeep, amount)}
            />
          ))}
        </linearGradient>
        <linearGradient id={`${id}-side`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={mixHex(backdrop.side, '#ffffff', 0.12)} />
          <stop offset="0.7" stopColor={backdrop.side} />
          <stop offset="1" stopColor={mixHex(backdrop.side, backdrop.wall, 0.25)} />
        </linearGradient>
        <radialGradient id={`${id}-upper`} cx="0.62" cy="0.62" r="0.85">
          <stop offset="0" stopColor={mixHex(backdrop.upper, '#ffffff', 0.12)} />
          <stop offset="0.45" stopColor={backdrop.upper} />
          <stop offset="1" stopColor={backdrop.upperEdge} />
        </radialGradient>
        <linearGradient id={`${id}-deep`} x1="1" y1="0.55" x2="0" y2="1">
          <stop offset="0" stopColor={backdrop.wallDeep} stopOpacity="0" />
          <stop offset="0.6" stopColor={backdrop.wallDeep} stopOpacity="0.25" />
          <stop offset="1" stopColor={backdrop.wallDeep} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <rect
        x={left}
        y={-BLEED}
        width={1080 + BLEED * 2}
        height={1920 + BLEED * 2}
        fill={`url(#${id}-wall)`}
      />
      <rect
        x={left}
        y={-BLEED}
        width={1080 + BLEED * 2}
        height={1920 + BLEED * 2}
        fill={`url(#${id}-deep)`}
      />
      <polygon
        points={`${left},${upperLeft} ${apexX},${apexY} ${left},${sideBottom}`}
        fill={`url(#${id}-side)`}
      />
      <polygon
        points={`${left},${-BLEED} ${right},${-BLEED} ${right},${upperRight} ${apexX},${apexY} ${left},${upperLeft}`}
        fill={`url(#${id}-upper)`}
      />
    </g>
  );
};
