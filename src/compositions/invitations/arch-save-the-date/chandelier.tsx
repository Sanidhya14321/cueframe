import type { ArchSaveTheDateProps } from '@/schemas';
import { WALL_TOP } from './arch-geometry';
import { fixed, seeded } from './camera';

type Chandeliers = ArchSaveTheDateProps['chandeliers'];

export interface ChandelierIds {
  bowl: string;
  drop: string;
  brass: string;
}

export const ChandelierDefs = ({
  ids,
  chandeliers,
  tint,
}: {
  ids: ChandelierIds;
  chandeliers: Chandeliers;
  tint: string;
}) => (
  <>
    <linearGradient id={ids.bowl} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor={tint} />
      <stop offset="0.35" stopColor={chandeliers.crystal} />
      <stop offset="0.6" stopColor={chandeliers.crystal} />
      <stop offset="1" stopColor={tint} />
    </linearGradient>
    <linearGradient id={ids.drop} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor={tint} />
      <stop offset="0.4" stopColor={chandeliers.crystal} />
      <stop offset="1" stopColor={tint} />
    </linearGradient>
    <linearGradient id={ids.brass} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={chandeliers.crystal} />
      <stop offset="0.35" stopColor={chandeliers.metal} />
      <stop offset="1" stopColor={chandeliers.metal} />
    </linearGradient>
  </>
);

const Glint = ({
  x,
  y,
  size,
  opacity,
  color,
}: Record<'x' | 'y' | 'size' | 'opacity', number> & { color: string }) =>
  opacity <= 0.01 ? null : (
    <path
      d={`M ${fixed(x)} ${fixed(y - size)} Q ${fixed(x)} ${fixed(y)} ${fixed(x + size)} ${fixed(y)} Q ${fixed(x)} ${fixed(y)} ${fixed(x)} ${fixed(y + size)} Q ${fixed(x)} ${fixed(y)} ${fixed(x - size)} ${fixed(y)} Q ${fixed(x)} ${fixed(y)} ${fixed(x)} ${fixed(y - size)} Z`}
      fill={color}
      opacity={opacity}
    />
  );

const ARM_REACH = [0.3, 0.62, 0.95];

const BEAD_ROWS = 7;

export const Chandelier = ({
  cx,
  chandeliers,
  ids,
  time,
  seed,
  tint,
}: {
  cx: number;
  chandeliers: Chandeliers;
  ids: ChandelierIds;
  time: number;
  seed: number;
  tint: string;
}) => {
  const k = chandeliers.size;
  const bottom = chandeliers.drop;
  const rim = bottom - 178 * k;
  const base = bottom - 86 * k;
  const hub = bottom - 250 * k;
  const crown = bottom - 340 * k;
  const bowlWidth = 158 * k;
  const swing = Math.sin(time / 64 + seed) * 1.1;
  const baseWidth = bowlWidth * 0.62;
  const sag = 16 * k;
  const band = (y: number, half: number) =>
    `M ${fixed(cx - half)} ${fixed(y)} Q ${fixed(cx)} ${fixed(y + sag * 2)} ${fixed(cx + half)} ${fixed(y)}`;
  const basket = `M ${fixed(cx - bowlWidth)} ${fixed(rim)} Q ${fixed(cx)} ${fixed(rim + sag * 2)} ${fixed(cx + bowlWidth)} ${fixed(rim)} C ${fixed(cx + bowlWidth * 0.97)} ${fixed(rim + 50 * k)} ${fixed(cx + baseWidth * 1.08)} ${fixed(base - 12 * k)} ${fixed(cx + baseWidth)} ${fixed(base)} Q ${fixed(cx)} ${fixed(base + sag * 2)} ${fixed(cx - baseWidth)} ${fixed(base)} C ${fixed(cx - baseWidth * 1.08)} ${fixed(base - 12 * k)} ${fixed(cx - bowlWidth * 0.97)} ${fixed(rim + 50 * k)} ${fixed(cx - bowlWidth)} ${fixed(rim)} Z`;
  const beadRows = Array.from({ length: BEAD_ROWS }, (_row, index) => {
    const share = (index + 0.7) / (BEAD_ROWS + 0.2);
    const y = rim + (base - rim) * share;
    const half = bowlWidth + (baseWidth - bowlWidth) * share ** 1.3 - 6 * k;
    return {
      index,
      d: band(y, half),
      offset: index % 2 === 0 ? 0 : 4.8 * k,
    };
  });
  const pendantCount = 13;
  const pendants = Array.from({ length: pendantCount }, (_pendant, index) => {
    const share = index / (pendantCount - 1) - 0.5;
    const x = cx + share * 2 * baseWidth * 0.94;
    const top = base + sag * 2 * (1 - (2 * share) ** 2) - 2 * k;
    const length = (24 + (index % 2) * 10) * k;
    return `M ${fixed(x)} ${fixed(top)} L ${fixed(x + 5 * k)} ${fixed(top + length * 0.62)} L ${fixed(x)} ${fixed(top + length)} L ${fixed(x - 5 * k)} ${fixed(top + length * 0.62)} Z`;
  }).join(' ');
  const chains = [-1, -0.66, -0.33, 0, 0.33, 0.66, 1];
  const drops = [-3, -2, -1, 0, 1, 2, 3];
  const glints = Array.from({ length: 11 }, (_, index) => ({
    x: cx + (seeded(index, seed + 3) - 0.5) * bowlWidth * 1.5,
    y: rim + seeded(index, seed + 5) * (base - rim + 40 * k),
    phase: seeded(index, seed + 7) * Math.PI * 2,
  }));
  return (
    <g transform={`rotate(${swing.toFixed(4)} ${fixed(cx)} ${fixed(crown)})`}>
      <path
        d={`M ${fixed(cx)} ${WALL_TOP} V ${fixed(crown)}`}
        stroke={chandeliers.metal}
        strokeWidth={fixed(5 * k)}
      />
      <path
        d={`M ${fixed(cx)} ${fixed(crown + 6 * k)} V ${fixed(rim)}`}
        stroke={`url(#${ids.brass})`}
        strokeWidth={fixed(9 * k)}
      />
      {[crown + 20 * k, hub - 24 * k, hub + 30 * k].map((y) => (
        <ellipse
          key={y}
          cx={fixed(cx)}
          cy={fixed(y)}
          rx={fixed(13 * k)}
          ry={fixed(17 * k)}
          fill={`url(#${ids.drop})`}
          stroke={chandeliers.metal}
          strokeWidth={fixed(1.6 * k)}
        />
      ))}
      {[-1, 1].flatMap((direction) =>
        ARM_REACH.map((reach) => {
          const tipX = cx + direction * reach * bowlWidth * 1.05;
          const tipY = hub - (8 + reach * 26) * k;
          return (
            <g key={`${direction}:${reach}`}>
              <path
                d={`M ${fixed(cx)} ${fixed(hub)} C ${fixed(cx + direction * reach * bowlWidth * 0.5)} ${fixed(hub + 60 * k)} ${fixed(tipX)} ${fixed(hub + 40 * k)} ${fixed(tipX)} ${fixed(tipY)}`}
                fill="none"
                stroke={chandeliers.metal}
                strokeWidth={fixed(4.5 * k)}
              />
              <path
                d={`M ${fixed(tipX - 12 * k)} ${fixed(tipY)} Q ${fixed(tipX)} ${fixed(tipY + 12 * k)} ${fixed(tipX + 12 * k)} ${fixed(tipY)} Z`}
                fill={chandeliers.metal}
              />
              <rect
                x={fixed(tipX - 4.5 * k)}
                y={fixed(tipY - 34 * k)}
                width={fixed(9 * k)}
                height={fixed(34 * k)}
                fill={`url(#${ids.drop})`}
              />
              <path
                d={`M ${fixed(cx)} ${fixed(hub + 8 * k)} Q ${fixed((cx + tipX) / 2)} ${fixed(hub + 72 * k)} ${fixed(tipX)} ${fixed(tipY + 6 * k)}`}
                fill="none"
                stroke={chandeliers.crystal}
                strokeWidth={fixed(5 * k)}
                strokeLinecap="round"
                strokeDasharray={`0 ${fixed(9 * k)}`}
              />
            </g>
          );
        }),
      )}
      {chains.map((share) => (
        <path
          key={share}
          d={`M ${fixed(cx + share * 30 * k)} ${fixed(crown + 34 * k)} Q ${fixed(cx + share * bowlWidth * 0.55)} ${fixed(hub + 40 * k)} ${fixed(cx + share * bowlWidth * 0.97)} ${fixed(rim + 2 * k)}`}
          fill="none"
          stroke={chandeliers.crystal}
          strokeWidth={fixed(4.2 * k)}
          strokeLinecap="round"
          strokeDasharray={`0 ${fixed(7 * k)}`}
        />
      ))}
      <path
        d={basket}
        fill={`url(#${ids.bowl})`}
        stroke={chandeliers.metal}
        strokeWidth={fixed(1.5 * k)}
      />
      {beadRows.map((row) => (
        <g key={row.index}>
          <path
            d={row.d}
            fill="none"
            stroke={tint}
            strokeWidth={fixed(8.6 * k)}
            strokeLinecap="round"
            strokeDasharray={`0 ${fixed(9.6 * k)}`}
            strokeDashoffset={fixed(row.offset)}
          />
          <path
            d={row.d}
            fill="none"
            stroke={chandeliers.crystal}
            strokeWidth={fixed(6.4 * k)}
            strokeLinecap="round"
            strokeDasharray={`0 ${fixed(9.6 * k)}`}
            strokeDashoffset={fixed(row.offset)}
          />
        </g>
      ))}
      <path d={pendants} fill={`url(#${ids.drop})`} stroke={tint} strokeWidth={fixed(0.8 * k)} />
      <path
        d={band(rim, bowlWidth)}
        fill="none"
        stroke={chandeliers.metal}
        strokeWidth={fixed(7 * k)}
        strokeLinecap="round"
      />
      <path
        d={band(rim - 1.5 * k, bowlWidth * 0.97)}
        fill="none"
        stroke={chandeliers.crystal}
        strokeWidth={fixed(1.6 * k)}
        opacity={0.7}
      />
      <path
        d={band(base, baseWidth)}
        fill="none"
        stroke={chandeliers.metal}
        strokeWidth={fixed(4.5 * k)}
        strokeLinecap="round"
      />
      {drops.map((slot) => {
        const length = (86 - Math.abs(slot) * 16) * k;
        const x = cx + slot * 13 * k;
        const top = base - 10 * k + Math.abs(slot) * 4 * k;
        return (
          <path
            key={slot}
            d={`M ${fixed(x)} ${fixed(top)} L ${fixed(x + 6 * k)} ${fixed(top + length * 0.7)} L ${fixed(x)} ${fixed(top + length)} L ${fixed(x - 6 * k)} ${fixed(top + length * 0.7)} Z`}
            fill={`url(#${ids.drop})`}
            stroke={chandeliers.metal}
            strokeOpacity={0.35}
            strokeWidth={fixed(k)}
          />
        );
      })}
      {glints.map((glint) => (
        <Glint
          key={glint.phase}
          x={glint.x}
          y={glint.y}
          size={16 * k}
          color={chandeliers.crystal}
          opacity={chandeliers.sparkle * Math.max(0, Math.sin(time * 0.07 + glint.phase)) ** 6}
        />
      ))}
    </g>
  );
};
