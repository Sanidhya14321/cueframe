import { memo } from 'react';
import { FRAME_HEIGHT, FRAME_WIDTH } from './camera';
import type { Ids } from './defs';
import { mix, type Paint } from './palette';
import { circle, fx, seeded } from './shapes';

const SPAN = 900;

const SKY_MARGIN = 1300;

export const SkyFill = ({
  id,
  top,
  horizon,
  horizonY,
}: {
  id: string;
  top: string;
  horizon: string;
  horizonY: number;
}) => (
  <>
    <defs>
      <linearGradient id={id} x1={0} y1={-420} x2={0} y2={horizonY} gradientUnits="userSpaceOnUse">
        <stop offset={0} stopColor={top} />
        <stop offset={0.35} stopColor={mix(top, horizon, 0.18)} />
        <stop offset={0.7} stopColor={mix(top, horizon, 0.55)} />
        <stop offset={1} stopColor={horizon} />
      </linearGradient>
    </defs>
    <rect
      x={-SKY_MARGIN}
      y={-SKY_MARGIN}
      width={FRAME_WIDTH + SKY_MARGIN * 2}
      height={FRAME_HEIGHT + SKY_MARGIN * 2}
      fill={`url(#${id})`}
    />
  </>
);

const cloudPuffs = (seed: number, width: number) => {
  const random = seeded(seed);
  const count = 13;
  return Array.from({ length: count }, (_, index) => {
    const t = index / (count - 1);
    const height = Math.sin(Math.PI * t) * (0.5 + random() * 0.5);
    return {
      x: (t - 0.5) * width + (random() - 0.5) * 20,
      y: -height * width * 0.16 + (random() - 0.5) * 10,
      rx: width * (0.08 + random() * 0.06) * (0.7 + height * 0.6),
      ry: width * (0.05 + random() * 0.04) * (0.6 + height * 0.9),
    };
  });
};

const CloudShape = memo(
  ({
    seed,
    width,
    fill,
    shade,
    filter,
  }: {
    seed: number;
    width: number;
    fill: string;
    shade: string;
    filter: string;
  }) => {
    const puffs = cloudPuffs(seed, width);
    return (
      <g filter={filter}>
        {puffs.map((puff) => (
          <ellipse
            key={`s${puff.x}`}
            cx={puff.x + 8}
            cy={puff.y + 16}
            rx={puff.rx}
            ry={puff.ry * 0.8}
            fill={shade}
          />
        ))}
        {puffs.map((puff) => (
          <ellipse
            key={`f${puff.x}`}
            cx={puff.x}
            cy={puff.y}
            rx={puff.rx}
            ry={puff.ry}
            fill={fill}
          />
        ))}
        {puffs.slice(2, -2).map((puff) => (
          <ellipse
            key={`h${puff.x}`}
            cx={puff.x - puff.rx * 0.2}
            cy={puff.y - puff.ry * 0.35}
            rx={puff.rx * 0.55}
            ry={puff.ry * 0.4}
            fill="#ffffff"
            opacity={0.75}
          />
        ))}
        {puffs.slice(0, 5).map((puff) => (
          <ellipse
            key={`w${puff.x}`}
            cx={puff.x * 1.35}
            cy={puff.y * 0.4 + puff.ry * 0.6}
            rx={puff.rx * 1.3}
            ry={puff.ry * 0.28}
            fill={fill}
            opacity={0.55}
          />
        ))}
      </g>
    );
  },
);

export type CloudSpot = { x: number; y: number; width: number; seed: number };

export const Clouds = ({
  spots,
  count,
  paint,
  ids,
  frame,
}: {
  spots: readonly CloudSpot[];
  count: number;
  paint: Paint;
  ids: Ids;
  frame: number;
}) => (
  <g>
    {spots.slice(0, count).map((spot) => {
      const span = FRAME_WIDTH + SPAN;
      const raw = spot.x - frame * paint.sky.cloudSpeed + SPAN / 2;
      const x = (((raw % span) + span) % span) - SPAN / 2;
      return (
        <g key={spot.seed} transform={`translate(${fx(x)} ${spot.y})`}>
          <CloudShape
            seed={spot.seed}
            width={spot.width}
            fill={paint.sky.clouds}
            shade={paint.sky.cloudShade}
            filter={ids.url('soft')}
          />
        </g>
      );
    })}
  </g>
);

const STAR_GROUPS = 4;

const starField = (count: number) => {
  const random = seeded(91);
  const groups: string[] = Array.from({ length: STAR_GROUPS }, () => '');
  for (let index = 0; index < count; index += 1) {
    const x = -300 + random() * (FRAME_WIDTH + 600);
    const y = -300 + random() * 1700;
    const r = 0.7 + random() ** 3 * 1.8;
    groups[index % STAR_GROUPS] += circle(x, y, r);
  }
  return groups;
};

export const Stars = memo(
  ({ count, color, frame }: { count: number; color: string; frame: number }) => {
    const groups = starField(count);
    return (
      <g>
        {groups.map((d, index) => (
          <path
            key={d.slice(0, 24)}
            d={d}
            fill={color}
            opacity={0.55 + 0.35 * Math.sin(frame / 23 + index * 1.7)}
          />
        ))}
      </g>
    );
  },
);

const flock = (count: number) => {
  const random = seeded(17);
  return Array.from({ length: count }, (_, index) => ({
    x: -index * 22 - random() * 30 + (index % 2) * 12,
    y: (random() - 0.5) * 120 + (index % 3) * 18,
    size: 15 + random() * 8,
    phase: random() * Math.PI * 2,
  }));
};

const birdPath = (size: number, flap: number): string => {
  const lift = size * (0.25 + flap * 0.55);
  return `M${fx(-size)} ${fx(-lift * 0.6)}Q${fx(-size * 0.45)} ${fx(-lift)} 0 0Q${fx(size * 0.45)} ${fx(-lift)} ${fx(size)} ${fx(-lift * 0.6)}Q${fx(size * 0.4)} ${fx(-lift * 0.5 + 3)} 0 ${fx(3.5)}Q${fx(-size * 0.4)} ${fx(-lift * 0.5 + 3)} ${fx(-size)} ${fx(-lift * 0.6)}Z`;
};

export const Birds = ({
  count,
  color,
  frame,
  from,
  to,
  start,
  end,
}: {
  count: number;
  color: string;
  frame: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
  start: number;
  end: number;
}) => {
  if (count === 0 || frame < start || frame > end) {
    return null;
  }
  const t = (frame - start) / (end - start);
  const x = from.x + (to.x - from.x) * t;
  const y = from.y + (to.y - from.y) * t;
  return (
    <g transform={`translate(${fx(x)} ${fx(y)})`}>
      {flock(count).map((bird) => (
        <path
          key={bird.phase}
          d={birdPath(bird.size, 0.5 + 0.5 * Math.sin(frame / 2.6 + bird.phase))}
          transform={`translate(${fx(bird.x)} ${fx(bird.y + Math.sin(frame / 9 + bird.phase) * 4)})`}
          fill={color}
        />
      ))}
    </g>
  );
};

export const Petals = ({
  count,
  color,
  frame,
}: {
  count: number;
  color: string;
  frame: number;
}) => {
  const random = seeded(53);
  return (
    <g>
      {Array.from({ length: count }, (_, index) => {
        const startX = random() * (FRAME_WIDTH + 200) - 100;
        const startY = random() * FRAME_HEIGHT;
        const fall = 0.7 + random() * 0.6;
        const size = 4 + random() * 4;
        const phase = random() * Math.PI * 2;
        const y = ((startY + frame * fall) % (FRAME_HEIGHT + 80)) - 40;
        const x = startX + Math.sin(frame / 40 + phase) * 30 - frame * 0.25;
        const wrapped =
          ((((x + 100) % (FRAME_WIDTH + 200)) + FRAME_WIDTH + 200) % (FRAME_WIDTH + 200)) - 100;
        return (
          <ellipse
            key={`${index}-${phase}`}
            cx={0}
            cy={0}
            rx={size}
            ry={size * 0.55}
            fill={color}
            opacity={0.38}
            transform={`translate(${fx(wrapped)} ${fx(y)}) rotate(${fx((frame * 1.3 + phase * 57) % 360)})`}
          />
        );
      })}
    </g>
  );
};
