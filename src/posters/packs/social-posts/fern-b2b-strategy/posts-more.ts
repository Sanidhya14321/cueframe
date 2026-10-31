import { linear } from '@/design';
import {
  circle,
  group,
  icon,
  photo,
  rect,
  rotateNodes,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY, backdrop, FERN, H, HEADING, W } from './posts';

const EVENTS = [
  { day: '04', label: 'Brand Summit' },
  { day: '11', label: 'Mixer Night' },
  { day: '17', label: 'Live Q&A' },
  { day: '20', label: 'Audience Poll' },
  { day: '25', label: 'Spring Sale' },
  { day: '29', label: 'New Article' },
] as const;

const eventsSpec = {
  colors: {
    background: {
      value: FERN.forest,
      hint: 'Page gradient; its darker shade is the bottom of the gradient and the day numbers',
    },
    surface: { value: FERN.white, hint: 'Month title, date cards and the event names' },
    secondary: {
      value: FERN.mint,
      hint: 'Events; its darker shade colors the month on each card',
    },
    accent: { value: FERN.fern, hint: 'Event name bands at the bottom of the cards' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    month: { label: 'Month', value: 'June', hint: 'Shown as the title and on every date card' },
    title: { label: 'Title', value: 'Events' },
    days: { label: 'Event day', value: EVENTS.map((event) => event.day) },
    events: { label: 'Event name', value: EVENTS.map((event) => event.label) },
  },
} as const satisfies ThemeSpec;

export const monthEvents = themed(W, H, eventsSpec, (t) => {
  const events = t.list('events');
  return [
    backdrop(t.color('background'), t.shade('background', FERN.deep), 165),
    text(t.copy('month'), 0, 150, W, {
      fontFamily: t.font('heading'),
      fontSize: 130,
      fontWeight: 800,
      fill: t.color('surface'),
      align: 'center',
      lineHeight: 1,
    }),
    text(t.copy('title'), 0, 280, W, {
      fontFamily: t.font('heading'),
      fontSize: 130,
      fontWeight: 800,
      fill: t.color('secondary'),
      align: 'center',
      lineHeight: 1,
    }),
    t.list('days').map((day, index) => {
      const x = 120 + (index % 3) * 290;
      const y = 520 + Math.floor(index / 3) * 340;
      const tile = [
        rect(x, y, 260, 300, t.color('surface'), {
          cornerRadius: 22,
          name: 'Date card',
          ...shadow(30, 12, 'rgba(0,0,0,0.3)'),
        }),
        text(day, x + 24, y + 24, 200, {
          fontFamily: t.font('heading'),
          fontSize: 92,
          fontWeight: 800,
          fill: t.shade('background', FERN.deep),
        }),
        text(t.copy('month'), x + 26, y + 130, 200, {
          fontFamily: t.font('body'),
          fontSize: 26,
          fontWeight: 500,
          fill: t.shade('secondary', FERN.sage),
        }),
        rect(x, y + 220, 260, 80, t.color('accent'), { cornerRadius: 22, name: 'Label band' }),
        rect(x, y + 220, 260, 30, t.color('accent'), { name: 'Label band edge' }),
        text(events[index] ?? '', x, y + 244, 260, {
          fontFamily: t.font('body'),
          fontSize: 28,
          fontWeight: 700,
          fill: t.color('surface'),
          align: 'center',
        }),
      ];
      return group(index === 0 ? rotateNodes(-6, x + 130, y + 150, tile) : tile);
    }),
  ];
});

const clipboardSpec = {
  colors: {
    background: {
      value: FERN.light,
      hint: 'Page gradient; its darker shade is the bottom of the gradient',
    },
    surface: {
      value: FERN.white,
      hint: 'Coffee cup and the paper; its grey shades color the metal clip',
    },
    secondary: {
      value: '#b98a5e',
      hint: 'Wooden clipboard; its darker shades color the bottom of the board and the coffee',
    },
    primary: {
      value: FERN.fern,
      hint: 'Growth Goals and the marker cap; its darker shade colors the comment line, arrow and marker',
    },
    text: { value: FERN.deep, hint: 'Pin Down Your and the clipboard shadow' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    lead: { label: 'Lead-in', value: 'Pin Down\nYour' },
    title: { label: 'Title', value: 'Growth\nGoals' },
    cta: { label: 'Call to action', value: 'Comment "GOALS"\nfor the free planner' },
  },
} as const satisfies ThemeSpec;

export const clipboardGoals = themed(W, H, clipboardSpec, (t) => [
  backdrop(t.color('background'), t.shade('background', FERN.mint), 180),
  circle(900, 170, 120, t.color('surface'), {
    name: 'Cup',
    ...shadow(30, 12, 'rgba(0,0,0,0.2)'),
  }),
  circle(900, 170, 92, t.shade('secondary', '#3b2418'), { name: 'Coffee' }),
  rotateNodes(-4, 500, 700, [
    rect(140, 170, 720, 1080, linear(160, t.color('secondary'), t.shade('secondary', '#8c6440')), {
      cornerRadius: 30,
      name: 'Clipboard',
      ...shadow(40, 18, t.shade('text', 'rgba(15,42,32,0.3)')),
    }),
    rect(190, 250, 620, 940, t.color('surface'), { name: 'Paper' }),
    rect(
      370,
      130,
      240,
      110,
      linear(180, t.shade('surface', '#cfd6d2'), t.shade('surface', '#7e8783')),
      { cornerRadius: 24, name: 'Clip' },
    ),
    text(t.copy('lead'), 250, 400, 520, {
      fontFamily: t.font('heading'),
      fontSize: 96,
      fontWeight: 500,
      fill: t.color('text'),
      lineHeight: 1.05,
    }),
    text(t.copy('title'), 265, 600, 520, {
      fontFamily: t.font('heading'),
      fontSize: 104,
      fontWeight: 800,
      fill: t.color('primary'),
      lineHeight: 1.05,
    }),
    text(t.copy('cta'), 290, 880, 460, {
      fontFamily: t.font('body'),
      fontSize: 32,
      fontWeight: 600,
      fill: t.shade('primary', FERN.forest),
      lineHeight: 1.3,
    }),
    icon('arrow-down', 640, 960, 90, t.shade('primary', FERN.forest), { strokeWidth: 2.5 }),
  ]),
  rect(900, 640, 50, 380, t.shade('primary', FERN.forest), {
    cornerRadius: 14,
    rotation: 14,
    name: 'Marker',
  }),
  rect(900, 640, 50, 90, t.color('primary'), {
    cornerRadius: 14,
    rotation: 14,
    name: 'Marker cap',
  }),
]);

interface GrowPalette {
  background: string;
  soft: string;
  ring: string;
  ink: string;
  tag: string;
}

const FERN_GROW: GrowPalette = {
  background: FERN.light,
  soft: FERN.mint,
  ring: FERN.white,
  ink: FERN.deep,
  tag: FERN.fern,
};

export const CORAL_GROW: GrowPalette = {
  background: '#fff1ec',
  soft: '#ffc4b0',
  ring: '#ffffff',
  ink: '#4a1a10',
  tag: '#f0603c',
};

export const growWithUs = (palette: GrowPalette, tag: string) =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: palette.background,
          hint: 'Page gradient; its deeper shade is the bottom of the gradient',
        },
        surface: { value: palette.ring, hint: 'Ring around the photo and the hashtag pill' },
        accent: { value: palette.tag, hint: 'Hashtag' },
        text: { value: palette.ink, hint: 'Closing line' },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        tag: { label: 'Hashtag', value: tag },
        line: { label: 'Closing line', value: 'Big goals start with one honest conversation.' },
      },
    } as const satisfies ThemeSpec,
    (t) => [
      backdrop(t.color('background'), t.shade('background', palette.soft), 180),
      circle(540, 640, 430, t.shade('surface', 'rgba(0,0,0,0)'), {
        name: 'Ring',
        stroke: t.color('surface'),
        strokeWidth: 110,
      }),
      photo('woman-portrait-4', 290, 300, 500, 660, { cornerRadius: 250 }),
      group(
        rect(50, 880, 620, 120, t.color('surface'), {
          cornerRadius: 60,
          rotation: -24,
          name: 'Tag pill',
          ...shadow(30, 12, 'rgba(0,0,0,0.18)'),
        }),
        text(t.copy('tag'), 70, 902, 580, {
          fontFamily: t.font('heading'),
          fontSize: 56,
          fontWeight: 800,
          fill: t.color('accent'),
          align: 'center',
          rotation: -24,
        }),
      ),
      text(t.copy('line'), 140, 1170, 800, {
        fontFamily: t.font('body'),
        fontSize: 34,
        fontWeight: 600,
        fill: t.color('text'),
        align: 'center',
      }),
    ],
  );

export const GROW_POST = growWithUs(FERN_GROW, '#GrowTogether');
