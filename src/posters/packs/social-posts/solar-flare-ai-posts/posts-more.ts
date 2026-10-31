import { linear } from '@/design';
import {
  circle,
  icon,
  POST_SIZE,
  path,
  photo,
  rect,
  STORY_SIZE,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  BODY,
  buildPatterns,
  CLEAR,
  FLARE,
  glow,
  gridFloor,
  H,
  HEAD,
  headline,
  percentCharged,
  solutionsAmber,
  W,
} from './posts';
import { newPage } from './posts-launch';
import { blueprint, builtForPower } from './posts-power';

const adsSpec = {
  colors: {
    background: {
      value: FLARE.black,
      hint: 'Page; its warm shade is the bottom of the page gradient',
    },
    primary: {
      value: FLARE.amber,
      hint: '6x, the growth line and the grid floor; its shades color the glow, the line glow and the peak halo',
    },
    text: { value: FLARE.white, hint: 'Generate, the headline and the peak dot' },
  },
  fonts: { heading: HEAD },
  copy: {
    lead: { label: 'Lead', value: 'Generate' },
    stat: { label: 'Stat', value: '6x' },
    headline: { label: 'Headline', value: 'more results\nfrom your Ads' },
  },
} as const satisfies ThemeSpec;

export const adsGrowth = themed(W, H, adsSpec, (t) => {
  const clear = t.shade('background', CLEAR);
  return [
    rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', '#140d07')), {
      name: 'Background',
    }),
    glow(920, 560, 150, t.shade('primary', 'rgba(255,182,72,0.35)'), clear),
    text(t.copy('lead'), 80, 140, 500, {
      fontFamily: t.font('heading'),
      fontSize: 84,
      fontWeight: 500,
      fill: t.color('text'),
    }),
    text(t.copy('stat'), 520, 140, 300, {
      fontFamily: t.font('heading'),
      fontSize: 84,
      fontWeight: 800,
      fill: t.color('primary'),
    }),
    headline(t.font('heading'), t.copy('headline'), 240, 84, t.color('text'), 500, 80, 900, 'left'),
    gridFloor(1080, 1350, t.shade('primary', 'rgba(255,182,72,0.45)'), clear),
    path(
      'M 0 1000 C 120 1040 200 1060 300 960 S 460 820 560 930 S 760 1000 820 820 S 900 600 940 560',
      0,
      0,
      W,
      H,
      clear,
      POST_SIZE,
      {
        name: 'Growth line',
        stroke: t.color('primary'),
        strokeWidth: 10,
        ...shadow(24, 0, t.shade('primary', FLARE.orange)),
      },
    ),
    circle(940, 560, 26, t.color('text'), {
      name: 'Peak',
      ...shadow(40, 0, t.shade('primary', 'rgba(255,182,72,1)')),
    }),
  ];
});

const clockSpec = {
  colors: {
    background: { value: FLARE.black, hint: 'Page' },
    surface: {
      value: FLARE.panel,
      hint: 'Clock panels; its darker shade is the bottom of the panels',
    },
    primary: {
      value: FLARE.amber,
      hint: 'Colon dots and Minutes; its orange shade colors the glow',
    },
    text: {
      value: FLARE.white,
      hint: 'Clock digits and saved with AI; its shades color the panel borders and the last line',
    },
  },
  fonts: {
    clock: { label: 'Clock font', value: 'VT323' },
    heading: HEAD,
    body: BODY,
  },
  copy: {
    digits: { label: 'Clock digits', value: ['02', '47'] },
    unit: { label: 'Unit', value: 'Minutes' },
    headline: { label: 'Headline', value: 'saved with AI' },
    detail: { label: 'Detail', value: 'per report, every single day' },
  },
} as const satisfies ThemeSpec;

const clockSaved = themed(W, H, clockSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  glow(540, 620, 520, t.shade('primary', 'rgba(255,106,26,0.25)'), t.shade('background', CLEAR)),
  t.list('digits').map((digits, index) => {
    const x = 120 + index * 460;
    return [
      rect(x, 440, 380, 330, linear(180, t.color('surface'), t.shade('surface', FLARE.coal)), {
        name: 'Clock panel',
        cornerRadius: 28,
        stroke: t.shade('text', 'rgba(255,255,255,0.3)'),
        strokeWidth: 3,
        ...shadow(50, 20, 'rgba(0,0,0,0.6)'),
      }),
      text(digits, x, 440, 380, {
        fontFamily: t.font('clock'),
        fontSize: 330,
        fontWeight: 400,
        fill: t.color('text'),
        align: 'center',
        lineHeight: 1,
      }),
    ];
  }),
  rect(525, 550, 30, 30, t.color('primary'), { name: 'Colon dot', cornerRadius: 6 }),
  rect(525, 640, 30, 30, t.color('primary'), { name: 'Colon dot', cornerRadius: 6 }),
  text(t.copy('unit'), 120, 840, 330, {
    fontFamily: t.font('heading'),
    fontSize: 54,
    fontWeight: 700,
    fill: t.color('primary'),
    align: 'right',
  }),
  text(t.copy('headline'), 470, 840, 520, {
    fontFamily: t.font('heading'),
    fontSize: 54,
    fontWeight: 500,
    fill: t.color('text'),
  }),
  text(t.copy('detail'), 0, 930, W, {
    fontFamily: t.font('body'),
    fontSize: 32,
    fontWeight: 400,
    fill: t.shade('text', FLARE.grey),
    align: 'center',
  }),
]);

const stagesSpec = {
  colors: {
    background: { value: FLARE.black, hint: 'Page' },
    primary: {
      value: FLARE.amber,
      hint: 'Enterprise AI; its shades color the big number, its glow and the page glow',
    },
    surface: {
      value: '#3a312a',
      hint: 'Center of the stair steps; its darker shade is their edges',
    },
    text: { value: FLARE.white, hint: '5 Stages of' },
  },
  fonts: { heading: HEAD },
  copy: {
    lead: { label: 'Headline', value: '5 Stages of' },
    title: { label: 'Title', value: 'Enterprise AI' },
    number: { label: 'Big number', value: '5' },
  },
} as const satisfies ThemeSpec;

export const fiveStages = themed(W, H, stagesSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  glow(540, 800, 520, t.shade('primary', 'rgba(255,140,40,0.3)'), t.shade('background', CLEAR)),
  headline(t.font('heading'), t.copy('lead'), 110, 72, t.color('text'), 400),
  headline(t.font('heading'), t.copy('title'), 200, 96, t.color('primary'), 800),
  text(t.copy('number'), 0, 330, W, {
    fontFamily: t.font('heading'),
    fontSize: 860,
    fontWeight: 800,
    fill: linear(
      180,
      t.shade('primary', '#ffd79a'),
      t.shade('primary', FLARE.orange),
      t.shade('primary', 'rgba(255,106,26,0.15)'),
    ),
    align: 'center',
    lineHeight: 1,
    ...shadow(60, 0, t.shade('primary', 'rgba(255,140,40,0.55)')),
  }),
  Array.from({ length: 7 }, (_, index) => {
    const width = 420 - index * 40;
    return rect(
      540 - width / 2,
      1310 - index * 34,
      width,
      26,
      linear(90, t.shade('surface', '#1c1714'), t.color('surface'), t.shade('surface', '#1c1714')),
      { name: 'Step', cornerRadius: 4 },
    );
  }),
]);

const quoteSpec = {
  colors: {
    background: { value: FLARE.black, hint: 'Page and the fade over the photo' },
    primary: {
      value: FLARE.amber,
      hint: 'Quote mark, the second quote line and the rule; its orange shade warms the bottom',
    },
    text: { value: FLARE.white, hint: 'First quote line; its grey shade colors the author' },
  },
  fonts: { heading: HEAD, body: BODY },
  copy: {
    quote: { label: 'Quote', value: 'Artificial\nintelligence' },
    highlight: { label: 'Quote highlight', value: 'is a tool,\nnot a threat.' },
    author: { label: 'Author', value: 'Dara Whitfield, Founder' },
  },
} as const satisfies ThemeSpec;

const quotePortrait = themed(W, H, quoteSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  photo('man-portrait-2', 520, 0, 560, H, {
    filters: {
      brightness: 0.9,
      contrast: 1.15,
      saturation: 1,
      hue: 0,
      blur: 0,
      grayscale: 1,
      sepia: 0,
      invert: 0,
    },
  }),
  rect(520, 0, 360, H, linear(90, t.color('background'), t.shade('background', CLEAR)), {
    name: 'Fade',
  }),
  rect(
    0,
    1000,
    W,
    350,
    linear(180, t.shade('background', CLEAR), t.shade('primary', 'rgba(255,106,26,0.35)')),
    { name: 'Warm fade' },
  ),
  icon('quote', 80, 380, 96, t.color('primary'), { strokeWidth: 2.4 }),
  headline(t.font('heading'), t.copy('quote'), 510, 72, t.color('text'), 600, 80, 700, 'left'),
  headline(
    t.font('heading'),
    t.copy('highlight'),
    670,
    72,
    t.color('primary'),
    800,
    80,
    700,
    'left',
  ),
  rect(80, 880, 60, 4, t.color('primary'), { name: 'Rule' }),
  text(t.copy('author'), 160, 866, 500, {
    fontFamily: t.font('body'),
    fontSize: 28,
    fontWeight: 600,
    fill: t.shade('text', FLARE.grey),
  }),
]);

export const powerPost = builtForPower(H);
export const powerStory = builtForPower(STORY_SIZE.height);

export const POSTS = [
  percentCharged,
  buildPatterns,
  solutionsAmber,
  blueprint,
  powerPost,
  adsGrowth,
  clockSaved,
  fiveStages,
  quotePortrait,
  newPage,
];
