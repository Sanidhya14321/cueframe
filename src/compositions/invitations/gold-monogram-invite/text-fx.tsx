import type { CSSProperties } from 'react';
import { settle, smooth, tween } from '../../promo/timing';
import { Embossed, type Gold } from './gold';

export type TextStyle = {
  fontFamily: string;
  fontSize: number;
  letterSpacing?: string;
  fontWeight?: number;
  uppercase?: boolean;
};

const WORD_IN = 28;

const wordLevels = (frame: number, start: number, out: [number, number]) => {
  const sharpIn = tween(frame, [start + 8, start + 8 + WORD_IN], [0, 1], settle);
  const hazeIn = tween(frame, [start, start + 14], [0, 1], smooth);
  const leaving = tween(frame, out, [0, 1], smooth);
  const fading = tween(frame, [out[0] + (out[1] - out[0]) * 0.35, out[1]], [0, 1], smooth);
  const sharp = sharpIn * (1 - leaving);
  const haze = Math.max(0, Math.min(hazeIn - sharpIn, 1) + leaving * sharpIn) * (1 - fading);
  return { sharp, haze: Math.min(1, haze) };
};

export const RevealText = ({
  text,
  x,
  y,
  anchor = 'middle',
  style,
  color,
  gold,
  depth = 0,
  frame,
  start,
  stagger,
  out,
  blurId,
}: {
  text: string;
  x: number;
  y: number;
  anchor?: 'start' | 'middle' | 'end';
  style: TextStyle;
  color: string;
  gold?: Gold | undefined;
  depth?: number;
  frame: number;
  start: number;
  stagger: number;
  out: [number, number];
  blurId: string;
}) => {
  const words = text.split(/\s+/).filter((word) => word.length > 0);
  const levels = words.map((_, index) => wordLevels(frame, start + index * stagger, out));
  if (levels.every((level) => level.sharp <= 0.001 && level.haze <= 0.001)) {
    return null;
  }
  const css: CSSProperties = {
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    letterSpacing: style.letterSpacing,
    fontWeight: style.fontWeight,
    textTransform: style.uppercase ? 'uppercase' : undefined,
    textRendering: 'geometricPrecision',
  };
  const line = (fill: string, pick: 'sharp' | 'haze') => (
    <text x={x} y={y} textAnchor={anchor} style={css} fill={fill}>
      {words.map((word, index) => (
        <tspan
          key={`${word}-${index.toString()}`}
          fillOpacity={(levels[index]?.[pick] ?? 0).toFixed(4)}
        >
          {index < words.length - 1 ? `${word} ` : word}
        </tspan>
      ))}
    </text>
  );
  return (
    <>
      <g filter={`url(#${blurId})`}>{line(gold === undefined ? color : gold.light, 'haze')}</g>
      {gold === undefined || depth <= 0 ? (
        line(color, 'sharp')
      ) : (
        <Embossed depth={depth} gold={gold} fill={color}>
          {(fill) => line(fill, 'sharp')}
        </Embossed>
      )}
    </>
  );
};

export const BlurFilter = ({ id, radius }: { id: string; radius: number }) => (
  <filter id={id} x="-30%" y="-80%" width="160%" height="260%">
    <feGaussianBlur stdDeviation={radius} />
  </filter>
);
