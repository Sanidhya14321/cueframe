import { linear } from '@/design';
import {
  circle,
  icon,
  POST_SIZE,
  pill,
  poly,
  rect,
  rotateNodes,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const BL = {
  magenta: '#ff2d87',
  magentaDeep: '#d4146a',
  ink: '#121212',
  white: '#ffffff',
  blush: '#ffe3ef',
  grey: '#8b8b93',
  silver: '#d9d9de',
};

export const W = POST_SIZE.width;
export const H = POST_SIZE.height;

type TextStyle = Parameters<typeof text>[4];

const font =
  (fontWeight: number, lineHeight: number) =>
  (fontFamily: string) =>
  (
    content: string,
    x: number,
    y: number,
    width: number,
    size: number,
    fill: string,
    style: TextStyle = {},
  ) =>
    text(content, x, y, width, {
      fontFamily,
      fontSize: size,
      fontWeight,
      fill,
      lineHeight,
      ...style,
    });

export const heavy = font(800, 1.05);
export const bold = font(700, 1.2);
export const copy = font(400, 1.4);

export const HEADING = { label: 'Heading font', value: 'Poppins' } as const;
export const BODY = { label: 'Body font', value: 'Poppins' } as const;
export const HANDLE = { label: 'Handle', value: 'brightloop.co' } as const;

const button = (
  label: string,
  x: number,
  y: number,
  fill: string,
  color: string,
  fontFamily: string,
) => pill(label, x, y, { fill, color, fontSize: 26, fontFamily, fontWeight: 600 });

export const handle = (label: string, y: number, color: string, fontFamily: string) =>
  copy(fontFamily)(label, 0, y, W, 26, color, {
    align: 'center',
    fontWeight: 600,
    letterSpacing: 2,
  });

const mistakesSpec = {
  colors: {
    background: { value: BL.ink, hint: 'Page' },
    primary: { value: BL.magenta, hint: 'Highlight behind mistakes and the arrow button' },
    text: {
      value: BL.white,
      hint: "Personal Branding, mistakes, You're Making and the swipe line; its light grey shade colors the body",
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Personal\nBranding' },
    highlight: { label: 'Highlighted word', value: 'mistakes' },
    closing: { label: 'Title ending', value: "You're\nMaking." },
    body: { label: 'Body', value: 'Five habits quietly holding\nyour brand back.' },
    cta: { label: 'Call to action', value: 'Swipe to see them' },
  },
} as const satisfies ThemeSpec;

export const brandingMistakes = themed(W, H, mistakesSpec, (t) => {
  const heading = heavy(t.font('heading'));
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    heading(t.copy('title'), 90, 170, 900, 116, t.color('text')),
    rotateNodes(-3, 360, 515, [
      rect(80, 440, 580, 150, t.color('primary'), { cornerRadius: 18, name: 'Highlight' }),
      heading(t.copy('highlight'), 80, 454, 580, 112, t.color('text'), { align: 'center' }),
    ]),
    heading(t.copy('closing'), 90, 630, 900, 116, t.color('text')),
    copy(t.font('body'))(t.copy('body'), 90, 920, 800, 36, t.shade('text', BL.silver)),
    bold(t.font('heading'))(t.copy('cta'), 90, 1190, 600, 34, t.color('text')),
    icon('circle-arrow-right', 880, 1160, 110, t.color('primary'), { strokeWidth: 2 }),
  ];
});

const brandsSpec = {
  colors: {
    background: { value: BL.white, hint: 'Page and the we create brands text on the sign' },
    primary: { value: BL.magenta, hint: 'create ads, the nail and the hanging sign' },
    text: {
      value: BL.ink,
      hint: "we don't, the dark pill, the strings, the sign border and the handle; its grey shade colors the line under the sign",
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    lead: { label: 'Headline', value: "we don't" },
    pill: { label: 'Pill text', value: 'create ads' },
    sign: { label: 'Sign', value: 'we create brands' },
    body: { label: 'Body', value: 'Strategy, story and design under one roof.' },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const createBrands = themed(W, H, brandsSpec, (t) => {
  const heading = heavy(t.font('heading'));
  const strand = (fromX: number, fromY: number, toX: number, toY: number) =>
    poly(
      [
        [fromX - 2, fromY],
        [fromX + 2, fromY],
        [toX + 2, toY],
        [toX - 2, toY],
      ],
      t.color('text'),
      { name: 'String' },
    );
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    heading(t.copy('lead'), 0, 240, W, 112, t.color('text'), { align: 'center' }),
    rect(160, 390, 760, 160, t.color('text'), { cornerRadius: 80, name: 'Pill' }),
    heading(t.copy('pill'), 160, 410, 760, 112, t.color('primary'), { align: 'center' }),
    strand(540, 556, 380, 800),
    strand(540, 556, 700, 800),
    circle(540, 560, 12, t.color('primary'), { name: 'Nail' }),
    rotateNodes(-4, 540, 860, [
      rect(290, 790, 500, 140, t.color('primary'), {
        cornerRadius: 18,
        stroke: t.color('text'),
        strokeWidth: 5,
        name: 'Sign',
      }),
      bold(t.font('heading'))(t.copy('sign'), 290, 832, 500, 46, t.color('background'), {
        align: 'center',
      }),
    ]),
    copy(t.font('body'))(t.copy('body'), 0, 1060, W, 32, t.shade('text', BL.grey), {
      align: 'center',
    }),
    handle(t.copy('handle'), 1230, t.color('text'), t.font('body')),
  ];
});

const TILES = ['megaphone', 'target', 'message-square'] as const;

const campaignSpec = {
  colors: {
    background: {
      value: BL.magenta,
      hint: 'Page gradient; its darker shade is the bottom of the gradient',
    },
    surface: {
      value: BL.white,
      hint: 'Icon tiles, the intro, the analytics line, the body and the button label',
    },
    text: { value: BL.ink, hint: 'Campaign Insights, the tile icons and the Subscribe button' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    intro: { label: 'Intro', value: 'Keep up with every\nmarketing move' },
    title: { label: 'Title', value: 'Campaign Insights' },
    subtitle: { label: 'Subtitle', value: 'Sales & Marketing Analytics' },
    body: {
      label: 'Body',
      value: 'Fresh trends and numbers from every\ncampaign, delivered weekly.',
    },
    cta: { label: 'Button', value: 'Subscribe' },
  },
} as const satisfies ThemeSpec;

export const campaignInsights = themed(W, H, campaignSpec, (t) => [
  rect(0, 0, W, H, linear(170, t.color('background'), t.shade('background', BL.magentaDeep)), {
    name: 'Background',
  }),
  bold(t.font('heading'))(t.copy('intro'), 0, 170, W, 64, t.color('surface'), {
    align: 'center',
    fontWeight: 600,
  }),
  heavy(t.font('heading'))(t.copy('title'), 0, 360, W, 78, t.color('text'), { align: 'center' }),
  TILES.map((name, index) => {
    const x = 155 + index * 270;
    return [
      rect(x, 520, 230, 230, t.color('surface'), {
        cornerRadius: 44,
        name: 'Icon tile',
        ...shadow(24, 10, 'rgba(0,0,0,0.18)'),
      }),
      poly(
        [
          [x + 40, 740],
          [x + 100, 740],
          [x + 36, 800],
        ],
        t.color('surface'),
        { name: 'Tile tail' },
      ),
      icon(name, x + 55, 575, 120, t.color('text'), { strokeWidth: 2 }),
    ];
  }),
  bold(t.font('heading'))(t.copy('subtitle'), 0, 870, W, 42, t.color('surface'), {
    align: 'center',
  }),
  copy(t.font('body'))(t.copy('body'), 0, 940, W, 32, t.color('surface'), { align: 'center' }),
  button(t.copy('cta'), 455, 1110, t.color('text'), t.color('surface'), t.font('body')),
]);

const chatSpec = {
  colors: {
    background: {
      value: BL.magenta,
      hint: 'Page gradient; its darker shade is the bottom of the gradient',
    },
    surface: {
      value: BL.white,
      hint: 'Avatars, the message, the typing dots and the closing line',
    },
    secondary: { value: BL.ink, hint: 'Chat bubbles, the avatar icons and the handle' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    message: {
      label: 'Message line',
      value: ['Do you want', 'better results', 'for marketing?'],
    },
    closing: { label: 'Closing line', value: "Let's talk growth." },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const chatHero = themed(W, H, chatSpec, (t) => {
  const body = copy(t.font('body'));
  const [first = '', middle = '', last = ''] = t.list('message');
  const person = (cx: number, cy: number) => [
    circle(cx, cy, 46, t.color('surface'), { name: 'Avatar' }),
    icon('user-round', cx - 26, cy - 26, 52, t.color('secondary'), { strokeWidth: 2.2 }),
  ];
  return [
    rect(0, 0, W, H, linear(170, t.color('background'), t.shade('background', BL.magentaDeep)), {
      name: 'Background',
    }),
    person(150, 360),
    rect(220, 280, 660, 320, t.color('secondary'), { cornerRadius: 44, name: 'Bubble' }),
    poly(
      [
        [220, 330],
        [180, 300],
        [240, 300],
      ],
      t.color('secondary'),
      { name: 'Bubble tail' },
    ),
    body(first, 280, 320, 560, 56, t.color('surface')),
    heavy(t.font('heading'))(middle, 280, 396, 560, 56, t.color('surface')),
    body(last, 280, 466, 560, 56, t.color('surface')),
    rect(560, 760, 300, 150, t.color('secondary'), { cornerRadius: 44, name: 'Reply bubble' }),
    [650, 710, 770].map((x) => circle(x, 835, 16, t.color('surface'), { name: 'Typing dot' })),
    person(940, 880),
    bold(t.font('heading'))(t.copy('closing'), 90, 1100, 900, 54, t.color('surface'), {
      fontWeight: 800,
    }),
    handle(t.copy('handle'), 1240, t.color('secondary'), t.font('body')),
  ];
});
