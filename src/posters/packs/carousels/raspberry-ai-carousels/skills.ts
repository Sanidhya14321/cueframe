import {
  icon,
  path,
  photo,
  poly,
  rect,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BERRY, BRAND_COPY, berryBackground, brandMark, FONTS, H, PAGE, W } from './palette';

const coverSpec = {
  colors: {
    background: PAGE,
    primary: { value: BERRY.white, hint: 'Headline and brand name' },
    secondary: { value: BERRY.blush, hint: 'Subtitle and brand tagline' },
    surface: { value: BERRY.white, hint: 'Next card peeking in at the right' },
    text: { value: BERRY.ink, hint: 'Arrow on the next card' },
  },
  fonts: FONTS,
  copy: {
    headline: { label: 'Headline', value: '5 Core AI Skills\nWorth Learning\nThis Year' },
    subtitle: {
      label: 'Subtitle',
      value: 'The edge goes to the teams\nwho learn the fastest.',
    },
    ...BRAND_COPY,
  },
} as const satisfies ThemeSpec;

const skillsCover = themed(W, H, coverSpec, (t) => [
  berryBackground(t),
  photo('phone-hand-1', 80, 140, 460, 400, { cornerRadius: 28 }),
  rect(820, 140, 260, 900, t.color('surface'), { cornerRadius: 32, name: 'Next card' }),
  icon('navigation', 900, 920, 90, t.color('text'), { strokeWidth: 2.4 }),
  text(t.copy('headline'), 80, 600, 700, {
    fontFamily: t.font('heading'),
    fontSize: 72,
    fontWeight: 800,
    fill: t.color('primary'),
    lineHeight: 1.15,
  }),
  text(t.copy('subtitle'), 80, 880, 700, {
    fontFamily: t.font('body'),
    fontSize: 36,
    fontWeight: 500,
    fill: t.color('secondary'),
    lineHeight: 1.4,
  }),
  brandMark(t, 80, 1140),
]);

const skillCard = (label: string, title: string, body: string, note: string, dark: boolean) => {
  const spec = {
    colors: {
      background: PAGE,
      surface: {
        value: dark ? BERRY.ink : BERRY.white,
        hint: dark ? 'Skill card' : 'Skill card and the skill label text',
      },
      text: {
        value: dark ? BERRY.white : BERRY.ink,
        hint: dark
          ? 'Title, description, skill label text and the next card peeking in; its lighter shade colors the tip'
          : 'Title, description and the next card peeking in; its lighter shade colors the tip',
      },
      accent: { value: BERRY.hot, hint: 'Skill label and the puzzle icon' },
    },
    fonts: FONTS,
    copy: {
      label: { label: 'Skill label', value: label },
      title: { label: 'Title', value: title },
      body: { label: 'Description', value: body },
      note: { label: 'Tip', value: note },
    },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => [
    berryBackground(t),
    rect(80, 140, 680, 1060, t.color('surface'), { cornerRadius: 36, name: 'Card' }),
    rect(900, 140, 180, 1060, t.color('text'), { cornerRadius: 36, name: 'Next card' }),
    rect(130, 200, 250, 84, t.color('accent'), { cornerRadius: 14, name: 'Label' }),
    text(t.copy('label'), 130, 216, 250, {
      fontFamily: t.font('heading'),
      fontSize: 42,
      fontWeight: 800,
      fill: dark ? t.color('text') : t.color('surface'),
      align: 'center',
    }),
    text(t.copy('title'), 130, 340, 580, {
      fontFamily: t.font('heading'),
      fontSize: 76,
      fontWeight: 800,
      fill: t.color('text'),
      lineHeight: 1.15,
    }),
    text(t.copy('body'), 130, 580, 580, {
      fontFamily: t.font('body'),
      fontSize: 46,
      fontWeight: 500,
      fill: t.color('text'),
      lineHeight: 1.4,
    }),
    icon('puzzle', 130, 1010, 72, t.color('accent'), { strokeWidth: 2.4 }),
    text(t.copy('note'), 230, 1008, 480, {
      fontFamily: t.font('body'),
      fontSize: 28,
      fontWeight: 500,
      fill: t.shade('text', dark ? BERRY.blush : '#4b5563'),
      lineHeight: 1.35,
    }),
  ]);
};

const waveSpec = {
  colors: {
    background: PAGE,
    primary: { value: BERRY.white, hint: 'Headline and the gauge needle' },
    secondary: { value: BERRY.blush, hint: 'Subtitle' },
    surface: { value: BERRY.ink, hint: 'Gauge arc' },
  },
  fonts: FONTS,
  copy: {
    headline: { label: 'Headline', value: 'Stay Ahead of\nthe AI Wave' },
    subtitle: {
      label: 'Subtitle',
      value: 'Because the future belongs\nto the fast learners.',
    },
  },
} as const satisfies ThemeSpec;

const waveGauge = themed(W, H, waveSpec, (t) => [
  berryBackground(t),
  text(t.copy('headline'), 80, 160, 920, {
    fontFamily: t.font('heading'),
    fontSize: 96,
    fontWeight: 800,
    fill: t.color('primary'),
    lineHeight: 1.12,
  }),
  text(t.copy('subtitle'), 80, 420, 900, {
    fontFamily: t.font('body'),
    fontSize: 42,
    fontWeight: 500,
    fill: t.color('secondary'),
    lineHeight: 1.4,
  }),
  path(
    'M100 540 A440 440 0 0 1 980 540',
    0,
    810,
    W,
    540,
    t.shade('surface', 'rgba(0,0,0,0)'),
    { width: W, height: 540 },
    { stroke: t.color('surface'), strokeWidth: 130, dashed: false, name: 'Line' },
  ),
  poly(
    [
      [470, 1350],
      [560, 1350],
      [860, 960],
    ],
    t.color('primary'),
    { name: 'Needle' },
  ),
]);

export const SKILL_SERIES: readonly Template[] = [
  skillsCover,
  skillCard(
    'Skill #1',
    'Prompt\nCrafting',
    'Write clear, specific prompts for text, image and research tools.',
    'Test small wording changes and compare the results.',
    false,
  ),
  skillCard(
    'Skill #2',
    'Workflow\nAutomation',
    'Hand repeat tasks like reports, replies and scheduling to smart tools.',
    'Save hours every week and focus on strategy.',
    true,
  ),
  skillCard(
    'Skill #3',
    'Responsible\nAI Use',
    'Know the basics of data privacy, bias and honest disclosure.',
    'Using AI with care makes you the trusted expert.',
    false,
  ),
  waveGauge,
];
