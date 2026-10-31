import { useId } from 'react';
import type { ThreadColors, ThreadWeb } from '@/schemas';
import { mixHex } from './color';

const hexagonPath = (radius: number, corner: number): string => {
  const corners = Array.from({ length: 6 }, (_, index) => {
    const angle = (Math.PI / 3) * index - Math.PI / 2;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  });
  return `${corners
    .map((point, index) => {
      const previous = corners[(index + 5) % 6] ?? point;
      const next = corners[(index + 1) % 6] ?? point;
      const lead = corner / radius;
      const inX = point.x + (previous.x - point.x) * lead;
      const inY = point.y + (previous.y - point.y) * lead;
      const outX = point.x + (next.x - point.x) * lead;
      const outY = point.y + (next.y - point.y) * lead;
      return `${index === 0 ? 'M' : 'L'}${inX.toFixed(2)} ${inY.toFixed(2)}Q${point.x.toFixed(2)} ${point.y.toFixed(2)} ${outX.toFixed(2)} ${outY.toFixed(2)}`;
    })
    .join('')}Z`;
};

export const EnvelopeLogo = ({ size, colors }: { size: number; colors: ThreadColors }) => {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="-60 -60 120 120"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={colors.logo} />
          <stop offset="1" stopColor={colors.logoEnd} />
        </linearGradient>
      </defs>
      <path d={hexagonPath(58, 12)} fill={`url(#${id}-fill)`} />
      <rect
        x={-27}
        y={-18}
        width={54}
        height={38}
        rx={6}
        fill="none"
        stroke={colors.logoMark}
        strokeWidth={6}
      />
      <path
        d="M-24 -14 L0 5 L24 -14"
        fill="none"
        stroke={colors.logoMark}
        strokeWidth={6}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={27} cy={-21} r={10} fill={`url(#${id}-fill)`} />
      <circle cx={27} cy={-21} r={6.5} fill={colors.accent} />
    </svg>
  );
};

export const CaughtEnvelope = ({
  x,
  y,
  angle,
  web,
}: {
  x: number;
  y: number;
  angle: number;
  web: ThreadWeb;
}) => {
  const fold = mixHex(web.envelope, web.spiderBody, 0.38);
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle.toFixed(2)})`}>
      <rect x={-42} y={-32} width={84} height={64} rx={18} fill={web.silk} opacity={0.18} />
      <rect x={-34} y={-23} width={68} height={46} rx={5} fill={web.envelope} />
      <path d="M-34 -21 L0 4 L34 -21" fill="none" stroke={fold} strokeWidth={2.6} />
      <circle cx={0} cy={4} r={5.5} fill={web.seal} />
      <g stroke={web.silk} strokeWidth={1.4} opacity={0.85} fill="none">
        <path d="M-44 -18 Q0 -4 44 -30" />
        <path d="M-44 2 Q0 14 44 -8" />
        <path d="M-44 24 Q2 30 44 12" />
        <path d="M-30 -34 Q-6 0 -22 34" />
        <path d="M26 -34 Q10 2 30 34" />
      </g>
    </g>
  );
};
