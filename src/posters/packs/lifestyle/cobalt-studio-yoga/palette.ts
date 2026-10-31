import { icon, text } from '../../../kit';

export const CO = {
  cobalt: '#2f4bff',
  deep: '#1a2bb8',
  ink: '#0d0f1a',
  paper: '#f4f2ec',
  lilac: '#c9d1ff',
  white: '#ffffff',
  grey: '#6b7085',
};

export const HEADING = { label: 'Heading font', value: 'Plus Jakarta Sans' } as const;
export const BODY = { label: 'Body font', value: 'Plus Jakarta Sans' } as const;
export const SCRIPT = { label: 'Script font', value: 'Playfair Display' } as const;
export const BRAND = { label: 'Brand name', value: 'Driftwood' } as const;

export const brandMark = (
  x: number,
  y: number,
  color: string,
  label: string,
  fontFamily: string,
  size = 36,
) => [
  icon('flower-2', x, y, size * 1.2, color, { strokeWidth: 2 }),
  text(label, x + size * 1.6, y + size * 0.05, size * 7, {
    fontFamily,
    fontSize: size,
    fontWeight: 700,
    fill: color,
  }),
];

export const centeredMark = (
  centerX: number,
  y: number,
  color: string,
  label: string,
  fontFamily: string,
  size = 36,
) => brandMark(centerX - size * 3.5, y, color, label, fontFamily, size);
