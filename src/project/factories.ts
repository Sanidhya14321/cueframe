import { defaultAnimation } from './animation';
import type {
  CompositionElement,
  ImageElement,
  ShapeElement,
  ShapeKind,
  TextElement,
  VideoElement,
} from './element';
import { createId } from './ids';
import type { Track } from './track';
import { identityTransform } from './transform';

const sharedDefaults = () => ({
  from: 0,
  durationInFrames: 90,
  transform: identityTransform(),
  animation: defaultAnimation(),
});

export const createTextElement = (overrides: Partial<TextElement> = {}): TextElement => ({
  type: 'text',
  id: createId('text'),
  content: 'New text',
  fontSize: 96,
  color: '#f5f5f5',
  fontFamily: 'Inter, sans-serif',
  ...sharedDefaults(),
  ...overrides,
});

export const createImageElement = (overrides: Partial<ImageElement> = {}): ImageElement => ({
  type: 'image',
  id: createId('image'),
  src: '',
  ...sharedDefaults(),
  ...overrides,
});

export const createVideoElement = (overrides: Partial<VideoElement> = {}): VideoElement => ({
  type: 'video',
  id: createId('video'),
  src: '',
  ...sharedDefaults(),
  ...overrides,
});

export const createShapeElement = (
  kind: ShapeKind = 'rect',
  overrides: Partial<ShapeElement> = {},
): ShapeElement => ({
  type: 'shape',
  id: createId('shape'),
  kind,
  color: '#6366f1',
  width: 480,
  height: 480,
  radius: 32,
  ...sharedDefaults(),
  ...overrides,
});

export const createCompositionElement = (
  clipId: string,
  props: Record<string, unknown>,
  overrides: Partial<CompositionElement> = {},
): CompositionElement => ({
  type: 'composition',
  id: createId('composition'),
  clipId,
  props,
  ...sharedDefaults(),
  animation: { kind: 'none', easing: 'linear', durationInFrames: 0 },
  ...overrides,
});

export const createTrack = (name: string): Track => ({
  id: createId('track'),
  name,
  elements: [],
});
