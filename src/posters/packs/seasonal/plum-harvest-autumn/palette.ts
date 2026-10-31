import { photo, rect, rotateNodes, shadow } from '../../../kit';
import type { PosterPhotoName } from '../../../photos';

export const AUT = {
  plum: '#4a2338',
  berry: '#7b3a52',
  rose: '#c98b8b',
  sage: '#7f8f6a',
  butter: '#f1dca7',
  oat: '#f5efe4',
  espresso: '#2b1d18',
  white: '#ffffff',
  line: '#e4dccd',
};

export const SERIF = { label: 'Heading font', value: 'Fraunces' } as const;
export const HAND = { label: 'Script font', value: 'Caveat' } as const;
export const BODY = { label: 'Body font', value: 'DM Sans' } as const;
export const PACIFICO = { label: 'Title font', value: 'Pacifico' } as const;

export const snap = (
  name: PosterPhotoName,
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number,
  border: string,
  tint: string,
) =>
  rotateNodes(rotation, x + width / 2, y + height / 2, [
    rect(x - 16, y - 16, width + 32, height + 32, border, {
      name: 'Photo border',
      ...shadow(24, 10, tint),
    }),
    photo(name, x, y, width, height),
  ]);
