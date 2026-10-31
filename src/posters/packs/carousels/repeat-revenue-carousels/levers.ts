import { type DesignIconName, type Fill, linear } from '@/design';
import { circle, icon, path, poly, rect, type ThemeSpec, themed } from '../../../kit';
import {
  BLUSH,
  BODY,
  CLEAR,
  FAINT,
  H,
  HEADING,
  MINT,
  NIGHT,
  PLUM,
  SITE,
  STONE,
  say,
  W,
  WHITE,
  WINE,
} from './style';

const tabFromRight = (y: number, width: number, height: number, fill: string) =>
  path(
    `M${width} 0 H${height / 2} A${height / 2} ${height / 2} 0 0 0 ${height / 2} ${height} H${width} Z`,
    W - width,
    y,
    width,
    height,
    fill,
    { width, height },
    { name: 'Tab' },
  );

const tabFromLeft = (y: number, width: number, height: number, fill: string) =>
  path(
    `M0 0 H${width - height / 2} A${height / 2} ${height / 2} 0 0 1 ${width - height / 2} ${height} H0 Z`,
    0,
    y,
    width,
    height,
    fill,
    { width, height },
    { name: 'Tab' },
  );

const ring = (corner: 'left' | 'right', fill: string) =>
  path(
    corner === 'right'
      ? 'M680 0 A400 400 0 0 0 1080 400 L1080 250 A250 250 0 0 1 830 0 Z'
      : 'M400 0 A400 400 0 0 1 0 400 L0 250 A250 250 0 0 0 250 0 Z',
    0,
    0,
    W,
    H,
    fill,
    { width: W, height: H },
    { name: 'Quarter ring' },
  );

const leversCoverSpec = {
  colors: {
    background: { value: WHITE, hint: 'Page and the arrow on the wine disc' },
    primary: { value: WINE, hint: 'Kicker, title, the disc behind the arrow and the website' },
    accent: { value: MINT, hint: 'Tab on the right edge' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'SALES PLAYBOOK' },
    title: { label: 'Title', value: 'How to\nGrow Repeat\nRevenue' },
    site: SITE,
  },
} as const satisfies ThemeSpec;

export const leversCover = themed(W, H, leversCoverSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  say(t.copy('kicker'), 90, 300, 700, t.font('body'), 30, 700, t.color('primary'), {
    letterSpacing: 3,
  }),
  say(t.copy('title'), 90, 360, 780, t.font('heading'), 108, 800, t.color('primary'), {
    lineHeight: 1.1,
  }),
  tabFromRight(560, 220, 150, t.color('accent')),
  circle(990, 635, 44, t.color('primary')),
  icon('chevron-right', 966, 611, 48, t.color('background'), { strokeWidth: 3 }),
  say(t.copy('site'), 490, 1200, 500, t.font('body'), 34, 600, t.color('primary'), {
    align: 'right',
  }),
]);

interface StepCopy {
  number: string;
  title: string;
  body: string;
}

const stepCopy = (step: StepCopy) => ({
  number: { label: 'Step number', value: step.number },
  title: { label: 'Title', value: step.title },
  body: { label: 'Body', value: step.body },
});

const lightLeverSpec = (step: StepCopy) =>
  ({
    colors: {
      background: { value: WHITE, hint: 'Page' },
      primary: { value: WINE, hint: 'Step number, icon and title' },
      accent: { value: MINT, hint: 'Quarter ring and the tab' },
      text: { value: STONE, hint: 'Body' },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: stepCopy(step),
  }) satisfies ThemeSpec;

const darkLeverSpec = (step: StepCopy) =>
  ({
    colors: {
      background: {
        value: PLUM,
        hint: 'Page gradient; its darker shades color the bottom of the gradient, the icon and the step number on the tab',
      },
      accent: { value: MINT, hint: 'Quarter ring and the tab' },
      text: { value: WHITE, hint: 'Title; its blush shade colors the body' },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: stepCopy(step),
  }) satisfies ThemeSpec;

interface LeverPaint {
  page: Fill;
  accent: string;
  wine: string;
  title: string;
  body: string;
}

interface LeverText {
  heading: string;
  body: string;
  number: string;
  title: string;
  copy: string;
}

const leverNodes = (dark: boolean, paint: LeverPaint, text: LeverText, mark: DesignIconName) => [
  rect(0, 0, W, H, paint.page, { name: 'Background' }),
  ring(dark ? 'right' : 'left', paint.accent),
  dark
    ? icon(mark, 800, 180, 100, paint.wine, { strokeWidth: 2.25 })
    : say(text.number, 130, 178, 200, text.heading, 84, 800, paint.wine, {
        align: 'center',
      }),
  dark ? tabFromLeft(600, 200, 120, paint.accent) : tabFromRight(600, 200, 120, paint.accent),
  dark
    ? say(text.number, 40, 620, 120, text.heading, 66, 800, paint.wine)
    : icon(mark, 940, 630, 60, paint.wine, { strokeWidth: 2.25 }),
  say(text.title, dark ? 240 : 90, 600, 760, text.heading, 72, 800, paint.title, {
    lineHeight: 1.1,
  }),
  say(text.copy, dark ? 240 : 90, 800, 760, text.body, 46, 400, paint.body, {
    lineHeight: 1.35,
  }),
];

const lever = (dark: boolean, step: StepCopy, mark: DesignIconName) =>
  dark
    ? themed(W, H, darkLeverSpec(step), (t) =>
        leverNodes(
          true,
          {
            page: linear(180, t.color('background'), t.shade('background', NIGHT)),
            accent: t.color('accent'),
            wine: t.shade('background', WINE),
            title: t.color('text'),
            body: t.shade('text', BLUSH),
          },
          {
            heading: t.font('heading'),
            body: t.font('body'),
            number: t.copy('number'),
            title: t.copy('title'),
            copy: t.copy('body'),
          },
          mark,
        ),
      )
    : themed(W, H, lightLeverSpec(step), (t) =>
        leverNodes(
          false,
          {
            page: t.color('background'),
            accent: t.color('accent'),
            wine: t.color('primary'),
            title: t.color('primary'),
            body: t.color('text'),
          },
          {
            heading: t.font('heading'),
            body: t.font('body'),
            number: t.copy('number'),
            title: t.copy('title'),
            copy: t.copy('body'),
          },
          mark,
        ),
      );

export const LEVER_STEPS = [
  lever(
    true,
    {
      number: '01',
      title: 'Track What\nCounts',
      body: 'Measure repeat orders and lifetime value, not just first sales.',
    },
    'target',
  ),
  lever(
    false,
    {
      number: '02',
      title: 'Sharpen\nYour Offer',
      body: 'Confused buyers stall. A crisp promise makes saying yes easy.',
    },
    'message-circle',
  ),
  lever(
    true,
    {
      number: '03',
      title: 'Know Your\nBuyer',
      body: 'Learn what they fear, want and compare you against before you pitch.',
    },
    'users',
  ),
] as const;

const wave = (y: number, stroke: string, fill: string) =>
  path(
    'M0 70 C 180 10, 360 130, 540 70 S 900 10, 1080 60',
    0,
    y,
    W,
    140,
    fill,
    { width: W, height: 140 },
    { name: 'Wave', stroke, strokeWidth: 5, dashed: true },
  );

const waveCoverSpec = {
  colors: {
    background: {
      value: PLUM,
      hint: 'Page gradient; its darker shades color the bottom of the gradient and the arrow',
    },
    accent: { value: MINT, hint: 'Big number and the arrow pill' },
    text: { value: WHITE, hint: 'Both headline lines, the dashed wave and the website' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    number: { label: 'Big number', value: '3' },
    intro: { label: 'Headline', value: 'Habits That Build' },
    title: { label: 'Bold headline', value: 'Loyal Customers' },
    site: SITE,
  },
} as const satisfies ThemeSpec;

export const waveCover = themed(W, H, waveCoverSpec, (t) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', NIGHT)), {
    name: 'Background',
  }),
  say(t.copy('number'), 0, 200, W, t.font('heading'), 320, 800, t.color('accent'), {
    align: 'center',
    lineHeight: 1,
  }),
  say(t.copy('intro'), 0, 560, W, t.font('heading'), 60, 400, t.color('text'), {
    align: 'center',
  }),
  say(t.copy('title'), 0, 636, W, t.font('heading'), 60, 800, t.color('text'), {
    align: 'center',
  }),
  wave(800, t.color('text'), t.shade('text', CLEAR)),
  rect(410, 820, 260, 100, t.color('accent'), { name: 'Arrow pill', cornerRadius: 50 }),
  icon('arrow-right', 510, 840, 60, t.shade('background', WINE), { strokeWidth: 2.75 }),
  say(t.copy('site'), 0, 1180, W, t.font('body'), 36, 700, t.color('text'), { align: 'center' }),
]);

const waveStepSpec = (step: StepCopy) =>
  ({
    colors: {
      background: {
        value: PLUM,
        hint: 'Page gradient; its darker shades color the bottom of the gradient and the badge icon',
      },
      accent: { value: MINT, hint: 'Icon badge and its pointer' },
      text: {
        value: WHITE,
        hint: 'Title and the dashed wave; its shades color the body and the faint big number',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: stepCopy(step),
  }) satisfies ThemeSpec;

const waveStep = (step: StepCopy, mark: DesignIconName) =>
  themed(W, H, waveStepSpec(step), (t) => [
    rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', NIGHT)), {
      name: 'Background',
    }),
    say(t.copy('number'), 0, 680, W, t.font('heading'), 560, 800, t.shade('text', FAINT), {
      align: 'center',
      lineHeight: 1,
    }),
    say(t.copy('title'), 60, 300, 960, t.font('heading'), 70, 800, t.color('text'), {
      align: 'center',
    }),
    say(t.copy('body'), 140, 400, 800, t.font('body'), 46, 400, t.shade('text', BLUSH), {
      align: 'center',
      lineHeight: 1.35,
    }),
    wave(900, t.color('text'), t.shade('text', CLEAR)),
    rect(465, 780, 150, 150, t.color('accent'), { name: 'Icon badge', cornerRadius: 34 }),
    poly(
      [
        [520, 928],
        [560, 928],
        [540, 960],
      ],
      t.color('accent'),
      { name: 'Badge pointer' },
    ),
    icon(mark, 498, 813, 84, t.shade('background', WINE), { strokeWidth: 2.25 }),
  ]);

export const WAVE_STEPS = [
  waveStep(
    {
      number: '01',
      title: 'Show Up Often',
      body: 'Stay visible with helpful posts, emails and quick check-ins.',
    },
    'megaphone',
  ),
  waveStep(
    {
      number: '02',
      title: 'Close the Loop',
      body: 'Ask for feedback after every order and act on it fast.',
    },
    'search',
  ),
  waveStep(
    {
      number: '03',
      title: 'Reward Return Visits',
      body: 'A simple perk makes the second order feel easy.',
    },
    'gift',
  ),
] as const;
