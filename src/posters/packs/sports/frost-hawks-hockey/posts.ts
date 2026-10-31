import { linear } from '@/design';
import {
  circle,
  ellipse,
  icon,
  photo,
  poly,
  rect,
  star,
  type ThemeSpec,
  themed,
} from '../../../kit';
import { H, HAWKS, HEADING, iceBackground, LABEL, RINK_HINT, say, toned, W } from './palette';

const PORTRAITS = ['man-portrait-1', 'man-portrait-2', 'man-portrait-3'] as const;

const finalStatsSpec = {
  colors: {
    background: {
      value: HAWKS.navy,
      hint: 'Page and side band gradients, the boxes behind home scores, the stat names and away scores',
    },
    surface: { value: HAWKS.white, hint: 'Stat rows, the matchup line and player names' },
    primary: {
      value: HAWKS.ice,
      hint: 'FINAL STATS, the Three Stars heading, photo frames and the club line',
    },
    accent: { value: HAWKS.amber, hint: 'Home scores and the stars on the photos' },
  },
  fonts: { heading: HEADING, label: LABEL },
  copy: {
    title: { label: 'Title', value: 'FINAL STATS' },
    matchup: { label: 'Matchup', value: 'HAWKS  vs  RAVENS' },
    stats: {
      label: 'Stat',
      value: ['FINAL SCORE', 'SHOTS ON GOAL', 'POWER PLAY', 'HITS', 'FACEOFFS', 'SAVES'],
    },
    home: { label: 'Home value', value: ['5', '38', '2/4', '21', '56%', '22'] },
    away: { label: 'Away value', value: ['2', '24', '0/3', '17', '44%', '33'] },
    starsTitle: { label: 'Stars heading', value: 'THREE STARS' },
    names: { label: 'Player', value: ['J. LAINE', 'M. OKAFOR', 'T. REYES'] },
    club: { label: 'Club line', value: 'FROST HAWKS HOCKEY CLUB' },
  },
} as const satisfies ThemeSpec;

export const finalStats = themed(W, H, finalStatsSpec, (t) => {
  const label = t.font('label');
  const home = t.list('home');
  const away = t.list('away');
  return [
    rect(0, 0, W, H, linear(170, t.color('background'), t.shade('background', HAWKS.deep)), {
      name: 'Background',
    }),
    rect(0, 0, 300, H, linear(180, t.shade('background', HAWKS.steel), t.color('background')), {
      name: 'Side band',
    }),
    say(t.copy('title'), 30, 1290, 1230, t.font('heading'), 250, 400, t.color('primary'), {
      rotation: -90,
      letterSpacing: 4,
      lineHeight: 1,
    }),
    say(t.copy('matchup'), 340, 110, 680, label, 44, 700, t.color('surface'), {
      letterSpacing: 4,
    }),
    t.list('stats').map((stat, index) => {
      const y = 200 + index * 92;
      return [
        rect(340, y, 680, 76, t.color('surface'), { cornerRadius: 12, name: 'Stat row' }),
        say(stat, 370, y + 16, 380, label, 40, 700, t.color('background')),
        rect(770, y + 10, 110, 56, t.color('background'), {
          cornerRadius: 8,
          name: 'Home value',
        }),
        say(home[index] ?? '', 770, y + 16, 110, label, 40, 700, t.color('accent'), {
          align: 'center',
        }),
        say(away[index] ?? '', 900, y + 16, 100, label, 40, 600, t.color('background'), {
          align: 'center',
        }),
      ];
    }),
    say(t.copy('starsTitle'), 340, 790, 680, label, 40, 700, t.color('primary'), {
      letterSpacing: 6,
    }),
    t.list('names').map((name, index) => {
      const x = 340 + index * 235;
      return [
        photo(PORTRAITS[index] ?? 'man-portrait-1', x, 860, 210, 250, {
          cornerRadius: 16,
          stroke: t.color('primary'),
          strokeWidth: 4,
        }),
        star(5, x + 160, 875, 36, t.color('accent'), { innerRatio: 0.45 }),
        say(name, x - 10, 1130, 230, label, 36, 700, t.color('surface'), { align: 'center' }),
      ];
    }),
    say(t.copy('club'), 340, 1240, 680, label, 32, 600, t.color('primary'), {
      letterSpacing: 6,
    }),
  ];
});

const puckDropSpec = {
  colors: {
    background: { value: HAWKS.rinkTop, hint: RINK_HINT },
    primary: {
      value: HAWKS.navy,
      hint: 'Feather, the big time and time zone; its shades color the puck and its shadow',
    },
    secondary: {
      value: HAWKS.ice,
      hint: 'Date and the ring around the puck; its blue shade colors the skate marks',
    },
    accent: {
      value: HAWKS.amber,
      hint: 'Center disc on the puck; its darker shade colors PM and the bottom of the disc',
    },
    text: { value: HAWKS.white, hint: 'PUCK DROP on the puck' },
  },
  fonts: { heading: HEADING },
  copy: {
    title: { label: 'Title', value: 'PUCK DROP' },
    date: { label: 'Date', value: 'NOV 08, 2027' },
    time: { label: 'Time', value: '7:30' },
    meridiem: { label: 'AM or PM', value: 'PM' },
    zone: { label: 'Time zone', value: 'EST' },
  },
} as const satisfies ThemeSpec;

export const puckDrop = themed(W, H, puckDropSpec, (t) => {
  const heading = t.font('heading');
  return [
    iceBackground(W, H, {
      top: t.color('background'),
      bottom: t.shade('background', HAWKS.rinkBottom),
      mark: t.shade('secondary', HAWKS.skate),
    }),
    circle(
      540,
      520,
      350,
      linear(180, t.shade('primary', '#1f2a40'), t.shade('primary', '#04070e')),
      {
        name: 'Puck',
        shadow: {
          color: t.shade('primary', 'rgba(5,12,29,0.35)'),
          blur: 50,
          offsetX: 0,
          offsetY: 24,
        },
      },
    ),
    ellipse(220, 200, 640, 640, t.shade('secondary', HAWKS.clear), {
      stroke: t.shade('secondary', 'rgba(143,211,255,0.35)'),
      strokeWidth: 6,
      name: 'Puck ring',
    }),
    say(t.copy('title'), 190, 270, 700, heading, 110, 400, t.color('text'), {
      align: 'center',
      letterSpacing: 8,
    }),
    circle(540, 520, 105, linear(150, t.color('accent'), t.shade('accent', HAWKS.gold))),
    icon('feather', 480, 460, 120, t.color('primary'), { strokeWidth: 1.8 }),
    say(t.copy('date'), 190, 655, 700, heading, 84, 400, t.color('secondary'), {
      align: 'center',
      letterSpacing: 4,
    }),
    say(t.copy('time'), 60, 920, 640, heading, 360, 400, t.color('primary'), {
      align: 'right',
      lineHeight: 1,
    }),
    say(t.copy('meridiem'), 730, 960, 300, heading, 150, 400, t.shade('accent', HAWKS.gold), {
      lineHeight: 1,
    }),
    say(t.copy('zone'), 730, 1100, 300, heading, 150, 400, t.color('primary'), {
      lineHeight: 1,
    }),
  ];
});

const playerCardSpec = {
  colors: {
    background: {
      value: HAWKS.steel,
      hint: 'Page gradient; its darker shade is the bottom of the gradient',
    },
    surface: {
      value: '#cfe8f7',
      hint: 'Card frame gradient; its darker shade is the bottom of the frame',
    },
    primary: {
      value: HAWKS.navy,
      hint: 'Rating and name boxes; its translucent shade tints the photo',
    },
    secondary: {
      value: HAWKS.ice,
      hint: 'Box outlines, OVERALL, the jersey number and the side label',
    },
    text: { value: HAWKS.white, hint: 'Rating and first name' },
    accent: { value: HAWKS.amber, hint: 'Last name' },
  },
  fonts: { heading: HEADING, label: LABEL },
  copy: {
    rating: { label: 'Rating', value: '94' },
    ratingLabel: { label: 'Rating label', value: 'OVERALL' },
    first: { label: 'First name', value: 'LUKAS' },
    number: { label: 'Jersey number', value: '#19' },
    last: { label: 'Last name', value: 'BRANDT' },
    team: { label: 'Team', value: 'FROST HAWKS' },
  },
} as const satisfies ThemeSpec;

export const playerCard = themed(W, H, playerCardSpec, (t) => {
  const heading = t.font('heading');
  const label = t.font('label');
  return [
    rect(0, 0, W, H, linear(160, t.color('background'), t.shade('background', HAWKS.deep)), {
      name: 'Background',
    }),
    poly(
      [
        [120, 120],
        [960, 120],
        [960, 1100],
        [880, 1190],
        [120, 1190],
      ],
      linear(160, t.color('surface'), t.shade('surface', '#3d6f99')),
      { name: 'Card frame' },
    ),
    toned('hockey-2', 145, 145, 790, 950, t.shade('primary', 'rgba(10,22,49,0.28)')),
    rect(80, 80, 210, 230, t.color('primary'), {
      stroke: t.color('secondary'),
      strokeWidth: 6,
      name: 'Rating box',
    }),
    say(t.copy('rating'), 80, 96, 210, heading, 150, 400, t.color('text'), {
      align: 'center',
      lineHeight: 1,
    }),
    say(t.copy('ratingLabel'), 80, 250, 210, label, 36, 700, t.color('secondary'), {
      align: 'center',
      letterSpacing: 4,
    }),
    rect(500, 1010, 500, 230, t.color('primary'), {
      stroke: t.color('secondary'),
      strokeWidth: 6,
      name: 'Name box',
    }),
    say(t.copy('first'), 535, 1030, 300, heading, 80, 400, t.color('text'), { letterSpacing: 4 }),
    say(t.copy('number'), 830, 1040, 140, label, 48, 700, t.color('secondary'), {
      align: 'right',
    }),
    say(t.copy('last'), 535, 1105, 440, heading, 120, 400, t.color('accent'), {
      letterSpacing: 4,
      lineHeight: 1,
    }),
    say(t.copy('team'), 1050, 200, 600, label, 44, 700, t.color('secondary'), {
      rotation: 90,
      letterSpacing: 10,
    }),
  ];
});
