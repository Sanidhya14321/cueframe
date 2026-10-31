import { AbsoluteFill } from 'remotion';
import { clamp01, progress } from './beat';
import { headlineStyle, type TeaserType } from './zoom-word';

const BLUR_FRAMES = 18;
const MAX_BLUR = 16;

export const UrlReveal = ({
  frame,
  text,
  start,
  charFrames,
  fadeStart,
  fadeEnd,
  type,
  color,
}: {
  frame: number;
  text: string;
  start: number;
  charFrames: number;
  fadeStart: number;
  fadeEnd: number;
  type: TeaserType;
  color: string;
}) => {
  if (frame < start || frame >= fadeEnd) {
    return null;
  }
  const chars = Array.from(text);
  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1 - progress(frame, fadeStart, fadeEnd),
      }}
    >
      <div style={{ ...headlineStyle(type), color }}>
        {chars.map((char, index) => {
          const shown = clamp01((frame - start - index * charFrames) / BLUR_FRAMES);
          const eased = 1 - (1 - shown) ** 2;
          return (
            <span
              key={`${index}:${char}`}
              style={{
                display: 'inline-block',
                opacity: eased,
                filter: eased < 1 ? `blur(${((1 - eased) * MAX_BLUR).toFixed(2)}px)` : undefined,
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
