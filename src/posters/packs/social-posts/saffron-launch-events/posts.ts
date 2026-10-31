import {
  circle,
  icon,
  POST_SIZE,
  rect,
  rotateNodes,
  shadow,
  star,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export interface EventTheme {
  brand: string;
  ink: string;
  paper: string;
  cream: string;
  muted: string;
}

export const SAFFRON: EventTheme = {
  brand: '#ffc21a',
  ink: '#151515',
  paper: '#ffffff',
  cream: '#fffaf0',
  muted: '#5c5546',
};

export const ROSE: EventTheme = {
  brand: '#ff6b8b',
  ink: '#2a0d16',
  paper: '#ffffff',
  cream: '#fff4f6',
  muted: '#6b4a52',
};

export const SKY: EventTheme = {
  brand: '#5ec8ff',
  ink: '#0c1d33',
  paper: '#ffffff',
  cream: '#f1f8ff',
  muted: '#4a5a6e',
};

export const HEADING = { label: 'Heading font', value: 'Poppins' } as const;
export const BODY = { label: 'Body font', value: 'Inter' } as const;
export const { width: PW, height: PH } = POST_SIZE;

const IDEAS = [
  'Behind the scenes',
  'Client win',
  'Quick tip',
  'This or that poll',
  'Team intro',
  'FAQ answer',
  'Launch teaser',
  'Myth vs fact',
  'Weekly recap',
];

const SLOTS = Array.from(
  { length: 9 },
  (_, index) => `WEEK ${Math.floor(index / 3) + 1}  /  ${['MON', 'WED', 'FRI'][index % 3]}`,
);

export const contentCalendar = (theme: EventTheme): Template => {
  const spec = {
    colors: {
      background: { value: theme.cream, hint: 'Page and the calendar cells' },
      surface: {
        value: theme.paper,
        hint: 'Notebook page, cell header labels and the arrow; its darker shades color the back page, notebook edge and placeholder lines',
      },
      primary: { value: theme.brand, hint: 'Highlight behind Calendar and the two stars' },
      text: {
        value: theme.ink,
        hint: 'Titles, rings, cell outlines and headers, post ideas and the arrow button; its shade colors the subtitle',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Steal Our Content' },
      highlight: { label: 'Highlighted word', value: 'Calendar' },
      subtitle: { label: 'Subtitle', value: '9 post ideas for busy founders' },
      slots: { label: 'Cell header', value: SLOTS },
      ideas: { label: 'Post idea', value: IDEAS },
    },
  } as const satisfies ThemeSpec;
  return themed(PW, PH, spec, (t) => {
    const heading = t.font('heading');
    const body = t.font('body');
    const slots = t.list('slots');
    const line = t.shade('surface', '#d9d3c4');
    return [
      rect(0, 0, PW, PH, t.color('background'), { name: 'Background' }),
      text(t.copy('title'), 0, 80, PW, {
        fontFamily: heading,
        fontSize: 62,
        fontWeight: 800,
        fill: t.color('text'),
        align: 'center',
      }),
      rect(370, 182, 340, 64, t.color('primary'), { name: 'Highlight', cornerRadius: 10 }),
      text(t.copy('highlight'), 0, 166, PW, {
        fontFamily: heading,
        fontSize: 62,
        fontWeight: 800,
        fill: t.color('text'),
        align: 'center',
      }),
      text(t.copy('subtitle'), 0, 270, PW, {
        fontFamily: body,
        fontSize: 30,
        fontWeight: 600,
        fill: t.shade('text', theme.muted),
        align: 'center',
      }),
      rect(176, 366, 740, 830, t.shade('surface', '#e7e2d6'), {
        name: 'Back page',
        cornerRadius: 14,
      }),
      rect(160, 350, 740, 830, t.color('surface'), {
        name: 'Notebook',
        cornerRadius: 14,
        stroke: t.shade('surface', '#ddd7ca'),
        strokeWidth: 3,
        ...shadow(24, 10, 'rgba(0,0,0,0.12)'),
      }),
      Array.from({ length: 9 }, (_, index) =>
        rect(204 + index * 80, 322, 16, 62, t.color('text'), { name: 'Ring', cornerRadius: 8 }),
      ),
      t.list('ideas').map((idea, index) => {
        const x = 195 + (index % 3) * 230;
        const y = 420 + Math.floor(index / 3) * 250;
        return [
          rect(x, y, 210, 230, t.color('background'), {
            name: 'Cell',
            stroke: t.color('text'),
            strokeWidth: 3,
          }),
          rect(x, y, 210, 44, t.color('text'), { name: 'Cell header' }),
          text(slots[index] ?? '', x, y + 11, 210, {
            fontFamily: body,
            fontSize: 18,
            fontWeight: 700,
            fill: t.color('surface'),
            align: 'center',
            letterSpacing: 1,
          }),
          text(idea, x + 18, y + 64, 180, {
            fontFamily: heading,
            fontSize: 25,
            fontWeight: 700,
            fill: t.color('text'),
            lineHeight: 1.15,
          }),
          rect(x + 18, y + 160, 170, 10, line, { name: 'Line', cornerRadius: 5 }),
          rect(x + 18, y + 184, 120, 10, line, { name: 'Line', cornerRadius: 5 }),
        ];
      }),
      star(5, 50, 620, 100, t.color('primary'), { innerRatio: 0.42 }),
      star(5, 930, 1000, 100, t.color('primary'), { innerRatio: 0.42 }),
      circle(980, 1260, 50, t.color('text')),
      icon('arrow-right', 955, 1235, 50, t.color('surface'), { strokeWidth: 2.6 }),
    ];
  });
};

export const eventDay = (theme: EventTheme): Template => {
  const spec = {
    colors: {
      primary: {
        value: theme.brand,
        hint: 'Page, the Launch Day kicker and the highlighted details',
      },
      secondary: { value: theme.ink, hint: 'Event card and the callout text' },
      surface: {
        value: theme.paper,
        hint: 'Tilted back card, date, hours, callout box and the stars',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      kicker: { label: 'Kicker', value: 'Launch Day' },
      date: { label: 'Date', value: 'Thu, 22 May' },
      hours: { label: 'Hours', value: 'From 10am to 6pm' },
      details: { label: 'Details', value: 'Live product demo\nand founder Q&A' },
      callout: { label: 'Callout', value: 'Join the waitlist\nfor early perks' },
    },
  } as const satisfies ThemeSpec;
  return themed(PW, PH, spec, (t) => {
    const heading = t.font('heading');
    return [
      rect(0, 0, PW, PH, t.color('primary'), { name: 'Background' }),
      rotateNodes(-8, 170, 360, [
        rect(170, 360, 700, 640, t.color('surface'), { name: 'Back card' }),
      ]),
      rect(220, 330, 660, 660, t.color('secondary'), { name: 'Event card', ...shadow(30, 14) }),
      text(t.copy('kicker'), 280, 390, 560, {
        fontFamily: heading,
        fontSize: 34,
        fontWeight: 500,
        fill: t.color('primary'),
      }),
      text(t.copy('date'), 280, 440, 580, {
        fontFamily: heading,
        fontSize: 76,
        fontWeight: 800,
        fill: t.color('surface'),
      }),
      text(t.copy('hours'), 280, 545, 560, {
        fontFamily: t.font('body'),
        fontSize: 32,
        fontWeight: 500,
        fill: t.color('surface'),
        opacity: 0.85,
      }),
      text(t.copy('details'), 280, 625, 560, {
        fontFamily: heading,
        fontSize: 40,
        fontWeight: 700,
        fill: t.color('primary'),
        lineHeight: 1.2,
      }),
      rect(280, 790, 440, 130, t.color('surface'), { name: 'Callout' }),
      text(t.copy('callout'), 308, 812, 400, {
        fontFamily: heading,
        fontSize: 32,
        fontWeight: 700,
        fill: t.color('secondary'),
        lineHeight: 1.2,
      }),
      star(5, 120, 200, 110, t.color('surface'), { innerRatio: 0.42 }),
      star(5, 780, 920, 240, t.color('surface'), { innerRatio: 0.42 }),
    ];
  });
};
