import { linear } from '@/design';
import {
  circle,
  photo,
  poly,
  rect,
  shadow,
  star,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BLOCK, BODY, BRAND, brandMark, DISPLAY, H, MONO, SIGNAL as S, SCRIPT, W } from './palette';

interface WeeklyStyle {
  background: string;
  ink: string;
  accent: string;
  script: string;
  word: string;
  label: string;
}

const weeklyShow = (style: WeeklyStyle) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: style.background, hint: 'Page' },
        accent: {
          value: style.accent,
          hint: 'Circle behind the mic, the two sparkles and the script line',
        },
        text: { value: style.ink, hint: 'Top label, the big word and the brand mark' },
      },
      fonts: { script: SCRIPT, heading: DISPLAY, body: BODY },
      copy: {
        label: { label: 'Top label', value: style.label },
        script: { label: 'Script line', value: style.script },
        word: { label: 'Big word', value: style.word },
        brand: BRAND,
      },
    } as const satisfies ThemeSpec,
    (t) => [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      text(t.copy('label'), 0, 90, W, {
        fontFamily: t.font('body'),
        fontSize: 32,
        fontWeight: 800,
        fill: t.color('text'),
        align: 'center',
        letterSpacing: 5,
      }),
      circle(540, 530, 340, t.color('accent'), { name: 'Circle' }),
      photo('microphone-1', 250, 240, 580, 580, { cornerRadius: 290, filters: MONO }),
      star(4, 860, 200, 90, t.color('accent'), { innerRatio: 0.3, name: 'Sparkle' }),
      star(4, 150, 760, 60, t.color('accent'), { innerRatio: 0.3, name: 'Sparkle' }),
      text(t.copy('script'), 0, 880, W, {
        fontFamily: t.font('script'),
        fontSize: 110,
        fontWeight: 700,
        fill: t.color('accent'),
        align: 'center',
      }),
      text(t.copy('word'), 0, 1000, W, {
        fontFamily: t.font('heading'),
        fontSize: 150,
        fontWeight: 400,
        fill: t.color('text'),
        align: 'center',
        lineHeight: 1,
      }),
      brandMark(t.copy('brand'), t.font('body'), t.color('text'), 1225),
    ],
  );

export const weeklyBefore = weeklyShow({
  background: S.paper,
  ink: S.ink,
  accent: S.flame,
  script: 'Streaming',
  word: 'WEEKLY',
  label: 'AVAILABLE ON 92.1 FM',
});

export const weeklyAfter = weeklyShow({
  background: '#0d1b1e',
  ink: '#ffffff',
  accent: '#c6f432',
  script: 'Stream it',
  word: 'TONIGHT',
  label: 'FRESH EPISODES EVERY FRIDAY',
});

const qaSpec = {
  colors: {
    background: { value: S.ink, hint: 'Page and the live time text' },
    primary: { value: S.amber, hint: 'ANYTHING and the top of the left bubble gradient' },
    accent: {
      value: S.flame,
      hint: 'Bottom of the left bubble gradient, its tail and the Q&A text',
    },
    text: {
      value: S.white,
      hint: 'ASK US, the right speech bubble and its tail, and the brand mark',
    },
  },
  fonts: { heading: BLOCK, body: BODY },
  copy: {
    title: { label: 'Title', value: 'ASK US' },
    subtitle: { label: 'Second title line', value: 'ANYTHING' },
    time: { label: 'Live time', value: 'LIVE  ·  THU 8PM' },
    bubble: { label: 'Bubble text', value: 'Q&A' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const liveQa = themed(W, H, qaSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  text(t.copy('title'), 90, 110, 900, {
    fontFamily: t.font('heading'),
    fontSize: 190,
    fontWeight: 400,
    fill: t.color('text'),
    lineHeight: 1,
  }),
  text(t.copy('subtitle'), 90, 320, 900, {
    fontFamily: t.font('heading'),
    fontSize: 130,
    fontWeight: 400,
    fill: t.color('primary'),
    lineHeight: 1,
  }),
  rect(110, 560, 540, 330, linear(160, t.color('primary'), t.color('accent')), {
    cornerRadius: 40,
    name: 'Bubble',
  }),
  poly(
    [
      [190, 880],
      [300, 880],
      [160, 990],
    ],
    t.color('accent'),
    { name: 'Bubble tail' },
  ),
  text(t.copy('time'), 150, 600, 460, {
    fontFamily: t.font('body'),
    fontSize: 36,
    fontWeight: 800,
    fill: t.color('background'),
    letterSpacing: 2,
  }),
  rect(470, 740, 500, 330, t.color('text'), {
    cornerRadius: 40,
    name: 'Bubble',
    ...shadow(40, 14),
  }),
  poly(
    [
      [800, 1060],
      [900, 1060],
      [940, 1160],
    ],
    t.color('text'),
    { name: 'Bubble tail' },
  ),
  text(t.copy('bubble'), 470, 815, 500, {
    fontFamily: t.font('heading'),
    fontSize: 150,
    fontWeight: 400,
    fill: t.color('accent'),
    align: 'center',
    lineHeight: 1,
  }),
  brandMark(t.copy('brand'), t.font('body'), t.color('text'), 1230, 400),
]);
