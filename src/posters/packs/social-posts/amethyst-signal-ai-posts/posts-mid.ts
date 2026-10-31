import { linear, radial } from '@/design';
import {
  circle,
  type Nodes,
  poly,
  rect,
  STORY_SIZE,
  shadow,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  BODY,
  BRAND,
  brandMark,
  button,
  darkBg,
  H,
  HEADING,
  type Ink,
  VIO,
  violetGlow,
  W,
} from './posts';

const HIGHLIGHTED_LINES = [false, true, false, true];

export const buildFaster = themed(
  W,
  H,
  {
    colors: {
      background: { value: VIO.night, hint: 'Page; its plum shade colors the top of the gradient' },
      primary: {
        value: VIO.bright,
        hint: 'Second and fourth headline lines, the active grid cell and its glow',
      },
      text: {
        value: VIO.white,
        hint: 'Brand name, first and third headline lines and the cursor; its translucent shades color the grid cells',
      },
    },
    fonts: { heading: HEADING },
    copy: {
      brand: BRAND,
      lines: {
        label: 'Headline line',
        value: ['Build faster,', 'think bigger,', 'and scale up', 'with automation'],
      },
    },
  } as const satisfies ThemeSpec,
  (t) => [
    darkBg(t, H),
    brandMark(t.copy('brand'), t.font('heading'), 80, 90, 600, t.color('text'), 'left'),
    t.list('lines').map((line, index) =>
      text(line, 80, 200 + index * 96, 920, {
        fontFamily: t.font('heading'),
        fontSize: 80,
        fontWeight: 600,
        fill: HIGHLIGHTED_LINES[index] === true ? t.color('primary') : t.color('text'),
        lineHeight: 1.1,
      }),
    ),
    Array.from({ length: 10 }, (_, index) => {
      const column = index % 5;
      const row = Math.floor(index / 5);
      return rect(
        20 + column * 212,
        820 + row * 212,
        196,
        196,
        t.shade('text', 'rgba(255,255,255,0.03)'),
        {
          name: 'Grid cell',
          cornerRadius: 40,
          stroke: t.shade('text', 'rgba(255,255,255,0.22)'),
          strokeWidth: 3,
        },
      );
    }),
    violetGlow(t, 320, 700, 440, 440, 0.6),
    rect(
      444,
      820,
      196,
      196,
      linear(135, t.shade('primary', VIO.lilac), t.shade('primary', VIO.violet)),
      {
        name: 'Active cell',
        cornerRadius: 40,
        ...shadow(70, 0, t.shade('primary', 'rgba(139,92,246,0.95)')),
      },
    ),
    poly(
      [
        [505, 870],
        [590, 905],
        [553, 915],
        [548, 960],
      ],
      t.color('text'),
      { name: 'Cursor' },
    ),
  ],
);

const joinSpec = {
  colors: {
    background: {
      value: VIO.bright,
      hint: 'Page gradient, of Product Builders and the buttons',
    },
    surface: {
      value: VIO.night,
      hint: 'Dark disc; its lighter shades color the disc edge and its shadow',
    },
    text: {
      value: VIO.white,
      hint: 'Brand name, Join the Top 5% and button labels; its translucent shades color the subtitle and Read More fill',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    brand: BRAND,
    title: { label: 'Headline', value: 'Join the Top 5%' },
    highlight: { label: 'Highlighted line', value: 'of Product Builders' },
    subtitle: { label: 'Subtitle', value: 'A private circle shaping\nhow software gets made' },
    secondary: { label: 'Outline button', value: 'Read More' },
    action: { label: 'Main button', value: 'Apply Now' },
  },
} as const satisfies ThemeSpec;

const joinNodes = (t: Theme<typeof joinSpec>, height: number): Nodes[] => {
  const cy = height / 2;
  const role = (key: 'primary' | 'text') => (key === 'primary' ? 'background' : 'text');
  const buttonInk: Ink<'primary' | 'text'> = {
    color: (key) => t.color(role(key)),
    shade: (key, exact) => t.shade(role(key), exact),
  };
  return [
    rect(
      0,
      0,
      W,
      height,
      linear(
        180,
        t.color('background'),
        t.shade('background', VIO.violet),
        t.shade('background', '#6d28d9'),
      ),
      { name: 'Background' },
    ),
    circle(
      540,
      cy,
      500,
      radial(t.color('surface'), t.shade('surface', VIO.ink), t.shade('surface', VIO.plum)),
      { name: 'Dark disc', ...shadow(80, 0, t.shade('surface', 'rgba(7,4,15,0.6)')) },
    ),
    brandMark(t.copy('brand'), t.font('heading'), 0, cy - 300, W, t.color('text')),
    text(t.copy('title'), 0, cy - 200, W, {
      fontFamily: t.font('heading'),
      fontSize: 80,
      fontWeight: 700,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('highlight'), 0, cy - 100, W, {
      fontFamily: t.font('heading'),
      fontSize: 80,
      fontWeight: 800,
      fill: t.color('background'),
      align: 'center',
    }),
    text(t.copy('subtitle'), 0, cy + 30, W, {
      fontFamily: t.font('body'),
      fontSize: 34,
      fontWeight: 500,
      fill: t.shade('text', VIO.muted),
      align: 'center',
      lineHeight: 1.4,
    }),
    button(buttonInk, t.copy('secondary'), t.font('body'), 250, cy + 190, 270, false),
    button(buttonInk, t.copy('action'), t.font('body'), 560, cy + 190, 270, true),
  ];
};

export const topFivePost = themed(W, H, joinSpec, (t) => joinNodes(t, H));

export const topFiveStory = themed(STORY_SIZE.width, STORY_SIZE.height, joinSpec, (t) =>
  joinNodes(t, STORY_SIZE.height),
);

const quoteMark = (x: number, fill: string) =>
  poly(
    [
      [x + 110, 150],
      [x + 360, 150],
      [x + 250, 900],
      [x, 900],
    ],
    fill,
    { name: 'Quote mark' },
  );

export const quoteCloser = themed(
  W,
  H,
  {
    colors: {
      background: {
        value: VIO.night,
        hint: 'Page, the fade under the quote marks and the quote pill; its plum shade colors the top of the page',
      },
      primary: { value: VIO.bright, hint: 'Quote marks and the quote pill outline' },
      text: {
        value: VIO.white,
        hint: 'Quote, name and brand name; its translucent shade colors the role',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      quote: { label: 'Quote', value: 'Great tools bring great\npeople closer together' },
      name: { label: 'Name', value: 'Mara Quinlan' },
      role: { label: 'Role', value: 'Head of Product' },
      brand: BRAND,
    },
  } as const satisfies ThemeSpec,
  (t) => [
    darkBg(t, H),
    quoteMark(220, t.shade('primary', 'rgba(139,92,246,0.55)')),
    quoteMark(540, t.shade('primary', 'rgba(167,139,250,0.85)')),
    rect(
      0,
      640,
      W,
      280,
      linear(180, t.shade('background', 'rgba(7,4,15,0)'), t.color('background')),
      { name: 'Fade' },
    ),
    rect(140, 560, 800, 170, t.shade('background', 'rgba(17,11,34,0.82)'), {
      name: 'Quote pill',
      cornerRadius: 85,
      stroke: t.color('primary'),
      strokeWidth: 3,
    }),
    text(t.copy('quote'), 140, 596, 800, {
      fontFamily: t.font('body'),
      fontSize: 38,
      fontWeight: 600,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1.3,
    }),
    text(t.copy('name'), 0, 1000, W, {
      fontFamily: t.font('heading'),
      fontSize: 36,
      fontWeight: 700,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('role'), 0, 1050, W, {
      fontFamily: t.font('body'),
      fontSize: 28,
      fontWeight: 500,
      fill: t.shade('text', VIO.muted),
      align: 'center',
    }),
    brandMark(t.copy('brand'), t.font('heading'), 0, 1240, W, t.color('text')),
  ],
);
