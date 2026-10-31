import type { ArchSaveTheDateProps } from '@/schemas';
import { WALL_TOP } from './arch-geometry';
import { fixed, seeded } from './camera';

type Garlands = ArchSaveTheDateProps['garlands'];

export interface GarlandIds {
  bud: string;
  lotus: string;
}

export const GarlandDefs = ({
  ids,
  garlands,
  leaf,
}: {
  ids: GarlandIds;
  garlands: Garlands;
  leaf: string;
}) => (
  <>
    <linearGradient id={ids.bud} x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stopColor={leaf} />
      <stop offset="0.3" stopColor={garlands.bud} />
      <stop offset="0.75" stopColor={garlands.jasmine} />
      <stop offset="1" stopColor={garlands.bud} />
    </linearGradient>
    <linearGradient id={ids.lotus} x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stopColor={garlands.lotus} />
      <stop offset="1" stopColor={garlands.jasmine} />
    </linearGradient>
  </>
);

const Bud = ({
  x,
  y,
  ids,
  leaf,
  shine,
}: {
  x: number;
  y: number;
  ids: GarlandIds;
  leaf: string;
  shine: string;
}) => (
  <g>
    <path
      d={`M ${fixed(x)} ${fixed(y - 6)} C ${fixed(x - 22)} ${fixed(y + 8)} ${fixed(x - 18)} ${fixed(y + 34)} ${fixed(x)} ${fixed(y + 48)} C ${fixed(x + 18)} ${fixed(y + 34)} ${fixed(x + 22)} ${fixed(y + 8)} ${fixed(x)} ${fixed(y - 6)} Z`}
      fill={`url(#${ids.bud})`}
    />
    <path
      d={`M ${fixed(x - 12)} ${fixed(y + 2)} Q ${fixed(x)} ${fixed(y + 16)} ${fixed(x + 12)} ${fixed(y + 2)} L ${fixed(x)} ${fixed(y - 8)} Z`}
      fill={leaf}
    />
    <path
      d={`M ${fixed(x + 4)} ${fixed(y + 12)} Q ${fixed(x + 10)} ${fixed(y + 26)} ${fixed(x + 3)} ${fixed(y + 38)}`}
      fill="none"
      stroke={shine}
      strokeWidth={2.4}
      strokeLinecap="round"
    />
  </g>
);

const Lotus = ({
  x,
  y,
  ids,
  garlands,
}: {
  x: number;
  y: number;
  ids: GarlandIds;
  garlands: Garlands;
}) => (
  <g>
    {[-58, -30, 30, 58, 0].map((angle) => (
      <path
        key={angle}
        d={`M ${fixed(x)} ${fixed(y)} C ${fixed(x - 13)} ${fixed(y - 14)} ${fixed(x - 9)} ${fixed(y - 32)} ${fixed(x)} ${fixed(y - 40)} C ${fixed(x + 9)} ${fixed(y - 32)} ${fixed(x + 13)} ${fixed(y - 14)} ${fixed(x)} ${fixed(y)} Z`}
        transform={`rotate(${angle} ${fixed(x)} ${fixed(y)})`}
        fill={`url(#${ids.lotus})`}
        stroke={garlands.lotus}
        strokeWidth={1.2}
      />
    ))}
    <ellipse cx={fixed(x)} cy={fixed(y + 2)} rx={9} ry={5} fill={garlands.bud} />
  </g>
);

export const GarlandCurtain = ({
  cx,
  spread,
  apexY,
  garlands,
  ids,
  leaf,
  time,
  seed,
}: {
  cx: number;
  spread: number;
  apexY: number;
  garlands: Garlands;
  ids: GarlandIds;
  leaf: string;
  time: number;
  seed: number;
}) => {
  const count = garlands.strands;
  return (
    <g>
      {Array.from({ length: count }, (_, index) => {
        const share = (index + 0.5) / count;
        const x = cx - spread + share * spread * 2 + (seeded(index, seed) - 0.5) * (spread / count);
        const edge = Math.abs(share - 0.5) * 2;
        const bottom =
          apexY + (20 + edge * 150 + seeded(index, seed + 1) * 110) * garlands.length - 40;
        const sway = garlands.sway * Math.sin(time / 38 + seeded(index, seed + 2) * Math.PI * 2);
        const endX = x + sway;
        const strand = `M ${fixed(x)} ${WALL_TOP} L ${fixed(x)} ${fixed(bottom - 320)} Q ${fixed(x)} ${fixed(bottom - 120)} ${fixed(endX)} ${fixed(bottom)}`;
        const lotusAt = index % 3 === 1;
        return (
          <g key={index}>
            <path
              d={strand}
              fill="none"
              stroke={garlands.bud}
              strokeOpacity={0.55}
              strokeWidth={12}
              strokeLinecap="round"
              strokeDasharray="0 12"
              transform="translate(2.5 2)"
            />
            <path
              d={strand}
              fill="none"
              stroke={garlands.jasmine}
              strokeWidth={11}
              strokeLinecap="round"
              strokeDasharray="0 12"
            />
            {lotusAt ? (
              <Lotus x={x + sway * 0.4} y={bottom - 90} ids={ids} garlands={garlands} />
            ) : null}
            <Bud x={endX} y={bottom} ids={ids} leaf={leaf} shine={garlands.jasmine} />
          </g>
        );
      })}
    </g>
  );
};
