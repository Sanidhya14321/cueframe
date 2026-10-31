import { type Fill, linear } from '@/design';
import {
  circle,
  icon,
  type Nodes,
  path,
  poly,
  rect,
  rotateNodes,
  type ThemeSpec,
  themed,
} from '../../../kit';
import { textWidth } from '../momentum-carousel-kit/text-width';
import {
  BLUSH,
  BODY,
  CLEAR,
  H,
  HAZE,
  HEADING,
  INK,
  LEAF,
  MINT,
  MIST,
  NIGHT,
  PLUM,
  SITE,
  STONE,
  say,
  W,
  WHITE,
  WINE,
} from './style';

const pageDots = (active: number, on: string, off: string) =>
  [0, 1, 2, 3, 4].map((index) => circle(460 + index * 40, 1190, 9, index === active ? on : off));

const stepTag = (
  label: string,
  y: number,
  fontFamily: string,
  colors: { fill: string; label: string },
) => [
  rect(540 - textWidth(label, 40) / 2 - 24, y, textWidth(label, 40) + 48, 76, colors.fill, {
    name: 'Step tag',
    cornerRadius: 10,
  }),
  say(label, 0, y + 14, W, fontFamily, 40, 700, colors.label, { align: 'center' }),
];

const calendarCoverSpec = {
  colors: {
    background: { value: WHITE, hint: 'Page' },
    primary: {
      value: WINE,
      hint: 'Title and the step tag label; its pale tint colors the inactive page dots',
    },
    secondary: { value: LEAF, hint: 'Curved arrow and the active page dot' },
    accent: { value: MINT, hint: 'Step tag' },
    text: { value: INK, hint: 'Swipe line; its grey shade colors the website' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    site: SITE,
    tag: { label: 'Tag', value: '3 Steps to' },
    title: { label: 'Title', value: 'Own Your\nCalendar' },
    cta: { label: 'Swipe line', value: 'Swipe for more' },
  },
} as const satisfies ThemeSpec;

export const calendarCover = themed(W, H, calendarCoverSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  say(t.copy('site'), 0, 170, W, t.font('body'), 32, 500, t.shade('text', STONE), {
    align: 'center',
  }),
  stepTag(t.copy('tag'), 380, t.font('body'), {
    fill: t.color('accent'),
    label: t.color('primary'),
  }),
  say(t.copy('title'), 0, 490, W, t.font('heading'), 116, 800, t.color('primary'), {
    align: 'center',
    lineHeight: 1.05,
  }),
  say(t.copy('cta'), 0, 800, W, t.font('body'), 38, 700, t.color('text'), { align: 'center' }),
  path(
    'M8 12 Q 150 100 292 12',
    390,
    900,
    300,
    100,
    t.shade('secondary', CLEAR),
    { width: 300, height: 100 },
    { name: 'Smile arrow', stroke: t.color('secondary'), strokeWidth: 14 },
  ),
  poly(
    [
      [668, 892],
      [712, 902],
      [690, 940],
    ],
    t.color('secondary'),
    { name: 'Arrow head' },
  ),
  pageDots(0, t.color('secondary'), t.shade('primary', MIST)),
]);

const blocksSpec = {
  colors: {
    background: {
      value: PLUM,
      hint: 'Page gradient; its darker shades color the bottom of the gradient and the step tag label',
    },
    accent: { value: MINT, hint: 'Step tag, block outlines and tints, and the active page dot' },
    text: {
      value: WHITE,
      hint: 'Title and block labels; its translucent shade colors the inactive page dots',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    tag: { label: 'Tag', value: 'Step 1' },
    title: { label: 'Title', value: 'Batch your week\ninto blocks' },
    blocks: {
      label: 'Block',
      value: ['Focus', 'Calls', 'Admin', 'Write', 'Learn', 'Plan', 'Rest'],
    },
  },
} as const satisfies ThemeSpec;

export const blocksStep = themed(W, H, blocksSpec, (t) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', NIGHT)), {
    name: 'Background',
  }),
  stepTag(t.copy('tag'), 220, t.font('body'), {
    fill: t.color('accent'),
    label: t.shade('background', WINE),
  }),
  say(t.copy('title'), 0, 330, W, t.font('heading'), 80, 800, t.color('text'), {
    align: 'center',
    lineHeight: 1.1,
  }),
  t.list('blocks').map((label, index) => {
    const row = index < 4 ? 0 : 1;
    const column = row === 0 ? index : index - 4;
    const x = (row === 0 ? 140 : 245) + column * 210;
    const y = 640 + row * 220;
    return rotateNodes(index % 2 === 0 ? -6 : 6, x + 80, y + 80, [
      rect(x, y, 160, 160, t.shade('accent', 'rgba(167,243,208,0.06)'), {
        name: 'Block',
        cornerRadius: 10,
        stroke: t.color('accent'),
        strokeWidth: 4,
      }),
      say(label, x, y + 60, 160, t.font('body'), 32, 600, t.color('text'), { align: 'center' }),
    ]);
  }),
  pageDots(1, t.color('accent'), t.shade('text', HAZE)),
]);

interface RitualCopy {
  tag: string;
  title: string;
  heads: readonly string[];
  notes: readonly string[];
}

interface RitualPaint {
  page: Fill;
  tag: string;
  tagLabel: string;
  title: string;
  check: string;
  head: string;
  note: string;
  dotOn: string;
  dotOff: string;
}

const ritualNodes = (
  fonts: { heading: string; body: string },
  paint: RitualPaint,
  copy: RitualCopy,
  active: number,
): Nodes[] => [
  rect(0, 0, W, H, paint.page, { name: 'Background' }),
  stepTag(copy.tag, 220, fonts.body, { fill: paint.tag, label: paint.tagLabel }),
  say(copy.title, 0, 330, W, fonts.heading, 84, 800, paint.title, {
    align: 'center',
    lineHeight: 1.1,
  }),
  copy.heads.map((head, index) => {
    const y = 640 + index * 160;
    return [
      icon('square-check', 210, y, 62, paint.check, { strokeWidth: 2.25 }),
      say(head, 300, y - 4, 600, fonts.body, 44, 700, paint.head),
      say(copy.notes[index] ?? '', 300, y + 52, 640, fonts.body, 34, 400, paint.note),
    ];
  }),
  pageDots(active, paint.dotOn, paint.dotOff),
];

const ritualCopy = (copy: RitualCopy) => ({
  tag: { label: 'Tag', value: copy.tag },
  title: { label: 'Title', value: copy.title },
  heads: { label: 'Row title', value: copy.heads },
  notes: { label: 'Row note', value: copy.notes },
});

const lightRitual = (copy: RitualCopy, active: number) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: WHITE, hint: 'Page' },
        primary: {
          value: WINE,
          hint: 'Title, step tag label and row titles; its pale tint colors the inactive page dots',
        },
        secondary: { value: LEAF, hint: 'Check marks and the active page dot' },
        accent: { value: MINT, hint: 'Step tag' },
        text: { value: STONE, hint: 'Row notes' },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: ritualCopy(copy),
    } satisfies ThemeSpec,
    (t) =>
      ritualNodes(
        { heading: t.font('heading'), body: t.font('body') },
        {
          page: t.color('background'),
          tag: t.color('accent'),
          tagLabel: t.color('primary'),
          title: t.color('primary'),
          check: t.color('secondary'),
          head: t.color('primary'),
          note: t.color('text'),
          dotOn: t.color('secondary'),
          dotOff: t.shade('primary', MIST),
        },
        {
          tag: t.copy('tag'),
          title: t.copy('title'),
          heads: t.list('heads'),
          notes: t.list('notes'),
        },
        active,
      ),
  );

const darkRitual = (copy: RitualCopy, active: number) =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: PLUM,
          hint: 'Page gradient; its darker shades color the bottom of the gradient and the step tag label',
        },
        accent: { value: MINT, hint: 'Step tag, check marks and the active page dot' },
        text: {
          value: WHITE,
          hint: 'Title and row titles; its shades color the row notes and the inactive page dots',
        },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: ritualCopy(copy),
    } satisfies ThemeSpec,
    (t) =>
      ritualNodes(
        { heading: t.font('heading'), body: t.font('body') },
        {
          page: linear(180, t.color('background'), t.shade('background', NIGHT)),
          tag: t.color('accent'),
          tagLabel: t.shade('background', WINE),
          title: t.color('text'),
          check: t.color('accent'),
          head: t.color('text'),
          note: t.shade('text', BLUSH),
          dotOn: t.color('accent'),
          dotOff: t.shade('text', HAZE),
        },
        {
          tag: t.copy('tag'),
          title: t.copy('title'),
          heads: t.list('heads'),
          notes: t.list('notes'),
        },
        active,
      ),
  );

export const RITUAL_STEPS = [
  lightRitual(
    {
      tag: 'Step 2',
      title: 'Build a\nMorning Ritual',
      heads: ['Morning', 'Midday', 'Evening'],
      notes: ['Set your top three tasks', 'Reset with a short walk', 'Prep the desk for tomorrow'],
    },
    2,
  ),
  darkRitual(
    {
      tag: 'Step 3',
      title: 'Protect One\nFocus Block',
      heads: ['Pick a time', 'Go offline', 'Ship something'],
      notes: [
        'Ninety minutes, same slot daily',
        'Silence chats and close tabs',
        'End with one finished task',
      ],
    },
    3,
  ),
] as const;
