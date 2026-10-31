import { type Fill, linear, radial } from '@/design';
import {
  circle,
  icon,
  POST_SIZE,
  path,
  poly,
  rect,
  rotateNodes,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const VOLT = {
  black: '#04050b',
  night: '#0a0f24',
  navy: '#0f1a45',
  blue: '#3d7bff',
  sky: '#8ab8ff',
  ice: '#e3edff',
  white: '#ffffff',
  grey: '#9aa3b8',
  mint: '#34d399',
  ink: '#0b1020',
};

export const HEADING = { label: 'Heading font', value: 'Outfit' } as const;
export const BODY = { label: 'Body font', value: 'Inter' } as const;
export const GLOW = '#13307a';
export const { width: W, height: H } = POST_SIZE;
export const CLEAR = 'rgba(0,0,0,0)';

export const backdrop = (height: number, base: string, glow: string) =>
  rect(0, 0, W, height, linear(180, base, base, glow), { name: 'Background' });

export const shine = (light: string, deep: string) => linear(90, light, deep);

export const words =
  (fontFamily: string) =>
  (
    content: string,
    y: number,
    size: number,
    fill: Fill,
    weight = 700,
    x = 0,
    width: number = W,
    align: 'left' | 'center' = 'center',
  ) =>
    text(content, x, y, width, {
      fontFamily,
      fontSize: size,
      fontWeight: weight,
      fill,
      align,
      lineHeight: 1.05,
    });

const ringArc = (
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  start: number,
  end: number,
  fill: Fill,
) => {
  const point = (radius: number, degrees: number) => {
    const radians = (degrees * Math.PI) / 180;
    return `${(cx + radius * Math.cos(radians)).toFixed(1)} ${(cy + radius * Math.sin(radians)).toFixed(1)}`;
  };
  const large = end - start > 180 ? 1 : 0;
  const data = [
    `M ${point(outer, start)}`,
    `A ${outer} ${outer} 0 ${large} 1 ${point(outer, end)}`,
    `L ${point(inner, end)}`,
    `A ${inner} ${inner} 0 ${large} 0 ${point(inner, start)}`,
    'Z',
  ].join(' ');
  return path(data, 0, 0, W, H, fill, POST_SIZE, { name: 'Arc' });
};

const speedSpec = {
  colors: {
    background: { value: VOLT.black, hint: 'Dark top of the page' },
    primary: {
      value: VOLT.blue,
      hint: 'Glow at the bottom of the page, the needle, its pivot and the speed headline',
    },
    text: { value: VOLT.white, hint: 'Gauge arcs and the words Get and more' },
  },
  fonts: { heading: HEADING },
  copy: {
    first: { label: 'First line', value: 'Get' },
    second: { label: 'Second line', value: 'more' },
    highlight: { label: 'Highlighted line', value: 'speed' },
  },
} as const satisfies ThemeSpec;

export const wifiSpeed = themed(W, H, speedSpec, (t) => {
  const say = words(t.font('heading'));
  const ink = t.color('text');
  return [
    backdrop(H, t.color('background'), t.shade('primary', GLOW)),
    ringArc(540, 640, 430, 350, 225, 315, ink),
    ringArc(540, 640, 310, 230, 225, 315, ink),
    ringArc(540, 640, 190, 110, 225, 315, ink),
    poly(
      [
        [528, 646],
        [552, 634],
        [716, 262],
        [700, 254],
      ],
      linear(90, t.color('primary'), t.shade('primary', VOLT.sky)),
      { name: 'Needle', ...shadow(20, 0, t.color('primary')) },
    ),
    circle(540, 640, 44, t.color('primary'), {
      name: 'Pivot',
      ...shadow(30, 0, t.color('primary')),
    }),
    say(t.copy('first'), 840, 112, ink, 400, 80, 800, 'left'),
    say(t.copy('second'), 960, 112, ink, 400, 80, 800, 'left'),
    say(
      t.copy('highlight'),
      1080,
      128,
      shine(t.shade('primary', VOLT.sky), t.color('primary')),
      800,
      80,
      800,
      'left',
    ),
  ];
});

const automationSpec = {
  colors: {
    background: { value: VOLT.black, hint: 'Dark top of the page' },
    primary: {
      value: VOLT.blue,
      hint: 'Page glow, the halo and glowing card in the middle, the Automation headline and the floating tile outlines',
    },
    text: {
      value: VOLT.white,
      hint: 'The power of and the sparkles icon; its grey shade colors the tagline',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    intro: { label: 'Intro', value: 'The power of' },
    title: { label: 'Title', value: 'Automation' },
    tagline: { label: 'Tagline', value: 'Let the busywork run itself.' },
  },
} as const satisfies ThemeSpec;

export const automationCard = themed(W, H, automationSpec, (t) => {
  const say = words(t.font('heading'));
  const tile = t.shade('primary', 'rgba(138,184,255,0.6)');
  return [
    backdrop(H, t.color('background'), t.shade('primary', GLOW)),
    circle(
      540,
      760,
      380,
      radial(t.shade('primary', 'rgba(61,123,255,0.45)'), t.shade('primary', CLEAR)),
      { name: 'Glow' },
    ),
    say(t.copy('intro'), 160, 66, t.color('text'), 400),
    say(t.copy('title'), 245, 108, shine(t.shade('primary', VOLT.sky), t.color('primary')), 800),
    rect(170, 520, 90, 90, t.shade('primary', CLEAR), {
      name: 'Float tile',
      cornerRadius: 20,
      stroke: tile,
      strokeWidth: 3,
      rotation: 14,
    }),
    rect(830, 930, 70, 70, t.shade('primary', CLEAR), {
      name: 'Float tile',
      cornerRadius: 16,
      stroke: tile,
      strokeWidth: 3,
      rotation: -18,
    }),
    rotateNodes(-10, 540, 760, [
      rect(
        360,
        580,
        360,
        360,
        linear(135, t.shade('primary', VOLT.ice), t.shade('primary', VOLT.sky), t.color('primary')),
        {
          name: 'Glow card',
          cornerRadius: 70,
          ...shadow(80, 0, t.shade('primary', 'rgba(61,123,255,0.9)')),
        },
      ),
      icon('sparkles', 450, 670, 180, t.color('text'), { strokeWidth: 1.6 }),
    ]),
    text(t.copy('tagline'), 0, 1120, W, {
      fontFamily: t.font('body'),
      fontSize: 38,
      fontWeight: 500,
      fill: t.shade('text', VOLT.grey),
      align: 'center',
    }),
  ];
});
