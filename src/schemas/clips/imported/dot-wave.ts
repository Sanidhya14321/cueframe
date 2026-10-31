import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const dotWaveSchema = webMotionSchema;
export const dotWaveDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{
    text: 'BUILT FOR YOUR IDEAS',
    subtitle: 'From a web component to your next video.',
    primary: '#a3e635',
  },
};
export type DotWaveProps = WebMotionProps;
export const dotWaveMeta: ClipMeta = {
  id: 'dot-wave',
  title: 'Dot Wave',
  description: 'A regular field of dots shimmers in waves beneath a clear headline.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/dot-wave.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('magicui', 'dot-pattern'),
};
