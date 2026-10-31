import { linear } from '@/design';
import { POST_SIZE, pill, rect } from '../../../kit';

export interface ClayPalette {
  light: string;
  soft: string;
  brand: string;
  deep: string;
  ink: string;
  paper: string;
}

export const CLAY: ClayPalette = {
  light: '#fdf3ec',
  soft: '#f3c9b1',
  brand: '#c8553d',
  deep: '#4a1f17',
  ink: '#2a120d',
  paper: '#ffffff',
};

export const TIDE: ClayPalette = {
  light: '#eef6fb',
  soft: '#b7d9ee',
  brand: '#1f7fb6',
  deep: '#123a56',
  ink: '#0b2233',
  paper: '#ffffff',
};

export const HEADING = { label: 'Heading font', value: 'Sora' } as const;
export const BODY = { label: 'Body font', value: 'DM Sans' } as const;
export const SCRIPT = { label: 'Script font', value: 'Dancing Script' } as const;
export const WEBSITE = { label: 'Website', value: 'clayhouse.co' } as const;

export const { width: W, height: H } = POST_SIZE;

export const backdrop = (top: string, bottom: string, height: number = H, angle = 180) =>
  rect(0, 0, W, height, linear(angle, top, bottom), { name: 'Background' });

export const button = (
  label: string,
  x: number,
  y: number,
  fill: string,
  color: string,
  fontFamily: string,
) => pill(label, x, y, { fill, color, fontSize: 26, fontFamily, fontWeight: 600 });
