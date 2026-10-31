import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const countUpSchema = webMotionSchema;
export const countUpDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{ text: 'COUNT UP', subtitle: 'From a web component to your next video.', primary: '#fb923c' },
};
export type CountUpProps = WebMotionProps;
export const countUpMeta: ClipMeta = {
  id: 'count-up',
  title: 'Count Up',
  description: 'An oversized statistic counts upward above a small caption.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/count-up.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('magicui', 'number-ticker'),
};
