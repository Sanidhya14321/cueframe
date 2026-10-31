import type { MailinfraSpiderDropProps } from '@/schemas';
import { bodyFont, displayFont } from '../promo/fonts';
import { land, smooth, tween } from '../promo/timing';
import { tint } from './paint';

const swingAt = (since: number, swing: number): number => {
  if (since <= 0) {
    return swing;
  }
  const envelope = 1 - tween(since, [0, 64], [0, 1], smooth);
  return swing * Math.cos(since / 8.5) * Math.exp(-since / 22) * envelope;
};

export const StatTitle = ({
  props,
  t,
  start,
  gradientId,
  shadowId,
}: {
  props: MailinfraSpiderDropProps;
  t: number;
  start: number;
  gradientId: string;
  shadowId: string;
}) => {
  const { stat } = props;
  if (t < start) {
    return null;
  }
  const baseline = stat.y + stat.size * 0.78;
  const drop = land(t, [start, start + 30], [-(baseline + stat.size), 0], 2);
  const pivotY = stat.y - 360;
  const angle = swingAt(t - start, stat.swing);
  const caption = tween(t, [start + 14, start + 36], [0, 1], smooth);
  const layers = Array.from(
    { length: Math.ceil(stat.depth / 1.5) },
    (_, layer) => stat.depth - layer * 1.5,
  );
  const captionY = baseline + stat.depth + stat.captionSize * 1.5;
  return (
    <svg
      viewBox="0 0 1080 1920"
      width="100%"
      height="100%"
      style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={tint(stat.face, 0.55)} />
          <stop offset="0.5" stopColor={stat.face} />
          <stop offset="1" stopColor={tint(stat.side, 0.25)} />
        </linearGradient>
        <filter id={shadowId} x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation={18} />
        </filter>
      </defs>
      <g transform={`translate(0 ${drop.toFixed(2)}) rotate(${angle.toFixed(3)} 540 ${pivotY})`}>
        <g
          fontFamily={displayFont}
          fontWeight={700}
          fontSize={stat.size}
          letterSpacing={`${-0.04 * stat.size}px`}
          textAnchor="middle"
        >
          <text
            x={540}
            y={baseline + stat.depth + 22}
            fill="#000000"
            opacity={0.5}
            filter={`url(#${shadowId})`}
          >
            {stat.value}
          </text>
          {layers.map((offset) => (
            <text key={offset} x={540 + offset * 0.2} y={baseline + offset} fill={stat.side}>
              {stat.value}
            </text>
          ))}
          <text x={540} y={baseline} fill={`url(#${gradientId})`}>
            {stat.value}
          </text>
        </g>
        <text
          x={540}
          y={captionY}
          textAnchor="middle"
          fontFamily={bodyFont}
          fontWeight={500}
          fontSize={stat.captionSize}
          letterSpacing={`${0.01 * stat.captionSize}px`}
          fill={stat.captionColor}
          opacity={caption}
        >
          {stat.caption}
        </text>
      </g>
    </svg>
  );
};
