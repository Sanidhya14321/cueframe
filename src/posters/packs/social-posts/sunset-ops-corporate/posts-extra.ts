import { linear, radial } from '@/design';
import {
  checklist,
  circle,
  group,
  rect,
  rotateNodes,
  STORY_SIZE,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BROWN_SHADOW, backdrop, H, HANDLE, HEADING, SUNSET, W } from './posts';

const stagesSpec = {
  colors: {
    background: {
      value: SUNSET.charcoal,
      hint: 'Page and the stair steps; its lighter shade colors the top of the page',
    },
    primary: { value: SUNSET.ember, hint: 'Big number and the warm glow behind it' },
    text: {
      value: SUNSET.white,
      hint: '5 Stages of and Business Ops; its faint shade outlines the steps',
    },
  },
  fonts: { heading: HEADING },
  copy: {
    intro: { label: 'Intro', value: '5 Stages of' },
    title: { label: 'Title', value: 'Business Ops' },
    number: { label: 'Big number', value: '5' },
  },
} as const satisfies ThemeSpec;

const stagesArt = (height: number) => {
  const top = (height - H) / 2;
  return themed(W, height, stagesSpec, (t) => {
    const font = t.font('heading');
    const glow = t.shade('primary', 'rgba(255,106,26,0)');
    return [
      backdrop(t.shade('background', SUNSET.smoke), t.color('background'), 180, height),
      circle(540, top + 720, 470, radial(t.shade('primary', 'rgba(255,106,26,0.55)'), glow, glow), {
        name: 'Glow',
      }),
      text(t.copy('intro'), 0, top + 120, W, {
        fontFamily: font,
        fontSize: 60,
        fontWeight: 500,
        fill: t.color('text'),
        align: 'center',
      }),
      text(t.copy('title'), 0, top + 195, W, {
        fontFamily: font,
        fontSize: 84,
        fontWeight: 900,
        fill: t.color('text'),
        align: 'center',
      }),
      text(t.copy('number'), 0, top + 300, W, {
        fontFamily: font,
        fontSize: 820,
        fontWeight: 900,
        fill: linear(180, t.shade('primary', SUNSET.glow), t.color('primary')),
        align: 'center',
        lineHeight: 1,
      }),
      Array.from({ length: 5 }, (_, index) =>
        rect(
          460 - index * 40,
          top + 1010 + index * 50,
          160 + index * 80,
          50,
          t.color('background'),
          {
            name: 'Step',
            stroke: t.shade('text', 'rgba(255,255,255,0.2)'),
            strokeWidth: 2,
          },
        ),
      ),
    ];
  });
};

export const stagesPost = stagesArt(H);

export const stagesStory = stagesArt(STORY_SIZE.height);

const hiringSpec = {
  colors: {
    background: {
      value: SUNSET.ember,
      hint: 'Page; its lighter shade colors the top corner and its dark shade the Hiring shadow',
    },
    text: { value: SUNSET.white, hint: 'Website, We Are and Hiring' },
    surface: { value: SUNSET.white, hint: 'Roles card; its peach shade colors the middle card' },
    secondary: { value: SUNSET.charcoal, hint: 'Back card, Open roles and the role names' },
    primary: { value: SUNSET.orange, hint: 'Check icons beside the roles' },
  },
  fonts: { heading: HEADING },
  copy: {
    handle: HANDLE,
    intro: { label: 'Intro', value: 'We Are' },
    title: { label: 'Title', value: 'Hiring' },
    cardTitle: { label: 'Card title', value: 'Open roles' },
    roles: { label: 'Role', value: ['Content Lead', 'Motion Designer', 'Growth Analyst'] },
  },
} as const satisfies ThemeSpec;

export const weAreHiring = themed(W, H, hiringSpec, (t) => {
  const font = t.font('heading');
  return [
    backdrop(t.shade('background', SUNSET.glow), t.color('background'), 165),
    text(t.copy('handle'), 0, 90, W, {
      fontFamily: font,
      fontSize: 30,
      fontWeight: 600,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('intro'), 0, 170, W, {
      fontFamily: font,
      fontSize: 130,
      fontWeight: 900,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1,
    }),
    text(t.copy('title'), 0, 300, W, {
      fontFamily: font,
      fontSize: 200,
      fontWeight: 900,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1,
      ...shadow(30, 12, t.shade('background', BROWN_SHADOW)),
    }),
    rotateNodes(-8, 540, 900, [
      rect(170, 640, 740, 520, t.color('secondary'), { cornerRadius: 30, name: 'Back card' }),
    ]),
    rotateNodes(5, 540, 900, [
      rect(170, 640, 740, 520, t.shade('surface', SUNSET.peach), {
        cornerRadius: 30,
        name: 'Middle card',
      }),
    ]),
    group(
      rect(170, 660, 740, 520, t.color('surface'), {
        cornerRadius: 30,
        name: 'Roles card',
        ...shadow(40, 16, 'rgba(0,0,0,0.3)'),
      }),
      text(t.copy('cardTitle'), 230, 710, 600, {
        fontFamily: font,
        fontSize: 44,
        fontWeight: 800,
        fill: t.color('secondary'),
      }),
      checklist(t.list('roles'), 230, 820, 620, {
        color: t.color('secondary'),
        iconColor: t.color('primary'),
        icon: 'circle-check',
        fontSize: 42,
        gap: 100,
        fontFamily: font,
        fontWeight: 600,
      }),
    ),
  ];
});

const STACK_COLUMNS = [3, 2, 1, 3, 0, 5] as const;

const COLUMN = 540;
const MONO_SIZE = 100;
const CHAR = MONO_SIZE * 0.612;

const stackSpec = {
  colors: {
    background: { value: SUNSET.white, hint: 'Page; its warm shade colors the bottom of the page' },
    primary: {
      value: SUNSET.orange,
      hint: 'Highlighted letters; its peach shade colors the column behind them',
    },
    text: { value: SUNSET.charcoal, hint: 'Stacked words; its softer shade colors the footer' },
  },
  fonts: {
    heading: HEADING,
    mono: { label: 'Word font', value: 'Space Mono' },
  },
  copy: {
    words: {
      label: 'Word',
      value: ['ALIGNMENT', 'STRATEGY', 'FOCUS', 'NETWORK', 'TALENT', 'INSIGHT'],
    },
    letters: {
      label: 'Highlighted letter',
      hint: 'The letter of each word that sits in the column',
      value: ['G', 'R', 'O', 'W', 'T', 'H'],
    },
    footer: { label: 'Footer', value: 'Six habits behind lasting growth' },
  },
} as const satisfies ThemeSpec;

export const wordStack = themed(W, H, stackSpec, (t) => {
  const letters = t.list('letters');
  const style = { fontFamily: t.font('mono'), fontSize: MONO_SIZE, fontWeight: 700, lineHeight: 1 };
  return [
    backdrop(t.color('background'), t.shade('background', SUNSET.soft)),
    rect(COLUMN - 50, 140, 100, 1000, t.shade('primary', SUNSET.peach), {
      cornerRadius: 50,
      name: 'Column',
    }),
    t.list('words').map((word, row) => {
      const column = STACK_COLUMNS[row] ?? 0;
      const y = 170 + row * 160;
      const x = COLUMN - (column + 0.5) * CHAR;
      return group(
        text(word, x, y, word.length * CHAR + 20, { ...style, fill: t.color('text') }),
        text(letters[row] ?? '', x + column * CHAR, y, CHAR + 10, {
          ...style,
          fill: t.color('primary'),
        }),
      );
    }),
    text(t.copy('footer'), 0, 1200, W, {
      fontFamily: t.font('heading'),
      fontSize: 36,
      fontWeight: 600,
      fill: t.shade('text', SUNSET.smoke),
      align: 'center',
    }),
  ];
});
