import { linear } from '@/design';
import { POST_SIZE, rect } from '../../../kit';

export const VOLT = {
  lime: '#c6f432',
  limeDeep: '#9fcc12',
  limeDark: '#4d6b00',
  black: '#0d0d0d',
  charcoal: '#1c1c1c',
  paper: '#f4f4ef',
  white: '#ffffff',
  grey: '#9b9b94',
};

export const HEADING_FONT = { label: 'Heading font', value: 'Archivo Black' } as const;
export const BODY_FONT = { label: 'Body font', value: 'Manrope' } as const;
export const SCRIPT_FONT = { label: 'Script font', value: 'Permanent Marker' } as const;

export const DARK_BACKDROP = {
  value: VOLT.charcoal,
  hint: 'Page gradient; its darker shade is the bottom of the gradient',
} as const;

const { width: W, height: H } = POST_SIZE;

export const darkBackdrop = (top: string, bottom: string, height: number = H) =>
  rect(0, 0, W, height, linear(180, top, bottom), { name: 'Background' });
