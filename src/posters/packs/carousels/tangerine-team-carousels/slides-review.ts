import type { DesignIconName } from '@/design';
import { circle, icon, rect, type ThemeSpec, themed } from '../../../kit';
import {
  DARK_PAGE,
  darkBackground,
  FONT,
  H,
  HANDLE,
  lightBackground,
  say,
  TANGERINE,
  W,
} from './palette';

const STROKE = 7;

const wordWidth = (word: string, size: number) => word.length * size * 0.62;

const toneCoverSpec = {
  colors: {
    background: {
      value: TANGERINE.forest,
      hint: `${DARK_PAGE}, plus the arrow inside the button`,
    },
    primary: { value: TANGERINE.orange, hint: 'Tone and the path line beside it' },
    secondary: { value: TANGERINE.sage, hint: 'Subtitle' },
    text: { value: TANGERINE.white, hint: 'Find Your Brand and the round button' },
  },
  fonts: { body: FONT },
  copy: {
    title: { label: 'Title', value: 'Find\nYour\nBrand' },
    highlight: { label: 'Highlight', value: 'Tone' },
    subtitle: { label: 'Subtitle', value: 'How to sound clear,\nwarm and consistent.' },
  },
} as const satisfies ThemeSpec;

export const toneCover = themed(W, H, toneCoverSpec, (t) => {
  const write = say(t.font('body'));
  const highlight = t.copy('highlight');
  return [
    darkBackground(t),
    write(t.copy('title'), 90, 200, 800, 120, t.color('text'), 800, { lineHeight: 1 }),
    write(highlight, 90, 560, 500, 120, t.color('primary'), 800, { lineHeight: 1 }),
    rect(
      90 + wordWidth(highlight, 120) + 30,
      626,
      W - 120 - wordWidth(highlight, 120),
      STROKE,
      t.color('primary'),
      { name: 'Path' },
    ),
    write(t.copy('subtitle'), 90, 760, 800, 42, t.color('secondary'), 500),
    circle(150, 1150, 60, t.color('text')),
    icon('arrow-right', 115, 1115, 70, t.color('background'), { strokeWidth: 2.4 }),
  ];
});

interface ToneStyle {
  enterY: number;
  lead: string;
  word: string;
  wordTop: number;
  body: string;
}

const toneStep = (style: ToneStyle) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: TANGERINE.forest, hint: DARK_PAGE },
        primary: {
          value: TANGERINE.orange,
          hint: 'Highlighted word and the path line running into it',
        },
        secondary: { value: TANGERINE.sage, hint: 'Body paragraph' },
        text: { value: TANGERINE.white, hint: 'Title lead' },
      },
      fonts: { body: FONT },
      copy: {
        lead: { label: 'Title lead', value: style.lead },
        word: { label: 'Highlighted word', value: style.word },
        body: { label: 'Body', value: style.body },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const write = say(t.font('body'));
      const size = 92;
      const { enterY, wordTop } = style;
      const wordY = wordTop + Math.round(size * 0.55);
      const word = t.copy('word');
      const wordEnd = 130 + wordWidth(word, size);
      const path = t.color('primary');
      return [
        darkBackground(t),
        write(t.copy('lead'), 130, wordTop - 110, 900, size, t.color('text'), 800, {
          lineHeight: 1.1,
        }),
        write(word, 130, wordTop, 900, size, path, 800, { lineHeight: 1.1 }),
        rect(0, enterY, 64, STROKE, path, { name: 'Path' }),
        rect(60, Math.min(enterY, wordY), STROKE, Math.abs(enterY - wordY) + STROKE, path, {
          name: 'Path',
        }),
        rect(60, wordY, 50, STROKE, path, { name: 'Path' }),
        rect(wordEnd + 30, wordY, W - wordEnd - 30, STROKE, path, { name: 'Path' }),
        write(t.copy('body'), 130, wordTop + 160, 860, 38, t.color('secondary'), 400, {
          lineHeight: 1.5,
        }),
      ];
    },
  );

export const toneValues = toneStep({
  enterY: 626,
  lead: 'Pick Your',
  word: 'Values',
  wordTop: 390,
  body: 'Choose three words that describe\nhow you want to be felt, then\nfilter every post through them.',
});

export const toneWords = toneStep({
  enterY: 441,
  lead: 'Shape Your',
  word: 'Words',
  wordTop: 590,
  body: 'Swap jargon for plain talk. Short\nsentences, real examples and a\nlittle personality go a long way.',
});

export const toneReader = toneStep({
  enterY: 641,
  lead: 'Meet Your',
  word: 'Reader',
  wordTop: 450,
  body: 'Write for one person you know\nwell. Their questions become your\ntopics and their words your copy.',
});

const LIGHT_PAGE = { value: TANGERINE.white, hint: 'Page gradient' } as const;

const reviewCoverSpec = {
  colors: {
    background: LIGHT_PAGE,
    primary: { value: TANGERINE.orange, hint: 'Chevrons and Yearly Review' },
    text: { value: TANGERINE.forest, hint: 'Handle and subtitle' },
  },
  fonts: { body: FONT },
  copy: {
    handle: HANDLE,
    title: { label: 'Title', value: 'Yearly\nReview:' },
    subtitle: { label: 'Subtitle', value: 'Engagement\nand ROI' },
  },
} as const satisfies ThemeSpec;

export const reviewCover = themed(W, H, reviewCoverSpec, (t) => {
  const write = say(t.font('body'));
  return [
    lightBackground(t),
    write(t.copy('handle'), 90, 90, 600, 32, t.color('text'), 600),
    [0, 1, 2].map((index) =>
      icon('chevron-right', 430 + index * 130, 420, 260, t.color('primary'), {
        strokeWidth: 2.6,
      }),
    ),
    write(t.copy('title'), 90, 760, 900, 96, t.color('primary'), 800, { lineHeight: 1.05 }),
    write(t.copy('subtitle'), 90, 980, 900, 72, t.color('text'), 600, { lineHeight: 1.1 }),
  ];
});

const reviewStat = (value: string, label: string, symbol: DesignIconName) =>
  themed(
    W,
    H,
    {
      colors: {
        background: LIGHT_PAGE,
        primary: {
          value: TANGERINE.orange,
          hint: 'Big number and the icon; its pale tint colors the halo behind the icon',
        },
        text: { value: TANGERINE.forest, hint: 'Handle and the stat label' },
      },
      fonts: { body: FONT },
      copy: {
        handle: HANDLE,
        value: { label: 'Stat', value },
        label: { label: 'Stat label', value: label },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const write = say(t.font('body'));
      return [
        lightBackground(t),
        write(t.copy('handle'), 90, 90, 600, 32, t.color('text'), 600),
        write(t.copy('value'), 90, 300, 900, 230, t.color('primary'), 800, { lineHeight: 1 }),
        write(t.copy('label'), 90, 560, 800, 68, t.color('text'), 500, { lineHeight: 1.15 }),
        circle(800, 1070, 230, t.shade('primary', 'rgba(255,138,61,0.16)'), {
          name: 'Icon halo',
        }),
        icon(symbol, 650, 920, 300, t.color('primary'), { strokeWidth: 1.2 }),
      ];
    },
  );

export const statLeads = reviewStat('41%', 'growth in\nqualified leads', 'trending-up');
export const statReplies = reviewStat('6x', 'more replies\non every post', 'message-circle');
export const statHours = reviewStat('12+', 'hours saved\nevery week', 'clock');
