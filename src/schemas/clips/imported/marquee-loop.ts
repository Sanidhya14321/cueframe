import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const marqueeLoopSchema = webMotionSchema;
export const marqueeLoopDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{
    text: 'CREATE SOMETHING GREAT',
    subtitle: 'Your message, with a little momentum.',
    primary: '#38bdf8',
  },
};
export type MarqueeLoopProps = WebMotionProps;
export const marqueeLoopMeta: ClipMeta = {
  id: 'marquee-loop',
  title: 'Marquee Loop',
  description: 'Two oversized rows of typography scroll in opposing directions.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/marquee-loop.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('magicui', 'marquee'),
};
