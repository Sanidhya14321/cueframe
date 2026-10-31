import { linear, NO_FILTERS, radial } from '@/design';
import { circle, photo, rect, SLIDE_SIZE } from '../../../kit';
import type { PosterPhotoName } from '../../../photos';
import { typeset } from '../coral-b2b-agency-deck/deck-kit';

export const K = {
  black: '#060805',
  panel: '#121610',
  panelSoft: '#1c2318',
  lime: '#b8f531',
  limeDeep: '#8fc61a',
  olive: '#3d5a0c',
  white: '#ffffff',
  muted: '#a3ab9c',
  line: 'rgba(255,255,255,0.14)',
  dim: '#3f4639',
};

export const { width: SW, height: SH } = SLIDE_SIZE;

export const HEADING = { label: 'Heading font', value: 'Space Grotesk' } as const;
export const BODY = { label: 'Body font', value: 'Manrope' } as const;

type Role = 'background' | 'primary' | 'text';

export interface Ink {
  color: (key: Role) => string;
  shade: (key: Role, exact: string) => string;
}

export const fonts = (t: { font: (key: 'heading' | 'body') => string }) =>
  typeset(t.font('heading'), t.font('body'));

export const backdrop = (ink: Ink, angle = 180) => [
  rect(0, 0, SW, SH, ink.color('background'), { name: 'Background' }),
  rect(
    0,
    0,
    SW,
    SH,
    linear(
      angle,
      ink.shade('primary', 'rgba(61,90,12,0.6)'),
      ink.shade('background', 'rgba(6,8,5,0)'),
      ink.shade('background', 'rgba(6,8,5,0)'),
    ),
    { name: 'Glow wash' },
  ),
];

export const glow = (ink: Ink, cx: number, cy: number, radius: number, strength = 0.55) =>
  circle(
    cx,
    cy,
    radius,
    radial(
      ink.shade('primary', `rgba(184,245,49,${strength})`),
      ink.shade('primary', `rgba(143,198,26,${(strength * 0.3).toFixed(2)})`),
      ink.shade('primary', 'rgba(61,90,12,0)'),
      ink.shade('primary', 'rgba(61,90,12,0)'),
    ),
    { name: 'Glow' },
  );

export const mono = (
  name: PosterPhotoName,
  x: number,
  y: number,
  width: number,
  height: number,
  radius = 28,
) =>
  photo(name, x, y, width, height, {
    cornerRadius: radius,
    filters: { ...NO_FILTERS, grayscale: 1, contrast: 1.1 },
  });

export const fade = (ink: Ink, from: string) =>
  linear(180, ink.shade('text', from), ink.shade('text', 'rgba(255,255,255,0.04)'));
