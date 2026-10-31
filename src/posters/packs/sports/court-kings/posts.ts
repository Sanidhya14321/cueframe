import { linear, radial } from '@/design';
import { circle, POST_SIZE, photo, pill, rect, type ThemeSpec, text, themed } from '../../../kit';

export const COURT = {
  green: '#0f5132',
  deep: '#062a1b',
  gold: '#f5b700',
  cream: '#fff8e7',
  white: '#ffffff',
};

export const { width: W, height: H } = POST_SIZE;

export const HEADING = { label: 'Heading font', value: 'Anton' } as const;
export const BODY = { label: 'Body font', value: 'Oswald' } as const;
export const SCRIPT = { label: 'Script font', value: 'Pacifico' } as const;

const featureSpec = {
  colors: {
    background: {
      value: COURT.green,
      hint: 'Page gradient; its darkest shade colors the badge label',
    },
    primary: {
      value: COURT.gold,
      hint: 'Career high badge, the last name and the faded jersey number behind the photo',
    },
    text: { value: COURT.white, hint: 'First name' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    number: { label: 'Jersey number', value: '23' },
    firstName: { label: 'First name', value: 'MARCUS' },
    lastName: { label: 'Last name', value: 'REED' },
    badge: { label: 'Badge', value: 'CAREER HIGH 41 PTS' },
  },
} as const satisfies ThemeSpec;

export const playerFeature = themed(W, H, featureSpec, (t) => [
  rect(0, 0, W, H, linear(160, t.color('background'), t.shade('background', COURT.deep)), {
    name: 'Background',
  }),
  text(t.copy('number'), -40, 120, 1160, {
    fontFamily: t.font('heading'),
    fontSize: 900,
    fontWeight: 400,
    fill: t.shade('primary', 'rgba(245,183,0,0.22)'),
    align: 'center',
    lineHeight: 1,
  }),
  photo('basketball-1', 140, 260, 800, 760, { cornerRadius: 40 }),
  text(t.copy('firstName'), 0, 1040, W, {
    fontFamily: t.font('heading'),
    fontSize: 150,
    fontWeight: 400,
    fill: t.color('text'),
    align: 'center',
    letterSpacing: 8,
  }),
  text(t.copy('lastName'), 0, 1190, W, {
    fontFamily: t.font('heading'),
    fontSize: 90,
    fontWeight: 400,
    fill: t.color('primary'),
    align: 'center',
    letterSpacing: 30,
  }),
  pill(t.copy('badge'), 700, 80, {
    fill: t.color('primary'),
    color: t.shade('background', COURT.deep),
    fontSize: 30,
    fontFamily: t.font('body'),
    fontWeight: 600,
  }),
]);

const dateSpec = {
  colors: {
    background: { value: '#e9c48f', hint: 'Hardwood floor and its board seams' },
    primary: {
      value: COURT.deep,
      hint: 'SAVE, DATE, the date card and the venue line; its lighter shade colors the script word',
    },
    accent: { value: COURT.gold, hint: 'TIP OFF on the date card' },
    text: { value: COURT.white, hint: 'Date and time on the card' },
    secondary: { value: '#f58a2c', hint: 'Basketball' },
  },
  fonts: { heading: HEADING, script: SCRIPT, body: BODY },
  copy: {
    save: { label: 'First title word', value: 'SAVE' },
    joiner: { label: 'Joining word', value: 'the' },
    date: { label: 'Second title word', value: 'DATE' },
    kicker: { label: 'Card kicker', value: 'TIP OFF' },
    day: { label: 'Month and day', value: '03\n14' },
    time: { label: 'Time', value: '7:30 PM' },
    venue: { label: 'Venue', value: 'Riverside Arena · Court 2' },
  },
} as const satisfies ThemeSpec;

export const saveTheDate = themed(W, H, dateSpec, (t) => {
  const word = (content: string, y: number) =>
    text(content, 80, y, 900, {
      fontFamily: t.font('heading'),
      fontSize: 260,
      fontWeight: 400,
      fill: t.color('primary'),
      lineHeight: 1,
    });
  return [
    rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', '#c9955a')), {
      name: 'Hardwood',
    }),
    Array.from({ length: 9 }, (_, index) =>
      rect(index * 120, 0, 4, H, t.shade('background', 'rgba(120,72,30,0.18)'), {
        name: 'Board seam',
      }),
    ),
    word(t.copy('save'), 140),
    text(t.copy('joiner'), 90, 420, 400, {
      fontFamily: t.font('script'),
      fontSize: 120,
      fontWeight: 400,
      fill: t.shade('primary', COURT.green),
    }),
    word(t.copy('date'), 560),
    rect(680, 160, 330, 560, t.color('primary'), { cornerRadius: 24, name: 'Date card' }),
    text(t.copy('kicker'), 680, 200, 330, {
      fontFamily: t.font('body'),
      fontSize: 44,
      fontWeight: 600,
      fill: t.color('accent'),
      align: 'center',
    }),
    text(t.copy('day'), 680, 270, 330, {
      fontFamily: t.font('heading'),
      fontSize: 150,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1,
    }),
    text(t.copy('time'), 680, 600, 330, {
      fontFamily: t.font('body'),
      fontSize: 52,
      fontWeight: 600,
      fill: t.color('text'),
      align: 'center',
    }),
    circle(880, 1110, 170, radial(t.color('secondary'), t.shade('secondary', '#b4501a')), {
      name: 'Ball',
    }),
    text(t.copy('venue'), 80, 1180, 640, {
      fontFamily: t.font('body'),
      fontSize: 40,
      fontWeight: 500,
      fill: t.color('primary'),
    }),
  ];
});

const fiveSpec = {
  colors: {
    background: { value: COURT.cream, hint: 'Page' },
    primary: {
      value: COURT.green,
      hint: 'STARTING, the outlined FIVE and the line at the bottom',
    },
    accent: { value: COURT.gold, hint: 'Rule under the player names' },
    text: { value: COURT.deep, hint: 'Player names' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'STARTING' },
    outline: { label: 'Outlined title', value: 'FIVE' },
    names: { label: 'Player', value: ['REED', 'OKOYE', 'LINDQVIST', 'PARK', 'DUARTE'] },
    footer: { label: 'Footer', value: 'HOME OPENER · FRIDAY' },
  },
} as const satisfies ThemeSpec;

export const startingFive = themed(W, H, fiveSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  text(t.copy('title'), 0, 70, W, {
    fontFamily: t.font('heading'),
    fontSize: 170,
    fontWeight: 400,
    fill: t.color('primary'),
    align: 'center',
    lineHeight: 1,
  }),
  text(t.copy('outline'), 0, 240, W, {
    fontFamily: t.font('heading'),
    fontSize: 170,
    fontWeight: 400,
    fill: t.shade('primary', 'rgba(0,0,0,0)'),
    stroke: t.color('primary'),
    strokeWidth: 4,
    align: 'center',
    lineHeight: 1,
  }),
  photo('basketball-2', 60, 450, 960, 600, { cornerRadius: 28 }),
  t.list('names').map((name, index) =>
    text(name, 60 + index * 196, 1100, 190, {
      fontFamily: t.font('body'),
      fontSize: 34,
      fontWeight: 600,
      fill: t.color('text'),
      align: 'center',
    }),
  ),
  rect(60, 1180, 960, 6, t.color('accent'), { name: 'Rule' }),
  text(t.copy('footer'), 0, 1220, W, {
    fontFamily: t.font('body'),
    fontSize: 40,
    fontWeight: 500,
    fill: t.color('primary'),
    align: 'center',
    letterSpacing: 6,
  }),
]);

const GAME_DAYS = [3, 9, 12, 17, 24];

const scheduleSpec = {
  colors: {
    background: {
      value: COURT.green,
      hint: 'Page; its darkest shade colors the game day numbers, HOME and AWAY and the button label',
    },
    primary: {
      value: COURT.gold,
      hint: '2027 SCHEDULE, the game day tiles and the tickets button',
    },
    text: {
      value: COURT.white,
      hint: 'MARCH and the day numbers; its faint tint fills the empty day tiles and its cream tint the stream line',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    month: { label: 'Month', value: 'MARCH' },
    subtitle: { label: 'Subtitle', value: '2027 SCHEDULE' },
    days: {
      label: 'Day number',
      value: Array.from({ length: 28 }, (_, index) => String(index + 1)),
    },
    games: { label: 'Game', value: ['AWAY', 'AWAY', 'HOME', 'AWAY', 'HOME'] },
    note: { label: 'Note', value: 'All games stream live on the team app' },
    cta: { label: 'Button', value: 'GET TICKETS' },
  },
} as const satisfies ThemeSpec;

export const schedule = themed(W, H, scheduleSpec, (t) => {
  const games = t.list('games');
  const deep = t.shade('background', COURT.deep);
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    text(t.copy('month'), 80, 80, 600, {
      fontFamily: t.font('heading'),
      fontSize: 160,
      fontWeight: 400,
      fill: t.color('text'),
    }),
    text(t.copy('subtitle'), 80, 270, 600, {
      fontFamily: t.font('body'),
      fontSize: 46,
      fontWeight: 500,
      fill: t.color('primary'),
      letterSpacing: 4,
    }),
    t.list('days').map((day, index) => {
      const x = 80 + (index % 7) * 132;
      const y = 400 + Math.floor(index / 7) * 150;
      const game = GAME_DAYS.indexOf(index);
      const isGame = game >= 0;
      return [
        rect(
          x,
          y,
          120,
          130,
          isGame ? t.color('primary') : t.shade('text', 'rgba(255,255,255,0.08)'),
          { cornerRadius: 14, name: 'Day' },
        ),
        text(day, x, y + 18, 120, {
          fontFamily: t.font('body'),
          fontSize: 44,
          fontWeight: 600,
          fill: isGame ? deep : t.color('text'),
          align: 'center',
        }),
        isGame
          ? text(games[game] ?? '', x, y + 80, 120, {
              fontFamily: t.font('body'),
              fontSize: 22,
              fontWeight: 600,
              fill: deep,
              align: 'center',
            })
          : [],
      ];
    }),
    text(t.copy('note'), 80, 1040, 920, {
      fontFamily: t.font('body'),
      fontSize: 38,
      fontWeight: 400,
      fill: t.shade('text', COURT.cream),
    }),
    pill(t.copy('cta'), 80, 1150, {
      fill: t.color('primary'),
      color: deep,
      fontSize: 36,
      fontFamily: t.font('body'),
      fontWeight: 600,
    }),
  ];
});
