import { rect, SLIDE_SIZE } from '../../../kit';

export { body, head } from './deck-kit';

export const NV = {
  plum: '#2b1236',
  plumSoft: '#44214f',
  coral: '#ff7a59',
  peach: '#ffd5c6',
  cream: '#fff7f2',
  ink: '#24102e',
  grey: '#6e5f76',
  line: '#ead9d0',
  white: '#ffffff',
  clear: 'rgba(0,0,0,0)',
};

export const { width: SW, height: SH } = SLIDE_SIZE;

export const FONTS = {
  heading: { label: 'Heading font', value: 'Bricolage Grotesque' },
  body: { label: 'Body font', value: 'DM Sans' },
} as const;

export const backdrop = (fill: string) => rect(0, 0, SW, SH, fill, { name: 'Background' });

export const marker = (x: number, y: number, fill: string) =>
  rect(x, y, 72, 12, fill, { name: 'Accent bar', cornerRadius: 6 });
