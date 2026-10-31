import { type Fill, linear } from '@/design';
import {
  circle,
  icon,
  type Nodes,
  rect,
  rotateNodes,
  STORY_SIZE,
  shadow,
  star,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  BERRY,
  BODY,
  backdrop,
  copyText,
  GOLD,
  H,
  HEADING,
  head,
  NIGHT,
  SUN,
  W,
  WHITE,
} from './posts';

const profitSpec = {
  colors: {
    background: { value: NIGHT.navy, hint: 'Page and the arrow on the gold disc' },
    primary: {
      value: GOLD,
      hint: 'Active progress segment, both stars and the arrow disc',
    },
    text: {
      value: WHITE,
      hint: 'Title and big figure; its muted shade colors the other progress segments and the body',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Boost Your\nSales With Us' },
    value: { label: 'Figure', value: '89%' },
    body: {
      label: 'Body',
      value:
        'Simple, proven marketing routines that bring regulars back and turn first visits into repeat orders.',
    },
  },
} as const satisfies ThemeSpec;

export const profit = themed(W, H, profitSpec, (t) => [
  backdrop(t.color('background'), H),
  [0, 1, 2, 3].map((index) =>
    rect(
      80 + index * 200,
      110,
      170,
      12,
      index === 1 ? t.color('primary') : t.shade('text', NIGHT.lilac),
      {
        name: 'Progress segment',
        cornerRadius: 6,
        opacity: index === 1 ? 1 : 0.5,
      },
    ),
  ),
  star(5, 920, 50, 130, t.color('primary'), { innerRatio: 0.48, name: 'Star' }),
  text(t.copy('title'), 80, 300, 920, {
    ...head(t.font('heading'), 100, t.color('text')),
    lineHeight: 1.05,
  }),
  text(t.copy('value'), 80, 560, 400, {
    ...head(t.font('heading'), 160, t.color('text')),
    lineHeight: 1,
  }),
  circle(470, 640, 62, t.color('primary'), { name: 'Arrow disc' }),
  icon('arrow-up-right', 434, 604, 72, t.color('background'), { strokeWidth: 2.6 }),
  star(5, 60, 850, 64, t.color('primary'), { innerRatio: 0.48, name: 'Star' }),
  text(t.copy('body'), 80, 950, 860, copyText(t.font('body'), 38, t.shade('text', NIGHT.lilac))),
]);

const barsSpec = {
  colors: {
    background: { value: SUN.yellow, hint: 'Page' },
    primary: { value: SUN.navy, hint: 'Big figure, title and bars' },
    surface: { value: WHITE, hint: 'Star and the pale lower half of the bars' },
    text: { value: SUN.grey, hint: 'Source line' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    value: { label: 'Figure', value: '64%' },
    title: {
      label: 'Title',
      value: 'of shop owners spend 10+ hours\na week on admin they could skip',
    },
    source: {
      label: 'Source line',
      value: 'Neighbourhood Business Pulse 2026. Win back your evenings.',
    },
  },
} as const satisfies ThemeSpec;

const RATIOS = [0.34, 0.22, 0.42, 0.3];

const bars = (height: number) =>
  themed(W, height, barsSpec, (t): Nodes[] => [
    backdrop(t.color('background'), height),
    star(5, 860, 70, 150, t.color('surface'), { innerRatio: 0.48, name: 'Star' }),
    text(t.copy('value'), 80, 120, 700, {
      ...head(t.font('heading'), 160, t.color('primary')),
      lineHeight: 1,
    }),
    text(t.copy('title'), 80, 310, 920, {
      ...head(t.font('heading'), 48, t.color('primary')),
      lineHeight: 1.2,
    }),
    text(t.copy('source'), 80, 450, 920, copyText(t.font('body'), 24, t.color('text'), 500)),
    RATIOS.map((ratio, index) => {
      const barHeight = height * ratio;
      const x = 40 + index * 255;
      return [
        rect(x, height - barHeight, 235, barHeight, t.color('primary'), {
          name: 'Bar',
          cornerRadius: 8,
        }),
        rect(x, height - barHeight * 0.4, 235, barHeight * 0.4, t.color('surface'), {
          name: 'Bar base',
          opacity: index === 2 ? 0 : 0.92,
        }),
      ];
    }),
  ]);

export const barsPost = bars(H);
export const barsStory = bars(STORY_SIZE.height);

interface ResultsPaint {
  page: Fill;
  kicker: string;
  title: string;
  smallStar: string;
  card: string;
  disc: string;
  arrow: string;
  item: string;
  bigStar: string;
}

const SLOTS = [
  { x: 140, y: 440, rotation: -4 },
  { x: 250, y: 680, rotation: 3 },
  { x: 150, y: 920, rotation: -3 },
] as const;

const resultsNodes = (
  fonts: { heading: string; body: string },
  paint: ResultsPaint,
  copy: { kicker: string; title: string; items: readonly string[] },
): Nodes[] => [
  backdrop(paint.page, H),
  text(copy.kicker, 80, 100, 700, copyText(fonts.body, 26, paint.kicker, 600)),
  text(copy.title, 80, 146, 920, head(fonts.heading, 66, paint.title)),
  star(5, 20, 560, 110, paint.smallStar, { innerRatio: 0.48, name: 'Star' }),
  SLOTS.map((slot, index) =>
    rotateNodes(slot.rotation, slot.x + 340, slot.y + 90, [
      rect(slot.x, slot.y, 680, 180, paint.card, {
        name: 'Result card',
        cornerRadius: 16,
        ...shadow(30, 14, 'rgba(0,0,0,0.3)'),
      }),
      circle(slot.x + 90, slot.y + 90, 50, paint.disc, { name: 'Result icon' }),
      icon('arrow-up-right', slot.x + 64, slot.y + 64, 52, paint.arrow, { strokeWidth: 2.6 }),
      text(copy.items[index] ?? '', slot.x + 170, slot.y + 42, 480, {
        ...copyText(fonts.body, 36, paint.item, 500),
        lineHeight: 1.25,
      }),
    ]),
  ),
  star(5, 880, 1080, 150, paint.bigStar, { innerRatio: 0.48, name: 'Star' }),
];

const RESULTS_COPY = {
  kicker: { label: 'Kicker', value: 'Client wins' },
  title: { label: 'Title', value: 'The numbers our\nclients are cheering' },
  items: {
    label: 'Result',
    value: ['Repeat orders rose\nby 31%', 'No-shows fell\nby 18%', 'Weekend visits\nup by 24%'],
  },
} as const;

const sunResultsSpec = {
  colors: {
    background: { value: SUN.yellow, hint: 'Page' },
    primary: {
      value: SUN.navy,
      hint: 'Title, small star, the arrow discs and the result text',
    },
    surface: { value: WHITE, hint: 'Result cards, their arrows and the big star' },
    text: { value: SUN.grey, hint: 'Kicker' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: RESULTS_COPY,
} as const satisfies ThemeSpec;

export const sunResults = themed(W, H, sunResultsSpec, (t) =>
  resultsNodes(
    { heading: t.font('heading'), body: t.font('body') },
    {
      page: t.color('background'),
      kicker: t.color('text'),
      title: t.color('primary'),
      smallStar: t.color('primary'),
      card: t.color('surface'),
      disc: t.color('primary'),
      arrow: t.color('surface'),
      item: t.color('primary'),
      bigStar: t.color('surface'),
    },
    { kicker: t.copy('kicker'), title: t.copy('title'), items: t.list('items') },
  ),
);

const berryResultsSpec = {
  colors: {
    background: {
      value: BERRY.violet,
      hint: 'Page gradient; its darker shades color the bottom of the gradient, the arrow discs and the result text',
    },
    primary: { value: GOLD, hint: 'Small star beside the cards' },
    surface: { value: WHITE, hint: 'Result cards, their arrows and the big star' },
    text: { value: WHITE, hint: 'Title; its lilac shade colors the kicker' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: RESULTS_COPY,
} as const satisfies ThemeSpec;

export const berryResults = themed(W, H, berryResultsSpec, (t) =>
  resultsNodes(
    { heading: t.font('heading'), body: t.font('body') },
    {
      page: linear(200, t.color('background'), t.shade('background', BERRY.plum)),
      kicker: t.shade('text', BERRY.lilac),
      title: t.color('text'),
      smallStar: t.color('primary'),
      card: t.color('surface'),
      disc: t.shade('background', BERRY.deep),
      arrow: t.color('surface'),
      item: t.shade('background', BERRY.plum),
      bigStar: t.color('surface'),
    },
    { kicker: t.copy('kicker'), title: t.copy('title'), items: t.list('items') },
  ),
);
