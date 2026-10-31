import { linear, type TextElement } from '@/design';
import { group, path, rect, text } from '../../../kit';

export const ROSE = {
  blush: '#e8b4a6',
  navy: '#13203a',
  ink: '#1a2238',
  vein: 'rgba(240,185,170,0.42)',
  glint: 'rgba(255,255,255,0.2)',
  white: '#ffffff',
  soft: 'rgba(255,255,255,0.32)',
  clear: 'rgba(0,0,0,0)',
  marble: '#1b2b4d',
};

export const NAME = {
  first: { label: 'First name', value: 'AMARA' },
  last: { label: 'Last name', value: 'QUINN' },
  role: { label: 'Job title', value: 'REAL ESTATE ADVISOR' },
} as const;

export const CONTACT_COPY = {
  label: 'Contact',
  value: ['amara@quinnhomes.co', '+1 (555) 482 1170', '9 Seaview Terrace'],
} as const;

export const POPPINS = { label: 'Body font', value: 'Poppins' } as const;

export const copy = (
  content: string,
  x: number,
  y: number,
  width: number,
  fontSize: number,
  fill: string,
  fontFamily: string,
  style: Partial<TextElement> = {},
) =>
  text(content, x, y, width, {
    fontFamily,
    fontSize,
    fontWeight: 400,
    fill,
    lineHeight: 1.45,
    ...style,
  });

type Point = readonly [number, number];
type Vein = readonly [Point, Point, Point, Point, Point, Point];

const VEINS: readonly Vein[] = [
  [
    [0, 0.14],
    [0.2, 0.08],
    [0.32, 0.3],
    [0.5, 0.24],
    [0.8, 0.4],
    [1, 0.33],
  ],
  [
    [0.1, 1],
    [0.22, 0.78],
    [0.12, 0.6],
    [0.36, 0.5],
    [0.62, 0.28],
    [0.7, 0],
  ],
  [
    [0, 0.7],
    [0.26, 0.64],
    [0.4, 0.82],
    [0.6, 0.7],
    [0.88, 0.86],
    [1, 0.78],
  ],
  [
    [0.42, 1],
    [0.5, 0.86],
    [0.72, 0.9],
    [0.8, 0.64],
    [0.94, 0.5],
    [1, 0.56],
  ],
  [
    [0.56, 0],
    [0.5, 0.14],
    [0.66, 0.24],
    [0.6, 0.4],
    [0.74, 0.6],
    [0.9, 0.62],
  ],
];

const turn = ([vx, vy]: Point): Point => [1 - vy, vx];

const mirrorVein = ([a, b, c, d, e, f]: Vein): Vein => [
  turn(a),
  turn(b),
  turn(c),
  turn(d),
  turn(e),
  turn(f),
];

export interface MarbleInk {
  top: string;
  base: string;
  vein: string;
  glint: string;
  clear: string;
}

export const marble = (
  x: number,
  y: number,
  width: number,
  height: number,
  ink: MarbleInk,
  options: { flip?: boolean } = {},
) => {
  const px = (value: number) => Math.round((options.flip === true ? 1 - value : value) * width);
  const veinPath = (vein: Vein, shift: number) => {
    const sy = (value: number) => Math.min(height, Math.round(value * height) + shift);
    const [start, c1, c2, mid, c3, end] = vein;
    return `M${px(start[0])} ${sy(start[1])} C${px(c1[0])} ${sy(c1[1])} ${px(c2[0])} ${sy(c2[1])} ${px(mid[0])} ${sy(mid[1])} S${px(c3[0])} ${sy(c3[1])} ${px(end[0])} ${sy(end[1])}`;
  };
  const strand = (data: string, stroke: string, strokeWidth: number, name: string) =>
    path(
      data,
      x,
      y,
      width,
      height,
      ink.clear,
      { width, height },
      {
        stroke,
        strokeWidth,
        name,
      },
    );
  return group(
    rect(x, y, width, height, linear(160, ink.top, ink.base), { name: 'Marble base' }),
    [...VEINS, ...VEINS.map(mirrorVein)].map((vein, index) => [
      strand(veinPath(vein, 0), ink.vein, index < VEINS.length ? 3 : 1.6, 'Marble vein'),
      strand(veinPath(vein, 6), ink.glint, 1.2, 'Marble glint'),
    ]),
  );
};

export const outline = (
  x: number,
  y: number,
  width: number,
  height: number,
  stroke: string,
  clear: string,
  strokeWidth = 4,
) =>
  rect(x, y, width, height, clear, {
    stroke,
    strokeWidth,
    name: 'Frame line',
  });
