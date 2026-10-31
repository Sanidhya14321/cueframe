import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const shineCalloutSchema = webMotionSchema;
export const shineCalloutDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{
    text: 'BUILT FOR YOUR IDEAS',
    subtitle: 'A little motion. A lasting impression.',
    primary: '#38bdf8',
  },
};
export type ShineCalloutProps = WebMotionProps;
export const shineCalloutMeta: ClipMeta = {
  id: 'shine-callout',
  title: 'Shine Callout',
  description: 'A pill-shaped callout floats above a moving illuminated border.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/shine-callout.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('21st', 'shimmer-button'),
};
