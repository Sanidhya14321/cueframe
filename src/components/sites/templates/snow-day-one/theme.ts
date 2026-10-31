import type { CSSProperties } from 'react';
import type { SnowDayOneContent } from '@/sites/templates/birthdays/snow-day-one';
import { BODY, FONT_VARIABLES } from './fonts';

const mix = (color: string, other: string, amount: number): string =>
  `color-mix(in oklab, ${color} ${amount}%, ${other})`;

type ThemeStyle = CSSProperties & Record<`--sd-${string}`, string>;

export const snowDayOneScope = ({ colors }: SnowDayOneContent) => {
  const style: ThemeStyle = {
    '--sd-primary': colors.primary,
    '--sd-secondary': colors.secondary,
    '--sd-accent': colors.accent,
    '--sd-highlight': colors.highlight,
    '--sd-bg': colors.background,
    '--sd-text': colors.text,
    '--sd-primary-deep': mix(colors.primary, colors.text, 55),
    '--sd-primary-soft': mix(colors.primary, colors.secondary, 55),
    '--sd-frost': mix(colors.secondary, colors.background, 45),
    '--sd-ice': mix(colors.secondary, 'white', 30),
    '--sd-muted': mix(colors.text, colors.background, 68),
    '--sd-accent-deep': mix(colors.accent, colors.text, 72),
    '--sd-accent-soft': mix(colors.accent, colors.background, 22),
    '--sd-highlight-ink': mix(colors.highlight, colors.text, 25),
  };
  return { className: `${FONT_VARIABLES} ${BODY}`, style };
};
