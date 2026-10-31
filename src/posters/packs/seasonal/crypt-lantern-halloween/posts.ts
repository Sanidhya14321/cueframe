import { linear } from '@/design';
import {
  circle,
  ellipse,
  icon,
  line,
  POST_SIZE,
  pill,
  poly,
  rect,
  rotateNodes,
  shadow,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY, bat, COND, CRYPT, HANDLE, SPOOKY } from './palette';

const { width: W, height: H } = POST_SIZE;

const happySpec = {
  colors: {
    background: { value: CRYPT.mustard, hint: 'Page and the top knob on each TV' },
    text: {
      value: CRYPT.ink,
      hint: 'HAPPY HALLOWEEN, TV cabinets, antennas, the rule, handle and date',
    },
    surface: { value: CRYPT.night, hint: 'TV screens' },
    secondary: { value: CRYPT.bone, hint: 'Moon, skull and ghost on the screens' },
    accent: { value: CRYPT.stone, hint: 'Lower TV knob and speaker grille' },
  },
  fonts: { heading: COND, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'HAPPY' },
    title: { label: 'Title', value: 'HAL\nLOW\nEEN' },
    handle: HANDLE,
    date: { label: 'Date', value: 'OCT 31' },
  },
} as const satisfies ThemeSpec;

const tv = (t: Theme<typeof happySpec>, y: number, glyph: 'ghost' | 'skull' | 'moon') => [
  rect(600, y, 400, 300, t.color('text'), { cornerRadius: 34, name: 'TV body' }),
  rect(630, y + 30, 280, 240, t.color('surface'), { cornerRadius: 46, name: 'TV screen' }),
  icon(glyph, 700, y + 80, 140, t.color('secondary'), { strokeWidth: 1.6 }),
  circle(955, y + 90, 18, t.color('background')),
  circle(955, y + 150, 18, t.color('accent')),
  rect(938, y + 200, 34, 60, t.color('accent'), { cornerRadius: 8, name: 'Speaker' }),
];

export const happyHalloween = themed(W, H, happySpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  text(t.copy('kicker'), 70, 130, 500, {
    fontFamily: t.font('heading'),
    fontSize: 64,
    fontWeight: 400,
    fill: t.color('text'),
    letterSpacing: 22,
  }),
  text(t.copy('title'), 64, 210, 540, {
    fontFamily: t.font('heading'),
    fontSize: 320,
    fontWeight: 400,
    fill: t.color('text'),
    lineHeight: 0.88,
  }),
  line(720, 60, 120, t.color('text'), 6, { rotation: 60, name: 'Antenna' }),
  line(880, 60, 120, t.color('text'), 6, { rotation: 120, name: 'Antenna' }),
  tv(t, 170, 'moon'),
  tv(t, 490, 'skull'),
  tv(t, 810, 'ghost'),
  rect(70, 1180, 940, 4, t.color('text'), { name: 'Rule' }),
  text(t.copy('handle'), 70, 1220, 500, {
    fontFamily: t.font('body'),
    fontSize: 34,
    fontWeight: 600,
    fill: t.color('text'),
  }),
  text(t.copy('date'), 510, 1212, 500, {
    fontFamily: t.font('heading'),
    fontSize: 52,
    fontWeight: 400,
    fill: t.color('text'),
    align: 'right',
    letterSpacing: 6,
  }),
]);

const trickSpec = {
  colors: {
    background: { value: CRYPT.teal, hint: 'Night sky gradient' },
    surface: { value: CRYPT.bone, hint: 'Moon and its halo, the tilted card and the handle' },
    text: { value: CRYPT.ink, hint: 'Bats, TRICK OR TREAT and the code label' },
    primary: { value: CRYPT.blood, hint: 'Card rule and the offer line' },
    accent: { value: CRYPT.mustard, hint: 'Code pill' },
  },
  fonts: { spooky: SPOOKY, heading: COND, body: BODY },
  copy: {
    handle: HANDLE,
    title: { label: 'Title', value: 'TRICK\nOR\nTREAT' },
    offer: { label: 'Offer', value: 'SAVE 15% OFF\nSITEWIDE' },
    code: { label: 'Code', value: 'CODE  BOO15' },
  },
} as const satisfies ThemeSpec;

export const trickOrTreat = themed(W, H, trickSpec, (t) => [
  rect(0, 0, W, H, linear(160, t.color('background'), t.shade('background', CRYPT.deep)), {
    name: 'Background',
  }),
  circle(880, 210, 110, t.shade('surface', 'rgba(241,232,212,0.16)')),
  circle(880, 210, 70, t.shade('surface', 'rgba(241,232,212,0.9)')),
  bat(120, 180, 150, t.color('text')),
  bat(260, 120, 90, t.color('text')),
  text(t.copy('handle'), 0, 80, W, {
    fontFamily: t.font('body'),
    fontSize: 32,
    fontWeight: 500,
    fill: t.color('surface'),
    align: 'center',
  }),
  rotateNodes(-6, 540, 640, [
    rect(290, 320, 500, 640, t.color('surface'), {
      cornerRadius: 18,
      name: 'Card',
      ...shadow(40, 20, 'rgba(0,0,0,0.45)'),
    }),
    text(t.copy('title'), 290, 380, 500, {
      fontFamily: t.font('spooky'),
      fontSize: 130,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1,
    }),
    rect(390, 800, 300, 4, t.color('primary'), { name: 'Card rule' }),
    text(t.copy('offer'), 290, 830, 500, {
      fontFamily: t.font('body'),
      fontSize: 34,
      fontWeight: 700,
      fill: t.color('primary'),
      align: 'center',
      lineHeight: 1.25,
    }),
  ]),
  pill(t.copy('code'), 380, 1110, {
    width: 320,
    fill: t.color('accent'),
    color: t.color('text'),
    fontSize: 36,
    fontFamily: t.font('heading'),
    fontWeight: 400,
    letterSpacing: 4,
  }),
]);

const coffinSpec = {
  colors: {
    background: {
      value: '#16454a',
      hint: 'Night sky gradient; its dark shade is the hill silhouette',
    },
    primary: {
      value: CRYPT.blood,
      hint: 'Coffin and the MARKET GOALS headline; its dark shade colors the coffin lid',
    },
    text: { value: CRYPT.bone, hint: 'Date on the coffin, ACHIEVE YOUR and the webinar details' },
  },
  fonts: { spooky: SPOOKY, heading: COND, body: BODY },
  copy: {
    month: { label: 'Month', value: 'OCT' },
    day: { label: 'Day', value: '12' },
    headline: { label: 'Headline', value: 'ACHIEVE YOUR' },
    highlight: { label: 'Highlighted headline', value: 'MARKET GOALS' },
    details: { label: 'Details', value: 'Live Webinar  |  Oct 12 at 8 PM ET' },
  },
} as const satisfies ThemeSpec;

export const coffinWebinar = themed(W, H, coffinSpec, (t) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', CRYPT.deep)), {
    name: 'Background',
  }),
  poly(
    [
      [0, 820],
      [260, 780],
      [560, 820],
      [820, 770],
      [1080, 800],
      [1080, 1350],
      [0, 1350],
    ],
    t.shade('background', 'rgba(0,0,0,0.35)'),
    { name: 'Hill' },
  ),
  rotateNodes(-8, 540, 420, [
    poly(
      [
        [440, 90],
        [640, 90],
        [770, 240],
        [690, 740],
        [390, 740],
        [310, 240],
      ],
      t.color('primary'),
      { name: 'Coffin' },
    ),
    poly(
      [
        [458, 120],
        [622, 120],
        [736, 248],
        [664, 710],
        [416, 710],
        [344, 248],
      ],
      t.shade('primary', CRYPT.wine),
      { name: 'Coffin lid' },
    ),
    text(t.copy('month'), 340, 230, 400, {
      fontFamily: t.font('heading'),
      fontSize: 90,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
      letterSpacing: 8,
    }),
    text(t.copy('day'), 340, 320, 400, {
      fontFamily: t.font('heading'),
      fontSize: 280,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
    }),
  ]),
  text(t.copy('headline'), 0, 830, W, {
    fontFamily: t.font('spooky'),
    fontSize: 116,
    fontWeight: 400,
    fill: t.color('text'),
    align: 'center',
  }),
  text(t.copy('highlight'), 0, 960, W, {
    fontFamily: t.font('spooky'),
    fontSize: 116,
    fontWeight: 400,
    fill: t.color('primary'),
    align: 'center',
  }),
  text(t.copy('details'), 0, 1150, W, {
    fontFamily: t.font('body'),
    fontSize: 36,
    fontWeight: 600,
    fill: t.color('text'),
    align: 'center',
  }),
]);

const tombSpec = {
  colors: {
    background: {
      value: '#1d4a4e',
      hint: 'Night sky gradient; its darkest shade is the ground',
    },
    surface: { value: CRYPT.stone, hint: 'Tombstone; its darker shade is the stone edge' },
    accent: { value: CRYPT.bone, hint: 'Moon' },
    text: {
      value: CRYPT.ink,
      hint: 'Bat, quote mark and the quote; its shade colors the author',
    },
  },
  fonts: { heading: COND, body: BODY },
  copy: {
    quote: {
      label: 'Quote',
      value: "GOOD MARKETING\nISN'T ABOUT WHAT\nYOU SELL. IT'S THE\nSTORY YOU TELL.",
    },
    author: { label: 'Author', value: '- MAREN VOSS' },
  },
} as const satisfies ThemeSpec;

export const tombstoneQuote = themed(W, H, tombSpec, (t) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', CRYPT.deep)), {
    name: 'Background',
  }),
  circle(880, 190, 90, t.color('accent'), { opacity: 0.9 }),
  bat(110, 150, 120, t.color('text')),
  ellipse(220, 260, 640, 640, t.shade('surface', '#6f7a78'), { name: 'Stone shade' }),
  rect(220, 580, 640, 600, t.shade('surface', '#6f7a78'), { name: 'Stone shade' }),
  ellipse(240, 280, 600, 600, t.color('surface'), { name: 'Stone top' }),
  rect(240, 580, 600, 600, t.color('surface'), { name: 'Stone body' }),
  icon('quote', 500, 400, 80, t.color('text'), { strokeWidth: 2.4 }),
  text(t.copy('quote'), 260, 520, 560, {
    fontFamily: t.font('heading'),
    fontSize: 70,
    fontWeight: 400,
    fill: t.color('text'),
    align: 'center',
    lineHeight: 1.08,
  }),
  text(t.copy('author'), 260, 860, 560, {
    fontFamily: t.font('body'),
    fontSize: 30,
    fontWeight: 600,
    fill: t.shade('text', CRYPT.night),
    align: 'center',
    letterSpacing: 3,
  }),
  poly(
    [
      [0, 1120],
      [300, 1080],
      [700, 1110],
      [1080, 1070],
      [1080, 1350],
      [0, 1350],
    ],
    t.shade('background', '#051012'),
    { name: 'Ground' },
  ),
]);
