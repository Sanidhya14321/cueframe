import { IMAGE_FILTER_PRESETS, linear } from '@/design';
import {
  avatar,
  circle,
  group,
  icon,
  type Nodes,
  POST_SIZE,
  photo,
  poly,
  rect,
  rotateNodes,
  STORY_SIZE,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const CRIMSON = {
  red: '#c8102e',
  bright: '#e63950',
  wine: '#5c0816',
  deep: '#22040a',
  blush: '#fde8ea',
  white: '#ffffff',
  ink: '#1a0b0e',
  grey: '#6b5a5e',
};

export const FONT = { label: 'Font', value: 'Lexend' } as const;

const { width: W, height: H } = POST_SIZE;

export const backdrop = (top: string, bottom: string, angle: number, height: number = H) =>
  rect(0, 0, W, height, linear(angle, top, bottom), { name: 'Background' });

export const tag = (
  label: string,
  x: number,
  y: number,
  size: number,
  style: { fill: string; color: string; fontFamily: string; width?: number; name?: string },
) => {
  const width = style.width ?? label.length * size * 0.62 + size * 0.9;
  return group(
    rect(x, y, width, size * 1.45, style.fill, {
      cornerRadius: 6,
      name: `${style.name ?? label} tag`,
    }),
    text(label, x, y + size * 0.16, width, {
      fontFamily: style.fontFamily,
      fontSize: size,
      fontWeight: 700,
      fill: style.color,
      align: 'center',
    }),
  );
};

const sevenHundredSpec = {
  colors: {
    background: {
      value: CRIMSON.blush,
      hint: 'Page gradient; its lighter shade colors the top of the page, the photo rings and the plus sign',
    },
    primary: {
      value: CRIMSON.red,
      hint: 'The big 700+ number (with its brighter top shade) and the plus badge',
    },
    text: { value: CRIMSON.ink, hint: 'Headline and the line beside the photos' },
  },
  fonts: { font: FONT },
  copy: {
    stat: { label: 'Number', value: '700+' },
    headline: { label: 'Headline', value: 'Happy clients who trust\nour growth services' },
    note: { label: 'Note', value: 'Join the founders who\ngrow with us' },
  },
} as const satisfies ThemeSpec;

export const sevenHundred = themed(W, H, sevenHundredSpec, (t) => [
  backdrop(t.shade('background', CRIMSON.white), t.color('background'), 180),
  text(t.copy('stat'), 60, 280, 960, {
    fontFamily: t.font('font'),
    fontSize: 340,
    fontWeight: 800,
    fill: linear(180, t.shade('primary', CRIMSON.bright), t.color('primary')),
    lineHeight: 1,
    letterSpacing: -10,
  }),
  text(t.copy('headline'), 80, 680, 900, {
    fontFamily: t.font('font'),
    fontSize: 52,
    fontWeight: 500,
    fill: t.color('text'),
    lineHeight: 1.25,
  }),
  avatar('woman-portrait-1', 140, 1100, 54, t.shade('background', CRIMSON.white)),
  avatar('man-portrait-1', 220, 1100, 54, t.shade('background', CRIMSON.white)),
  circle(300, 1100, 58, t.color('primary')),
  icon('plus', 272, 1072, 56, t.shade('background', CRIMSON.white), { strokeWidth: 2.6 }),
  text(t.copy('note'), 400, 1056, 600, {
    fontFamily: t.font('font'),
    fontSize: 38,
    fontWeight: 500,
    fill: t.color('text'),
    lineHeight: 1.25,
  }),
]);

const SERVICES = ['Strategy', 'Auditing', 'Coaching', 'Training', 'Finance', 'Hiring'] as const;

const needSpec = {
  colors: {
    background: {
      value: CRIMSON.blush,
      hint: 'Page gradient; its lighter shade colors the top of the page',
    },
    primary: {
      value: CRIMSON.red,
      hint: 'Everything You Need label, the raised tab and the closing line',
    },
    secondary: { value: CRIMSON.deep, hint: 'The other service tabs and the tab shadows' },
    surface: {
      value: CRIMSON.white,
      hint: 'Everything You Need lettering and the service names',
    },
    text: { value: CRIMSON.ink, hint: 'We have' },
  },
  fonts: { font: FONT },
  copy: {
    intro: { label: 'Intro', value: 'We have' },
    title: { label: 'Title', value: 'Everything You Need' },
    services: { label: 'Service', value: SERVICES },
    closing: { label: 'Closing line', value: 'Consider it handled.' },
  },
} as const satisfies ThemeSpec;

export const whatYouNeed = themed(W, H, needSpec, (t) => [
  backdrop(t.shade('background', CRIMSON.white), t.color('background'), 180),
  text(t.copy('intro'), 0, 120, W, {
    fontFamily: t.font('font'),
    fontSize: 64,
    fontWeight: 500,
    fill: t.color('text'),
    align: 'center',
  }),
  tag(t.copy('title'), 170, 220, 64, {
    fill: t.color('primary'),
    color: t.color('surface'),
    fontFamily: t.font('font'),
    width: 740,
    name: 'Everything You Need',
  }),
  t.list('services').map((service, index) => {
    const x = 120 + index * 145;
    const y = index === 3 ? 560 : 430;
    const active = index === 3;
    return group(
      rect(x, y, 115, 520, active ? t.color('primary') : t.color('secondary'), {
        cornerRadius: 10,
        name: `${SERVICES[index] ?? ''} tab`,
        ...shadow(20, 8, t.shade('secondary', 'rgba(34,4,10,0.25)')),
      }),
      text(service, x + 28, y + 470, 420, {
        fontFamily: t.font('font'),
        fontSize: 40,
        fontWeight: 600,
        fill: t.color('surface'),
        rotation: -90,
      }),
    );
  }),
  text(t.copy('closing'), 0, 1180, W, {
    fontFamily: t.font('font'),
    fontSize: 48,
    fontWeight: 700,
    italic: true,
    fill: t.color('primary'),
    align: 'center',
  }),
]);

const clockSpec = {
  colors: {
    background: {
      value: CRIMSON.wine,
      hint: 'Page gradient; its darker shade colors the bottom of the page',
    },
    primary: {
      value: CRIMSON.red,
      hint: 'For No One block, the Time Waits lettering, the minute hand and the center pin',
    },
    surface: {
      value: CRIMSON.white,
      hint: 'Time Waits label, the For No One lettering and the clock face',
    },
    secondary: { value: CRIMSON.ink, hint: 'Clock rim, hour marks and the hour hand' },
    text: { value: CRIMSON.blush, hint: 'Post when it counts line' },
  },
  fonts: { font: FONT },
  copy: {
    kicker: { label: 'Kicker', value: 'Time Waits' },
    title: { label: 'Title', value: 'For No One' },
    subtitle: { label: 'Subtitle', value: 'Post when it counts' },
  },
} as const satisfies ThemeSpec;

export const clockPost = themed(W, H, clockSpec, (t) => {
  const cx = 540;
  const cy = 900;
  const radius = 330;
  const dark = t.color('secondary');
  return [
    backdrop(t.color('background'), t.shade('background', CRIMSON.deep), 170),
    tag(t.copy('kicker'), 340, 120, 50, {
      fill: t.color('surface'),
      color: t.color('primary'),
      fontFamily: t.font('font'),
      width: 400,
      name: 'Time Waits',
    }),
    tag(t.copy('title'), 240, 220, 90, {
      fill: t.color('primary'),
      color: t.color('surface'),
      fontFamily: t.font('font'),
      width: 600,
      name: 'For No One',
    }),
    text(t.copy('subtitle'), 0, 380, W, {
      fontFamily: t.font('font'),
      fontSize: 44,
      fontWeight: 500,
      fill: t.color('text'),
      align: 'center',
    }),
    circle(cx, cy, radius + 26, dark, { name: 'Clock rim', ...shadow(40, 16) }),
    circle(cx, cy, radius, t.color('surface'), { name: 'Clock face' }),
    Array.from({ length: 12 }, (_, index) =>
      rotateNodes(index * 30, cx, cy, [
        rect(cx - 8, cy - radius + 24, 16, index % 3 === 0 ? 70 : 40, dark, {
          cornerRadius: 4,
          name: 'Hour mark',
        }),
      ]),
    ),
    rotateNodes(-60, cx, cy, [
      rect(cx - 9, cy - radius * 0.55, 18, radius * 0.55, dark, {
        cornerRadius: 9,
        name: 'Hour hand',
      }),
    ]),
    rotateNodes(70, cx, cy, [
      rect(cx - 6, cy - radius * 0.8, 12, radius * 0.8, t.color('primary'), {
        cornerRadius: 6,
        name: 'Minute hand',
      }),
    ]),
    circle(cx, cy, 18, t.color('primary')),
  ];
});

const spotlightSpec = {
  colors: {
    background: {
      value: CRIMSON.wine,
      hint: 'Page gradient; its darker shade colors the bottom of the page',
    },
    primary: { value: CRIMSON.red, hint: 'The 1,200 Leads block' },
    surface: {
      value: CRIMSON.white,
      hint: 'Team Spotlight label, the 1,200 Leads lettering and This Quarter; its pink tint is the spotlight beam',
    },
    text: { value: CRIMSON.ink, hint: 'The lamp and the Team Spotlight lettering' },
  },
  fonts: { font: FONT },
  copy: {
    label: { label: 'Label', value: 'Team Spotlight' },
    stat: { label: 'Stat', value: '1,200 Leads' },
    closing: { label: 'Closing line', value: 'This Quarter' },
  },
} as const satisfies ThemeSpec;

const spotlightArt = (height: number) =>
  themed(W, height, spotlightSpec, (t): Nodes[] => {
    const top = (height - H) / 2;
    return [
      backdrop(t.color('background'), t.shade('background', CRIMSON.deep), 170, height),
      poly(
        [
          [440, 0],
          [640, 0],
          [940, top + 1060],
          [140, top + 1060],
        ],
        linear(
          180,
          t.shade('surface', 'rgba(255,220,225,0.55)'),
          t.shade('surface', 'rgba(255,220,225,0)'),
        ),
        { name: 'Spotlight' },
      ),
      rect(400, 0, 280, 40, t.color('text'), { cornerRadius: 12, name: 'Lamp' }),
      photo('man-portrait-2', 260, top + 230, 560, 620, {
        cornerRadius: 280,
        filters: IMAGE_FILTER_PRESETS.mono,
      }),
      tag(t.copy('label'), 300, top + 880, 44, {
        fill: t.color('surface'),
        color: t.color('text'),
        fontFamily: t.font('font'),
        width: 480,
        name: 'Team Spotlight',
      }),
      tag(t.copy('stat'), 210, top + 960, 100, {
        fill: t.color('primary'),
        color: t.color('surface'),
        fontFamily: t.font('font'),
        width: 660,
        name: '1,200 Leads',
      }),
      text(t.copy('closing'), 0, top + 1130, W, {
        fontFamily: t.font('font'),
        fontSize: 44,
        fontWeight: 500,
        fill: t.color('surface'),
        align: 'center',
      }),
    ];
  });

export const spotlightPost = spotlightArt(H);

export const spotlightStory = spotlightArt(STORY_SIZE.height);
