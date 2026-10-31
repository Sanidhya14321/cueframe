import { linear } from '@/design';
import {
  circle,
  icon,
  type Nodes,
  POST_SIZE,
  poly,
  rect,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

const { width: W, height: H } = POST_SIZE;
export const FONT = { label: 'Font', value: 'Urbanist' } as const;
export const KICKER = { label: 'Kicker', value: 'STUDIO SYSTEMS' } as const;
export const NAVY = '#0b1d3a';
export const SKY = '#7dd3fc';
export const MUTED = '#cbd5e1';
export const WHITE = '#ffffff';
export const ROYAL = '#2563eb';
const OCEAN_END = '#123a7a';
const STREAK = 'rgba(255,255,255,0.035)';

const oceanBackground = (hint: string) => ({ value: NAVY, hint }) as const;

const ocean = (from: string, to: string, streak: string): Nodes[] => [
  rect(0, 0, W, H, linear(160, from, to), { name: 'Background' }),
  [0, 1, 2].map((index) =>
    poly(
      [
        [0, 300 + index * 380],
        [W, 40 + index * 380],
        [W, 120 + index * 380],
        [0, 380 + index * 380],
      ],
      streak,
      { name: 'Streak' },
    ),
  ),
];

const kicker = (label: string, y: number, fill: string, fontFamily: string) =>
  text(label, 90, y, 800, {
    fontFamily,
    fontSize: 34,
    fontWeight: 800,
    fill,
    letterSpacing: 2,
    align: 'left',
  });

const swipeStrip = (x: number, surface: string, outline: string, chevrons: string) => [
  rect(0, 1160, W, 190, surface, { name: 'Strip' }),
  rect(x, 1108, 260, 100, surface, {
    name: 'Chevron pill',
    cornerRadius: 50,
    stroke: outline,
    strokeWidth: 5,
  }),
  icon('chevrons-right', x + 100, 1128, 60, chevrons, { strokeWidth: 2.75 }),
];

const heading = (
  label: string,
  x: number,
  y: number,
  width: number,
  size: number,
  fill: string,
  fontFamily: string,
) => text(label, x, y, width, { fontFamily, fontSize: size, fontWeight: 800, fill });

const body = (
  label: string,
  x: number,
  y: number,
  width: number,
  size: number,
  fill: string,
  fontFamily: string,
  lineHeight: number,
) => text(label, x, y, width, { fontFamily, fontSize: size, fontWeight: 500, fill, lineHeight });

const windowsCoverSpec = {
  colors: {
    background: oceanBackground(
      'Page gradient and the chevron button outline; its brighter shade colors the bottom of the page',
    ),
    primary: {
      value: SKY,
      hint: 'Not Longer; its deeper blue shade colors the chevrons',
    },
    surface: { value: WHITE, hint: 'Bottom strip and the chevron button' },
    text: {
      value: WHITE,
      hint: 'Kicker, headline and Swipe to see more; its grey shade colors the subtitle, its faint tint the light streaks',
    },
  },
  fonts: { font: FONT },
  copy: {
    kicker: KICKER,
    title: { label: 'Headline', value: 'Ship Work Faster,' },
    accent: { label: 'Highlighted line', value: 'Not Longer' },
    subtitle: { label: 'Subtitle', value: 'Small process shifts that\nfree up hours each week' },
    swipe: { label: 'Swipe line', value: 'Swipe to see more' },
  },
} as const satisfies ThemeSpec;

export const windowsCover = themed(W, H, windowsCoverSpec, (t) => [
  ocean(t.color('background'), t.shade('background', OCEAN_END), t.shade('text', STREAK)),
  kicker(t.copy('kicker'), 130, t.color('text'), t.font('font')),
  heading(t.copy('title'), 90, 420, 940, 88, t.color('text'), t.font('font')),
  heading(t.copy('accent'), 90, 525, 940, 88, t.color('primary'), t.font('font')),
  body(t.copy('subtitle'), 90, 670, 900, 44, t.shade('text', MUTED), t.font('font'), 1.35),
  text(t.copy('swipe'), 90, 1060, 500, {
    fontFamily: t.font('font'),
    fontSize: 38,
    fontWeight: 600,
    fill: t.color('text'),
    italic: true,
  }),
  swipeStrip(720, t.color('surface'), t.color('background'), t.shade('primary', ROYAL)),
]);

const windowStep = (number: string, title: string, copy: string) =>
  themed(
    W,
    H,
    {
      colors: {
        background: oceanBackground(
          'Page gradient, the step number and the chevron button outline; its shades color the bottom of the page and the window panel',
        ),
        primary: {
          value: SKY,
          hint: 'Window outline; its deeper blue shade colors the chevrons',
        },
        surface: {
          value: WHITE,
          hint: 'Number tab, window dots, bottom strip and the chevron button',
        },
        text: {
          value: WHITE,
          hint: 'Step title; its grey shade colors the body, its faint tint the light streaks',
        },
      },
      fonts: { font: FONT },
      copy: {
        number: { label: 'Step number', value: number },
        title: { label: 'Title', value: title },
        body: { label: 'Body', value: copy },
      },
    } as const satisfies ThemeSpec,
    (t) => [
      ocean(t.color('background'), t.shade('background', OCEAN_END), t.shade('text', STREAK)),
      rect(
        110,
        330,
        860,
        560,
        linear(
          180,
          t.shade('background', 'rgba(18,58,122,0.55)'),
          t.shade('background', 'rgba(2,6,23,0.95)'),
        ),
        {
          name: 'Window',
          cornerRadius: 30,
          stroke: t.shade('primary', 'rgba(125,211,252,0.65)'),
          strokeWidth: 3,
        },
      ),
      rect(110, 250, 140, 96, t.color('surface'), { name: 'Number tab', cornerRadius: 16 }),
      poly(
        [
          [250, 270],
          [300, 330],
          [250, 330],
        ],
        t.color('surface'),
        { name: 'Tab fold' },
      ),
      text(t.copy('number'), 110, 270, 140, {
        fontFamily: t.font('font'),
        fontSize: 50,
        fontWeight: 800,
        fill: t.color('background'),
        align: 'center',
      }),
      [0, 1, 2].map((index) => circle(870 + index * 26, 390, 7, t.color('surface'))),
      heading(t.copy('title'), 160, 430, 760, 66, t.color('text'), t.font('font')),
      body(t.copy('body'), 160, 540, 760, 40, t.shade('text', MUTED), t.font('font'), 1.4),
      swipeStrip(410, t.color('surface'), t.color('background'), t.shade('primary', ROYAL)),
    ],
  );

export const WINDOW_STEPS = [
  windowStep(
    '01',
    'Build a System',
    'Templates remove decision fatigue and give every project the same strong start.',
  ),
  windowStep(
    '02',
    'Reuse Over Rebuild',
    'Starting from scratch feels creative, but reusable parts are where the speed lives.',
  ),
  windowStep(
    '03',
    'Automate Repeats',
    'If you do it more than twice, it is probably worth a template or a shortcut.',
  ),
  windowStep(
    '04',
    'Write It Down',
    'One shared page of decisions saves ten meetings later in the project.',
  ),
] as const;

const slidersCoverSpec = {
  colors: {
    background: oceanBackground(
      'Page gradient and the arrow on the round button; its brighter shade colors the bottom of the page',
    ),
    primary: { value: SKY, hint: 'Are a Smart Bet' },
    surface: { value: WHITE, hint: 'Round arrow button' },
    text: {
      value: WHITE,
      hint: 'Kicker and headline; its grey shade colors the subtitle, its faint tint the light streaks',
    },
  },
  fonts: { font: FONT },
  copy: {
    kicker: KICKER,
    title: { label: 'Headline', value: 'Why Templates' },
    accent: { label: 'Highlighted line', value: 'Are a Smart Bet' },
    subtitle: {
      label: 'Subtitle',
      value: 'Learn how templates save time\nand protect your quality',
    },
  },
} as const satisfies ThemeSpec;

export const slidersCover = themed(W, H, slidersCoverSpec, (t) => [
  ocean(t.color('background'), t.shade('background', OCEAN_END), t.shade('text', STREAK)),
  kicker(t.copy('kicker'), 130, t.color('text'), t.font('font')),
  heading(t.copy('title'), 90, 470, 940, 88, t.color('text'), t.font('font')),
  heading(t.copy('accent'), 90, 575, 940, 88, t.color('primary'), t.font('font')),
  body(t.copy('subtitle'), 90, 720, 900, 44, t.shade('text', MUTED), t.font('font'), 1.35),
  circle(920, 1170, 76, t.color('surface')),
  icon('arrow-right', 880, 1130, 80, t.color('background'), { strokeWidth: 2.75 }),
]);

const sliderStep = (number: string, lead: string, accent: string, copy: string, knob: number) =>
  themed(
    W,
    H,
    {
      colors: {
        background: oceanBackground(
          'Page gradient; its brighter shade colors the bottom of the page, its darker shades the track and the knob',
        ),
        primary: {
          value: SKY,
          hint: 'Highlighted line, the progress bar and the knob outline; its pale shade starts the progress bar',
        },
        text: {
          value: WHITE,
          hint: 'Lead line and the step number; its grey shade colors the body, its faint tint the light streaks',
        },
      },
      fonts: { font: FONT },
      copy: {
        lead: { label: 'Lead line', value: lead },
        accent: { label: 'Highlighted line', value: accent },
        body: { label: 'Body', value: copy },
        number: { label: 'Step number', value: number },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const x = W * knob;
      return [
        ocean(t.color('background'), t.shade('background', OCEAN_END), t.shade('text', STREAK)),
        heading(t.copy('lead'), 90, 300, 940, 84, t.color('text'), t.font('font')),
        heading(t.copy('accent'), 90, 400, 940, 84, t.color('primary'), t.font('font')),
        body(t.copy('body'), 90, 540, 880, 42, t.shade('text', MUTED), t.font('font'), 1.4),
        rect(x, 975, W - x, 50, t.shade('background', '#020617'), {
          name: 'Track',
          cornerRadius: 25,
        }),
        rect(0, 975, x, 50, linear(90, t.shade('primary', '#e0f2fe'), t.color('primary')), {
          name: 'Progress',
          cornerRadius: 25,
        }),
        circle(x, 1000, 82, t.shade('background', '#07142b'), {
          stroke: t.color('primary'),
          strokeWidth: 5,
        }),
        text(t.copy('number'), x - 82, 972, 164, {
          fontFamily: t.font('font'),
          fontSize: 50,
          fontWeight: 800,
          fill: t.color('text'),
          align: 'center',
        }),
      ];
    },
  );

export const SLIDER_STEPS = [
  sliderStep(
    '01',
    'Consistency',
    'Builds Trust',
    'Repeated visual structure makes your brand easy to recognise and look professional.',
    0.42,
  ),
  sliderStep(
    '02',
    'Speed Creates',
    'Momentum',
    'When design is easy, content gets published far more often.',
    0.56,
  ),
  sliderStep(
    '03',
    'Less Guessing,',
    'More Making',
    'Templates remove friction so ideas reach the page faster.',
    0.7,
  ),
  sliderStep(
    '04',
    'Great Systems',
    'Scale Up',
    'One well designed system can support months of content.',
    0.84,
  ),
] as const;
