import { linear } from '@/design';
import { poly, rect, shadow, type ThemeSpec, text, themed } from '../../../kit';
import {
  CAR,
  CLOUD,
  H,
  HEADING_FONT,
  MONO_FONT,
  PIXEL_FONT,
  PX,
  siteFooter,
  sprite,
  TREE,
  W,
  WEBSITE,
} from './pixel';

const mountains = (top: number, color: string) =>
  poly(
    [
      [0, top + 120],
      [0, top + 60],
      [120, top + 60],
      [120, top],
      [260, top],
      [260, top + 50],
      [420, top + 50],
      [420, top + 20],
      [600, top + 20],
      [600, top + 70],
      [760, top + 70],
      [760, top + 10],
      [940, top + 10],
      [940, top + 60],
      [W, top + 60],
      [W, top + 120],
    ],
    color,
    { name: 'Pixel mountains' },
  );

const checker = (x: number, y: number, columns: number, light: string, dark: string) =>
  Array.from({ length: columns * 2 }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    return rect(x + column * 24, y + row * 24, 24, 24, (column + row) % 2 === 0 ? light : dark, {
      name: 'Checker',
    });
  });

interface RaceStyle {
  skyTop: string;
  skyBottom: string;
  grass: string;
  word: string;
  sub: string;
  accent: string;
  code: string;
}

const raceSale = (style: RaceStyle) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: style.grass, hint: 'Grass at the bottom of the page' },
        secondary: {
          value: style.skyTop,
          hint: 'Top of the sky gradient; its shade colors the bottom of the sky',
        },
        primary: {
          value: style.accent,
          hint: 'Sale subtitle, the code box border, CHEAT CODE UNLOCKED and the car body; its shade colors the headlights',
        },
        accent: { value: PX.pink, hint: 'Kerbs on both sides of the road' },
        surface: {
          value: PX.night,
          hint: 'Code box, dark checker squares, text shadows, the website and the tyres; its lighter shades color the mountains and road',
        },
        text: {
          value: PX.white,
          hint: 'Headline, the code, clouds, light checker squares, lane marks, the website plate and the windscreen',
        },
      },
      fonts: { heading: HEADING_FONT, pixel: PIXEL_FONT },
      copy: {
        title: { label: 'Headline', value: style.word },
        subtitle: { label: 'Subtitle', value: style.sub },
        codeLabel: { label: 'Code label', value: 'CHEAT CODE UNLOCKED' },
        code: { label: 'Code', value: style.code },
        site: WEBSITE,
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const pixel = t.font('pixel');
      const cloud = { W: t.shade('text', 'rgba(255,255,255,0.9)') };
      const kerb = t.color('accent');
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        rect(
          0,
          0,
          W,
          640,
          linear(180, t.color('secondary'), t.shade('secondary', style.skyBottom)),
          {
            name: 'Sky',
          },
        ),
        sprite(CLOUD, 60, 60, 12, cloud),
        sprite(CLOUD, 860, 300, 10, cloud),
        text(t.copy('title'), 0, 110, W, {
          fontFamily: t.font('heading'),
          fontSize: 160,
          fontWeight: 400,
          fill: t.color('text'),
          align: 'center',
          lineHeight: 1,
          ...shadow(0, 10, t.color('surface')),
        }),
        text(t.copy('subtitle'), 0, 290, W, {
          fontFamily: pixel,
          fontSize: 50,
          fontWeight: 400,
          fill: t.color('primary'),
          align: 'center',
          ...shadow(0, 5, t.color('surface')),
        }),
        checker(40, 430, 10, t.color('text'), t.color('surface')),
        checker(800, 430, 10, t.color('text'), t.color('surface')),
        rect(300, 400, 480, 116, t.color('surface'), {
          stroke: t.color('primary'),
          strokeWidth: 5,
          name: 'Code box',
        }),
        text(t.copy('codeLabel'), 300, 412, 480, {
          fontFamily: pixel,
          fontSize: 24,
          fontWeight: 400,
          fill: t.color('primary'),
          align: 'center',
        }),
        text(t.copy('code'), 300, 446, 480, {
          fontFamily: pixel,
          fontSize: 54,
          fontWeight: 400,
          fill: t.color('text'),
          align: 'center',
        }),
        mountains(560, t.shade('surface', PX.deep)),
        poly(
          [
            [500, 680],
            [580, 680],
            [1000, H],
            [80, H],
          ],
          t.shade('surface', PX.road),
          { name: 'Road' },
        ),
        poly(
          [
            [486, 680],
            [500, 680],
            [80, H],
            [30, H],
          ],
          kerb,
          { name: 'Kerb' },
        ),
        poly(
          [
            [580, 680],
            [594, 680],
            [1050, H],
            [1000, H],
          ],
          kerb,
          { name: 'Kerb' },
        ),
        [0, 1, 2, 3].map((index) =>
          rect(
            536 - index * 3,
            760 + index * 110,
            8 + index * 6,
            50 + index * 14,
            t.color('text'),
            { name: 'Lane mark' },
          ),
        ),
        rect(370, 600, 340, 60, t.color('text'), { name: 'Site plate' }),
        text(t.copy('site'), 370, 615, 340, {
          fontFamily: pixel,
          fontSize: 24,
          fontWeight: 400,
          fill: t.color('surface'),
          align: 'center',
        }),
        sprite(CAR, 442, 1150, 14, {
          W: t.color('text'),
          K: t.color('surface'),
          R: t.color('primary'),
          Y: t.shade('primary', PX.sun),
        }),
      ];
    },
  );

export const raceSummer = raceSale({
  skyTop: '#ff5fa2',
  skyBottom: '#ffb35c',
  grass: '#2c8a5a',
  word: 'SUMMER',
  sub: 'MEGA SALE',
  accent: '#ffe14d',
  code: 'PIXEL 30',
});

export const raceAutumn = raceSale({
  skyTop: PX.sky,
  skyBottom: '#8f7bff',
  grass: '#1f6f8b',
  word: 'AUTUMN',
  sub: 'FULL STORE SALE',
  accent: PX.mint,
  code: 'LEVEL UP',
});

const quizSpec = {
  colors: {
    background: {
      value: '#8fe9ff',
      hint: 'Top of the sky gradient; its shades color the bottom of the sky and the mountains',
    },
    surface: {
      value: PX.cream,
      hint: 'Question box and the website; its white tint colors the clouds, FALSE and the lane marks',
    },
    primary: { value: PX.mint, hint: 'TRUE button' },
    accent: { value: PX.pink, hint: 'FALSE button' },
    secondary: {
      value: '#2f9e5b',
      hint: 'Ground; its shades color the tree leaves and trunks',
    },
    text: {
      value: PX.night,
      hint: 'Question, TRUE and every outline; its lighter shade colors the road',
    },
  },
  fonts: { mono: MONO_FONT, pixel: PIXEL_FONT },
  copy: {
    question: {
      label: 'Question',
      value: 'Keeping a customer\ncosts less than\nwinning a new one.',
    },
    answers: { label: 'Answer', value: ['TRUE', 'FALSE'] },
    site: WEBSITE,
  },
} as const satisfies ThemeSpec;

export const trueOrFalse = themed(W, H, quizSpec, (t) => {
  const pixel = t.font('pixel');
  const white = t.shade('surface', PX.white);
  const tree = { G: t.shade('secondary', '#1f7a43'), B: t.shade('secondary', '#6b3e1f') };
  const [yes = '', no = ''] = t.list('answers');
  return [
    rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', '#e1fbff')), {
      name: 'Background',
    }),
    sprite(CLOUD, 70, 90, 12, { W: white }),
    sprite(CLOUD, 820, 640, 10, { W: white }),
    rect(160, 230, 760, 340, t.color('surface'), {
      stroke: t.color('text'),
      strokeWidth: 10,
      name: 'Question box',
    }),
    text(t.copy('question'), 160, 296, 760, {
      fontFamily: t.font('mono'),
      fontSize: 56,
      fontWeight: 700,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1.2,
    }),
    rect(240, 630, 270, 96, t.color('primary'), {
      stroke: t.color('text'),
      strokeWidth: 6,
      name: 'True button',
    }),
    text(yes, 240, 652, 270, {
      fontFamily: pixel,
      fontSize: 48,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
    }),
    rect(570, 630, 270, 96, t.color('accent'), {
      stroke: t.color('text'),
      strokeWidth: 6,
      name: 'False button',
    }),
    text(no, 570, 652, 270, {
      fontFamily: pixel,
      fontSize: 48,
      fontWeight: 400,
      fill: white,
      align: 'center',
    }),
    mountains(840, t.shade('background', '#6b4fd6')),
    rect(0, 960, W, 390, t.color('secondary'), { name: 'Ground' }),
    sprite(TREE, 90, 880, 14, tree),
    sprite(TREE, 900, 870, 16, tree),
    rect(0, 1060, W, 130, t.shade('text', PX.road), { name: 'Road' }),
    Array.from({ length: 6 }, (_, index) =>
      rect(40 + index * 180, 1118, 100, 14, white, { name: 'Lane mark' }),
    ),
    siteFooter(t.copy('site'), 1260, t.color('surface'), pixel),
  ];
});
