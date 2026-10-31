import { type DesignIconName, linear } from '@/design';
import {
  circle,
  icon,
  type Nodes,
  paint,
  phone,
  phoneScreen,
  rect,
  SLIDE_SIZE,
  shadow,
  text,
} from '../../../kit';

export interface DeckTheme {
  deep: string;
  mid: string;
  glow: string;
  surface: string;
  soft: string;
  ink: string;
  muted: string;
  warm: string;
}

export const LAGOON: DeckTheme = {
  deep: '#04263a',
  mid: '#0b6477',
  glow: '#2dd4bf',
  surface: '#e3f8f4',
  soft: '#bfeee6',
  ink: '#062433',
  muted: '#4b6670',
  warm: '#ffb547',
};

export const SUNSET: DeckTheme = {
  deep: '#3a0f1d',
  mid: '#c2410c',
  glow: '#fdba74',
  surface: '#fff1e8',
  soft: '#fed7c3',
  ink: '#2a0d14',
  muted: '#7a4b3f',
  warm: '#fde047',
};

export const WHITE = '#ffffff';
export const FRAME = '#0b0b0f';
export const CLEAR = 'rgba(0,0,0,0)';
export const SW = SLIDE_SIZE.width;
export const SH = SLIDE_SIZE.height;
export const HEADING = { label: 'Heading font', value: 'Manrope' } as const;
export const BODY = { label: 'Body font', value: 'Inter' } as const;

export interface Fonts {
  head: string;
  body: string;
}

export const pageGradient = (...colors: string[]) =>
  rect(0, 0, SW, SH, linear(125, ...colors), { name: 'Background' });

export const title =
  (font: string) =>
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
      fontFamily: font,
      fontSize: size,
      fontWeight: 800,
      fill: color,
      align,
      lineHeight: 1.08,
    });

export const copy =
  (font: string) =>
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
      fontFamily: font,
      fontSize: size,
      fontWeight: 400,
      fill: color,
      align,
      lineHeight: 1.45,
    });

export const kicker = (font: string, label: string, x: number, y: number, color: string) =>
  text(label, x, y, 900, {
    fontFamily: font,
    fontSize: 24,
    fontWeight: 700,
    fill: color,
    letterSpacing: 3,
    uppercase: true,
  });

export const iconTile = (
  name: DesignIconName,
  x: number,
  y: number,
  size: number,
  fill: string,
  color: string,
) => [
  rect(x, y, size, size, fill, { cornerRadius: size * 0.28, name: 'Icon tile' }),
  icon(name, x + size * 0.22, y + size * 0.22, size * 0.56, color, { strokeWidth: 2.2 }),
];

export interface ChipPaint {
  card: string;
  shadow: string;
  tile: string;
  icon: string;
  heading: string;
  sub: string;
}

export const chip = (
  c: ChipPaint,
  f: Fonts,
  x: number,
  y: number,
  width: number,
  heading: string,
  sub: string,
  name: DesignIconName,
) => [
  rect(x, y, width, 110, c.card, {
    cornerRadius: 24,
    name: 'Chip',
    ...shadow(30, 12, c.shadow),
  }),
  iconTile(name, x + 20, y + 22, 66, c.tile, c.icon),
  text(heading, x + 104, y + 22, width - 120, {
    fontFamily: f.head,
    fontSize: 28,
    fontWeight: 800,
    fill: c.heading,
  }),
  text(sub, x + 104, y + 60, width - 120, {
    fontFamily: f.body,
    fontSize: 21,
    fontWeight: 400,
    fill: c.sub,
  }),
];

export interface StatPaint {
  card: string;
  shadow: string;
  value: string;
  label: string;
}

export const statCard = (
  c: StatPaint,
  f: Fonts,
  x: number,
  y: number,
  value: string,
  label: string,
) => [
  rect(x, y, 240, 150, c.card, {
    cornerRadius: 24,
    name: 'Stat card',
    ...shadow(30, 12, c.shadow),
  }),
  text(value, x + 26, y + 22, 200, {
    fontFamily: f.head,
    fontSize: 58,
    fontWeight: 800,
    fill: c.value,
    lineHeight: 1,
  }),
  text(label, x + 26, y + 96, 200, {
    fontFamily: f.body,
    fontSize: 21,
    fontWeight: 500,
    fill: c.label,
  }),
];

export const device = (
  x: number,
  y: number,
  width: number,
  rotation: number | undefined,
  screen: string,
  frame: string,
  content: (width: number, height: number) => Nodes[],
) => {
  const inner = phoneScreen(width);
  return paint(
    [
      phone(x, y, width, {
        screen,
        content: content(inner.width, inner.height),
        ...(rotation === undefined ? {} : { rotation }),
      }),
    ],
    { [FRAME]: frame },
  );
};

export interface WordmarkPaint {
  mark: string;
  dot: string;
  text: string;
}

export const wordmark = (
  c: WordmarkPaint,
  font: string,
  label: string,
  x: number,
  y: number,
  size: number,
) => [
  rect(x, y + size * 0.12, size * 0.8, size * 0.8, c.mark, {
    cornerRadius: size * 0.24,
    name: 'Logo mark',
  }),
  circle(x + size * 0.4, y + size * 0.52, size * 0.18, c.dot),
  text(label, x + size, y, size * 4, {
    fontFamily: font,
    fontSize: size,
    fontWeight: 800,
    fill: c.text,
    lineHeight: 1,
  }),
];
