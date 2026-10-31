import {
  circle,
  type Nodes,
  rect,
  STORY_SIZE,
  shadow,
  star,
  type Template,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY, type EventTheme, HEADING, PH, PW } from './posts';

const PLAN_COPY = {
  title: { label: 'Title', value: 'Coming up this month' },
  days: { label: 'Date', value: ['06', '13', '19', '27'] },
  events: {
    label: 'Event',
    value: ['Maker Spotlight', 'Community Poll', 'Live Workshop', 'VIP Preview Night'],
  },
  notes: {
    label: 'Event detail',
    value: [
      'Celebrate the makers behind our brand.',
      'Help us pick our next limited flavour.',
      'Our launch checklist in 45 minutes.',
      'Early access for our most loyal fans.',
    ],
  },
} as const;

const STORY_COPY = {
  ...PLAN_COPY,
  button: { label: 'Button', value: 'Turn on post alerts' },
} as const;

const planColors = (theme: EventTheme, story: boolean) => ({
  primary: { value: theme.brand, hint: 'Page' },
  surface: {
    value: theme.paper,
    hint: story
      ? 'Date tiles, their ring holes, the star and the button label'
      : 'Date tiles, their ring holes and the top star',
  },
  text: {
    value: theme.ink,
    hint: story
      ? 'Title, date tile tops, dates, events, details and the button'
      : 'Title, date tile tops, dates, events, details and the bottom star',
  },
});

interface PlanSpec extends ThemeSpec {
  colors: ReturnType<typeof planColors>;
  fonts: { heading: typeof HEADING; body: typeof BODY };
  copy: typeof PLAN_COPY;
}

const schedule = <S extends PlanSpec>(t: Theme<S>, height: number, story: boolean): Nodes[] => {
  const top = story ? 420 : 200;
  const gap = story ? 300 : 280;
  const heading = t.font('heading');
  const events = t.list('events');
  const notes = t.list('notes');
  return [
    rect(0, 0, PW, height, t.color('primary'), { name: 'Background' }),
    text(t.copy('title'), 90, story ? 200 : 80, 800, {
      fontFamily: heading,
      fontSize: story ? 64 : 40,
      fontWeight: 800,
      fill: t.color('text'),
    }),
    t.list('days').map((day, index) => {
      const y = top + index * gap;
      return [
        rect(90, y, 150, 160, t.color('surface'), {
          name: 'Date tile',
          cornerRadius: 14,
          ...shadow(16, 6),
        }),
        rect(90, y, 150, 36, t.color('text'), { name: 'Date tile top', cornerRadius: 14 }),
        rect(90, y + 20, 150, 16, t.color('text'), { name: 'Date tile edge' }),
        circle(130, y + 18, 7, t.color('surface')),
        circle(200, y + 18, 7, t.color('surface')),
        text(day, 90, y + 52, 150, {
          fontFamily: heading,
          fontSize: 64,
          fontWeight: 800,
          fill: t.color('text'),
          align: 'center',
          lineHeight: 1.1,
        }),
        text(events[index] ?? '', 280, y + 20, 720, {
          fontFamily: heading,
          fontSize: 46,
          fontWeight: 800,
          fill: t.color('text'),
        }),
        text(notes[index] ?? '', 280, y + 92, 700, {
          fontFamily: t.font('body'),
          fontSize: 30,
          fontWeight: 500,
          fill: t.color('text'),
          opacity: 0.8,
        }),
      ];
    }),
    star(5, 930, story ? 120 : 50, 100, t.color('surface'), { innerRatio: 0.42 }),
  ];
};

export const scheduleList = (theme: EventTheme): Template => {
  const spec = {
    colors: planColors(theme, false),
    fonts: { heading: HEADING, body: BODY },
    copy: PLAN_COPY,
  } as const satisfies PlanSpec;
  return themed(PW, PH, spec, (t) => [
    schedule(t, PH, false),
    star(5, 900, 1180, 110, t.color('text'), { innerRatio: 0.42 }),
  ]);
};

export const scheduleStory = (theme: EventTheme): Template => {
  const spec = {
    colors: planColors(theme, true),
    fonts: { heading: HEADING, body: BODY },
    copy: STORY_COPY,
  } as const satisfies PlanSpec;
  const { width, height } = STORY_SIZE;
  return themed(width, height, spec, (t) => [
    schedule(t, height, true),
    rect(90, 1640, 900, 120, t.color('text'), { name: 'Button', cornerRadius: 60 }),
    text(t.copy('button'), 90, 1678, 900, {
      fontFamily: t.font('heading'),
      fontSize: 38,
      fontWeight: 700,
      fill: t.color('surface'),
      align: 'center',
    }),
  ]);
};
