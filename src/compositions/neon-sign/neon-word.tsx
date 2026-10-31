import type { CSSProperties } from 'react';
import type { NeonSignFlickerProps } from '@/schemas';
import { neonFont } from './fonts';

type Neon = NeonSignFlickerProps['neon'];

const layer: CSSProperties = { position: 'absolute', left: 0, top: 0 };

const NeonLetter = ({ char, level, neon }: { char: string; level: number; neon: Neon }) => {
  const lit = Math.min(1, Math.max(0, level));
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ visibility: 'hidden' }}>{char}</span>
      <span
        style={{
          ...layer,
          color: neon.haze,
          WebkitTextStroke: `${neon.glowWidth * 3}px ${neon.haze}`,
          filter: `blur(${neon.hazeBlur}px)`,
          opacity: neon.hazeStrength * lit,
        }}
      >
        {char}
      </span>
      <span
        style={{
          ...layer,
          color: neon.deadHighlight,
          transform: 'translate(-1.5px, -2px)',
          opacity: 1 - lit,
        }}
      >
        {char}
      </span>
      <span
        style={{
          ...layer,
          color: neon.deadTube,
          filter: 'drop-shadow(0 8px 6px rgba(0,0,0,0.85))',
          opacity: 1 - lit,
        }}
      >
        {char}
      </span>
      <span
        style={{
          ...layer,
          color: neon.glow,
          WebkitTextStroke: `${neon.glowWidth}px ${neon.glow}`,
          filter: `blur(${neon.glowBlur}px)`,
          opacity: lit,
        }}
      >
        {char}
      </span>
      <span
        style={{
          ...layer,
          color: neon.glow,
          WebkitTextStroke: `${neon.tubeWidth * 0.3}px ${neon.glow}`,
          opacity: lit,
        }}
      >
        {char}
      </span>
      <span
        style={{
          ...layer,
          color: neon.core,
          WebkitTextStroke: `${neon.tubeWidth}px ${neon.glow}`,
          filter: `blur(${(neon.tubeWidth * 0.14).toFixed(2)}px)`,
          opacity: lit,
        }}
      >
        {char}
      </span>
    </span>
  );
};

export const NeonWord = ({
  word,
  neon,
  levels,
}: {
  word: string;
  neon: Neon;
  levels: readonly number[];
}) => (
  <div
    style={{
      position: 'absolute',
      top: neon.top,
      left: neon.centerX,
      transform: 'translateX(-50%)',
      whiteSpace: 'nowrap',
      fontFamily: neonFont,
      fontWeight: 400,
      fontSize: neon.size,
      lineHeight: 1,
      letterSpacing: `${neon.tracking}em`,
    }}
  >
    {Array.from(word).map((char, index) => (
      <NeonLetter key={`${index}:${char}`} char={char} level={levels[index] ?? 1} neon={neon} />
    ))}
  </div>
);
