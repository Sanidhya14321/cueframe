import { POST_SIZE, text } from '../../../kit';

export const { width: W, height: H } = POST_SIZE;

export const WINE = '#4a1030';
export const MINT = '#a7f3d0';
export const LEAF = '#10b981';
export const BLUSH = '#f5d0e0';
export const PLUM = '#5c1a3f';
export const NIGHT = '#2a0819';
export const WHITE = '#ffffff';
export const STONE = '#57534e';
export const INK = '#1c1917';
export const PETAL = '#f1e7ec';
export const MIST = '#e7d5dd';
export const CLEAR = 'rgba(0,0,0,0)';
export const FAINT = 'rgba(255,255,255,0.06)';
export const HAZE = 'rgba(255,255,255,0.3)';

export const HEADING = { label: 'Heading font', value: 'Outfit' } as const;
export const BODY = { label: 'Body font', value: 'Outfit' } as const;
export const SITE = { label: 'Website', value: 'harborline.co' } as const;

type TextStyle = Parameters<typeof text>[4];

export const say = (
  content: string,
  x: number,
  y: number,
  width: number,
  fontFamily: string,
  fontSize: number,
  fontWeight: number,
  fill: string,
  style: TextStyle = {},
) => text(content, x, y, width, { fontFamily, fontSize, fontWeight, fill, ...style });
