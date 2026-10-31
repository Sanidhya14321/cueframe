import {
  arrow,
  circle,
  icon,
  photo,
  pill,
  poly,
  rating,
  rect,
  star,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY_FONT, backdrop, H, HARBOR, HEADING_FONT, W } from './posts';

const BOLT: readonly (readonly [number, number])[] = [
  [620, 140],
  [960, 140],
  [800, 560],
  [1000, 560],
  [560, 1240],
  [680, 740],
  [480, 740],
];

const boltSpec = {
  colors: {
    background: { value: HARBOR.navy, hint: 'Page' },
    primary: { value: HARBOR.coral, hint: 'Lightning bolt and the big percentage' },
    text: { value: HARBOR.white, hint: 'Bolt shadow, the stat label and both closing lines' },
  },
  fonts: { heading: HEADING_FONT },
  copy: {
    stat: { label: 'Stat', value: '50%' },
    label: { label: 'Stat label', value: 'Charged' },
    closing: { label: 'Closing line', value: 'Powering your' },
    emphasis: { label: 'Bold closing line', value: 'next big move.' },
  },
} as const satisfies ThemeSpec;

export const chargedBolt = themed(W, H, boltSpec, (t) => [
  backdrop(t.color('background')),
  poly(
    BOLT.map(([px, py]): [number, number] => [px + 40, py + 10]),
    t.color('text'),
    { name: 'Bolt shadow' },
  ),
  poly(BOLT, t.color('primary'), { name: 'Bolt' }),
  text(t.copy('stat'), 90, 140, 600, {
    fontFamily: t.font('heading'),
    fontSize: 170,
    fontWeight: 800,
    fill: t.color('primary'),
  }),
  text(t.copy('label'), 90, 350, 600, {
    fontFamily: t.font('heading'),
    fontSize: 64,
    fontWeight: 500,
    fill: t.color('text'),
  }),
  text(t.copy('closing'), 90, 1040, 500, {
    fontFamily: t.font('heading'),
    fontSize: 50,
    fontWeight: 400,
    fill: t.color('text'),
  }),
  text(t.copy('emphasis'), 90, 1110, 520, {
    fontFamily: t.font('heading'),
    fontSize: 50,
    fontWeight: 700,
    fill: t.color('text'),
  }),
]);

const testimonialSpec = {
  colors: {
    background: { value: HARBOR.white, hint: 'Page' },
    primary: { value: HARBOR.coral, hint: 'Kicker, the stars and the role pill' },
    text: { value: HARBOR.navy, hint: 'Score, the quote and the role pill label' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    kicker: { label: 'Kicker', value: 'Customer Experience' },
    score: { label: 'Score', value: '5.0' },
    quote: {
      label: 'Quote',
      value:
        'Working with this team changed how we sell. In two weeks they understood our brand, goals and buyers better than we did.',
    },
    role: { label: 'Reviewer role', value: 'Head of Growth' },
  },
} as const satisfies ThemeSpec;

export const testimonial = themed(W, H, testimonialSpec, (t) => [
  backdrop(t.color('background')),
  photo('woman-portrait-1', 60, 110, 440, 1000, { cornerRadius: 36 }),
  text(t.copy('kicker'), 560, 130, 480, {
    fontFamily: t.font('body'),
    fontSize: 32,
    fontWeight: 600,
    fill: t.color('primary'),
    italic: true,
  }),
  rating(560, 200, 34, 5, t.color('primary')),
  text(t.copy('score'), 800, 196, 120, {
    fontFamily: t.font('body'),
    fontSize: 34,
    fontWeight: 700,
    fill: t.color('text'),
  }),
  text(t.copy('quote'), 560, 290, 460, {
    fontFamily: t.font('heading'),
    fontSize: 42,
    fontWeight: 500,
    fill: t.color('text'),
    lineHeight: 1.4,
  }),
  pill(t.copy('role'), 560, 1040, {
    fill: t.color('primary'),
    color: t.color('text'),
    fontSize: 32,
    fontFamily: t.font('heading'),
    fontWeight: 700,
  }),
]);

const uniqueSpec = {
  colors: {
    background: { value: HARBOR.navy, hint: 'Page and the face icon on the coral circle' },
    primary: { value: HARBOR.coral, hint: 'Highlighted circle in the row' },
    text: { value: HARBOR.white, hint: 'Both lines, the arrows and the plain circles' },
  },
  fonts: { heading: HEADING_FONT },
  copy: {
    top: { label: 'Top line', value: 'Be yourself, be unique' },
    bottom: { label: 'Bottom line', value: 'Don’t follow the crowd' },
  },
} as const satisfies ThemeSpec;

export const beYourself = themed(W, H, uniqueSpec, (t) => {
  const line = (content: string, y: number) =>
    text(content, 0, y, W, {
      fontFamily: t.font('heading'),
      fontSize: 52,
      fontWeight: 600,
      fill: t.color('text'),
      align: 'center',
    });
  return [
    backdrop(t.color('background')),
    line(t.copy('top'), 300),
    arrow(400, 400, 150, t.color('text'), 6, { rotation: 90 }),
    [0, 1, 2, 3, 4].map((index) => {
      const cx = 140 + index * 200;
      return index === 1
        ? [
            circle(cx, 660, 82, t.color('primary')),
            icon('scan-face', cx - 50, 610, 100, t.color('background'), { strokeWidth: 2.2 }),
          ]
        : circle(cx, 660, 74, t.color('text'));
    }),
    arrow(740, 930, 150, t.color('text'), 6, { rotation: -90 }),
    line(t.copy('bottom'), 960),
  ];
});

const TAGS = [
  [380, 120, 'fill'],
  [120, 270, 'white'],
  [560, 270, 'outline'],
  [200, 420, 'fill'],
  [630, 420, 'outline'],
  [90, 570, 'outline'],
  [440, 570, 'white'],
  [260, 720, 'fill'],
  [640, 720, 'white'],
  [260, 870, 'outline'],
] as const;

const tagSpec = {
  colors: {
    background: { value: HARBOR.navy, hint: 'Page and the words on the filled pills' },
    primary: { value: HARBOR.coral, hint: 'Coral pills and the outlines of the outlined pills' },
    surface: { value: HARBOR.white, hint: 'White pills' },
    text: {
      value: HARBOR.white,
      hint: 'Words in the outlined pills; its light blue shade colors the question',
    },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    tags: {
      label: 'Tag',
      value: [
        'Branding',
        'Analytics',
        'Conversion',
        'Engagement',
        'Advertising',
        'Strategy',
        'Social Media',
        'Growth',
        'Content',
        'Target Audience',
      ],
    },
    question: { label: 'Question', value: 'Which one is your focus this quarter?' },
  },
} as const satisfies ThemeSpec;

export const tagCloud = themed(W, H, tagSpec, (t) => [
  backdrop(t.color('background')),
  t.list('tags').map((label, index) => {
    const [x, y, kind] = TAGS[index] ?? TAGS[0];
    return pill(label, x, y, {
      fill:
        kind === 'fill'
          ? t.color('primary')
          : kind === 'white'
            ? t.color('surface')
            : t.shade('primary', 'rgba(0,0,0,0)'),
      stroke: t.color('primary'),
      strokeWidth: kind === 'outline' ? 4 : 0,
      color: kind === 'outline' ? t.color('text') : t.color('background'),
      fontSize: 42,
      fontFamily: t.font('heading'),
      fontWeight: 600,
    });
  }),
  text(t.copy('question'), 0, 1130, W, {
    fontFamily: t.font('body'),
    fontSize: 36,
    fontWeight: 500,
    fill: t.shade('text', HARBOR.mist),
    align: 'center',
  }),
]);

const paceSpec = {
  colors: {
    background: { value: HARBOR.coral, hint: 'Page' },
    primary: {
      value: HARBOR.navy,
      hint: 'Quote mark, the quote box, the name, the title and the star',
    },
    text: { value: HARBOR.cream, hint: 'Quote inside the box' },
  },
  fonts: {
    mark: { label: 'Quote mark font', value: 'Archivo Black' },
    heading: HEADING_FONT,
    body: BODY_FONT,
  },
  copy: {
    mark: { label: 'Quote mark', value: '“' },
    quote: { label: 'Quote', value: 'Build at your own pace.\nProgress beats perfect.' },
    name: { label: 'Name', value: 'Elena Ward' },
    title: { label: 'Job title', value: 'Founder, Northbeam' },
  },
} as const satisfies ThemeSpec;

export const paceQuote = themed(W, H, paceSpec, (t) => [
  backdrop(t.color('background')),
  text(t.copy('mark'), 80, 60, 300, {
    fontFamily: t.font('mark'),
    fontSize: 340,
    fontWeight: 400,
    fill: t.color('primary'),
    lineHeight: 1,
  }),
  rect(80, 470, 900, 330, t.color('primary'), { name: 'Quote box' }),
  text(t.copy('quote'), 130, 520, 820, {
    fontFamily: t.font('heading'),
    fontSize: 64,
    fontWeight: 700,
    fill: t.color('text'),
    lineHeight: 1.3,
  }),
  text(t.copy('name'), 90, 900, 600, {
    fontFamily: t.font('heading'),
    fontSize: 40,
    fontWeight: 700,
    fill: t.color('primary'),
  }),
  text(t.copy('title'), 90, 960, 600, {
    fontFamily: t.font('body'),
    fontSize: 32,
    fontWeight: 500,
    fill: t.color('primary'),
  }),
  star(5, 860, 1130, 150, t.color('primary'), { innerRatio: 0.42 }),
]);
