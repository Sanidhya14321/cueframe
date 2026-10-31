import { linear } from '@/design';
import { icon, POST_SIZE, rect, text } from '../../../kit';

export const TIDE = {
  teal: '#123a42',
  night: '#0a1f24',
  deep: '#0d2a30',
  coral: '#ff7a59',
  cream: '#fdf3ea',
  white: '#ffffff',
  mist: '#b8d4d6',
};

export const HEAD = { label: 'Heading font', value: 'Sora' } as const;
export const BODY = { label: 'Body font', value: 'Manrope' } as const;
export const BRAND = { label: 'Brand', value: 'NORTHBEAM STUDIO' } as const;

export const { width: W, height: H } = POST_SIZE;

export const darkBackground = (from: string, to: string) =>
  rect(0, 0, W, H, linear(160, from, to), { name: 'Background' });

export const brandFooter = (label: string, fontFamily: string, color: string, arrow: string) => [
  text(label, 90, 1200, 600, {
    fontFamily,
    fontSize: 32,
    fontWeight: 700,
    fill: color,
    letterSpacing: 3,
  }),
  icon('arrow-right', 890, 1170, 100, arrow, { strokeWidth: 2.6 }),
];
