import { type ReactNode, useId } from 'react';
import type { GoldMonogramInviteProps } from '@/schemas';

export type Gold = GoldMonogramInviteProps['gold'];

export const useSvgId = (prefix: string): string =>
  `${prefix}${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

export const withAlpha = (hex: string, alpha: number): string => {
  const red = Number.parseInt(hex.slice(1, 3), 16);
  const green = Number.parseInt(hex.slice(3, 5), 16);
  const blue = Number.parseInt(hex.slice(5, 7), 16);
  return `rgba(${red}, ${green}, ${blue}, ${Math.max(0, Math.min(1, alpha)).toFixed(4)})`;
};

const bandStops = (gold: Gold): [number, string][] => [
  [0, gold.light],
  [0.22, gold.highlight],
  [0.42, gold.light],
  [0.56, gold.mid],
  [0.7, gold.deep],
  [0.84, gold.mid],
  [1, gold.light],
];

const sheenStops = (gold: Gold): [number, string][] => [
  [0, gold.deep],
  [0.16, gold.mid],
  [0.3, gold.light],
  [0.38, gold.highlight],
  [0.46, gold.light],
  [0.62, gold.mid],
  [0.76, gold.deep],
  [0.88, gold.mid],
  [1, gold.light],
];

export type GoldIds = { band: string; sheen: string; glint: string };

export const useGoldIds = (prefix: string): GoldIds => {
  const base = useSvgId(prefix);
  return { band: `${base}band`, sheen: `${base}sheen`, glint: `${base}glint` };
};

export const paint = (id: string): string => `url(#${id})`;

export const GoldGradients = ({
  ids,
  gold,
  sheen,
  glint = -1,
}: {
  ids: GoldIds;
  gold: Gold;
  sheen: [number, number, number, number];
  glint?: number;
}) => {
  const [x1, y1, x2, y2] = sheen;
  const center = glint;
  return (
    <>
      <linearGradient id={ids.band} x1="0" y1="0" x2="0.18" y2="1">
        {bandStops(gold).map(([offset, color]) => (
          <stop key={offset} offset={offset} stopColor={color} />
        ))}
      </linearGradient>
      <linearGradient id={ids.sheen} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
        {sheenStops(gold).map(([offset, color]) => (
          <stop key={offset} offset={offset} stopColor={color} />
        ))}
      </linearGradient>
      <linearGradient id={ids.glint} x1="0" y1="0" x2="1" y2="0.35">
        {[
          [center - 0.16, 0],
          [center - 0.05, 0.35],
          [center, 0.95],
          [center + 0.05, 0.35],
          [center + 0.16, 0],
        ].map(([offset, opacity]) => (
          <stop
            key={offset}
            offset={Math.max(0, Math.min(1, offset ?? 0))}
            stopColor={gold.highlight}
            stopOpacity={opacity}
          />
        ))}
      </linearGradient>
    </>
  );
};

export const Embossed = ({
  depth,
  gold,
  fill,
  children,
}: {
  depth: number;
  gold: Gold;
  fill: string;
  children: (color: string) => ReactNode;
}) => (
  <>
    <g transform={`translate(${(depth * 0.35).toFixed(2)} ${depth.toFixed(2)})`}>
      {children(withAlpha(gold.deep, 0.92))}
    </g>
    <g transform={`translate(${(-depth * 0.18).toFixed(2)} ${(-depth * 0.32).toFixed(2)})`}>
      {children(gold.highlight)}
    </g>
    <g>{children(fill)}</g>
  </>
);
