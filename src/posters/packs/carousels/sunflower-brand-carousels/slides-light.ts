import { linear } from '@/design';
import { avatar, icon, line, poly, rect, type ThemeSpec, themed } from '../../../kit';
import { BODY_FONT, creamBackground, H, HEADING_FONT, SUN, say, swipeArrow, W } from './palette';

const FONTS = { heading: HEADING_FONT, body: BODY_FONT } as const;

const consistencySpec = {
  colors: {
    background: { value: SUN.cream, hint: 'Cream page gradient' },
    primary: {
      value: SUN.gold,
      hint: 'Big arrow, the warm glow and, in its darker shade, the Why Your Brand Needs title and the verified badge',
    },
    text: {
      value: SUN.ink,
      hint: 'Author name and Consistency?; its grey shade colors the author handle',
    },
  },
  fonts: FONTS,
  copy: {
    name: { label: 'Author', value: 'Leo Hart' },
    handle: { label: 'Handle', value: '@leohartbrand' },
    title: { label: 'Title', value: 'Why Your\nBrand Needs' },
    highlight: { label: 'Highlight', value: 'Consistency?' },
  },
} as const satisfies ThemeSpec;

export const consistencyCover = themed(W, H, consistencySpec, (t) => {
  const heading = say(t.font('heading'));
  const body = say(t.font('body'));
  const arrowFill = linear(135, t.shade('primary', SUN.sun), t.color('primary'));
  return [
    creamBackground(t),
    avatar('man-portrait-2', 140, 150, 52),
    body(t.copy('name'), 210, 110, 300, 34, t.color('text'), 800),
    icon('badge-check', 370, 113, 32, t.shade('primary', SUN.amber), { strokeWidth: 2.2 }),
    body(t.copy('handle'), 210, 154, 400, 28, t.shade('text', SUN.muted), 500),
    heading(t.copy('title'), 90, 380, 900, 100, t.shade('primary', SUN.amber), 800, {
      lineHeight: 1.05,
    }),
    heading(t.copy('highlight'), 90, 590, 950, 100, t.color('text'), 800, { lineHeight: 1.05 }),
    poly(
      [
        [600, 860],
        [680, 780],
        [920, 1020],
        [840, 1100],
      ],
      arrowFill,
      { name: 'Arrow shaft' },
    ),
    poly(
      [
        [1000, 1180],
        [1000, 900],
        [720, 1180],
      ],
      arrowFill,
      { name: 'Arrow head' },
    ),
  ];
});

const smarterSpec = {
  colors: {
    background: { value: SUN.cream, hint: 'Cream page gradient' },
    primary: {
      value: SUN.amber,
      hint: 'First title line and the check boxes; its light shade is the warm glow',
    },
    text: { value: SUN.ink, hint: 'Second title line, the list items and the swipe arrow' },
  },
  fonts: FONTS,
  copy: {
    title: { label: 'Title', value: "Don't post more," },
    subtitle: { label: 'Second title line', value: 'post smarter' },
    items: {
      label: 'List item',
      value: [
        'Share real results',
        'Show the process',
        'Teach one useful idea',
        'Spotlight client wins',
        'Document your journey',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const smarterSlide = themed(W, H, smarterSpec, (t) => {
  const heading = say(t.font('heading'));
  const body = say(t.font('body'));
  return [
    creamBackground(t),
    heading(t.copy('title'), 90, 230, 940, 78, t.color('primary'), 800, {
      lineHeight: 1.1,
    }),
    heading(t.copy('subtitle'), 90, 320, 940, 78, t.color('text'), 800, { lineHeight: 1.1 }),
    t.list('items').map((item, index) => [
      icon('square-check', 90, 500 + index * 104, 52, t.color('primary'), {
        strokeWidth: 2.2,
      }),
      body(item, 170, 503 + index * 104, 800, 44, t.color('text'), 500),
    ]),
    swipeArrow(t.color('text')),
  ];
});

const loopSpec = {
  colors: {
    background: { value: SUN.cream, hint: 'Cream page gradient' },
    primary: {
      value: SUN.amber,
      hint: 'The Simple line and the loop arrows; its light shade is the warm glow',
    },
    surface: { value: SUN.white, hint: 'Loop step pills' },
    text: {
      value: SUN.ink,
      hint: 'Growth Loop, the pill outlines and words and the swipe arrow',
    },
  },
  fonts: FONTS,
  copy: {
    title: { label: 'Title', value: 'The Simple' },
    subtitle: { label: 'Second title line', value: 'Growth Loop' },
    steps: { label: 'Loop step', value: ['Hook', 'Value', 'Trust', 'Offer'] },
  },
} as const satisfies ThemeSpec;

const LOOP_PILLS = [
  [540, 560],
  [820, 760],
  [540, 960],
  [260, 760],
] as const;

const LOOP_ARROWS = [
  [690, 590, 45],
  [860, 840, 135],
  [450, 1000, 225],
  [250, 680, 315],
] as const;

export const loopSlide = themed(W, H, loopSpec, (t) => {
  const heading = say(t.font('heading'));
  const steps = t.list('steps');
  return [
    creamBackground(t),
    heading(t.copy('title'), 90, 200, 900, 84, t.color('primary'), 800, {
      lineHeight: 1.1,
    }),
    heading(t.copy('subtitle'), 90, 296, 900, 84, t.color('text'), 800, { lineHeight: 1.1 }),
    LOOP_PILLS.map(([cx, cy], index) => {
      const label = steps[index] ?? '';
      return [
        rect(cx - 120, cy - 44, 240, 88, t.color('surface'), {
          name: `${label} pill`,
          cornerRadius: 44,
          stroke: t.color('text'),
          strokeWidth: 3,
        }),
        say(t.font('body'))(label, cx - 120, cy - 22, 240, 36, t.color('text'), 600, {
          align: 'center',
          lineHeight: 1.2,
        }),
      ];
    }),
    LOOP_ARROWS.map(([x, y, rotation]) =>
      line(x, y, 90, t.color('primary'), 6, {
        name: 'Loop arrow',
        arrowEnd: true,
        rotation,
      }),
    ),
    swipeArrow(t.color('text')),
  ];
});

const strategySpec = {
  colors: {
    background: { value: SUN.cream, hint: 'Cream page gradient' },
    primary: {
      value: SUN.amber,
      hint: 'Content Strategy, the Strategic heading and the check marks; its light shade is the warm glow',
    },
    surface: { value: SUN.white, hint: 'Comparison table' },
    text: {
      value: SUN.ink,
      hint: 'Beats Repetition, the table lines, the strategic rows and the swipe arrow; its grey shade colors the repetitive side',
    },
    accent: { value: '#c2410c', hint: 'Cross marks on the repetitive side' },
  },
  fonts: FONTS,
  copy: {
    title: { label: 'Title', value: 'Content Strategy' },
    subtitle: { label: 'Second title line', value: 'Beats Repetition' },
    left: { label: 'Left heading', value: 'Repetitive' },
    right: { label: 'Right heading', value: 'Strategic' },
    before: {
      label: 'Repetitive row',
      value: ['Posts without a plan', 'Same idea every day', 'Random visuals', 'No call to action'],
    },
    after: {
      label: 'Strategic row',
      value: [
        'Clear weekly themes',
        'One idea, many angles',
        'A recognisable look',
        'One clear next step',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const strategySlide = themed(W, H, strategySpec, (t) => {
  const heading = say(t.font('heading'));
  const body = say(t.font('body'));
  const after = t.list('after');
  const amber = t.color('primary');
  const muted = t.shade('text', SUN.muted);
  return [
    creamBackground(t),
    heading(t.copy('title'), 90, 170, 900, 76, amber, 800, { lineHeight: 1.1 }),
    heading(t.copy('subtitle'), 90, 258, 900, 76, t.color('text'), 800, { lineHeight: 1.1 }),
    rect(90, 430, 900, 640, t.color('surface'), {
      name: 'Table',
      cornerRadius: 24,
      stroke: t.color('text'),
      strokeWidth: 3,
    }),
    rect(540, 430, 3, 640, t.color('text'), { name: 'Column rule' }),
    rect(90, 530, 900, 3, t.color('text'), { name: 'Header rule' }),
    heading(t.copy('left'), 90, 458, 450, 40, muted, 700, { align: 'center' }),
    heading(t.copy('right'), 540, 458, 450, 40, amber, 800, { align: 'center' }),
    t
      .list('before')
      .map((left, index) => [
        icon('x', 120, 580 + index * 120, 36, t.color('accent'), { strokeWidth: 2.6 }),
        body(left, 170, 578 + index * 120, 360, 32, muted, 500),
        icon('check', 570, 580 + index * 120, 36, amber, { strokeWidth: 2.8 }),
        body(after[index] ?? '', 620, 578 + index * 120, 360, 32, t.color('text'), 600),
      ]),
    swipeArrow(t.color('text')),
  ];
});
