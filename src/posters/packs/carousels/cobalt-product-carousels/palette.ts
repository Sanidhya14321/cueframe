import { linear } from '@/design';
import { POST_SIZE, rect, text } from '../../../kit';

export const COBALT = {
  ink: '#0a0f1f',
  sky: '#38bdf8',
  deepBlue: '#1d4ed8',
  blue: '#2563eb',
  white: '#ffffff',
  grey: '#4b5563',
  line: '#e5e7eb',
};

export const glow = (from: string, to: string) => linear(160, from, to);

export const HEADING_FONT = { label: 'Heading font', value: 'Urbanist' } as const;
export const BODY_FONT = { label: 'Body font', value: 'Inter' } as const;
export const BRAND = { label: 'Brand', value: 'ORBITAL WORKS' } as const;
export const SITE = { label: 'Website', value: 'orbitalworks.co' } as const;

export const { width: W, height: H } = POST_SIZE;

export const inkBackground = (fill: string) => rect(0, 0, W, H, fill, { name: 'Background' });

export const brandLine = (label: string, x: number, y: number, color: string, fontFamily: string) =>
  text(label, x, y, 600, {
    fontFamily,
    fontSize: 34,
    fontWeight: 800,
    fill: color,
    letterSpacing: 3,
  });
