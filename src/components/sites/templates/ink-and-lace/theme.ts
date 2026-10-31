import type { CSSProperties } from 'react';
import type { InkAndLaceContent } from '@/sites/templates/weddings/ink-and-lace';
import { FONT_VARIABLES } from './fonts';

const mix = (color: string, other: string, amount: number): string =>
  `color-mix(in oklab, ${color} ${amount}%, ${other})`;

export const inkAndLaceScope = ({ colors, photos }: InkAndLaceContent) => ({
  className: FONT_VARIABLES,
  style: {
    '--il-ink': colors.primary,
    '--il-accent': colors.accent,
    '--il-paper': colors.background,
    '--il-text': colors.text,
    '--il-muted': mix(colors.text, colors.background, 64),
    '--il-rule': mix(colors.text, colors.background, 24),
    '--il-paper-deep': mix(colors.background, colors.text, 93),
    '--il-on-ink-muted': mix(colors.background, colors.primary, 62),
    '--il-accent-on-ink': mix(colors.accent, colors.background, 42),
    '--il-photo-filter': photos.blackAndWhite ? 'grayscale(1) contrast(1.06)' : 'none',
  } as CSSProperties,
});
