import { linear } from '@/design';
import {
  group,
  rect,
  rotateNodes,
  star,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { type EventPalette, FONTS, H, JADE, W } from './palette';
import { contentCalendar } from './posts-calendar';
import { eventDay, eventList } from './posts-events';

const TAGS = [
  [100, 500, -6],
  [420, 840, 5],
  [730, 1170, -5],
] as const;

const monthSpec = (p: EventPalette) =>
  ({
    colors: {
      background: {
        value: p.deep,
        hint: 'Page gradient; its shades color the bottom of the gradient and the dark day cells',
      },
      surface: {
        value: p.paper,
        hint: 'November Events, the light day cells and the numbers on the dark cells',
      },
      accent: { value: p.accent, hint: 'Star and the event tags' },
      text: {
        value: p.ink,
        hint: 'Numbers on the light cells and the tag labels; its grey shade colors the weekdays on the light cells',
      },
      secondary: { value: p.soft, hint: 'Upcoming and the weekdays on the dark cells' },
    },
    fonts: FONTS,
    copy: {
      kicker: { label: 'Kicker', value: 'Upcoming' },
      title: { label: 'Title', value: 'November Events' },
      days: { label: 'Day', value: ['01', '04', '07', '11', '13', '17', '21', '26', '30'] },
      weekdays: {
        label: 'Weekday',
        value: [
          'Sunday',
          'Wednesday',
          'Saturday',
          'Wednesday',
          'Friday',
          'Tuesday',
          'Saturday',
          'Thursday',
          'Monday',
        ],
      },
      tags: { label: 'Event tag', value: ['Open Studio Day', 'Kindness Day', 'Gratitude Week'] },
    },
  }) as const satisfies ThemeSpec;

const monthEvents = (p: EventPalette) =>
  themed(W, H, monthSpec(p), (t) => {
    const heading = t.font('heading');
    const body = t.font('body');
    const paper = t.color('surface');
    const weekdays = t.list('weekdays');
    return [
      rect(0, 0, W, H, linear(160, t.color('background'), t.shade('background', p.top)), {
        name: 'Background',
      }),
      text(t.copy('kicker'), 80, 80, 600, {
        fontFamily: body,
        fontSize: 40,
        fontWeight: 500,
        fill: t.color('secondary'),
      }),
      text(t.copy('title'), 80, 130, 900, {
        fontFamily: heading,
        fontSize: 84,
        fontWeight: 800,
        fill: paper,
      }),
      star(5, 930, 56, 96, t.color('accent'), { innerRatio: 0.42 }),
      t.list('days').map((day, index) => {
        const x = 80 + (index % 3) * 315;
        const y = 300 + Math.floor(index / 3) * 335;
        const light = index % 2 === 1;
        return [
          rect(x, y, 290, 300, light ? paper : t.shade('background', 'rgba(0,0,0,0.32)'), {
            cornerRadius: 16,
            name: `${day} cell`,
          }),
          text(day, x + 26, y + 24, 240, {
            fontFamily: heading,
            fontSize: 72,
            fontWeight: 800,
            fill: light ? t.color('text') : paper,
          }),
          text(weekdays[index] ?? '', x + 28, y + 118, 240, {
            fontFamily: body,
            fontSize: 28,
            fontWeight: 500,
            fill: light ? t.shade('text', '#4b5563') : t.color('secondary'),
          }),
        ];
      }),
      t.list('tags').map((label, index) => {
        const [x, y, rotation] = TAGS[index] ?? [0, 0, 0];
        const width = label.length * 14 + 36;
        return group(
          rotateNodes(rotation, x + width / 2, y + 22, [
            rect(x, y, width, 44, t.color('accent'), { cornerRadius: 6, name: `${label} tag` }),
            text(label, x, y + 8, width, {
              fontFamily: body,
              fontSize: 24,
              fontWeight: 700,
              fill: t.color('text'),
              align: 'center',
            }),
          ]),
        );
      }),
    ];
  });

const dateSpec = (p: EventPalette) =>
  ({
    colors: {
      background: {
        value: '#e6e9ed',
        hint: 'Fridge door; its shades color the door edges, the door gap and the handles',
      },
      surface: {
        value: '#fbfbf8',
        hint: 'Paper poster; its shades color the month and year numbers, the venue text and the tape',
      },
      primary: {
        value: p.top,
        hint: 'Star and the venue bar; its dark shade colors Save the Date',
      },
      accent: { value: p.accent, hint: 'Day in the countdown' },
      text: {
        value: p.ink,
        hint: 'Countdown boxes and the comment line; its grey shades color the invite, the countdown labels and the reminder line',
      },
    },
    fonts: FONTS,
    copy: {
      title: { label: 'Title', value: 'Save the Date' },
      invite: { label: 'Invite', value: 'You are invited to\nan evening to remember.' },
      labels: { label: 'Countdown label', value: ['Month', 'Day', 'Year'] },
      values: { label: 'Countdown value', value: ['11', '14', '26'] },
      prompt: { label: 'Prompt', value: 'Want a reminder?' },
      reply: { label: 'Reply', value: 'Comment: "GO"' },
      venue: { label: 'Venue', value: 'Fernway Hall, 7 pm' },
    },
  }) as const satisfies ThemeSpec;

const saveTheDate = (p: EventPalette) =>
  themed(W, H, dateSpec(p), (t) => {
    const heading = t.font('heading');
    const body = t.font('body');
    const values = t.list('values');
    const paper = t.shade('surface', p.paper);
    const tape = t.shade('surface', 'rgba(214,186,132,0.85)');
    return [
      rect(
        0,
        0,
        W,
        H,
        linear(
          90,
          t.shade('background', '#8b939c'),
          t.color('background'),
          t.shade('background', '#9aa2ab'),
        ),
        { name: 'Fridge door' },
      ),
      rect(536, 0, 8, H, t.shade('background', 'rgba(55,65,81,0.55)'), { name: 'Door gap' }),
      rect(470, 140, 24, 1060, t.shade('background', '#c3c8ce'), {
        cornerRadius: 12,
        name: 'Handle',
      }),
      rect(586, 140, 24, 1060, t.shade('background', '#c3c8ce'), {
        cornerRadius: 12,
        name: 'Handle',
      }),
      rotateNodes(-2.5, 540, 740, [
        rect(210, 330, 660, 820, t.color('surface'), {
          name: 'Poster',
          cornerRadius: 4,
          shadow: { color: 'rgba(0,0,0,0.3)', blur: 30, offsetX: 0, offsetY: 14 },
        }),
        star(5, 250, 370, 44, t.color('primary'), { innerRatio: 0.42 }),
        text(t.copy('title'), 210, 430, 660, {
          fontFamily: heading,
          fontSize: 72,
          fontWeight: 800,
          fill: t.shade('primary', p.deep),
          align: 'center',
        }),
        text(t.copy('invite'), 210, 530, 660, {
          fontFamily: body,
          fontSize: 32,
          fontWeight: 500,
          fill: t.shade('text', '#4b5563'),
          align: 'center',
          lineHeight: 1.3,
        }),
        t.list('labels').map((label, index) => {
          const x = 270 + index * 190;
          return [
            text(label, x, 640, 170, {
              fontFamily: body,
              fontSize: 22,
              fontWeight: 600,
              fill: t.shade('text', '#6b7280'),
              align: 'center',
            }),
            rect(x, 680, 170, 150, t.color('text'), { cornerRadius: 12, name: `${label} box` }),
            text(values[index] ?? '', x, 702, 170, {
              fontFamily: heading,
              fontSize: 84,
              fontWeight: 800,
              fill: index === 1 ? t.color('accent') : paper,
              align: 'center',
            }),
          ];
        }),
        text(t.copy('prompt'), 210, 880, 660, {
          fontFamily: body,
          fontSize: 28,
          fontWeight: 500,
          fill: t.shade('text', '#6b7280'),
          align: 'center',
        }),
        text(t.copy('reply'), 210, 925, 660, {
          fontFamily: heading,
          fontSize: 44,
          fontWeight: 800,
          fill: t.color('text'),
          align: 'center',
        }),
        rect(260, 1030, 560, 70, t.color('primary'), { cornerRadius: 35, name: 'Venue bar' }),
        text(t.copy('venue'), 260, 1048, 560, {
          fontFamily: body,
          fontSize: 30,
          fontWeight: 700,
          fill: paper,
          align: 'center',
        }),
        rect(430, 296, 220, 70, tape, { rotation: 6, name: 'Tape' }),
        rect(170, 330, 150, 56, tape, { rotation: -32, name: 'Tape' }),
      ]),
    ];
  });

export const POSTS: readonly [Template, Template, Template, Template, Template] = [
  monthEvents(JADE),
  eventList(JADE),
  saveTheDate(JADE),
  eventDay(JADE),
  contentCalendar(JADE),
];
