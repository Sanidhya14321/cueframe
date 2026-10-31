import type { DesignIconName } from '@/design';
import {
  avatar,
  circle,
  group,
  icon,
  POST_SIZE,
  photo,
  pill,
  poly,
  rect,
  shadow,
  star,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import type { PosterPhotoName } from '../../../photos';

export const HARBOR = {
  navy: '#0f1d3a',
  deep: '#0a1429',
  coral: '#ff7a59',
  cream: '#fff4ec',
  white: '#ffffff',
  mist: '#c7d2e5',
  slate: '#475569',
} as const;

export const W = POST_SIZE.width;
export const H = POST_SIZE.height;
export const HEADING_FONT = { label: 'Heading font', value: 'Sora' } as const;
export const BODY_FONT = { label: 'Body font', value: 'Inter' } as const;

export const backdrop = (fill: string) => rect(0, 0, W, H, fill, { name: 'Background' });

const faces = (
  names: readonly PosterPhotoName[],
  x: number,
  y: number,
  radius: number,
  ring: string,
) => group(names.map((name, index) => avatar(name, x + index * radius * 1.55, y, radius, ring)));

const transformingSpec = {
  colors: {
    background: {
      value: HARBOR.navy,
      hint: 'Page, plus the rating number and star on the coral panel',
    },
    primary: { value: HARBOR.coral, hint: 'Rating panel across the bottom' },
    text: {
      value: HARBOR.white,
      hint: 'Brand name, both headlines and the rings around the faces',
    },
  },
  fonts: { heading: HEADING_FONT },
  copy: {
    brand: { label: 'Brand name', value: 'Northbeam' },
    headline: { label: 'Headline', value: 'Transforming\nthe industry:' },
    subhead: { label: 'Second headline', value: 'Grow smarter\nwith marketing' },
    rating: { label: 'Rating', value: '4.7' },
  },
} as const satisfies ThemeSpec;

export const transforming = themed(W, H, transformingSpec, (t) => [
  backdrop(t.color('background')),
  text(t.copy('brand'), 90, 90, 400, {
    fontFamily: t.font('heading'),
    fontSize: 30,
    fontWeight: 700,
    fill: t.color('text'),
  }),
  text(t.copy('headline'), 90, 230, 900, {
    fontFamily: t.font('heading'),
    fontSize: 80,
    fontWeight: 700,
    fill: t.color('text'),
    lineHeight: 1.15,
  }),
  text(t.copy('subhead'), 90, 420, 900, {
    fontFamily: t.font('heading'),
    fontSize: 80,
    fontWeight: 400,
    fill: t.color('text'),
    lineHeight: 1.15,
  }),
  poly(
    [
      [0, 820],
      [560, 820],
      [640, 900],
      [W, 900],
      [W, H],
      [0, H],
    ],
    t.color('primary'),
    { name: 'Rating panel' },
  ),
  faces(['woman-portrait-1', 'man-portrait-1', 'woman-portrait-5'], 170, 1080, 78, t.color('text')),
  text(t.copy('rating'), 640, 980, 300, {
    fontFamily: t.font('heading'),
    fontSize: 170,
    fontWeight: 700,
    fill: t.color('background'),
  }),
  star(5, 930, 990, 60, t.color('background'), { innerRatio: 0.45 }),
]);

const creativeSpec = {
  colors: {
    background: { value: HARBOR.navy, hint: 'Page behind the photo' },
    surface: { value: HARBOR.white, hint: 'Card over the photo' },
    accent: { value: HARBOR.coral, hint: 'Burst star beside the card' },
    text: { value: HARBOR.navy, hint: 'Card title; its grey shade colors the card text' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    title: { label: 'Title', value: 'Creative Teams\nCollaboration' },
    body: { label: 'Body', value: 'Practical guides to lift your\ncampaign results and ROI.' },
  },
} as const satisfies ThemeSpec;

export const creativeTeams = themed(W, H, creativeSpec, (t) => [
  backdrop(t.color('background')),
  photo('team-1', 0, 0, W, H),
  rect(80, 760, 700, 440, t.color('surface'), {
    name: 'Card',
    cornerRadius: 28,
    ...shadow(40, 16),
  }),
  text(t.copy('title'), 130, 810, 620, {
    fontFamily: t.font('heading'),
    fontSize: 58,
    fontWeight: 700,
    fill: t.color('text'),
    lineHeight: 1.15,
  }),
  text(t.copy('body'), 130, 990, 620, {
    fontFamily: t.font('body'),
    fontSize: 32,
    fontWeight: 400,
    fill: t.shade('text', HARBOR.slate),
    lineHeight: 1.4,
  }),
  star(12, 820, 1060, 180, t.color('accent'), { innerRatio: 0.32 }),
]);

const PILLS = [
  { x: 320, y: 260, width: 520, filled: true },
  { x: 140, y: 460, width: 420, filled: false },
  { x: 590, y: 460, width: 250, filled: false },
  { x: 320, y: 660, width: 520, filled: true },
  { x: 140, y: 860, width: 520, filled: true },
] as const;

const DISCS: readonly { name: DesignIconName; x: number; y: number }[] = [
  { name: 'arrow-right', x: 140, y: 260 },
  { name: 'arrow-down', x: 140, y: 660 },
  { name: 'arrow-right', x: 700, y: 860 },
];

const growSpec = {
  colors: {
    background: {
      value: HARBOR.navy,
      hint: 'Page, the arrows on the discs and the words on the white pills',
    },
    primary: { value: HARBOR.coral, hint: 'Arrow discs and the outlined pill borders' },
    surface: { value: HARBOR.white, hint: 'Filled word pills' },
    text: { value: HARBOR.white, hint: 'Words in the outlined pills' },
  },
  fonts: { heading: HEADING_FONT },
  copy: {
    words: { label: 'Word', value: ['Grow', 'More', 'with', 'Less', 'Effort'] },
  },
} as const satisfies ThemeSpec;

export const growMore = themed(W, H, growSpec, (t) => {
  const words = t.list('words');
  const disc = (index: number) => {
    const spot = DISCS[index] ?? { name: 'arrow-right', x: 0, y: 0 };
    return group(
      circle(spot.x + 70, spot.y + 70, 70, t.color('primary')),
      icon(spot.name, spot.x + 30, spot.y + 30, 80, t.color('background'), { strokeWidth: 2.6 }),
    );
  };
  const word = (index: number) => {
    const spot = PILLS[index] ?? PILLS[0];
    return pill(words[index] ?? '', spot.x, spot.y, {
      fill: spot.filled ? t.color('surface') : t.shade('primary', 'rgba(0,0,0,0)'),
      stroke: t.color('primary'),
      strokeWidth: spot.filled ? 0 : 5,
      color: spot.filled ? t.color('background') : t.color('text'),
      fontSize: 64,
      fontFamily: t.font('heading'),
      fontWeight: 600,
      padY: 20,
      width: spot.width,
    });
  };
  return [
    backdrop(t.color('background')),
    disc(0),
    word(0),
    word(1),
    word(2),
    disc(1),
    word(3),
    word(4),
    disc(2),
  ];
});

const STEPS: readonly DesignIconName[] = ['megaphone', 'target', 'message-square'];

const motionSpec = {
  colors: {
    background: { value: HARBOR.navy, hint: 'Page and the icons on the step discs' },
    primary: { value: HARBOR.coral, hint: 'Step discs along the track' },
    text: { value: HARBOR.white, hint: 'Track line and the headline' },
  },
  fonts: { heading: HEADING_FONT },
  copy: {
    headline: {
      label: 'Headline',
      value: ['Your', 'strategy', 'actively', 'in motion.'].join('\n'),
    },
  },
} as const satisfies ThemeSpec;

export const strategyMotion = themed(W, H, motionSpec, (t) => [
  backdrop(t.color('background')),
  rect(0, 230, 180, 8, t.color('text'), { name: 'Track' }),
  rect(172, 230, 8, 900, t.color('text'), { name: 'Track' }),
  rect(172, 1122, 908, 8, t.color('text'), { name: 'Track' }),
  STEPS.map((name, index) => [
    circle(176, 400 + index * 250, 62, t.color('primary')),
    icon(name, 141, 365 + index * 250, 70, t.color('background'), { strokeWidth: 2.4 }),
  ]),
  text(t.copy('headline'), 340, 400, 700, {
    fontFamily: t.font('heading'),
    fontSize: 96,
    fontWeight: 600,
    fill: t.color('text'),
    lineHeight: 1.15,
  }),
]);

const goalsSpec = {
  colors: {
    background: { value: HARBOR.cream, hint: 'Page and the light rings of the target' },
    primary: { value: HARBOR.coral, hint: 'Coral rings of the target and the big percentage' },
    text: { value: HARBOR.navy, hint: 'Headline' },
  },
  fonts: { heading: HEADING_FONT },
  copy: {
    headline: { label: 'Headline', value: 'Hit your goals\nfaster by' },
    stat: { label: 'Stat', value: '4.0%' },
  },
} as const satisfies ThemeSpec;

export const targetGoals = themed(W, H, goalsSpec, (t) => [
  backdrop(t.color('background')),
  [300, 240, 180, 120, 60].map((radius, index) =>
    circle(780, 320, radius, index % 2 === 0 ? t.color('primary') : t.color('background'), {
      name: 'Ring',
    }),
  ),
  text(t.copy('headline'), 90, 700, 900, {
    fontFamily: t.font('heading'),
    fontSize: 76,
    fontWeight: 600,
    fill: t.color('text'),
    lineHeight: 1.15,
  }),
  text(t.copy('stat'), 80, 920, 900, {
    fontFamily: t.font('heading'),
    fontSize: 200,
    fontWeight: 800,
    fill: t.color('primary'),
  }),
]);
