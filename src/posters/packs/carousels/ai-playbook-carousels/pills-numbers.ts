import { linear } from '@/design';
import {
  avatar,
  circle,
  icon,
  type Nodes,
  POST_SIZE,
  path,
  rect,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import type { PosterPhotoName } from '../../../photos';

const { width: W, height: H } = POST_SIZE;
const FONT = { label: 'Font', value: 'Plus Jakarta Sans' } as const;
const INK = '#0b2b26';
const TEAL = '#0f766e';
const BRIGHT = '#14b8a6';
const WHITE = '#ffffff';

const halfPill = (x: number, width: number, y: number, fill: string, side: 'left' | 'right') => {
  const r = 55;
  const data =
    side === 'left'
      ? `M0 0 H${width - r} A${r} ${r} 0 0 1 ${width - r} ${r * 2} H0 Z`
      : `M${width} 0 H${r} A${r} ${r} 0 0 0 ${r} ${r * 2} H${width} Z`;
  return path(data, x, y, width, r * 2, fill, { width, height: r * 2 }, { name: 'Pill' });
};

const pillColors = (
  background: string,
  primary: string,
  surface = 'Photo ring and the pill text; its pale shade colors the handle',
) =>
  ({
    background: { value: '#f8fbfa', hint: background },
    primary: { value: TEAL, hint: primary },
    text: { value: INK, hint: 'Title and the dark half pills' },
    surface: { value: WHITE, hint: surface },
  }) as const;

type PillTheme = Theme<{ colors: ReturnType<typeof pillColors>; fonts: { body: typeof FONT } }>;

const pillFill = (t: PillTheme) => linear(90, t.shade('primary', BRIGHT), t.color('primary'));

const mist = (t: PillTheme) =>
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', '#dfece8')), {
    name: 'Background',
  });

const namePill = (t: PillTheme, x: number, y: number, name: string, handle: string): Nodes[] => [
  rect(x, y, 470, 110, pillFill(t), { name: 'Name pill', cornerRadius: 55 }),
  text(name, x + 50, y + 18, 380, {
    fontFamily: t.font('body'),
    fontSize: 34,
    fontWeight: 700,
    fill: t.color('surface'),
  }),
  text(handle, x + 50, y + 62, 380, {
    fontFamily: t.font('body'),
    fontSize: 24,
    fontWeight: 500,
    fill: t.shade('surface', '#ccfbf1'),
  }),
];

const pillsCoverSpec = {
  colors: pillColors(
    'Page gradient; its shade is the bottom of the gradient',
    'Kicker, the pill gradients and the arrow button; its brighter shade starts each pill gradient',
    'Photo ring, the pill text and the arrow; its pale shade colors the handle',
  ),
  fonts: { body: FONT },
  copy: {
    kicker: { label: 'Kicker', value: 'LEVEL UP YOUR SKILLS' },
    title: { label: 'Title', value: 'Mastering the\nArt of AI\nPrompts' },
    name: { label: 'Name', value: 'Isla Moreno' },
    handle: { label: 'Handle', value: '@islamoreno' },
    swipe: { label: 'Swipe label', value: 'Swipe to continue' },
  },
} as const satisfies ThemeSpec;

export const pillsCover = themed(W, H, pillsCoverSpec, (t) => [
  mist(t),
  text(t.copy('kicker'), 90, 260, 900, {
    fontFamily: t.font('body'),
    fontSize: 30,
    fontWeight: 700,
    fill: t.color('primary'),
    letterSpacing: 2,
  }),
  text(t.copy('title'), 90, 320, 920, {
    fontFamily: t.font('body'),
    fontSize: 100,
    fontWeight: 800,
    fill: t.color('text'),
    lineHeight: 1.08,
  }),
  halfPill(0, 140, 720, t.color('text'), 'left'),
  avatar('woman-portrait-1', 240, 775, 58, t.color('surface')),
  namePill(t, 330, 720, t.copy('name'), t.copy('handle')),
  halfPill(830, 250, 720, t.color('text'), 'right'),
  rect(90, 860, 470, 110, pillFill(t), { name: 'Swipe pill', cornerRadius: 55 }),
  text(t.copy('swipe'), 90, 894, 470, {
    fontFamily: t.font('body'),
    fontSize: 36,
    fontWeight: 700,
    fill: t.color('surface'),
    align: 'center',
  }),
  circle(650, 915, 55, t.color('primary')),
  icon('arrow-right', 620, 885, 60, t.color('surface'), { strokeWidth: 2.5 }),
  halfPill(740, 340, 860, t.color('text'), 'right'),
]);

const pager = (active: number, y: number, on: string, off: string) => {
  let x = 454;
  return [0, 1, 2, 3].map((index) => {
    const node =
      index === active
        ? rect(x, y, 64, 18, on, { name: 'Pager', cornerRadius: 9 })
        : circle(x + 9, y + 9, 9, off);
    x += index === active ? 82 : 36;
    return node;
  });
};

interface PillStepCopy {
  title: string;
  photo: PosterPhotoName;
  name: string;
  handle: string;
  message: string;
}

const pillStep = (active: number, step: PillStepCopy) =>
  themed(
    W,
    H,
    {
      colors: pillColors(
        'Page gradient; its shades color the bottom of the gradient and the idle pager dots',
        'Active pager bar and the pill gradients; its brighter shade starts each pill gradient and colors the small half pill',
      ),
      fonts: { body: FONT },
      copy: {
        title: { label: 'Title', value: step.title },
        name: { label: 'Name', value: step.name },
        handle: { label: 'Handle', value: step.handle },
        message: { label: 'Message', value: step.message },
      },
    } as const satisfies ThemeSpec,
    (t) => [
      mist(t),
      pager(active, 230, t.color('primary'), t.shade('background', '#b6cfc9')),
      text(t.copy('title'), 60, 330, 960, {
        fontFamily: t.font('body'),
        fontSize: 80,
        fontWeight: 800,
        fill: t.color('text'),
        align: 'center',
        lineHeight: 1.12,
      }),
      halfPill(0, 150, 670, t.color('text'), 'left'),
      avatar(step.photo, 250, 725, 58, t.color('surface')),
      namePill(t, 340, 670, t.copy('name'), t.copy('handle')),
      halfPill(840, 240, 670, t.color('text'), 'right'),
      halfPill(0, 110, 820, t.shade('primary', BRIGHT), 'left'),
      rect(140, 820, 680, 110, pillFill(t), { name: 'Message pill', cornerRadius: 55 }),
      text(t.copy('message'), 190, 838, 590, {
        fontFamily: t.font('body'),
        fontSize: 29,
        fontWeight: 600,
        fill: t.color('surface'),
        lineHeight: 1.3,
      }),
      halfPill(850, 230, 820, t.color('text'), 'right'),
    ],
  );

export const PILL_STEPS = [
  pillStep(1, {
    title: 'Be Clear About\nthe Result First',
    photo: 'woman-portrait-2',
    name: 'Isla Moreno',
    handle: '@islamoreno',
    message: 'Describe the finished result before\nyou ask for the work itself.',
  }),
  pillStep(2, {
    title: 'Share Context\nLike a Teammate',
    photo: 'man-portrait-1',
    name: 'Theo Grant',
    handle: '@theogrant',
    message: 'Better background gives you a\nbetter first draft every time.',
  }),
  pillStep(3, {
    title: 'Set the Tone,\nStyle and Length',
    photo: 'woman-portrait-5',
    name: 'Kira Chen',
    handle: '@kirachen',
    message: 'Name the voice you want and how\nlong the answer should run.',
  }),
] as const;

const paper = (from: string, to: string) =>
  rect(0, 0, W, H, linear(180, from, to), { name: 'Background' });

const numbersCoverSpec = {
  colors: {
    background: {
      value: WHITE,
      hint: 'Page gradient; its shade is the bottom of the gradient',
    },
    primary: {
      value: TEAL,
      hint: 'Title, the swipe pill and the arrow; its brighter shade starts the pill gradient',
    },
    text: { value: INK, hint: 'Name and the subtitle; its grey shade colors the role' },
    surface: { value: WHITE, hint: 'Arrow circle and the swipe label' },
  },
  fonts: { body: FONT },
  copy: {
    name: { label: 'Name', value: 'Nora Bell' },
    role: { label: 'Role', value: 'Marketing Director' },
    title: { label: 'Title', value: 'AI Will Not\nTake Your Job' },
    subtitle: { label: 'Subtitle', value: 'It will change how you do it.' },
    swipe: { label: 'Swipe label', value: 'Swipe to continue' },
  },
} as const satisfies ThemeSpec;

export const numbersCover = themed(W, H, numbersCoverSpec, (t) => [
  paper(t.color('background'), t.shade('background', '#e6efed')),
  avatar('woman-portrait-2', 150, 180, 46),
  text(t.copy('name'), 216, 146, 500, {
    fontFamily: t.font('body'),
    fontSize: 32,
    fontWeight: 700,
    fill: t.color('text'),
  }),
  text(t.copy('role'), 216, 188, 500, {
    fontFamily: t.font('body'),
    fontSize: 24,
    fontWeight: 500,
    fill: t.shade('text', '#64748b'),
  }),
  text(t.copy('title'), 90, 440, 920, {
    fontFamily: t.font('body'),
    fontSize: 100,
    fontWeight: 800,
    fill: t.color('primary'),
    lineHeight: 1.12,
  }),
  text(t.copy('subtitle'), 90, 720, 900, {
    fontFamily: t.font('body'),
    fontSize: 42,
    fontWeight: 500,
    fill: t.color('text'),
  }),
  rect(540, 1080, 450, 104, linear(90, t.shade('primary', BRIGHT), t.color('primary')), {
    name: 'Swipe pill',
    cornerRadius: 52,
  }),
  circle(598, 1132, 38, t.color('surface')),
  icon('arrow-right', 576, 1110, 44, t.color('primary'), { strokeWidth: 2.5 }),
  text(t.copy('swipe'), 650, 1113, 330, {
    fontFamily: t.font('body'),
    fontSize: 34,
    fontWeight: 700,
    fill: t.color('surface'),
  }),
]);

const numberStep = (active: number, body: string) =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: WHITE,
          hint: 'Page gradient; its shade is the bottom of the gradient',
        },
        primary: {
          value: TEAL,
          hint: 'Pager and the next button; its brighter shade outlines the big number',
        },
        surface: {
          value: WHITE,
          hint: 'Pager dots and the next arrow; idle dots use its see-through shade',
        },
        text: { value: INK, hint: 'Body text' },
      },
      fonts: { body: FONT },
      copy: {
        number: { label: 'Number', value: String(active) },
        body: { label: 'Body', value: body },
      },
    } as const satisfies ThemeSpec,
    (t) => [
      paper(t.color('background'), t.shade('background', '#e6efed')),
      rect(470, 150, 140, 46, t.color('primary'), { name: 'Pager', cornerRadius: 23 }),
      [0, 1, 2, 3].map((index) =>
        circle(
          498 + index * 28,
          173,
          7,
          index === active ? t.color('surface') : t.shade('surface', 'rgba(255,255,255,0.45)'),
        ),
      ),
      text(t.copy('number'), 50, 330, 520, {
        fontFamily: t.font('body'),
        fontSize: 600,
        fontWeight: 300,
        fill: t.shade('primary', 'rgba(0,0,0,0)'),
        stroke: t.shade('primary', BRIGHT),
        strokeWidth: 4,
        lineHeight: 1,
      }),
      text(t.copy('body'), 390, 560, 630, {
        fontFamily: t.font('body'),
        fontSize: 38,
        fontWeight: 500,
        fill: t.color('text'),
        lineHeight: 1.45,
      }),
      circle(950, 1190, 42, t.color('primary')),
      icon('arrow-right', 926, 1166, 48, t.color('surface'), { strokeWidth: 2.5 }),
    ],
  );

export const NUMBER_STEPS = [
  numberStep(
    1,
    'AI is best at clearing busywork, not replacing ideas. Use it for drafts, summaries and sorting so your real thinking starts sooner.',
  ),
  numberStep(
    2,
    'Output quality follows input quality. Vague prompts get generic answers. Clear goals, limits and examples get work that sounds like you.',
  ),
  numberStep(
    3,
    'Review everything before it ships. AI is fast and confident, so a quick human check keeps facts, tone and brand on track.',
  ),
] as const;
