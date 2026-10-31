import { memo } from 'react';
import type { Ids } from './defs';
import { darken, lighten, type Paint } from './palette';
import { circle, fx, leaf, rosette, seeded } from './shapes';

type Trees = Paint['trees'];

type Mound = {
  x: number;
  y: number;
  r: number;
  tone: 'foliage' | 'foliage-light' | 'foliage-deep';
};

const TONES = ['foliage-deep', 'foliage', 'foliage-light'] as const;

const moundsFor = (seed: number, from: number, to: number, base: number, size: number): Mound[] => {
  const random = seeded(seed);
  const mounds: Mound[] = [];
  for (let x = from; x < to; x += size * (0.75 + random() * 0.5)) {
    const r = size * (0.7 + random() * 0.6);
    mounds.push({
      x,
      y: base - r * (0.35 + random() * 0.4),
      r,
      tone: TONES[Math.floor(random() * 3)] ?? 'foliage',
    });
  }
  return mounds;
};

const MoundRim = ({ mound, ids }: { mound: Mound; ids: Ids }) => {
  const count = Math.max(6, Math.round((Math.PI * mound.r) / 11));
  return (
    <>
      {Array.from({ length: count + 1 }, (_, index) => {
        const angle = Math.PI + (index / count) * Math.PI;
        return (
          <use
            key={angle}
            href={ids.href(mound.tone === 'foliage-light' ? 'rim-light' : 'rim')}
            transform={`translate(${fx(mound.x + Math.cos(angle) * (mound.r - 4))} ${fx(mound.y + Math.sin(angle) * (mound.r - 4))}) rotate(${fx((angle * 180) / Math.PI + 90)})`}
          />
        );
      })}
    </>
  );
};

export const Bushes = memo(
  ({
    from,
    to,
    base,
    size,
    seed,
    trees,
    ids,
    berries,
  }: {
    from: number;
    to: number;
    base: number;
    size: number;
    seed: number;
    trees: Trees;
    ids: Ids;
    berries: string;
  }) => {
    const mounds = moundsFor(seed, from, to, base, size);
    const random = seeded(seed + 5);
    const dots = mounds
      .flatMap((mound) =>
        Array.from({ length: 3 }, () =>
          circle(
            mound.x + (random() - 0.5) * mound.r,
            mound.y + (random() - 0.3) * mound.r * 0.6,
            2.6,
          ),
        ),
      )
      .join('');
    return (
      <g>
        <rect
          x={from - size}
          y={base - 4}
          width={to - from + size * 2}
          height={1200}
          fill={darken(trees.dark, 0.25)}
        />
        {mounds.map((mound) => (
          <g key={`${mound.x}-${mound.r}`}>
            <MoundRim mound={mound} ids={ids} />
            <circle
              cx={mound.x}
              cy={mound.y}
              r={mound.r}
              fill={ids.url(mound.tone)}
              stroke={darken(trees.dark, 0.35)}
              strokeWidth={1.2}
            />
            <circle cx={mound.x} cy={mound.y} r={mound.r} fill={ids.url('volume')} />
          </g>
        ))}
        <path d={dots} fill={berries} />
      </g>
    );
  },
);

const lilyFlower = (x: number, y: number, angle: number) =>
  [-0.5, 0, 0.5].map((turn) => leaf(x, y, angle + turn, 16, 5.5)).join('');

export const Lily = memo(
  ({
    x,
    y,
    height,
    trees,
    color,
    flip = false,
  }: {
    x: number;
    y: number;
    height: number;
    trees: Trees;
    color: string;
    flip?: boolean;
  }) => {
    const stems = [-0.25, 0.05, 0.3];
    const blades = [-0.55, -0.3, 0.2, 0.45]
      .map((turn, index) => leaf(0, 0, -Math.PI / 2 + turn, height * (0.55 + (index % 2) * 0.2), 7))
      .join('');
    const heads = stems.map((turn, index) => {
      const h = height * (0.75 + index * 0.12);
      return {
        stem: `M0 0Q${fx(turn * h * 0.4)} ${fx(-h * 0.5)} ${fx(turn * h)} ${fx(-h)}`,
        flower: lilyFlower(turn * h, -h, -Math.PI / 2 + turn * 1.6),
      };
    });
    return (
      <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
        <path d={blades} fill={trees.mid} stroke={darken(trees.dark, 0.3)} strokeWidth={0.8} />
        <path
          d={heads.map((head) => head.stem).join('')}
          fill="none"
          stroke={darken(trees.mid, 0.1)}
          strokeWidth={2.2}
        />
        <path
          d={heads.map((head) => head.flower).join('')}
          fill={color}
          stroke={darken(color, 0.35)}
          strokeWidth={0.9}
        />
      </g>
    );
  },
);

export const Fern = memo(
  ({
    x,
    y,
    height,
    trees,
    flip = false,
  }: {
    x: number;
    y: number;
    height: number;
    trees: Trees;
    flip?: boolean;
  }) => {
    const fronds = [-0.5, -0.15, 0.2, 0.55].map((turn) => {
      const leaflets = Array.from({ length: 10 }, (_, index) => {
        const t = 0.15 + index * 0.085;
        const size = 14 * (1 - t * 0.7);
        return (
          leaf(0, -height * t, -Math.PI / 2 - 1.1, size, 3) +
          leaf(0, -height * t, -Math.PI / 2 + 1.1, size, 3)
        );
      }).join('');
      return { turn, leaflets };
    });
    return (
      <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
        {fronds.map((frond) => (
          <g key={frond.turn} transform={`rotate(${fx(frond.turn * 40)})`}>
            <path d={`M0 0L0 ${fx(-height)}`} stroke={darken(trees.mid, 0.2)} strokeWidth={1.6} />
            <path
              d={frond.leaflets}
              fill={lighten(trees.mid, 0.1)}
              stroke={darken(trees.mid, 0.3)}
              strokeWidth={0.6}
            />
          </g>
        ))}
      </g>
    );
  },
);

export const BigLeaves = memo(
  ({
    x,
    y,
    size,
    trees,
    flip = false,
  }: {
    x: number;
    y: number;
    size: number;
    trees: Trees;
    flip?: boolean;
  }) => {
    const turns = [-0.95, -0.5, -0.1, 0.35, 0.8];
    return (
      <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
        {turns.map((turn, index) => {
          const length = size * (0.75 + (index % 2) * 0.3);
          const angle = -Math.PI / 2 + turn;
          return (
            <g key={turn}>
              <path
                d={leaf(0, 0, angle, length, length * 0.22)}
                fill={trees.mid}
                stroke={darken(trees.dark, 0.35)}
                strokeWidth={1.2}
              />
              <path
                d={leaf(0, 0, angle, length * 0.92, length * 0.09)}
                fill={lighten(trees.light, 0.2)}
                opacity={0.85}
              />
              <path
                d={`M0 0L${fx(Math.cos(angle) * length)} ${fx(Math.sin(angle) * length)}`}
                stroke={darken(trees.mid, 0.2)}
                strokeWidth={1.2}
              />
            </g>
          );
        })}
      </g>
    );
  },
);

export const FlowerShrub = memo(
  ({
    x,
    y,
    height,
    trees,
    color,
  }: {
    x: number;
    y: number;
    height: number;
    trees: Trees;
    color: string;
  }) => {
    const random = seeded(Math.round(x * 7 + y));
    const stems: string[] = [];
    const leaves: string[] = [];
    const flowers: string[] = [];
    for (let index = 0; index < 7; index += 1) {
      const tipX = (random() - 0.5) * height * 0.8;
      const tipY = -height * (0.6 + random() * 0.4);
      stems.push(`M0 0Q${fx(tipX * 0.3)} ${fx(tipY * 0.5)} ${fx(tipX)} ${fx(tipY)}`);
      leaves.push(leaf(tipX * 0.5, tipY * 0.5, -Math.PI / 2 + (tipX > 0 ? 0.9 : -0.9), 18, 5));
      flowers.push(rosette(tipX, tipY, 7, 5, random()));
    }
    return (
      <g transform={`translate(${x} ${y})`}>
        <path d={stems.join('')} fill="none" stroke={darken(trees.mid, 0.25)} strokeWidth={1.5} />
        <path
          d={leaves.join('')}
          fill={trees.mid}
          stroke={darken(trees.dark, 0.3)}
          strokeWidth={0.6}
        />
        <path d={flowers.join('')} fill={color} stroke={darken(color, 0.3)} strokeWidth={0.6} />
      </g>
    );
  },
);
