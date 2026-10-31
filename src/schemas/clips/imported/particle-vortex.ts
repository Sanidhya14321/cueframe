import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const particleVortexSchema = webMotionSchema;
export const particleVortexDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{
    text: 'CREATE SOMETHING GREAT',
    subtitle: 'Your message, with a little momentum.',
    primary: '#a3e635',
  },
};
export type ParticleVortexProps = WebMotionProps;
export const particleVortexMeta: ClipMeta = {
  id: 'particle-vortex',
  title: 'Particle Vortex',
  description: 'Seeded particles orbit into a luminous vortex around a quiet center.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/particle-vortex.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('original', ''),
};
