import { linear } from '@/design';
import { photo, poly, rect, STORY_SIZE, type ThemeSpec, themed } from '../../../kit';
import {
  H,
  HAWKS,
  HEADING,
  iceBackground,
  LABEL,
  RINK_HINT,
  SCRIPT,
  say,
  toned,
  W,
} from './palette';

const playerOfYearSpec = {
  colors: {
    background: { value: HAWKS.rinkTop, hint: RINK_HINT },
    primary: {
      value: HAWKS.navy,
      hint: 'Kicker, big points total, first name, position, stat values and the left of the bottom band',
    },
    secondary: {
      value: HAWKS.blue,
      hint: 'Last name, the right of the bottom band, the photo tint and the skate marks',
    },
    accent: { value: HAWKS.gold, hint: 'POINTS and the stat labels' },
  },
  fonts: { heading: HEADING, label: LABEL },
  copy: {
    kicker: { label: 'Kicker', value: 'PLAYER OF THE YEAR' },
    total: { label: 'Points total', value: '150' },
    unit: { label: 'Points label', value: 'POINTS' },
    first: { label: 'First name', value: 'MILO' },
    last: { label: 'Last name', value: 'HARTLEY' },
    position: { label: 'Number and position', value: '#27  CENTER' },
    values: { label: 'Stat value', value: ['61.2', '94', '56'] },
    labels: { label: 'Stat label', value: ['FACEOFF WIN %', 'ASSISTS', 'GOALS'] },
  },
} as const satisfies ThemeSpec;

export const playerOfYear = themed(W, H, playerOfYearSpec, (t) => {
  const heading = t.font('heading');
  const label = t.font('label');
  const labels = t.list('labels');
  return [
    iceBackground(W, H, {
      top: t.color('background'),
      bottom: t.shade('background', HAWKS.rinkBottom),
      mark: t.shade('secondary', HAWKS.skate),
    }),
    poly(
      [
        [0, 1220],
        [W, 1110],
        [W, H],
        [0, H],
      ],
      linear(90, t.color('primary'), t.color('secondary')),
      { name: 'Ice band' },
    ),
    say(t.copy('kicker'), 0, 80, W, label, 46, 700, t.color('primary'), {
      italic: true,
      align: 'center',
      letterSpacing: 14,
    }),
    say(t.copy('total'), 0, 150, W, heading, 430, 400, t.color('primary'), {
      align: 'center',
      lineHeight: 1,
    }),
    say(t.copy('unit'), 600, 560, 400, heading, 90, 400, t.color('accent'), {
      align: 'right',
      letterSpacing: 6,
    }),
    say(t.copy('first'), 80, 600, 400, heading, 80, 400, t.color('primary')),
    say(t.copy('last'), 80, 670, 600, heading, 120, 400, t.color('secondary')),
    say(t.copy('position'), 80, 800, 400, label, 32, 600, t.color('primary'), {
      letterSpacing: 4,
    }),
    toned('hockey-2', 80, 860, 620, 400, t.shade('secondary', 'rgba(29,111,184,0.18)'), {
      radius: 28,
    }),
    t.list('values').map((value, index) => {
      const y = 680 + index * 180;
      return [
        say(value, 760, y, 260, heading, 100, 400, t.color('primary'), { lineHeight: 1 }),
        say(labels[index] ?? '', 760, y + 100, 260, label, 32, 700, t.color('accent'), {
          letterSpacing: 3,
        }),
      ];
    }),
  ];
});

const gameDaySpec = {
  colors: {
    background: { value: HAWKS.rinkTop, hint: RINK_HINT },
    primary: {
      value: HAWKS.navy,
      hint: 'Bottom of the date gradient, the info bar and the photo frame',
    },
    secondary: { value: HAWKS.blue, hint: 'Top of the date gradient and the skate marks' },
    accent: { value: HAWKS.gold, hint: 'Game Day script' },
    text: { value: HAWKS.white, hint: 'Matchup and time on the info bar' },
  },
  fonts: { script: SCRIPT, heading: HEADING, label: LABEL },
  copy: {
    script: { label: 'Script line', value: 'Game Day' },
    date: { label: 'Date', value: 'NOV. 8' },
    info: { label: 'Matchup and time', value: 'HAWKS vs RAVENS  |  7:30 PM EST' },
  },
} as const satisfies ThemeSpec;

const gameDay = (height: number) => {
  const top = (height - H) / 2;
  return themed(W, height, gameDaySpec, (t) => [
    iceBackground(W, height, {
      top: t.color('background'),
      bottom: t.shade('background', HAWKS.rinkBottom),
      mark: t.shade('secondary', HAWKS.skate),
    }),
    say(t.copy('script'), 0, 60 + top * 0.6, W, t.font('script'), 140, 400, t.color('accent'), {
      align: 'center',
    }),
    say(
      t.copy('date'),
      0,
      220 + top * 0.6,
      W,
      t.font('heading'),
      400,
      400,
      linear(180, t.color('secondary'), t.color('primary')),
      { align: 'center', lineHeight: 1 },
    ),
    rect(190, 640 + top * 0.6, 700, 64, t.color('primary'), { cornerRadius: 6, name: 'Info bar' }),
    say(t.copy('info'), 190, 652 + top * 0.6, 700, t.font('label'), 36, 700, t.color('text'), {
      align: 'center',
      letterSpacing: 3,
    }),
    photo('hockey-1', 60, 760 + top * 0.6, 960, height - 820 - top * 0.6, {
      cornerRadius: 28,
      stroke: t.color('primary'),
      strokeWidth: 8,
    }),
  ]);
};

export const gameDayPost = gameDay(H);
export const gameDayStory = gameDay(STORY_SIZE.height);
