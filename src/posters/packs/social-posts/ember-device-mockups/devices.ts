import { linear, radial } from '@/design';
import {
  circle,
  ellipse,
  laptop,
  type Nodes,
  POST_SIZE,
  paint,
  path,
  phone,
  phoneScreen,
  rect,
  rotateNodes,
  shadow,
  text,
} from '../../../kit';

export const EMBER = {
  black: '#07070a',
  glow: '#ff6a1a',
  amber: '#ffa24a',
  grey: '#a6a1a0',
  metal: '#2a2a30',
  silver: '#c9c9d1',
  white: '#ffffff',
  tablet: '#1b1b20',
  sky: '#ff9a62',
  glowSoft: 'rgba(255,106,26,0.55)',
  fade: 'rgba(7,7,10,0)',
};

const HEAD = 'Plus Jakarta Sans';
export const SITE = 'brightloop.app';

export const HEADING = { label: 'Heading font', value: HEAD } as const;
export const BODY = { label: 'Body font', value: HEAD } as const;
export const SITE_COPY = { label: 'Website', value: SITE } as const;

export const FRAME_HINT = 'its shades color the screens, bezels and stands';
export const ART_HINT = 'Sunset artwork on the device screens';

export const { width: W, height: H } = POST_SIZE;

type Shade = (exact: string) => string;

export interface DeviceInk {
  frame: Shade;
  art: Shade;
}

export type ScreenArt = (
  art: Shade,
  x: number,
  y: number,
  width: number,
  height: number,
) => Nodes[];

const HILL_BACK = 'M0 40 C 25 0 55 10 75 35 C 85 45 95 40 100 30 L 100 100 L 0 100 Z';
const HILL_FRONT = 'M0 55 C 20 30 45 25 65 50 C 80 65 92 45 100 40 L 100 100 L 0 100 Z';
const VIEW = { width: 100, height: 100 };

export const duskArt: ScreenArt = (art, x, y, width, height) => [
  rect(x, y, width, height, linear(180, art('#ff9a62'), art('#ffe1c2')), { name: 'Screen sky' }),
  circle(x + width * 0.7, y + height * 0.36, Math.min(width, height) * 0.12, art('#fff3e3')),
  path(HILL_BACK, x, y + height * 0.52, width, height * 0.48, art('#e2733b'), VIEW, {
    name: 'Back hill',
  }),
  path(HILL_FRONT, x, y + height * 0.66, width, height * 0.34, art('#a8431c'), VIEW, {
    name: 'Front hill',
  }),
];

const TILE_COLORS = ['#38e1ff', '#8b5cf6', '#f472b6', '#facc15', '#34d399', '#60a5fa'];

export const storeArt: ScreenArt = (art, x, y, width, height) => {
  const bar = height * 0.12;
  const gap = width * 0.03;
  const tile = (width - gap * 5) / 4;
  const tileHeight = (height - bar - gap * 3) / 2;
  return [
    rect(x, y, width, height, art('#f5f7fb'), { name: 'Store page' }),
    rect(x, y, width, bar, art('#1e1b4b'), { name: 'Store header' }),
    rect(x + gap, y + bar * 0.35, width * 0.22, bar * 0.3, art('#38e1ff'), {
      cornerRadius: bar * 0.15,
      name: 'Store logo',
    }),
    Array.from({ length: 8 }, (_, index) =>
      rect(
        x + gap + (index % 4) * (tile + gap),
        y + bar + gap + Math.floor(index / 4) * (tileHeight + gap),
        tile,
        tileHeight,
        art(TILE_COLORS[index % TILE_COLORS.length] ?? '#38e1ff'),
        { cornerRadius: tile * 0.08, name: 'Product tile' },
      ),
    ),
  ];
};

export const glow = (
  cx: number,
  cy: number,
  radius: number,
  color: string,
  fade: string,
  height: number = H,
) => {
  const rx = Math.min(radius, cx, W - cx);
  const ry = Math.min(radius, cy, height - cy);
  return ellipse(cx - rx, cy - ry, rx * 2, ry * 2, radial(color, fade), {
    name: 'Glow',
  });
};

const kitColors = (ink: DeviceInk) => ({
  '#cbd5e1': ink.frame('#cbd5e1'),
  '#0b0b0f': ink.frame('#0b0b0f'),
});

export const laptopDevice = (
  ink: DeviceInk,
  x: number,
  y: number,
  width: number,
  art: ScreenArt = duskArt,
) =>
  paint(
    [
      laptop(x, y, width, {
        body: ink.frame(EMBER.metal),
        screen: ink.frame('#000000'),
        content: art(ink.art, 0, 0, width * 0.95, width * 0.57),
      }),
    ],
    kitColors(ink),
  );

export const phoneDevice = (ink: DeviceInk, x: number, y: number, width: number) => {
  const screen = phoneScreen(width);
  return paint(
    [
      phone(x, y, width, {
        screen: ink.frame('#000000'),
        content: duskArt(ink.art, 0, screen.height * 0.08, screen.width, screen.height * 0.84),
      }),
    ],
    kitColors(ink),
  );
};

export const tablet = (
  ink: DeviceInk,
  x: number,
  y: number,
  width: number,
  height: number,
  options: { body?: string; rotation?: number } = {},
) => {
  const inset = width * 0.045;
  const parts = [
    rect(x, y, width, height, ink.frame(options.body ?? EMBER.tablet), {
      name: 'Tablet body',
      cornerRadius: width * 0.08,
      stroke: ink.frame('#3a3a42'),
      strokeWidth: 3,
      ...shadow(width * 0.12, width * 0.05, 'rgba(0,0,0,0.5)'),
    }),
    rect(x + inset, y + inset, width - inset * 2, height - inset * 2, ink.frame('#000000'), {
      name: 'Tablet screen',
      cornerRadius: width * 0.04,
    }),
    duskArt(ink.art, x + inset * 1.6, y + inset * 1.6, width - inset * 3.2, height - inset * 3.2),
  ];
  return options.rotation === undefined
    ? parts
    : rotateNodes(options.rotation, x + width / 2, y + height / 2, parts);
};

export const monitor = (ink: DeviceInk, x: number, y: number, width: number) => {
  const height = width * 0.6;
  const inset = width * 0.03;
  return [
    rect(x + width * 0.44, y + height - 10, width * 0.12, width * 0.16, ink.frame(EMBER.silver), {
      name: 'Monitor neck',
    }),
    rect(
      x + width * 0.3,
      y + height + width * 0.15,
      width * 0.4,
      width * 0.03,
      ink.frame(EMBER.silver),
      {
        name: 'Monitor foot',
        cornerRadius: width * 0.015,
      },
    ),
    rect(x, y, width, height, ink.frame('#141418'), {
      name: 'Monitor frame',
      cornerRadius: width * 0.025,
      stroke: ink.frame('#3a3a42'),
      strokeWidth: 3,
      ...shadow(40, 16, 'rgba(0,0,0,0.5)'),
    }),
    duskArt(ink.art, x + inset, y + inset, width - inset * 2, height - inset * 2),
  ];
};

export const pedestal = (
  ink: DeviceInk,
  rim: string,
  x: number,
  top: number,
  width: number,
  height: number,
) => [
  rect(
    x,
    top + width * 0.07,
    width,
    height,
    linear(180, ink.frame('#232329'), ink.frame('#09090c')),
    {
      name: 'Pedestal body',
    },
  ),
  ellipse(x, top, width, width * 0.14, ink.frame('#3a3a44'), {
    name: 'Pedestal top',
    stroke: rim,
    strokeWidth: 3,
  }),
];

export const siteLine = (content: string, y: number, color: string, fontFamily: string) =>
  text(content, 0, y, W, {
    fontFamily,
    fontSize: 30,
    fontWeight: 600,
    fill: color,
    align: 'center',
  });

export const inkOf = (shade: (key: 'surface' | 'accent', exact: string) => string): DeviceInk => ({
  frame: (exact) => shade('surface', exact),
  art: (exact) => shade('accent', exact),
});
