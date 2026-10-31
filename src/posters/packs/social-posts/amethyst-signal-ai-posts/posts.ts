import { type Fill, linear, radial } from '@/design';
import {
  avatar,
  type ColorKey,
  circle,
  ellipse,
  icon,
  type Nodes,
  POST_SIZE,
  path,
  pill,
  poly,
  rect,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const VIO = {
  night: '#07040f',
  ink: '#110b22',
  plum: '#1d1238',
  violet: '#8b5cf6',
  bright: '#a78bfa',
  lilac: '#ddd6fe',
  white: '#ffffff',
  muted: 'rgba(255,255,255,0.7)',
};

export const HEADING = { label: 'Heading font', value: 'Plus Jakarta Sans' } as const;
export const BODY = { label: 'Body font', value: 'Manrope' } as const;
export const BRAND = { label: 'Brand name', value: 'LUMEN STACK' } as const;
export const { width: W, height: H } = POST_SIZE;

export interface Ink<K extends ColorKey> {
  color: (key: K) => string;
  shade: (key: K, exact: string) => string;
}

export const brandMark = (
  label: string,
  fontFamily: string,
  x: number,
  y: number,
  width: number,
  color: string,
  align: 'left' | 'center' | 'right' = 'center',
) =>
  text(label, x, y, width, {
    fontFamily,
    fontSize: 28,
    fontWeight: 800,
    fill: color,
    align,
    letterSpacing: 3,
  });

export const violetGlow = (
  ink: Ink<'primary'>,
  x: number,
  y: number,
  width: number,
  height: number,
  alpha = 0.4,
) =>
  ellipse(
    x,
    y,
    width,
    height,
    radial(
      ink.shade('primary', `rgba(139,92,246,${alpha})`),
      ink.shade('primary', `rgba(139,92,246,${alpha * 0.3})`),
      ink.shade('primary', 'rgba(139,92,246,0)'),
      ink.shade('primary', 'rgba(139,92,246,0)'),
    ),
    { name: 'Glow' },
  );

export const darkBg = (ink: Ink<'background'>, height: number): Nodes[] => [
  rect(
    0,
    0,
    W,
    height,
    linear(
      180,
      ink.shade('background', VIO.plum),
      ink.color('background'),
      ink.color('background'),
    ),
    { name: 'Background' },
  ),
];

export const primaryFill = (ink: Ink<'primary'>, angle = 90) =>
  linear(angle, ink.color('primary'), ink.shade('primary', VIO.violet));

export const button = (
  ink: Ink<'primary' | 'text'>,
  label: string,
  fontFamily: string,
  x: number,
  y: number,
  width: number,
  filled: boolean,
) => [
  rect(x, y, width, 70, filled ? primaryFill(ink) : ink.shade('text', 'rgba(255,255,255,0.03)'), {
    name: `${label} button`,
    cornerRadius: 35,
    stroke: ink.color('primary'),
    strokeWidth: filled ? 0 : 2,
  }),
  text(label, x, y + 20, width, {
    fontFamily,
    fontSize: 26,
    fontWeight: 700,
    fill: ink.color('text'),
    align: 'center',
  }),
];

export const ringArc = (
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
  return path(data, 0, 0, W, H, fill, { width: W, height: H }, { name: 'Arc' });
};

const DARK_COLORS = {
  background: { value: VIO.night, hint: 'Page; its plum shade colors the top of the gradient' },
} as const;

export const crewPower = themed(
  W,
  H,
  {
    colors: {
      ...DARK_COLORS,
      primary: {
        value: VIO.bright,
        hint: 'lift your crew, the plus badge, the join pill and the violet glow',
      },
      text: {
        value: VIO.white,
        hint: 'Brand name, the first headline line, photo rings, plus icon and pill text',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      brand: BRAND,
      title: { label: 'Headline', value: 'Software made to' },
      highlight: { label: 'Highlighted line', value: 'lift your crew' },
      badge: { label: 'Pill', value: 'Join 8,000+ growing teams' },
    },
  } as const satisfies ThemeSpec,
  (t) => [
    darkBg(t, H),
    violetGlow(t, 240, 300, 600, 500),
    brandMark(t.copy('brand'), t.font('heading'), 0, 90, W, t.color('text')),
    avatar('woman-portrait-1', 300, 470, 95, t.color('text')),
    avatar('man-portrait-2', 470, 470, 95, t.color('text')),
    avatar('woman-portrait-5', 640, 470, 95, t.color('text')),
    circle(810, 470, 95, primaryFill(t, 135), {
      name: 'Plus badge',
      ...shadow(60, 0, t.shade('primary', 'rgba(139,92,246,0.9)')),
    }),
    icon('plus', 760, 420, 100, t.color('text'), { strokeWidth: 2.6 }),
    text(t.copy('title'), 0, 680, W, {
      fontFamily: t.font('heading'),
      fontSize: 76,
      fontWeight: 600,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('highlight'), 0, 780, W, {
      fontFamily: t.font('heading'),
      fontSize: 76,
      fontWeight: 800,
      fill: t.color('primary'),
      align: 'center',
    }),
    pill(t.copy('badge'), 290, 960, {
      fill: primaryFill(t),
      color: t.color('text'),
      fontSize: 30,
      fontFamily: t.font('body'),
      fontWeight: 700,
      width: 500,
    }),
  ],
);

export const campaignRoi = themed(
  W,
  H,
  {
    colors: {
      ...DARK_COLORS,
      primary: {
        value: VIO.bright,
        hint: 'Campaign ROI and the glow under the growth point; its pale shade colors the point',
      },
      text: {
        value: VIO.white,
        hint: 'Brand name, Elevate Your and the growth curve; its translucent shade colors the subtitle',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      brand: BRAND,
      title: { label: 'Headline', value: 'Elevate Your' },
      highlight: { label: 'Highlighted line', value: 'Campaign ROI' },
      subtitle: { label: 'Subtitle', value: 'Unlock 3x more conversions' },
    },
  } as const satisfies ThemeSpec,
  (t) => [
    darkBg(t, H),
    brandMark(t.copy('brand'), t.font('heading'), 0, 90, W, t.color('text')),
    text(t.copy('title'), 0, 220, W, {
      fontFamily: t.font('heading'),
      fontSize: 84,
      fontWeight: 500,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('highlight'), 0, 320, W, {
      fontFamily: t.font('heading'),
      fontSize: 92,
      fontWeight: 800,
      fill: t.color('primary'),
      align: 'center',
    }),
    text(t.copy('subtitle'), 0, 460, W, {
      fontFamily: t.font('body'),
      fontSize: 38,
      fontWeight: 600,
      fill: t.shade('text', VIO.muted),
      align: 'center',
    }),
    path(
      'M 0 1180 C 180 1180 260 900 380 960 S 520 1180 640 1020 S 820 700 1080 640',
      0,
      0,
      W,
      H,
      t.shade('text', 'rgba(0,0,0,0)'),
      { width: W, height: H },
      {
        name: 'Growth curve',
        stroke: t.shade('text', 'rgba(255,255,255,0.8)'),
        strokeWidth: 4,
      },
    ),
    violetGlow(t, 540, 920, 200, 200, 0.7),
    circle(640, 1020, 26, t.shade('primary', VIO.lilac), {
      name: 'Point',
      ...shadow(50, 0, t.shade('primary', VIO.violet)),
    }),
  ],
);

const cursor = (x: number, y: number, size: number, fill: Fill) =>
  poly(
    [
      [x, y],
      [x + size, y + size * 0.42],
      [x + size * 0.48, y + size * 0.52],
      [x + size * 0.42, y + size],
    ],
    fill,
    { name: 'Cursor' },
  );

export const pickDirection = themed(
  W,
  H,
  {
    colors: {
      ...DARK_COLORS,
      primary: { value: VIO.bright, hint: 'Dashed path and the arrow head' },
      text: {
        value: VIO.white,
        hint: 'Brand name and headline; its translucent shades color the subtitle and the fading cursors',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      brand: BRAND,
      title: { label: 'Headline', value: 'Pick your direction' },
      subtitle: {
        label: 'Subtitle',
        value: 'Shape your journey with\nflexible, scalable tools',
      },
    },
  } as const satisfies ThemeSpec,
  (t) => [
    darkBg(t, H),
    brandMark(t.copy('brand'), t.font('heading'), 0, 90, W, t.color('text')),
    text(t.copy('title'), 0, 220, W, {
      fontFamily: t.font('heading'),
      fontSize: 80,
      fontWeight: 600,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('subtitle'), 0, 340, W, {
      fontFamily: t.font('body'),
      fontSize: 36,
      fontWeight: 500,
      fill: t.shade('text', VIO.muted),
      align: 'center',
      lineHeight: 1.4,
    }),
    Array.from({ length: 12 }, (_, index) => {
      const column = index % 4;
      const row = Math.floor(index / 4);
      const alpha = 0.95 - (column + row) * 0.13;
      return cursor(
        70 + column * 150,
        740 + row * 170,
        110,
        t.shade('text', `rgba(255,255,255,${alpha.toFixed(2)})`),
      );
    }),
    path(
      'M 760 1060 C 760 900 820 820 930 760',
      0,
      0,
      W,
      H,
      t.shade('primary', 'rgba(0,0,0,0)'),
      { width: W, height: H },
      { name: 'Dashed path', stroke: t.color('primary'), strokeWidth: 5, dashed: true },
    ),
    poly(
      [
        [1010, 700],
        [960, 820],
        [890, 730],
      ],
      t.color('primary'),
      { name: 'Arrow head', ...shadow(40, 0, t.shade('primary', 'rgba(139,92,246,0.9)')) },
    ),
  ],
);
