import { linear } from '@/design';
import {
  avatar,
  circle,
  icon,
  POST_SIZE,
  rating,
  rect,
  rotateNodes,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const MINT = {
  black: '#0c0d0d',
  coal: '#191c1b',
  green: '#10b981',
  light: '#34d399',
  deep: '#047857',
  soft: '#6ee7b7',
  paper: '#f3f6f5',
  white: '#ffffff',
  ink: '#0c0d0d',
  grey: '#9ca3a0',
  clear: 'rgba(0,0,0,0)',
};

export const { width: W, height: H } = POST_SIZE;

export const FONT = { label: 'Font', value: 'Manrope' } as const;
export const HANDLE = { label: 'Handle', value: 'brightlane.studio' } as const;

export const writer =
  (fontFamily: string) =>
  (
    content: string,
    x: number,
    y: number,
    width: number,
    size: number,
    fill: string,
    weight = 500,
    align: 'left' | 'center' | 'right' = 'left',
  ) =>
    text(content, x, y, width, {
      fontFamily,
      fontSize: size,
      fontWeight: weight,
      fill,
      align,
      lineHeight: 1.15,
    });

export const brandLine = (label: string, y: number, color: string, fontFamily: string) =>
  writer(fontFamily)(label, 0, y, W, 28, color, 600, 'center');

const BARS = [
  { x: 300, face: 'man-portrait-1' as const, right: true },
  { x: 200, face: 'woman-portrait-4' as const, right: false },
  { x: 320, face: 'woman-portrait-1' as const, right: false },
];

const starReviewsSpec = {
  colors: {
    background: {
      value: MINT.light,
      hint: 'Page gradient; its darker shade is the bottom of the page and tints the bar shadows',
    },
    surface: { value: MINT.white, hint: 'Rating bars and the photo rings' },
    primary: { value: MINT.green, hint: 'Stars on the rating bars' },
    secondary: { value: MINT.black, hint: 'Box behind Star Client' },
    text: { value: MINT.white, hint: 'Big number, Star Client, Experiences and the handle' },
  },
  fonts: { body: FONT },
  copy: {
    number: { label: 'Rating', value: '5' },
    label: { label: 'Boxed label', value: 'Star Client' },
    title: { label: 'Title', value: 'Experiences' },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const starReviews = themed(W, H, starReviewsSpec, (t) => {
  const say = writer(t.font('body'));
  return [
    rect(0, 0, W, H, linear(160, t.color('background'), t.shade('background', MINT.deep)), {
      name: 'Background',
    }),
    BARS.map((bar, index) => {
      const y = 210 + index * 150;
      return [
        rect(bar.x, y, 560, 104, t.color('surface'), {
          name: 'Rating bar',
          cornerRadius: 52,
          ...shadow(30, 12, t.shade('background', 'rgba(4,120,87,0.45)')),
        }),
        rating(bar.x + (bar.right ? 50 : 140), y + 30, 44, 5, t.color('primary'), 0.3),
        avatar(bar.face, bar.right ? bar.x + 560 : bar.x, y + 52, 64, t.color('surface')),
      ];
    }),
    say(t.copy('number'), 120, 720, 300, 380, t.color('text'), 800),
    rect(400, 800, 420, 86, t.color('secondary'), { name: 'Label box', cornerRadius: 6 }),
    say(t.copy('label'), 400, 810, 420, 56, t.color('text'), 700, 'center'),
    say(t.copy('title'), 410, 910, 560, 62, t.color('text'), 700),
    brandLine(t.copy('handle'), 1230, t.shade('text', 'rgba(255,255,255,0.8)'), t.font('body')),
  ];
});

const webinarNoteSpec = {
  colors: {
    background: {
      value: MINT.black,
      hint: 'Page and the handwriting on the note; its lighter shade colors the side cards',
    },
    surface: { value: '#f6f5f2', hint: 'Pinned note' },
    primary: {
      value: MINT.green,
      hint: 'ONLINE WEBINAR, the pin and the icons; its light shade is the pin shine',
    },
    text: { value: MINT.white, hint: 'Marketing, the date and the place' },
  },
  fonts: { body: FONT, note: { label: 'Note font', value: 'Permanent Marker' } },
  copy: {
    kicker: { label: 'Kicker', value: 'Marketing' },
    title: { label: 'Title', value: 'ONLINE' },
    subtitle: { label: 'Second title line', value: 'WEBINAR' },
    note: { label: 'Note', value: 'Brand\nGrowth\nLab' },
    date: { label: 'Date', value: 'May 14, 2027' },
    place: { label: 'Place', value: 'Austin, TX' },
  },
} as const satisfies ThemeSpec;

export const webinarNote = themed(W, H, webinarNoteSpec, (t) => {
  const say = writer(t.font('body'));
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    rect(0, 640, 130, 340, t.shade('background', MINT.coal), {
      name: 'Side card',
      cornerRadius: 16,
    }),
    rect(950, 640, 130, 340, t.shade('background', MINT.coal), {
      name: 'Side card',
      cornerRadius: 16,
    }),
    say(t.copy('kicker'), 0, 120, W, 56, t.color('text'), 400, 'center'),
    say(t.copy('title'), 0, 190, W, 136, t.color('primary'), 800, 'center'),
    say(t.copy('subtitle'), 0, 335, W, 136, t.color('primary'), 800, 'center'),
    rotateNodes(-4, 540, 800, [
      rect(290, 560, 500, 500, t.color('surface'), {
        name: 'Pinned note',
        ...shadow(40, 18, 'rgba(0,0,0,0.6)'),
      }),
      text(t.copy('note'), 290, 650, 500, {
        fontFamily: t.font('note'),
        fontSize: 96,
        fontWeight: 400,
        fill: t.color('background'),
        align: 'center',
        lineHeight: 1.05,
      }),
    ]),
    circle(530, 580, 32, t.color('primary'), {
      name: 'Pin',
      ...shadow(12, 6, 'rgba(0,0,0,0.5)'),
    }),
    circle(522, 572, 10, t.shade('primary', MINT.soft), { name: 'Pin shine' }),
    icon('calendar-days', 210, 1170, 46, t.color('primary')),
    say(t.copy('date'), 270, 1176, 300, 34, t.color('text'), 500),
    icon('map-pin', 620, 1170, 46, t.color('primary')),
    say(t.copy('place'), 680, 1176, 300, 34, t.color('text'), 500),
  ];
});
