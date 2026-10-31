import { type Fill, linear } from '@/design';
import {
  icon,
  line,
  type Nodes,
  POST_SIZE,
  paint,
  path,
  phone,
  phoneScreen,
  poly,
  rect,
  rotateNodes,
  shadow,
  star,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const IRIS = {
  deep: '#24127e',
  royal: '#4b2ed6',
  iris: '#7356ff',
  soft: '#a58bff',
  lilac: '#c9bcff',
  pale: '#f1edff',
  white: '#ffffff',
  ink: '#1d1450',
  grey: '#6e6894',
};

export const HEADING_FONT = { label: 'Heading font', value: 'Figtree' } as const;
export const BODY_FONT = { label: 'Body font', value: 'Inter' } as const;
export const BRAND = { label: 'Brand', value: 'LUMENFLOW AI' } as const;

export const { width: W, height: H } = POST_SIZE;

export const backdrop = (height: number, fill: Fill) =>
  rect(0, 0, W, height, fill, { name: 'Background' });

export const brand = (
  label: string,
  y: number,
  color: string,
  fontFamily: string,
  align: 'left' | 'center' | 'right' = 'center',
) =>
  text(label, align === 'center' ? 0 : 80, y, align === 'center' ? W : 920, {
    fontFamily,
    fontSize: 30,
    fontWeight: 800,
    fill: color,
    align,
    letterSpacing: 3,
  });

export const centered =
  (fontFamily: string) => (content: string, y: number, size: number, weight: number, fill: Fill) =>
    text(content, 0, y, W, {
      fontFamily,
      fontSize: size,
      fontWeight: weight,
      fill,
      align: 'center',
    });

export const sparkle = (x: number, y: number, size: number, fill: string) =>
  star(4, x, y, size, fill, { innerRatio: 0.28, name: 'Sparkle' });

export const cursor = (x: number, y: number, scale: number, fill: string) =>
  poly(
    [
      [x, y],
      [x, y + 70 * scale],
      [x + 18 * scale, y + 54 * scale],
      [x + 32 * scale, y + 84 * scale],
      [x + 44 * scale, y + 78 * scale],
      [x + 30 * scale, y + 49 * scale],
      [x + 54 * scale, y + 49 * scale],
    ],
    fill,
    { name: 'Cursor' },
  );

export interface TagStyle {
  from: string;
  to: string;
  stroke: string;
  shade: string;
  color: string;
  fontFamily: string;
}

export const tag = (
  label: string,
  x: number,
  y: number,
  rotation: number,
  width: number,
  style: TagStyle,
) =>
  rotateNodes(rotation, x + width / 2, y + 32, [
    rect(x, y, width, 64, linear(90, style.from, style.to), {
      cornerRadius: 18,
      stroke: style.stroke,
      strokeWidth: 2,
      name: `${label} tag`,
      ...shadow(24, 10, style.shade),
    }),
    text(label, x, y + 16, width, {
      fontFamily: style.fontFamily,
      fontSize: 26,
      fontWeight: 700,
      fill: style.color,
      align: 'center',
    }),
  ]);

const TILE_ICONS = ['rocket', 'mic', 'send'] as const;

const magicSpec = {
  colors: {
    background: { value: IRIS.white, hint: 'Pale page gradient' },
    primary: {
      value: IRIS.iris,
      hint: 'Smart Routines headline gradient and the icon tiles with their lilac borders and glow',
    },
    surface: { value: IRIS.white, hint: 'Icons on the tiles and the two paper tags' },
    text: {
      value: IRIS.ink,
      hint: 'The magic of line, the tag words and outlines, and the brand name',
    },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    lead: { label: 'Lead line', value: 'The magic of' },
    headline: { label: 'Headline', value: 'Smart Routines' },
    tags: { label: 'Tag', value: ['Get started', 'Today'] },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const magicRoutines = themed(W, H, magicSpec, (t) => {
  const heading = centered(t.font('heading'));
  const [started = '', today = ''] = t.list('tags');
  const note = (label: string, x: number, y: number, width: number) => [
    rect(x, y, width, 70, t.color('surface'), {
      cornerRadius: 12,
      stroke: t.color('text'),
      strokeWidth: 2,
      name: 'Tag',
    }),
    text(label, x, y + 17, width, {
      fontFamily: t.font('body'),
      fontSize: 28,
      fontWeight: 600,
      fill: t.color('text'),
      align: 'center',
    }),
  ];
  return [
    backdrop(H, linear(180, t.color('background'), t.shade('background', '#e2d9ff'))),
    heading(t.copy('lead'), 220, 74, 500, t.color('text')),
    heading(
      t.copy('headline'),
      308,
      84,
      800,
      linear(90, t.color('primary'), t.shade('primary', IRIS.soft)),
    ),
    TILE_ICONS.map((name, index) =>
      rotateNodes((index - 1) * 9, 335 + index * 205, 625 - (index === 1 ? 24 : 0), [
        rect(
          240 + index * 205,
          530 - (index === 1 ? 24 : 0),
          190,
          190,
          linear(160, t.color('primary'), t.shade('primary', IRIS.royal)),
          {
            cornerRadius: 36,
            stroke: t.shade('primary', IRIS.lilac),
            strokeWidth: 3,
            name: 'Icon tile',
            ...shadow(30, 16, t.shade('primary', 'rgba(36,18,126,0.3)')),
          },
        ),
        icon(name, 285 + index * 205, 575 - (index === 1 ? 24 : 0), 100, t.color('surface'), {
          strokeWidth: 2,
        }),
      ]),
    ),
    rotateNodes(-4, 530, 830, note(started, 400, 795, 260)),
    rotateNodes(3, 700, 930, note(today, 600, 895, 200)),
    brand(t.copy('brand'), 1220, t.color('text'), t.font('heading')),
  ];
});

const growSpec = {
  colors: {
    background: {
      value: IRIS.royal,
      hint: 'Violet page gradient and the button label',
    },
    text: {
      value: IRIS.white,
      hint: 'Grow and Online, the white sparkles, the spark lines and the brand name',
    },
    accent: {
      value: IRIS.lilac,
      hint: 'Tagline, the lilac sparkle and the button gradient',
    },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    headline: { label: 'Headline', value: 'Grow' },
    second: { label: 'Second headline line', value: 'Online' },
    tagline: { label: 'Tagline', value: 'Let smart tools carry the load' },
    button: { label: 'Button', value: 'Learn more' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const growOnline = themed(W, H, growSpec, (t) => {
  const heading = centered(t.font('heading'));
  const spark = t.shade('text', 'rgba(255,255,255,0.6)');
  return [
    backdrop(H, linear(160, t.color('background'), t.shade('background', IRIS.deep))),
    line(90, 452, 150, spark, 3, { name: 'Spark line' }),
    sparkle(226, 420, 64, t.color('text')),
    heading(t.copy('headline'), 360, 170, 800, t.color('text')),
    heading(t.copy('second'), 540, 140, 400, t.color('text')),
    sparkle(770, 680, 54, t.color('accent')),
    line(820, 707, 180, spark, 3, { name: 'Spark line' }),
    sparkle(850, 300, 40, t.color('text')),
    heading(t.copy('tagline'), 780, 42, 500, t.color('accent')),
    rect(390, 880, 300, 88, linear(90, t.color('accent'), t.shade('accent', IRIS.pale)), {
      cornerRadius: 44,
      name: 'Button',
    }),
    text(t.copy('button'), 390, 904, 300, {
      fontFamily: t.font('body'),
      fontSize: 32,
      fontWeight: 700,
      fill: t.shade('background', IRIS.ink),
      align: 'center',
    }),
    brand(t.copy('brand'), 1220, t.color('text'), t.font('heading')),
  ];
});

const staySpec = {
  colors: {
    background: { value: IRIS.white, hint: 'Pale page gradient' },
    primary: {
      value: IRIS.iris,
      hint: 'Level up headline gradient, the brand name, the sparkles and the search icon',
    },
    surface: {
      value: IRIS.lilac,
      hint: 'Bottom wave and the phone screen, with the prompt field and its border',
    },
    text: {
      value: IRIS.ink,
      hint: 'Stay one step ahead, the greeting, the phone frame and the grey help line',
    },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    brand: BRAND,
    lead: { label: 'Lead line', value: 'Stay one step\nahead.' },
    headline: { label: 'Headline', value: 'Level up your\nday with AI.' },
    greeting: { label: 'Greeting', value: 'Hello, Alex' },
    prompt: { label: 'Help line', value: 'How can I help today?' },
  },
} as const satisfies ThemeSpec;

export const stayAhead = themed(W, H, staySpec, (t) => {
  const screen = phoneScreen(400);
  const content: Nodes[] = [
    sparkle(screen.width / 2 - 60, 220, 80, t.color('primary')),
    sparkle(screen.width / 2 + 10, 190, 44, t.shade('primary', IRIS.soft)),
    text(t.copy('greeting'), 0, 340, screen.width, {
      fontFamily: t.font('heading'),
      fontSize: 30,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('prompt'), 0, 384, screen.width, {
      fontFamily: t.font('body'),
      fontSize: 22,
      fontWeight: 500,
      fill: t.shade('text', IRIS.grey),
      align: 'center',
    }),
    rect(30, 450, screen.width - 60, 60, t.shade('surface', IRIS.white), {
      cornerRadius: 30,
      stroke: t.shade('surface', '#d8d0f5'),
      strokeWidth: 2,
      name: 'Prompt field',
    }),
    icon('search', screen.width - 82, 464, 32, t.color('primary'), { strokeWidth: 2.4 }),
  ];
  return [
    backdrop(H, linear(180, t.color('background'), t.shade('background', '#e2d9ff'))),
    path(
      'M 0 1350 L 0 1160 C 300 1040 760 1040 1080 1160 L 1080 1350 Z',
      0,
      0,
      W,
      H,
      linear(180, t.color('surface'), t.shade('surface', IRIS.pale)),
      { width: W, height: H },
      { name: 'Wave' },
    ),
    paint(
      [
        phone(70, 250, 400, {
          screen: linear(180, t.shade('surface', IRIS.white), t.shade('surface', IRIS.pale)),
          content,
        }),
      ],
      { '#0b0b0f': t.shade('text', '#0b0b0f') },
    ),
    text(t.copy('brand'), 540, 330, 480, {
      fontFamily: t.font('heading'),
      fontSize: 30,
      fontWeight: 800,
      fill: t.color('primary'),
      letterSpacing: 3,
    }),
    text(t.copy('lead'), 540, 420, 480, {
      fontFamily: t.font('heading'),
      fontSize: 62,
      fontWeight: 500,
      fill: t.color('text'),
      lineHeight: 1.15,
    }),
    text(t.copy('headline'), 540, 590, 480, {
      fontFamily: t.font('heading'),
      fontSize: 68,
      fontWeight: 800,
      fill: linear(90, t.color('primary'), t.shade('primary', IRIS.soft)),
      lineHeight: 1.12,
    }),
  ];
});

const quoteSpec = {
  colors: {
    background: { value: IRIS.royal, hint: 'Violet page gradient' },
    text: {
      value: IRIS.white,
      hint: 'Quote mark, the quote, the floating glass squares and the brand name',
    },
    accent: { value: IRIS.lilac, hint: 'Make it simple line' },
  },
  fonts: { heading: HEADING_FONT },
  copy: {
    highlight: { label: 'Highlight', value: 'Make it simple.' },
    quote: { label: 'Quote', value: "That's how great\nservice should\nfeel." },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const quoteFloat = themed(W, H, quoteSpec, (t) => [
  backdrop(H, linear(160, t.color('background'), t.shade('background', IRIS.deep))),
  rect(820, 160, 160, 160, t.shade('text', 'rgba(255,255,255,0.16)'), {
    cornerRadius: 22,
    rotation: 20,
  }),
  rect(110, 140, 100, 100, t.shade('text', 'rgba(255,255,255,0.1)'), {
    cornerRadius: 16,
    rotation: 10,
  }),
  rect(60, 980, 220, 220, t.shade('text', 'rgba(255,255,255,0.12)'), {
    cornerRadius: 28,
    rotation: -15,
  }),
  rect(860, 1000, 140, 140, t.shade('text', 'rgba(255,255,255,0.2)'), {
    cornerRadius: 20,
    rotation: 35,
  }),
  icon('quote', 250, 560, 140, t.color('text'), { strokeWidth: 2.4, rotation: 180 }),
  text(t.copy('highlight'), 290, 430, 720, {
    fontFamily: t.font('heading'),
    fontSize: 76,
    fontWeight: 800,
    fill: t.color('accent'),
  }),
  text(t.copy('quote'), 290, 524, 720, {
    fontFamily: t.font('heading'),
    fontSize: 76,
    fontWeight: 500,
    fill: t.color('text'),
    lineHeight: 1.15,
  }),
  brand(t.copy('brand'), 1220, t.color('text'), t.font('heading')),
]);
