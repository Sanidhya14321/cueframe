import {
  circle,
  group,
  icon,
  path,
  photo,
  pill,
  poly,
  rect,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY, DISPLAY, H, HANDLE, HEADING, heavy, LIME, sparkle, W } from './posts';

const hiringSpec = {
  colors: {
    primary: { value: LIME.primary, hint: 'Page and the Apply now label' },
    text: {
      value: LIME.ink,
      hint: 'Diagonal band, every headline and line of copy, the sparkles and the Apply now button',
    },
    surface: { value: LIME.paper, hint: 'Photo frame' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'We are' },
    title: { label: 'Title', value: 'Hiring' },
    intro: { label: 'Intro line', value: 'Join our growth team as a' },
    role: { label: 'Role', value: 'SEO STRATEGIST' },
    button: { label: 'Button', value: 'Apply now' },
  },
} as const satisfies ThemeSpec;

export const hiringPost = themed(W, H, hiringSpec, (t) => {
  const title = heavy(t.font('heading'));
  return [
    rect(0, 0, W, H, t.color('primary'), { name: 'Background' }),
    poly(
      [
        [0, 940],
        [W, 600],
        [W, 790],
        [0, 1130],
      ],
      t.color('text'),
      { name: 'Diagonal band' },
    ),
    title(t.copy('kicker'), 80, 110, 70, t.color('text')),
    title(t.copy('title'), 80, 185, 200, t.color('text')),
    text(t.copy('intro'), 80, 420, 600, {
      fontFamily: t.font('body'),
      fontSize: 38,
      fontWeight: 500,
      fill: t.color('text'),
    }),
    title(t.copy('role'), 80, 472, 64, t.color('text')),
    photo('man-portrait-1', 600, 600, 400, 500, {
      cornerRadius: 24,
      stroke: t.color('surface'),
      strokeWidth: 10,
    }),
    sparkle(890, 100, 110, t.color('text')),
    sparkle(150, 820, 80, t.color('text')),
    pill(t.copy('button'), 80, 1190, {
      fill: t.color('text'),
      color: t.color('primary'),
      fontSize: 36,
      fontFamily: t.font('heading'),
      fontWeight: 800,
    }),
  ];
});

const TREND = [
  [0, 260],
  [160, 200],
  [320, 220],
  [480, 130],
  [640, 150],
  [800, 30],
] as const;

const leadersSpec = {
  colors: {
    background: {
      value: LIME.ink,
      hint: 'Page; its lighter shade colors the chart card',
    },
    primary: { value: LIME.primary, hint: 'Invest in 2027, the third stat and the trend line' },
    surface: { value: LIME.paper, hint: 'Where Leaders, the first two stats and the chart dots' },
    text: { value: LIME.muted, hint: 'Handle, stat labels and the source line' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    handle: HANDLE,
    title: { label: 'Title', value: 'Where Leaders' },
    highlight: { label: 'Highlight', value: 'Invest in 2027' },
    values: { label: 'Stat', value: ['72%', '58%', '85%'] },
    labels: { label: 'Stat label', value: ['AI tooling', 'Brand content', 'Data and insight'] },
    source: { label: 'Source', value: 'Source: Kestrel B2B pulse survey' },
  },
} as const satisfies ThemeSpec;

export const leadersStats = themed(W, H, leadersSpec, (t) => {
  const title = heavy(t.font('heading'));
  const labels = t.list('labels');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    text(t.copy('handle'), 80, 80, 500, {
      fontFamily: t.font('body'),
      fontSize: 26,
      fontWeight: 600,
      fill: t.color('text'),
    }),
    title(t.copy('title'), 80, 150, 88, t.color('surface')),
    title(t.copy('highlight'), 80, 245, 88, t.color('primary')),
    t.list('values').map((value, index) => {
      const x = 80 + index * 320;
      return group(
        text(value, x, 440, 300, {
          fontSize: 110,
          fontWeight: 800,
          fontFamily: t.font('heading'),
          fill: index === 2 ? t.color('primary') : t.color('surface'),
          align: 'left',
          lineHeight: 1,
        }),
        text(labels[index] ?? '', x, 440 + 110 * 1.12, 300, {
          fontFamily: t.font('body'),
          fontSize: 30,
          fontWeight: 500,
          fill: t.color('text'),
          align: 'left',
          lineHeight: 1.3,
        }),
      );
    }),
    rect(80, 760, 920, 400, t.shade('background', '#1b1b22'), {
      cornerRadius: 28,
      name: 'Chart card',
    }),
    path(
      'M0 260 L160 200 L320 220 L480 130 L640 150 L800 30',
      140,
      840,
      800,
      260,
      t.shade('primary', 'rgba(0,0,0,0)'),
      { width: 800, height: 260 },
      { stroke: t.color('primary'), strokeWidth: 8, name: 'Trend line' },
    ),
    TREND.map(([x, y]) => circle(140 + x, 840 + y, 12, t.color('surface'))),
    text(t.copy('source'), 80, 1240, 920, {
      fontFamily: t.font('body'),
      fontSize: 26,
      fontWeight: 500,
      fill: t.color('text'),
    }),
  ];
});

const saleSpec = {
  colors: {
    background: {
      value: LIME.ink,
      hint: 'Page, the percent sign and the offer pill text; its lighter shade colors the spotlight',
    },
    primary: { value: LIME.primary, hint: 'SALE, the percent badge and the offer pill' },
    surface: { value: LIME.paper, hint: 'Megaphone, sparkle and Year-End Deals' },
    text: { value: LIME.muted, hint: 'Offer end date' },
  },
  fonts: { display: DISPLAY, heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'SALE' },
    headline: { label: 'Headline', value: 'Year-End Deals' },
    offer: { label: 'Offer', value: 'Up to 50% off every plan' },
    note: { label: 'End date', value: 'Offer ends December 31' },
  },
} as const satisfies ThemeSpec;

export const saleMegaphone = themed(W, H, saleSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  text(t.copy('title'), 0, 60, W, {
    fontFamily: t.font('display'),
    fontSize: 300,
    fontWeight: 400,
    fill: t.color('primary'),
    align: 'center',
    lineHeight: 1,
  }),
  circle(540, 650, 230, t.shade('background', '#1b1b22'), { name: 'Spot' }),
  icon('megaphone', 380, 490, 320, t.color('surface'), { strokeWidth: 1.6 }),
  circle(780, 470, 64, t.color('primary')),
  icon('percent', 744, 434, 72, t.color('background'), { strokeWidth: 2.6 }),
  sparkle(150, 420, 100, t.color('surface')),
  text(t.copy('headline'), 0, 930, W, {
    fontFamily: t.font('heading'),
    fontSize: 96,
    fontWeight: 900,
    fill: t.color('surface'),
    align: 'center',
  }),
  pill(t.copy('offer'), 255, 1080, {
    fill: t.color('primary'),
    color: t.color('background'),
    fontSize: 40,
    fontFamily: t.font('heading'),
    fontWeight: 800,
    width: 570,
  }),
  text(t.copy('note'), 0, 1250, W, {
    fontFamily: t.font('body'),
    fontSize: 30,
    fontWeight: 500,
    fill: t.color('text'),
    align: 'center',
  }),
]);
