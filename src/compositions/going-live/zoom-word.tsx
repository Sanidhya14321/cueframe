import type { CSSProperties } from 'react';
import { AbsoluteFill } from 'remotion';
import { progress } from './beat';
import { teaserFont } from './fonts';

export type TeaserType = {
  size: number;
  weight: number;
  tracking: number;
};

export const headlineStyle = ({ size, weight, tracking }: TeaserType): CSSProperties => ({
  fontFamily: teaserFont,
  fontWeight: weight,
  fontSize: size,
  letterSpacing: `${tracking}em`,
  lineHeight: 1,
  whiteSpace: 'pre',
  textAlign: 'center',
});

const AccentLine = ({
  text,
  accentWord,
  ink,
  accent,
}: {
  text: string;
  accentWord: string;
  ink: string;
  accent: string;
}) => {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, index) => (
        <span key={`${index}:${word}`} style={{ color: word === accentWord ? accent : ink }}>
          {index < words.length - 1 ? `${word} ` : word}
        </span>
      ))}
    </>
  );
};

const zoomScale = (
  frame: number,
  start: number,
  land: number,
  fromScale: number,
  curve: number,
): number => 1 + (fromScale - 1) * (1 - progress(frame, start, land)) ** curve;

export const ZoomWord = ({
  frame,
  text,
  accentWord,
  ink,
  accent,
  type,
  start,
  land,
  fromScale,
  originX,
  originY,
  curve,
  opacity,
}: {
  frame: number;
  text: string;
  accentWord: string;
  ink: string;
  accent: string;
  type: TeaserType;
  start: number;
  land: number;
  fromScale: number;
  originX: number;
  originY: number;
  curve: number;
  opacity: number;
}) => {
  if (frame < start || opacity <= 0) {
    return null;
  }
  const scale = zoomScale(frame, start, land, fromScale, curve);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity }}>
      <div
        style={{
          ...headlineStyle(type),
          transformOrigin: `${(originX * 100).toFixed(2)}% ${(originY * 100).toFixed(2)}%`,
          transform: scale > 1.0001 ? `scale(${scale.toFixed(4)})` : undefined,
        }}
      >
        <AccentLine text={text} accentWord={accentWord} ink={ink} accent={accent} />
      </div>
    </AbsoluteFill>
  );
};

export const PlainWord = ({
  text,
  color,
  type,
  opacity = 1,
}: {
  text: string;
  color: string;
  type: TeaserType;
  opacity?: number;
}) => (
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity }}>
    <div style={{ ...headlineStyle(type), color }}>{text}</div>
  </AbsoluteFill>
);
