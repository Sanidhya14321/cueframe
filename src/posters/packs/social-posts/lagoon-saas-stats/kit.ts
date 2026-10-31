import type { Fill } from '@/design';
import { circle, type Nodes, rect, shadow, star, text } from '../../../kit';
import { POST, type PostTheme } from './theme';

export const W = POST.width;

export const fontsOf = (theme: PostTheme) =>
  ({
    heading: { label: 'Heading font', value: theme.headFont },
    body: { label: 'Body font', value: theme.bodyFont },
  }) as const;

export interface Fonts {
  heading: string;
  body: string;
}

export const head = (fonts: Fonts, size: number, fill: string) => ({
  fontFamily: fonts.heading,
  fontSize: size,
  fontWeight: 800,
  fill,
  lineHeight: 1.1,
});

export const copyText = (fonts: Fonts, size: number, fill: string, weight = 400) => ({
  fontFamily: fonts.body,
  fontSize: size,
  fontWeight: weight,
  fill,
  lineHeight: 1.35,
});

export const backdrop = (fill: Fill, height: number) =>
  rect(0, 0, W, height, fill, { name: 'Background' });

export const disc = (
  fonts: Fonts,
  colors: { fill: string; label: string },
  cx: number,
  cy: number,
  radius: number,
  value: string,
  label: string,
): Nodes[] => [
  circle(cx, cy, radius, colors.fill, {
    name: 'Stat disc',
    ...shadow(40, 16, 'rgba(0,0,0,0.25)'),
  }),
  text(value, cx - radius, cy - 62, radius * 2, {
    ...head(fonts, 84, colors.label),
    align: 'center',
    lineHeight: 1,
  }),
  text(label, cx - radius, cy + 36, radius * 2, {
    ...copyText(fonts, 26, colors.label, 500),
    align: 'center',
  }),
];

export const starStat = (
  fonts: Fonts,
  x: number,
  y: number,
  size: number,
  value: string,
  colors: { fill: string; label: string },
) => [
  star(5, x, y, size, colors.fill, { innerRatio: 0.48, name: 'Stat star' }),
  text(value, x, y + size * 0.47, size, {
    ...head(fonts, size * 0.15, colors.label),
    align: 'center',
    lineHeight: 1,
  }),
];
