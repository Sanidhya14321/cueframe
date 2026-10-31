import { circle, icon, photo, rect, type ThemeSpec, themed } from '../../../kit';
import { H, HAWKS, HEADING, iceBackground, LABEL, RINK_HINT, say, toned, W } from './palette';

const rivalSpec = {
  colors: {
    background: { value: HAWKS.rinkTop, hint: RINK_HINT },
    primary: {
      value: HAWKS.navy,
      hint: 'VS disc, the day tag text, RIVAL GAME and the arena line',
    },
    secondary: {
      value: HAWKS.blue,
      hint: 'Date, the tint on the left photo and the skate marks',
    },
    accent: { value: HAWKS.amber, hint: 'Tint on the right photo' },
    surface: { value: HAWKS.white, hint: 'VS ring and lettering, and the day tag' },
  },
  fonts: { heading: HEADING, label: LABEL },
  copy: {
    day: { label: 'Day and time', value: 'THURSDAY\n7 PM' },
    versus: { label: 'Versus', value: 'VS' },
    title: { label: 'Title', value: 'RIVAL' },
    subtitle: { label: 'Second title line', value: 'GAME' },
    date: { label: 'Date', value: 'DEC\n12' },
    arena: { label: 'Arena', value: 'ICEPLEX ARENA' },
  },
} as const satisfies ThemeSpec;

export const rivalGame = themed(W, H, rivalSpec, (t) => {
  const heading = t.font('heading');
  const label = t.font('label');
  return [
    iceBackground(W, H, {
      top: t.color('background'),
      bottom: t.shade('background', HAWKS.rinkBottom),
      mark: t.shade('secondary', HAWKS.skate),
    }),
    toned('hockey-2', 0, 0, 535, 800, t.shade('secondary', 'rgba(29,111,184,0.45)')),
    toned('hockey-2', 545, 0, 535, 800, t.shade('accent', 'rgba(255,184,28,0.4)'), {
      flip: true,
    }),
    circle(540, 470, 90, t.color('primary'), { stroke: t.color('surface'), strokeWidth: 8 }),
    say(t.copy('versus'), 450, 425, 180, heading, 96, 400, t.color('surface'), {
      align: 'center',
      lineHeight: 1,
    }),
    rect(420, 60, 240, 110, t.color('surface'), { cornerRadius: 14, name: 'Day tag' }),
    say(t.copy('day'), 420, 72, 240, label, 38, 700, t.color('primary'), {
      align: 'center',
      lineHeight: 1.1,
    }),
    say(t.copy('title'), 0, 830, W, heading, 220, 400, t.color('primary'), {
      align: 'center',
      lineHeight: 1,
      letterSpacing: 10,
    }),
    say(t.copy('subtitle'), 170, 1040, 460, heading, 220, 400, t.color('primary'), {
      lineHeight: 1,
      letterSpacing: 10,
    }),
    say(t.copy('date'), 650, 1050, 260, heading, 100, 400, t.color('secondary'), {
      lineHeight: 1,
    }),
    say(t.copy('arena'), 0, 1280, W, label, 32, 600, t.color('primary'), {
      align: 'center',
      letterSpacing: 10,
    }),
  ];
});

const countdownSpec = {
  colors: {
    background: { value: HAWKS.rinkTop, hint: RINK_HINT },
    primary: {
      value: HAWKS.navy,
      hint: 'Photo frame, DAY TO GO, the feather and the matchup line',
    },
    secondary: { value: HAWKS.blue, hint: 'Kicker above the countdown and the skate marks' },
    accent: { value: HAWKS.amber, hint: 'Big countdown number' },
  },
  fonts: { heading: HEADING, label: LABEL },
  copy: {
    number: { label: 'Days left', value: '1' },
    kicker: { label: 'Kicker', value: 'RIVALRY GAME' },
    title: { label: 'Title', value: 'DAY\nTO GO' },
    matchup: { label: 'Matchup and time', value: 'HAWKS vs IRONCLADS  |  FRI 7 PM' },
  },
} as const satisfies ThemeSpec;

export const countdown = themed(W, H, countdownSpec, (t) => {
  const heading = t.font('heading');
  const label = t.font('label');
  return [
    iceBackground(W, H, {
      top: t.color('background'),
      bottom: t.shade('background', HAWKS.rinkBottom),
      mark: t.shade('secondary', HAWKS.skate),
    }),
    say(t.copy('number'), 30, 80, 440, heading, 1000, 400, t.color('accent'), {
      align: 'center',
      lineHeight: 1,
    }),
    photo('hockey-1', 470, 90, 540, 620, {
      cornerRadius: 28,
      stroke: t.color('primary'),
      strokeWidth: 8,
    }),
    say(t.copy('kicker'), 470, 760, 560, label, 42, 700, t.color('secondary'), {
      letterSpacing: 14,
    }),
    say(t.copy('title'), 470, 820, 560, heading, 210, 400, t.color('primary'), {
      lineHeight: 0.95,
    }),
    icon('feather', 80, 1220, 70, t.color('primary'), { strokeWidth: 2 }),
    say(t.copy('matchup'), 170, 1232, 860, label, 40, 700, t.color('primary'), {
      letterSpacing: 3,
    }),
  ];
});
