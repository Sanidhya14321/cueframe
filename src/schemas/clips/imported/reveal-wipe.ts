import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const revealWipeSchema = webMotionSchema;
export const revealWipeDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{
    text: 'EVERY FRAME MATTERS',
    subtitle: 'A little motion. A lasting impression.',
    primary: '#a3e635',
  },
};
export type RevealWipeProps = WebMotionProps;
export const revealWipeMeta: ClipMeta = {
  id: 'reveal-wipe',
  title: 'Reveal Wipe',
  description: 'A clean colored wipe unveils a strong editorial headline.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/reveal-wipe.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('magicui', 'blur-fade'),
};
