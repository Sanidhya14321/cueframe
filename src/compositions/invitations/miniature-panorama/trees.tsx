import { memo } from 'react';
import type { Ids } from './defs';
import { darken, lighten, type Paint } from './palette';
import { fx, seeded } from './shapes';

type Trees = Paint['trees'];

type Spray = { x: number; y: number; angle: number; scale: number };

const sprigLayout = (seed: number, height: number, spread: number) => {
  const random = seeded(seed);
  const branches: string[] = [];
  const sprays: Spray[] = [];
  const levels = 8;
  for (let level = 0; level < levels; level += 1) {
    const t = 0.3 + (level / (levels - 1)) * 0.62;
    const side = level % 2 === 0 ? -1 : 1;
    const startY = -height * t;
    const reach = (70 + random() * 60) * spread * (1.1 - t * 0.5);
    const endX = side * reach;
    const endY = startY - reach * (0.5 + random() * 0.4);
    branches.push(`M0 ${fx(startY)}Q${fx(endX * 0.5)} ${fx(startY - 6)} ${fx(endX)} ${fx(endY)}`);
    for (let index = 0; index < 5; index += 1) {
      const along = 0.25 + index * 0.19;
      sprays.push({
        x: endX * along,
        y: startY + (endY - startY) * along - 4,
        angle: side * (20 + index * 13 + random() * 12),
        scale: 0.7 + random() * 0.35,
      });
    }
  }
  for (let t = 0.34; t < 0.94; t += 0.055) {
    const side = Math.round(t * 100) % 2 === 0 ? -1 : 1;
    sprays.push({
      x: side * 3,
      y: -height * t,
      angle: side * (22 + random() * 26),
      scale: 0.62 + random() * 0.3,
    });
  }
  for (let index = 0; index < 9; index += 1) {
    sprays.push({
      x: (index - 4) * 5,
      y: -height * 0.96,
      angle: (index - 4) * 13,
      scale: 0.85 + random() * 0.2,
    });
  }
  return { branches: branches.join(''), sprays };
};

export const SprigTree = memo(
  ({
    x,
    y,
    height,
    spread,
    seed,
    trees,
    ids,
  }: {
    x: number;
    y: number;
    height: number;
    spread: number;
    seed: number;
    trees: Trees;
    ids: Ids;
  }) => {
    const layout = sprigLayout(seed, height, spread);
    const trunk = `M-9 0Q-5 ${fx(-height * 0.5)} -2 ${fx(-height * 0.97)}L2 ${fx(-height * 0.97)}Q5 ${fx(-height * 0.5)} 9 0Z`;
    return (
      <g transform={`translate(${x} ${y})`}>
        <path
          d={layout.branches}
          fill="none"
          stroke={trees.trunk}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <path d={trunk} fill={trees.trunk} />
        <path d={trunk} fill={ids.url('side')} />
        {layout.sprays.map((spray) => (
          <use
            key={`${spray.x}-${spray.y}`}
            href={ids.href('spray')}
            transform={`translate(${fx(spray.x)} ${fx(spray.y)}) rotate(${fx(spray.angle)}) scale(${fx(spray.scale)})`}
          />
        ))}
      </g>
    );
  },
);

export type Crown = { x: number; y: number; r: number };

const Rim = ({ crown, ids }: { crown: Crown; ids: Ids }) => {
  const count = Math.max(12, Math.round((Math.PI * 2 * crown.r) / 10));
  return (
    <>
      {Array.from({ length: count }, (_, index) => {
        const angle = (index / count) * Math.PI * 2;
        const x = crown.x + Math.cos(angle) * (crown.r - 4);
        const y = crown.y + Math.sin(angle) * (crown.r - 4);
        const light = angle > Math.PI * 1.05 && angle < Math.PI * 1.75;
        return (
          <use
            key={angle}
            href={ids.href(light ? 'rim-light' : 'rim')}
            transform={`translate(${fx(x)} ${fx(y)}) rotate(${fx((angle * 180) / Math.PI + 90)})`}
          />
        );
      })}
    </>
  );
};

export const RosetteTree = memo(
  ({
    x,
    y,
    crowns,
    trees,
    ids,
  }: {
    x: number;
    y: number;
    crowns: readonly Crown[];
    trees: Trees;
    ids: Ids;
  }) => {
    const lowest = crowns.reduce(
      (low, crown) => Math.max(low, crown.y + crown.r),
      Number.NEGATIVE_INFINITY,
    );
    return (
      <g transform={`translate(${x} ${y})`}>
        <path
          d={`M-9 0Q-5 ${fx(lowest * 0.5)} -5 ${fx(lowest - 20)}L5 ${fx(lowest - 20)}Q5 ${fx(lowest * 0.5)} 9 0Z`}
          fill={trees.trunk}
        />
        <path
          d={`M-9 0Q-5 ${fx(lowest * 0.5)} -5 ${fx(lowest - 20)}L5 ${fx(lowest - 20)}Q5 ${fx(lowest * 0.5)} 9 0Z`}
          fill={ids.url('side')}
        />
        {crowns.map((crown) => (
          <g key={`${crown.x}-${crown.y}`}>
            <Rim crown={crown} ids={ids} />
            <circle
              cx={crown.x}
              cy={crown.y}
              r={crown.r}
              fill={ids.url('foliage')}
              stroke={darken(trees.dark, 0.35)}
              strokeWidth={1.5}
            />
            <circle cx={crown.x} cy={crown.y} r={crown.r} fill={ids.url('volume')} />
          </g>
        ))}
      </g>
    );
  },
);

const bananaLeaf = (
  length: number,
  width: number,
): { body: string; upper: string; veins: string } => {
  const body = `M0 0C${fx(length * 0.3)} ${fx(-width)} ${fx(length * 0.72)} ${fx(-width)} ${fx(length)} 0C${fx(length * 0.72)} ${fx(width * 0.9)} ${fx(length * 0.3)} ${fx(width * 0.9)} 0 0Z`;
  const upper = `M0 0C${fx(length * 0.3)} ${fx(-width)} ${fx(length * 0.72)} ${fx(-width)} ${fx(length)} 0Z`;
  const veins = Array.from({ length: 9 }, (_, index) => {
    const t = 0.12 + index * 0.09;
    const reach = width * 0.72 * Math.sin(Math.PI * t);
    return `M${fx(length * t)} 0L${fx(length * (t + 0.07))} ${fx(-reach)}M${fx(length * t)} 0L${fx(length * (t + 0.07))} ${fx(reach * 0.9)}`;
  }).join('');
  return { body, upper, veins };
};

export const Banana = ({
  x,
  y,
  height,
  leaves,
  sway,
  trees,
  flip = false,
}: {
  x: number;
  y: number;
  height: number;
  leaves: number;
  sway: number;
  trees: Trees;
  flip?: boolean;
}) => {
  const shape = bananaLeaf(height * 0.62, height * 0.13);
  const top = -height * 0.55;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <path d={`M-10 0L-6 ${fx(top)}L6 ${fx(top)}L10 0Z`} fill={darken(trees.sprig, 0.05)} />
      <path
        d={`M-3 0L-2 ${fx(top)}M4 0L3 ${fx(top)}`}
        stroke={lighten(trees.sprig, 0.3)}
        strokeWidth={2}
      />
      {Array.from({ length: leaves }, (_, index) => {
        const t = leaves === 1 ? 0.5 : index / (leaves - 1);
        const angle = -165 + t * 150 + Math.sin(sway + index) * 2.5;
        return (
          <g key={`${index}-${leaves}`} transform={`translate(0 ${fx(top)}) rotate(${fx(angle)})`}>
            <path
              d={shape.body}
              fill={trees.mid}
              stroke={darken(trees.dark, 0.25)}
              strokeWidth={1.2}
            />
            <path d={shape.upper} fill={lighten(trees.mid, 0.18)} />
            <path d={shape.veins} stroke={darken(trees.mid, 0.2)} strokeWidth={1} />
            <path
              d={`M0 0L${fx(height * 0.62)} 0`}
              stroke={lighten(trees.light, 0.25)}
              strokeWidth={2.2}
            />
          </g>
        );
      })}
    </g>
  );
};
