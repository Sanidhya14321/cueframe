import { linear, NO_FILTERS } from '@/design';
import {
  circle,
  icon,
  line,
  POST_SIZE,
  photo,
  rect,
  rotateNodes,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { AUT, BODY, HAND, SERIF } from './palette';

const { width: W, height: H } = POST_SIZE;

const fallSpec = {
  colors: {
    background: {
      value: AUT.oat,
      hint: 'Page and the stamp center; its darker shade colors the divider',
    },
    surface: { value: AUT.white, hint: 'Postcard and the handle at the bottom' },
    primary: {
      value: AUT.plum,
      hint: 'FIRST DAY OF FALL; its lighter shade colors Hello and the stamp leaf',
    },
    secondary: { value: AUT.sage, hint: 'Date line' },
    accent: { value: AUT.rose, hint: 'Stamp frame and the tape' },
    text: { value: AUT.espresso, hint: 'Handwritten note' },
  },
  fonts: { heading: SERIF, script: HAND, body: BODY },
  copy: {
    greeting: { label: 'Greeting', value: 'Hello' },
    title: { label: 'Title', value: 'FIRST DAY\nOF FALL' },
    date: { label: 'Date', value: 'SEPTEMBER 22, 2027' },
    note: { label: 'Note', value: 'Hello sweater\nweather, warm\ncider and long\ncrisp walks' },
    handle: { label: 'Handle', value: '@mapleandmoss' },
  },
} as const satisfies ThemeSpec;

export const firstDayOfFall = themed(W, H, fallSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  photo('autumn-leaves', 0, 520, W, 830, { name: 'Leaves' }),
  rotateNodes(-3, 540, 330, [
    rect(70, 90, 940, 500, t.color('surface'), {
      name: 'Postcard',
      ...shadow(30, 14, 'rgba(0,0,0,0.25)'),
    }),
    rect(860, 120, 120, 146, t.color('accent'), { name: 'Stamp' }),
    rect(872, 132, 96, 122, t.color('background'), { name: 'Stamp inner' }),
    icon('leaf', 890, 160, 60, t.shade('primary', AUT.berry), { strokeWidth: 2 }),
    text(t.copy('greeting'), 120, 120, 300, {
      fontFamily: t.font('script'),
      fontSize: 76,
      fontWeight: 600,
      fill: t.shade('primary', AUT.berry),
    }),
    text(t.copy('title'), 120, 214, 580, {
      fontFamily: t.font('heading'),
      fontSize: 86,
      fontWeight: 700,
      fill: t.color('primary'),
      lineHeight: 1,
    }),
    text(t.copy('date'), 120, 440, 520, {
      fontFamily: t.font('body'),
      fontSize: 30,
      fontWeight: 600,
      fill: t.color('secondary'),
      letterSpacing: 5,
    }),
    rect(700, 300, 3, 240, t.shade('background', AUT.line), { name: 'Divider' }),
    text(t.copy('note'), 730, 300, 260, {
      fontFamily: t.font('script'),
      fontSize: 44,
      fontWeight: 500,
      fill: t.color('text'),
      lineHeight: 1.1,
    }),
  ]),
  rect(90, 600, 160, 44, t.shade('accent', 'rgba(201,139,139,0.85)'), {
    rotation: -12,
    name: 'Tape',
  }),
  text(t.copy('handle'), 0, 1250, W, {
    fontFamily: t.font('body'),
    fontSize: 32,
    fontWeight: 600,
    fill: t.color('surface'),
    align: 'center',
  }),
]);

const SONG_SLOTS = [
  [50, 420],
  [50, 640],
  [50, 860],
  [750, 420],
  [750, 640],
  [750, 860],
] as const;

const playlistSpec = {
  colors: {
    background: {
      value: AUT.espresso,
      hint: 'Page behind the photo and the dark layer that dims it',
    },
    primary: {
      value: AUT.plum,
      hint: 'First and fourth song cards; its lighter shade colors the third and sixth',
    },
    secondary: { value: AUT.sage, hint: 'Second and fifth song cards' },
    accent: { value: AUT.butter, hint: '(Playlist Edition) and the artist names' },
    text: {
      value: AUT.oat,
      hint: 'Autumn, song titles, progress bars, play icons and the bottom line; its faded shade colors the tracks',
    },
  },
  fonts: { heading: SERIF, body: BODY, script: HAND },
  copy: {
    title: { label: 'Title', value: 'Autumn' },
    subtitle: { label: 'Subtitle', value: '(Playlist Edition)' },
    songs: {
      label: 'Song',
      value: [
        'Cardigan Days',
        'Amber Light',
        'Cider Season',
        'Slow Sunday',
        'Copper Leaves',
        'Woodsmoke',
      ],
    },
    artists: {
      label: 'Artist',
      value: [
        'Juniper Lane',
        'The Hollows',
        'Ivy Marsh',
        'Northbound',
        'Wren & Fox',
        'Pale Harbor',
      ],
    },
    tagline: { label: 'Tagline', value: 'Press play on sweater season' },
  },
} as const satisfies ThemeSpec;

export const playlist = themed(W, H, playlistSpec, (t) => {
  const artists = t.list('artists');
  const cardFills = [t.color('primary'), t.color('secondary'), t.shade('primary', AUT.berry)];
  const songs = t.list('songs').map((title, index) => {
    const [x, y] = SONG_SLOTS[index] ?? [50, 420];
    return [
      rect(x, y, 280, 150, cardFills[index % 3] ?? t.color('primary'), {
        cornerRadius: 20,
        opacity: 0.94,
        name: 'Song card',
      }),
      text(title, x + 24, y + 18, 240, {
        fontFamily: t.font('body'),
        fontSize: 30,
        fontWeight: 700,
        fill: t.color('text'),
      }),
      text(artists[index] ?? '', x + 24, y + 56, 240, {
        fontFamily: t.font('body'),
        fontSize: 22,
        fontWeight: 500,
        fill: t.color('accent'),
      }),
      rect(x + 24, y + 100, 140, 6, t.shade('text', 'rgba(245,239,228,0.35)'), {
        cornerRadius: 3,
        name: 'Track',
      }),
      rect(x + 24, y + 100, 80, 6, t.color('text'), { cornerRadius: 3, name: 'Progress' }),
      icon('play', x + 210, y + 84, 40, t.color('text')),
    ];
  });
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    photo('autumn-leaves', 0, 0, W, H, { name: 'Backdrop' }),
    rect(0, 0, W, H, t.shade('background', 'rgba(43,29,24,0.5)'), { name: 'Dim' }),
    text(t.copy('title'), 0, 70, W, {
      fontFamily: t.font('heading'),
      fontSize: 150,
      fontWeight: 600,
      italic: true,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('subtitle'), 0, 260, W, {
      fontFamily: t.font('heading'),
      fontSize: 46,
      fontWeight: 500,
      italic: true,
      fill: t.color('accent'),
      align: 'center',
    }),
    photo('woman-portrait-2', 360, 400, 360, 620, { cornerRadius: 180 }),
    songs,
    text(t.copy('tagline'), 0, 1170, W, {
      fontFamily: t.font('script'),
      fontSize: 60,
      fontWeight: 600,
      fill: t.color('text'),
      align: 'center',
    }),
  ];
});

const notesSpec = {
  colors: {
    surface: { value: AUT.butter, hint: 'Note card' },
    primary: {
      value: AUT.berry,
      hint: 'Notes title, the note icons and the divider; its deeper shade fills the page and tints the photo',
    },
    text: { value: AUT.espresso, hint: 'Note text' },
  },
  fonts: { body: BODY },
  copy: {
    title: { label: 'Title', value: 'Notes' },
    note: {
      label: 'Note',
      value: 'Slow mornings, warm mugs and\ngolden light. Fall is a soft reset.',
    },
  },
} as const satisfies ThemeSpec;

export const notesQuote = themed(W, H, notesSpec, (t) => [
  rect(0, 0, W, H, t.shade('primary', AUT.plum), { name: 'Background' }),
  photo('woman-portrait-1', 0, 0, W, H, { name: 'Portrait' }),
  rect(0, 0, W, H, t.shade('primary', 'rgba(74,35,56,0.18)'), { name: 'Tint' }),
  rect(130, 930, 820, 330, t.shade('surface', 'rgba(241,220,167,0.96)'), {
    cornerRadius: 30,
    name: 'Note card',
    ...shadow(30, 12, 'rgba(0,0,0,0.25)'),
  }),
  icon('arrow-left', 160, 966, 40, t.color('primary')),
  text(t.copy('title'), 204, 962, 300, {
    fontFamily: t.font('body'),
    fontSize: 34,
    fontWeight: 700,
    fill: t.color('primary'),
  }),
  icon('share-2', 820, 964, 40, t.color('primary')),
  icon('pencil', 870, 964, 40, t.color('primary')),
  line(170, 1030, 740, t.shade('primary', 'rgba(123,58,82,0.25)'), 2),
  text(t.copy('note'), 170, 1060, 740, {
    fontFamily: t.font('body'),
    fontSize: 40,
    fontWeight: 500,
    fill: t.color('text'),
    lineHeight: 1.35,
  }),
]);

const thankfulSpec = {
  colors: {
    surface: {
      value: AUT.white,
      hint: 'Search card and search bar; its darker shade outlines the bar',
    },
    primary: { value: AUT.plum, hint: 'Search suggestions' },
    accent: {
      value: AUT.berry,
      hint: 'Search icon in the bar; its lighter shade colors the suggestion icons',
    },
    text: {
      value: AUT.espresso,
      hint: 'Search query and the page behind the photo; its translucent shade dims the photo',
    },
  },
  fonts: { body: BODY },
  copy: {
    query: { label: 'Search query', value: 'thankful for' },
    items: {
      label: 'Suggestion',
      value: ['quiet mornings', 'crisp weather', 'simple moments', 'long slow walks'],
    },
  },
} as const satisfies ThemeSpec;

export const thankfulFor = themed(W, H, thankfulSpec, (t) => [
  rect(0, 0, W, H, t.color('text'), { name: 'Background' }),
  photo('autumn-mug', 0, 0, W, H, { name: 'Cozy tray' }),
  rect(0, 0, W, H, t.shade('text', 'rgba(43,29,24,0.2)'), { name: 'Dim' }),
  rect(210, 330, 660, 640, t.shade('surface', 'rgba(255,255,255,0.88)'), {
    cornerRadius: 40,
    name: 'Search card',
    ...shadow(40, 16, 'rgba(0,0,0,0.25)'),
  }),
  rect(250, 370, 580, 100, t.color('surface'), {
    cornerRadius: 50,
    stroke: t.shade('surface', AUT.line),
    strokeWidth: 3,
  }),
  text(t.copy('query'), 300, 396, 400, {
    fontFamily: t.font('body'),
    fontSize: 42,
    fontWeight: 500,
    fill: t.color('text'),
  }),
  icon('search', 740, 394, 52, t.color('accent'), { strokeWidth: 2.4 }),
  t.list('items').map((item, index) => [
    icon('search', 280, 530 + index * 108, 36, t.shade('accent', AUT.rose)),
    text(item, 340, 522 + index * 108, 480, {
      fontFamily: t.font('body'),
      fontSize: 42,
      fontWeight: 500,
      fill: t.color('primary'),
    }),
  ]),
]);

const lockSpec = {
  colors: {
    background: {
      value: AUT.plum,
      hint: 'Tint over the photo; its shades fade the bottom, fill the round shortcut buttons and the page behind the photo',
    },
    primary: {
      value: AUT.berry,
      hint: 'Bell badge; its darker shades color the reminder title and message',
    },
    text: {
      value: AUT.oat,
      hint: 'Clock, date and every icon; its translucent shade colors the reminder card',
    },
  },
  fonts: { body: BODY },
  copy: {
    time: { label: 'Time', value: '10:07' },
    date: { label: 'Date', value: 'Sunday, November 7' },
    title: { label: 'Reminder title', value: 'Reminder' },
    message: { label: 'Reminder', value: 'It is okay to slow down today.' },
  },
} as const satisfies ThemeSpec;

export const lockScreen = themed(W, H, lockSpec, (t) => [
  rect(0, 0, W, H, t.shade('background', AUT.white), { name: 'Background' }),
  photo('autumn-leaves', 0, 0, W, H, {
    name: 'Blurred leaves',
    filters: { ...NO_FILTERS, blur: 6, brightness: 0.7 },
  }),
  rect(
    0,
    0,
    W,
    H,
    linear(
      180,
      t.shade('background', 'rgba(74,35,56,0.35)'),
      t.shade('background', 'rgba(43,29,24,0.1)'),
    ),
    { name: 'Tint' },
  ),
  icon('lock', 510, 90, 60, t.color('text')),
  text(t.copy('time'), 0, 180, W, {
    fontFamily: t.font('body'),
    fontSize: 240,
    fontWeight: 600,
    fill: t.color('text'),
    align: 'center',
  }),
  text(t.copy('date'), 0, 470, W, {
    fontFamily: t.font('body'),
    fontSize: 46,
    fontWeight: 500,
    fill: t.color('text'),
    align: 'center',
  }),
  rect(190, 640, 700, 180, t.shade('text', 'rgba(245,239,228,0.82)'), {
    cornerRadius: 40,
    name: 'Reminder',
  }),
  circle(270, 730, 44, t.color('primary')),
  icon('bell', 248, 708, 44, t.color('text')),
  text(t.copy('title'), 340, 676, 500, {
    fontFamily: t.font('body'),
    fontSize: 38,
    fontWeight: 700,
    fill: t.shade('primary', AUT.espresso),
  }),
  text(t.copy('message'), 340, 730, 520, {
    fontFamily: t.font('body'),
    fontSize: 32,
    fontWeight: 500,
    fill: t.shade('primary', AUT.plum),
  }),
  circle(190, 1190, 64, t.shade('background', 'rgba(0,0,0,0.35)')),
  icon('sun', 160, 1160, 60, t.color('text')),
  circle(890, 1190, 64, t.shade('background', 'rgba(0,0,0,0.35)')),
  icon('camera', 860, 1160, 60, t.color('text')),
]);
