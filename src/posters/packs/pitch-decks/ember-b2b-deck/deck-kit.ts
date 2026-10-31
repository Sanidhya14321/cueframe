import type { DesignIconName } from '@/design';
import { circle, icon, pill, rect, SLIDE_SIZE, text } from '../../../kit';

export const EMBER = {
  ink: '#0e1525',
  panel: '#1a2235',
  accent: '#ff5b2e',
  soft: '#ffe4da',
  paper: '#ffffff',
  grey: '#5d6475',
  dim: '#3a4152',
  line: '#d9dce3',
  mist: '#c9cdd6',
  peach: '#ffb199',
};

export const SW = SLIDE_SIZE.width;
export const SH = SLIDE_SIZE.height;

export const HEADING_FONT = { label: 'Heading font', value: 'Anton' } as const;
export const BODY_FONT = { label: 'Body font', value: 'Inter' } as const;

export const background = (fill: string) => rect(0, 0, SW, SH, fill, { name: 'Background' });

export const heading =
  (fontFamily: string) =>
  (
    label: string,
    x: number,
    y: number,
    size: number,
    color: string,
    width = 1700,
    align: 'left' | 'center' | 'right' = 'left',
  ) =>
    text(label, x, y, width, {
      fontFamily,
      fontSize: size,
      fontWeight: 400,
      fill: color,
      align,
      lineHeight: 1.02,
      uppercase: true,
    });

export const body =
  (fontFamily: string) =>
  (
    label: string,
    x: number,
    y: number,
    width: number,
    size: number,
    color: string,
    align: 'left' | 'center' = 'left',
  ) =>
    text(label, x, y, width, {
      fontFamily,
      fontSize: size,
      fontWeight: 400,
      fill: color,
      align,
      lineHeight: 1.45,
    });

export const strong =
  (fontFamily: string) =>
  (label: string, x: number, y: number, width: number, size: number, color: string) =>
    text(label, x, y, width, {
      fontFamily,
      fontSize: size,
      fontWeight: 800,
      fill: color,
      lineHeight: 1.2,
    });

export const tag = (
  label: string,
  x: number,
  y: number,
  fill: string,
  color: string,
  fontFamily: string,
) =>
  pill(label, x, y, {
    fill,
    color,
    fontSize: 22,
    fontFamily,
    fontWeight: 800,
    padX: 26,
    padY: 10,
    letterSpacing: 1,
    uppercase: true,
  });

export const person = (x: number, y: number, size: number, fill: string) => [
  circle(x + size / 2, y + size * 0.24, size * 0.22, fill),
  rect(x + size * 0.12, y + size * 0.52, size * 0.76, size * 0.6, fill, {
    cornerRadius: size * 0.3,
    name: 'Person body',
  }),
];

export const ratingDots = (
  x: number,
  y: number,
  filled: number,
  color: string,
  empty: string,
  clear: string,
) =>
  [0, 1, 2].map((index) =>
    circle(x + index * 40, y, 14, index < filled ? color : clear, {
      stroke: index < filled ? color : empty,
      strokeWidth: 3,
    }),
  );

export const iconBadge = (
  name: DesignIconName,
  x: number,
  y: number,
  size: number,
  fill: string,
  color: string,
) => [
  rect(x, y, size, size, fill, { cornerRadius: size * 0.24, name: 'Icon badge' }),
  icon(name, x + size * 0.2, y + size * 0.2, size * 0.6, color, { strokeWidth: 2.2 }),
];

export const wordmark = (
  label: string,
  x: number,
  y: number,
  size: number,
  colors: { text: string; mark: string; cut: string },
  fontFamily: string,
) => [
  rect(x, y + size * 0.15, size * 0.75, size * 0.75, colors.mark, {
    cornerRadius: size * 0.12,
    name: 'Logo mark',
  }),
  rect(x + size * 0.2, y + size * 0.35, size * 0.35, size * 0.35, colors.cut, {
    cornerRadius: size * 0.06,
    name: 'Logo cut',
  }),
  text(label, x + size * 0.95, y, size * 6, {
    fontFamily,
    fontSize: size,
    fontWeight: 800,
    fill: colors.text,
    lineHeight: 1,
  }),
];
