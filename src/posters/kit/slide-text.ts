import { text } from './elements';
import type { SlideTheme } from './template';

export const heading = (
  theme: SlideTheme,
  content: string,
  x: number,
  y: number,
  width: number,
  size = 72,
  align: 'left' | 'center' = 'left',
) =>
  text(content, x, y, width, {
    fontFamily: theme.headFont,
    fontSize: size,
    fontWeight: 700,
    fill: theme.text,
    align,
    lineHeight: 1.12,
  });

export const body = (
  theme: SlideTheme,
  content: string,
  x: number,
  y: number,
  width: number,
  size = 30,
  align: 'left' | 'center' = 'left',
) =>
  text(content, x, y, width, {
    fontFamily: theme.bodyFont,
    fontSize: size,
    fontWeight: 400,
    fill: theme.muted,
    align,
    lineHeight: 1.45,
  });
