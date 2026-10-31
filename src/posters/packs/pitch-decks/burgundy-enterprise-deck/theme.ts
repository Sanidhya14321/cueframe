import { linear, radial } from '@/design';
import { circle, path, rect, SLIDE_SIZE } from '../../../kit';
import { typeset } from '../coral-b2b-agency-deck/deck-kit';

export const CV = {
  wine: '#1f0a12',
  plum: '#3a1020',
  berry: '#5c1a2e',
  rose: '#f19bb0',
  blush: '#ffd6df',
  glass: 'rgba(255,255,255,0.08)',
  edge: 'rgba(255,214,223,0.22)',
  ink: '#2a0d18',
  white: '#ffffff',
  muted: '#c9a9b3',
  cardText: '#6b3a4b',
  clear: 'rgba(0,0,0,0)',
};

export const { width: SW, height: SH } = SLIDE_SIZE;

export const HEADING = { label: 'Heading font', value: 'Lexend' } as const;
export const BODY = { label: 'Body font', value: 'Figtree' } as const;

export const fontsOf = (t: { font: (key: 'heading' | 'body') => string }) =>
  typeset(t.font('heading'), t.font('body'));

export const headingOf = (font: string) => typeset(font, font).head;

export type Tint = (exact: string) => string;

export const backdrop = (from: string, to: string) =>
  rect(0, 0, SW, SH, linear(160, from, to), { name: 'Background' });

export const glass = (
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  edge: string,
  radius = 28,
) =>
  rect(x, y, width, height, fill, {
    name: 'Glass card',
    cornerRadius: radius,
    stroke: edge,
    strokeWidth: 2,
  });

export const glow = (cx: number, cy: number, radius: number, tint: Tint, alpha = 0.28) =>
  circle(
    cx,
    cy,
    Math.min(radius, cx, SW - cx, cy, SH - cy),
    radial(
      tint(`rgba(241,155,176,${alpha})`),
      tint(`rgba(241,155,176,${alpha / 3})`),
      tint('rgba(241,155,176,0)'),
      tint('rgba(241,155,176,0)'),
    ),
    { name: 'Glow' },
  );

export const wash = (angle: number, tint: Tint, alpha = 0.2) =>
  rect(
    0,
    0,
    SW,
    SH,
    linear(angle, tint(`rgba(241,155,176,${alpha})`), tint('rgba(241,155,176,0)')),
    {
      name: 'Glow wash',
    },
  );

export const halfRing = (
  cx: number,
  baseY: number,
  outer: number,
  inner: number,
  fill: Parameters<typeof rect>[4],
) =>
  path(
    `M0 ${outer} A${outer} ${outer} 0 0 1 ${outer * 2} ${outer} L${outer + inner} ${outer} A${inner} ${inner} 0 0 0 ${outer - inner} ${outer} Z`,
    cx - outer,
    baseY - outer,
    outer * 2,
    outer,
    fill,
    { width: outer * 2, height: outer },
    { name: 'Orbit' },
  );
