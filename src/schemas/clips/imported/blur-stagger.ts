import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const blurStaggerSchema = webMotionSchema;
export const blurStaggerDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{
    text: 'BUILT FOR YOUR IDEAS',
    subtitle: 'From a web component to your next video.',
    primary: '#38bdf8',
  },
};
export type BlurStaggerProps = WebMotionProps;
export const blurStaggerMeta: ClipMeta = {
  id: 'blur-stagger',
  title: 'Blur Stagger',
  description: 'Words rise out of a soft blur and settle into a crisp headline.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/blur-stagger.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('motion-primitives', 'text-effect'),
};
