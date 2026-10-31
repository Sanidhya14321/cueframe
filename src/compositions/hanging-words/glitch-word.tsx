import type { CSSProperties } from 'react';

const unit = (value: number): number => Math.min(1, Math.max(0, value));

const letterReveal = (index: number, progress: number): CSSProperties => {
  const mode = index % 3;
  if (progress >= 1) {
    return {};
  }
  if (progress <= 0) {
    return { opacity: 0 };
  }
  if (mode === 1) {
    const local = unit((progress - 0.2) / 0.8);
    return { opacity: local * (2 - local) };
  }
  if (mode === 0) {
    const local = unit((progress - 0.08) / 0.32);
    return {
      opacity: 0.55 + 0.45 * local,
      clipPath: `inset(0 0 0 ${((1 - local) * 100).toFixed(1)}%)`,
    };
  }
  const local = unit(progress / 0.3);
  return {
    clipPath: `inset(0 0 ${((1 - local) * 100).toFixed(1)}% ${((1 - local) * 70).toFixed(1)}%)`,
  };
};

const letterExit = (index: number, progress: number): CSSProperties => {
  if (progress <= 0) {
    return {};
  }
  if (progress >= 1) {
    return { opacity: 0 };
  }
  const cut = progress * (0.75 + (index % 2) * 0.15);
  return {
    clipPath: `inset(${(cut * 100).toFixed(1)}% 0 0 0)`,
    transform: `translateY(${(progress * 14).toFixed(1)}%)`,
  };
};

export const GlitchWord = ({
  word,
  reveal,
  exit,
}: {
  word: string;
  reveal: number;
  exit: number;
}) => (
  <>
    {Array.from(word).map((letter, index) => (
      <span
        key={`${index}:${letter}`}
        style={{
          display: 'inline-block',
          whiteSpace: 'pre',
          ...letterReveal(index, reveal),
          ...letterExit(index, exit),
        }}
      >
        {letter}
      </span>
    ))}
  </>
);
