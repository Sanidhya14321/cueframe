import { type DesignIconName, linear } from '@/design';
import {
  avatar,
  circle,
  icon,
  POST_SIZE,
  photo,
  rect,
  rotateNodes,
  shadow,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY, MIST, SERIF, TALL } from './palette';

const { width: W, height: H } = POST_SIZE;

const jamsSpec = {
  colors: {
    primary: {
      value: MIST.ink,
      hint: 'Song titles, progress bars, play buttons, the dim over the photo and the page behind it',
    },
    secondary: { value: MIST.slate, hint: 'Artists and track times' },
    surface: {
      value: MIST.mist,
      hint: 'Track cards; its darker shade colors the empty track bars',
    },
    accent: { value: MIST.mint, hint: '(Studio Playlist) line under the title' },
    text: { value: MIST.white, hint: 'Flow Jams title' },
  },
  fonts: { serif: SERIF, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Flow Jams' },
    subtitle: { label: 'Subtitle', value: '(Studio Playlist)' },
    songs: { label: 'Song', value: ['Slow Tide', 'Open Hips', 'Exhale', 'Still Water'] },
    artists: { label: 'Artist', value: ['Luma Rae', 'Northfield', 'Coral Static', 'Ama Lin'] },
    elapsed: { label: 'Elapsed time', value: '1:24' },
    lengths: { label: 'Track length', value: ['3:42', '4:10', '2:58', '5:06'] },
  },
} as const satisfies ThemeSpec;

const track = (t: Theme<typeof jamsSpec>, x: number, y: number, index: number) => {
  const body = t.font('body');
  return [
    rect(x, y, 300, 170, t.shade('surface', 'rgba(238,242,243,0.92)'), {
      cornerRadius: 24,
      name: 'Track card',
    }),
    text(t.list('songs')[index] ?? '', x + 26, y + 20, 250, {
      fontFamily: body,
      fontSize: 30,
      fontWeight: 700,
      fill: t.color('primary'),
    }),
    text(t.list('artists')[index] ?? '', x + 26, y + 58, 250, {
      fontFamily: body,
      fontSize: 22,
      fontWeight: 500,
      fill: t.color('secondary'),
    }),
    rect(x + 26, y + 104, 248, 6, t.shade('surface', MIST.fog), {
      cornerRadius: 3,
      name: 'Track bar',
    }),
    rect(x + 26, y + 104, 110 + index * 30, 6, t.color('primary'), {
      cornerRadius: 3,
      name: 'Progress',
    }),
    text(t.copy('elapsed'), x + 26, y + 120, 100, {
      fontFamily: body,
      fontSize: 20,
      fontWeight: 500,
      fill: t.color('secondary'),
    }),
    text(t.list('lengths')[index] ?? '', x + 174, y + 120, 100, {
      fontFamily: body,
      fontSize: 20,
      fontWeight: 500,
      fill: t.color('secondary'),
      align: 'right',
    }),
    icon('play', x + 132, y + 118, 34, t.color('primary')),
  ];
};

export const flowJams = themed(W, H, jamsSpec, (t) => [
  rect(0, 0, W, H, t.color('primary'), { name: 'Background' }),
  photo('yoga-2', 0, 0, W, H, { name: 'Backdrop' }),
  rect(0, 0, W, H, t.shade('primary', 'rgba(30,42,51,0.5)'), { name: 'Dim' }),
  text(t.copy('title'), 0, 70, W, {
    fontFamily: t.font('serif'),
    fontSize: 160,
    fontWeight: 400,
    italic: true,
    fill: t.color('text'),
    align: 'center',
  }),
  text(t.copy('subtitle'), 0, 250, W, {
    fontFamily: t.font('serif'),
    fontSize: 54,
    fontWeight: 400,
    italic: true,
    fill: t.color('accent'),
    align: 'center',
  }),
  track(t, 50, 760, 0),
  track(t, 50, 960, 1),
  track(t, 730, 760, 2),
  track(t, 730, 960, 3),
]);

const bigSpec = {
  colors: {
    background: {
      value: MIST.mist,
      hint: 'Page; its see-through shade fills the class times badge',
    },
    primary: { value: MIST.ink, hint: 'PILATES, Studio Mira and the class times' },
    secondary: { value: MIST.slate, hint: 'Tagline under PILATES' },
  },
  fonts: { display: TALL, serif: SERIF, body: BODY },
  copy: {
    title: { label: 'Title', value: 'PILATES' },
    tagline: { label: 'Tagline', value: "LET'S FLOW AND RISE TOGETHER" },
    studio: { label: 'Studio', value: 'Studio Mira' },
    badge: { label: 'Class times', value: 'Mon to Sat\n7 AM classes' },
  },
} as const satisfies ThemeSpec;

export const pilatesBig = themed(W, H, bigSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  text(t.copy('title'), 0, 10, W, {
    fontFamily: t.font('display'),
    fontSize: 300,
    fontWeight: 400,
    fill: t.color('primary'),
    align: 'center',
    lineHeight: 1.1,
  }),
  text(t.copy('tagline'), 70, 390, 640, {
    fontFamily: t.font('body'),
    fontSize: 30,
    fontWeight: 600,
    fill: t.color('secondary'),
    letterSpacing: 4,
  }),
  text(t.copy('studio'), 700, 384, 310, {
    fontFamily: t.font('serif'),
    fontSize: 44,
    fontWeight: 400,
    italic: true,
    fill: t.color('primary'),
    align: 'right',
  }),
  photo('yoga-1', 40, 470, 1000, 840, { cornerRadius: 36 }),
  rect(80, 1150, 330, 110, t.shade('background', 'rgba(238,242,243,0.92)'), {
    cornerRadius: 55,
    name: 'Badge',
  }),
  text(t.copy('badge'), 80, 1166, 330, {
    fontFamily: t.font('body'),
    fontSize: 28,
    fontWeight: 600,
    fill: t.color('primary'),
    align: 'center',
    lineHeight: 1.2,
  }),
]);

const calendarSpec = {
  colors: {
    background: {
      value: MIST.white,
      hint: "Top of the page gradient and today's date; its darker shade colors the bottom of the gradient",
    },
    primary: {
      value: MIST.ink,
      hint: 'Today circle, the other dates, the workout title and both event names',
    },
    secondary: {
      value: MIST.slate,
      hint: 'Weekdays, the date line, hours and the evening event bar; its lighter shade colors the hour lines',
    },
    accent: { value: MIST.mint, hint: 'Morning event card; its deeper shade colors its bar' },
    surface: { value: MIST.sky, hint: 'Evening event card' },
  },
  fonts: { body: BODY },
  copy: {
    days: { label: 'Weekday', value: ['S', 'M', 'T', 'W', 'T', 'F', 'S'] },
    dates: { label: 'Date', value: ['1', '2', '3', '4', '5', '6', '7'] },
    dateLine: { label: 'Date line', value: 'Wednesday  ·  Aug 4, 2027' },
    hours: {
      label: 'Hour',
      value: ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
    },
    title: { label: 'Title', value: 'work\nout' },
    events: { label: 'Event', value: ['Morning\nMeditation', 'Hot Yoga Flow  ·  18:00'] },
  },
} as const satisfies ThemeSpec;

export const workoutCalendar = themed(W, H, calendarSpec, (t) => {
  const body = t.font('body');
  const dates = t.list('dates');
  const [morning = '', evening = ''] = t.list('events');
  return [
    rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', MIST.mist)), {
      name: 'Background',
    }),
    t.list('days').map((day, index) => {
      const x = 90 + index * 140;
      const today = index === 3;
      return [
        text(day, x - 40, 60, 80, {
          fontFamily: body,
          fontSize: 26,
          fontWeight: 600,
          fill: t.color('secondary'),
          align: 'center',
        }),
        today ? circle(x, 140, 40, t.color('primary')) : [],
        text(dates[index] ?? '', x - 40, 120, 80, {
          fontFamily: body,
          fontSize: 36,
          fontWeight: 600,
          fill: today ? t.color('background') : t.color('primary'),
          align: 'center',
        }),
      ];
    }),
    text(t.copy('dateLine'), 0, 210, W, {
      fontFamily: body,
      fontSize: 30,
      fontWeight: 500,
      fill: t.color('secondary'),
      align: 'center',
    }),
    t.list('hours').map((hour, index) => [
      text(hour, 50, 290 + index * 125, 110, {
        fontFamily: body,
        fontSize: 26,
        fontWeight: 500,
        fill: t.color('secondary'),
      }),
      rect(180, 306 + index * 125, 860, 2, t.shade('secondary', MIST.fog), { name: 'Hour line' }),
    ]),
    text(t.copy('title'), 170, 340, 700, {
      fontFamily: body,
      fontSize: 230,
      fontWeight: 900,
      fill: t.color('primary'),
      lineHeight: 0.9,
      letterSpacing: -6,
    }),
    rect(690, 690, 330, 120, t.color('accent'), { cornerRadius: 10, name: 'Event' }),
    rect(690, 690, 10, 120, t.shade('accent', MIST.sage), { name: 'Event bar' }),
    text(morning, 716, 704, 290, {
      fontFamily: body,
      fontSize: 32,
      fontWeight: 700,
      fill: t.color('primary'),
      lineHeight: 1.15,
    }),
    rect(180, 940, 840, 100, t.color('surface'), { cornerRadius: 10, name: 'Event' }),
    rect(180, 940, 10, 100, t.color('secondary'), { name: 'Event bar' }),
    text(evening, 210, 970, 780, {
      fontFamily: body,
      fontSize: 34,
      fontWeight: 700,
      fill: t.color('primary'),
    }),
  ];
});

const NAV: readonly DesignIconName[] = ['house', 'search', 'plus', 'heart', 'user'];

const profileSpec = {
  colors: {
    background: { value: MIST.fog, hint: 'Top of the page gradient' },
    secondary: { value: MIST.slate, hint: 'Bottom of the page gradient and the handle' },
    surface: { value: MIST.white, hint: 'Post frame' },
    primary: { value: MIST.ink, hint: 'Name, the nav icons and the frame shadow' },
    accent: { value: MIST.sage, hint: 'Verified badge' },
  },
  fonts: { body: BODY },
  copy: {
    name: { label: 'Name', value: 'Lena Ortiz' },
    handle: { label: 'Handle', value: '@mistflow.studio' },
  },
} as const satisfies ThemeSpec;

export const profileFrame = themed(W, H, profileSpec, (t) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.color('secondary')), {
    name: 'Background',
  }),
  rotateNodes(-4, 540, 675, [
    rect(150, 150, 780, 1060, t.color('surface'), {
      cornerRadius: 12,
      name: 'Frame',
      ...shadow(40, 18, t.shade('primary', 'rgba(30,42,51,0.3)')),
    }),
    avatar('woman-portrait-4', 220, 230, 38),
    text(t.copy('name'), 278, 196, 500, {
      fontFamily: t.font('body'),
      fontSize: 32,
      fontWeight: 700,
      fill: t.color('primary'),
    }),
    text(t.copy('handle'), 278, 236, 500, {
      fontFamily: t.font('body'),
      fontSize: 24,
      fontWeight: 500,
      fill: t.color('secondary'),
    }),
    icon('badge-check', 450, 200, 32, t.color('accent')),
    photo('woman-portrait-2', 190, 300, 700, 780),
    NAV.map((glyph, index) => icon(glyph, 230 + index * 140, 1112, 52, t.color('primary'))),
  ]),
]);
