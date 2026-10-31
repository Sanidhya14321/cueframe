import { linear } from '@/design';
import {
  circle,
  group,
  icon,
  POST_SIZE,
  poly,
  rating,
  rect,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

import {
  BODY_FONT,
  DARK_BACKDROP,
  darkBackdrop,
  HEADING_FONT,
  SCRIPT_FONT,
  VOLT,
} from './volt-kit';

const { width: W, height: H } = POST_SIZE;

const ultimateSpec = {
  colors: {
    background: {
      value: VOLT.lime,
      hint: 'Page gradient (its darker shade is the bottom) and the Growth Play words',
    },
    primary: {
      value: VOLT.black,
      hint: 'The Ultimate, the label behind Growth Play and the 8 on the ball',
    },
    secondary: {
      value: '#1f1f1f',
      hint: 'Pool table felt, pocket and eight ball, in darker shades',
    },
    surface: { value: '#e6e6e1', hint: 'Table rails, in lighter and darker shades' },
    text: { value: VOLT.white, hint: 'Comment line in the pocket and the spot on the eight ball' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    kicker: { label: 'Kicker', value: 'The Ultimate' },
    label: { label: 'Label', value: 'Growth Play' },
    comment: { label: 'Comment line', value: 'Comment\nPLAY for\nthe guide' },
    ball: { label: 'Ball number', value: '8' },
  },
} as const satisfies ThemeSpec;

export const ultimateMove = themed(W, H, ultimateSpec, (t) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', VOLT.limeDeep)), {
    name: 'Background',
  }),
  text(t.copy('kicker'), 0, 140, W, {
    fontFamily: t.font('body'),
    fontSize: 76,
    fontWeight: 700,
    fill: t.color('primary'),
    align: 'center',
  }),
  rect(170, 250, 740, 140, t.color('primary'), { cornerRadius: 10, rotation: -3, name: 'Label' }),
  text(t.copy('label'), 180, 268, 720, {
    fontFamily: t.font('heading'),
    fontSize: 82,
    fontWeight: 400,
    fill: t.color('background'),
    align: 'center',
    rotation: -3,
  }),
  poly(
    [
      [0, 900],
      [540, 700],
      [1080, 900],
      [1080, 1350],
      [0, 1350],
    ],
    linear(180, t.color('secondary'), t.shade('secondary', VOLT.black)),
    { name: 'Table felt' },
  ),
  poly(
    [
      [0, 780],
      [540, 580],
      [540, 700],
      [0, 900],
    ],
    linear(180, t.color('surface'), t.shade('surface', '#8d8d88')),
    { name: 'Left rail' },
  ),
  poly(
    [
      [540, 580],
      [1080, 780],
      [1080, 900],
      [540, 700],
    ],
    linear(180, t.shade('surface', '#d4d4cf'), t.shade('surface', '#7a7a75')),
    { name: 'Right rail' },
  ),
  circle(540, 720, 160, t.shade('secondary', '#050505'), {
    name: 'Pocket',
    stroke: t.shade('secondary', VOLT.charcoal),
    strokeWidth: 10,
  }),
  text(t.copy('comment'), 390, 628, 300, {
    fontFamily: t.font('body'),
    fontSize: 34,
    fontWeight: 700,
    fill: t.color('text'),
    align: 'center',
    lineHeight: 1.2,
  }),
  circle(
    540,
    1130,
    96,
    linear(160, t.shade('secondary', '#3b3b3b'), t.shade('secondary', '#000000')),
    {
      name: 'Eight ball',
      ...shadow(30, 14, 'rgba(0,0,0,0.6)'),
    },
  ),
  circle(540, 1118, 44, t.color('text'), { name: 'Ball spot' }),
  text(t.copy('ball'), 500, 1080, 80, {
    fontFamily: t.font('heading'),
    fontSize: 60,
    fontWeight: 400,
    fill: t.color('primary'),
    align: 'center',
  }),
]);

const folder = (x: number, y: number, width: number, fill: string) => {
  const height = width * 0.7;
  return group(
    rect(x, y, width * 0.42, width * 0.16, fill, { cornerRadius: width * 0.04, name: 'Tab' }),
    rect(x, y + width * 0.08, width, height, fill, {
      cornerRadius: width * 0.05,
      name: 'Folder',
      ...shadow(30, 12, 'rgba(0,0,0,0.18)'),
    }),
  );
};

const seoSpec = {
  colors: {
    background: { value: VOLT.paper, hint: 'Page' },
    primary: {
      value: VOLT.lime,
      hint: 'Center folder and two corner folders; its darker shade colors the other two corner folders',
    },
    text: { value: VOLT.black, hint: 'Headline, swipe line and the cursor outline' },
    surface: { value: VOLT.white, hint: 'Cursor' },
  },
  fonts: {
    body: BODY_FONT,
    heading: HEADING_FONT,
    mono: { label: 'Mono font', value: 'Space Mono' },
  },
  copy: {
    kicker: { label: 'Kicker', value: '3 Tips for' },
    title: { label: 'Title', value: 'SEO Growth' },
    swipe: { label: 'Swipe line', value: 'Swipe_Through' },
  },
} as const satisfies ThemeSpec;

export const seoFolders = themed(W, H, seoSpec, (t) => {
  const lime = t.color('primary');
  const deep = t.shade('primary', VOLT.limeDeep);
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    folder(40, 60, 220, lime),
    folder(840, 40, 200, deep),
    folder(30, 1080, 200, deep),
    folder(840, 1060, 210, lime),
    folder(230, 380, 620, lime),
    text(t.copy('kicker'), 230, 560, 620, {
      fontFamily: t.font('body'),
      fontSize: 64,
      fontWeight: 600,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('title'), 230, 650, 620, {
      fontFamily: t.font('heading'),
      fontSize: 74,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('swipe'), 0, 900, W, {
      fontFamily: t.font('mono'),
      fontSize: 34,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
    }),
    poly(
      [
        [760, 760],
        [760, 900],
        [792, 870],
        [816, 924],
        [840, 912],
        [816, 860],
        [860, 856],
      ],
      t.color('surface'),
      { name: 'Cursor', stroke: t.color('text'), strokeWidth: 5 },
    ),
  ];
});

const clientSpec = {
  colors: {
    background: DARK_BACKDROP,
    accent: { value: VOLT.lime, hint: 'what, Our, the quote mark and the reviewer' },
    text: { value: VOLT.white, hint: 'Clients Say, the quote and the stars' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT, script: SCRIPT_FONT },
  copy: {
    script: { label: 'Script word', value: 'what' },
    title: { label: 'Title', value: 'Our' },
    subtitle: { label: 'Second title line', value: 'Clients Say' },
    quote: {
      label: 'Quote',
      value:
        'Working with this crew changed how we launch. They mapped our audience, sharpened our message and tripled our sign-ups in a single season.',
    },
    reviewer: { label: 'Reviewer', value: 'Mara Lindqvist, Ops Lead at Northpeak' },
  },
} as const satisfies ThemeSpec;

export const clientSays = themed(W, H, clientSpec, (t) => [
  darkBackdrop(t.color('background'), t.shade('background', VOLT.black)),
  text(t.copy('script'), 120, 130, 300, {
    fontFamily: t.font('script'),
    fontSize: 72,
    fontWeight: 400,
    fill: t.color('accent'),
    rotation: -8,
  }),
  text(t.copy('title'), 330, 120, 500, {
    fontFamily: t.font('heading'),
    fontSize: 104,
    fontWeight: 400,
    fill: t.color('accent'),
  }),
  text(t.copy('subtitle'), 0, 250, W, {
    fontFamily: t.font('heading'),
    fontSize: 104,
    fontWeight: 400,
    fill: t.color('text'),
    align: 'center',
  }),
  icon('quote', 110, 470, 110, t.color('accent'), { strokeWidth: 2.4 }),
  text(t.copy('quote'), 260, 470, 720, {
    fontFamily: t.font('body'),
    fontSize: 40,
    fontWeight: 500,
    fill: t.color('text'),
    lineHeight: 1.45,
  }),
  text(t.copy('reviewer'), 260, 860, 760, {
    fontFamily: t.font('body'),
    fontSize: 32,
    fontWeight: 700,
    fill: t.color('accent'),
  }),
  rating(380, 1080, 64, 5, t.color('text'), 0.35),
]);
