import { type DesignIconName, type Fill, linear } from '@/design';
import { ellipse, icon as iconNode, path, photo, rect, star, type Theme, text } from '../../../kit';

export const TIDE = {
  ink: '#0f1f1c',
  muted: '#5b6b68',
  paper: '#ffffff',
  card: '#eef5f3',
  tint: '#dcf2ec',
  edge: '#8fd3c3',
  teal: '#0f9d8a',
  deep: '#0b6b5e',
  coral: '#ff7a59',
  grey: '#c9d3d1',
  rule: '#dbe3e1',
  white: '#ffffff',
  clear: 'rgba(0,0,0,0)',
  sky: '#bfe9f2',
  mist: '#eaf8f4',
  hill: '#7fd1bf',
  sun: '#ffb199',
  tile: '#ff8a65',
};

export const LETTER = { width: 1275, height: 1650 } as const;

export const FONTS = {
  heading: { label: 'Heading font', value: 'Plus Jakarta Sans' },
  body: { label: 'Body font', value: 'Inter' },
} as const;

interface Role {
  value: string;
  hint: string;
}

type Fonts = { fonts: typeof FONTS };
type TextTheme = Theme<{ colors: { text: Role; primary: Role } } & Fonts>;
type InkTheme = Theme<{ colors: { text: Role } } & Fonts>;
type TileTheme = Theme<{ colors: { accent: Role } }>;
type SceneTheme = Theme<{ colors: { primary: Role; accent: Role; secondary: Role } }>;

const TILE_COLORS = [
  ['#ff8a65', '#f43f5e'],
  ['#6366f1', '#a855f7'],
  ['#14b8a6', '#0ea5e9'],
  ['#f59e0b', '#f97316'],
  ['#22c55e', '#0f9d8a'],
  ['#0ea5e9', '#2563eb'],
] as const;

export const tileFills = (t: TileTheme): Fill[] =>
  TILE_COLORS.map(([from, to]) => linear(135, t.shade('accent', from), t.shade('accent', to)));

export const appTile = (
  x: number,
  y: number,
  size: number,
  fill: Fill,
  name: DesignIconName,
  glyph: string,
) => [
  rect(x, y, size, size, fill, { cornerRadius: size * 0.26, name: 'App tile' }),
  iconNode(name, x + size * 0.22, y + size * 0.22, size * 0.56, glyph, { strokeWidth: 2.2 }),
];

export const statusBar = (t: TextTheme, width: number, label: string, time: string) => [
  text(label, 60, 36, 300, {
    fontFamily: t.font('body'),
    fontSize: 24,
    fontWeight: 600,
    fill: t.color('text'),
  }),
  text(time, 0, 36, width, {
    fontFamily: t.font('body'),
    fontSize: 24,
    fontWeight: 600,
    fill: t.color('text'),
    align: 'center',
  }),
  [10, 14, 18, 22].map((height, index) =>
    rect(1060 + index * 12, 62 - height, 8, height, t.color('text'), {
      cornerRadius: 2,
      name: 'Signal',
    }),
  ),
  iconNode('wifi', 1116, 36, 28, t.color('text'), { strokeWidth: 2.6 }),
  rect(1158, 40, 50, 24, t.shade('text', TIDE.clear), {
    cornerRadius: 7,
    stroke: t.color('text'),
    strokeWidth: 2,
    name: 'Battery',
  }),
  rect(1162, 44, 36, 16, t.color('primary'), { cornerRadius: 4, name: 'Battery level' }),
];

export const kicker = (
  t: InkTheme,
  label: string,
  title: string,
  x: number,
  y: number,
  width = 600,
) => [
  text(label, x, y, width, {
    fontFamily: t.font('body'),
    fontSize: 20,
    fontWeight: 700,
    fill: t.shade('text', TIDE.muted),
    letterSpacing: 2,
    uppercase: true,
  }),
  text(title, x, y + 30, width, {
    fontFamily: t.font('heading'),
    fontSize: 40,
    fontWeight: 700,
    fill: t.color('text'),
  }),
];

export const identity = (
  t: TextTheme,
  x: number,
  y: number,
  [first = '', last = '']: readonly string[],
  role: string,
) => [
  photo('woman-portrait-4', x, y, 380, 380, { cornerRadius: 36 }),
  text(first, x, y + 400, 400, {
    fontFamily: t.font('heading'),
    fontSize: 104,
    fontWeight: 800,
    fill: t.color('text'),
    lineHeight: 1,
  }),
  text(last, x, y + 505, 400, {
    fontFamily: t.font('heading'),
    fontSize: 104,
    fontWeight: 400,
    fill: t.color('text'),
    lineHeight: 1,
  }),
  text(role, x, y + 625, 400, {
    fontFamily: t.font('body'),
    fontSize: 34,
    fontWeight: 500,
    fill: t.color('primary'),
  }),
];

export const stars = (t: TextTheme, x: number, y: number, filled: number) =>
  Array.from({ length: 5 }, (_, index) =>
    star(
      5,
      x + index * 30,
      y,
      24,
      index < filled ? t.color('primary') : t.shade('text', TIDE.grey),
      { innerRatio: 0.46 },
    ),
  );

export const landscape = (t: SceneTheme, x: number, y: number, width: number, height: number) => [
  rect(
    x,
    y,
    width,
    height,
    linear(180, t.shade('primary', TIDE.sky), t.shade('primary', TIDE.mist)),
    { name: 'Sky' },
  ),
  ellipse(x + width * 0.08, y + height * 0.16, width * 0.18, height * 0.14, t.color('secondary'), {
    name: 'Cloud',
  }),
  ellipse(x + width * 0.42, y + height * 0.1, width * 0.22, height * 0.18, t.color('secondary'), {
    name: 'Cloud',
  }),
  ellipse(
    x + width * 0.74,
    y + height * 0.2,
    width * 0.12,
    width * 0.12,
    t.shade('accent', TIDE.sun),
    {
      name: 'Sun',
    },
  ),
  path(
    'M0 70 Q 90 20 180 58 T 360 46 L360 120 L0 120 Z',
    x,
    y + height * 0.5,
    width,
    height * 0.5,
    t.shade('primary', TIDE.hill),
    { width: 360, height: 120 },
  ),
  path(
    'M0 90 Q 120 50 240 84 T 360 80 L360 120 L0 120 Z',
    x,
    y + height * 0.5,
    width,
    height * 0.5,
    t.color('primary'),
    { width: 360, height: 120 },
  ),
];
