import { useMemo } from 'react';
import { seeded } from '../unveil/random';

const GRID = 25;

const FINDERS: readonly [number, number][] = [
  [0, 0],
  [GRID - 7, 0],
  [0, GRID - 7],
];

const inFinder = (x: number, y: number): boolean =>
  FINDERS.some(([fx, fy]) => x >= fx - 1 && x <= fx + 7 && y >= fy - 1 && y <= fy + 7);

const modulesFor = (seed: number): [number, number][] => {
  const random = seeded(seed * 977 + 5);
  const cells: [number, number][] = [];
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      if (!inFinder(x, y) && random() < 0.48) {
        cells.push([x, y]);
      }
    }
  }
  return cells;
};

export const CodeTile = ({
  size,
  seed,
  frameFrom,
  frameTo,
  ink,
}: {
  size: number;
  seed: number;
  frameFrom: string;
  frameTo: string;
  ink: string;
}) => {
  const cells = useMemo(() => modulesFor(seed), [seed]);
  const border = size * 0.06;
  const inner = size - border * 2;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.1,
        padding: border,
        background: `linear-gradient(140deg, ${frameFrom}, ${frameTo})`,
        boxShadow: '0 10px 30px rgba(90, 40, 140, 0.18)',
      }}
    >
      <div
        style={{
          width: inner,
          height: inner,
          borderRadius: size * 0.05,
          background: '#ffffff',
          padding: inner * 0.08,
        }}
      >
        <svg
          viewBox={`0 0 ${GRID} ${GRID}`}
          width="100%"
          height="100%"
          shapeRendering="crispEdges"
          aria-hidden="true"
        >
          {FINDERS.map(([x, y]) => (
            <g key={`${x}:${y}`} fill={ink}>
              <path d={`M${x} ${y}h7v7h-7z M${x + 1} ${y + 1}v5h5v-5z`} fillRule="evenodd" />
              <rect x={x + 2} y={y + 2} width={3} height={3} />
            </g>
          ))}
          {cells.map(([x, y]) => (
            <rect key={`${x}:${y}`} x={x} y={y} width={1} height={1} fill={ink} />
          ))}
        </svg>
      </div>
    </div>
  );
};
