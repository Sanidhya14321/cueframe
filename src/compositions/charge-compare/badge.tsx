import type { CSSProperties } from 'react';
import { useId } from 'react';
import type { ChargeCompareProps } from '@/schemas';
import { CHARGE_FONTS } from './fonts';

type BadgeProps = {
  look: ChargeCompareProps['look'];
  copy: ChargeCompareProps['copy'];
  size: number;
  style: CSSProperties;
};

const VIEW = 200;
const BOLT = 'M 104 26 L 91 45 L 99.5 45 L 95 61 L 109 40 L 100.5 40 Z';

export const Badge = ({ look, copy, size, style }: BadgeProps) => {
  const id = useId().replace(/:/g, '');
  const ring = `url(#${id}-ring)`;
  const nameLength = Math.max(1, copy.brand.length + copy.brandAccent.length);
  const nameSize = Math.min(26, 250 / nameLength);
  const monogramSize = Math.min(70, 150 / Math.max(1, Array.from(copy.monogram).length));
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      style={{ position: 'absolute', overflow: 'visible', ...style }}
      role="presentation"
    >
      <defs>
        <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={look.ringLight} />
          <stop offset="0.45" stopColor={look.ring} />
          <stop offset="1" stopColor={look.ringDeep} />
        </linearGradient>
      </defs>
      <rect
        x={5}
        y={5}
        width={190}
        height={190}
        rx={54}
        fill={look.badgeFill}
        stroke={ring}
        strokeWidth={3}
      />
      <rect
        x={15}
        y={15}
        width={170}
        height={170}
        rx={44}
        fill="none"
        stroke={ring}
        strokeWidth={1}
        opacity={0.35}
      />
      <path d={BOLT} fill={ring} />
      <text
        x={100}
        y={112}
        textAnchor="middle"
        fontFamily={CHARGE_FONTS.display}
        fontWeight={700}
        fontSize={monogramSize}
        letterSpacing={-2}
        fill={ring}
      >
        {copy.monogram}
      </text>
      <text
        x={100}
        y={142}
        textAnchor="middle"
        fontFamily={CHARGE_FONTS.display}
        fontWeight={600}
        fontSize={nameSize}
        letterSpacing={-0.4}
      >
        <tspan fill={look.brandInk}>{copy.brand}</tspan>
        <tspan fill={ring}>{copy.brandAccent}</tspan>
      </text>
      <text
        x={100}
        y={158}
        textAnchor="middle"
        fontFamily={CHARGE_FONTS.display}
        fontWeight={500}
        fontSize={5.6}
        letterSpacing={1.1}
        fill={look.brandInk}
        opacity={0.8}
      >
        {copy.badgeLine}
      </text>
      <rect x={88} y={168} width={24} height={2.4} rx={1.2} fill={ring} />
    </svg>
  );
};
