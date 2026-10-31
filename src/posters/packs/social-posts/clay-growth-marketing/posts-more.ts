import {
  circle,
  group,
  icon,
  poly,
  rect,
  STORY_SIZE,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY, backdrop, CLAY, H, HEADING, W, WEBSITE } from './clay';

const SOCIAL_ICONS = ['globe', 'at-sign', 'briefcase'] as const;

const consistencySpec = {
  colors: {
    background: {
      value: CLAY.light,
      hint: 'Top of the page gradient; its deeper shade colors the bottom',
    },
    primary: {
      value: CLAY.deep,
      hint: 'Diagonal rule, Growth Demands, TENCY, the icon circles and the handles',
    },
    accent: { value: CLAY.brand, hint: 'CONSIS' },
    surface: { value: CLAY.paper, hint: 'Icons inside the circles' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'Growth Demands' },
    word: { label: 'Headline part', value: ['CONSIS', 'TENCY'] },
    handles: {
      label: 'Social handle',
      value: ['@clayhouse.co', '@clayhouse.co', '@clayhouse.co'],
    },
  },
} as const satisfies ThemeSpec;

const consistency = (height: number) =>
  themed(W, height, consistencySpec, (t) => {
    const top = (height - 1350) / 2;
    const heading = t.font('heading');
    const [first = '', second = ''] = t.list('word');
    const word = { fontFamily: heading, fontSize: 230, fontWeight: 800, lineHeight: 1 };
    return [
      backdrop(t.color('background'), t.shade('background', CLAY.soft), height),
      poly(
        [
          [500, 0],
          [560, 0],
          [700, height],
          [640, height],
        ],
        t.color('primary'),
        { name: 'Diagonal rule' },
      ),
      text(t.copy('kicker'), 90, top + 300, 600, {
        fontFamily: t.font('body'),
        fontSize: 44,
        fontWeight: 600,
        fill: t.color('primary'),
      }),
      text(first, 70, top + 360, 960, { ...word, fill: t.color('accent'), letterSpacing: -6 }),
      text(second, 170, top + 590, 900, { ...word, fill: t.color('primary'), letterSpacing: -6 }),
      t.list('handles').map((label, index) => [
        circle(760, top + 960 + index * 80, 26, t.color('primary')),
        icon(SOCIAL_ICONS[index] ?? 'globe', 744, top + 944 + index * 80, 32, t.color('surface')),
        text(label, 806, top + 944 + index * 80, 260, {
          fontFamily: t.font('body'),
          fontSize: 26,
          fontWeight: 600,
          fill: t.color('primary'),
        }),
      ]),
    ];
  });

export const consistencyPost = consistency(H);

export const consistencyStory = consistency(STORY_SIZE.height);

const guessSpec = {
  colors: {
    background: {
      value: CLAY.soft,
      hint: 'Top of the page gradient; its deeper shade colors the bottom',
    },
    primary: {
      value: CLAY.deep,
      hint: 'GUESS THE, the comment prompt and the website; its translucent shade colors the shadows',
    },
    surface: { value: CLAY.paper, hint: 'WORD! and the letter tiles' },
    text: { value: CLAY.ink, hint: 'Letters on the tiles' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'GUESS THE' },
    title: { label: 'Title', value: 'WORD!' },
    firstWord: { label: 'First word letter', value: ['G', '', 'O', 'W', '', 'H'] },
    secondWord: { label: 'Second word letter', value: ['B', '', 'A', 'N', ''] },
    prompt: { label: 'Comment prompt', value: 'Drop your answer in the comments' },
    site: WEBSITE,
  },
} as const satisfies ThemeSpec;

export const guessWord = themed(W, H, guessSpec, (t) => {
  const tintedShadow = t.shade('primary', 'rgba(74,31,23,0.25)');
  const tileRow = (letters: readonly string[], y: number) => {
    const start = (W - (letters.length * 124 - 14)) / 2;
    return letters.map((letter, index) => {
      const x = start + index * 124;
      return group(
        rect(x, y, 110, 120, t.color('surface'), {
          cornerRadius: 14,
          name: 'Letter tile',
          ...shadow(16, 8, tintedShadow),
        }),
        text(letter, x, y + 18, 110, {
          fontFamily: t.font('heading'),
          fontSize: 66,
          fontWeight: 700,
          fill: t.color('text'),
          align: 'center',
        }),
      );
    });
  };
  return [
    backdrop(t.color('background'), t.shade('background', '#e5967a')),
    text(t.copy('kicker'), 0, 170, W, {
      fontFamily: t.font('heading'),
      fontSize: 60,
      fontWeight: 600,
      fill: t.color('primary'),
      align: 'center',
      letterSpacing: 4,
    }),
    text(t.copy('title'), 0, 250, W, {
      fontFamily: t.font('heading'),
      fontSize: 200,
      fontWeight: 800,
      fill: t.color('surface'),
      align: 'center',
      lineHeight: 1,
      ...shadow(24, 10, tintedShadow),
    }),
    tileRow(t.list('firstWord'), 590),
    tileRow(t.list('secondWord'), 760),
    text(t.copy('prompt'), 0, 1000, W, {
      fontFamily: t.font('body'),
      fontSize: 36,
      fontWeight: 600,
      fill: t.color('primary'),
      align: 'center',
    }),
    text(t.copy('site'), 0, 1220, W, {
      fontFamily: t.font('body'),
      fontSize: 26,
      fontWeight: 500,
      fill: t.color('primary'),
      align: 'center',
      letterSpacing: 2,
    }),
  ];
});

const countdownSpec = {
  colors: {
    primary: {
      value: CLAY.brand,
      hint: 'Page gradient and the big number; its darker shade colors the bottom of the page',
    },
    surface: { value: CLAY.paper, hint: 'Calendar page and the body text' },
    secondary: { value: CLAY.soft, hint: 'Calendar header and the website' },
    text: { value: CLAY.ink, hint: 'Calendar rings and Days' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    number: { label: 'Number', value: '7' },
    unit: { label: 'Unit', value: 'Days' },
    body: {
      label: 'Body',
      value: 'Lift your campaign results in\nless than one week of\nfocused strategy.',
    },
    site: WEBSITE,
  },
} as const satisfies ThemeSpec;

export const countdownDays = themed(W, H, countdownSpec, (t) => [
  backdrop(t.color('primary'), t.shade('primary', CLAY.deep), H, 165),
  group(
    rect(330, 250, 420, 440, t.color('surface'), {
      cornerRadius: 40,
      name: 'Calendar',
      ...shadow(50, 24, 'rgba(0,0,0,0.35)'),
    }),
    rect(330, 250, 420, 110, t.color('secondary'), { cornerRadius: 40, name: 'Calendar top' }),
    rect(330, 320, 420, 40, t.color('secondary'), { name: 'Calendar top edge' }),
    Array.from({ length: 7 }, (_, index) =>
      rect(372 + index * 50, 222, 14, 64, t.color('text'), { cornerRadius: 7, name: 'Ring' }),
    ),
    text(t.copy('number'), 330, 380, 420, {
      fontFamily: t.font('heading'),
      fontSize: 200,
      fontWeight: 800,
      fill: t.color('primary'),
      align: 'center',
      lineHeight: 1,
    }),
    text(t.copy('unit'), 330, 590, 420, {
      fontFamily: t.font('heading'),
      fontSize: 52,
      fontWeight: 700,
      fill: t.color('text'),
      align: 'center',
    }),
  ),
  text(t.copy('body'), 90, 820, 900, {
    fontFamily: t.font('body'),
    fontSize: 46,
    fontWeight: 600,
    fill: t.color('surface'),
    align: 'center',
    lineHeight: 1.35,
  }),
  text(t.copy('site'), 0, 1220, W, {
    fontFamily: t.font('body'),
    fontSize: 26,
    fontWeight: 500,
    fill: t.color('secondary'),
    align: 'center',
    letterSpacing: 2,
  }),
]);
