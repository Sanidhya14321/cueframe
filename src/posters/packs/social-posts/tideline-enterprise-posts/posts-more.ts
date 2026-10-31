import { linear } from '@/design';
import { avatar, icon, poly, rating, rect, type ThemeSpec, text, themed } from '../../../kit';
import { BODY, BRAND, brandMark, H, HEADING, ringArc, TIDE, W } from './posts';

const powerSpec = {
  colors: {
    background: {
      value: TIDE.teal,
      hint: 'Page gradient; its darker shade is the bottom of the gradient',
    },
    surface: {
      value: TIDE.white,
      hint: 'Word tag fills and outlines and the corner arc, all see-through',
    },
    text: { value: TIDE.white, hint: 'Headline, the words and the brand mark' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    intro: { label: 'Intro', value: 'Power Words for' },
    title: { label: 'Title', value: 'B2B Brands' },
    words: {
      label: 'Word',
      value: [
        'Proven',
        'Strategic',
        'Scalable',
        'Trusted',
        'Insightful',
        'Measurable',
        'Secure',
        'Adaptive',
        'Focused',
      ],
    },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const powerWords = themed(W, H, powerSpec, (t) => [
  rect(0, 0, W, H, linear(160, t.color('background'), t.shade('background', TIDE.sea)), {
    name: 'Background',
  }),
  ringArc(0, 1350, 300, 250, 270, 360, t.shade('surface', 'rgba(255,255,255,0.12)')),
  text(t.copy('intro'), 0, 250, W, {
    fontFamily: t.font('heading'),
    fontSize: 64,
    fontWeight: 600,
    fill: t.color('text'),
    align: 'center',
  }),
  text(t.copy('title'), 0, 330, W, {
    fontFamily: t.font('heading'),
    fontSize: 100,
    fontWeight: 800,
    fill: t.color('text'),
    align: 'center',
  }),
  t.list('words').map((word, index) => {
    const x = 90 + (index % 3) * 310;
    const y = 560 + Math.floor(index / 3) * 120;
    return [
      rect(x, y, 280, 88, t.shade('surface', 'rgba(255,255,255,0.12)'), {
        name: 'Word tag',
        cornerRadius: 12,
        stroke: t.shade('surface', 'rgba(255,255,255,0.55)'),
        strokeWidth: 2,
      }),
      text(word, x, y + 24, 280, {
        fontFamily: t.font('body'),
        fontSize: 32,
        fontWeight: 600,
        fill: t.color('text'),
        align: 'center',
      }),
    ];
  }),
  brandMark(t.copy('brand'), 0, 1210, W, t.color('text'), t.font('heading'), 'center'),
]);

const aheadSpec = {
  colors: {
    background: {
      value: '#04211f',
      hint: 'Page gradient; its darker shade is the bottom of the gradient',
    },
    primary: {
      value: TIDE.teal,
      hint: 'Progress bar and the gauge arc; its shades color the arc ends and the arrow',
    },
    text: {
      value: TIDE.white,
      hint: 'Brand mark, headline and the gauge needle; its muted shade colors the subline',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    brand: BRAND,
    headline: { label: 'Headline', value: 'Stay ahead\nof the curve' },
    subline: {
      label: 'Subline',
      value: 'Because tomorrow belongs to teams\nthat learn faster than the market.',
    },
  },
} as const satisfies ThemeSpec;

export const stayAhead = themed(W, H, aheadSpec, (t) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', TIDE.night)), {
    name: 'Background',
  }),
  rect(0, 0, 440, 16, t.color('primary'), { name: 'Progress bar' }),
  brandMark(t.copy('brand'), 80, 100, 600, t.color('text'), t.font('heading')),
  text(t.copy('headline'), 80, 190, 920, {
    fontFamily: t.font('heading'),
    fontSize: 116,
    fontWeight: 800,
    fill: t.color('text'),
    lineHeight: 1.05,
  }),
  text(t.copy('subline'), 80, 470, 900, {
    fontFamily: t.font('body'),
    fontSize: 36,
    fontWeight: 400,
    fill: t.shade('text', TIDE.grey),
    lineHeight: 1.4,
  }),
  ringArc(
    0,
    1350,
    640,
    450,
    270,
    360,
    linear(45, t.shade('primary', TIDE.sea), t.color('primary'), t.shade('primary', TIDE.aqua)),
  ),
  poly(
    [
      [0, 1320],
      [30, 1350],
      [430, 930],
    ],
    linear(45, t.shade('text', 'rgba(255,255,255,0.2)'), t.color('text')),
    { name: 'Needle' },
  ),
  icon('arrow-right', 880, 1150, 110, t.shade('primary', TIDE.aqua), { strokeWidth: 2.5 }),
]);

const FACES = ['woman-portrait-1', 'man-portrait-1', 'woman-portrait-5'] as const;

const clientsSpec = {
  colors: {
    background: {
      value: TIDE.deep,
      hint: 'Page gradient; its darker shade is the bottom of the gradient',
    },
    primary: {
      value: TIDE.aqua,
      hint: 'CLIENTS SAY and the corner arcs; its deeper shade colors the photo rings',
    },
    surface: {
      value: TIDE.white,
      hint: 'Review cards, WHAT OUR and the brand mark',
    },
    text: { value: TIDE.ink, hint: 'Reviewer names; its softer shade colors the quotes' },
    accent: { value: '#f5a524', hint: 'Star ratings' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'WHAT OUR' },
    highlight: { label: 'Highlighted title', value: 'CLIENTS SAY' },
    names: { label: 'Reviewer', value: ['Hana Okafor', 'Luis Ferrand', 'Mira Castell'] },
    quotes: {
      label: 'Quote',
      value: [
        'Onboarding took days, not months.\nOur pipeline doubled by Q3.',
        'Clear reporting and a team that\nanswers within the hour.',
        'Exactly the partner we needed to\nscale into new regions.',
      ],
    },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const clientsSay = themed(W, H, clientsSpec, (t) => {
  const quotes = t.list('quotes');
  return [
    rect(0, 0, W, H, linear(170, t.color('background'), t.shade('background', TIDE.night)), {
      name: 'Background',
    }),
    ringArc(
      1080,
      0,
      330,
      280,
      90,
      180,
      linear(90, t.shade('primary', TIDE.teal), t.color('primary')),
    ),
    ringArc(0, 1350, 260, 220, 270, 360, t.shade('primary', 'rgba(94,234,212,0.4)')),
    text(t.copy('title'), 0, 130, W, {
      fontFamily: t.font('heading'),
      fontSize: 84,
      fontWeight: 800,
      fill: t.color('surface'),
      align: 'center',
      lineHeight: 1,
    }),
    text(t.copy('highlight'), 0, 225, W, {
      fontFamily: t.font('heading'),
      fontSize: 84,
      fontWeight: 800,
      fill: t.color('primary'),
      align: 'center',
      lineHeight: 1,
    }),
    t.list('names').map((name, index) => {
      const y = 410 + index * 250;
      return [
        rect(110, y, 860, 210, t.shade('surface', 'rgba(255,255,255,0.96)'), {
          name: 'Review card',
          cornerRadius: 28,
        }),
        avatar(FACES[index] ?? 'woman-portrait-1', 205, y + 105, 58, t.shade('primary', TIDE.teal)),
        text(name, 295, y + 40, 360, {
          fontFamily: t.font('heading'),
          fontSize: 32,
          fontWeight: 700,
          fill: t.color('text'),
        }),
        rating(720, y + 44, 30, 5, t.color('accent')),
        text(quotes[index] ?? '', 295, y + 92, 640, {
          fontFamily: t.font('body'),
          fontSize: 27,
          fontWeight: 400,
          fill: t.shade('text', '#475b59'),
          lineHeight: 1.35,
        }),
      ];
    }),
    brandMark(t.copy('brand'), 0, 1230, W, t.color('surface'), t.font('heading'), 'center'),
  ];
});

const statSpec = {
  colors: {
    background: {
      value: '#f5f9f8',
      hint: 'Page gradient; its shades color the bottom of the gradient, the empty ring and the button label',
    },
    primary: {
      value: TIDE.teal,
      hint: 'The 68% stat and the filled ring; its darker shade colors the survey note and brand mark',
    },
    text: { value: TIDE.ink, hint: 'Stat line and the Learn More button' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    stat: { label: 'Stat', value: '68%' },
    line: { label: 'Stat line', value: 'of buyers expect a\ntailored journey.' },
    note: { label: 'Ring note', value: 'Survey of 1,200\nB2B buyers' },
    cta: { label: 'Button', value: 'Learn More' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const statRing = themed(W, H, statSpec, (t) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', '#dfecea')), {
    name: 'Background',
  }),
  text(t.copy('stat'), 80, 90, 400, {
    fontFamily: t.font('heading'),
    fontSize: 150,
    fontWeight: 800,
    fill: t.color('primary'),
    lineHeight: 1,
  }),
  text(t.copy('line'), 440, 110, 600, {
    fontFamily: t.font('heading'),
    fontSize: 54,
    fontWeight: 600,
    fill: t.color('text'),
    lineHeight: 1.2,
  }),
  ringArc(540, 800, 340, 230, 0, 359.9, t.shade('background', '#c3d3d0')),
  ringArc(
    540,
    800,
    340,
    230,
    -90,
    155,
    linear(120, t.shade('primary', TIDE.aqua), t.color('primary'), t.shade('primary', TIDE.sea)),
  ),
  text(t.copy('note'), 340, 760, 400, {
    fontFamily: t.font('body'),
    fontSize: 32,
    fontWeight: 600,
    fill: t.shade('primary', TIDE.sea),
    align: 'center',
    lineHeight: 1.3,
  }),
  rect(80, 1220, 240, 64, t.color('text'), { name: 'Button', cornerRadius: 32 }),
  text(t.copy('cta'), 80, 1237, 240, {
    fontFamily: t.font('body'),
    fontSize: 26,
    fontWeight: 600,
    fill: t.shade('background', TIDE.white),
    align: 'center',
  }),
  brandMark(
    t.copy('brand'),
    560,
    1236,
    440,
    t.shade('primary', TIDE.sea),
    t.font('heading'),
    'right',
  ),
]);
