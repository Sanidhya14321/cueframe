import { POST_SIZE } from '../../../kit';

export const LILAC = {
  mist: '#ece6f2',
  lilac: '#cdbbe0',
  mauve: '#9c83b5',
  plum: '#4a3a5c',
  ink: '#2a2233',
  cream: '#faf7fb',
  butter: '#f6e7a8',
  grey: '#6e6578',
  white: '#ffffff',
};

const SERIF = 'Cormorant Garamond';
const SANS = 'DM Sans';
const MONO_FONT = 'Space Mono';
const HAND = 'Caveat';

export const SERIF_FONT = { label: 'Heading font', value: SERIF } as const;
export const SANS_FONT = { label: 'Body font', value: SANS } as const;
export const HAND_FONT = { label: 'Script font', value: HAND } as const;
export const MONO = { label: 'Mono font', value: MONO_FONT } as const;

export const HANDLE = { label: 'Handle', value: '@ines.slowdays' } as const;

export const SOFT = {
  brightness: 1.02,
  contrast: 0.95,
  saturation: 0.75,
  hue: 0,
  blur: 0,
  grayscale: 0,
  sepia: 0.12,
  invert: 0,
};

export const { width: W, height: H } = POST_SIZE;
