import { z } from 'zod';
import { animationSchema } from './animation';
import { transformSchema } from './transform';

export const SHAPE_KINDS = ['rect', 'ellipse'] as const;

export type ShapeKind = (typeof SHAPE_KINDS)[number];

const baseElementShape = {
  id: z.string().min(1),
  opencut: z.string().optional(),
  sourceFrom: z.number().int().min(0).optional(),
  from: z.number().int().min(0),
  durationInFrames: z.number().int().min(1),
  transform: transformSchema,
  animation: animationSchema.optional(),
};

export const textElementSchema = z.object({
  ...baseElementShape,
  type: z.literal('text'),
  content: z.string(),
  fontSize: z.number().positive(),
  color: z.string(),
  fontFamily: z.string(),
});

export const imageElementSchema = z.object({
  ...baseElementShape,
  type: z.literal('image'),
  src: z.string(),
});

export const videoElementSchema = z.object({
  ...baseElementShape,
  type: z.literal('video'),
  src: z.string(),
  sourceFrom: z.number().int().min(0).optional(),
  punchIns: z
    .array(z.object({ from: z.number(), to: z.number(), scale: z.number().min(1).max(1.2) }))
    .optional(),
});

export const shapeElementSchema = z.object({
  ...baseElementShape,
  type: z.literal('shape'),
  kind: z.enum(SHAPE_KINDS),
  color: z.string(),
  width: z.number().positive(),
  height: z.number().positive(),
  radius: z.number().min(0),
});

export const compositionElementSchema = z.object({
  ...baseElementShape,
  type: z.literal('composition'),
  clipId: z.string().min(1),
  voiceLine: z.string().optional(),
  props: z.record(z.string(), z.unknown()),
});

export const audioElementSchema = z.object({
  ...baseElementShape,
  type: z.literal('audio'),
  src: z.string(),
  volume: z.number().min(0).max(1),
  playbackRate: z.number().min(0.5).max(2).optional(),
  role: z.enum(['music', 'voice', 'effect']),
  loop: z.boolean().optional(),
  duckRegions: z.array(z.object({ from: z.number(), to: z.number() })).optional(),
});
export const captionWordSchema = z.object({
  text: z.string(),
  startMs: z.number().min(0),
  endMs: z.number().min(0),
});
export const captionsElementSchema = z.object({
  ...baseElementShape,
  type: z.literal('captions'),
  words: z.array(captionWordSchema),
  fontSize: z.number().positive(),
  color: z.string(),
  activeColor: z.string(),
  background: z.string(),
});
export type AudioElement = z.infer<typeof audioElementSchema>;
export type CaptionsElement = z.infer<typeof captionsElementSchema>;
export const elementSchema = z.discriminatedUnion('type', [
  textElementSchema,
  imageElementSchema,
  videoElementSchema,
  shapeElementSchema,
  compositionElementSchema,
  audioElementSchema,
  captionsElementSchema,
]);

export type TextElement = z.infer<typeof textElementSchema>;
export type ImageElement = z.infer<typeof imageElementSchema>;
export type VideoElement = z.infer<typeof videoElementSchema>;
export type ShapeElement = z.infer<typeof shapeElementSchema>;
export type CompositionElement = z.infer<typeof compositionElementSchema>;
export type Element = z.infer<typeof elementSchema>;
export type ElementType = Element['type'];
