import { linear } from '@/design';
import { icon, POST_SIZE, rect, type Theme, text } from '../../../kit';

export const TANGERINE = {
  deep: '#06231f',
  forest: '#0b3a33',
  teal: '#145c50',
  orange: '#ff8a3d',
  apricot: '#ffc59e',
  sage: '#b7d3cb',
  cream: '#fff7ef',
  white: '#ffffff',
};

export const { width: W, height: H } = POST_SIZE;

export const FONT = { label: 'Font', value: 'Plus Jakarta Sans' } as const;
export const HANDLE = { label: 'Handle', value: 'northpine.co' } as const;

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
      lineHeight: 1.3,
      ...extra,
    });

type BackgroundTheme = Pick<
  Theme<{ colors: { background: { value: string; hint: string } } }>,
  'color' | 'shade'
>;

const grid = (color: string) => [
  Array.from({ length: 17 }, (_, index) =>
    rect(30 + index * 64, 0, 2, H, color, { name: 'Grid line' }),
  ),
  Array.from({ length: 21 }, (_, index) =>
    rect(0, 35 + index * 64, W, 2, color, { name: 'Grid line' }),
  ),
];

export const DARK_PAGE = 'Page gradient and its faint grid lines';

export const darkBackground = (t: BackgroundTheme) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', TANGERINE.deep)), {
    name: 'Background',
  }),
  grid(t.shade('background', 'rgba(255,255,255,0.045)')),
];

export const orangeBackground = (t: BackgroundTheme) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', '#ff7426')), {
    name: 'Background',
  }),
  grid(t.shade('background', 'rgba(255,255,255,0.13)')),
];

export const lightBackground = (t: BackgroundTheme) =>
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', '#ffdcc2')), {
    name: 'Background',
  });

export const nextArrow = (color: string, x = 890, y = 1150) =>
  icon('arrow-right', x, y, 96, color, { strokeWidth: 1.8 });
