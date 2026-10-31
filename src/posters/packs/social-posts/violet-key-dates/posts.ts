import { linear } from '@/design';
import {
  circle,
  type Nodes,
  rect,
  rotateNodes,
  shadow,
  star,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { POST } from '../lagoon-saas-stats/theme';

export interface EventTheme {
  main: string;
  dark: string;
  paper: string;
  ink: string;
  onMain: string;
  pop: string;
  star: string;
  headFont: string;
  bodyFont: string;
}

interface CalendarDay {
  day: string;
  weekday: string;
  dark: boolean;
  sticker?: string;
}

export interface EventDayCopy {
  kicker: string;
  date: string;
  hours: string;
  title: string;
  cta: string;
}

export interface MonthCopy {
  kicker: string;
  title: string;
  days: readonly CalendarDay[];
}

export interface SaveCopy {
  title: string;
  invite: string;
  digits: readonly [string, string, string];
  units: readonly [string, string, string];
  reply: string;
  host: string;
}

const { width: W, height: H } = POST;

export const fontsOf = (theme: EventTheme) => ({
  heading: { label: 'Heading font', value: theme.headFont },
  body: { label: 'Body font', value: theme.bodyFont },
});

export const headStyle = (fontFamily: string, size: number, fill: string) => ({
  fontFamily,
  fontSize: size,
  fontWeight: 800,
  fill,
  lineHeight: 1.1,
});

export const bodyStyle = (fontFamily: string, size: number, fill: string, weight = 400) => ({
  fontFamily,
  fontSize: size,
  fontWeight: weight,
  fill,
  lineHeight: 1.35,
});

export const sparkle = (x: number, y: number, size: number, fill: string) =>
  star(5, x, y, size, fill, { innerRatio: 0.45, name: 'Star' });

export const eventDay = (theme: EventTheme, copy: EventDayCopy): Template =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: theme.dark, hint: 'Page and the call to action text' },
        primary: { value: theme.main, hint: 'Event card' },
        surface: { value: theme.paper, hint: 'Back card, call to action box and the sparkles' },
        text: { value: theme.onMain, hint: 'Kicker, date, hours and title on the event card' },
      },
      fonts: fontsOf(theme),
      copy: {
        kicker: { label: 'Kicker', value: copy.kicker },
        date: { label: 'Date', value: copy.date },
        hours: { label: 'Hours', value: copy.hours },
        title: { label: 'Title', value: copy.title },
        cta: { label: 'Call to action', value: copy.cta },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const head = t.font('heading');
      const body = t.font('body');
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        rotateNodes(-9, 540, 680, [
          rect(200, 330, 680, 700, t.color('surface'), { name: 'Back card', cornerRadius: 8 }),
        ]),
        sparkle(120, 210, 170, t.color('surface')),
        rotateNodes(-4, 540, 680, [
          rect(210, 320, 680, 720, t.color('primary'), {
            name: 'Event card',
            cornerRadius: 8,
            ...shadow(40, 18, 'rgba(0,0,0,0.4)'),
          }),
          text(t.copy('kicker'), 270, 380, 580, bodyStyle(body, 34, t.color('text'), 500)),
          text(t.copy('date'), 270, 430, 600, headStyle(head, 80, t.color('text'))),
          text(t.copy('hours'), 270, 540, 580, bodyStyle(body, 32, t.color('text'))),
          text(t.copy('title'), 270, 630, 580, headStyle(head, 52, t.color('text'))),
          rect(270, 830, 560, 150, t.color('surface'), { name: 'Call to action', cornerRadius: 6 }),
          text(t.copy('cta'), 300, 856, 500, headStyle(head, 38, t.color('background'))),
        ]),
        sparkle(700, 960, 250, t.color('surface')),
      ];
    },
  );

interface DayColors {
  darkTile: string;
  lightTile: string;
  date: string;
  head: string;
  body: string;
}

const dayCell = (
  colors: DayColors,
  dark: boolean,
  labels: { day: string; weekday: string; sticker: string | undefined },
  x: number,
  y: number,
): Nodes[] => [
  rect(x, y, 280, 270, dark ? colors.darkTile : colors.lightTile, {
    name: 'Day tile',
    cornerRadius: 6,
    ...shadow(20, 8, 'rgba(0,0,0,0.25)'),
  }),
  text(
    labels.day,
    x + 24,
    y + 22,
    90,
    headStyle(colors.head, 60, dark ? colors.date : colors.darkTile),
  ),
  text(
    labels.weekday,
    x + 110,
    y + 44,
    170,
    bodyStyle(colors.body, 26, dark ? colors.lightTile : colors.darkTile, 500),
  ),
  labels.sticker === undefined
    ? []
    : rotateNodes(-7, x + 140, y + 190, [
        rect(x + 10, y + 150, 260, 92, dark ? colors.lightTile : colors.darkTile, {
          name: 'Sticker',
          cornerRadius: 4,
        }),
        text(labels.sticker, x + 20, y + 162, 240, {
          ...headStyle(colors.head, 26, dark ? colors.darkTile : colors.lightTile),
          align: 'center',
        }),
      ]),
];

export const monthCalendar = (theme: EventTheme, copy: MonthCopy): Template =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: theme.main, hint: 'Page' },
        text: { value: theme.onMain, hint: 'Kicker, title and the sparkles' },
        secondary: {
          value: theme.dark,
          hint: 'Dark day tiles, plus the date, weekday and sticker on light tiles',
        },
        surface: {
          value: theme.paper,
          hint: 'Light day tiles, plus the weekday and sticker on dark tiles',
        },
        accent: { value: theme.pop, hint: 'Dates on dark tiles' },
      },
      fonts: fontsOf(theme),
      copy: {
        kicker: { label: 'Kicker', value: copy.kicker },
        title: { label: 'Title', value: copy.title },
        days: { label: 'Date', value: copy.days.map((day) => day.day) },
        weekdays: { label: 'Weekday', value: copy.days.map((day) => day.weekday) },
        stickers: {
          label: 'Sticker',
          value: copy.days.flatMap((day) => (day.sticker === undefined ? [] : [day.sticker])),
        },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const colors: DayColors = {
        darkTile: t.color('secondary'),
        lightTile: t.color('surface'),
        date: t.color('accent'),
        head: t.font('heading'),
        body: t.font('body'),
      };
      const days = t.list('days');
      const weekdays = t.list('weekdays');
      const stickers = t.list('stickers');
      let stickerIndex = 0;
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        text(t.copy('kicker'), 80, 90, 600, bodyStyle(colors.body, 32, t.color('text'), 500)),
        text(t.copy('title'), 80, 132, 900, headStyle(colors.head, 84, t.color('text'))),
        sparkle(920, 30, 140, t.color('text')),
        copy.days.map((day, index) => {
          const sticker = day.sticker === undefined ? undefined : stickers[stickerIndex++];
          return dayCell(
            colors,
            day.dark,
            { day: days[index] ?? '', weekday: weekdays[index] ?? '', sticker },
            80 + (index % 3) * 320,
            300 + Math.floor(index / 3) * 330,
          );
        }),
        sparkle(10, 1170, 150, t.color('text')),
      ];
    },
  );

export const saveTheDate = (theme: EventTheme, copy: SaveCopy): Template =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: '#b8bec6',
          hint: 'Brushed metal doors; its shades color the metal sheen, door seam and call panel',
        },
        surface: {
          value: '#fbfbfb',
          hint: 'Poster; its shades color the call button, the white digits and the flip lines',
        },
        primary: { value: theme.main, hint: 'Save the Date title' },
        secondary: { value: theme.dark, hint: 'Flip digit cards and the reply line' },
        accent: { value: theme.pop, hint: 'Tape strips, the middle digit and the lit call button' },
        text: { value: '#374151', hint: 'Invite line; its grey shade colors the units and host' },
      },
      fonts: fontsOf(theme),
      copy: {
        title: { label: 'Title', value: copy.title },
        invite: { label: 'Invite', value: copy.invite },
        digits: { label: 'Date digits', value: copy.digits },
        units: { label: 'Unit', value: copy.units },
        reply: { label: 'Reply line', value: copy.reply },
        host: { label: 'Host', value: copy.host },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const head = t.font('heading');
      const body = t.font('body');
      const units = t.list('units');
      const grey = t.shade('text', '#6b7280');
      return [
        rect(
          0,
          0,
          W,
          H,
          linear(
            90,
            t.color('background'),
            t.shade('background', '#eef0f3'),
            t.shade('background', '#c3c8cf'),
            t.shade('background', '#f4f5f7'),
            t.shade('background', '#b1b7bf'),
          ),
          { name: 'Brushed metal' },
        ),
        rect(537, 0, 6, H, t.shade('background', '#8d949d'), { name: 'Door seam' }),
        rect(1000, 560, 40, 200, t.shade('background', '#9ba2ab'), {
          name: 'Call panel',
          cornerRadius: 8,
        }),
        circle(1020, 610, 10, t.color('accent')),
        circle(1020, 660, 10, t.shade('surface', '#ffffff')),
        rect(250, 300, 580, 780, t.color('surface'), {
          name: 'Poster',
          cornerRadius: 4,
          ...shadow(36, 18, 'rgba(0,0,0,0.3)'),
        }),
        rotateNodes(-32, 290, 300, [
          rect(220, 280, 170, 54, t.color('accent'), { name: 'Tape', opacity: 0.85 }),
        ]),
        rotateNodes(32, 790, 300, [
          rect(700, 280, 170, 54, t.color('accent'), { name: 'Tape', opacity: 0.85 }),
        ]),
        text(t.copy('title'), 250, 390, 580, {
          ...headStyle(head, 70, t.color('primary')),
          align: 'center',
        }),
        text(t.copy('invite'), 250, 490, 580, {
          ...bodyStyle(body, 30, t.color('text')),
          align: 'center',
        }),
        t.list('digits').map((digit, index) => [
          rect(300 + index * 165, 640, 150, 160, t.color('secondary'), {
            name: 'Flip digit',
            cornerRadius: 10,
          }),
          rect(300 + index * 165, 718, 150, 4, t.shade('surface', 'rgba(255,255,255,0.25)'), {
            name: 'Flip line',
          }),
          text(digit, 300 + index * 165, 662, 150, {
            ...headStyle(head, 92, index === 1 ? t.color('accent') : t.shade('surface', '#ffffff')),
            align: 'center',
            lineHeight: 1,
          }),
          text(units[index] ?? '', 300 + index * 165, 816, 150, {
            ...bodyStyle(body, 22, grey, 600),
            align: 'center',
          }),
        ]),
        text(t.copy('reply'), 250, 900, 580, {
          ...headStyle(head, 36, t.color('secondary')),
          align: 'center',
        }),
        text(t.copy('host'), 250, 980, 580, { ...bodyStyle(body, 24, grey, 500), align: 'center' }),
      ];
    },
  );
