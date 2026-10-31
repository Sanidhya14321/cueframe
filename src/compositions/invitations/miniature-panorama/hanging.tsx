import { memo } from 'react';
import type { Ids } from './defs';
import { darken, lighten, type Paint } from './palette';
import { circle, fx, leaf, seeded } from './shapes';

type Chandeliers = Paint['chandeliers'];

const tier = (y: number, width: number, arms: number, lift: number) =>
  Array.from({ length: arms }, (_, index) => {
    const angle = (index / arms) * Math.PI * 2 + 0.3;
    const x = Math.cos(angle) * width;
    const depth = Math.sin(angle);
    return {
      x,
      y: y + depth * width * 0.12,
      cupY: y - lift + depth * width * 0.12,
      back: depth < 0,
    };
  }).sort((a, b) => a.cupY - b.cupY);

const ChandelierBody = memo(
  ({
    size,
    metal,
    crystal,
    flame,
    ids,
  }: {
    size: number;
    metal: string;
    crystal: string;
    flame: string;
    ids: Ids;
  }) => {
    const tiers = [
      tier(size * 0.3, size * 0.2, 6, size * 0.1),
      tier(size * 0.52, size * 0.36, 8, size * 0.11),
      tier(size * 0.74, size * 0.52, 10, size * 0.12),
    ];
    const shade = darken(metal, 0.35);
    const glint = lighten(metal, 0.5);
    return (
      <g>
        <path
          d={`M-14 0L14 0L8 ${size * 0.08}L-8 ${size * 0.08}Z`}
          fill={metal}
          stroke={shade}
          strokeWidth={1}
        />
        <path d={`M0 ${size * 0.08}L0 ${size * 0.95}`} stroke={metal} strokeWidth={size * 0.022} />
        <path
          d={[0.2, 0.32, 0.55, 0.8, 0.92]
            .map((t) => circle(0, size * t, 5 + (t > 0.5 ? 4 : 2)))
            .join('')}
          fill={metal}
          stroke={shade}
          strokeWidth={1}
        />
        {tiers.map((arms, tierIndex) =>
          arms.map((arm) => {
            const color = arm.back ? darken(metal, 0.25) : metal;
            const stemY = size * (0.33 + tierIndex * 0.22);
            return (
              <g key={`${tierIndex}-${arm.x}`} opacity={arm.back ? 0.85 : 1}>
                <path
                  d={`M0 ${fx(stemY)}Q${fx(arm.x * 0.6)} ${fx(arm.y + size * 0.1)} ${fx(arm.x)} ${fx(arm.cupY + 8)}`}
                  fill="none"
                  stroke={color}
                  strokeWidth={Math.max(2.6, size * 0.011)}
                />
                <path
                  d={`M${fx(arm.x - 7)} ${fx(arm.cupY + 6)}L${fx(arm.x + 7)} ${fx(arm.cupY + 6)}L${fx(arm.x + 3)} ${fx(arm.cupY + 12)}L${fx(arm.x - 3)} ${fx(arm.cupY + 12)}Z`}
                  fill={color}
                />
                <rect
                  x={arm.x - 3}
                  y={arm.cupY - 10}
                  width={6}
                  height={16}
                  fill={crystal}
                  stroke={darken(crystal, 0.3)}
                  strokeWidth={0.6}
                />
                <path
                  d={`M${fx(arm.x)} ${fx(arm.cupY - 20)}Q${fx(arm.x + 4)} ${fx(arm.cupY - 13)} ${fx(arm.x)} ${fx(arm.cupY - 10)}Q${fx(arm.x - 4)} ${fx(arm.cupY - 13)} ${fx(arm.x)} ${fx(arm.cupY - 20)}Z`}
                  fill={flame}
                />
                <path
                  d={`M${fx(arm.x)} ${fx(arm.cupY + 12)}L${fx(arm.x)} ${fx(arm.cupY + 30)}`}
                  stroke={crystal}
                  strokeWidth={1.4}
                  strokeDasharray="2 2.5"
                />
                <use
                  href={ids.href('drop')}
                  transform={`translate(${fx(arm.x)} ${fx(arm.cupY + 30)})`}
                />
                <use
                  href={ids.href('drop')}
                  transform={`translate(${fx(arm.x * 0.6)} ${fx(arm.y + size * 0.13)}) scale(0.8)`}
                />
              </g>
            );
          }),
        )}
        {[0.2, 0.36, 0.52].map((reach, index) => (
          <path
            key={reach}
            d={`M${fx(-size * reach)} ${fx(size * (0.36 + index * 0.22))}Q0 ${fx(size * (0.5 + index * 0.24))} ${fx(size * reach)} ${fx(size * (0.36 + index * 0.22))}`}
            fill="none"
            stroke={crystal}
            strokeWidth={2.2}
            strokeDasharray="2 3.5"
          />
        ))}
        {[-0.3, -0.15, 0, 0.15, 0.3].map((t) => (
          <g key={t}>
            <path
              d={`M${fx(size * t)} ${fx(size * 0.86)}L${fx(size * t * 0.6)} ${fx(size * (1.02 - Math.abs(t) * 0.3))}`}
              stroke={crystal}
              strokeWidth={1.4}
              strokeDasharray="2 2.5"
            />
            <use
              href={ids.href('drop')}
              transform={`translate(${fx(size * t * 0.6)} ${fx(size * (1.02 - Math.abs(t) * 0.3))})`}
            />
          </g>
        ))}
        <path
          d={`M-4 ${size * 0.95}L0 ${size * 1.12}L4 ${size * 0.95}Z`}
          fill={crystal}
          stroke={darken(crystal, 0.3)}
          strokeWidth={0.8}
        />
        <path d={`M-2 ${size * 0.3}L-2 ${size * 0.9}`} stroke={glint} strokeWidth={1.4} />
      </g>
    );
  },
);

export const Chandelier = ({
  x,
  drop,
  size,
  metal,
  chandeliers,
  ids,
  frame,
}: {
  x: number;
  drop: number;
  size: number;
  metal: string;
  chandeliers: Chandeliers;
  ids: Ids;
  frame: number;
}) => {
  const sway = Math.sin(frame / 61 + x * 0.01) * 0.9;
  return (
    <g transform={`translate(${fx(x)} -40) rotate(${fx(sway)})`}>
      <path
        d={`M0 0L0 ${drop}`}
        stroke={darken(metal, 0.2)}
        strokeWidth={2}
        strokeDasharray="5 3"
      />
      <g transform={`translate(0 ${drop})`}>
        <ChandelierBody
          size={size}
          metal={metal}
          crystal={chandeliers.crystal}
          flame={chandeliers.flame}
          ids={ids}
        />
      </g>
    </g>
  );
};

export type Strand = { x: number; length: number };

const bell = (y: number) => `M-7 ${y + 14}Q-7 ${y} 0 ${y}Q7 ${y} 7 ${y + 14}Z`;

const StrandBody = memo(
  ({
    length,
    kind,
    garlands,
    ids,
  }: {
    length: number;
    kind: 'marigold' | 'bead';
    garlands: Paint['garlands'];
    ids: Ids;
  }) => {
    const spacing = kind === 'marigold' ? 19 : 26;
    const count = Math.max(1, Math.floor(length / spacing));
    const leaves = Array.from({ length: Math.floor(count / 2) }, (_, index) => {
      const y = (index * 2 + 1.5) * spacing;
      return leaf(0, y, index % 2 === 0 ? 0.5 : Math.PI - 0.5, 13, 4);
    }).join('');
    return (
      <g>
        <path
          d={`M0 0L0 ${count * spacing}`}
          stroke={darken(garlands.bell, 0.3)}
          strokeWidth={1.2}
        />
        {kind === 'marigold' ? (
          <path
            d={leaves}
            fill={garlands.leaf}
            stroke={darken(garlands.leaf, 0.3)}
            strokeWidth={0.6}
          />
        ) : null}
        {Array.from({ length: count }, (_, index) => (
          <use
            key={index}
            href={ids.href(kind)}
            transform={`translate(0 ${(index + 0.5) * spacing}) scale(${kind === 'marigold' ? 0.95 : 0.9})`}
          />
        ))}
        <path
          d={bell(count * spacing)}
          fill={garlands.bell}
          stroke={darken(garlands.bell, 0.35)}
          strokeWidth={1}
        />
        <path d={circle(0, count * spacing + 16, 2.4)} fill={darken(garlands.bell, 0.3)} />
      </g>
    );
  },
);

export const Strands = ({
  strands,
  kind,
  garlands,
  ids,
  frame,
  drop = 0,
}: {
  strands: readonly Strand[];
  kind: 'marigold' | 'bead';
  garlands: Paint['garlands'];
  ids: Ids;
  frame: number;
  drop?: number;
}) => (
  <g transform={`translate(0 ${fx(drop)})`}>
    {strands.map((strand, index) => (
      <g
        key={`${strand.x}-${strand.length}`}
        transform={`translate(${strand.x} -8) rotate(${fx(Math.sin(frame / 41 + index * 0.9) * garlands.sway)})`}
      >
        <StrandBody length={strand.length} kind={kind} garlands={garlands} ids={ids} />
      </g>
    ))}
  </g>
);

export const strandFan = (
  from: number,
  to: number,
  count: number,
  longest: number,
  shortest: number,
): Strand[] =>
  Array.from({ length: count }, (_, index) => {
    const t = count === 1 ? 0 : index / (count - 1);
    return {
      x: from + (to - from) * t,
      length: longest + (shortest - longest) * t + (index % 2) * 18,
    };
  });

export const Cascade = memo(
  ({
    from,
    to,
    depth,
    seed,
    garlands,
    trees,
  }: {
    from: number;
    to: number;
    depth: number;
    seed: number;
    garlands: Paint['garlands'];
    trees: Paint['trees'];
  }) => {
    const random = seeded(seed);
    const leaves: string[] = [];
    const blooms: string[] = [];
    const hearts: string[] = [];
    for (let x = from; x < to; x += 9 + random() * 10) {
      const edge = Math.min(x - from, to - x) / (to - from);
      const length = depth * (0.35 + random() * 0.45 + (0.5 - edge) * 0.6);
      for (let y = 0; y < length; y += 9) {
        const wobble = Math.sin(y / 30 + x) * 5;
        if (random() > 0.45) {
          blooms.push(circle(x + wobble, y, 3.6 + random() * 1.6));
          hearts.push(circle(x + wobble, y, 1.2));
        } else {
          leaves.push(leaf(x + wobble, y, Math.PI / 2 + (random() - 0.5) * 1.4, 14, 3.6));
        }
      }
    }
    return (
      <g>
        <rect x={from} y={-60} width={to - from} height={70} fill={darken(trees.dark, 0.1)} />
        <path
          d={leaves.join('')}
          fill={garlands.leaf}
          stroke={darken(garlands.leaf, 0.35)}
          strokeWidth={0.6}
        />
        <path
          d={blooms.join('')}
          fill={garlands.marigold}
          stroke={darken(garlands.marigold, 0.25)}
          strokeWidth={0.6}
        />
        <path d={hearts.join('')} fill={lighten(garlands.marigold, 0.55)} />
      </g>
    );
  },
);

export const Overhang = memo(
  ({
    x,
    y,
    reach,
    flip,
    seed,
    trees,
    ids,
  }: {
    x: number;
    y: number;
    reach: number;
    flip: boolean;
    seed: number;
    trees: Paint['trees'];
    ids: Ids;
  }) => {
    const random = seeded(seed);
    const main = `M-40 -30Q${fx(reach * 0.35)} ${fx(reach * 0.05)} ${fx(reach)} ${fx(reach * 0.2)}`;
    const sprays = Array.from({ length: 34 }, (_, index) => {
      const t = 0.08 + (index / 34) * 0.92;
      const px = -40 + (reach + 40) * t;
      const py = -30 + reach * 0.23 * Math.sin(t * Math.PI * 0.55) * (0.9 + t * 0.2);
      const up = index % 2 === 0;
      return {
        x: px,
        y: py,
        angle: (up ? -40 : 140) + (random() - 0.5) * 70 + t * 30,
        scale: 0.85 + random() * 0.4,
      };
    });
    return (
      <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
        <path d={main} fill="none" stroke={trees.trunk} strokeWidth={9} strokeLinecap="round" />
        <path
          d={main}
          fill="none"
          stroke={lighten(trees.trunk, 0.3)}
          strokeWidth={2.5}
          transform="translate(0 -2)"
        />
        {sprays.map((spray) => (
          <use
            key={`${spray.x}-${spray.angle}`}
            href={ids.href('spray')}
            transform={`translate(${fx(spray.x)} ${fx(spray.y)}) rotate(${fx(spray.angle)}) scale(${fx(spray.scale)})`}
          />
        ))}
      </g>
    );
  },
);
