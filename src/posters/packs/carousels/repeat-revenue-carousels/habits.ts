import { type Fill, linear } from '@/design';
import { checklist, icon, type Nodes, path, rect, type ThemeSpec, themed } from '../../../kit';
import { textWidth } from '../momentum-carousel-kit/text-width';
import {
  BLUSH,
  BODY,
  CLEAR,
  FAINT,
  H,
  HEADING,
  INK,
  LEAF,
  MINT,
  NIGHT,
  PETAL,
  PLUM,
  SITE,
  say,
  W,
  WHITE,
  WINE,
} from './style';

const paper = (page: Fill, grid: string): Nodes[] => [
  rect(0, 0, W, H, page, { name: 'Background' }),
  Array.from({ length: 11 }, (_, index) =>
    rect(90 + index * 90, 0, 2, H, grid, { name: 'Grid line' }),
  ),
  Array.from({ length: 14 }, (_, index) =>
    rect(0, 90 + index * 90, W, 2, grid, { name: 'Grid line' }),
  ),
];

const footer = (site: string, fontFamily: string, color: string) => [
  say(site, 90, 1206, 500, fontFamily, 34, 700, color),
  icon('bookmark', 940, 1196, 54, color, { strokeWidth: 2.5 }),
];

const centerBar = (fill: string) => rect(470, 150, 140, 14, fill, { name: 'Bar', cornerRadius: 7 });

const habitsCoverSpec = {
  colors: {
    background: { value: WHITE, hint: 'Page' },
    primary: {
      value: WINE,
      hint: 'Top bar, title, website and bookmark; its pale tint colors the grid lines',
    },
    secondary: { value: LEAF, hint: 'Doodle, arrow and the underline below Keep' },
    text: { value: INK, hint: 'Subtitle' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'How\nto Keep\nGoing' },
    subtitle: { label: 'Subtitle', value: 'The secret is smaller steps...' },
    site: SITE,
  },
} as const satisfies ThemeSpec;

export const habitsCover = themed(W, H, habitsCoverSpec, (t) => [
  paper(t.color('background'), t.shade('primary', PETAL)),
  rect(90, 150, 150, 14, t.color('primary'), { name: 'Bar', cornerRadius: 7 }),
  path(
    'M10 20 C 90 60 130 170 70 190 C 10 210 10 120 90 120 C 170 120 210 210 270 230',
    700,
    170,
    290,
    250,
    t.shade('secondary', CLEAR),
    { width: 290, height: 250 },
    { name: 'Doodle', stroke: t.color('secondary'), strokeWidth: 8 },
  ),
  icon('arrow-down', 940, 380, 60, t.color('secondary'), { strokeWidth: 2.5, rotation: -30 }),
  say(t.copy('title'), 90, 380, 900, t.font('heading'), 124, 800, t.color('primary'), {
    lineHeight: 1.1,
  }),
  rect(90 + textWidth('to ', 124), 646, textWidth('Keep', 124), 12, t.color('secondary'), {
    name: 'Underline',
    cornerRadius: 6,
  }),
  say(t.copy('subtitle'), 90, 860, 900, t.font('body'), 46, 600, t.color('text')),
  footer(t.copy('site'), t.font('body'), t.color('primary')),
]);

const tinySpec = {
  colors: {
    background: {
      value: PLUM,
      hint: 'Page gradient; its darker shade is the bottom of the gradient',
    },
    accent: { value: MINT, hint: 'Top bar, website and bookmark' },
    text: {
      value: WHITE,
      hint: 'Title and the Skip and Try labels; its shades color the quotes and the faint grid',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Make It\nTiny' },
    labels: { label: 'Label', value: ['Skip:', 'Try:'] },
    quotes: {
      label: 'Quote',
      value: ['"I will run five miles today."', '"Shoes on, one easy lap."'],
    },
    site: SITE,
  },
} as const satisfies ThemeSpec;

export const tinyStep = themed(W, H, tinySpec, (t) => {
  const quotes = t.list('quotes');
  return [
    paper(linear(180, t.color('background'), t.shade('background', NIGHT)), t.shade('text', FAINT)),
    centerBar(t.color('accent')),
    say(t.copy('title'), 0, 240, W, t.font('heading'), 110, 800, t.color('text'), {
      align: 'center',
      lineHeight: 1.05,
    }),
    t.list('labels').map((label, index) => [
      say(label, 0, 590 + index * 210, W, t.font('body'), 48, 700, t.color('text'), {
        align: 'center',
      }),
      say(
        quotes[index] ?? '',
        0,
        656 + index * 210,
        W,
        t.font('body'),
        44,
        400,
        t.shade('text', BLUSH),
        {
          align: 'center',
        },
      ),
    ]),
    footer(t.copy('site'), t.font('body'), t.color('accent')),
  ];
});

const pairSpec = {
  colors: {
    background: { value: WHITE, hint: 'Page' },
    primary: {
      value: WINE,
      hint: 'Top bar, title, both columns of rows, website and bookmark; its pale tint colors the grid lines',
    },
    secondary: { value: LEAF, hint: 'Arrows between the columns' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Pair It With\na Routine' },
    cues: { label: 'Cue', value: ['After coffee', 'After lunch', 'After work'] },
    habits: { label: 'Habit', value: ['Read five pages', 'Walk ten minutes', 'Plan tomorrow'] },
    site: SITE,
  },
} as const satisfies ThemeSpec;

export const pairStep = themed(W, H, pairSpec, (t) => {
  const habits = t.list('habits');
  return [
    paper(t.color('background'), t.shade('primary', PETAL)),
    centerBar(t.color('primary')),
    say(t.copy('title'), 0, 240, W, t.font('heading'), 92, 800, t.color('primary'), {
      align: 'center',
      lineHeight: 1.1,
    }),
    t.list('cues').map((cue, index) => {
      const y = 600 + index * 130;
      return [
        say(cue, 60, y, 420, t.font('body'), 44, 500, t.color('primary'), { align: 'right' }),
        icon('chevrons-right', 506, y, 56, t.color('secondary'), { strokeWidth: 3 }),
        say(habits[index] ?? '', 590, y, 460, t.font('body'), 44, 500, t.color('primary')),
      ];
    }),
    footer(t.copy('site'), t.font('body'), t.color('primary')),
  ];
});

const streakSpec = {
  colors: {
    background: {
      value: PLUM,
      hint: 'Page gradient; its darker shade is the bottom of the gradient',
    },
    accent: { value: MINT, hint: 'Top bar, check marks, website and bookmark' },
    text: { value: WHITE, hint: 'Title and checklist; its faint shade colors the grid' },
  },
  fonts: {
    heading: HEADING,
    body: { label: 'Body font', value: 'Inter' },
  },
  copy: {
    title: { label: 'Title', value: 'Track Your\nStreak' },
    items: {
      label: 'Checklist item',
      value: [
        'Mark each day you show up',
        'Never miss twice in a row',
        'Celebrate every seventh day',
      ],
    },
    site: SITE,
  },
} as const satisfies ThemeSpec;

export const streakStep = themed(W, H, streakSpec, (t) => [
  paper(linear(180, t.color('background'), t.shade('background', NIGHT)), t.shade('text', FAINT)),
  centerBar(t.color('accent')),
  say(t.copy('title'), 0, 240, W, t.font('heading'), 100, 800, t.color('text'), {
    align: 'center',
    lineHeight: 1.05,
  }),
  checklist(t.list('items'), 180, 600, 800, {
    color: t.color('text'),
    iconColor: t.color('accent'),
    icon: 'circle-check',
    fontSize: 44,
    gap: 110,
    fontFamily: t.font('body'),
  }),
  footer(t.copy('site'), t.font('heading'), t.color('accent')),
]);
