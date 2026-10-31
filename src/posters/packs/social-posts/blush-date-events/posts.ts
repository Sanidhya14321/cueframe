import {
  circle,
  icon,
  POST_SIZE,
  rect,
  rotateNodes,
  star,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export interface EventPalette {
  brand: string;
  deep: string;
  paper: string;
  muted: string;
}

export const BLUSH: EventPalette = {
  brand: '#ff4f9a',
  deep: '#0f2329',
  paper: '#ffffff',
  muted: '#a7c0c5',
};

export const TANGERINE: EventPalette = {
  brand: '#ff8a3d',
  deep: '#1e1410',
  paper: '#ffffff',
  muted: '#d3bfb2',
};

export const HEADING = { label: 'Heading font', value: 'Urbanist' } as const;
export const BODY = { label: 'Body font', value: 'Inter' } as const;
export const { width: W, height: H } = POST_SIZE;

const IDEAS = [
  'Behind the scenes',
  'Client win',
  'Quick tip',
  'Poll your fans',
  'Myth vs fact',
  'Meet the team',
  'Case study',
  'Ask me anything',
  'Weekend offer',
  'Monthly recap',
  'Tool of the week',
  'Launch teaser',
];

const DAYS = ['Mon', 'Wed', 'Fri'];

const DATES = IDEAS.map((_, index) => {
  const column = index % 3;
  const row = Math.floor(index / 3);
  return `${DAYS[column] ?? 'Mon'} ${String(row * 7 + column * 2 + 3).padStart(2, '0')}`;
});

export const contentCalendar = (p: EventPalette) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: p.deep, hint: 'Page' },
        primary: { value: p.brand, hint: 'Title, the highlighted day headers and the stars' },
        secondary: { value: p.paper, hint: 'Subtitle and the arrow icon' },
        surface: {
          value: '#f4f6f6',
          hint: 'Planner; its shades color the day cells, the plain day headers and the note lines',
        },
        text: {
          value: '#111827',
          hint: 'Dates, ideas, cell borders and the arrow button; its lighter shade colors the spiral rings',
        },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        title: { label: 'Title', value: 'Copy our content\ncalendar' },
        subtitle: { label: 'Subtitle', value: '12 post ideas for your feed' },
        dates: { label: 'Date', value: DATES },
        ideas: { label: 'Post idea', value: IDEAS },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const dates = t.list('dates');
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        text(t.copy('title'), 0, 90, W, {
          fontFamily: t.font('heading'),
          fontSize: 72,
          fontWeight: 800,
          fill: t.color('primary'),
          align: 'center',
          lineHeight: 1.05,
        }),
        text(t.copy('subtitle'), 0, 262, W, {
          fontFamily: t.font('body'),
          fontSize: 32,
          fontWeight: 600,
          fill: t.color('secondary'),
          align: 'center',
        }),
        rect(140, 380, 800, 880, t.color('surface'), {
          cornerRadius: 18,
          name: 'Planner',
          shadow: { color: 'rgba(0,0,0,0.4)', blur: 36, offsetX: 0, offsetY: 14 },
        }),
        Array.from({ length: 10 }, (_, index) =>
          rect(180 + index * 76, 350, 14, 64, t.shade('text', '#1f2937'), {
            cornerRadius: 7,
            name: 'Spiral ring',
          }),
        ),
        t.list('ideas').map((idea, index) => {
          const column = index % 3;
          const row = Math.floor(index / 3);
          const x = 180 + column * 246;
          const y = 450 + row * 196;
          return [
            rect(x, y, 226, 176, t.shade('surface', '#ffffff'), {
              cornerRadius: 10,
              stroke: t.color('text'),
              strokeWidth: 3,
              name: 'Day cell',
            }),
            rect(
              x,
              y,
              226,
              40,
              row % 2 === column % 2 ? t.color('primary') : t.shade('surface', '#e5e7eb'),
              { cornerRadius: 10, name: 'Day header' },
            ),
            text(dates[index] ?? '', x + 16, y + 6, 200, {
              fontFamily: t.font('body'),
              fontSize: 22,
              fontWeight: 700,
              fill: t.color('text'),
            }),
            text(idea, x + 16, y + 58, 196, {
              fontFamily: t.font('heading'),
              fontSize: 28,
              fontWeight: 800,
              fill: t.color('text'),
              lineHeight: 1.1,
            }),
            rect(x + 16, y + 140, 120, 10, t.shade('surface', '#d1d5db'), {
              cornerRadius: 5,
              name: 'Note line',
            }),
          ];
        }),
        star(5, 40, 600, 100, t.color('primary'), { innerRatio: 0.45 }),
        star(5, 950, 900, 100, t.color('primary'), { innerRatio: 0.45 }),
        circle(940, 1250, 56, t.color('text')),
        icon('arrow-up-right', 912, 1222, 56, t.color('secondary'), { strokeWidth: 2.6 }),
      ];
    },
  );

export const eventDay = (p: EventPalette) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: p.brand, hint: 'Page, the kicker and the event name' },
        surface: { value: p.paper, hint: 'Back card, the date, the signup box and the big star' },
        primary: {
          value: p.deep,
          hint: 'Front card, the headline, the signup text and the small star; its lighter shade colors the middle card',
        },
        text: { value: p.muted, hint: 'Hours line' },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        heading: { label: 'Headline', value: 'Save your seat today' },
        kicker: { label: 'Kicker', value: 'Event day' },
        date: { label: 'Date', value: 'Mon, 17 March' },
        hours: { label: 'Hours', value: 'From 9am to 6pm' },
        event: { label: 'Event name', value: 'Weekly newsletter\nlaunch party' },
        signup: { label: 'Signup line', value: 'Subscribe for\nmember-only deals' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const head = t.font('heading');
      const body = t.font('body');
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        rotateNodes(-10, 540, 650, [
          rect(180, 330, 720, 640, t.color('surface'), { cornerRadius: 12, name: 'Back card' }),
        ]),
        rotateNodes(-4, 540, 650, [
          rect(180, 330, 720, 640, t.shade('primary', '#1c3a42'), {
            cornerRadius: 12,
            name: 'Middle card',
          }),
        ]),
        rect(190, 360, 720, 640, t.color('primary'), {
          cornerRadius: 12,
          name: 'Front card',
          shadow: { color: 'rgba(0,0,0,0.35)', blur: 30, offsetX: 0, offsetY: 14 },
        }),
        text(t.copy('kicker'), 250, 420, 600, {
          fontFamily: body,
          fontSize: 34,
          fontWeight: 600,
          fill: t.color('background'),
        }),
        text(t.copy('date'), 250, 470, 640, {
          fontFamily: head,
          fontSize: 76,
          fontWeight: 800,
          fill: t.color('surface'),
        }),
        text(t.copy('hours'), 250, 566, 600, {
          fontFamily: body,
          fontSize: 32,
          fontWeight: 500,
          fill: t.color('text'),
        }),
        text(t.copy('event'), 250, 650, 600, {
          fontFamily: head,
          fontSize: 50,
          fontWeight: 800,
          fill: t.color('background'),
          lineHeight: 1.1,
        }),
        rect(250, 820, 480, 130, t.color('surface'), { cornerRadius: 10, name: 'Signup box' }),
        text(t.copy('signup'), 280, 840, 440, {
          fontFamily: head,
          fontSize: 36,
          fontWeight: 800,
          fill: t.color('primary'),
          lineHeight: 1.1,
        }),
        text(t.copy('heading'), 90, 120, 900, {
          fontFamily: head,
          fontSize: 64,
          fontWeight: 800,
          fill: t.color('primary'),
        }),
        star(5, 90, 1130, 90, t.color('primary'), { innerRatio: 0.45 }),
        star(5, 790, 1000, 230, t.color('surface'), { innerRatio: 0.45 }),
      ];
    },
  );

const MONTH_DAYS = ['01', '04', '08', '13', '17', '21', '25', '28', '30'];
const WEEKDAYS = [
  'Saturday',
  'Tuesday',
  'Saturday',
  'Thursday',
  'Monday',
  'Friday',
  'Tuesday',
  'Friday',
  'Sunday',
];
const TAG_SLOTS = [2, 3, 7];

export const monthEvents = (p: EventPalette) =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: p.deep,
          hint: 'Page, the day numbers and weekdays, and the tags on the light tiles',
        },
        primary: { value: p.brand, hint: 'Alternate day tiles and the bottom star' },
        surface: {
          value: p.paper,
          hint: 'Title, the light day tiles, the tags on the coloured tiles and the top star',
        },
        text: { value: p.muted, hint: 'Kicker above the title' },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        kicker: { label: 'Kicker', value: 'Upcoming' },
        title: { label: 'Title', value: 'November Events' },
        days: { label: 'Day', value: MONTH_DAYS },
        weekdays: { label: 'Weekday', value: WEEKDAYS },
        tags: { label: 'Event', value: ['Open studio', 'Kindness Day', 'Big sale'] },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const head = t.font('heading');
      const body = t.font('body');
      const weekdays = t.list('weekdays');
      const tags = t.list('tags');
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        text(t.copy('kicker'), 80, 110, 600, {
          fontFamily: body,
          fontSize: 36,
          fontWeight: 500,
          fill: t.color('text'),
        }),
        text(t.copy('title'), 80, 160, 920, {
          fontFamily: head,
          fontSize: 84,
          fontWeight: 800,
          fill: t.color('surface'),
        }),
        t.list('days').map((day, index) => {
          const x = 80 + (index % 3) * 316;
          const y = 340 + Math.floor(index / 3) * 300;
          const filled = index % 2 === 0;
          const slot = TAG_SLOTS.indexOf(index);
          return [
            rect(x, y, 290, 270, filled ? t.color('primary') : t.color('surface'), {
              cornerRadius: 8,
              name: 'Day tile',
            }),
            text(day, x + 22, y + 18, 90, {
              fontFamily: head,
              fontSize: 50,
              fontWeight: 800,
              fill: t.color('background'),
            }),
            text(weekdays[index] ?? '', x + 100, y + 34, 180, {
              fontFamily: body,
              fontSize: 24,
              fontWeight: 600,
              fill: t.color('background'),
            }),
            slot === -1
              ? []
              : rotateNodes(-6, x + 40, y + 170, [
                  rect(
                    x + 20,
                    y + 150,
                    250,
                    70,
                    filled ? t.color('surface') : t.color('background'),
                    {
                      cornerRadius: 6,
                      name: 'Event tag',
                    },
                  ),
                  text(tags[slot] ?? '', x + 20, y + 168, 250, {
                    fontFamily: head,
                    fontSize: 30,
                    fontWeight: 800,
                    fill: filled ? t.color('background') : t.color('surface'),
                    align: 'center',
                  }),
                ]),
          ];
        }),
        star(5, 930, 60, 110, t.color('surface'), { innerRatio: 0.45 }),
        star(5, 20, 1250, 80, t.color('primary'), { innerRatio: 0.45 }),
      ];
    },
  );
