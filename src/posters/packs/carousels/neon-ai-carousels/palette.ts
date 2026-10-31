import { linear, radial } from '@/design';
import { circle, POST_SIZE, rect, type Theme, text } from '../../../kit';

export const NEON = {
  black: '#07040d',
  night: '#140b24',
  plum: '#2a1748',
  pink: '#ff5fa2',
  rose: '#ffb3d1',
  lilac: '#e6d9ff',
  mist: '#f7f2ff',
  muted: '#c7bad9',
  ink: '#1a1027',
  white: '#ffffff',
};

export const { width: W, height: H } = POST_SIZE;

export const FONT = { label: 'Font', value: 'Sora' } as const;
export const HANDLE = { label: 'Handle', value: 'loomwork.ai' } as const;
export const AUTHOR = { label: 'Author', value: 'Maya Ortiz' } as const;

export const DARK_PAGE = { value: NEON.night, hint: 'Page gradient' } as const;
export const LIGHT_PAGE = { value: NEON.white, hint: 'Page gradient' } as const;

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

export const centered =
  (fontFamily: string) =>
  (content: string, y: number, size: number, fill: string, weight = 400, extra: TextStyle = {}) =>
    say(fontFamily)(content, 60, y, W - 120, size, fill, weight, { align: 'center', ...extra });

type PageTheme = Pick<
  Theme<{
    colors: {
      background: { value: string; hint: string };
      primary: { value: string; hint: string };
    };
  }>,
  'color' | 'shade'
>;

type WashTheme = Pick<
  Theme<{ colors: { background: { value: string; hint: string } } }>,
  'color' | 'shade'
>;

export const darkGlow = (t: PageTheme) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', NEON.black)), {
    name: 'Background',
  }),
  circle(
    W / 2,
    880,
    470,
    radial(
      t.shade('primary', 'rgba(255,95,162,0.4)'),
      t.shade('primary', 'rgba(255,95,162,0.16)'),
      t.shade('primary', 'rgba(255,95,162,0)'),
      t.shade('primary', 'rgba(255,95,162,0)'),
    ),
    { name: 'Glow' },
  ),
];

export const lightWash = (t: WashTheme) =>
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', NEON.lilac)), {
    name: 'Background',
  });

export const site = (
  label: string,
  fontFamily: string,
  x: number,
  y: number,
  fill: string,
  align: 'left' | 'center' | 'right',
) => say(fontFamily)(label, x, y, 400, 30, fill, 500, { align });
