import { linear } from '@/design';
import {
  avatar,
  circle,
  icon,
  paint,
  phone,
  pill,
  rect,
  type ThemeSpec,
  themed,
} from '../../../kit';
import { BL, BODY, bold, copy, H, HANDLE, HEADING, handle, heavy, W } from './posts';

const heySpec = {
  colors: {
    background: { value: BL.white, hint: 'Page and the thumbs up icon' },
    primary: { value: BL.magenta, hint: 'Thumbs up badge and the ring around the photo' },
    text: {
      value: BL.ink,
      hint: 'Hey You, the question and the name; its lighter shades color the grid, the role and the handle',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Hey,\nYou' },
    question: { label: 'Question', value: 'Ready to level\nup your sales?' },
    name: { label: 'Name', value: 'Nora Field' },
    role: { label: 'Role', value: 'Sales Director' },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const heyYou = themed(W, H, heySpec, (t) => {
  const body = copy(t.font('body'));
  const grid = t.shade('text', 'rgba(18,18,18,0.06)');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    Array.from({ length: 12 }, (_, index) =>
      rect(index * 90, 0, 2, H, grid, { name: 'Grid line' }),
    ),
    Array.from({ length: 15 }, (_, index) =>
      rect(0, index * 90, W, 2, grid, { name: 'Grid line' }),
    ),
    heavy(t.font('heading'))(t.copy('title'), 90, 200, 700, 210, t.color('text'), {
      lineHeight: 0.95,
    }),
    circle(720, 520, 84, t.color('primary'), { name: 'Badge' }),
    icon('thumbs-up', 674, 474, 92, t.color('background'), { strokeWidth: 2 }),
    body(t.copy('question'), 90, 700, 800, 62, t.color('text'), { lineHeight: 1.2 }),
    avatar('woman-portrait-1', 145, 1010, 55, t.color('primary')),
    bold(t.font('heading'))(t.copy('name'), 220, 968, 400, 32, t.color('text')),
    body(t.copy('role'), 220, 1010, 400, 26, t.shade('text', BL.grey)),
    handle(t.copy('handle'), 1240, t.shade('text', BL.grey), t.font('body')),
  ];
});

const boostSpec = {
  colors: {
    primary: {
      value: BL.magenta,
      hint: 'Page gradient and the word Views; its darker shade is the bottom of the gradient',
    },
    surface: {
      value: BL.white,
      hint: 'Phone screen, pill labels, the Learn More button, the bottom line and the handle',
    },
    text: {
      value: BL.ink,
      hint: 'Burst marks, the dark pills, Boost Your and the Learn More outline and label; its darker shade colors the phone frame',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    tags: { label: 'Pill', value: ['Hey, you', 'with us'] },
    title: { label: 'Title', value: 'Boost\nYour' },
    highlight: { label: 'Highlighted word', value: 'Views' },
    cta: { label: 'Button', value: 'Learn More Today' },
    closing: { label: 'Closing line', value: 'Grow your reach in 30 days' },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const boostViews = themed(W, H, boostSpec, (t) => {
  const heading = heavy(t.font('heading'));
  const [greeting = '', tail = ''] = t.list('tags');
  const tag = (label: string, y: number) =>
    pill(label, 40, y, {
      fill: t.color('text'),
      color: t.color('surface'),
      fontSize: 22,
      fontFamily: t.font('body'),
    });
  return [
    rect(0, 0, W, H, linear(170, t.color('primary'), t.shade('primary', BL.magentaDeep)), {
      name: 'Background',
    }),
    rect(250, 150, 14, 90, t.color('text'), { cornerRadius: 7, rotation: -35, name: 'Burst' }),
    rect(310, 100, 14, 80, t.color('text'), { cornerRadius: 7, rotation: -12, name: 'Burst' }),
    rect(800, 120, 14, 90, t.color('text'), { cornerRadius: 7, rotation: 30, name: 'Burst' }),
    paint(
      [
        phone(330, 190, 420, {
          rotation: -6,
          screen: t.color('surface'),
          content: [
            tag(greeting, 130),
            heading(t.copy('title'), 40, 220, 320, 86, t.color('text')),
            heading(t.copy('highlight'), 40, 400, 320, 86, t.color('primary')),
            tag(tail, 520),
            pill(t.copy('cta'), 40, 640, {
              fill: t.color('surface'),
              color: t.color('text'),
              stroke: t.color('text'),
              strokeWidth: 3,
              fontSize: 20,
              fontFamily: t.font('body'),
            }),
          ],
        }),
      ],
      { '#0b0b0f': t.shade('text', '#0b0b0f') },
    ),
    bold(t.font('heading'))(t.copy('closing'), 0, 1130, W, 44, t.color('surface'), {
      align: 'center',
    }),
    handle(t.copy('handle'), 1230, t.color('surface'), t.font('body')),
  ];
});

const ORIGIN_X = 140;
const ORIGIN_Y = 560;

const WHITES = [
  [0, 1],
  [1, 1],
  [1, 0],
  [2, 1],
  [3, 1],
  [3, 0],
  [4, 1],
  [5, 1],
] as const;

const PINKS = [
  [6, 2],
  [7, 2],
  [7, 1],
] as const;

const leadsSpec = {
  colors: {
    background: { value: BL.ink, hint: 'Page' },
    surface: {
      value: BL.white,
      hint: 'Finding the right leads, the white blocks and the stepped ground line',
    },
    primary: { value: BL.magenta, hint: 'for the right people and the pink blocks' },
    text: { value: BL.silver, hint: 'Tagline; its darker shade colors the handle' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Finding the right leads' },
    highlight: { label: 'Highlighted line', value: 'for the right people' },
    tagline: { label: 'Tagline', value: 'Targeting that brings buyers, not browsers.' },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const rightLeads = themed(W, H, leadsSpec, (t) => {
  const cell = (column: number, row: number, fill: string) =>
    rect(ORIGIN_X + column * 100, ORIGIN_Y + row * 100, 90, 90, fill, {
      cornerRadius: 6,
      name: 'Block',
    });
  const ground = t.color('surface');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    bold(t.font('heading'))(t.copy('title'), 0, 190, W, 60, t.color('surface'), {
      align: 'center',
      fontWeight: 600,
    }),
    heavy(t.font('heading'))(t.copy('highlight'), 0, 275, W, 62, t.color('primary'), {
      align: 'center',
    }),
    WHITES.map(([column, row]) => cell(column, row, t.color('surface'))),
    PINKS.map(([column, row]) => cell(column, row, t.color('primary'))),
    rect(0, 756, 736, 6, ground, { name: 'Ground' }),
    rect(736, 756, 6, 114, ground, { name: 'Notch' }),
    rect(736, 864, 206, 6, ground, { name: 'Notch' }),
    rect(936, 756, 6, 114, ground, { name: 'Notch' }),
    rect(936, 756, 144, 6, ground, { name: 'Ground' }),
    copy(t.font('body'))(t.copy('tagline'), 0, 1040, W, 32, t.color('text'), { align: 'center' }),
    handle(t.copy('handle'), 1230, t.shade('text', BL.grey), t.font('body')),
  ];
});

const mythSpec = {
  colors: {
    background: { value: BL.ink, hint: 'Page' },
    primary: {
      value: BL.magenta,
      hint: 'Myth vs Truth badge, the arrows and the follow line; its translucent shade tints the callout',
    },
    text: {
      value: BL.white,
      hint: 'Badge label, Myth, Truth, both statements and the emphasis line; its shades color the divider and the handle',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    badge: { label: 'Badge', value: 'Myth vs Truth' },
    labels: { label: 'Myth and truth label', value: ['Myth:', 'Truth:'] },
    statements: {
      label: 'Statement',
      value: ['Marketing is just advertising.', 'Marketing is a full system of'],
    },
    emphasis: { label: 'Truth emphasis', value: 'research, strategy and engagement.' },
    callout: { label: 'Callout', value: 'Follow for a new truth every week.' },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const mythTruth = themed(W, H, mythSpec, (t) => {
  const heading = heavy(t.font('heading'));
  const body = copy(t.font('body'));
  const [mythLabel = '', truthLabel = ''] = t.list('labels');
  const [myth = '', truth = ''] = t.list('statements');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    pill(t.copy('badge'), 90, 130, {
      fill: t.color('primary'),
      color: t.color('text'),
      fontSize: 26,
      fontFamily: t.font('body'),
      fontWeight: 700,
    }),
    icon('arrow-right', 90, 320, 70, t.color('primary'), { strokeWidth: 2.6 }),
    heading(mythLabel, 185, 312, 600, 70, t.color('text')),
    body(myth, 90, 430, 900, 42, t.color('text')),
    rect(90, 580, 900, 2, t.shade('text', 'rgba(255,255,255,0.18)'), { name: 'Divider' }),
    icon('arrow-right', 90, 680, 70, t.color('primary'), { strokeWidth: 2.6 }),
    heading(truthLabel, 185, 672, 600, 70, t.color('text')),
    body(truth, 90, 790, 900, 42, t.color('text')),
    bold(t.font('heading'))(t.copy('emphasis'), 90, 850, 900, 42, t.color('text')),
    rect(90, 1010, 900, 120, t.shade('primary', 'rgba(255,45,135,0.14)'), {
      cornerRadius: 24,
      name: 'Callout',
    }),
    bold(t.font('heading'))(t.copy('callout'), 130, 1050, 820, 34, t.color('primary')),
    handle(t.copy('handle'), 1230, t.shade('text', BL.grey), t.font('body')),
  ];
});
