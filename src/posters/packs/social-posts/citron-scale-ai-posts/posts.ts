import { type Fill, linear, radial } from '@/design';
import {
  circle,
  ellipse,
  icon,
  type Nodes,
  POST_SIZE,
  path,
  poly,
  rect,
  rotateNodes,
  shadow,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const CITRON = {
  night: '#0a0b07',
  coal: '#16180f',
  olive: '#23271a',
  lime: '#a3e635',
  bright: '#d9f99d',
  deep: '#65a30d',
  white: '#ffffff',
  muted: 'rgba(255,255,255,0.68)',
};

export const HEADING = { label: 'Heading font', value: 'Lexend' } as const;
export const BODY = { label: 'Body font', value: 'Figtree' } as const;
export const BRAND = { label: 'Brand', value: 'KESTREL AI' } as const;
export const { width: W, height: H } = POST_SIZE;

interface CoreSpec {
  colors: Record<'background' | 'primary' | 'text', { value: string; hint: string }>;
  fonts: Record<'heading' | 'body', { label: string; value: string }>;
  copy: Record<'brand', { label: string; value: string }>;
}

export type CitronTheme = Pick<Theme<CoreSpec>, 'color' | 'shade' | 'font' | 'copy'>;

export const brandMark = (t: CitronTheme, y: number) =>
  text(t.copy('brand'), 0, y, W, {
    fontFamily: t.font('heading'),
    fontSize: 28,
    fontWeight: 700,
    fill: t.color('text'),
    align: 'center',
    letterSpacing: 4,
  });

export const limeGlow = (
  t: CitronTheme,
  x: number,
  y: number,
  width: number,
  height: number,
  alpha = 0.35,
) =>
  ellipse(
    x,
    y,
    width,
    height,
    radial(
      t.shade('primary', `rgba(163,230,53,${alpha})`),
      t.shade('primary', `rgba(163,230,53,${alpha * 0.3})`),
      t.shade('primary', 'rgba(163,230,53,0)'),
      t.shade('primary', 'rgba(163,230,53,0)'),
    ),
    { name: 'Glow' },
  );

export const darkBg = (t: CitronTheme, height: number): Nodes[] => [
  rect(
    0,
    0,
    W,
    height,
    linear(180, t.shade('background', '#1b1e13'), t.color('background'), t.color('background')),
    { name: 'Background' },
  ),
];

export const button = (
  t: CitronTheme,
  label: string,
  x: number,
  y: number,
  width: number,
  filled: boolean,
  name: string,
) => [
  rect(
    x,
    y,
    width,
    70,
    filled
      ? linear(90, t.shade('primary', CITRON.bright), t.color('primary'))
      : t.shade('primary', 'rgba(0,0,0,0)'),
    {
      name,
      cornerRadius: 35,
      stroke: t.color('primary'),
      strokeWidth: filled ? 0 : 2,
    },
  ),
  text(label, x, y + 20, width, {
    fontFamily: t.font('body'),
    fontSize: 26,
    fontWeight: 700,
    fill: filled ? t.color('background') : t.color('text'),
    align: 'center',
  }),
];

export const ringArc = (
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  start: number,
  end: number,
  fill: Fill,
) => {
  const point = (radius: number, degrees: number) => {
    const radians = (degrees * Math.PI) / 180;
    return `${(cx + radius * Math.cos(radians)).toFixed(1)} ${(cy + radius * Math.sin(radians)).toFixed(1)}`;
  };
  const large = end - start > 180 ? 1 : 0;
  const data = [
    `M ${point(outer, start)}`,
    `A ${outer} ${outer} 0 ${large} 1 ${point(outer, end)}`,
    `L ${point(inner, end)}`,
    `A ${inner} ${inner} 0 ${large} 0 ${point(inner, start)}`,
    'Z',
  ].join(' ');
  return path(data, 0, 0, W, H, fill, { width: W, height: H }, { name: 'Arc' });
};

const levelSpec = {
  colors: {
    background: {
      value: CITRON.night,
      hint: 'Page, its lighter top glow, and the kicker, LEVEL UP, tagline and sparkle on the sun',
    },
    primary: {
      value: CITRON.lime,
      hint: 'Sun, its glow and the corner dots; its lighter and deeper shades color the sun gradient',
    },
    text: { value: CITRON.white, hint: 'KESTREL AI brand at the bottom' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'The Power of' },
    title: { label: 'Title', value: 'LEVEL' },
    titleEnd: { label: 'Second title line', value: 'UP' },
    tagline: { label: 'Tagline', value: 'through smarter\nsystems' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const levelUp = themed(W, H, levelSpec, (t) => [
  darkBg(t, H),
  [
    [110, 170],
    [970, 170],
    [110, 1110],
    [970, 1110],
  ].map(([cx = 0, cy = 0]) => circle(cx, cy, 9, t.color('primary'), { name: 'Dot' })),
  circle(
    540,
    640,
    400,
    linear(
      160,
      t.shade('primary', CITRON.bright),
      t.color('primary'),
      t.shade('primary', CITRON.deep),
    ),
    {
      name: 'Sun',
      ...shadow(90, 0, t.shade('primary', 'rgba(163,230,53,0.55)')),
    },
  ),
  text(t.copy('kicker'), 0, 330, W, {
    fontFamily: t.font('heading'),
    fontSize: 44,
    fontWeight: 600,
    fill: t.color('background'),
    align: 'center',
  }),
  text(t.copy('title'), 0, 400, W, {
    fontFamily: t.font('heading'),
    fontSize: 220,
    fontWeight: 800,
    fill: t.color('background'),
    align: 'center',
    lineHeight: 1,
  }),
  text(t.copy('titleEnd'), 0, 620, W, {
    fontFamily: t.font('heading'),
    fontSize: 220,
    fontWeight: 800,
    fill: t.color('background'),
    align: 'center',
    lineHeight: 1,
  }),
  icon('sparkles', 360, 880, 52, t.color('background'), { strokeWidth: 2.2 }),
  text(t.copy('tagline'), 428, 872, 320, {
    fontFamily: t.font('body'),
    fontSize: 30,
    fontWeight: 700,
    fill: t.color('background'),
    lineHeight: 1.2,
  }),
  brandMark(t, 1240),
]);

const counterSpec = {
  colors: {
    background: { value: CITRON.night, hint: 'Page and the sparkle on the icon tile' },
    primary: {
      value: CITRON.lime,
      hint: 'Glow, icon tile, the tall active tick and the pivot dot',
    },
    text: {
      value: CITRON.white,
      hint: 'Headline, the big number and brand; its faded shades color the side numbers and ticks',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    intro: { label: 'Intro', value: 'Grow faster with' },
    headline: { label: 'Headline', value: 'your AI copilot' },
    numbers: { label: 'Counter number', value: ['06', '07', '08'] },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const counterGrow = themed(W, H, counterSpec, (t) => {
  const [previous = '', current = '', next = ''] = t.list('numbers');
  return [
    darkBg(t, H),
    limeGlow(t, 240, 380, 600, 500, 0.25),
    rect(110, 170, 150, 150, linear(135, t.shade('primary', CITRON.bright), t.color('primary')), {
      name: 'Icon tile',
      cornerRadius: 34,
      ...shadow(60, 0, t.shade('primary', 'rgba(163,230,53,0.6)')),
    }),
    icon('sparkles', 145, 205, 80, t.color('background'), { strokeWidth: 2 }),
    text(t.copy('intro'), 300, 190, 720, {
      fontFamily: t.font('body'),
      fontSize: 46,
      fontWeight: 400,
      fill: t.color('text'),
    }),
    text(t.copy('headline'), 300, 248, 720, {
      fontFamily: t.font('body'),
      fontSize: 46,
      fontWeight: 800,
      fill: t.color('text'),
    }),
    text(previous, 30, 560, 280, {
      fontFamily: t.font('heading'),
      fontSize: 190,
      fontWeight: 700,
      fill: t.shade('text', 'rgba(255,255,255,0.2)'),
      lineHeight: 1,
    }),
    text(next, 770, 560, 280, {
      fontFamily: t.font('heading'),
      fontSize: 190,
      fontWeight: 700,
      fill: t.shade('text', 'rgba(255,255,255,0.2)'),
      align: 'right',
      lineHeight: 1,
    }),
    text(current, 0, 500, W, {
      fontFamily: t.font('heading'),
      fontSize: 300,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1,
    }),
    [-3, -2, -1, 1, 2, 3].map((step) =>
      rotateNodes(step * 9, 540, 1500, [
        rect(535, 920, 10, 150, t.shade('text', 'rgba(255,255,255,0.55)'), {
          name: 'Tick',
          cornerRadius: 5,
        }),
      ]),
    ),
    rect(533, 900, 14, 230, linear(180, t.shade('primary', CITRON.bright), t.color('primary')), {
      name: 'Active tick',
      cornerRadius: 7,
      ...shadow(30, 0, t.color('primary')),
    }),
    circle(540, 1130, 22, t.color('primary'), {
      name: 'Pivot',
      ...shadow(40, 0, t.color('primary')),
    }),
    brandMark(t, 1250),
  ];
});

const versionSpec = {
  colors: {
    background: {
      value: CITRON.night,
      hint: 'Page, the sparkle on the card and the Update Now label',
    },
    surface: { value: '#2a2e20', hint: 'Envelope; its shades color the envelope front' },
    primary: {
      value: CITRON.lime,
      hint: 'Glow, card, Version 4.0, the Changelog outline and the Update Now button',
    },
    text: { value: CITRON.white, hint: 'is live now!, the Changelog label and brand' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Version 4.0' },
    subtitle: { label: 'Subtitle', value: 'is live now!' },
    buttons: { label: 'Button', value: ['Changelog', 'Update Now'] },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const versionLive = themed(W, H, versionSpec, (t) => {
  const [changelog = '', update = ''] = t.list('buttons');
  return [
    darkBg(t, H),
    limeGlow(t, 240, 100, 600, 700, 0.3),
    rect(290, 400, 500, 320, t.color('surface'), { name: 'Envelope back', cornerRadius: 26 }),
    rect(345, 270, 390, 300, linear(180, t.shade('primary', CITRON.bright), t.color('primary')), {
      name: 'Card',
      cornerRadius: 22,
      ...shadow(70, 0, t.shade('primary', 'rgba(163,230,53,0.7)')),
    }),
    icon('sparkles', 480, 330, 120, t.color('background'), { strokeWidth: 1.8 }),
    poly(
      [
        [290, 480],
        [540, 640],
        [790, 480],
        [790, 694],
        [764, 720],
        [316, 720],
        [290, 694],
      ],
      linear(180, t.shade('surface', '#3d4330'), t.shade('surface', '#1f2217')),
      { name: 'Envelope front' },
    ),
    text(t.copy('title'), 0, 790, W, {
      fontFamily: t.font('heading'),
      fontSize: 88,
      fontWeight: 800,
      fill: t.color('primary'),
      align: 'center',
    }),
    text(t.copy('subtitle'), 0, 895, W, {
      fontFamily: t.font('heading'),
      fontSize: 76,
      fontWeight: 500,
      fill: t.color('text'),
      align: 'center',
    }),
    button(t, changelog, 250, 1050, 270, false, 'Changelog button'),
    button(t, update, 560, 1050, 270, true, 'Update Now button'),
    brandMark(t, 1250),
  ];
});
