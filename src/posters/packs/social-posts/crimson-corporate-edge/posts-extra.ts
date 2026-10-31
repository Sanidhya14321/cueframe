import { IMAGE_FILTER_PRESETS, linear } from '@/design';
import { group, POST_SIZE, photo, rect, type ThemeSpec, text, themed } from '../../../kit';
import { backdrop, CRIMSON, FONT, tag } from './posts';

const { width: W, height: H } = POST_SIZE;

const MILESTONES = [
  { step: '1', value: '3 posts\na week', note: 'Steady output', height: 300 },
  { step: '2', value: '40k to\n90k', note: 'Monthly reach', height: 440 },
  { step: '3', value: '65', note: 'Qualified leads', height: 580 },
] as const;

const milestonesSpec = {
  colors: {
    background: {
      value: CRIMSON.wine,
      hint: 'Page gradient; its darker shade colors the bottom of the page',
    },
    primary: {
      value: CRIMSON.red,
      hint: 'Milestone bars (fading to a darker shade); its brighter shade colors with Milestones',
    },
    surface: {
      value: CRIMSON.white,
      hint: 'Align Team Goals and the bar values; its faint tint colors the big step numbers',
    },
    text: { value: CRIMSON.blush, hint: 'Notes under the bar values' },
  },
  fonts: { font: FONT },
  copy: {
    title: { label: 'Title', value: 'Align Team Goals' },
    subtitle: { label: 'Subtitle', value: 'with Milestones' },
    steps: { label: 'Step number', value: MILESTONES.map((item) => item.step) },
    values: { label: 'Milestone', value: MILESTONES.map((item) => item.value) },
    notes: { label: 'Note', value: MILESTONES.map((item) => item.note) },
  },
} as const satisfies ThemeSpec;

export const milestones = themed(W, H, milestonesSpec, (t) => {
  const steps = t.list('steps');
  const values = t.list('values');
  const notes = t.list('notes');
  return [
    backdrop(t.color('background'), t.shade('background', CRIMSON.deep), 170),
    text(t.copy('title'), 0, 120, W, {
      fontFamily: t.font('font'),
      fontSize: 70,
      fontWeight: 700,
      fill: t.color('surface'),
      align: 'center',
    }),
    text(t.copy('subtitle'), 0, 210, W, {
      fontFamily: t.font('font'),
      fontSize: 70,
      fontWeight: 700,
      fill: t.shade('primary', CRIMSON.bright),
      align: 'center',
    }),
    MILESTONES.map((item, index) => {
      const x = 110 + index * 300;
      const y = 1260 - item.height;
      return group(
        text(steps[index] ?? '', x, y - 250, 260, {
          fontFamily: t.font('font'),
          fontSize: 260,
          fontWeight: 800,
          fill: t.shade('surface', 'rgba(255,255,255,0.14)'),
          align: 'center',
          lineHeight: 1,
        }),
        rect(
          x,
          y,
          260,
          item.height,
          linear(180, t.color('primary'), t.shade('primary', CRIMSON.wine)),
          {
            cornerRadius: 18,
            name: 'Milestone bar',
          },
        ),
        text(values[index] ?? '', x, y + 34, 260, {
          fontFamily: t.font('font'),
          fontSize: 46,
          fontWeight: 700,
          fill: t.color('surface'),
          align: 'center',
          lineHeight: 1.1,
        }),
        text(notes[index] ?? '', x, y + 160, 260, {
          fontFamily: t.font('font'),
          fontSize: 28,
          fontWeight: 400,
          fill: t.color('text'),
          align: 'center',
        }),
      );
    }),
  ];
});

const DAYS = [
  { date: '04', label: 'Live Webinar' },
  { date: '05', label: '' },
  { date: '06', label: '' },
  { date: '11', label: 'New Article' },
  { date: '12', label: 'Team Poll' },
  { date: '13', label: '' },
  { date: '18', label: 'Roundtable' },
  { date: '19', label: '' },
  { date: '20', label: 'Q&A Night' },
] as const;

const EVENTS = DAYS.map((item) => item.label).filter((label) => label !== '');

const calendarSpec = {
  colors: {
    background: {
      value: CRIMSON.ink,
      hint: 'Page behind the photo, the empty day tiles and the event label lettering',
    },
    primary: { value: CRIMSON.red, hint: 'Day tiles that hold an event' },
    surface: {
      value: CRIMSON.white,
      hint: 'Title, dates and event labels; its faint tint outlines the empty tiles',
    },
    text: { value: CRIMSON.blush, hint: 'Weekday names' },
  },
  fonts: { font: FONT },
  copy: {
    title: { label: 'Title', value: 'Your month, planned' },
    weekdays: {
      label: 'Weekday',
      value: ['Mon', 'Tue', 'Wed'],
      hint: 'One per column',
    },
    dates: { label: 'Date', value: DAYS.map((item) => item.date) },
    events: { label: 'Event', value: EVENTS },
  },
} as const satisfies ThemeSpec;

export const calendarGrid = themed(W, H, calendarSpec, (t) => {
  const weekdays = t.list('weekdays');
  const dates = t.list('dates');
  const events = t.list('events');
  let eventIndex = 0;
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    photo('city-night', 0, 0, W, H, { filters: IMAGE_FILTER_PRESETS.noir, opacity: 0.55 }),
    text(t.copy('title'), 80, 90, 920, {
      fontFamily: t.font('font'),
      fontSize: 64,
      fontWeight: 700,
      fill: t.color('surface'),
    }),
    DAYS.map((item, index) => {
      const x = 80 + (index % 3) * 315;
      const y = 250 + Math.floor(index / 3) * 345;
      const busy = item.label !== '';
      const event = busy ? (events[eventIndex] ?? '') : '';
      eventIndex += busy ? 1 : 0;
      return group(
        rect(x, y, 290, 310, busy ? t.color('primary') : t.color('background'), {
          cornerRadius: 26,
          name: 'Day tile',
          stroke: t.shade('surface', 'rgba(255,255,255,0.25)'),
          strokeWidth: busy ? 0 : 2,
        }),
        text(weekdays[index % 3] ?? '', x + 28, y + 26, 200, {
          fontFamily: t.font('font'),
          fontSize: 30,
          fontWeight: 500,
          fill: t.color('text'),
        }),
        text(dates[index] ?? '', x + 26, y + 66, 220, {
          fontFamily: t.font('font'),
          fontSize: 96,
          fontWeight: 700,
          fill: t.color('surface'),
        }),
        busy
          ? tag(event, x + 24, y + 222, 26, {
              fill: t.color('surface'),
              color: t.color('background'),
              fontFamily: t.font('font'),
              name: item.label,
            })
          : [],
      );
    }),
  ];
});

const seventySpec = {
  colors: {
    background: {
      value: CRIMSON.blush,
      hint: 'Page gradient and the fade over the photo; its lighter shade colors the top of the page and the badge lettering',
    },
    primary: { value: CRIMSON.red, hint: 'The big 70% number' },
    text: {
      value: CRIMSON.ink,
      hint: 'Headline and the badge; its grey shade colors the body text',
    },
  },
  fonts: { font: FONT },
  copy: {
    stat: { label: 'Number', value: '70%' },
    headline: { label: 'Headline', value: 'more output\nper team' },
    badge: { label: 'Badge', value: 'Measured in 2026' },
    body: {
      label: 'Body',
      value: 'Clear goals and weekly\ncheck-ins change how\nfast teams deliver.',
    },
  },
} as const satisfies ThemeSpec;

export const seventyPercent = themed(W, H, seventySpec, (t) => [
  backdrop(t.shade('background', CRIMSON.white), t.color('background'), 180),
  photo('man-portrait-1', 560, 120, 520, 1230, { filters: IMAGE_FILTER_PRESETS.mono }),
  rect(
    560,
    120,
    160,
    1230,
    linear(
      90,
      t.shade('background', 'rgba(253,232,234,1)'),
      t.shade('background', 'rgba(253,232,234,0)'),
    ),
    { name: 'Fade' },
  ),
  text(t.copy('stat'), 80, 260, 640, {
    fontFamily: t.font('font'),
    fontSize: 230,
    fontWeight: 800,
    fill: t.color('primary'),
    lineHeight: 1,
    letterSpacing: -6,
  }),
  text(t.copy('headline'), 90, 520, 520, {
    fontFamily: t.font('font'),
    fontSize: 64,
    fontWeight: 500,
    fill: t.color('text'),
    lineHeight: 1.15,
  }),
  tag(t.copy('badge'), 90, 720, 34, {
    fill: t.color('text'),
    color: t.shade('background', CRIMSON.white),
    fontFamily: t.font('font'),
    name: 'Measured in 2026',
  }),
  text(t.copy('body'), 90, 1100, 460, {
    fontFamily: t.font('font'),
    fontSize: 32,
    fontWeight: 400,
    fill: t.shade('text', CRIMSON.grey),
    lineHeight: 1.4,
  }),
]);
