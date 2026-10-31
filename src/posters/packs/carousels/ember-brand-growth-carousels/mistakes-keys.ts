import { type DesignIconName, linear } from '@/design';
import { circle, icon, POST_SIZE, poly, rect, type ThemeSpec, text, themed } from '../../../kit';
import { textWidth } from '../momentum-carousel-kit/text-width';
import { EMBER, FONT, NIGHT, SITE } from './grid-stats';

const { width: W, height: H } = POST_SIZE;
const SOFT = '#ffd2bf';

const notch = (fill: string) =>
  poly(
    [
      [1000, 0],
      [W, 0],
      [W, H],
      [1000, H],
      [1000, 1010],
      [870, 950],
      [870, 560],
      [1000, 500],
    ],
    fill,
    { name: 'Notch panel' },
  );

const mistakesCoverSpec = {
  colors: {
    background: { value: '#ffffff', hint: 'Page, the swipe pill and the arrow glyph' },
    primary: {
      value: EMBER,
      hint: 'Highlight outline, the swipe pill outline and the arrow circle; its deeper shade colors 4 Mistakes and its pale shade fills the highlight',
    },
    text: {
      value: NIGHT,
      hint: 'Notch panel, the website, the headline and Swipe to read; its lighter shade colors the subtitle',
    },
  },
  fonts: { font: FONT },
  copy: {
    site: SITE,
    kicker: { label: 'Highlighted words', value: '4 Mistakes' },
    title: { label: 'Headline', value: 'Founders Make\non Social Media' },
    subtitle: { label: 'Subtitle', value: 'Avoid the traps that\nquietly stall growth' },
    cta: { label: 'Button', value: 'Swipe to read' },
  },
} as const satisfies ThemeSpec;

export const mistakesCover = themed(W, H, mistakesCoverSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  notch(t.color('text')),
  text(t.copy('site'), 90, 140, 600, {
    fontFamily: t.font('font'),
    fontSize: 32,
    fontWeight: 700,
    fill: t.color('text'),
  }),
  rect(78, 412, textWidth(t.copy('kicker'), 78) + 30, 104, t.shade('primary', SOFT), {
    name: 'Highlight',
    cornerRadius: 6,
    stroke: t.color('primary'),
    strokeWidth: 3,
  }),
  text(t.copy('kicker'), 92, 420, 700, {
    fontFamily: t.font('font'),
    fontSize: 78,
    fontWeight: 800,
    fill: t.shade('primary', '#c2410c'),
  }),
  text(t.copy('title'), 90, 530, 760, {
    fontFamily: t.font('font'),
    fontSize: 78,
    fontWeight: 800,
    fill: t.color('text'),
    lineHeight: 1.15,
  }),
  text(t.copy('subtitle'), 90, 760, 700, {
    fontFamily: t.font('font'),
    fontSize: 42,
    fontWeight: 500,
    fill: t.shade('text', '#52525b'),
    lineHeight: 1.35,
  }),
  rect(90, 1010, 430, 104, t.color('background'), {
    name: 'Swipe pill',
    cornerRadius: 52,
    stroke: t.color('primary'),
    strokeWidth: 4,
  }),
  text(t.copy('cta'), 132, 1040, 300, {
    fontFamily: t.font('font'),
    fontSize: 36,
    fontWeight: 600,
    fill: t.color('text'),
  }),
  circle(466, 1062, 38, t.color('primary')),
  icon('arrow-right', 444, 1040, 44, t.color('background'), { strokeWidth: 2.5 }),
]);

interface Point {
  plain: string;
  mark: string;
}

const mistakeSpec = (dark: boolean, title: string, points: readonly Point[]) =>
  ({
    colors: {
      background: {
        value: dark ? NIGHT : '#ffffff',
        hint: dark ? 'Page' : 'Page and the highlighted words',
      },
      primary: { value: EMBER, hint: 'Progress bar and the highlights' },
      text: {
        value: dark ? '#ffffff' : NIGHT,
        hint: `${dark ? 'Notch panel, the title and the highlighted words' : 'Notch panel and the title'}; its ${dark ? 'darker' : 'lighter'} shades color the progress track and the lead-in lines`,
      },
    },
    fonts: { font: FONT },
    copy: {
      title: { label: 'Title', value: title },
      plain: { label: 'Lead-in line', value: points.map((point) => point.plain) },
      marks: { label: 'Highlighted line', value: points.map((point) => point.mark) },
    },
  }) as const satisfies ThemeSpec;

const mistake = (dark: boolean, title: string, points: readonly Point[], progress: number) =>
  themed(W, H, mistakeSpec(dark, title, points), (t) => {
    const marks = t.list('marks');
    const markFill = dark ? t.color('text') : t.color('background');
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      notch(t.color('text')),
      rect(90, 230, 560, 6, t.shade('text', dark ? '#3f3f46' : '#d4d4d8'), {
        name: 'Track',
        cornerRadius: 3,
      }),
      rect(90, 230, 560 * progress, 6, t.color('primary'), { name: 'Progress', cornerRadius: 3 }),
      text(t.copy('title'), 90, 310, 760, {
        fontFamily: t.font('font'),
        fontSize: 84,
        fontWeight: 800,
        fill: t.color('text'),
        lineHeight: 1.1,
      }),
      t.list('plain').map((plain, index) => {
        const y = 560 + index * 190;
        const mark = marks[index] ?? '';
        return [
          text(plain, 90, y, 760, {
            fontFamily: t.font('font'),
            fontSize: 40,
            fontWeight: 500,
            fill: t.shade('text', dark ? '#d4d4d8' : '#3f3f46'),
          }),
          rect(84, y + 60, textWidth(mark, 40) + 20, 62, t.color('primary'), {
            name: 'Highlight',
            cornerRadius: 6,
          }),
          text(mark, 94, y + 66, 760, {
            fontFamily: t.font('font'),
            fontSize: 40,
            fontWeight: 700,
            fill: markFill,
          }),
        ];
      }),
    ];
  });

export const MISTAKE_STEPS = [
  mistake(
    true,
    'Talking Only\nAbout You',
    [
      { plain: 'If every post is a pitch,', mark: 'people scroll past.' },
      { plain: 'Teach, entertain and', mark: 'solve real problems.' },
      { plain: 'Value is what', mark: 'earns the follow.' },
    ],
    0.25,
  ),
  mistake(
    false,
    'Posting\nWithout a Plan',
    [
      { plain: 'Random posting makes it hard', mark: 'to build momentum.' },
      { plain: 'Pick three themes and', mark: 'rotate them weekly.' },
      { plain: 'Consistency builds', mark: 'recognition.' },
    ],
    0.5,
  ),
  mistake(
    true,
    'Ignoring the\nComments',
    [
      { plain: 'Silence tells people', mark: 'you are not listening.' },
      { plain: 'Reply within a day and', mark: 'ask a follow up.' },
      { plain: 'Every conversation is', mark: 'free reach.' },
    ],
    0.75,
  ),
] as const;

const DUSK_TOP = '#18181b';
const DUSK_BOTTOM = '#060607';

interface KeyColors {
  active: string;
  idle: string;
  rim: string;
  glyph: string;
}

const keys = (activeColumn: number, mark: DesignIconName, colors: KeyColors) =>
  [0, 1].map((row) =>
    Array.from({ length: 7 }, (_, column) => {
      const x = 30 + column * 150;
      const y = 990 + row * 150;
      const active = row === 0 && column === activeColumn;
      return [
        rect(x, y, 130, 130, active ? colors.active : colors.idle, {
          name: 'Key',
          cornerRadius: 26,
          stroke: active ? colors.active : colors.rim,
          strokeWidth: 3,
        }),
        active ? icon(mark, x + 33, y + 33, 64, colors.glyph, { strokeWidth: 2.25 }) : [],
      ];
    }),
  );

const keysSpec = <C extends Record<string, { label: string; value: string }>>(
  primaryHint: string,
  textHint: string,
  copy: C,
) =>
  ({
    colors: {
      background: {
        value: DUSK_TOP,
        hint: 'Top of the page gradient; its darker shade colors the bottom',
      },
      primary: { value: EMBER, hint: primaryHint },
      text: { value: '#ffffff', hint: textHint },
    },
    fonts: { font: FONT },
    copy,
  }) as const satisfies ThemeSpec;

const keysCoverSpec = keysSpec(
  'Loyal Community and the pressed key',
  'Website, How to Build a, the key icon and the key outlines; its faint shades color the idle keys',
  {
    site: SITE,
    intro: { label: 'Intro', value: 'How to\nBuild a' },
    headline: { label: 'Headline', value: 'Loyal\nCommunity' },
  },
);

export const keysCover = themed(W, H, keysCoverSpec, (t) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', DUSK_BOTTOM)), {
    name: 'Background',
  }),
  text(t.copy('site'), 90, 140, 600, {
    fontFamily: t.font('font'),
    fontSize: 32,
    fontWeight: 700,
    fill: t.color('text'),
  }),
  text(t.copy('intro'), 90, 360, 900, {
    fontFamily: t.font('font'),
    fontSize: 88,
    fontWeight: 400,
    fill: t.color('text'),
    lineHeight: 1.15,
  }),
  text(t.copy('headline'), 90, 566, 900, {
    fontFamily: t.font('font'),
    fontSize: 88,
    fontWeight: 800,
    fill: t.color('primary'),
    lineHeight: 1.15,
  }),
  keys(6, 'arrow-right', {
    active: t.color('primary'),
    idle: t.shade('text', 'rgba(255,255,255,0.03)'),
    rim: t.shade('text', 'rgba(255,255,255,0.35)'),
    glyph: t.color('text'),
  }),
]);

const keyStep = (number: string, title: string, body: string, mark: DesignIconName) =>
  themed(
    W,
    H,
    keysSpec(
      'Step number and the pressed key',
      'Title, the key icon and the key outlines; its softer shade colors the body and its faint shades the idle keys',
      {
        number: { label: 'Step number', value: number },
        title: { label: 'Title', value: title },
        body: { label: 'Body', value: body },
      },
    ),
    (t) => [
      rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', DUSK_BOTTOM)), {
        name: 'Background',
      }),
      text(t.copy('number'), 0, 220, W, {
        fontFamily: t.font('font'),
        fontSize: 160,
        fontWeight: 800,
        fill: t.color('primary'),
        align: 'center',
        lineHeight: 1,
      }),
      text(t.copy('title'), 0, 430, W, {
        fontFamily: t.font('font'),
        fontSize: 62,
        fontWeight: 800,
        fill: t.color('text'),
        align: 'center',
      }),
      text(t.copy('body'), 110, 530, 860, {
        fontFamily: t.font('font'),
        fontSize: 44,
        fontWeight: 400,
        fill: t.shade('text', '#d4d4d8'),
        align: 'center',
        lineHeight: 1.4,
      }),
      keys(3, mark, {
        active: t.color('primary'),
        idle: t.shade('text', 'rgba(255,255,255,0.03)'),
        rim: t.shade('text', 'rgba(255,255,255,0.35)'),
        glyph: t.color('text'),
      }),
    ],
  );

export const KEY_STEPS = [
  keyStep(
    '01',
    'Widen Your Reach',
    'Grow awareness through guest posts, partners and live sessions.',
    'megaphone',
  ),
  keyStep(
    '02',
    'Spark Conversation',
    'Views are not enough. Ask questions and reply to every comment.',
    'message-square',
  ),
  keyStep(
    '03',
    'Reward Loyalty',
    'Give regulars early access, shout-outs and a place to belong.',
    'users',
  ),
] as const;
