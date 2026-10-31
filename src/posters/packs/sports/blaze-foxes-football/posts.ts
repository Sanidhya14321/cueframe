import { linear } from '@/design';
import {
  circle,
  icon,
  line,
  POST_SIZE,
  photo,
  pill,
  rect,
  STORY_SIZE,
  text,
  themed,
} from '../../../kit';
import { BODY, crest, FOX, HEADING, TITLE } from './palette';

export const { width: W, height: H } = POST_SIZE;

export const gameDay = themed(
  W,
  H,
  {
    colors: {
      primary: { value: FOX.blaze, hint: 'Top of the page gradient and the Foxes crest' },
      background: { value: FOX.cream, hint: 'Bottom of the page gradient' },
      secondary: { value: FOX.rival, hint: 'Rams crest' },
      surface: { value: FOX.white, hint: 'GAMEDAY, the player name and the crest icons' },
      text: { value: FOX.ink, hint: 'Date line, VS and the team names' },
    },
    fonts: {
      heading: HEADING,
      body: BODY,
      script: { label: 'Script font', value: 'Pacifico' },
    },
    copy: {
      date: { label: 'Date line', value: 'SATURDAY, SEP 19  ·  7:00 PM' },
      title: { label: 'Title', value: 'GAMEDAY' },
      player: { label: 'Player', value: 'Malik Ortega' },
      vs: { label: 'Versus', value: 'VS' },
      teams: { label: 'Team', value: ['FOXES', 'RAMS'] },
    },
  },
  (t) => {
    const [home = '', away = ''] = t.list('teams');
    const team = (label: string, x: number) =>
      text(label, x, 1228, 200, {
        fontFamily: t.font('body'),
        fontSize: 30,
        fontWeight: 700,
        fill: t.color('text'),
        align: 'center',
        letterSpacing: 3,
      });
    return [
      rect(0, 0, W, H, linear(180, t.color('primary'), t.color('background')), {
        name: 'Background',
      }),
      text(t.copy('date'), 0, 80, W, {
        fontFamily: t.font('body'),
        fontSize: 46,
        fontWeight: 700,
        fill: t.color('text'),
        align: 'center',
        letterSpacing: 3,
      }),
      text(t.copy('title'), 0, 150, W, {
        fontFamily: t.font('heading'),
        fontSize: 260,
        fontWeight: 400,
        fill: t.color('surface'),
        align: 'center',
        lineHeight: 1.1,
      }),
      photo('football-1', 150, 470, 780, 560, { cornerRadius: 36 }),
      text(t.copy('player'), 440, 940, 480, {
        fontFamily: t.font('script'),
        fontSize: 56,
        fontWeight: 400,
        fill: t.color('surface'),
        align: 'center',
      }),
      crest(330, 1080, 120, t.color('primary'), 'flame', t.color('surface')),
      crest(630, 1080, 120, t.color('secondary'), 'zap', t.color('surface')),
      text(t.copy('vs'), 470, 1114, 140, {
        fontFamily: t.font('heading'),
        fontSize: 64,
        fontWeight: 400,
        fill: t.color('text'),
        align: 'center',
      }),
      team(home, 290),
      team(away, 590),
    ];
  },
);

const countdown = (height: number) =>
  themed(
    W,
    height,
    {
      colors: {
        background: {
          value: FOX.smoke,
          hint: 'Page gradient; its darker shade colors the bottom of the page',
        },
        primary: { value: FOX.blaze, hint: 'Crest and the countdown number' },
        surface: {
          value: FOX.white,
          hint: 'Translucent midfield line, hash marks and the match pill',
        },
        text: {
          value: FOX.white,
          hint: 'Club name, HOURS UNTIL KICKOFF and the crest icon; its cream tint colors the match pill text',
        },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        club: { label: 'Club', value: 'RIDGEVIEW FOOTBALL' },
        count: { label: 'Countdown', value: '36' },
        unit: { label: 'Countdown label', value: 'HOURS UNTIL KICKOFF' },
        match: { label: 'Match', value: 'FOXES VS RAMS  ·  HOLLIS FIELD' },
      },
    },
    (t) => {
      const mid = height / 2;
      const hash = t.shade('surface', 'rgba(255,255,255,0.3)');
      return [
        rect(0, 0, W, height, linear(180, t.color('background'), t.shade('background', FOX.ink)), {
          name: 'Background',
        }),
        rect(W / 2 - 3, 0, 6, height, t.shade('surface', 'rgba(255,255,255,0.18)'), {
          name: 'Midfield line',
        }),
        Array.from({ length: Math.floor(height / 54) }, (_, index) => {
          const size = index % 5 === 0 ? 60 : 34;
          return [
            rect(40, 20 + index * 54, size, 6, hash, { name: 'Hash mark' }),
            rect(W - 40 - size, 20 + index * 54, size, 6, hash, { name: 'Hash mark' }),
          ];
        }),
        crest(470, mid - 520, 64, t.color('primary'), 'flame', t.color('text')),
        text(t.copy('club'), 0, mid - 430, W, {
          fontFamily: t.font('body'),
          fontSize: 40,
          fontWeight: 700,
          fill: t.color('text'),
          align: 'center',
          letterSpacing: 6,
        }),
        text(t.copy('count'), 0, mid - 360, W, {
          fontFamily: t.font('heading'),
          fontSize: 560,
          fontWeight: 400,
          fill: t.color('primary'),
          align: 'center',
          lineHeight: 1.1,
        }),
        text(t.copy('unit'), 0, mid + 300, W, {
          fontFamily: t.font('body'),
          fontSize: 64,
          fontWeight: 700,
          fill: t.color('text'),
          align: 'center',
          letterSpacing: 8,
        }),
        pill(t.copy('match'), 250, mid + 410, {
          width: 580,
          fill: t.shade('surface', 'rgba(255,255,255,0.1)'),
          color: t.shade('text', FOX.cream),
          fontSize: 28,
          fontFamily: t.font('body'),
          fontWeight: 600,
          letterSpacing: 2,
        }),
      ];
    },
  );

export const countdownPost = countdown(H);
export const countdownStory = countdown(STORY_SIZE.height);

const PLAYS: readonly (readonly [number, number, 'x' | 'o'])[] = [
  [560, 120, 'x'],
  [680, 90, 'x'],
  [800, 140, 'x'],
  [620, 220, 'o'],
  [740, 250, 'o'],
  [860, 230, 'x'],
  [500, 300, 'o'],
  [640, 330, 'o'],
  [780, 350, 'o'],
  [900, 320, 'x'],
];

export const matchups = themed(
  W,
  H,
  {
    colors: {
      background: { value: FOX.cream, hint: 'Page' },
      primary: { value: FOX.blaze, hint: 'X marks in the play diagram, 2027 and the button' },
      text: {
        value: FOX.ink,
        hint: 'O marks and arrows in the play diagram, SEASON MATCHUPS and the flame icon',
      },
      surface: { value: FOX.white, hint: 'Button label' },
    },
    fonts: {
      heading: HEADING,
      title: TITLE,
      body: BODY,
    },
    copy: {
      year: { label: 'Year', value: '2027' },
      title: { label: 'Title', value: 'SEASON\nMATCHUPS' },
      cta: { label: 'Button', value: 'VIEW SCHEDULE' },
    },
  },
  (t) => [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    PLAYS.map(([x, y, mark]) =>
      mark === 'x'
        ? icon('x', x - 2, y + 2, 64, t.color('primary'), { strokeWidth: 3.6, name: 'X mark' })
        : circle(x + 30, y + 34, 22, t.shade('text', 'rgba(0,0,0,0)'), {
            stroke: t.color('text'),
            strokeWidth: 6,
            name: 'O mark',
          }),
    ),
    line(110, 360, 300, t.color('text'), 6, { arrowEnd: true, rotation: 18, name: 'Play arrow' }),
    line(700, 1080, 260, t.color('text'), 6, { arrowEnd: true, rotation: -24, name: 'Play arrow' }),
    text(t.copy('year'), 0, 470, W, {
      fontFamily: t.font('heading'),
      fontSize: 130,
      fontWeight: 400,
      fill: t.color('primary'),
      align: 'center',
    }),
    text(t.copy('title'), 0, 640, W, {
      fontFamily: t.font('title'),
      fontSize: 128,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1.02,
    }),
    pill(t.copy('cta'), 360, 960, {
      width: 360,
      fill: t.color('primary'),
      color: t.color('surface'),
      fontSize: 34,
      fontFamily: t.font('body'),
      fontWeight: 700,
      letterSpacing: 3,
    }),
    icon('flame', 510, 1200, 60, t.color('text')),
  ],
);
