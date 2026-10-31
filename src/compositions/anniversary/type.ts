import { loadFont as loadSpaceGrotesk } from '@remotion/google-fonts/SpaceGrotesk';
import type { CSSProperties } from 'react';
import type { AnniversaryBeat } from '@/schemas';

const spaceGrotesk = loadSpaceGrotesk('normal', {
  weights: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
});

export const anniversaryFont = spaceGrotesk.fontFamily;

export const wordStyle = (beat: AnniversaryBeat, tracking = beat.tracking): CSSProperties => ({
  fontFamily: anniversaryFont,
  fontSize: beat.size,
  fontWeight: beat.weight,
  letterSpacing: `${tracking}em`,
  lineHeight: 1,
  whiteSpace: 'pre',
  color: beat.color,
});

export const letters = (text: string): string[] => Array.from(text);

export const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export const centered: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const hash = (value: number): number => {
  const x = Math.sin(value * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
