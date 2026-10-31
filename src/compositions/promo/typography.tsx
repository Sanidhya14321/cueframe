import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import { bodyFont, displayFont } from './fonts';
import { accelerate, pixelTween, settle, smooth, tween } from './timing';
import { normalize, wordsOf } from './words';

interface RevealWindow {
  start: number;
  end?: number | undefined;
}

const revealState = (
  frame: number,
  { start, end }: RevealWindow,
  delay: number,
  [rise, sink]: [number, number],
  duration = 32,
) => {
  const enterRange: [number, number] = [start + delay, start + delay + duration];
  const exitRange: [number, number] | undefined =
    end === undefined ? undefined : [end + delay * 0.4, end + delay * 0.4 + 14];
  const enter = tween(frame, enterRange, [0, 1], settle);
  const exit = exitRange === undefined ? 0 : tween(frame, exitRange, [0, 1], smooth);
  const offset =
    pixelTween(frame, enterRange, [rise, 0], settle) -
    (exitRange === undefined ? 0 : pixelTween(frame, exitRange, [0, sink], accelerate));
  return { enter, exit, offset };
};

export interface HeadlineProps extends RevealWindow {
  text: string;
  size: number;
  color: string;
  accent: string;
  highlight?: string;
  align?: 'left' | 'center' | 'right';
  weight?: number;
  leadWeight?: number;
  stagger?: number;
  duration?: number;
  family?: string;
  tracking?: number;
}

export const Headline = ({
  text,
  size,
  color,
  accent,
  highlight = '',
  align = 'left',
  weight = 600,
  leadWeight = weight,
  stagger = 5,
  duration = 32,
  family = displayFont,
  tracking = -0.045,
  start,
  end,
}: HeadlineProps) => {
  const frame = useCurrentFrame();
  const accented = new Set(wordsOf(highlight).map(normalize));
  return (
    <div
      style={{
        fontFamily: family,
        fontSize: size,
        lineHeight: 1.02,
        letterSpacing: `${tracking}em`,
        color,
        textAlign: align,
      }}
    >
      {text.split('\n').map((line, lineIndex) => {
        const { enter, exit, offset } = revealState(
          frame,
          { start, end },
          lineIndex * stagger,
          [0.45 * size, 0.2 * size],
          duration,
        );
        return (
          <div
            key={`${lineIndex}:${line}`}
            style={{ fontWeight: lineIndex === 0 ? leadWeight : weight }}
          >
            <div
              style={{
                transform: `translateY(${offset}px)`,
                opacity: enter * (1 - exit),
              }}
            >
              {wordsOf(line).map((word, wordIndex, all) => (
                <span
                  key={`${wordIndex}:${word}`}
                  style={{ color: accented.has(normalize(word)) ? accent : undefined }}
                >
                  {word}
                  {wordIndex < all.length - 1 ? ' ' : ''}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export interface FadeInProps extends RevealWindow {
  children: ReactNode;
  delay?: number;
  distance?: number;
  style?: CSSProperties;
}

export const FadeIn = ({ children, start, end, delay = 0, distance = 18, style }: FadeInProps) => {
  const frame = useCurrentFrame();
  const { enter, exit, offset } = revealState(frame, { start, end }, delay, [
    distance,
    distance * 0.6,
  ]);
  return (
    <div
      style={{
        opacity: enter * (1 - exit),
        transform: `translateY(${offset}px)`,
        filter: `blur(${(1 - enter) * 4}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const BodyCopy = ({
  text,
  color,
  size = 28,
  width = 560,
  align = 'left',
}: {
  text: string;
  color: string;
  size?: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
}) => (
  <div
    style={{
      fontFamily: bodyFont,
      fontSize: size,
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '-0.005em',
      color,
      width,
      textAlign: align,
    }}
  >
    {text}
  </div>
);
