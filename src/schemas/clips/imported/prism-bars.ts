import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const prismBarsSchema = webMotionSchema;
export const prismBarsDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{
    text: 'MAKE YOUR NEXT MOVE',
    subtitle: 'A little motion. A lasting impression.',
    primary: '#f472b6',
  },
};
export type PrismBarsProps = WebMotionProps;
export const prismBarsMeta: ClipMeta = {
  id: 'prism-bars',
  title: 'Prism Bars',
  description: 'Tall colored bars rise and recede in a rhythmic, geometric field.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/prism-bars.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('original', ''),
};
