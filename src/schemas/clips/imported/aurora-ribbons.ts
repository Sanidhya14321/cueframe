import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const auroraRibbonsSchema = webMotionSchema;
export const auroraRibbonsDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{
    text: 'EVERY FRAME MATTERS',
    subtitle: 'From a web component to your next video.',
    primary: '#fb923c',
  },
};
export type AuroraRibbonsProps = WebMotionProps;
export const auroraRibbonsMeta: ClipMeta = {
  id: 'aurora-ribbons',
  title: 'Aurora Ribbons',
  description: 'Soft layered ribbons sweep behind large, high-contrast typography.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/aurora-ribbons.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('original', ''),
};
