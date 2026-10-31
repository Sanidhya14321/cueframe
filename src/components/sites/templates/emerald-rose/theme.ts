import type { CSSProperties } from 'react';
import type { EmeraldRoseContent } from '@/sites/templates/weddings/emerald-rose';
import { FONT_VARIABLES } from './fonts';

const mix = (color: string, other: string, amount: number): string =>
  `color-mix(in oklab, ${color} ${amount}%, ${other})`;

export const emeraldRoseScope = ({ colors }: EmeraldRoseContent) => ({
  className: FONT_VARIABLES,
  style: {
    '--er-primary': colors.primary,
    '--er-secondary': colors.secondary,
    '--er-accent': colors.accent,
    '--er-bg': colors.background,
    '--er-text': colors.text,
    '--er-paper': mix(colors.background, colors.accent, 88),
    '--er-muted': mix(colors.text, colors.background, 68),
    '--er-primary-deep': mix(colors.primary, 'black', 72),
    '--er-secondary-deep': mix(colors.secondary, 'black', 70),
    '--er-blush': mix(colors.secondary, colors.background, 30),
    '--er-glow': mix(colors.background, colors.accent, 82),
  } as CSSProperties,
});
