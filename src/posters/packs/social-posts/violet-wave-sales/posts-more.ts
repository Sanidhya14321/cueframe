import { avatar, circle, poly, rating, rect, shadow, type ThemeSpec, themed } from '../../../kit';
import { BODY, bold, copy, H, HANDLE, HEADING, handle, heavy, PW, W } from './posts';

const slot = (
  x: number,
  y: number,
  width: number,
  fill: string,
  stroke: string,
  outline: boolean,
) =>
  rect(x, y, width, 150, fill, {
    cornerRadius: 75,
    stroke,
    strokeWidth: outline ? 5 : 0,
    name: 'Slot',
  });

const expertsSpec = {
  colors: {
    background: { value: PW.white, hint: 'Page' },
    primary: { value: PW.violet, hint: 'Violet slots behind the faces and the outlined slot' },
    text: {
      value: PW.ink,
      hint: 'Headline words and the dark slots; its lighter shade colors the subline and handle',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    words: { label: 'Headline word', value: ['Built', 'by', 'the', 'experts'] },
    subline: { label: 'Subline', value: 'Meet the team behind your growth.' },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const expertsBuilt = themed(W, H, expertsSpec, (t) => {
  const [built = '', by = '', the = '', experts = ''] = t.list('words');
  const word = heavy(t.font('heading'));
  const ink = t.color('text');
  const violet = (x: number, y: number, width: number) =>
    slot(x, y, width, t.color('primary'), t.color('primary'), false);
  const dark = (x: number, y: number, width: number) => slot(x, y, width, ink, ink, false);
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    word(built, 80, 150, 520, 160, ink),
    violet(600, 160, 300),
    avatar('man-portrait-1', 678, 235, 62),
    slot(920, 160, 160, t.shade('primary', 'rgba(0,0,0,0)'), t.color('primary'), true),
    dark(0, 380, 200),
    violet(220, 380, 280),
    avatar('woman-portrait-4', 298, 455, 62),
    word(by, 540, 370, 300, 160, ink),
    word(the, 80, 590, 340, 160, ink),
    violet(440, 600, 280),
    avatar('man-portrait-2', 518, 675, 62),
    dark(760, 600, 320),
    violet(40, 820, 260),
    avatar('woman-portrait-2', 118, 895, 62),
    word(experts, 330, 810, 720, 160, ink),
    copy(t.font('body'))(t.copy('subline'), 80, 1080, 900, 34, t.shade('text', PW.grey)),
    handle(t.copy('handle'), 1240, t.shade('text', PW.grey), t.font('body')),
  ];
});

const ARMS = [
  { x: 360, y: 210, width: 360, number: [540, 440] },
  { x: 360, y: 990, width: 360, number: [540, 910] },
  { x: 70, y: 630, width: 230, number: [320, 675] },
  { x: 780, y: 610, width: 230, number: [760, 675] },
] as const;

const habitsSpec = {
  colors: {
    primary: {
      value: PW.violet,
      hint: 'Page, the habits and the number dots; its lighter shade colors the handle',
    },
    surface: { value: PW.white, hint: 'The cross and the numbers' },
    text: { value: PW.ink, hint: 'MARKETERS BAD HABITS title in the middle' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'MARKETERS' },
    title: { label: 'Title', value: 'BAD' },
    subtitle: { label: 'Subtitle', value: 'HABITS' },
    habits: {
      label: 'Habit',
      value: [
        'Chasing trends\nwithout strategy',
        'Avoiding data\nand feedback',
        'Mixed\nmessages',
        'Obsessing\nover vanity\nmetrics',
      ],
    },
    numbers: { label: 'Number', value: ['1', '2', '3', '4'] },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const badHabits = themed(W, H, habitsSpec, (t) => {
  const strong = bold(t.font('heading'));
  const numbers = t.list('numbers');
  return [
    rect(0, 0, W, H, t.color('primary'), { name: 'Background' }),
    rect(360, 120, 360, 1110, t.color('surface'), { cornerRadius: 36, name: 'Cross' }),
    rect(60, 495, 960, 360, t.color('surface'), { cornerRadius: 36, name: 'Cross' }),
    strong(t.copy('kicker'), 360, 560, 360, 34, t.color('text'), {
      align: 'center',
      letterSpacing: 2,
    }),
    heavy(t.font('heading'))(t.copy('title'), 360, 600, 360, 124, t.color('text'), {
      align: 'center',
    }),
    strong(t.copy('subtitle'), 360, 735, 360, 50, t.color('text'), {
      align: 'center',
      letterSpacing: 4,
    }),
    t.list('habits').map((habit, index) => {
      const arm = ARMS[index] ?? ARMS[0];
      return [
        copy(t.font('body'))(habit, arm.x, arm.y, arm.width, 30, t.color('primary'), {
          align: 'center',
          fontWeight: 600,
          lineHeight: 1.3,
        }),
        circle(arm.number[0], arm.number[1], 28, t.color('primary')),
        strong(
          numbers[index] ?? '',
          arm.number[0] - 28,
          arm.number[1] - 18,
          56,
          28,
          t.color('surface'),
          { align: 'center' },
        ),
      ];
    }),
    handle(t.copy('handle'), 1265, t.shade('primary', PW.lilac), t.font('body')),
  ];
});

const feedbackSpec = {
  colors: {
    primary: {
      value: PW.violet,
      hint: 'Page and the stars; its lighter shade colors the photo ring',
    },
    surface: {
      value: PW.white,
      hint: 'Quote card, its tail and the handle; its faded shade colors the Feedback words behind',
    },
    text: { value: PW.ink, hint: 'Reviewer name, quote and the card shadow' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    backdrop: { label: 'Backdrop word', value: 'Feedback' },
    name: { label: 'Reviewer', value: 'Marcus Hale' },
    quote: {
      label: 'Quote',
      value:
        'Working with them lifted our brand\nand drove real growth. Strategy,\nexecution and communication\nwere outstanding.',
    },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const feedbackQuote = themed(W, H, feedbackSpec, (t) => [
  rect(0, 0, W, H, t.color('primary'), { name: 'Background' }),
  Array.from({ length: 8 }, (_, index) =>
    heavy(t.font('heading'))(
      t.copy('backdrop'),
      50,
      40 + index * 160,
      1000,
      170,
      t.shade('surface', 'rgba(255,255,255,0.12)'),
    ),
  ),
  rect(170, 360, 740, 450, t.color('surface'), {
    cornerRadius: 44,
    name: 'Quote card',
    ...shadow(40, 18, t.shade('text', 'rgba(20,17,43,0.3)')),
  }),
  poly(
    [
      [490, 806],
      [590, 806],
      [540, 880],
    ],
    t.color('surface'),
    { name: 'Card tail' },
  ),
  avatar('man-portrait-1', 290, 470, 60, t.shade('primary', PW.lilac)),
  bold(t.font('heading'))(t.copy('name'), 380, 428, 420, 34, t.color('text')),
  rating(380, 482, 26, 5, t.color('primary'), 0.2),
  copy(t.font('body'))(t.copy('quote'), 220, 570, 660, 30, t.color('text'), { lineHeight: 1.45 }),
  handle(t.copy('handle'), 1240, t.color('surface'), t.font('body')),
]);
