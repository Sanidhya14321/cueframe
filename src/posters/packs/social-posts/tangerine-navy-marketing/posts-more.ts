import { linear } from '@/design';
import {
  avatar,
  checklist,
  ellipse,
  icon,
  path,
  pill,
  poly,
  rating,
  rect,
  shadow,
  star,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  BODY_FONT,
  brandTraps,
  H,
  HASHTAG,
  HEADING_FONT,
  hashtag,
  insightImagination,
  TAN,
  W,
} from './posts';
import { gamePlanTangerine, spotlightPost } from './posts-mid';

const happinessSpec = {
  colors: {
    background: { value: TAN.white, hint: 'Warm page gradient' },
    primary: {
      value: TAN.tangerine,
      hint: 'Happiness headline gradient, the stars and the glow under the tilted star',
    },
    text: {
      value: TAN.navy,
      hint: 'Client line, the tagline, the hashtag and the soft shadow under the stars',
    },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    lead: { label: 'Lead line', value: 'Client' },
    headline: { label: 'Headline', value: 'Happiness' },
    tagline: { label: 'Tagline', value: 'Trust > Traffic' },
    hashtag: HASHTAG,
  },
} as const satisfies ThemeSpec;

export const clientHappiness = themed(W, H, happinessSpec, (t) => [
  rect(
    0,
    0,
    W,
    H,
    linear(
      180,
      t.color('background'),
      t.shade('background', TAN.paper),
      t.shade('background', '#f6ece1'),
    ),
    { name: 'Background' },
  ),
  text(t.copy('lead'), 0, 250, W, {
    fontFamily: t.font('heading'),
    fontSize: 84,
    fontWeight: 700,
    fill: t.color('text'),
    align: 'center',
  }),
  text(t.copy('headline'), 0, 340, W, {
    fontFamily: t.font('heading'),
    fontSize: 156,
    fontWeight: 800,
    fill: linear(90, t.color('primary'), t.shade('primary', '#ff9a4d')),
    align: 'center',
  }),
  text(t.copy('tagline'), 0, 560, W, {
    fontFamily: t.font('body'),
    fontSize: 52,
    fontWeight: 600,
    fill: t.color('text'),
    align: 'center',
  }),
  ellipse(150, 880, 780, 50, t.shade('text', 'rgba(10,17,40,0.08)'), { name: 'Shadow' }),
  [0, 1, 2, 3].map((index) =>
    star(5, 150 + index * 165, 730, 140, t.color('primary'), { innerRatio: 0.48 }),
  ),
  star(5, 820, 680, 150, t.color('primary'), {
    innerRatio: 0.48,
    rotation: 16,
    ...shadow(24, 10, t.shade('primary', 'rgba(255,122,26,0.4)')),
  }),
  hashtag(t.copy('hashtag'), 1120, t.color('text'), t.font('heading')),
]);

const wallSpec = {
  colors: {
    background: { value: TAN.navy, hint: 'Page and the reviewer name' },
    primary: {
      value: TAN.tangerine,
      hint: 'Repeating Reviews backdrop (solid and outlined rows) and the stars',
    },
    surface: { value: TAN.white, hint: 'Review card and its speech tail' },
    text: { value: TAN.slate, hint: 'Review quote' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    backdrop: { label: 'Backdrop word', value: 'Reviews' },
    name: { label: 'Reviewer', value: 'Lena Ortiz' },
    quote: {
      label: 'Quote',
      value:
        'Brightmark sharpened our brand and doubled our inbound leads in a single quarter. Clear plan, flawless execution.',
    },
  },
} as const satisfies ThemeSpec;

const reviewsWall = themed(W, H, wallSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  Array.from({ length: 7 }, (_, index) =>
    text(t.copy('backdrop'), 50, 30 + index * 182, 980, {
      fontFamily: t.font('heading'),
      fontSize: 180,
      fontWeight: 800,
      fill: index % 2 === 0 ? t.color('primary') : t.shade('primary', 'rgba(0,0,0,0)'),
      stroke: t.color('primary'),
      strokeWidth: index % 2 === 0 ? 0 : 3,
      lineHeight: 1,
    }),
  ),
  rect(360, 420, 660, 470, t.color('surface'), {
    name: 'Review card',
    cornerRadius: 40,
    ...shadow(50, 20, 'rgba(0,0,0,0.4)'),
  }),
  poly(
    [
      [430, 880],
      [530, 880],
      [430, 980],
    ],
    t.color('surface'),
    { name: 'Speech tail' },
  ),
  avatar('woman-portrait-6', 455, 520, 52),
  text(t.copy('name'), 530, 482, 440, {
    fontFamily: t.font('heading'),
    fontSize: 36,
    fontWeight: 800,
    fill: t.color('background'),
  }),
  rating(532, 532, 26, 5, t.color('primary')),
  text(t.copy('quote'), 410, 610, 570, {
    fontFamily: t.font('body'),
    fontSize: 31,
    fontWeight: 500,
    fill: t.color('text'),
    lineHeight: 1.45,
  }),
]);

const checklistSpec = {
  colors: {
    background: {
      value: TAN.tangerine,
      hint: 'Orange backdrop gradient, the Checklist headline, the check marks and the clip hole',
    },
    primary: {
      value: TAN.navy,
      hint: 'Clip, binder holes, the Your Launch line, the checklist items and the sheet shadow',
    },
    surface: {
      value: TAN.white,
      hint: 'Front sheet, the hanging string and the hashtag; its cream shade colors the back sheet',
    },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    lead: { label: 'Lead line', value: 'Your Launch' },
    title: { label: 'Title', value: 'Checklist' },
    items: {
      label: 'Checklist item',
      value: [
        'Define your audience',
        'Craft a clear offer',
        'Plan weekly content',
        'Track every result',
      ],
    },
    hashtag: HASHTAG,
  },
} as const satisfies ThemeSpec;

const launchChecklist = themed(W, H, checklistSpec, (t) => [
  rect(0, 0, W, H, linear(180, t.shade('background', TAN.peach), t.color('background')), {
    name: 'Background',
  }),
  path(
    'M 0 120 Q 540 220 1080 120',
    0,
    0,
    W,
    H,
    t.shade('surface', 'rgba(0,0,0,0)'),
    { width: W, height: H },
    { name: 'String', stroke: t.color('surface'), strokeWidth: 4 },
  ),
  rect(250, 260, 680, 920, t.shade('surface', TAN.cream), { name: 'Back sheet', rotation: 4 }),
  rect(200, 240, 680, 920, t.color('surface'), {
    name: 'Sheet',
    cornerRadius: 24,
    ...shadow(40, 16, t.shade('primary', 'rgba(10,17,40,0.25)')),
  }),
  rect(495, 150, 90, 140, t.color('primary'), { name: 'Clip', cornerRadius: 14 }),
  rect(515, 170, 50, 60, t.shade('background', TAN.peach), { name: 'Clip hole', cornerRadius: 10 }),
  Array.from({ length: 14 }, (_, index) =>
    ellipse(226, 300 + index * 60, 20, 20, t.color('primary'), { name: 'Binder hole' }),
  ),
  text(t.copy('lead'), 290, 330, 560, {
    fontFamily: t.font('heading'),
    fontSize: 54,
    fontWeight: 700,
    fill: t.color('primary'),
  }),
  text(t.copy('title'), 290, 395, 560, {
    fontFamily: t.font('heading'),
    fontSize: 104,
    fontWeight: 800,
    fill: t.color('background'),
  }),
  checklist(t.list('items'), 290, 630, 560, {
    color: t.color('primary'),
    iconColor: t.color('background'),
    fontSize: 38,
    gap: 130,
    fontFamily: t.font('body'),
  }),
  hashtag(t.copy('hashtag'), 1220, t.color('surface'), t.font('heading')),
]);

const hiringSpec = {
  colors: {
    background: { value: TAN.paper, hint: 'Page and the Apply button label' },
    primary: { value: TAN.tangerine, hint: 'Phone icon, its cord and the Hiring headline' },
    secondary: {
      value: TAN.navy,
      hint: 'Now line, the Apply button and the faint outlined HIRING backdrop',
    },
    text: { value: TAN.slate, hint: 'Contact line' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    backdrop: { label: 'Backdrop word', value: 'HIRING' },
    lead: { label: 'Lead line', value: 'Now' },
    title: { label: 'Title', value: 'Hiring' },
    contact: { label: 'Contact line', value: 'Send your portfolio to\njobs@brightmark.co' },
    button: { label: 'Button', value: 'Apply today' },
  },
} as const satisfies ThemeSpec;

const nowHiring = themed(W, H, hiringSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  Array.from({ length: 6 }, (_, index) =>
    text(t.copy('backdrop'), index % 2 === 0 ? 40 : 300, 20 + index * 222, 760, {
      fontFamily: t.font('heading'),
      fontSize: 210,
      fontWeight: 800,
      fill: t.shade('secondary', 'rgba(0,0,0,0)'),
      stroke: t.shade('secondary', 'rgba(15,27,61,0.09)'),
      strokeWidth: 3,
      lineHeight: 1,
    }),
  ),
  icon('phone', 90, 430, 330, t.color('primary'), { strokeWidth: 2.2 }),
  path(
    'M 200 770 C 200 930 330 980 430 1050 S 700 1140 1000 1100',
    0,
    0,
    W,
    H,
    t.shade('primary', 'rgba(0,0,0,0)'),
    { width: W, height: H },
    { name: 'Cord', stroke: t.color('primary'), strokeWidth: 6 },
  ),
  text(t.copy('lead'), 480, 420, 560, {
    fontFamily: t.font('heading'),
    fontSize: 120,
    fontWeight: 800,
    fill: t.color('secondary'),
    lineHeight: 1,
  }),
  text(t.copy('title'), 480, 540, 560, {
    fontFamily: t.font('heading'),
    fontSize: 150,
    fontWeight: 800,
    fill: t.color('primary'),
    lineHeight: 1,
  }),
  text(t.copy('contact'), 480, 730, 560, {
    fontFamily: t.font('body'),
    fontSize: 32,
    fontWeight: 500,
    fill: t.color('text'),
    lineHeight: 1.4,
  }),
  pill(t.copy('button'), 480, 860, {
    fill: t.color('secondary'),
    color: t.shade('background', TAN.white),
    fontSize: 32,
    fontFamily: t.font('body'),
    fontWeight: 600,
    width: 260,
  }),
]);

export const POSTS: readonly Template[] = [
  brandTraps,
  spotlightPost,
  gamePlanTangerine,
  insightImagination,
  reviewsWall,
  clientHappiness,
  launchChecklist,
  nowHiring,
];
