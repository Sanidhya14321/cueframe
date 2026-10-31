import { linear, radial } from '@/design';
import { type ColorKey, circle, icon, POST_SIZE, rect, text } from '../../../kit';

export const SUN = {
  coal: '#0c0c0f',
  graphite: '#24252b',
  sun: '#ffc93c',
  gold: '#f5a800',
  amber: '#b86e00',
  cream: '#fffaf0',
  butter: '#ffefc4',
  ink: '#1c1b1f',
  muted: '#5b5560',
  fog: '#c9c6cf',
  white: '#ffffff',
};

export const { width: W, height: H } = POST_SIZE;

export const HEADING_FONT = { label: 'Heading font', value: 'Manrope' } as const;
export const BODY_FONT = { label: 'Body font', value: 'Manrope' } as const;

export interface Paint<C extends ColorKey, F extends string = never> {
  color: (key: C) => string;
  shade: (key: C, exact: string) => string;
  font: (key: F) => string;
}

type TextStyle = NonNullable<Parameters<typeof text>[4]>;

export const say =
  (fontFamily: string) =>
  (
    content: string,
    x: number,
    y: number,
    width: number,
    size: number,
    fill: string,
    weight = 400,
    extra: TextStyle = {},
  ) =>
    text(content, x, y, width, {
      fontFamily,
      fontSize: size,
      fontWeight: weight,
      fill,
      lineHeight: 1.25,
      ...extra,
    });

const glow = (t: Paint<'primary'>, ...alphas: number[]) =>
  radial(...alphas.map((alpha) => t.shade('primary', `rgba(255,201,60,${alpha})`)));

export const creamBackground = (t: Paint<'background' | 'primary'>) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', SUN.butter)), {
    name: 'Background',
  }),
  circle(900, 220, 360, glow(t, 0.45, 0.15, 0, 0), { name: 'Soft glow' }),
];

export const darkBackground = (t: Paint<'background' | 'primary'>) => [
  rect(0, 0, W, H, linear(165, t.shade('background', SUN.graphite), t.color('background')), {
    name: 'Background',
  }),
  circle(760, 520, 520, glow(t, 0.22, 0.06, 0, 0), { name: 'Glow' }),
];

export const glowNumber = (
  t: Paint<'primary', 'heading'>,
  value: string,
  x: number,
  y: number,
  width: number,
  size: number,
  align: 'left' | 'center' | 'right',
) =>
  text(value, x, y, width, {
    fontFamily: t.font('heading'),
    fontSize: size,
    fontWeight: 800,
    fill: linear(180, t.shade('primary', '#ffe39a'), t.shade('primary', SUN.gold)),
    align,
    lineHeight: 1,
    shadow: {
      color: t.shade('primary', 'rgba(255,201,60,0.55)'),
      blur: 60,
      offsetX: 0,
      offsetY: 0,
    },
  });

export const swipeArrow = (color: string) =>
  icon('move-right', 900, 1190, 90, color, { strokeWidth: 1.6 });
