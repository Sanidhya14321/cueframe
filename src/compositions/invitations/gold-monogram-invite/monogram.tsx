import { random } from 'remotion';
import type { GoldMonogramInviteProps } from '@/schemas';
import { Embossed, type Gold, type GoldIds, paint, useSvgId, withAlpha } from './gold';
import { heartPath, type Point, spiral, teardrop } from './ornament';

const GLITTER = 140;

export const MonogramLetters = ({
  monogram,
  gold,
  ids,
  serif,
  center,
  glint,
  heart,
}: {
  monogram: GoldMonogramInviteProps['monogram'];
  gold: Gold;
  ids: GoldIds;
  serif: string;
  center: Point;
  glint: boolean;
  heart: number;
}) => {
  const clipId = useSvgId('monogram-clip');
  const size = monogram.size;
  const [cx, cy] = center;
  const baseline = cy + size * 0.35;
  const letters = (fill: string, stroke?: string, strokeWidth?: number, crest = heart) => (
    <g
      style={{
        fontFamily: serif,
        fontSize: size,
        fontWeight: 600,
        textRendering: 'geometricPrecision',
      }}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    >
      <text
        x={cx - size * 0.12}
        y={baseline}
        textAnchor="middle"
        letterSpacing={`${(-size * 0.07).toFixed(1)}`}
      >
        <tspan>{monogram.first}</tspan>
        <tspan dy={-size * 0.04}>{monogram.second}</tspan>
      </text>
      {monogram.showHeart && crest > 0 ? (
        <path d={heartPath([cx, cy - size * 0.86], 0, size * 0.07)} opacity={crest} />
      ) : null}
    </g>
  );
  const depth = size * 0.014;
  return (
    <g>
      <defs>
        <clipPath id={clipId}>{letters('#ffffff', undefined, undefined, 0)}</clipPath>
      </defs>
      <g transform={`translate(${depth * 0.8} ${depth * 2.4})`} opacity={0.55}>
        {letters('#000000')}
      </g>
      <Embossed depth={depth} gold={gold} fill={paint(ids.band)}>
        {(fill) => letters(fill)}
      </Embossed>
      {letters('none', withAlpha(gold.highlight, 0.45), 1.2)}
      <g clipPath={`url(#${clipId})`}>
        {Array.from({ length: GLITTER }, (_, index) => (
          <circle
            key={index.toString()}
            cx={cx + (random(`glitter-x-${index}`) - 0.5) * size * 1.5}
            cy={cy + (random(`glitter-y-${index}`) - 0.62) * size * 1.1}
            r={0.8 + random(`glitter-r-${index}`) * 1.4}
            fill={index % 2 === 0 ? gold.highlight : gold.deep}
            opacity={0.55}
          />
        ))}
      </g>
      {glint ? letters(paint(ids.glint)) : null}
    </g>
  );
};

const Filigree = ({ center, width, color }: { center: Point; width: number; color: string }) => {
  const [cx, cy] = center;
  const half = width / 2;
  const side = (sign: number) =>
    `${spiral([cx + sign * half * 0.22, cy + 10], 16, sign > 0 ? Math.PI : 0, 1.3, sign)} ${spiral([cx + sign * half * 0.52, cy + 4], 12, sign > 0 ? 0 : Math.PI, 1.2, -sign)} M ${cx + sign * 6} ${cy - 6} C ${cx + sign * half * 0.3} ${cy - 18} ${cx + sign * half * 0.7} ${cy + 26} ${cx + sign * half * 0.82} ${cy - 4}`;
  return (
    <g fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round">
      <path d={`${side(1)} ${side(-1)}`} />
      <path d={`${teardrop([cx, cy - 4], Math.PI / 2, 30, 7)}`} fill={color} stroke="none" />
    </g>
  );
};

export const Plaque = ({
  monogram,
  gold,
  ids,
  serif,
  y,
  opacity,
  backing,
}: {
  monogram: GoldMonogramInviteProps['monogram'];
  gold: Gold;
  ids: GoldIds;
  serif: string;
  y: number;
  opacity: number;
  backing: string;
}) => {
  const size = monogram.namesSize;
  const width = Math.max(560, monogram.names.length * size * 0.62);
  const left = 960 - width / 2;
  const rule = (top: number) => (
    <>
      <rect x={left} y={top} width={width} height={3.2} fill={paint(ids.sheen)} />
      <rect x={left} y={top + 8} width={width} height={1.6} fill={paint(ids.sheen)} />
    </>
  );
  const name = (fill: string) => (
    <text
      x={960}
      y={y + size * 0.36}
      textAnchor="middle"
      style={{
        fontFamily: serif,
        fontSize: size,
        fontWeight: 500,
        letterSpacing: '0.04em',
        textRendering: 'geometricPrecision',
      }}
      fill={fill}
    >
      {monogram.names}
    </text>
  );
  return (
    <g opacity={opacity}>
      <rect
        x={left}
        y={y - size * 0.95}
        width={width}
        height={size * 1.9}
        fill={withAlpha(backing, 0.72)}
      />
      {rule(y - size * 0.95)}
      {rule(y + size * 0.82)}
      <Embossed depth={2} gold={gold} fill={paint(ids.band)}>
        {name}
      </Embossed>
      <Filigree center={[960, y + size * 1.3]} width={width * 0.5} color={paint(ids.sheen)} />
    </g>
  );
};
