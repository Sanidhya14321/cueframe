import { linear } from '@/design';
import {
  POST_SIZE,
  rect,
  rotateNodes,
  shadow,
  star,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export interface EventTheme {
  from: string;
  to: string;
  ink: string;
  paper: string;
  brand: string;
  accent: string;
  tint: string;
}

export const ROSEWOOD: EventTheme = {
  from: '#3a0b2e',
  to: '#d93b72',
  ink: '#1c0716',
  paper: '#ffffff',
  brand: '#e0457b',
  accent: '#ffc145',
  tint: '#fde4ee',
};

export const LAGOON: EventTheme = {
  from: '#06302c',
  to: '#0f9f8f',
  ink: '#04201d',
  paper: '#ffffff',
  brand: '#14b8a6',
  accent: '#fde047',
  tint: '#d5f5f0',
};

const { width: W, height: H } = POST_SIZE;
const HEAD = 'Outfit';
const BODY = 'DM Sans';

export const FONTS = {
  heading: { label: 'Heading font', value: HEAD },
  body: { label: 'Body font', value: BODY },
} as const;

const SITE = 'loopworks.events';

export const backdropHint = 'Page gradient; its brighter shade is the top corner of the gradient';

export const backdrop = (from: string, to: string, width: number = W, height: number = H) =>
  rect(0, 0, width, height, linear(200, to, from), { name: 'Background' });

const label = (
  content: string,
  x: number,
  y: number,
  width: number,
  degrees: number,
  fill: string,
  color: string,
  fontFamily: string,
) =>
  rotateNodes(degrees, x, y, [
    rect(x, y, width, 70, fill, {
      name: 'Label',
      ...shadow(16, 6, 'rgba(0,0,0,0.3)'),
    }),
    text(content, x, y + 16, width, {
      fontFamily,
      fontSize: 32,
      fontWeight: 700,
      fill: color,
      align: 'center',
    }),
  ]);

const LABELS = [
  { x: 110, y: 470, width: 300, degrees: -6, dark: true },
  { x: 430, y: 735, width: 260, degrees: 5, dark: false },
  { x: 100, y: 1035, width: 270, degrees: -4, dark: false },
] as const;

export const monthEvents = (theme: EventTheme) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: theme.from, hint: backdropHint },
        surface: {
          value: theme.paper,
          hint: 'Titles, the day cells, the numbers on the open days, the light labels, the text on the dark label, the bottom star and the footer line; its translucent shade fills the open days',
        },
        text: {
          value: theme.ink,
          hint: 'Day numbers, the dark label and the text on the light labels; its grey shade colors the weekdays',
        },
        accent: { value: theme.accent, hint: 'Top corner star' },
      },
      fonts: FONTS,
      copy: {
        kicker: { label: 'Kicker', value: 'Upcoming' },
        title: { label: 'Title', value: 'November Events' },
        days: { label: 'Day', value: ['03', '05', '07', '12', '14', '18', '20', '25', '28'] },
        weekdays: {
          label: 'Weekday',
          value: ['Mon', 'Wed', 'Fri', 'Wed', 'Fri', 'Tue', 'Thu', 'Tue', 'Fri'],
        },
        events: { label: 'Event', value: ['Founder Coffee', 'Demo Night', 'Hackathon'] },
        footer: { label: 'Footer', value: `Save your seat at ${SITE}` },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const weekdays = t.list('weekdays');
      const events = t.list('events');
      return [
        backdrop(t.color('background'), t.shade('background', theme.to)),
        text(t.copy('kicker'), 80, 80, 600, {
          fontFamily: t.font('heading'),
          fontSize: 42,
          fontWeight: 500,
          fill: t.color('surface'),
        }),
        text(t.copy('title'), 80, 130, 900, {
          fontFamily: t.font('heading'),
          fontSize: 88,
          fontWeight: 800,
          fill: t.color('surface'),
        }),
        t.list('days').map((day, index) => {
          const x = 80 + (index % 3) * 315;
          const y = 300 + Math.floor(index / 3) * 275;
          const open = index === 2 || index === 5 || index === 7;
          return [
            rect(
              x,
              y,
              290,
              250,
              open ? t.shade('surface', 'rgba(255,255,255,0.14)') : t.color('surface'),
              { name: 'Day cell', cornerRadius: 6 },
            ),
            text(day, x + 24, y + 18, 120, {
              fontFamily: t.font('heading'),
              fontSize: 72,
              fontWeight: 800,
              fill: open ? t.color('surface') : t.color('text'),
            }),
            text(weekdays[index] ?? '', x + 130, y + 48, 140, {
              fontFamily: t.font('body'),
              fontSize: 30,
              fontWeight: 500,
              fill: open ? t.color('surface') : t.shade('text', '#6b7280'),
            }),
          ];
        }),
        LABELS.map((item, index) =>
          label(
            events[index] ?? '',
            item.x,
            item.y,
            item.width,
            item.degrees,
            item.dark ? t.color('text') : t.color('surface'),
            item.dark ? t.color('surface') : t.color('text'),
            t.font('heading'),
          ),
        ),
        star(5, 920, 50, 120, t.color('accent'), { innerRatio: 0.42 }),
        star(5, 30, 1200, 120, t.color('surface'), { innerRatio: 0.42 }),
        text(t.copy('footer'), 0, 1230, W, {
          fontFamily: t.font('body'),
          fontSize: 32,
          fontWeight: 600,
          fill: t.color('surface'),
          align: 'center',
        }),
      ];
    },
  );

export const eventList = (theme: EventTheme) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: theme.from, hint: backdropHint },
        surface: {
          value: theme.paper,
          hint: 'Date tiles, event titles and the bottom star; its translucent shade colors the details',
        },
        text: { value: theme.ink, hint: 'Day numbers and the binder rings' },
        primary: { value: theme.brand, hint: 'Month on each date tile' },
        accent: { value: theme.accent, hint: 'Top corner star' },
      },
      fonts: FONTS,
      copy: {
        days: { label: 'Day', value: ['04', '11', '19', '27'] },
        month: { label: 'Month', value: 'NOV', hint: 'Shown on every date tile' },
        titles: {
          label: 'Event',
          value: ['Founder AMA', 'Feature Poll', 'Live Workshop', 'Beta Access Drop'],
        },
        details: {
          label: 'Event detail',
          value: [
            'Ask our founders anything about the road to launch.',
            'Vote on the next feature we build for you.',
            'Learn how teams cut onboarding time in half.',
            'A thank you for our most loyal early users.',
          ],
        },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const titles = t.list('titles');
      const details = t.list('details');
      return [
        backdrop(t.color('background'), t.shade('background', theme.to)),
        t.list('days').map((day, index) => {
          const y = 110 + index * 300;
          return [
            rect(90, y, 180, 190, t.color('surface'), { name: 'Date tile', cornerRadius: 10 }),
            rect(130, y - 22, 18, 50, t.color('text'), { name: 'Ring', cornerRadius: 9 }),
            rect(212, y - 22, 18, 50, t.color('text'), { name: 'Ring', cornerRadius: 9 }),
            text(day, 90, y + 30, 180, {
              fontFamily: t.font('heading'),
              fontSize: 96,
              fontWeight: 800,
              fill: t.color('text'),
              align: 'center',
              lineHeight: 1,
            }),
            text(t.copy('month'), 90, y + 135, 180, {
              fontFamily: t.font('body'),
              fontSize: 26,
              fontWeight: 700,
              fill: t.color('primary'),
              align: 'center',
              letterSpacing: 3,
            }),
            text(titles[index] ?? '', 320, y + 18, 700, {
              fontFamily: t.font('heading'),
              fontSize: 60,
              fontWeight: 800,
              fill: t.color('surface'),
            }),
            text(details[index] ?? '', 320, y + 100, 680, {
              fontFamily: t.font('body'),
              fontSize: 32,
              fontWeight: 500,
              fill: t.shade('surface', 'rgba(255,255,255,0.82)'),
              lineHeight: 1.35,
            }),
          ];
        }),
        star(5, 940, 40, 100, t.color('accent'), { innerRatio: 0.42 }),
        star(5, 950, 1220, 90, t.color('surface'), { innerRatio: 0.42 }),
      ];
    },
  );

export const eventDay = (theme: EventTheme) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: theme.from, hint: backdropHint },
        surface: {
          value: theme.paper,
          hint: 'Back card, the callout, the top star, the kicker, time and title on the dark card, and the website',
        },
        text: {
          value: theme.ink,
          hint: 'Front card and the callout text; its translucent shade is the big shadow star',
        },
        primary: { value: theme.brand, hint: 'Event date' },
      },
      fonts: FONTS,
      copy: {
        kicker: { label: 'Kicker', value: 'Event Day' },
        date: { label: 'Date', value: 'Thu, 14 Nov' },
        time: { label: 'Time', value: 'From 6 pm to 9 pm' },
        title: { label: 'Title', value: 'Quarterly roadmap\nlivestream' },
        callout: { label: 'Callout', value: 'Join the waitlist for\nearly access perks' },
        site: { label: 'Website', value: SITE },
      },
    } as const satisfies ThemeSpec,
    (t) => [
      backdrop(t.color('background'), t.shade('background', theme.to)),
      star(5, 600, 820, 460, t.shade('text', 'rgba(0,0,0,0.28)'), {
        innerRatio: 0.42,
        rotation: 12,
      }),
      rect(150, 330, 720, 640, t.color('surface'), { rotation: -6, name: 'Back card' }),
      rect(200, 340, 700, 660, t.color('text'), { name: 'Front card', ...shadow(40, 16) }),
      star(5, 100, 230, 150, t.color('surface'), { innerRatio: 0.42 }),
      text(t.copy('kicker'), 250, 400, 600, {
        fontFamily: t.font('heading'),
        fontSize: 42,
        fontWeight: 500,
        fill: t.color('surface'),
      }),
      text(t.copy('date'), 250, 456, 620, {
        fontFamily: t.font('heading'),
        fontSize: 92,
        fontWeight: 800,
        fill: t.color('primary'),
      }),
      text(t.copy('time'), 250, 574, 600, {
        fontFamily: t.font('body'),
        fontSize: 38,
        fontWeight: 500,
        fill: t.color('surface'),
      }),
      text(t.copy('title'), 250, 660, 620, {
        fontFamily: t.font('heading'),
        fontSize: 56,
        fontWeight: 800,
        fill: t.color('surface'),
        lineHeight: 1.15,
      }),
      rect(250, 840, 600, 120, t.color('surface'), { name: 'Callout' }),
      text(t.copy('callout'), 280, 856, 560, {
        fontFamily: t.font('heading'),
        fontSize: 36,
        fontWeight: 700,
        fill: t.color('text'),
        lineHeight: 1.2,
      }),
      text(t.copy('site'), 0, 1200, W, {
        fontFamily: t.font('body'),
        fontSize: 32,
        fontWeight: 600,
        fill: t.color('surface'),
        align: 'center',
      }),
    ],
  );
