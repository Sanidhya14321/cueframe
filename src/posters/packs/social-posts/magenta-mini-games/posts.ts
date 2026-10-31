import {
  type Nodes,
  POST_SIZE,
  rect,
  rotateNodes,
  STORY_SIZE,
  star,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { maze } from './maze';

export interface GameTheme {
  brand: string;
  ink: string;
  paper: string;
  night: string;
  nightText: string;
  nightMuted: string;
}

export const MAGENTA: GameTheme = {
  brand: '#ff2f86',
  ink: '#120a10',
  paper: '#ffffff',
  night: '#120a10',
  nightText: '#ffffff',
  nightMuted: '#d6c8d1',
};

export const OCEAN: GameTheme = {
  brand: '#0fa3a3',
  ink: '#04201f',
  paper: '#ffffff',
  night: '#04201f',
  nightText: '#ffffff',
  nightMuted: '#bfe3df',
};

export const LILAC: GameTheme = {
  brand: '#7b3fe4',
  ink: '#1c0b3b',
  paper: '#ffffff',
  night: '#e9defc',
  nightText: '#1c0b3b',
  nightMuted: '#4b3a6b',
};

export const HEADING = { label: 'Heading font', value: 'Montserrat' } as const;
const BODY = { label: 'Body font', value: 'Inter' } as const;
export const PW = POST_SIZE.width;
export const PH = POST_SIZE.height;

export const tile = (
  glyph: string,
  x: number,
  y: number,
  size: number,
  fill: string,
  glyphFill: string,
  fontFamily: string,
) => [
  rect(x, y, size, size, fill, { name: 'Tile', cornerRadius: size * 0.12 }),
  text(glyph, x, y + size * 0.16, size, {
    fontFamily,
    fontSize: size * 0.55,
    fontWeight: 800,
    fill: glyphFill,
    align: 'center',
    lineHeight: 1.2,
  }),
];

const routeSpec = (theme: GameTheme) =>
  ({
    colors: {
      background: { value: theme.brand, hint: 'Page' },
      surface: { value: theme.paper, hint: 'Letter tiles above the maze' },
      primary: { value: theme.ink, hint: 'Maze walls, the tile letters and the star' },
      text: { value: theme.paper, hint: 'Headline and the comment line' },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Headline', value: 'FIND THE ROUTE TO\nYOUR SECRET DEAL' },
      letters: { label: 'Route letter', value: ['A', 'B', 'C'] },
      note: {
        label: 'Comment line',
        value: 'Comment the right letter and\ncheck your inbox for the deal',
      },
    },
  }) as const satisfies ThemeSpec;

export const routeMaze = (theme: GameTheme): Template =>
  themed(PW, PH, routeSpec(theme), (t) => [
    rect(0, 0, PW, PH, t.color('background'), { name: 'Background' }),
    text(t.copy('title'), 0, 80, PW, {
      fontFamily: t.font('heading'),
      fontSize: 56,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1.15,
    }),
    t
      .list('letters')
      .map((glyph, index) =>
        tile(
          glyph,
          160 + (1 + index * 4) * 63.33 - 2,
          256,
          68,
          t.color('surface'),
          t.color('primary'),
          t.font('heading'),
        ),
      ),
    maze(160, 340, 760, t.color('primary'), 9, {
      columns: 12,
      rows: 12,
      seed: 20260,
      entrances: [1, 5, 9],
      exit: 6,
    }),
    text(t.copy('note'), 0, 1135, PW, {
      fontFamily: t.font('body'),
      fontSize: 30,
      fontWeight: 600,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1.35,
    }),
    star(5, 490, 1240, 100, t.color('primary'), { innerRatio: 0.42 }),
  ]);

const pickSpec = (theme: GameTheme) =>
  ({
    colors: {
      background: { value: theme.night, hint: 'Page; its shade colors the tile numbers' },
      surface: { value: theme.paper, hint: 'Number tiles and the callout text' },
      primary: { value: theme.brand, hint: 'Big star, callout box and the bottom star' },
      text: {
        value: theme.nightText,
        hint: "IT'S MONDAY, the small star and the answer bars; its shade colors the subtitle",
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Headline', value: "IT'S\nMONDAY" },
      subtitle: { label: 'Subtitle', value: 'Pick a number and find\nout what your week holds' },
      callout: { label: 'Callout', value: 'Answers are waiting\nin the caption below' },
      numbers: { label: 'Number', value: ['1', '2', '3', '4'] },
    },
  }) as const satisfies ThemeSpec;

export const pickNumber = (theme: GameTheme): Template =>
  themed(PW, PH, pickSpec(theme), (t) => [
    rect(0, 0, PW, PH, t.color('background'), { name: 'Background' }),
    star(5, 120, 70, 170, t.color('primary'), { innerRatio: 0.42 }),
    star(5, 70, 110, 90, t.color('text'), { innerRatio: 0.42 }),
    text(t.copy('title'), 90, 380, 560, {
      fontFamily: t.font('heading'),
      fontSize: 100,
      fontWeight: 800,
      fill: t.color('text'),
      lineHeight: 1.05,
    }),
    text(t.copy('subtitle'), 90, 620, 560, {
      fontFamily: t.font('body'),
      fontSize: 32,
      fontWeight: 500,
      fill: t.shade('text', theme.nightMuted),
      lineHeight: 1.35,
    }),
    rect(90, 760, 500, 130, t.color('primary'), { name: 'Callout' }),
    text(t.copy('callout'), 120, 784, 460, {
      fontFamily: t.font('heading'),
      fontSize: 30,
      fontWeight: 700,
      fill: t.color('surface'),
      lineHeight: 1.25,
    }),
    t.list('numbers').map((value, index) => [
      tile(
        value,
        700,
        250 + index * 220,
        110,
        t.color('surface'),
        t.shade('background', theme.ink),
        t.font('heading'),
      ),
      rect(840, 290 + index * 220, 180, 30, t.color('text'), {
        name: 'Answer bar',
        cornerRadius: 15,
      }),
    ]),
    star(5, 880, 1200, 100, t.color('primary'), { innerRatio: 0.42 }),
  ]);

const quizSpec = (theme: GameTheme) =>
  ({
    colors: {
      background: { value: theme.brand, hint: 'Page' },
      surface: { value: theme.paper, hint: 'Answer boxes' },
      primary: { value: theme.ink, hint: 'QUIZ tag, number tiles, answers and the star' },
      text: { value: theme.paper, hint: 'TIME!, QUIZ, the question and the tile numbers' },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'TIME!' },
      tag: { label: 'Tag', value: 'QUIZ' },
      question: { label: 'Question', value: 'What keeps customers\ncoming back for more?' },
      numbers: { label: 'Number', value: ['1', '2', '3', '4'] },
      answers: {
        label: 'Answer',
        value: ['Fast shipping', 'Friendly support', 'Fair prices', 'Loyalty perks'],
      },
    },
  }) as const satisfies ThemeSpec;

const storySpec = (theme: GameTheme) => {
  const base = quizSpec(theme);
  return {
    ...base,
    colors: {
      ...base.colors,
      text: {
        value: theme.paper,
        hint: 'TIME!, QUIZ, the question, the tile numbers and the poll line',
      },
    },
    copy: {
      ...base.copy,
      poll: { label: 'Poll line', value: 'Vote in the poll and see the answer tomorrow' },
    },
  } as const satisfies ThemeSpec;
};

type QuizSpec = ReturnType<typeof quizSpec>;

interface QuizTheme {
  color: (key: keyof QuizSpec['colors']) => string;
  font: (key: keyof QuizSpec['fonts']) => string;
  copy: (key: keyof QuizSpec['copy']) => string;
  list: (key: keyof QuizSpec['copy']) => string[];
}

const quiz = (t: QuizTheme, height: number, story: boolean, poll: Nodes): Nodes[] => {
  const shift = story ? 240 : 0;
  const gap = story ? 160 : 130;
  const numbers = t.list('numbers');
  return [
    rect(0, 0, PW, height, t.color('background'), { name: 'Background' }),
    text(t.copy('title'), 0, 150 + shift, PW, {
      fontFamily: t.font('heading'),
      fontSize: 180,
      fontWeight: 900,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1,
    }),
    rotateNodes(-12, 650, 110 + shift, [
      rect(650, 110 + shift, 230, 92, t.color('primary'), { name: 'Quiz tag', cornerRadius: 12 }),
      text(t.copy('tag'), 650, 122 + shift, 230, {
        fontFamily: t.font('heading'),
        fontSize: 60,
        fontWeight: 900,
        fill: t.color('text'),
        align: 'center',
      }),
    ]),
    text(t.copy('question'), 0, 400 + shift, PW, {
      fontFamily: t.font('heading'),
      fontSize: 46,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1.2,
    }),
    t.list('answers').map((answer, index) => {
      const y = 600 + shift + index * gap;
      return [
        tile(
          numbers[index] ?? '',
          170,
          y,
          100,
          t.color('primary'),
          t.color('text'),
          t.font('heading'),
        ),
        rect(290, y, 620, 100, t.color('surface'), { name: 'Option', cornerRadius: 12 }),
        text(answer, 330, y + 28, 560, {
          fontFamily: t.font('body'),
          fontSize: 38,
          fontWeight: 600,
          fill: t.color('primary'),
        }),
      ];
    }),
    poll,
    star(5, 480, height - 150, 120, t.color('primary'), { innerRatio: 0.42 }),
  ];
};

export const quizTime = (theme: GameTheme): Template =>
  themed(PW, PH, quizSpec(theme), (t) => quiz(t, PH, false, []));

export const quizStory = (theme: GameTheme): Template =>
  themed(STORY_SIZE.width, STORY_SIZE.height, storySpec(theme), (t) =>
    quiz(
      t,
      STORY_SIZE.height,
      true,
      text(t.copy('poll'), 140, 1520, 800, {
        fontFamily: t.font('body'),
        fontSize: 34,
        fontWeight: 600,
        fill: t.color('text'),
        align: 'center',
        lineHeight: 1.35,
      }),
    ),
  );
