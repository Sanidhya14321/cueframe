import type { CSSProperties } from 'react';
import type { MidnightCrownContent } from '@/sites/templates/quinceaneras/midnight-crown';
import { FONT_VARIABLES } from './fonts';

const mix = (color: string, other: string, amount: number): string =>
  `color-mix(in oklab, ${color} ${amount}%, ${other})`;

export const midnightCrownScope = ({ colors }: MidnightCrownContent) => {
  const light = mix(colors.primary, 'white', 45);
  const deep = mix(colors.primary, 'black', 55);
  return {
    className: FONT_VARIABLES,
    style: {
      '--mc-gold': colors.primary,
      '--mc-blush': colors.secondary,
      '--mc-bg': colors.background,
      '--mc-surface': colors.surface,
      '--mc-text': colors.text,
      '--mc-gold-light': light,
      '--mc-gold-deep': deep,
      '--mc-muted': mix(colors.text, colors.background, 68),
      '--mc-surface-deep': mix(colors.surface, colors.background, 45),
      '--mc-glow': mix(colors.secondary, colors.primary, 50),
      '--mc-foil': `linear-gradient(115deg, ${deep} 0%, ${colors.primary} 18%, ${light} 34%, ${colors.primary} 50%, ${deep} 66%, ${colors.primary} 82%, ${light} 100%)`,
    } as CSSProperties,
  };
};
