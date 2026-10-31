import { linear } from '@/design';
import {
  circle,
  ellipse,
  icon,
  laptop,
  POST_SIZE,
  paint,
  photo,
  pill,
  poly,
  rect,
  rotateNodes,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const VG = {
  black: '#0c0c0c',
  charcoal: '#1c1c1c',
  orange: '#ff6b1a',
  orangeLight: '#ff9a52',
  orangeDeep: '#d9480b',
  paper: '#f4f1ec',
  grey: '#8a8580',
  white: '#ffffff',
};

export const MAIN = { label: 'Main font', value: 'Poppins' } as const;
export const DISPLAY = { label: 'Display font', value: 'Anton' } as const;
export const SCRIPT = { label: 'Script font', value: 'Satisfy' } as const;
export const W = POST_SIZE.width;
export const H = POST_SIZE.height;

type TextStyle = Parameters<typeof text>[4];

export const head =
  (fontFamily: string) =>
  (
    content: string,
    x: number,
    y: number,
    width: number,
    size: number,
    fill: string,
    weight = 700,
    style: TextStyle = {},
  ) =>
    text(content, x, y, width, {
      fontFamily,
      fontSize: size,
      fontWeight: weight,
      fill,
      lineHeight: 1.15,
      ...style,
    });

export const display =
  (fontFamily: string) =>
  (
    content: string,
    x: number,
    y: number,
    width: number,
    size: number,
    fill: string,
    style: TextStyle = {},
  ) =>
    text(content, x, y, width, {
      fontFamily,
      fontSize: size,
      fontWeight: 400,
      fill,
      lineHeight: 1,
      ...style,
    });

export const copy =
  (fontFamily: string) =>
  (
    content: string,
    x: number,
    y: number,
    width: number,
    size: number,
    fill: string,
    style: TextStyle = {},
  ) =>
    text(content, x, y, width, {
      fontFamily,
      fontSize: size,
      fontWeight: 400,
      fill,
      lineHeight: 1.4,
      ...style,
    });

export const button = (
  label: string,
  x: number,
  y: number,
  fill: string,
  color: string,
  fontFamily: string,
) => pill(label, x, y, { fill, color, fontSize: 26, fontFamily, fontWeight: 600 });

const recordSpec = {
  colors: {
    background: { value: VG.black, hint: 'Page and the column labels and numbers' },
    primary: {
      value: VG.orange,
      hint: 'Third Quarter, the column bottoms and pointers; its lighter shade colors the column tops',
    },
    text: { value: VG.white, hint: 'Track Record; its shade colors the footer line' },
  },
  fonts: { main: MAIN, display: DISPLAY },
  copy: {
    kicker: { label: 'Kicker', value: 'Third Quarter' },
    title: { label: 'Title', value: 'Track Record' },
    labels: {
      label: 'Stat label',
      value: ['Return on\nad spend', 'Clients\nreached', 'New\nleads'],
    },
    values: { label: 'Stat value', value: ['3x', '128', '6+'] },
    footer: { label: 'Footer', value: 'Q3 results  ·  vantor.group' },
  },
} as const satisfies ThemeSpec;

export const trackRecord = themed(W, H, recordSpec, (t) => {
  const heading = head(t.font('main'));
  const body = copy(t.font('main'));
  const values = t.list('values');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    heading(t.copy('kicker'), 90, 110, 900, 78, t.color('primary'), 700),
    heading(t.copy('title'), 90, 200, 900, 78, t.color('text'), 700),
    t.list('labels').map((label, index) => {
      const x = 90 + index * 315;
      return [
        rect(
          x,
          380,
          270,
          760,
          linear(180, t.shade('primary', VG.orangeLight), t.color('primary')),
          { cornerRadius: 26, name: 'Record column' },
        ),
        poly(
          [
            [x + 100, 1138],
            [x + 170, 1138],
            [x + 135, 1186],
          ],
          t.color('primary'),
          { name: 'Column pointer' },
        ),
        body(label, x, 410, 270, 28, t.color('background'), { align: 'center', fontWeight: 600 }),
        display(t.font('display'))(
          values[index] ?? '',
          x + 40,
          1100,
          560,
          200,
          t.color('background'),
          {
            rotation: -90,
            align: 'center',
          },
        ),
      ];
    }),
    body(t.copy('footer'), 90, 1240, 900, 28, t.shade('text', VG.grey)),
  ];
});

const tipsSpec = {
  colors: {
    background: { value: VG.paper, hint: 'Page' },
    primary: { value: VG.orange, hint: 'The big 3, the SUCCESS label box and the arrow' },
    surface: {
      value: VG.white,
      hint: 'SUCCESS and the coffee saucer; its shade colors the laptop base',
    },
    text: {
      value: VG.black,
      hint: 'TIPS TO, LEADERSHIP and the swipe line; its shades color the laptop and the coffee',
    },
  },
  fonts: { display: DISPLAY, main: MAIN },
  copy: {
    number: { label: 'Number', value: '3' },
    title: { label: 'Title', value: 'TIPS TO' },
    subtitle: { label: 'Second title line', value: 'LEADERSHIP' },
    label: { label: 'Label', value: 'SUCCESS' },
    swipe: { label: 'Swipe line', value: 'Swipe for all three' },
  },
} as const satisfies ThemeSpec;

export const leadershipTips = themed(W, H, tipsSpec, (t) => {
  const big = display(t.font('display'));
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    big(t.copy('number'), 110, 100, 200, 300, t.color('primary')),
    big(t.copy('title'), 280, 110, 700, 150, t.color('text')),
    big(t.copy('subtitle'), 280, 265, 760, 150, t.color('text')),
    rect(280, 440, 430, 130, t.color('primary'), { cornerRadius: 14, name: 'Label' }),
    big(t.copy('label'), 280, 450, 430, 110, t.color('surface'), { align: 'center' }),
    paint(
      [laptop(200, 690, 680, { photo: 'laptop-analytics', body: t.shade('text', VG.charcoal) })],
      { '#cbd5e1': t.shade('surface', '#cbd5e1') },
    ),
    circle(960, 1236, 54, t.color('surface'), {
      name: 'Saucer',
      ...shadow(20, 8, 'rgba(0,0,0,0.18)'),
    }),
    circle(960, 1236, 36, t.shade('text', '#3b2416'), { name: 'Coffee' }),
    copy(t.font('main'))(t.copy('swipe'), 90, 1220, 500, 30, t.color('text'), { fontWeight: 600 }),
    icon('arrow-right', 410, 1222, 36, t.color('primary'), { strokeWidth: 2.6 }),
  ];
});

const callSpec = {
  colors: {
    background: {
      value: VG.orangeDeep,
      hint: 'Bottom of the page gradient; its lighter shade colors the top',
    },
    surface: { value: VG.white, hint: 'Call cards and the phone and decline icons' },
    primary: {
      value: VG.black,
      hint: 'Caller circles, decline buttons, caller names and the Book a Demo button; its shade colors Incoming now',
    },
    accent: { value: VG.orange, hint: 'Answer buttons' },
    text: { value: VG.white, hint: 'Headline, subline, the closing lines and the button label' },
  },
  fonts: { main: MAIN },
  copy: {
    title: { label: 'Headline', value: 'Answer the Call.' },
    subtitle: { label: 'Subline', value: 'Every missed call is a missed client.' },
    calls: { label: 'Caller', value: ['Growth call', 'Revenue call', 'Partner call'] },
    status: { label: 'Call status', value: 'Incoming now' },
    closing: { label: 'Closing line', value: 'Pick up faster.\nClose bigger.' },
    button: { label: 'Button', value: 'Book a Demo' },
  },
} as const satisfies ThemeSpec;

export const answerCall = themed(W, H, callSpec, (t) => {
  const heading = head(t.font('main'));
  const body = copy(t.font('main'));
  const ink = t.color('primary');
  const glyph = t.color('surface');
  return [
    rect(0, 0, W, H, linear(170, t.shade('background', VG.orangeLight), t.color('background')), {
      name: 'Background',
    }),
    heading(t.copy('title'), 90, 100, 900, 80, t.color('text'), 800),
    body(t.copy('subtitle'), 90, 210, 900, 32, t.color('text')),
    t.list('calls').map((label, index) => {
      const y = 320 + index * 150;
      const x = 90 + index * 40;
      return [
        rect(x, y, 640, 124, t.color('surface'), {
          cornerRadius: 28,
          name: 'Call card',
          ...shadow(30, 12, 'rgba(0,0,0,0.18)'),
        }),
        circle(x + 62, y + 62, 38, ink),
        icon('phone', x + 42, y + 42, 40, glyph, { strokeWidth: 2.2 }),
        heading(label, x + 120, y + 24, 300, 30, ink, 700),
        body(t.copy('status'), x + 120, y + 64, 300, 24, t.shade('primary', VG.grey)),
        circle(x + 470, y + 62, 34, ink),
        icon('x', x + 452, y + 44, 36, glyph, { strokeWidth: 2.6 }),
        circle(x + 562, y + 62, 34, t.color('accent')),
        icon('phone', x + 544, y + 44, 36, glyph, { strokeWidth: 2.4 }),
      ];
    }),
    heading(t.copy('closing'), 90, 860, 520, 58, t.color('text'), 800),
    button(t.copy('button'), 90, 1070, ink, t.color('text'), t.font('main')),
    photo('man-portrait-2', 630, 800, 370, 460, { cornerRadius: 40 }),
  ];
});

const TICKS = [-60, -30, 0, 30, 60];

const powerSpec = {
  colors: {
    background: {
      value: VG.orangeDeep,
      hint: 'Bottom of the page gradient; its lighter shade colors the top',
    },
    surface: {
      value: VG.white,
      hint: 'Cup and handle; its shades color the saucer and the crema',
    },
    primary: {
      value: VG.black,
      hint: 'VANTOR GROUP; its shades color the coffee and the saucer shadow',
    },
    text: { value: VG.white, hint: 'Gauge ticks, E and F, Power Full and the tagline' },
  },
  fonts: { display: DISPLAY, main: MAIN },
  copy: {
    empty: { label: 'Empty label', value: 'E' },
    full: { label: 'Full label', value: 'F' },
    title: { label: 'Title', value: 'Power Full' },
    tagline: { label: 'Tagline', value: 'Fuel your week with focused work.' },
    brand: { label: 'Brand', value: 'VANTOR GROUP' },
  },
} as const satisfies ThemeSpec;

export const powerFull = themed(W, H, powerSpec, (t) => {
  const big = display(t.font('display'));
  const body = copy(t.font('main'));
  return [
    rect(0, 0, W, H, linear(180, t.shade('background', VG.orangeLight), t.color('background')), {
      name: 'Background',
    }),
    TICKS.map((angle) =>
      rotateNodes(angle, 540, 600, [
        rect(530, 240, 20, angle === 0 ? 90 : 64, t.color('text'), {
          cornerRadius: 10,
          name: 'Tick',
        }),
      ]),
    ),
    big(t.copy('empty'), 130, 560, 80, 64, t.color('text'), { align: 'center' }),
    big(t.copy('full'), 870, 560, 80, 64, t.color('text'), { align: 'center' }),
    circle(540, 600, 200, t.shade('primary', 'rgba(0,0,0,0.12)'), { name: 'Saucer shadow' }),
    circle(540, 600, 190, t.shade('surface', '#f1ece6'), { name: 'Saucer' }),
    rect(650, 572, 120, 56, t.color('surface'), { cornerRadius: 28, name: 'Cup handle' }),
    circle(540, 600, 140, t.color('surface'), {
      name: 'Cup',
      ...shadow(24, 10, 'rgba(0,0,0,0.2)'),
    }),
    circle(540, 600, 116, t.shade('primary', '#2e1b10'), { name: 'Coffee' }),
    ellipse(470, 540, 90, 40, t.shade('surface', 'rgba(255,255,255,0.14)'), {
      name: 'Crema',
      rotation: -20,
    }),
    body(t.copy('title'), 0, 880, W, 54, t.color('text'), { align: 'center', letterSpacing: 10 }),
    body(t.copy('tagline'), 0, 970, W, 30, t.color('text'), { align: 'center' }),
    body(t.copy('brand'), 0, 1230, W, 26, t.color('primary'), {
      align: 'center',
      letterSpacing: 8,
      fontWeight: 700,
    }),
  ];
});
