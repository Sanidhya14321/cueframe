import { type Fill, radial } from '@/design';
import { circle, rect, SLIDE_SIZE, text } from '../../../kit';

export const HX = {
  night: '#07090b',
  panel: '#11171a',
  panelSoft: '#1a2226',
  teal: '#19e3c4',
  deep: '#0b8f86',
  white: '#ffffff',
  muted: '#9aa7ad',
  rule: 'rgba(255,255,255,0.14)',
};

export const { width: SW, height: SH } = SLIDE_SIZE;

export const HEADING_FONT = { label: 'Heading font', value: 'Sora' } as const;
export const BODY_FONT = { label: 'Body font', value: 'Inter' } as const;

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

export const backdrop = (fill: string) => rect(0, 0, SW, SH, fill, { name: 'Background' });

export const glow = (
  cx: number,
  cy: number,
  radius: number,
  strength: number,
  tint: (exact: string) => string,
) =>
  circle(
    cx,
    cy,
    radius,
    radial(
      tint(`rgba(25,227,196,${strength})`),
      tint(`rgba(11,143,134,${strength * 0.4})`),
      tint('rgba(11,143,134,0)'),
      tint('rgba(11,143,134,0)'),
    ),
    { name: 'Glow' },
  );
