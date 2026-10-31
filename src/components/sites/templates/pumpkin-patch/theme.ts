import type { CSSProperties } from 'react';
import type { PumpkinPatchContent } from '@/sites/templates/baby-showers/pumpkin-patch';
import { FONT_VARIABLES } from './fonts';

const mix = (color: string, other: string, amount: number): string =>
  `color-mix(in oklab, ${color} ${amount}%, ${other})`;

type ThemeStyle = CSSProperties & { [property: `--pp-${string}`]: string };

export const pumpkinPatchScope = ({ colors }: PumpkinPatchContent) => {
  const style: ThemeStyle = {
    '--pp-primary': colors.primary,
    '--pp-secondary': colors.secondary,
    '--pp-accent': colors.accent,
    '--pp-bg': colors.background,
    '--pp-text': colors.text,
    '--pp-card': mix(colors.background, 'white', 55),
    '--pp-oat': mix(colors.background, colors.text, 90),
    '--pp-oat-deep': mix(colors.background, colors.text, 78),
    '--pp-kraft': mix(colors.primary, colors.background, 38),
    '--pp-kraft-deep': mix(colors.primary, colors.text, 55),
    '--pp-muted': mix(colors.text, colors.background, 72),
    '--pp-primary-deep': mix(colors.primary, 'black', 72),
    '--pp-primary-soft': mix(colors.primary, colors.background, 22),
    '--pp-sage-deep': mix(colors.secondary, 'black', 62),
    '--pp-sage-soft': mix(colors.secondary, colors.background, 24),
    '--pp-accent-deep': mix(colors.accent, 'black', 68),
    '--pp-accent-soft': mix(colors.accent, colors.background, 30),
    '--pp-stem': mix(colors.secondary, colors.text, 45),
    '--pp-night': mix(colors.text, 'black', 82),
  };
  return { className: FONT_VARIABLES, style };
};
