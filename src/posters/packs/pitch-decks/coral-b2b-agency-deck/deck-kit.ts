import type { Fill } from '@/design';
import { path, text } from '../../../kit';

type TextStyle = NonNullable<Parameters<typeof text>[4]>;

const face =
  (fontWeight: number, lineHeight: number) =>
  (fontFamily: string) =>
  (
    content: string,
    x: number,
    y: number,
    width: number,
    size: number,
    fill: Fill,
    extra: TextStyle = {},
  ) =>
    text(content, x, y, width, {
      fontFamily,
      fontSize: size,
      fontWeight,
      fill,
      lineHeight,
      ...extra,
    });

export const head = face(700, 1.08);
export const body = face(400, 1.4);

export const typeset = (headFont: string, bodyFont: string) => ({
  head: head(headFont),
  body: body(bodyFont),
});

const point = (center: number, radius: number, angle: number) =>
  `${(center + radius * Math.cos(angle)).toFixed(2)} ${(center + radius * Math.sin(angle)).toFixed(2)}`;

export const arcBand = (
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  from: number,
  to: number,
  fill: Fill,
) => {
  const start = ((from - 90) * Math.PI) / 180;
  const end = ((to - 90) * Math.PI) / 180;
  const large = to - from > 180 ? 1 : 0;
  const data = [
    `M${point(outer, outer, start)}`,
    `A${outer} ${outer} 0 ${large} 1 ${point(outer, outer, end)}`,
    `L${point(outer, inner, end)}`,
    `A${inner} ${inner} 0 ${large} 0 ${point(outer, inner, start)}`,
    'Z',
  ].join(' ');
  return path(data, cx - outer, cy - outer, outer * 2, outer * 2, fill, {
    width: outer * 2,
    height: outer * 2,
  });
};

export const donut = (
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  segments: readonly (readonly [number, Fill])[],
) => {
  const total = segments.reduce((sum, [value]) => sum + value, 0);
  let cursor = 0;
  return segments.map(([value, fill]) => {
    const from = (cursor / total) * 360;
    cursor += value;
    return arcBand(cx, cy, outer, inner, from, (cursor / total) * 360 - 0.01, fill);
  });
};
