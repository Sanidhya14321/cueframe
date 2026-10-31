import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const shimmerTitleSchema = webMotionSchema;
export const shimmerTitleDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{
    text: 'EVERY FRAME MATTERS',
    subtitle: 'A little motion. A lasting impression.',
    primary: '#38bdf8',
  },
};
export type ShimmerTitleProps = WebMotionProps;
export const shimmerTitleMeta: ClipMeta = {
  id: 'shimmer-title',
  title: 'Shimmer Title',
  description: 'A bright highlight travels across a calm, oversized line of text.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/shimmer-title.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('motion-primitives', 'text-shimmer'),
};
