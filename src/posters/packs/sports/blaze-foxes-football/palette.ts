import type { DesignIconName } from '@/design';
import { icon, poly } from '../../../kit';

export const FOX = {
  ink: '#141414',
  smoke: '#262626',
  blaze: '#ff6a13',
  deep: '#c64a02',
  cream: '#f6f1e7',
  white: '#ffffff',
  grey: '#a3a3a3',
  rival: '#2f9e8f',
};

const DISPLAY = 'Anton';
const COND = 'Barlow Condensed';
const BLOCK = 'Archivo Black';

export const HEADING = { label: 'Heading font', value: DISPLAY } as const;
export const BODY = { label: 'Body font', value: COND } as const;
export const TITLE = { label: 'Title font', value: BLOCK } as const;

export const crest = (
  x: number,
  y: number,
  size: number,
  fill: string,
  glyph: DesignIconName,
  color: string,
) => [
  poly(
    [
      [x, y],
      [x + size, y],
      [x + size, y + size * 0.62],
      [x + size / 2, y + size * 1.1],
      [x, y + size * 0.62],
    ],
    fill,
    { name: 'Crest' },
  ),
  icon(glyph, x + size * 0.25, y + size * 0.2, size * 0.5, color, { strokeWidth: 2.2 }),
];
