import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const rippleFieldSchema = webMotionSchema;
export const rippleFieldDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{
    text: 'MAKE YOUR NEXT MOVE',
    subtitle: 'A little motion. A lasting impression.',
    primary: '#fb923c',
  },
};
export type RippleFieldProps = WebMotionProps;
export const rippleFieldMeta: ClipMeta = {
  id: 'ripple-field',
  title: 'Ripple Field',
  description: 'Concentric circles pulse outward behind a centered message.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/ripple-field.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('magicui', 'ripple'),
};
