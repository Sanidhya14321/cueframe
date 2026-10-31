import { linear } from '@/design';
import {
  circle,
  icon,
  photo,
  rect,
  STORY_SIZE,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { H, HAND_FONT, HANDLE, LILAC as L, SANS_FONT, SERIF_FONT, SOFT, W } from './palette';

const challengeSpec = {
  colors: {
    background: {
      value: L.lilac,
      hint: 'Top of the page gradient; its lighter shade is the bottom',
    },
    primary: { value: L.plum, hint: 'Heart, the title, the pill outlines and the handle' },
    surface: { value: L.cream, hint: 'Frosted day pills' },
    text: { value: L.ink, hint: 'Day text inside the pills' },
  },
  fonts: { heading: SERIF_FONT, body: SANS_FONT },
  copy: {
    title: { label: 'Title', value: '5 Day Self Care\nChallenge' },
    days: {
      label: 'Day',
      value: [
        'Day 1: Ten minutes of morning stretch',
        'Day 2: A screen free evening',
        'Day 3: Tidy one small corner',
        'Day 4: Write three thank yous',
        'Day 5: A long, slow bath',
      ],
    },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const challenge = themed(W, H, challengeSpec, (t) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', L.mist)), {
    name: 'Background',
  }),
  icon('heart', 500, 110, 80, t.color('primary'), { strokeWidth: 1.6 }),
  text(t.copy('title'), 0, 220, W, {
    fontFamily: t.font('heading'),
    fontSize: 92,
    fontWeight: 600,
    fill: t.color('primary'),
    align: 'center',
    lineHeight: 1.05,
  }),
  t.list('days').map((day, index) => [
    rect(150, 490 + index * 128, 780, 92, t.shade('surface', 'rgba(250,247,251,0.7)'), {
      cornerRadius: 46,
      stroke: t.color('primary'),
      strokeWidth: 3,
      name: 'Day pill',
    }),
    text(day, 150, 516 + index * 128, 780, {
      fontFamily: t.font('body'),
      fontSize: 32,
      fontWeight: 500,
      fill: t.color('text'),
      align: 'center',
    }),
  ]),
  text(t.copy('handle'), 0, 1180, W, {
    fontFamily: t.font('body'),
    fontSize: 30,
    fontWeight: 500,
    fill: t.color('primary'),
    align: 'center',
    letterSpacing: 2,
  }),
]);

const definitionSpec = {
  colors: {
    background: { value: L.cream, hint: 'Page' },
    secondary: { value: L.lilac, hint: 'Large soft circle' },
    accent: { value: L.butter, hint: 'Small soft circle' },
    text: {
      value: L.ink,
      hint: 'Word and its definition; its lighter shade colors the pronunciation',
    },
    primary: { value: L.plum, hint: 'Rule; its lighter shade colors the signature' },
  },
  fonts: { heading: SERIF_FONT, body: SANS_FONT, script: HAND_FONT },
  copy: {
    word: { label: 'Word', value: 'Muse' },
    pronunciation: { label: 'Pronunciation', value: '[ myooz ]  ·  Noun' },
    meaning: {
      label: 'Definition',
      value:
        'A woman who moves through the world\nwith quiet confidence, inspiring the\npeople around her simply by being\nexactly who she is.',
    },
    signature: { label: 'Signature', value: 'ines' },
  },
} as const satisfies ThemeSpec;

export const definition = themed(W, H, definitionSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  circle(820, 260, 260, t.shade('secondary', 'rgba(205,187,224,0.45)'), { name: 'Soft circle' }),
  circle(760, 420, 120, t.shade('accent', 'rgba(246,231,168,0.6)'), { name: 'Soft circle' }),
  text(t.copy('word'), 100, 600, 800, {
    fontFamily: t.font('heading'),
    fontSize: 150,
    fontWeight: 500,
    fill: t.color('text'),
    lineHeight: 1,
  }),
  text(t.copy('pronunciation'), 104, 770, 600, {
    fontFamily: t.font('body'),
    fontSize: 32,
    fontWeight: 400,
    italic: true,
    fill: t.shade('text', L.grey),
  }),
  rect(100, 840, 880, 3, t.color('primary'), { name: 'Rule' }),
  text(t.copy('meaning'), 100, 880, 880, {
    fontFamily: t.font('heading'),
    fontSize: 46,
    fontWeight: 500,
    fill: t.color('text'),
    lineHeight: 1.35,
  }),
  text(t.copy('signature'), 820, 1220, 200, {
    fontFamily: t.font('script'),
    fontSize: 64,
    fontWeight: 600,
    fill: t.shade('primary', L.mauve),
    align: 'right',
  }),
]);

const bloomSpec = {
  colors: {
    background: { value: L.mist, hint: 'Top of the page gradient; its deeper shade is the bottom' },
    text: { value: L.ink, hint: 'The bloom word and the soft shadow under the bubbles' },
    primary: { value: L.plum, hint: 'Typing cursor and the chat bubbles' },
    surface: { value: L.cream, hint: 'Text inside the chat bubbles' },
  },
  fonts: { body: SANS_FONT },
  copy: {
    word: { label: 'Word', value: 'bloom' },
    bubbles: {
      label: 'Chat bubble',
      value: ['beyond the comfort zone', 'through every season', 'into your own light'],
    },
  },
} as const satisfies ThemeSpec;

const bloomAt = (width: number, height: number) => {
  const bubbleTop = height * 0.36;
  return themed(width, height, bloomSpec, (t) => [
    rect(0, 0, W, height, linear(180, t.color('background'), t.shade('background', L.lilac)), {
      name: 'Background',
    }),
    photo('woman-portrait-6', 0, height * 0.26, 640, height * 0.74, { filters: SOFT }),
    text(t.copy('word'), 80, height * 0.08, 500, {
      fontFamily: t.font('body'),
      fontSize: 110,
      fontWeight: 300,
      fill: t.color('text'),
      letterSpacing: 4,
    }),
    rect(440, height * 0.08 + 14, 6, 120, t.color('primary'), { name: 'Cursor' }),
    t.list('bubbles').map((bubble, index) => [
      rect(560, bubbleTop + index * 130, 440, 92, t.color('primary'), {
        cornerRadius: 46,
        name: 'Chat bubble',
        ...shadow(20, 8, t.shade('text', 'rgba(42,34,51,0.25)')),
      }),
      text(bubble, 560, bubbleTop + index * 130 + 28, 440, {
        fontFamily: t.font('body'),
        fontSize: 29,
        fontWeight: 500,
        fill: t.color('surface'),
        align: 'center',
      }),
    ]),
  ]);
};

export const bloom = bloomAt(W, H);

export const bloomStory = bloomAt(STORY_SIZE.width, STORY_SIZE.height);

const polaroidSpec = {
  colors: {
    background: { value: L.plum, hint: 'Page under the photo and the photo tint' },
    surface: {
      value: L.cream,
      hint: 'Name at the top, the polaroid frame and the line at the bottom',
    },
    text: { value: L.ink, hint: 'Caption on the polaroid' },
  },
  fonts: { heading: SERIF_FONT, body: SANS_FONT, script: HAND_FONT },
  copy: {
    name: { label: 'Name', value: 'INES MARLOW' },
    caption: { label: 'Caption', value: 'Slow mornings' },
    line: { label: 'Closing line', value: 'Rest is part of the work.' },
  },
} as const satisfies ThemeSpec;

export const polaroid = themed(W, H, polaroidSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  photo('yoga-2', 0, 0, W, H, { filters: { ...SOFT, blur: 14 } }),
  rect(0, 0, W, H, t.shade('background', 'rgba(74,58,92,0.3)'), { name: 'Photo tint' }),
  text(t.copy('name'), 0, 110, W, {
    fontFamily: t.font('body'),
    fontSize: 30,
    fontWeight: 600,
    fill: t.color('surface'),
    align: 'center',
    letterSpacing: 10,
  }),
  rect(210, 230, 660, 860, t.color('surface'), {
    name: 'Polaroid',
    rotation: 0,
    ...shadow(40, 18, 'rgba(0,0,0,0.35)'),
  }),
  photo('yoga-2', 245, 265, 590, 650, { filters: SOFT }),
  text(t.copy('caption'), 210, 950, 660, {
    fontFamily: t.font('script'),
    fontSize: 84,
    fontWeight: 600,
    fill: t.color('text'),
    align: 'center',
  }),
  text(t.copy('line'), 0, 1170, W, {
    fontFamily: t.font('heading'),
    fontSize: 50,
    fontWeight: 500,
    italic: true,
    fill: t.color('surface'),
    align: 'center',
  }),
]);
