import { AbsoluteFill } from 'remotion';
import type { GoingLiveTeaserProps } from '@/schemas';
import { hash, splitLines } from './beat';
import { headlineStyle, type TeaserType } from './zoom-word';

const scanMask = (period: number): string =>
  `repeating-linear-gradient(0deg, #000 0px, #000 ${period / 2}px, transparent ${period / 2}px, transparent ${period}px)`;

export const GlitchText = ({
  frame,
  text,
  start,
  end,
  type,
  lineHeight,
  glitch,
  accent,
}: {
  frame: number;
  text: string;
  start: number;
  end: number;
  type: TeaserType;
  lineHeight: number;
  glitch: GoingLiveTeaserProps['glitch'];
  accent: string;
}) => {
  if (frame < start || frame >= end) {
    return null;
  }
  const step = Math.floor((frame - start) / glitch.stepFrames);
  const palette = [glitch.colorA, glitch.colorB, glitch.colorC, accent];
  const lines = splitLines(text);
  const dropout = hash(step * 3.1 + 0.4) < 0.18;
  const mask = scanMask(glitch.scanlines);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ ...headlineStyle(type), lineHeight, position: 'relative' }}>
        {lines.map((line, index) => {
          const seed = step * 7.3 + index * 1.9;
          const color = palette[Math.floor(hash(seed) * palette.length)] ?? accent;
          const shift = (hash(seed + 0.7) - 0.5) * 2 * glitch.slice;
          const cut = 20 + hash(seed + 2.2) * 50;
          const level = glitch.opacity * (0.45 + 0.55 * hash(seed + 5.5));
          return (
            <div
              key={`${index}:${line}`}
              style={{
                position: 'relative',
                color,
                opacity: dropout ? level * 0.2 : level,
                maskImage: mask,
                WebkitMaskImage: mask,
              }}
            >
              <div style={{ clipPath: `inset(0 0 ${100 - cut}% 0)` }}>{line}</div>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  clipPath: `inset(${cut}% 0 0 0)`,
                  transform: `translateX(${Math.round(shift)}px)`,
                  color: palette[Math.floor(hash(seed + 9.1) * palette.length)] ?? color,
                }}
              >
                {line}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
