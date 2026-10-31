import type { ChargeCompareProps } from '@/schemas';
import { CHARGE_FONTS } from './fonts';
import { ramp } from './motion';

type EndCardProps = Pick<ChargeCompareProps, 'look' | 'copy' | 'layout' | 'timing'> & {
  frame: number;
};

const shimmer = (frame: number, start: number, frames: number): number => {
  const progress = (frame - start) / frames;
  if (progress <= 0 || progress >= 1) {
    return 0;
  }
  return Math.sin(progress * Math.PI);
};

export const EndCard = ({ look, copy, layout, timing, frame }: EndCardProps) => {
  const pop = timing.popFrames;
  const letters = Array.from(copy.wordmark);
  const urlCharacters = Array.from(copy.url);
  const lines = copy.tagline.split('\n');
  const lineHeight = layout.taglineSize * 1.72;
  const taglineTop = layout.taglineY - (lines.length * lineHeight) / 2;
  const buttonSize = Math.max(
    0,
    layout.pillHeight - layout.pillBorder * 2 - layout.pillHeight * 0.2,
  );
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: layout.wordmarkX - 540,
          width: 1080,
          top: layout.wordmarkY - layout.wordmarkSize * 0.62,
          textAlign: 'center',
          fontFamily: CHARGE_FONTS.wordmark,
          fontWeight: 300,
          fontSize: layout.wordmarkSize,
          lineHeight: 1.2,
          color: look.wordmarkInk,
          opacity: ramp(frame, timing.wordmarkAt, pop),
          whiteSpace: 'pre',
        }}
      >
        {letters.map((letter, index) => {
          const haze = shimmer(
            frame,
            timing.shimmerStart + index * timing.shimmerStagger,
            timing.shimmerFrames,
          );
          return (
            <span
              key={`${letter}-${index.toString()}`}
              style={{
                display: 'inline-block',
                filter: haze > 0 ? `blur(${(haze * timing.shimmerBlur).toFixed(2)}px)` : undefined,
                opacity: 1 - haze * 0.45,
              }}
            >
              {letter}
            </span>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          left: layout.taglineX - 540,
          width: 1080,
          top: taglineTop,
          textAlign: 'center',
          fontFamily: CHARGE_FONTS.mono,
          fontSize: layout.taglineSize,
          lineHeight: `${lineHeight}px`,
          letterSpacing: `${layout.taglineSpacing}em`,
          paddingLeft: `${layout.taglineSpacing}em`,
          color: look.taglineInk,
          opacity: ramp(frame, timing.taglineAt, pop),
          whiteSpace: 'pre',
        }}
      >
        {lines.map((line, index) => (
          <div key={`${line}-${index.toString()}`}>{line}</div>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: layout.pillX - layout.pillWidth / 2,
          top: layout.pillY - layout.pillHeight / 2,
          width: layout.pillWidth,
          height: layout.pillHeight,
          borderRadius: layout.pillHeight / 2,
          background: look.pillFill,
          border: `${layout.pillBorder}px solid ${look.pillEdge}`,
          opacity: ramp(frame, timing.pillAt, pop),
          display: 'flex',
          alignItems: 'center',
          paddingLeft: layout.pillHeight * 0.48,
          paddingRight: layout.pillHeight * 0.14,
          boxSizing: 'border-box',
          overflow: 'hidden',
          fontFamily: CHARGE_FONTS.display,
          fontWeight: 500,
          fontSize: layout.urlSize,
          color: look.pillInk,
          whiteSpace: 'pre',
        }}
      >
        {urlCharacters.map((character, index) => (
          <span
            key={`${character}-${index.toString()}`}
            style={{
              opacity: ramp(
                frame,
                timing.pillAt + timing.typeDelay + index * timing.typeFrames,
                timing.typeFrames * 1.5,
              ),
            }}
          >
            {character}
          </span>
        ))}
        <svg
          width={buttonSize}
          height={buttonSize}
          viewBox="0 0 40 40"
          style={{ marginLeft: 'auto', flexShrink: 0 }}
          role="presentation"
        >
          <circle cx={20} cy={20} r={20} fill={look.pillEdge} />
          <path
            d="M 13 20 H 26 M 20.5 14 L 26.5 20 L 20.5 26"
            fill="none"
            stroke={look.pillFill}
            strokeWidth={3.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
};
