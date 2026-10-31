import { linear } from '@/design';
import { circle, icon, photo, rect, shadow, type ThemeSpec, text, themed } from '../../../kit';
import { H, HAND_FONT, HANDLE, LILAC as L, MONO, SANS_FONT, SERIF_FONT, SOFT, W } from './palette';

const lockSpec = {
  colors: {
    background: { value: L.ink, hint: 'Page under the photo and the photo tint' },
    text: { value: L.white, hint: 'Clock, date and the home bar' },
    surface: { value: L.cream, hint: 'Notification card' },
    primary: {
      value: L.plum,
      hint: 'Bell icon; its shades color the reminder title, message and time',
    },
  },
  fonts: { body: SANS_FONT },
  copy: {
    time: { label: 'Clock', value: '10:07' },
    date: { label: 'Date', value: 'Sunday, March 9' },
    title: { label: 'Reminder title', value: 'Reminder' },
    when: { label: 'Time sent', value: 'now' },
    message: { label: 'Message', value: 'Slow down. Do one kind thing for you.' },
  },
} as const satisfies ThemeSpec;

export const lockScreen = themed(W, H, lockSpec, (t) => {
  const font = t.font('body');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    photo('coffee-book', 0, 0, W, H, { filters: SOFT }),
    rect(0, 0, W, H, t.shade('background', 'rgba(42,34,51,0.35)'), { name: 'Photo tint' }),
    text(t.copy('time'), 0, 230, W, {
      fontFamily: font,
      fontSize: 240,
      fontWeight: 300,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1,
      ...shadow(20, 4, 'rgba(0,0,0,0.25)'),
    }),
    text(t.copy('date'), 0, 500, W, {
      fontFamily: font,
      fontSize: 46,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
    }),
    rect(140, 720, 800, 210, t.shade('surface', 'rgba(250,247,251,0.82)'), {
      cornerRadius: 36,
      name: 'Notification',
      ...shadow(30, 10, 'rgba(0,0,0,0.2)'),
    }),
    icon('bell', 190, 770, 40, t.color('primary'), { strokeWidth: 2.2 }),
    text(t.copy('title'), 248, 770, 400, {
      fontFamily: font,
      fontSize: 36,
      fontWeight: 700,
      fill: t.shade('primary', L.ink),
    }),
    text(t.copy('when'), 760, 774, 130, {
      fontFamily: font,
      fontSize: 28,
      fontWeight: 500,
      fill: t.shade('primary', L.grey),
      align: 'right',
    }),
    text(t.copy('message'), 190, 836, 720, {
      fontFamily: font,
      fontSize: 32,
      fontWeight: 400,
      fill: t.shade('primary', L.ink),
    }),
    rect(440, 1270, 200, 10, t.shade('text', 'rgba(255,255,255,0.8)'), {
      cornerRadius: 5,
      name: 'Home bar',
    }),
  ];
});

const highlightSpec = {
  colors: {
    background: { value: L.mist, hint: 'Page behind the photo and the fading wash at the top' },
    surface: { value: L.ink, hint: 'Copy menu bar' },
    secondary: { value: L.white, hint: 'Menu labels and the dividers between them' },
    primary: { value: L.mauve, hint: 'Selection highlight, its handles and dots' },
    text: { value: L.ink, hint: 'Quote' },
  },
  fonts: { heading: SERIF_FONT, body: SANS_FONT },
  copy: {
    menu: { label: 'Menu item', value: ['Copy', 'Select All', 'Look Up'] },
    quote: {
      label: 'Quote',
      value: '"She grew softer, not smaller,\nand found her strength there."',
    },
  },
} as const satisfies ThemeSpec;

export const highlightQuote = themed(W, H, highlightSpec, (t) => {
  const divider = t.shade('secondary', 'rgba(255,255,255,0.3)');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    photo('woman-portrait-2', 0, 0, W, H, { filters: SOFT }),
    rect(
      0,
      0,
      W,
      640,
      linear(
        180,
        t.shade('background', 'rgba(250,247,251,0.9)'),
        t.shade('background', 'rgba(250,247,251,0)'),
      ),
      { name: 'Top wash' },
    ),
    rect(250, 130, 580, 76, t.color('surface'), { cornerRadius: 16, name: 'Text menu' }),
    t.list('menu').map((label, index) =>
      text(label, 250 + index * 193, 152, 193, {
        fontFamily: t.font('body'),
        fontSize: 27,
        fontWeight: 500,
        fill: t.color('secondary'),
        align: 'center',
      }),
    ),
    rect(443, 146, 2, 44, divider, { name: 'Menu divider' }),
    rect(636, 146, 2, 44, divider, { name: 'Menu divider' }),
    rect(110, 250, 860, 200, t.shade('primary', 'rgba(156,131,181,0.4)'), {
      name: 'Selection',
    }),
    rect(106, 236, 4, 228, t.color('primary'), { name: 'Selection handle' }),
    circle(108, 236, 12, t.color('primary')),
    rect(970, 236, 4, 228, t.color('primary'), { name: 'Selection handle' }),
    circle(972, 464, 12, t.color('primary')),
    text(t.copy('quote'), 130, 268, 820, {
      fontFamily: t.font('heading'),
      fontSize: 58,
      fontWeight: 600,
      italic: true,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1.2,
    }),
  ];
});

const notesSpec = {
  colors: {
    background: { value: L.plum, hint: 'Page under the photo and the photo tint' },
    surface: { value: L.cream, hint: 'Notes card; its lighter shade colors the handle' },
    primary: { value: L.mauve, hint: 'Back arrow, Notes and the share and edit icons' },
    accent: { value: L.butter, hint: 'Highlight behind the note' },
    text: { value: L.ink, hint: 'Note text' },
  },
  fonts: { body: SANS_FONT, script: HAND_FONT },
  copy: {
    back: { label: 'Back label', value: 'Notes' },
    note: { label: 'Note', value: 'You cannot rush a bloom.\nWater it, wait and let it open.' },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const notesCard = themed(W, H, notesSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  photo('yoga-1', 0, 0, W, H),
  rect(0, 0, W, H, t.shade('background', 'rgba(74,58,92,0.25)'), { name: 'Photo tint' }),
  rect(110, 150, 860, 330, t.color('surface'), {
    cornerRadius: 30,
    name: 'Notes card',
    ...shadow(36, 12, 'rgba(0,0,0,0.25)'),
  }),
  icon('arrow-left', 140, 186, 34, t.color('primary'), { strokeWidth: 2.6 }),
  text(t.copy('back'), 180, 186, 300, {
    fontFamily: t.font('body'),
    fontSize: 30,
    fontWeight: 600,
    fill: t.color('primary'),
  }),
  icon('share-2', 830, 184, 34, t.color('primary'), { strokeWidth: 2.2 }),
  icon('pencil', 890, 184, 34, t.color('primary'), { strokeWidth: 2.2 }),
  rect(150, 270, 780, 160, t.color('accent'), { cornerRadius: 8, name: 'Highlight' }),
  text(t.copy('note'), 175, 288, 740, {
    fontFamily: t.font('body'),
    fontSize: 42,
    fontWeight: 500,
    fill: t.color('text'),
    lineHeight: 1.4,
  }),
  text(t.copy('handle'), 0, 1240, W, {
    fontFamily: t.font('script'),
    fontSize: 48,
    fontWeight: 600,
    fill: t.shade('surface', L.white),
    align: 'center',
  }),
]);

const searchSpec = {
  colors: {
    background: { value: L.mist, hint: 'Page behind the photo and the wash over it' },
    surface: {
      value: L.cream,
      hint: 'Frosted search card; its lighter shade colors the search field',
    },
    text: { value: L.ink, hint: 'Search word, the search icon and the card shadow' },
    primary: { value: L.plum, hint: 'Results and the dividers between them' },
  },
  fonts: { mono: MONO },
  copy: {
    query: { label: 'Search word', value: 'growth' },
    results: {
      label: 'Result',
      value: ['is quiet and daily', 'is earned, not given', 'starts with rest'],
    },
  },
} as const satisfies ThemeSpec;

export const searchWord = themed(W, H, searchSpec, (t) => {
  const divider = t.shade('primary', 'rgba(74,58,92,0.12)');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    photo('designer-tablet', 0, 0, W, H, { filters: SOFT }),
    rect(0, 0, W, H, t.shade('background', 'rgba(236,230,242,0.3)'), { name: 'Photo wash' }),
    rect(170, 420, 740, 500, t.shade('surface', 'rgba(250,247,251,0.86)'), {
      cornerRadius: 34,
      name: 'Search card',
      ...shadow(40, 14, t.shade('text', 'rgba(42,34,51,0.25)')),
    }),
    rect(200, 450, 680, 104, t.shade('surface', L.white), {
      cornerRadius: 22,
      name: 'Search field',
    }),
    text(t.copy('query'), 236, 478, 520, {
      fontFamily: t.font('mono'),
      fontSize: 40,
      fontWeight: 400,
      fill: t.color('text'),
    }),
    icon('search', 800, 478, 48, t.color('text'), { strokeWidth: 2.4 }),
    t.list('results').map((result, index) =>
      text(result, 236, 610 + index * 100, 640, {
        fontFamily: t.font('mono'),
        fontSize: 36,
        fontWeight: 400,
        fill: t.color('primary'),
      }),
    ),
    rect(236, 690, 600, 2, divider, { name: 'Divider' }),
    rect(236, 790, 600, 2, divider, { name: 'Divider' }),
  ];
});
