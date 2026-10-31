import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const gradientFlowSchema = webMotionSchema;
export const gradientFlowDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{
    text: 'MAKE YOUR NEXT MOVE',
    subtitle: 'A little motion. A lasting impression.',
    primary: '#a78bfa',
  },
};
export type GradientFlowProps = WebMotionProps;
export const gradientFlowMeta: ClipMeta = {
  id: 'gradient-flow',
  title: 'Gradient Flow',
  description: 'A luminous gradient glides through a large centered headline.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/gradient-flow.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('magicui', 'animated-gradient-text'),
};
