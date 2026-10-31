import type { MailinfraDewStepsProps } from '@/schemas';
import { displayFont } from '../promo/fonts';
import { StepGlyph } from './glyphs';
import { depthShade, EASED_STOPS, lighten, mix, sparklePath } from './paint';

type Step = MailinfraDewStepsProps['steps'][number];

const dropOutline = (radius: number, neck: number): string => {
  const center = neck + radius;
  const points: string[] = [];
  const count = 120;
  for (let index = 0; index < count; index++) {
    const angle = (index / count) * Math.PI * 2;
    const wrapped = angle > Math.PI ? angle - Math.PI * 2 : angle;
    const pinch = Math.exp(-((wrapped / 0.55) ** 2));
    const fall = ((1 - Math.cos(angle)) / 2) ** 2 * radius * 0.06;
    const x = radius * Math.sin(angle) * (1 - pinch);
    const y = (center - radius * Math.cos(angle) + fall) * (1 - pinch);
    points.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return `M ${points.join(' L ')} Z`;
};

export type NumberLook = {
  label: string;
  icon: Step['icon'];
  iconReveal: number;
  sweep: number;
};

const GoldNumber = ({
  id,
  look,
  number,
  radius,
}: {
  id: string;
  look: NumberLook;
  number: MailinfraDewStepsProps['number'];
  radius: number;
}) => {
  const size = radius * number.size;
  const deep = depthShade(number.gold);
  const half = size * 0.36;
  const depth = Math.round(number.depth * (radius / 190));
  const text = {
    fontFamily: displayFont,
    fontWeight: 700,
    fontSize: size,
    textAnchor: 'middle' as const,
    letterSpacing: '-0.03em',
    style: { fontVariantNumeric: 'tabular-nums' },
    textRendering: 'geometricPrecision' as const,
  };
  const layers = Array.from({ length: depth }, (_, index) => depth - index);
  const sweepX = -size * 1.3 + look.sweep * size * 2.6;
  return (
    <g>
      <defs>
        <linearGradient
          id={`${id}-face`}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={-half}
          x2="0"
          y2={half}
        >
          <stop offset="0" stopColor={lighten(number.gold, 0.6)} />
          <stop offset="0.42" stopColor={number.gold} />
          <stop offset="0.56" stopColor={mix(number.gold, deep, 0.18)} />
          <stop offset="1" stopColor={mix(number.gold, deep, 0.38)} />
        </linearGradient>
        <linearGradient
          id={`${id}-sweep`}
          gradientUnits="userSpaceOnUse"
          x1={sweepX - size * 0.32}
          y1={-half}
          x2={sweepX + size * 0.32}
          y2={half}
        >
          <stop offset="0" stopColor="#ffffff" stopOpacity={0} />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity={0.85} />
          <stop offset="1" stopColor="#ffffff" stopOpacity={0} />
        </linearGradient>
      </defs>
      {layers.map((layer) => (
        <text
          key={layer}
          {...text}
          x={layer * 0.42}
          y={half + layer * 0.9}
          fill={mix(deep, number.gold, 0.2 + 0.45 * (1 - layer / Math.max(1, depth)))}
        >
          {look.label}
        </text>
      ))}
      <text
        {...text}
        x={0}
        y={half}
        fill={`url(#${id}-face)`}
        stroke={lighten(number.gold, 0.7)}
        strokeOpacity={0.55}
        strokeWidth={1.2}
      >
        {look.label}
      </text>
      {look.sweep > 0 && look.sweep < 1 ? (
        <text {...text} x={0} y={half} fill={`url(#${id}-sweep)`}>
          {look.label}
        </text>
      ) : null}
    </g>
  );
};

export const DewDrop = ({
  id,
  x,
  y,
  radius,
  angle,
  wobble,
  glint,
  props,
  look,
}: {
  id: string;
  x: number;
  y: number;
  radius: number;
  angle: number;
  wobble: number;
  glint: number;
  props: MailinfraDewStepsProps;
  look?: NumberLook;
}) => {
  const { drop, number, bokeh } = props;
  const neck = drop.neck * (radius / drop.size);
  const center = neck + radius;
  const outline = dropOutline(radius, neck);
  const deepTint = mix(drop.tint, '#07061c', 0.55);
  const clarity = drop.clarity;
  const bodyStops: [number, string, number][] = [
    [0, lighten(drop.tint, 0.45), 0.2],
    [0.5, drop.tint, 0.18],
    [0.78, deepTint, 0.42],
    [0.93, mix(drop.tint, '#ffffff', 0.2), 0.5],
    [1, lighten(drop.tint, 0.7), 0.85],
  ];
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <defs>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
          {EASED_STOPS.map((stop) => (
            <stop
              key={stop}
              offset={stop}
              stopColor={drop.tint}
              stopOpacity={(1 - stop) * 0.32 * drop.glow}
            />
          ))}
        </radialGradient>
        <radialGradient id={`${id}-body`} cx="0.52" cy="0.6" r="0.52" fx="0.56" fy="0.72">
          {bodyStops.map(([offset, color, alpha]) => (
            <stop
              key={offset}
              offset={offset}
              stopColor={color}
              stopOpacity={alpha * clarity + 0.08}
            />
          ))}
        </radialGradient>
        <radialGradient id={`${id}-pool`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={lighten(drop.tint, 0.75)} stopOpacity={0.55 * clarity} />
          <stop offset="1" stopColor={lighten(drop.tint, 0.75)} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={drop.shine} stopOpacity={0.9} />
          <stop offset="1" stopColor={drop.shine} stopOpacity={0} />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d={outline} />
        </clipPath>
        <filter id={`${id}-soft`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={radius * 0.05} />
        </filter>
      </defs>
      <circle cx={0} cy={center} r={radius * 1.7} fill={`url(#${id}-glow)`} />
      <path d={outline} fill={`url(#${id}-body)`} />
      <g clipPath={`url(#${id}-clip)`}>
        <circle
          cx={-radius * 0.35}
          cy={center + radius * 0.5}
          r={radius * 0.32}
          fill={bokeh.violet}
          fillOpacity={0.3 * clarity}
          filter={`url(#${id}-soft)`}
        />
        <circle
          cx={radius * 0.42}
          cy={center + radius * 0.3}
          r={radius * 0.22}
          fill={bokeh.blue}
          fillOpacity={0.35 * clarity}
          filter={`url(#${id}-soft)`}
        />
        <ellipse
          cx={radius * 0.08}
          cy={center + radius * 0.66}
          rx={radius * 0.62}
          ry={radius * 0.26}
          fill={`url(#${id}-pool)`}
        />
      </g>
      {look === undefined ? null : (
        <g transform={`translate(0 ${center}) rotate(${wobble * 0.4})`}>
          <g
            transform={`translate(${wobble * radius * 0.004} ${-radius * 0.08}) scale(${drop.magnify * (1 + Math.abs(wobble) * 0.002)})`}
          >
            <GoldNumber id={id} look={look} number={number} radius={radius} />
          </g>
          <g
            transform={`translate(0 ${radius * 0.6}) scale(${0.6 + 0.4 * look.iconReveal})`}
            opacity={look.iconReveal}
          >
            <StepGlyph icon={look.icon} size={radius * 0.24} color={number.iconColor} />
          </g>
        </g>
      )}
      <path
        d={outline}
        fill="none"
        stroke={lighten(drop.tint, 0.7)}
        strokeOpacity={0.55}
        strokeWidth={1.6}
      />
      <ellipse
        cx={-radius * 0.36}
        cy={center - radius * 0.5}
        rx={radius * 0.3}
        ry={radius * 0.13}
        transform={`rotate(-34 ${-radius * 0.36} ${center - radius * 0.5})`}
        fill={`url(#${id}-shine)`}
        filter={`url(#${id}-soft)`}
      />
      <path
        d={`M ${radius * 0.93 * Math.sin(2.0)} ${center - radius * 0.93 * Math.cos(2.0)} A ${radius * 0.93} ${radius * 0.93} 0 0 1 ${radius * 0.93 * Math.sin(2.75)} ${center - radius * 0.93 * Math.cos(2.75)}`}
        fill="none"
        stroke={drop.shine}
        strokeOpacity={0.45}
        strokeWidth={radius * 0.025}
        strokeLinecap="round"
      />
      {glint > 0.01 ? (
        <g
          transform={`translate(${-radius * 0.5} ${center - radius * 0.42}) rotate(${glint * 40})`}
        >
          <path
            d={sparklePath(radius * (0.1 + glint * 0.2))}
            fill={drop.shine}
            fillOpacity={glint}
          />
          <circle r={radius * 0.07 * glint} fill={drop.shine} fillOpacity={glint * 0.6} />
        </g>
      ) : null}
    </g>
  );
};
