import type { TextElement } from '@/design';
import { group, icon, path, rect, text } from '../../../kit';

export const LOOP = {
  night: '#211530',
  deep: '#170e22',
  lime: '#c4f24a',
  lilac: '#d9c9f0',
  violet: '#b892ff',
  coral: '#ff7a8a',
  sky: '#62d2ff',
  white: '#ffffff',
};

export const CLEAR = 'rgba(0,0,0,0)';
export const GRID_LINE = 'rgba(255,255,255,0.05)';

export const HEADING_FONT = { label: 'Heading font', value: 'Poppins' } as const;
export const BODY_FONT = { label: 'Body font', value: 'Poppins' } as const;

export const copy =
  (fontFamily: string) =>
  (
    content: string,
    x: number,
    y: number,
    width: number,
    fontSize: number,
    fill: string,
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

export const grid = (width: number, height: number, step: number, fill: string) => [
  Array.from({ length: Math.floor(width / step) }, (_, index) =>
    rect((index + 1) * step, 0, 1.5, height, fill, { name: 'Grid line' }),
  ),
  Array.from({ length: Math.floor(height / step) }, (_, index) =>
    rect(0, (index + 1) * step, width, 1.5, fill, { name: 'Grid line' }),
  ),
];

export const swirl = (
  x: number,
  y: number,
  size: number,
  stroke: string,
  strokeWidth: number,
  clear: string,
) =>
  group(
    path(
      'M10 30 C120 -10 250 30 240 130 C230 230 100 230 110 150 C120 70 290 50 320 190 C340 280 300 330 350 370',
      x,
      y,
      size,
      size,
      clear,
      { width: 380, height: 390 },
      { stroke, strokeWidth, name: 'Swirl' },
    ),
    icon('pencil', x + size * 0.86, y + size * 0.9, size * 0.2, stroke, { strokeWidth: 2 }),
  );

export interface BezierStyle {
  stroke: string;
  anchor: string;
  clear: string;
}

export const bezier = (x: number, y: number, width: number, height: number, style: BezierStyle) =>
  group(
    path(
      `M0 ${height} C${width * 0.7} ${height} ${width} ${height * 0.6} ${width} 0`,
      x,
      y,
      width,
      height,
      style.clear,
      { width, height },
      { stroke: style.stroke, strokeWidth: 3, name: 'Bezier curve' },
    ),
    (
      [
        [x - 7, y + height - 7],
        [x + width * 0.55 - 7, y + height * 0.86 - 7],
        [x + width * 0.92 - 7, y + height * 0.4 - 7],
      ] as const
    ).map(([hx, hy]) =>
      rect(hx, hy, 14, 14, style.anchor, { stroke: style.stroke, strokeWidth: 2, name: 'Anchor' }),
    ),
    icon('pen-tool', x + width - 20, y - 50, 44, style.stroke, { strokeWidth: 2 }),
  );

export interface SwatchStyle {
  back: string;
  front: string;
  top: string;
  edge: string;
}

export const swatches = (x: number, y: number, size: number, style: SwatchStyle) =>
  group(
    rect(x, y + size * 0.1, size * 0.7, size * 0.9, style.back, {
      cornerRadius: size * 0.08,
      rotation: -14,
      stroke: style.edge,
      strokeWidth: size * 0.04,
      name: 'Swatch',
    }),
    rect(x + size * 0.22, y, size * 0.7, size * 0.9, style.front, {
      cornerRadius: size * 0.08,
      stroke: style.edge,
      strokeWidth: size * 0.04,
      name: 'Swatch',
    }),
    rect(x + size * 0.22, y, size * 0.7, size * 0.36, style.top, {
      cornerRadius: size * 0.08,
      stroke: style.edge,
      strokeWidth: size * 0.04,
      name: 'Swatch colour',
    }),
  );

export interface RingStyle {
  stroke: string;
  track: string;
  clear: string;
}

export const ring = (
  cx: number,
  cy: number,
  radius: number,
  share: number,
  strokeWidth: number,
  style: RingStyle,
) => {
  const box = radius * 2 + strokeWidth;
  const center = box / 2;
  const angle = -Math.PI / 2 + Math.PI * 2 * share;
  const endX = center + radius * Math.cos(angle);
  const endY = center + radius * Math.sin(angle);
  return group(
    path(
      `M${center} ${center - radius} A${radius} ${radius} 0 1 1 ${center - 0.01} ${center - radius}`,
      cx - center,
      cy - center,
      box,
      box,
      style.clear,
      { width: box, height: box },
      { stroke: style.track, strokeWidth, name: 'Ring track' },
    ),
    path(
      `M${center} ${center - radius} A${radius} ${radius} 0 ${share > 0.5 ? 1 : 0} 1 ${endX} ${endY}`,
      cx - center,
      cy - center,
      box,
      box,
      style.clear,
      { width: box, height: box },
      { stroke: style.stroke, strokeWidth, name: 'Ring value' },
    ),
  );
};

export interface PillStyle {
  stroke: string;
  ink: string;
  clear: string;
  fontFamily: string;
}

export const outlinePill = (
  name: string,
  label: string,
  x: number,
  y: number,
  width: number,
  style: PillStyle,
  size = 26,
) => [
  rect(x, y, width, size * 2.4, style.clear, {
    cornerRadius: size * 1.2,
    stroke: style.stroke,
    strokeWidth: 3,
    name: `${name} pill`,
  }),
  copy(style.fontFamily)(label, x, y + size * 0.6, width, size, style.ink, {
    fontWeight: 600,
    align: 'center',
    lineHeight: 1.2,
  }),
];
