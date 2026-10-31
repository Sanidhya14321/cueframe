import { linear } from '@/design';
import {
  rect,
  rotateNodes,
  shadow,
  star,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY, type EventTheme, HEADING, PH, PW } from './posts';

const DATES = ['03', '07', '11', '13', '19', '21', '25', '28', '30'];
const WEEKDAYS = ['Mon', 'Fri', 'Tue', 'Thu', 'Wed', 'Fri', 'Tue', 'Fri', 'Sun'];
const LABELS = [
  { x: 70, y: 450 },
  { x: 400, y: 770 },
  { x: 90, y: 1090 },
] as const;

export const monthEvents = (theme: EventTheme): Template => {
  const spec = {
    colors: {
      primary: { value: theme.brand, hint: 'Page and the dates on the dark day cells' },
      surface: {
        value: theme.paper,
        hint: 'Light day cells, event tags, the star and weekdays on dark cells',
      },
      text: {
        value: theme.ink,
        hint: 'Titles, dark day cells, dates on light cells and event names; its shade colors the weekdays on light cells',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      kicker: { label: 'Kicker', value: 'Upcoming' },
      title: { label: 'Title', value: 'November Events' },
      dates: { label: 'Date', value: DATES },
      weekdays: { label: 'Weekday', value: WEEKDAYS },
      events: { label: 'Event', value: ['Team Offsite', 'Kindness Day', 'Holiday Drop'] },
    },
  } as const satisfies ThemeSpec;
  return themed(PW, PH, spec, (t) => {
    const heading = t.font('heading');
    const weekdays = t.list('weekdays');
    const events = t.list('events');
    return [
      rect(0, 0, PW, PH, t.color('primary'), { name: 'Background' }),
      text(t.copy('kicker'), 90, 80, 600, {
        fontFamily: heading,
        fontSize: 34,
        fontWeight: 500,
        fill: t.color('text'),
      }),
      text(t.copy('title'), 90, 122, 900, {
        fontFamily: heading,
        fontSize: 74,
        fontWeight: 800,
        fill: t.color('text'),
      }),
      t.list('dates').map((day, index) => {
        const x = 90 + (index % 3) * 305;
        const y = 270 + Math.floor(index / 3) * 315;
        const dark = index % 2 === 0;
        return [
          rect(x, y, 280, 290, dark ? t.color('text') : t.color('surface'), { name: 'Day cell' }),
          text(day, x + 24, y + 20, 120, {
            fontFamily: heading,
            fontSize: 58,
            fontWeight: 800,
            fill: dark ? t.color('primary') : t.color('text'),
          }),
          text(weekdays[index] ?? '', x + 130, y + 44, 130, {
            fontFamily: t.font('body'),
            fontSize: 26,
            fontWeight: 600,
            fill: dark ? t.color('surface') : t.shade('text', theme.muted),
          }),
        ];
      }),
      LABELS.map(({ x, y }, index) =>
        rotateNodes(-7, x, y, [
          rect(x, y, 300, 58, t.color('surface'), { name: 'Event label', ...shadow(12, 4) }),
          text(events[index] ?? '', x, y + 12, 300, {
            fontFamily: heading,
            fontSize: 26,
            fontWeight: 700,
            fill: t.color('text'),
            align: 'center',
          }),
        ]),
      ),
      star(5, 940, 60, 100, t.color('surface'), { innerRatio: 0.42 }),
    ];
  });
};

export const saveTheDate = (theme: EventTheme): Template => {
  const spec = {
    colors: {
      background: {
        value: '#9ea3aa',
        hint: 'Elevator doors; its shades color the door shine, the seam and the floor',
      },
      surface: {
        value: '#fbfaf6',
        hint: 'Poster; its shades color the divider and the numbers and seams on the dark flip cards',
      },
      primary: { value: theme.brand, hint: 'Underline and the middle flip card' },
      text: {
        value: theme.ink,
        hint: 'Save the Date, the call to action, the dark flip cards, the middle number and its seam; its shade colors the invite, captions and WANT A SEAT?',
      },
      accent: { value: '#ceaa6e', hint: 'Translucent tape strips holding the poster' },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Save the Date' },
      invite: { label: 'Invite', value: 'You are invited to our\nsummer open studio' },
      values: { label: 'Date number', value: ['14', '06', '26'] },
      captions: { label: 'Date caption', value: ['DAY', 'MONTH', 'YEAR'] },
      prompt: { label: 'Prompt', value: 'WANT A SEAT?' },
      cta: { label: 'Call to action', value: 'Comment "IN" below' },
    },
  } as const satisfies ThemeSpec;
  return themed(PW, PH, spec, (t) => {
    const heading = t.font('heading');
    const body = t.font('body');
    const muted = t.shade('text', theme.muted);
    const captions = t.list('captions');
    const tape = t.shade('accent', 'rgba(206,170,110,0.85)');
    return [
      rect(
        0,
        0,
        PW,
        PH,
        linear(
          90,
          t.color('background'),
          t.shade('background', '#e2e5e9'),
          t.shade('background', '#b3b8bf'),
          t.shade('background', '#e8eaed'),
          t.color('background'),
        ),
        { name: 'Elevator doors' },
      ),
      rect(537, 0, 6, PH, t.shade('background', '#7c8189'), { name: 'Door seam' }),
      rect(0, 1240, PW, 110, t.shade('background', '#6f747c'), { name: 'Floor' }),
      rotateNodes(-2, 220, 260, [
        rect(220, 260, 640, 820, t.color('surface'), { name: 'Poster', ...shadow(30, 12) }),
        text(t.copy('title'), 220, 330, 640, {
          fontFamily: heading,
          fontSize: 70,
          fontWeight: 800,
          fill: t.color('text'),
          align: 'center',
        }),
        rect(440, 432, 200, 10, t.color('primary'), { name: 'Underline', cornerRadius: 5 }),
        text(t.copy('invite'), 220, 470, 640, {
          fontFamily: body,
          fontSize: 30,
          fontWeight: 500,
          fill: muted,
          align: 'center',
          lineHeight: 1.35,
        }),
        t.list('values').map((value, index) => {
          const x = 285 + index * 180;
          const hot = index === 1;
          return [
            rect(x, 600, 150, 150, hot ? t.color('primary') : t.color('text'), {
              name: 'Flip card',
              cornerRadius: 12,
            }),
            rect(x, 673, 150, 4, hot ? t.color('text') : t.shade('surface', theme.paper), {
              name: 'Flip seam',
              opacity: 0.35,
            }),
            text(value, x, 620, 150, {
              fontFamily: heading,
              fontSize: 84,
              fontWeight: 800,
              fill: hot ? t.color('text') : t.shade('surface', theme.paper),
              align: 'center',
              lineHeight: 1.2,
            }),
            text(captions[index] ?? '', x, 766, 150, {
              fontFamily: body,
              fontSize: 20,
              fontWeight: 700,
              fill: muted,
              align: 'center',
              letterSpacing: 2,
            }),
          ];
        }),
        rect(300, 860, 480, 4, t.shade('surface', '#e2ddd2'), { name: 'Divider' }),
        text(t.copy('prompt'), 220, 890, 640, {
          fontFamily: body,
          fontSize: 22,
          fontWeight: 700,
          fill: muted,
          align: 'center',
          letterSpacing: 3,
        }),
        text(t.copy('cta'), 220, 930, 640, {
          fontFamily: heading,
          fontSize: 40,
          fontWeight: 800,
          fill: t.color('text'),
          align: 'center',
        }),
      ]),
      rotateNodes(-32, 170, 290, [rect(170, 290, 170, 52, tape, { name: 'Tape' })]),
      rotateNodes(32, 760, 200, [rect(760, 200, 170, 52, tape, { name: 'Tape' })]),
    ];
  });
};
