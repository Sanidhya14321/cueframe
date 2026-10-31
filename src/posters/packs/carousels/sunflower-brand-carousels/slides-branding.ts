import { circle, ellipse, icon, type Nodes, rect, type ThemeSpec, themed } from '../../../kit';
import { BODY_FONT, creamBackground, H, HEADING_FONT, type Paint, SUN, say, W } from './palette';

const FONTS = { heading: HEADING_FONT, body: BODY_FONT } as const;

type BrandingTheme = Paint<'background' | 'primary' | 'surface' | 'text', 'heading' | 'body'>;

const SWIPE = { label: 'Swipe label', value: 'SWIPE' } as const;

const brandingColors = (primary: string, text: string) =>
  ({
    background: { value: SUN.cream, hint: 'Cream page gradient' },
    primary: { value: SUN.gold, hint: primary },
    surface: { value: SUN.white, hint: 'Swipe chip and the arrow inside it' },
    text: { value: SUN.ink, hint: text },
  }) as const;

const gridPaper = (t: BrandingTheme) => {
  const gridLine = t.shade('text', 'rgba(28,27,31,0.05)');
  return [
    creamBackground(t),
    Array.from({ length: 13 }, (_, index) =>
      rect(30 + index * 85, 0, 2, H, gridLine, { name: 'Grid line' }),
    ),
    Array.from({ length: 16 }, (_, index) =>
      rect(0, 40 + index * 85, W, 2, gridLine, { name: 'Grid line' }),
    ),
  ];
};

const progress = (t: BrandingTheme, active: number) =>
  [0, 1, 2, 3].map((index) =>
    rect(
      780 + index * 56,
      90,
      40,
      40,
      index <= active ? t.color('primary') : t.shade('primary', 'rgba(245,168,0,0.25)'),
      { name: 'Progress square', cornerRadius: 8 },
    ),
  );

const swipeChip = (t: BrandingTheme, label: string) => [
  rect(820, 1180, 170, 64, t.color('surface'), {
    name: 'Swipe chip',
    cornerRadius: 12,
    stroke: t.color('text'),
    strokeWidth: 2,
  }),
  say(t.font('body'))(label, 836, 1196, 100, 26, t.color('text'), 800, { letterSpacing: 2 }),
  circle(950, 1212, 18, t.color('text')),
  icon('arrow-right', 938, 1200, 24, t.color('surface'), { strokeWidth: 3 }),
];

const coverSpec = {
  colors: brandingColors(
    'Progress squares, the scribbled circle, the warm glow and, in its darker shade, the Branding word',
    'What does and do for you?, the grid lines and the swipe chip outline, label and dot; its grey shade colors the explanation',
  ),
  fonts: FONTS,
  copy: {
    lead: { label: 'Lead line', value: 'What does' },
    highlight: { label: 'Highlight', value: 'Branding' },
    closing: { label: 'Closing line', value: 'do for you?' },
    body: {
      label: 'Explanation',
      value: 'Branding is more than a logo.\nIt is how people feel about your business.',
    },
    swipe: SWIPE,
  },
} as const satisfies ThemeSpec;

export const brandingCover = themed(W, H, coverSpec, (t) => {
  const heading = say(t.font('heading'));
  const big = { align: 'center', lineHeight: 1.1 } as const;
  return [
    gridPaper(t),
    progress(t, 0),
    heading(t.copy('lead'), 0, 380, W, 92, t.color('text'), 800, big),
    ellipse(250, 470, 580, 140, t.shade('primary', 'rgba(0,0,0,0)'), {
      name: 'Scribble circle',
      stroke: t.color('primary'),
      strokeWidth: 6,
      rotation: -3,
    }),
    heading(t.copy('highlight'), 0, 482, W, 92, t.shade('primary', SUN.amber), 800, big),
    heading(t.copy('closing'), 0, 584, W, 92, t.color('text'), 800, big),
    say(t.font('body'))(t.copy('body'), 0, 790, W, 34, t.shade('text', SUN.muted), 500, {
      align: 'center',
      lineHeight: 1.5,
    }),
    swipeChip(t, t.copy('swipe')),
  ];
});

const brandingStep = (
  t: BrandingTheme,
  active: number,
  title: string,
  swipe: string,
  body: Nodes[],
) => [
  gridPaper(t),
  progress(t, active),
  say(t.font('heading'))(title, 90, 260, 900, 80, t.color('text'), 800, { lineHeight: 1.1 }),
  rect(90, 470, 140, 10, t.color('primary'), { name: 'Underline', cornerRadius: 5 }),
  body,
  swipeChip(t, swipe),
];

const imageSpec = {
  colors: brandingColors(
    'Progress squares, the title underline and the warm glow',
    'Title, the bullets and benefits, the grid lines and the swipe chip outline, label and dot; its grey shade colors the intro',
  ),
  fonts: FONTS,
  copy: {
    title: { label: 'Title', value: 'Branding Helps\nBuild Your Image' },
    intro: { label: 'Intro', value: 'This helps you:' },
    items: {
      label: 'Benefit',
      value: ['Look premium from day one', 'Attract the right buyers', 'Grow steady demand'],
    },
    swipe: SWIPE,
  },
} as const satisfies ThemeSpec;

export const brandingImage = themed(W, H, imageSpec, (t) => {
  const body = say(t.font('body'));
  return brandingStep(t, 1, t.copy('title'), t.copy('swipe'), [
    body(t.copy('intro'), 90, 540, 800, 38, t.shade('text', SUN.muted), 600),
    t
      .list('items')
      .map((item, index) => [
        circle(110, 650 + index * 90, 12, t.color('text')),
        body(item, 150, 628 + index * 90, 800, 40, t.color('text'), 500),
      ]),
  ]);
});

const versusSpec = {
  colors: brandingColors(
    'Progress squares, the title underline, the warm glow and, in its darker shade, the Strong column heading and underline',
    'Title, the column items, the divider, the grid lines and the swipe chip outline, label and dot; its grey shade colors the Weak heading and underline',
  ),
  fonts: FONTS,
  copy: {
    title: { label: 'Title', value: 'Strong Brand\nvs Weak Brand' },
    strong: { label: 'Strong heading', value: 'Strong' },
    strongItems: { label: 'Strong trait', value: ['Consistent', 'Clear message', 'Memorable'] },
    weak: { label: 'Weak heading', value: 'Weak' },
    weakItems: { label: 'Weak trait', value: ['Scattered', 'Mixed message', 'Forgettable'] },
    swipe: SWIPE,
  },
} as const satisfies ThemeSpec;

export const brandingVersus = themed(W, H, versusSpec, (t) => {
  const column = (title: string, items: readonly string[], x: number, accent: string) => [
    say(t.font('heading'))(title, x, 560, 400, 46, accent, 800, { align: 'center' }),
    rect(x + 120, 625, 160, 6, accent, { name: 'Underline', cornerRadius: 3 }),
    items.map((item, index) =>
      say(t.font('body'))(item, x, 670 + index * 76, 400, 36, t.color('text'), 500, {
        align: 'center',
      }),
    ),
  ];
  return brandingStep(t, 2, t.copy('title'), t.copy('swipe'), [
    column(t.copy('strong'), t.list('strongItems'), 90, t.shade('primary', SUN.amber)),
    rect(538, 560, 3, 330, t.shade('text', 'rgba(28,27,31,0.2)'), { name: 'Divider' }),
    column(t.copy('weak'), t.list('weakItems'), 590, t.shade('text', SUN.muted)),
  ]);
});

const salespersonSpec = {
  colors: brandingColors(
    'Progress squares, the title underline and the warm glow',
    'Title, the explanation, the grid lines and the swipe chip outline, label and dot',
  ),
  fonts: FONTS,
  copy: {
    title: { label: 'Title', value: 'Your Brand Is Your\nSilent Salesperson' },
    body: {
      label: 'Explanation',
      value: 'Before a buyer ever talks to\nyou, your brand has already\nmade the first pitch.',
    },
    swipe: SWIPE,
  },
} as const satisfies ThemeSpec;

export const brandingSalesperson = themed(W, H, salespersonSpec, (t) =>
  brandingStep(t, 3, t.copy('title'), t.copy('swipe'), [
    say(t.font('body'))(t.copy('body'), 90, 540, 880, 44, t.color('text'), 500, {
      lineHeight: 1.45,
    }),
  ]),
);
