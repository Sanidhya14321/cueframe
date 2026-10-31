import type { DesignIconName } from '@/design';
import {
  group,
  icon,
  POST_SIZE,
  photo,
  pill,
  rect,
  star,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export interface CommentTheme {
  brand: string;
  ink: string;
  paper: string;
  accent: string;
  deep: string;
}

export const AZURE: CommentTheme = {
  brand: '#2f6bff',
  ink: '#0a1024',
  paper: '#ffffff',
  accent: '#ffd166',
  deep: '#1d4ed8',
};

export const FUCHSIA: CommentTheme = {
  brand: '#c026d3',
  ink: '#1a0620',
  paper: '#ffffff',
  accent: '#a3e635',
  deep: '#86198f',
};

const { width: W, height: H } = POST_SIZE;
export const DISPLAY = { label: 'Heading font', value: 'Archivo Black' } as const;
export const HEAD = { label: 'Heading font', value: 'Outfit' } as const;
export const BODY = { label: 'Body font', value: 'DM Sans' } as const;

export const clear = (hex: string) => {
  const channel = (start: number) => Number.parseInt(hex.slice(start, start + 2), 16);
  return `rgba(${channel(1)},${channel(3)},${channel(5)},0)`;
};

const wordsSpec = (theme: CommentTheme) =>
  ({
    colors: {
      background: { value: theme.brand, hint: 'Page' },
      primary: { value: theme.ink, hint: 'Word and arrow boxes, the star and the prompt text' },
      text: {
        value: theme.paper,
        hint: 'Intro lines, words and arrows in the boxes, the prompt label and the closing line',
      },
    },
    fonts: { heading: HEAD, body: BODY },
    copy: {
      intro: {
        label: 'Intro',
        value: 'Most people scroll past this.\nThe ones who stop grow faster.',
      },
      prompt: { label: 'Comment prompt', value: 'Comment “grow” for the free guide' },
      words: { label: 'Word', value: ['Post', 'Less', '&', 'Sell', 'More'] },
      closing: { label: 'Closing line', value: 'Save this for your next launch' },
    },
  }) as const satisfies ThemeSpec;

type WordsTheme = Theme<ReturnType<typeof wordsSpec>>;

const wordBox = (t: WordsTheme, word: string, x: number, y: number, width: number) =>
  group(
    rect(x, y, width, 150, t.color('primary'), { name: `${word} box`, cornerRadius: 10 }),
    text(word, x, y + 34, width, {
      fontFamily: t.font('heading'),
      fontSize: 72,
      fontWeight: 700,
      fill: t.color('text'),
      align: 'center',
    }),
  );

const iconBox = (t: WordsTheme, name: DesignIconName, x: number, y: number) =>
  group(
    rect(x, y, 170, 150, t.color('primary'), { name: 'Icon box', cornerRadius: 10 }),
    icon(name, x + 40, y + 30, 90, t.color('text'), { strokeWidth: 3 }),
  );

export const wordBoxes = (theme: CommentTheme) =>
  themed(W, H, wordsSpec(theme), (t) => {
    const [post = '', less = '', and = '', sell = '', more = ''] = t.list('words');
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      text(t.copy('intro'), 90, 80, 760, {
        fontFamily: t.font('body'),
        fontSize: 32,
        fontWeight: 500,
        fill: t.color('text'),
        lineHeight: 1.35,
      }),
      rect(90, 200, 640, 70, t.color('text'), { name: 'Prompt label' }),
      text(t.copy('prompt'), 90, 216, 640, {
        fontFamily: t.font('heading'),
        fontSize: 32,
        fontWeight: 700,
        fill: t.color('primary'),
        align: 'center',
      }),
      star(5, 880, 60, 120, t.color('primary'), { innerRatio: 0.42 }),
      iconBox(t, 'arrow-right', 150, 340),
      wordBox(t, post, 350, 340, 480),
      wordBox(t, less, 150, 530, 440),
      wordBox(t, and, 620, 530, 210),
      iconBox(t, 'arrow-down', 150, 720),
      wordBox(t, sell, 350, 720, 480),
      wordBox(t, more, 150, 910, 480),
      iconBox(t, 'arrow-right', 660, 910),
      text(t.copy('closing'), 0, 1170, W, {
        fontFamily: t.font('heading'),
        fontSize: 38,
        fontWeight: 700,
        fill: t.color('text'),
        align: 'center',
      }),
    ];
  });

const closeSpec = (theme: CommentTheme) =>
  ({
    colors: {
      background: { value: theme.brand, hint: 'Page' },
      primary: { value: theme.ink, hint: 'The two large stars' },
      accent: { value: theme.accent, hint: 'The small star at the bottom' },
      text: { value: theme.paper, hint: 'You are this, Close to and the caption note' },
    },
    fonts: { heading: HEAD, body: BODY },
    copy: {
      lead: { label: 'Lead line', value: 'You are this' },
      title: { label: 'Title', value: 'Close to...' },
      note: { label: 'Note', value: 'Read the caption\nbefore you scroll' },
    },
  }) as const satisfies ThemeSpec;

export const closeTo = (theme: CommentTheme) =>
  themed(W, H, closeSpec(theme), (t) => [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    text(t.copy('lead'), 80, 110, 800, {
      fontFamily: t.font('heading'),
      fontSize: 64,
      fontWeight: 500,
      fill: t.color('text'),
    }),
    text(t.copy('title'), 80, 190, 900, {
      fontFamily: t.font('heading'),
      fontSize: 124,
      fontWeight: 800,
      fill: t.color('text'),
    }),
    text(t.copy('note'), 80, 380, 420, {
      fontFamily: t.font('body'),
      fontSize: 34,
      fontWeight: 500,
      fill: t.color('text'),
      lineHeight: 1.35,
    }),
    photo('phone-hand-2', 420, 500, 600, 790, { cornerRadius: 36 }),
    star(5, 900, 70, 100, t.color('primary'), { innerRatio: 0.42 }),
    star(5, 70, 1150, 130, t.color('primary'), { innerRatio: 0.42 }),
    star(5, 290, 1230, 70, t.color('accent'), { innerRatio: 0.42 }),
  ]);

const skipSpec = (theme: CommentTheme) =>
  ({
    colors: {
      background: { value: theme.brand, hint: 'Page' },
      primary: { value: theme.ink, hint: 'The star and the answer pill' },
      text: {
        value: theme.paper,
        hint: 'Outlined DON’T SKIP, solid THE COMMENTS and the pill text',
      },
    },
    fonts: { heading: DISPLAY, body: { ...HEAD, label: 'Body font' } },
    copy: {
      outlined: { label: 'Outlined line', value: 'DON’T SKIP' },
      solid: { label: 'Solid line', value: 'THE COMMENTS' },
      cta: { label: 'Pill', value: 'The answer is waiting below' },
    },
  }) as const satisfies ThemeSpec;

export const dontSkip = (theme: CommentTheme) =>
  themed(W, H, skipSpec(theme), (t) => [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    photo('woman-portrait-6', 330, 120, 690, 1100, { cornerRadius: 30 }),
    text(t.copy('outlined'), 50, 1290, 1100, {
      fontFamily: t.font('heading'),
      fontSize: 100,
      fontWeight: 400,
      fill: t.shade('text', clear(theme.paper)),
      stroke: t.color('text'),
      strokeWidth: 3,
      rotation: -90,
    }),
    text(t.copy('solid'), 170, 1290, 1100, {
      fontFamily: t.font('heading'),
      fontSize: 100,
      fontWeight: 400,
      fill: t.color('text'),
      rotation: -90,
    }),
    star(5, 930, 40, 110, t.color('primary'), { innerRatio: 0.42 }),
    pill(t.copy('cta'), 400, 1150, {
      fill: t.color('primary'),
      color: t.color('text'),
      fontSize: 34,
      fontFamily: t.font('body'),
      fontWeight: 700,
      width: 560,
    }),
  ]);
