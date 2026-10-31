import type { MailinfraDewStepsProps } from '@/schemas';
import { lighten, mix } from './paint';

const LEG_ROOTS = [-6, -2, 2, 6];
const LEG_FEET = [-42, -18, 16, 42];

export const Spider = ({
  x,
  y,
  stride,
  walking,
  spider,
  id,
}: {
  x: number;
  y: number;
  stride: number;
  walking: number;
  spider: MailinfraDewStepsProps['spider'];
  id: string;
}) => {
  const s = spider.size * 1.8;
  const limb = mix(spider.color, spider.sheen, 0.6);
  const rim = { stroke: spider.sheen, strokeOpacity: 0.9, strokeWidth: 0.9 * s };
  const bob = Math.sin(stride * 2) * 1.2 * walking;
  const legs = (far: boolean) =>
    LEG_ROOTS.map((root, index) => {
      const phase = stride + index * (Math.PI / 2) + (far ? Math.PI : 0);
      const reach = Math.sin(phase) * 7 * walking;
      const lift = Math.max(0, Math.cos(phase)) * 5 * walking;
      const footX = (LEG_FEET[index] ?? 0) + reach;
      const rootX = root;
      const rootY = -13 + bob;
      const kneeX = rootX + (footX - rootX) * 0.55 + (footX > 0 ? 3 : -3);
      const kneeY = -36 - (index === 1 || index === 2 ? 5 : 0) + bob;
      return {
        key: `${far ? 'far' : 'near'}-${root}`,
        d: `M ${rootX * s} ${rootY * s} Q ${kneeX * s} ${kneeY * s} ${footX * s} ${-lift * s}`,
      };
    });
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={lighten(spider.sheen, 0.2)} stopOpacity={0.9} />
          <stop offset="0.35" stopColor={spider.color} />
          <stop offset="1" stopColor={spider.color} />
        </linearGradient>
      </defs>
      <g fill="none" stroke={limb} strokeLinecap="round">
        {legs(true).map((leg) => (
          <path key={leg.key} d={leg.d} strokeWidth={1.8 * s} strokeOpacity={0.65} />
        ))}
      </g>
      <ellipse
        cx={-17 * s}
        cy={(-17 + bob) * s}
        rx={15 * s}
        ry={11.5 * s}
        fill={`url(#${id}-body)`}
        {...rim}
      />
      <ellipse
        cx={1 * s}
        cy={(-14 + bob) * s}
        rx={9 * s}
        ry={7 * s}
        fill={`url(#${id}-body)`}
        {...rim}
      />
      <circle cx={8 * s} cy={(-16 + bob) * s} r={1.4 * s} fill={lighten(spider.sheen, 0.6)} />
      <ellipse
        cx={-21 * s}
        cy={(-23 + bob) * s}
        rx={6 * s}
        ry={2.4 * s}
        fill={lighten(spider.sheen, 0.5)}
        fillOpacity={0.7}
      />
      <g fill="none" stroke={limb} strokeLinecap="round">
        {legs(false).map((leg) => (
          <path key={leg.key} d={leg.d} strokeWidth={2.3 * s} />
        ))}
      </g>
    </g>
  );
};
