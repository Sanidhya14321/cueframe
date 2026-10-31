import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const scrambleTitleSchema = webMotionSchema;
export const scrambleTitleDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{
    text: 'CREATE SOMETHING GREAT',
    subtitle: 'A little motion. A lasting impression.',
    primary: '#a3e635',
  },
};
export type ScrambleTitleProps = WebMotionProps;
export const scrambleTitleMeta: ClipMeta = {
  id: 'scramble-title',
  title: 'Scramble Title',
  description: 'A deterministic field of changing glyphs resolves into your headline.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/scramble-title.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('magicui', 'hyper-text'),
};
