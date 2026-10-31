import { linear } from '@/design';
import {
  bars,
  group,
  photo,
  pill,
  poly,
  rect,
  STORY_SIZE,
  star,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  BODY,
  COURT,
  H,
  HEADING,
  playerFeature,
  SCRIPT,
  saveTheDate,
  schedule,
  startingFive,
  W,
} from './posts';

const statsSpec = {
  colors: {
    background: { value: COURT.deep, hint: 'Page' },
    primary: { value: COURT.gold, hint: 'STATS and the bar chart; its darker shade ends the bars' },
    text: {
      value: COURT.white,
      hint: 'TEAM and the stat numbers; its cream tint colors the stat labels and the chart caption',
    },
  },
  fonts: {
    heading: HEADING,
    body: BODY,
    label: { label: 'Label font', value: 'Inter' },
  },
  copy: {
    title: { label: 'Title', value: 'TEAM' },
    highlight: { label: 'Highlighted title', value: 'STATS' },
    values: { label: 'Stat', value: ['48%', '112'] },
    labels: { label: 'Stat label', value: ['Field goals', 'Points per game'] },
    caption: { label: 'Chart caption', value: 'Last seven games' },
  },
} as const satisfies ThemeSpec;

const teamStats = themed(W, H, statsSpec, (t) => {
  const labels = t.list('labels');
  const cream = t.shade('text', COURT.cream);
  const title = (content: string, y: number, fill: string) =>
    text(content, 80, y, 900, {
      fontFamily: t.font('heading'),
      fontSize: 190,
      fontWeight: 400,
      fill,
      lineHeight: 1,
    });
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    title(t.copy('title'), 80, t.color('text')),
    title(t.copy('highlight'), 270, t.color('primary')),
    t.list('values').map((value, index) => {
      const x = 80 + index * 500;
      return group(
        text(value, x, 560, 420, {
          fontSize: 130,
          fontWeight: 800,
          fontFamily: t.font('heading'),
          fill: t.color('text'),
          align: 'left',
          lineHeight: 1,
        }),
        text(labels[index] ?? '', x, 560 + 130 * 1.12, 420, {
          fontSize: 28,
          fontWeight: 500,
          fontFamily: t.font('label'),
          fill: cream,
          align: 'left',
          lineHeight: 1.3,
        }),
      );
    }),
    bars(
      80,
      900,
      920,
      300,
      [62, 78, 70, 92, 84, 101, 112],
      linear(180, t.color('primary'), t.shade('primary', '#c98a00')),
    ),
    text(t.copy('caption'), 80, 1230, 600, {
      fontFamily: t.font('body'),
      fontSize: 34,
      fontWeight: 400,
      fill: cream,
    }),
  ];
});

interface RecordColors {
  background: string;
  split: string;
  kicker: string;
  body: string;
}

const recordCard = (colors: RecordColors, starOnSplit: boolean) => {
  const spec = {
    colors: {
      background: { value: colors.background, hint: 'Page below the diagonal split' },
      primary: {
        value: colors.split,
        hint: starOnSplit
          ? 'Diagonal top panel, RECORD and the star'
          : 'Diagonal top panel and RECORD',
      },
      accent: {
        value: colors.kicker,
        hint: starOnSplit ? 'UNDEFEATED' : 'UNDEFEATED and the star',
      },
      surface: { value: COURT.white, hint: 'The big score' },
      text: { value: colors.body, hint: 'Message at the bottom' },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      kicker: { label: 'Kicker', value: 'UNDEFEATED' },
      score: { label: 'Score', value: '7-0' },
      label: { label: 'Label', value: 'RECORD' },
      body: {
        label: 'Message',
        value: 'Best start in club history.\nThank you for the noise.',
      },
    },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    poly(
      [
        [0, 0],
        [W, 0],
        [W, 520],
        [0, 820],
      ],
      t.color('primary'),
      { name: 'Split' },
    ),
    text(t.copy('kicker'), 80, 90, 900, {
      fontFamily: t.font('body'),
      fontSize: 64,
      fontWeight: 600,
      fill: t.color('accent'),
      letterSpacing: 10,
    }),
    text(t.copy('score'), 60, 160, 960, {
      fontFamily: t.font('heading'),
      fontSize: 470,
      fontWeight: 400,
      fill: t.color('surface'),
      lineHeight: 1,
    }),
    text(t.copy('label'), 660, 840, 360, {
      fontFamily: t.font('heading'),
      fontSize: 110,
      fontWeight: 400,
      fill: t.color('primary'),
    }),
    star(5, 90, 900, 140, starOnSplit ? t.color('primary') : t.color('accent'), {
      innerRatio: 0.42,
    }),
    text(t.copy('body'), 80, 1080, 900, {
      fontFamily: t.font('body'),
      fontSize: 52,
      fontWeight: 500,
      fill: t.color('text'),
      lineHeight: 1.3,
    }),
  ]);
};

export const record = recordCard(
  { background: COURT.cream, split: COURT.green, kicker: COURT.gold, body: COURT.deep },
  false,
);

export const CRIMSON_RECORD = recordCard(
  { background: '#fdeaea', split: '#9f1d2d', kicker: '#ffd1d1', body: '#3b0a12' },
  true,
);

const allStarColors = {
  background: {
    value: COURT.green,
    hint: 'Page gradient; its darkest shade ends it and fades the photo edge',
  },
  primary: { value: COURT.gold, hint: 'Star and Player of the month' },
  text: { value: COURT.white, hint: 'ALL-STAR' },
} as const;

const allStarCopy = {
  title: { label: 'Title', value: 'ALL-STAR' },
  subtitle: { label: 'Subtitle', value: 'Player of the month' },
} as const;

const storySpec = {
  colors: {
    ...allStarColors,
    primary: { value: COURT.gold, hint: 'Star, Player of the month and the Vote button' },
    background: {
      value: COURT.green,
      hint: 'Page gradient; its darkest shade ends it, fades the photo edge and colors the button label',
    },
  },
  fonts: { heading: HEADING, script: SCRIPT, body: BODY },
  copy: { ...allStarCopy, cta: { label: 'Button', value: 'VOTE NOW' } },
} as const satisfies ThemeSpec;

const SW = STORY_SIZE.width;
const SH = STORY_SIZE.height;

export const allStar = themed(SW, SH, storySpec, (t) => {
  const deep = t.shade('background', COURT.deep);
  return [
    rect(0, 0, SW, SH, linear(170, t.color('background'), deep), { name: 'Background' }),
    photo('basketball-1', 0, 0, SW, 1150, { name: 'Hero' }),
    rect(0, 900, SW, 260, linear(180, t.shade('background', 'rgba(6,42,27,0)'), deep), {
      name: 'Fade',
    }),
    star(5, 780, 120, 220, t.color('primary'), { innerRatio: 0.42 }),
    text(t.copy('title'), 0, 1180, SW, {
      fontFamily: t.font('heading'),
      fontSize: 240,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('subtitle'), 0, 1470, SW, {
      fontFamily: t.font('script'),
      fontSize: 96,
      fontWeight: 400,
      fill: t.color('primary'),
      align: 'center',
    }),
    pill(t.copy('cta'), 380, 1700, {
      fill: t.color('primary'),
      color: deep,
      fontSize: 44,
      fontFamily: t.font('body'),
      fontWeight: 600,
    }),
  ];
});

const postSpec = {
  colors: {
    ...allStarColors,
    background: { value: COURT.green, hint: 'Page gradient; its darkest shade ends it' },
  },
  fonts: { heading: HEADING, script: SCRIPT },
  copy: allStarCopy,
} as const satisfies ThemeSpec;

export const allStarPost = themed(W, H, postSpec, (t) => [
  rect(0, 0, W, H, linear(170, t.color('background'), t.shade('background', COURT.deep)), {
    name: 'Background',
  }),
  photo('basketball-1', 0, 0, W, 760, { name: 'Hero' }),
  star(5, 820, 60, 180, t.color('primary'), { innerRatio: 0.42 }),
  text(t.copy('title'), 0, 800, W, {
    fontFamily: t.font('heading'),
    fontSize: 210,
    fontWeight: 400,
    fill: t.color('text'),
    align: 'center',
  }),
  text(t.copy('subtitle'), 0, 1060, W, {
    fontFamily: t.font('script'),
    fontSize: 80,
    fontWeight: 400,
    fill: t.color('primary'),
    align: 'center',
  }),
]);

export const POSTS = [
  playerFeature,
  saveTheDate,
  startingFive,
  schedule,
  teamStats,
  record,
  allStarPost,
];
