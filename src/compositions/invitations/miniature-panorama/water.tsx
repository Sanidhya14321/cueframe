import { memo } from 'react';
import type { Ids } from './defs';
import { darken, lighten, mix, type Paint } from './palette';
import { fx, seeded } from './shapes';

type Lake = Paint['lake'];

const WAVE = 120;

const REACH = 1300;

const waveLines = (seed: number, from: number, to: number, top: number, bottom: number) => {
  const random = seeded(seed);
  const light: string[] = [];
  const dark: string[] = [];
  for (let y = top + 16; y < bottom - 6; y += 13 + random() * 16) {
    const start = from - REACH + random() * WAVE;
    let x = start;
    const segments: string[] = [`M${fx(x)} ${fx(y)}`];
    const amplitude = 3 + random() * 4;
    while (x < to + REACH) {
      const run = 50 + random() * 120;
      const gap = 30 + random() * 90;
      segments.push(
        `Q${fx(x + run * 0.25)} ${fx(y - amplitude)} ${fx(x + run * 0.5)} ${fx(y)}T${fx(x + run)} ${fx(y)}M${fx(x + run + gap)} ${fx(y)}`,
      );
      x += run + gap;
    }
    (random() > 0.45 ? light : dark).push(segments.join(''));
  }
  return { light: light.join(''), dark: dark.join('') };
};

export const Water = ({
  id,
  from,
  to,
  top,
  bottom,
  frame,
  lake,
}: {
  id: string;
  from: number;
  to: number;
  top: number;
  bottom: number;
  frame: number;
  lake: Lake;
}) => {
  const lines = waveLines(Math.round(top), from, to, top, bottom);
  const drift = frame * 0.45;
  return (
    <g>
      <defs>
        <linearGradient id={id} x1={0} y1={top} x2={0} y2={bottom} gradientUnits="userSpaceOnUse">
          <stop offset={0} stopColor={darken(lake.water, 0.12)} />
          <stop offset={0.3} stopColor={lake.water} />
          <stop offset={1} stopColor={mix(lake.water, lake.ripple, 0.18)} />
        </linearGradient>
      </defs>
      <rect x={from} y={top} width={to - from} height={bottom - top} fill={`url(#${id})`} />
      <path
        d={lines.dark}
        fill="none"
        stroke={darken(lake.water, 0.28)}
        strokeWidth={3}
        strokeLinecap="round"
        transform={`translate(${fx(-drift)} 0)`}
      />
      <path
        d={lines.light}
        fill="none"
        stroke={lake.ripple}
        strokeWidth={2.6}
        strokeLinecap="round"
        opacity={0.85}
        transform={`translate(${fx(drift * 0.6)} 0)`}
      />
    </g>
  );
};

export type LotusRow = { y: number; spacing: number; scale: number };

export const LotusField = memo(
  ({
    from,
    to,
    rows,
    seed,
    ids,
  }: {
    from: number;
    to: number;
    rows: readonly LotusRow[];
    seed: number;
    ids: Ids;
  }) => {
    const random = seeded(seed);
    const items = rows.flatMap((row, rowIndex) => {
      const placed: {
        x: number;
        y: number;
        scale: number;
        kind: 'pad' | 'lotus' | 'lotus-white';
      }[] = [];
      for (
        let x = from + random() * row.spacing;
        x < to;
        x += row.spacing * (0.7 + random() * 0.6)
      ) {
        const y = row.y + (random() - 0.5) * 14;
        placed.push({ x, y, scale: row.scale * (0.85 + random() * 0.3), kind: 'pad' });
        if (random() > 0.35) {
          placed.push({
            x: x + (random() - 0.5) * 20,
            y: y - 6,
            scale: row.scale * (0.8 + random() * 0.35),
            kind: (rowIndex + Math.round(x)) % 3 === 0 ? 'lotus-white' : 'lotus',
          });
        }
      }
      return placed;
    });
    return (
      <g>
        {items.map((item) => (
          <use
            key={`${item.kind}-${item.x}-${item.y}`}
            href={ids.href(item.kind)}
            transform={`translate(${fx(item.x)} ${fx(item.y)}) scale(${fx(item.scale)})`}
          />
        ))}
      </g>
    );
  },
);

const BODY =
  'M-96 -6C-112 -40 -84 -56 -62 -44C-32 -62 28 -58 60 -26C74 -12 62 8 30 10L-68 10C-88 8 -96 2 -96 -6Z';

const WING = 'M-74 -38C-60 -100 6 -96 34 -50C14 -58 -8 -40 -24 -30C-44 -24 -66 -26 -74 -38Z';

const FEATHERS =
  'M-64 -46Q-56 -40 -48 -46Q-40 -40 -32 -46Q-24 -40 -16 -46Q-8 -40 0 -46Q8 -40 16 -46M-56 -62Q-48 -56 -40 -62Q-32 -56 -24 -62Q-16 -56 -8 -62Q0 -56 8 -62M-44 -78Q-36 -72 -28 -78Q-20 -72 -12 -78Q-4 -72 4 -76';

const NECK = 'M42 -30C86 -70 8 -118 30 -166C42 -190 74 -186 82 -164';

const Swan = ({
  swans,
  water,
  flip,
  bob,
}: {
  swans: Paint['swans'];
  water: string;
  flip: boolean;
  bob: number;
}) => {
  const shade = mix(swans.body, water, 0.3);
  return (
    <g transform={`translate(0 ${fx(bob)}) scale(${flip ? -1 : 1} 1)`}>
      <path d={BODY} fill={swans.body} transform="translate(0 22) scale(1 -0.38)" opacity={0.28} />
      <path
        d={NECK}
        fill="none"
        stroke={shade}
        strokeWidth={19}
        strokeLinecap="round"
        transform="translate(3 2)"
      />
      <path d={NECK} fill="none" stroke={swans.body} strokeWidth={16} strokeLinecap="round" />
      <ellipse cx={74} cy={-170} rx={15} ry={11} fill={swans.body} transform="rotate(20 74 -170)" />
      <path
        d="M84 -176L106 -150L96 -148L80 -166Z"
        fill={swans.beak}
        stroke={darken(swans.beak, 0.3)}
        strokeWidth={1}
      />
      <path d="M78 -178Q90 -178 88 -166L80 -164Z" fill={darken(swans.beak, 0.75)} />
      <circle cx={72} cy={-174} r={2.4} fill={darken(swans.beak, 0.8)} />
      <path d={BODY} fill={swans.body} stroke={shade} strokeWidth={1.4} />
      <path d={`M-96 -6C-80 4 30 8 60 -20L30 10L-68 10Z`} fill={shade} opacity={0.55} />
      <path d={WING} fill={lighten(swans.body, 0.5)} stroke={shade} strokeWidth={1.4} />
      <path d={FEATHERS} fill="none" stroke={shade} strokeWidth={1.3} />
    </g>
  );
};

export const SwanPair = ({
  x,
  y,
  scale,
  swans,
  lake,
  frame,
}: {
  x: number;
  y: number;
  scale: number;
  swans: Paint['swans'];
  lake: Lake;
  frame: number;
}) => {
  const glide = Math.sin(frame / 50) * 6;
  return (
    <g transform={`translate(${fx(x + glide)} ${y}) scale(${scale})`}>
      <ellipse
        cx={0}
        cy={14}
        rx={230}
        ry={10}
        fill="none"
        stroke={lake.ripple}
        strokeWidth={2.2}
        opacity={0.7}
      />
      <ellipse
        cx={0}
        cy={22}
        rx={180}
        ry={8}
        fill="none"
        stroke={lighten(lake.ripple, 0.3)}
        strokeWidth={1.6}
        opacity={0.6}
      />
      <g transform="translate(-98 0)">
        <Swan swans={swans} water={lake.water} flip={false} bob={Math.sin(frame / 21) * 2.2} />
      </g>
      <g transform="translate(98 0)">
        <Swan swans={swans} water={lake.water} flip bob={Math.sin(frame / 21 + 1.4) * 2.2} />
      </g>
    </g>
  );
};
