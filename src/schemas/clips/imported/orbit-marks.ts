import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const orbitMarksSchema = webMotionSchema;
export const orbitMarksDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{
    text: 'MAKE YOUR NEXT MOVE',
    subtitle: 'From a web component to your next video.',
    primary: '#38bdf8',
  },
};
export type OrbitMarksProps = WebMotionProps;
export const orbitMarksMeta: ClipMeta = {
  id: 'orbit-marks',
  title: 'Orbit Marks',
  description: 'Small geometric marks orbit a central statement at different speeds.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/orbit-marks.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('magicui', 'orbiting-circles'),
};
