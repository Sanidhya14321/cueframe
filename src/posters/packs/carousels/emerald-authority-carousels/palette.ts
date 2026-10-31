import { linear } from '@/design';
import { POST_SIZE, path, rect, text } from '../../../kit';

export const LEAF = {
  top: '#0b4a39',
  bottom: '#031a14',
  mid: '#0a4334',
  mint: '#6ee7b7',
  glow: 'rgba(110,231,183,0.12)',
  wire: '#d1fae5',
  white: '#ffffff',
  clear: 'rgba(0,0,0,0)',
};

export const HEAD = { label: 'Heading font', value: 'Outfit' } as const;
export const BODY = { label: 'Body font', value: 'DM Sans' } as const;
export const SCRIPT = { label: 'Script font', value: 'Caveat' } as const;
export const BRAND = { label: 'Brand', value: 'EVERLEAF MEDIA' } as const;

export const { width: W, height: H } = POST_SIZE;

export const trail = (
  data: string,
  x: number,
  y: number,
  width: number,
  height: number,
  stroke: string,
  fill: string,
  strokeWidth: number,
) =>
  path(
    data,
    x,
    y,
    width,
    height,
    fill,
    { width, height },
    { stroke, strokeWidth, dashed: false, name: 'Line' },
  );

interface LeafTheme {
  color: (key: 'background' | 'primary') => string;
  shade: (key: 'background' | 'primary', exact: string) => string;
}

export const leafBackground = (t: LeafTheme) => [
  rect(0, 0, W, H, linear(165, t.color('background'), t.shade('background', LEAF.bottom)), {
    name: 'Background',
  }),
  trail(
    'M0 420 Q540 0 1080 300',
    0,
    880,
    W,
    440,
    t.shade('primary', LEAF.glow),
    t.shade('primary', LEAF.clear),
    3,
  ),
];

export const brandMark = (label: string, fontFamily: string, fill: string, x: number, y: number) =>
  text(label, x, y, 520, {
    fontFamily,
    fontSize: 38,
    fontWeight: 800,
    fill,
    letterSpacing: 3,
  });

export const titleLine = (
  content: string,
  fontFamily: string,
  x: number,
  y: number,
  size: number,
  fill: string,
) =>
  text(content, x, y, W - x - 60, {
    fontFamily,
    fontSize: size,
    fontWeight: 700,
    fill,
    lineHeight: 1.15,
  });

export const bodyText = (
  content: string,
  fontFamily: string,
  fill: string,
  x: number,
  y: number,
  width: number,
  align: 'left' | 'center' = 'left',
) =>
  text(content, x, y, width, {
    fontFamily,
    fontSize: 42,
    fontWeight: 500,
    fill,
    lineHeight: 1.4,
    align,
  });
