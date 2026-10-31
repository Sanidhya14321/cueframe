import { linear } from '@/design';
import {
  icon,
  type Nodes,
  photo,
  place,
  poly,
  polygon,
  rect,
  STORY_SIZE,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY, bold, CORAL, type CoralPalette, DISPLAY, HEADING, S, SITE, site } from './posts';

const creativitySpec = {
  colors: {
    background: { value: CORAL.paper, hint: 'Page' },
    primary: { value: CORAL.primary, hint: 'CREATIVITY' },
    text: {
      value: CORAL.ink,
      hint: 'Pillar and the two side lines; its lighter shade colors the website',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'CREATIVITY' },
    left: { label: 'Left line', value: 'is not talent' },
    right: { label: 'Right line', value: 'but attitude' },
    site: SITE,
  },
} as const satisfies ThemeSpec;

export const creativity = themed(S, S, creativitySpec, (t) => [
  rect(0, 0, S, S, t.color('background'), { name: 'Background' }),
  rect(450, 70, 180, 330, t.color('text'), { cornerRadius: 22, name: 'Pillar' }),
  bold(t.copy('title'), 0, 300, 124, t.color('primary'), t.font('heading'), 'center', S),
  text(t.copy('left'), 80, 470, 300, {
    fontFamily: t.font('heading'),
    fontSize: 34,
    fontWeight: 600,
    fill: t.color('text'),
  }),
  text(t.copy('right'), 700, 470, 300, {
    fontFamily: t.font('heading'),
    fontSize: 34,
    fontWeight: 600,
    fill: t.color('text'),
    align: 'right',
  }),
  photo('woman-portrait-3', 330, 540, 420, 540, { cornerRadius: 30 }),
  site(t.copy('site'), 80, 980, t.shade('text', '#6b6470'), t.font('body')),
]);

const seatSpec = {
  colors: {
    background: { value: CORAL.ink, hint: "Page and the word IT'S" },
    primary: { value: CORAL.primary, hint: 'Box behind TIME and the website' },
    text: {
      value: CORAL.paper,
      hint: "Spotlight, armchair, the box behind IT'S, TIME and TO TAKE THAT SEAT; its muted shade colors the body",
    },
  },
  fonts: { display: DISPLAY, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: "IT'S" },
    highlight: { label: 'Highlighted word', value: 'TIME' },
    title: { label: 'Title', value: 'TO TAKE\nTHAT SEAT' },
    body: {
      label: 'Body',
      value: 'Lead the room. We build the\nbrand that gets you invited.',
    },
    site: SITE,
  },
} as const satisfies ThemeSpec;

export const takeTheSeat = themed(S, S, seatSpec, (t) => [
  rect(0, 0, S, S, t.color('background'), { name: 'Background' }),
  polygon(
    3,
    120,
    40,
    520,
    960,
    linear(
      180,
      t.shade('text', 'rgba(255,255,255,0.04)'),
      t.shade('text', 'rgba(255,255,255,0.3)'),
    ),
    { rotation: -12, name: 'Spotlight' },
  ),
  icon('armchair', 210, 690, 280, t.color('text'), { strokeWidth: 1.4 }),
  rect(600, 120, 170, 76, t.color('text'), { name: 'Label' }),
  text(t.copy('kicker'), 600, 128, 170, {
    fontFamily: t.font('display'),
    fontSize: 52,
    fontWeight: 400,
    fill: t.color('background'),
    align: 'center',
  }),
  rect(600, 210, 240, 96, t.color('primary'), { name: 'Label' }),
  text(t.copy('highlight'), 600, 214, 240, {
    fontFamily: t.font('display'),
    fontSize: 76,
    fontWeight: 400,
    fill: t.color('text'),
    align: 'center',
  }),
  text(t.copy('title'), 600, 320, 420, {
    fontFamily: t.font('display'),
    fontSize: 96,
    fontWeight: 400,
    fill: t.color('text'),
    lineHeight: 1,
  }),
  text(t.copy('body'), 600, 560, 440, {
    fontFamily: t.font('body'),
    fontSize: 28,
    fontWeight: 400,
    fill: t.shade('text', '#cfc8d4'),
    lineHeight: 1.45,
  }),
  site(t.copy('site'), 600, 960, t.color('primary'), t.font('body')),
]);

const momentSpec = (p: CoralPalette) =>
  ({
    colors: {
      background: { value: p.paper, hint: 'Page and the word TRUST' },
      primary: { value: p.primary, hint: 'Accent rule and US.' },
      text: {
        value: p.ink,
        hint: 'Hourglass, headline, body and the box behind TRUST',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'EVERY MOMENT\nCOUNTS' },
      body: {
        label: 'Body',
        value: 'Being on time is not just polite.\nIt is a competitive edge.',
      },
      label: { label: 'Label', value: 'TRUST' },
      closing: { label: 'Closing word', value: 'US.' },
    },
  }) as const satisfies ThemeSpec;

export const everyMoment = (p: CoralPalette) =>
  themed(S, S, momentSpec(p), (t) => [
    rect(0, 0, S, S, t.color('background'), { name: 'Background' }),
    icon('hourglass', 20, 130, 560, t.color('text'), { strokeWidth: 1.1 }),
    bold(t.copy('title'), 560, 300, 54, t.color('text'), t.font('heading'), 'left', 460),
    text(t.copy('body'), 560, 440, 470, {
      fontFamily: t.font('body'),
      fontSize: 27,
      fontWeight: 500,
      fill: t.color('text'),
      lineHeight: 1.45,
    }),
    rect(560, 560, 120, 6, t.color('primary'), { name: 'Accent rule' }),
    rect(780, 860, 150, 60, t.color('text'), { cornerRadius: 10, name: 'Label' }),
    text(t.copy('label'), 780, 870, 150, {
      fontFamily: t.font('heading'),
      fontSize: 32,
      fontWeight: 800,
      fill: t.color('background'),
      align: 'center',
    }),
    bold(t.copy('closing'), 860, 920, 90, t.color('primary'), t.font('heading'), 'left', 200),
  ]);

const seoSpec = (p: CoralPalette) =>
  ({
    colors: {
      background: { value: p.paper, hint: 'Page and the SEO watermark' },
      primary: { value: p.primary, hint: 'Side band and Insights' },
      text: { value: p.ink, hint: 'Gain Valuable and the body' },
    },
    fonts: { heading: HEADING, display: DISPLAY, body: BODY },
    copy: {
      watermark: { label: 'Watermark', value: 'SEO  SEO  SEO' },
      headline: { label: 'Headline', value: 'Gain Valuable' },
      title: { label: 'Highlighted line', value: 'Insights' },
      body: { label: 'Body', value: 'Spark, sharpen and scale\nyour conversions.' },
    },
  }) as const satisfies ThemeSpec;

export const seoInsights = (p: CoralPalette) =>
  themed(S, S, seoSpec(p), (t) => [
    rect(0, 0, S, S, t.color('background'), { name: 'Background' }),
    rect(70, 0, 190, S, t.color('primary'), { name: 'Band' }),
    text(t.copy('watermark'), 105, 1050, 1020, {
      fontFamily: t.font('display'),
      fontSize: 150,
      fontWeight: 400,
      fill: t.color('background'),
      rotation: -90,
      lineHeight: 1,
    }),
    photo('woman-portrait-1', 330, 80, 680, 560, { cornerRadius: 30 }),
    bold(t.copy('headline'), 330, 690, 72, t.color('text'), t.font('heading')),
    bold(t.copy('title'), 330, 772, 72, t.color('primary'), t.font('heading')),
    text(t.copy('body'), 330, 890, 680, {
      fontFamily: t.font('body'),
      fontSize: 32,
      fontWeight: 500,
      fill: t.color('text'),
      lineHeight: 1.4,
    }),
  ]);

const DARK_BULB = 2;

const nextLevelSpec = {
  colors: {
    background: { value: CORAL.primary, hint: 'Page' },
    surface: { value: CORAL.paper, hint: 'The two light bulbs and TAKE YOUR BUSINESS TO' },
    text: {
      value: CORAL.ink,
      hint: 'Cords, the dark bulb, the box behind TAKE YOUR BUSINESS TO, NEXT LEVEL and the join line',
    },
  },
  fonts: { heading: HEADING },
  copy: {
    kicker: { label: 'Kicker', value: 'TAKE YOUR BUSINESS TO' },
    title: { label: 'Title', value: 'NEXT LEVEL' },
    cta: { label: 'Call to action', value: 'Join Halcyon Studio' },
  },
} as const satisfies ThemeSpec;

const nextLevelNodes = (
  t: Pick<Theme<typeof nextLevelSpec>, 'color' | 'font' | 'copy'>,
): Nodes[] => [
  rect(0, 0, S, S, t.color('background'), { name: 'Background' }),
  [300, 540, 780].map((x, index) => [
    rect(x - 2, 0, 4, 210, t.color('text'), { name: 'Cord' }),
    icon(
      'lightbulb',
      x + 65,
      340,
      130,
      index === DARK_BULB ? t.color('text') : t.color('surface'),
      {
        rotation: 180,
        strokeWidth: 1.8,
      },
    ),
  ]),
  rect(80, 560, 760, 96, t.color('text'), { cornerRadius: 10, name: 'Label' }),
  text(t.copy('kicker'), 104, 578, 720, {
    fontFamily: t.font('heading'),
    fontSize: 50,
    fontWeight: 800,
    fill: t.color('surface'),
  }),
  bold(t.copy('title'), 80, 680, 140, t.color('text'), t.font('heading')),
  text(t.copy('cta'), 80, 950, 600, {
    fontFamily: t.font('heading'),
    fontSize: 32,
    fontWeight: 600,
    fill: t.color('text'),
  }),
];

export const nextLevel = themed(S, S, nextLevelSpec, nextLevelNodes);

const nextLevelStorySpec = {
  ...nextLevelSpec,
  colors: {
    ...nextLevelSpec.colors,
    text: {
      value: CORAL.ink,
      hint: 'Cords, the dark bulb, the box behind TAKE YOUR BUSINESS TO, NEXT LEVEL, the join line and Swipe up to start',
    },
  },
  copy: {
    ...nextLevelSpec.copy,
    swipe: { label: 'Swipe prompt', value: 'Swipe up to start' },
  },
} as const satisfies ThemeSpec;

export const nextLevelStory = themed(
  STORY_SIZE.width,
  STORY_SIZE.height,
  nextLevelStorySpec,
  (t) => [
    rect(0, 0, STORY_SIZE.width, STORY_SIZE.height, t.color('background'), {
      name: 'Background',
    }),
    place(0, 420, STORY_SIZE.width / S, nextLevelNodes(t)),
    text(t.copy('swipe'), 0, 1640, STORY_SIZE.width, {
      fontFamily: t.font('heading'),
      fontSize: 48,
      fontWeight: 700,
      fill: t.color('text'),
      align: 'center',
    }),
  ],
);

const didYouKnowSpec = {
  colors: {
    background: { value: CORAL.ink, hint: 'Page and the fact on the speech card' },
    primary: { value: CORAL.primary, hint: 'Question mark and the website' },
    surface: { value: CORAL.paper, hint: 'Speech card and its tail' },
    text: { value: CORAL.paper, hint: 'DID YOU KNOW? title' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'DID YOU\nKNOW?' },
    mark: { label: 'Question mark', value: '?' },
    fact: { label: 'Fact', value: 'Brands that post every week\nwin 3x more inbound leads.' },
    site: SITE,
  },
} as const satisfies ThemeSpec;

export const didYouKnow = themed(S, S, didYouKnowSpec, (t) => [
  rect(0, 0, S, S, t.color('background'), { name: 'Background' }),
  bold(t.copy('title'), 80, 100, 116, t.color('text'), t.font('heading'), 'left', 640),
  text(t.copy('mark'), 780, 40, 260, {
    fontFamily: t.font('heading'),
    fontSize: 300,
    fontWeight: 900,
    fill: t.color('primary'),
    align: 'center',
  }),
  photo('woman-portrait-2', 560, 380, 440, 620, { cornerRadius: 30 }),
  rect(80, 470, 520, 300, t.color('surface'), { cornerRadius: 28, name: 'Speech card' }),
  poly(
    [
      [480, 760],
      [580, 760],
      [600, 840],
    ],
    t.color('surface'),
    { name: 'Speech tail' },
  ),
  text(t.copy('fact'), 120, 530, 450, {
    fontFamily: t.font('heading'),
    fontSize: 36,
    fontWeight: 700,
    fill: t.color('background'),
    lineHeight: 1.35,
  }),
  site(t.copy('site'), 80, 980, t.color('primary'), t.font('body')),
]);
