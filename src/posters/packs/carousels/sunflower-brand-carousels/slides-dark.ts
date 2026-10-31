import { circle, icon, pill, rect, type ThemeSpec, themed } from '../../../kit';
import {
  BODY_FONT,
  darkBackground,
  glowNumber,
  H,
  HEADING_FONT,
  type Paint,
  SUN,
  say,
  W,
} from './palette';

const FONTS = { heading: HEADING_FONT, body: BODY_FONT } as const;

const tipsCoverSpec = {
  colors: {
    background: {
      value: SUN.coal,
      hint: 'Charcoal page gradient and the Swipe button label',
    },
    primary: {
      value: SUN.sun,
      hint: 'Glowing number, the warm glow behind it and the Swipe button',
    },
    text: {
      value: SUN.white,
      hint: 'Branding and Tips to Consider; its grey shade colors the intro line',
    },
  },
  fonts: FONTS,
  copy: {
    number: { label: 'Number', value: '3' },
    title: { label: 'Title', value: 'Branding' },
    subtitle: { label: 'Subtitle', value: 'Tips to\nConsider' },
    intro: { label: 'Intro', value: 'Want a brand people remember\nat first glance? Start here.' },
    button: { label: 'Button', value: 'Swipe  ›' },
  },
} as const satisfies ThemeSpec;

export const tipsCover = themed(W, H, tipsCoverSpec, (t) => {
  const heading = say(t.font('heading'));
  return [
    darkBackground(t),
    glowNumber(t, t.copy('number'), 90, 300, 200, 220, 'left'),
    heading(t.copy('title'), 260, 370, 800, 96, t.color('text'), 500, { lineHeight: 1.05 }),
    heading(t.copy('subtitle'), 90, 530, 900, 110, t.color('text'), 500, { lineHeight: 1.05 }),
    say(t.font('body'))(t.copy('intro'), 90, 800, 900, 38, t.shade('text', SUN.fog), 400),
    pill(t.copy('button'), 760, 1150, {
      fill: t.color('primary'),
      color: t.color('background'),
      fontSize: 36,
      fontFamily: t.font('body'),
      fontWeight: 700,
    }),
  ];
});

const tipSpec = (number: string, title: string, body: string) =>
  ({
    colors: {
      background: { value: SUN.coal, hint: 'Charcoal page gradient' },
      primary: { value: SUN.sun, hint: 'Big glowing tip number and the warm glow behind it' },
      text: { value: SUN.white, hint: 'Tip title; its grey shade colors the explanation' },
    },
    fonts: FONTS,
    copy: {
      number: { label: 'Tip number', value: number },
      title: { label: 'Tip title', value: title },
      body: { label: 'Explanation', value: body },
    },
  }) as const satisfies ThemeSpec;

const tip = (number: string, title: string, body: string) =>
  themed(W, H, tipSpec(number, title, body), (t) => [
    darkBackground(t),
    glowNumber(t, t.copy('number'), 440, 250, 600, 820, 'right'),
    say(t.font('heading'))(t.copy('title'), 90, 560, 700, 84, t.color('text'), 500, {
      lineHeight: 1.08,
    }),
    say(t.font('body'))(t.copy('body'), 90, 900, 480, 34, t.shade('text', SUN.fog), 400, {
      lineHeight: 1.45,
    }),
  ]);

export const tipConsistent = tip(
  '1',
  'Stay\nconsistent\neverywhere',
  'Your brand should look,\nsound and feel the same\non every channel.',
);

export const tipAudience = tip(
  '2',
  'Know your\naudience\ndeeply',
  'Strong brands speak to\nthe right people. Clarity\nbuilds connection fast.',
);

export const tipValues = tip(
  '3',
  ['Lead with', 'your', 'values'].join('\n'),
  'Looks are nice, but what\nyou stand for is what\nbrings people back.',
);

type StepTheme = Paint<'background' | 'primary' | 'text', 'heading' | 'body'>;

const slider = (t: StepTheme, position: number) => [
  rect(160, 760, 760, 4, t.shade('text', 'rgba(201,198,207,0.4)'), {
    name: 'Slider track',
    cornerRadius: 2,
  }),
  rect(160, 760, 760 * position, 4, t.color('primary'), { name: 'Slider fill', cornerRadius: 2 }),
  circle(160 + 760 * position, 762, 16, t.color('primary'), {
    shadow: {
      color: t.shade('primary', 'rgba(255,201,60,0.7)'),
      blur: 24,
      offsetX: 0,
      offsetY: 0,
    },
  }),
];

const stepNodes = (t: StepTheme, number: string, title: string, body: string, position: number) => {
  const centered =
    (fontFamily: string) =>
    (content: string, y: number, size: number, fill: string, weight: number) =>
      say(fontFamily)(content, 70, y, W - 140, size, fill, weight, {
        align: 'center',
        lineHeight: 1.4,
      });
  return [
    darkBackground(t),
    glowNumber(t, number, 0, 180, W, 420, 'center'),
    centered(t.font('heading'))(title, 640, 64, t.color('text'), 700),
    slider(t, position),
    centered(t.font('body'))(body, 830, 38, t.shade('text', SUN.fog), 400),
  ];
};

const stepsCoverSpec = {
  colors: {
    background: {
      value: SUN.coal,
      hint: 'Charcoal page gradient and the arrow on the swipe button',
    },
    primary: {
      value: SUN.sun,
      hint: 'Glowing number, the warm glow, the progress slider and the swipe button',
    },
    text: {
      value: SUN.white,
      hint: 'Steps to Elevate; its grey shades color the subtitle and the slider track',
    },
  },
  fonts: FONTS,
  copy: {
    number: { label: 'Number', value: '3' },
    title: { label: 'Title', value: 'Steps to Elevate' },
    subtitle: { label: 'Subtitle', value: 'Your brand, ready to stand\nout in a crowded market.' },
  },
} as const satisfies ThemeSpec;

export const stepsCover = themed(W, H, stepsCoverSpec, (t) => [
  stepNodes(t, t.copy('number'), t.copy('title'), t.copy('subtitle'), 0.08),
  rect(420, 1090, 240, 96, t.color('primary'), { name: 'Swipe button', cornerRadius: 48 }),
  icon('move-right', 495, 1098, 80, t.color('background'), { strokeWidth: 2 }),
]);

const stepSpec = (number: string, title: string, body: string) =>
  ({
    colors: {
      background: { value: SUN.coal, hint: 'Charcoal page gradient' },
      primary: {
        value: SUN.sun,
        hint: 'Glowing step number, the warm glow and the progress slider',
      },
      text: {
        value: SUN.white,
        hint: 'Step title; its grey shades color the explanation and the slider track',
      },
    },
    fonts: FONTS,
    copy: {
      number: { label: 'Step number', value: number },
      title: { label: 'Step title', value: title },
      body: { label: 'Explanation', value: body },
    },
  }) as const satisfies ThemeSpec;

const step = (number: string, title: string, body: string, position: number) =>
  themed(W, H, stepSpec(number, title, body), (t) =>
    stepNodes(t, t.copy('number'), t.copy('title'), t.copy('body'), position),
  );

export const stepTrust = step(
  '1',
  'Earn Trust Fast',
  "People don't buy from brands\nthey don't trust. First\nimpressions form in seconds.",
  0.35,
);

export const stepClients = step(
  '2',
  'Win Better Clients',
  'A clear brand filters for the\nright people, so the wrong\nones quietly opt out.',
  0.65,
);

export const stepShowUp = step(
  '3',
  'Keep Showing Up',
  'Branding is not a one-time\nproject. It compounds every\ntime you stay consistent.',
  0.92,
);
