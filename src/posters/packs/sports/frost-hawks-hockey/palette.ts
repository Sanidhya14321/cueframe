import { type Fill, IMAGE_FILTER_PRESETS, linear } from '@/design';
import { POST_SIZE, photo, rect, text } from '../../../kit';
import type { PosterPhotoName } from '../../../photos';

export const { width: W, height: H } = POST_SIZE;

export const HAWKS = {
  navy: '#0a1631',
  deep: '#050c1d',
  steel: '#12264d',
  ice: '#8fd3ff',
  blue: '#1d6fb8',
  frost: '#eef5fb',
  amber: '#ffb81c',
  gold: '#e08e0b',
  white: '#ffffff',
  rinkTop: '#f6fafd',
  rinkBottom: '#d3e4f1',
  skate: 'rgba(29,111,184,0.12)',
  clear: 'rgba(0,0,0,0)',
};

export const HEADING = { label: 'Heading font', value: 'Bebas Neue' } as const;
export const LABEL = { label: 'Label font', value: 'Barlow Condensed' } as const;
export const SCRIPT = { label: 'Script font', value: 'Satisfy' } as const;

export const RINK_HINT = 'Ice page gradient; its darker shade is the bottom of the gradient';

type TextStyle = Parameters<typeof text>[4];

export const say = (
  content: string,
  x: number,
  y: number,
  width: number,
  fontFamily: string,
  fontSize: number,
  fontWeight: number,
  fill: Fill,
  style: TextStyle = {},
) => text(content, x, y, width, { fontFamily, fontSize, fontWeight, fill, ...style });

export const iceBackground = (
  width: number,
  height: number,
  colors: { top: string; bottom: string; mark: string },
) => [
  rect(0, 0, width, height, linear(180, colors.top, colors.bottom), { name: 'Ice' }),
  [0.12, 0.31, 0.55, 0.78].map((ratio, index) =>
    rect(width * ratio, height * (0.1 + index * 0.21), width * 0.18, 3, colors.mark, {
      rotation: index % 2 === 0 ? 8 : -6,
      name: 'Skate mark',
    }),
  ),
];

export const toned = (
  name: PosterPhotoName,
  x: number,
  y: number,
  width: number,
  height: number,
  tint: string,
  style: { radius?: number; flip?: boolean } = {},
) => [
  photo(name, x, y, width, height, {
    cornerRadius: style.radius ?? 0,
    flipX: style.flip ?? false,
    filters: IMAGE_FILTER_PRESETS.mono,
  }),
  rect(x, y, width, height, tint, { cornerRadius: style.radius ?? 0, name: 'Photo tint' }),
];
