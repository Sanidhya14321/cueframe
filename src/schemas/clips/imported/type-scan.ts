import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const typeScanSchema = webMotionSchema;
export const typeScanDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{
    text: 'BUILT FOR YOUR IDEAS',
    subtitle: 'Your message, with a little momentum.',
    primary: '#a78bfa',
  },
};
export type TypeScanProps = WebMotionProps;
export const typeScanMeta: ClipMeta = {
  id: 'type-scan',
  title: 'Type Scan',
  description: 'A glowing caret types your message one character at a time.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/type-scan.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('magicui', 'typing-animation'),
};
