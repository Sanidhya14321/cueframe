import { random } from 'remotion';
import type { GoldMonogramInviteProps } from '@/schemas';
import { type Gold, type GoldIds, paint, useSvgId, withAlpha } from './gold';
import { circleAt, type Point, pt } from './ornament';

const STONE = 84;
const HALO = 26;

const cushion = (radius: number, squish: number): Point[] =>
  Array.from({ length: 48 }, (_, index) => {
    const angle = (index / 48) * Math.PI * 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const shape = 1 / (Math.abs(cos) ** 3.2 + Math.abs(sin) ** 3.2) ** (1 / 3.2);
    return [cos * radius * shape, sin * radius * shape * squish];
  });

const polygon = (points: Point[]): string => `M ${points.map(pt).join(' L ')} Z`;

export const Ring = ({
  frame,
  gold,
  ids,
  sparkle,
  gem,
}: {
  frame: number;
  gold: Gold;
  ids: GoldIds;
  sparkle: number;
  gem: GoldMonogramInviteProps['gem'];
}) => {
  const flareId = useSvgId('ring-flare');
  const rayId = useSvgId('ring-ray');
  const bokehId = useSvgId('ring-bokeh');
  const outline = cushion(STONE, 0.82);
  const halo = cushion(STONE + HALO * 0.62, 0.82);
  const facets = outline.filter((_, index) => index % 4 === 0);
  const pulse = 0.75 + 0.25 * Math.sin(frame / 7);
  const twist = frame * 0.25;
  return (
    <g>
      <defs>
        <filter id={flareId} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={26} />
        </filter>
        <filter id={bokehId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={9} />
        </filter>
        <linearGradient id={rayId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={gold.highlight} stopOpacity={0} />
          <stop offset="0.5" stopColor={gem.sparkle} stopOpacity={0.95} />
          <stop offset="1" stopColor={gold.highlight} stopOpacity={0} />
        </linearGradient>
      </defs>
      {Array.from({ length: 16 }, (_, index) => (
        <circle
          key={index.toString()}
          cx={
            -560 +
            random(`bokeh-x-${index}`) * 1100 -
            frame * 0.7 * (0.5 + random(`bokeh-s-${index}`))
          }
          cy={-200 + random(`bokeh-y-${index}`) * 260}
          r={14 + random(`bokeh-r-${index}`) * 30}
          fill={index % 3 === 0 ? gold.highlight : gold.mid}
          opacity={
            (0.18 + 0.2 * random(`bokeh-o-${index}`)) * (0.8 + 0.2 * Math.sin(frame / 20 + index))
          }
          filter={`url(#${bokehId})`}
        />
      ))}
      <path
        d={`M ${pt([120, 40])} C ${pt([300, -20])} ${pt([520, -40])} ${pt([600, 30])}`}
        fill="none"
        stroke={withAlpha(gold.light, 0.5)}
        strokeWidth={10}
        strokeDasharray="2 14"
        strokeLinecap="round"
      />
      <ellipse
        cx={30}
        cy={74}
        rx={250}
        ry={84}
        fill="none"
        stroke={withAlpha(gold.deep, 0.95)}
        strokeWidth={38}
      />
      <ellipse
        cx={30}
        cy={70}
        rx={250}
        ry={84}
        fill="none"
        stroke={paint(ids.sheen)}
        strokeWidth={28}
      />
      <path
        d="M -214 84 A 250 84 0 0 0 274 84"
        fill="none"
        stroke={withAlpha(gold.highlight, 0.6)}
        strokeWidth={4}
      />
      <path d={polygon(halo)} fill={paint(ids.sheen)} />
      {halo
        .filter((_, index) => index % 2 === 0)
        .map((point, index) => (
          <g key={index.toString()}>
            <path d={circleAt(point, 8.5)} fill={withAlpha(gem.sparkle, 0.85)} />
            <path d={circleAt([point[0] - 2.2, point[1] - 2.2], 3)} fill={gem.sparkle} />
          </g>
        ))}
      <path d={polygon(outline)} fill={gem.facet} />
      {facets.map((point, index) => {
        const next = facets[(index + 1) % facets.length] ?? point;
        return (
          <path
            key={index.toString()}
            d={polygon([[0, -6], point, next])}
            fill={index % 2 === 0 ? gem.sparkle : gem.stone}
            opacity={0.25 + 0.7 * (0.5 + 0.5 * Math.sin(frame / 11 + index * 1.3))}
          />
        );
      })}
      <path
        d={polygon(cushion(STONE * 0.48, 0.82))}
        fill="none"
        stroke={gem.sparkle}
        strokeOpacity={0.7}
        strokeWidth={2}
      />
      <path d={polygon(outline)} fill="none" stroke={paint(ids.sheen)} strokeWidth={5} />
      <g opacity={sparkle}>
        <circle
          cx={-14}
          cy={-18}
          r={90 * pulse}
          fill={withAlpha(gold.highlight, 0.55)}
          filter={`url(#${flareId})`}
        />
        <rect
          x={-420}
          y={-21}
          width={840}
          height={6}
          fill={`url(#${rayId})`}
          opacity={0.75 * pulse}
        />
        <g transform={`translate(-14 -18) rotate(${twist.toFixed(2)})`}>
          {[0, 45, 90, 135].map((angle) => (
            <rect
              key={angle}
              x={angle % 90 === 0 ? -150 * pulse : -80 * pulse}
              y={-1.6}
              width={(angle % 90 === 0 ? 300 : 160) * pulse}
              height={3.2}
              fill={`url(#${rayId})`}
              transform={`rotate(${angle})`}
            />
          ))}
        </g>
        <circle cx={-14} cy={-18} r={8} fill={gem.sparkle} />
      </g>
    </g>
  );
};
