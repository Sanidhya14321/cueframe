import type { ArchSaveTheDateProps } from '@/schemas';
import { CENTER_X, FRAME_HEIGHT, fixed, NEAREST_DEPTH, type View } from './camera';

type Terrace = ArchSaveTheDateProps['terrace'];

const TILE_DEPTH = 0.07;

const TILE_WIDTH = 150;

const LANES = 16;

export const MarbleFloor = ({
  view,
  farDepth,
  floorY,
  terrace,
  gradientId,
}: {
  view: View;
  farDepth: number;
  floorY: number;
  terrace: Terrace;
  gradientId: string;
}) => {
  const drop = floorY - view.eyeLevel;
  if (drop <= 0) {
    return null;
  }
  const screenY = (depth: number) => view.eyeLevel + drop / depth;
  const top = screenY(farDepth);
  if (top >= FRAME_HEIGHT) {
    return null;
  }
  const bottomDepth = drop / (FRAME_HEIGHT - view.eyeLevel);
  const seams: number[] = [];
  for (
    let depth = farDepth - TILE_DEPTH;
    depth > Math.max(NEAREST_DEPTH, bottomDepth);
    depth -= TILE_DEPTH
  ) {
    seams.push(depth);
  }
  return (
    <g>
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={fixed(top)}
          x2="0"
          y2={FRAME_HEIGHT}
        >
          <stop offset="0" stopColor={terrace.vein} />
          <stop offset="0.25" stopColor={terrace.marble} />
          <stop offset="1" stopColor={terrace.marble} />
        </linearGradient>
      </defs>
      <rect
        x={-200}
        y={fixed(top - 2)}
        width={1480}
        height={fixed(FRAME_HEIGHT - top + 4)}
        fill={`url(#${gradientId})`}
      />
      {seams.map((depth) => (
        <line
          key={depth}
          x1={-200}
          x2={1280}
          y1={fixed(screenY(depth))}
          y2={fixed(screenY(depth))}
          stroke={terrace.vein}
          strokeWidth={fixed(Math.min(3, 1 + 0.25 / depth))}
          opacity={0.8}
        />
      ))}
      {Array.from({ length: LANES * 2 + 1 }, (_, index) => {
        const offset = (index - LANES) * TILE_WIDTH;
        return (
          <line
            key={offset}
            x1={fixed(CENTER_X + offset / farDepth)}
            y1={fixed(top)}
            x2={fixed(CENTER_X + offset / bottomDepth)}
            y2={FRAME_HEIGHT}
            stroke={terrace.vein}
            strokeWidth={1.4}
            opacity={0.7}
          />
        );
      })}
    </g>
  );
};
