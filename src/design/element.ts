import { z } from 'zod';
import { fillSchema } from './fill';

export const shadowSchema = z.object({
  color: z.string(),
  blur: z.number().min(0),
  offsetX: z.number(),
  offsetY: z.number(),
});

const baseShape = {
  id: z.string().min(1),
  name: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  rotation: z.number(),
  opacity: z.number().min(0).max(1),
  locked: z.boolean(),
  hidden: z.boolean(),
  groupId: z.string().optional(),
  shadow: shadowSchema.optional(),
};

const boxShape = {
  ...baseShape,
  height: z.number().positive(),
};

const strokeShape = {
  stroke: z.string(),
  strokeWidth: z.number().min(0),
  dashed: z.boolean(),
};

export const TEXT_ALIGNS = ['left', 'center', 'right'] as const;

export const textBackgroundSchema = z.object({
  fill: z.string(),
  padding: z.number().min(0),
  radius: z.number().min(0),
});

export const imageCropSchema = z.object({
  zoom: z.number().min(1).max(5),
  focusX: z.number().min(0).max(1),
  focusY: z.number().min(0).max(1),
});

export const textElementSchema = z.object({
  ...baseShape,
  type: z.literal('text'),
  text: z.string(),
  fontFamily: z.string().min(1),
  fontSize: z.number().positive(),
  fontWeight: z.number().int().min(100).max(900),
  italic: z.boolean(),
  underline: z.boolean(),
  strikethrough: z.boolean(),
  uppercase: z.boolean(),
  align: z.enum(TEXT_ALIGNS),
  lineHeight: z.number().positive(),
  letterSpacing: z.number(),
  fill: fillSchema,
  stroke: z.string(),
  strokeWidth: z.number().min(0),
  background: textBackgroundSchema.optional(),
});

export const rectElementSchema = z.object({
  ...boxShape,
  ...strokeShape,
  type: z.literal('rect'),
  fill: fillSchema,
  cornerRadius: z.number().min(0),
});

export const ellipseElementSchema = z.object({
  ...boxShape,
  ...strokeShape,
  type: z.literal('ellipse'),
  fill: fillSchema,
});

export const polygonElementSchema = z.object({
  ...boxShape,
  ...strokeShape,
  type: z.literal('polygon'),
  fill: fillSchema,
  sides: z.number().int().min(3).max(12),
});

export const starElementSchema = z.object({
  ...boxShape,
  ...strokeShape,
  type: z.literal('star'),
  fill: fillSchema,
  points: z.number().int().min(3).max(24),
  innerRatio: z.number().min(0.1).max(0.95),
});

export const pathElementSchema = z.object({
  ...boxShape,
  ...strokeShape,
  type: z.literal('path'),
  fill: fillSchema,
  data: z.string().min(1),
  viewWidth: z.number().positive(),
  viewHeight: z.number().positive(),
});

export const lineElementSchema = z.object({
  ...baseShape,
  type: z.literal('line'),
  stroke: z.string(),
  strokeWidth: z.number().positive(),
  dashed: z.boolean(),
  arrowStart: z.boolean(),
  arrowEnd: z.boolean(),
});

export const IMAGE_FITS = ['cover', 'contain', 'stretch'] as const;

export const imageFiltersSchema = z.object({
  brightness: z.number().min(0).max(2),
  contrast: z.number().min(0).max(2),
  saturation: z.number().min(0).max(3),
  hue: z.number().min(-180).max(180),
  blur: z.number().min(0).max(40),
  grayscale: z.number().min(0).max(1),
  sepia: z.number().min(0).max(1),
  invert: z.number().min(0).max(1),
});

export const imageElementSchema = z.object({
  ...boxShape,
  type: z.literal('image'),
  src: z.string(),
  fit: z.enum(IMAGE_FITS),
  cornerRadius: z.number().min(0),
  flipX: z.boolean(),
  flipY: z.boolean(),
  stroke: z.string(),
  strokeWidth: z.number().min(0),
  filters: imageFiltersSchema,
  crop: imageCropSchema.optional(),
});

export const iconElementSchema = z.object({
  ...boxShape,
  type: z.literal('icon'),
  icon: z.string().min(1),
  color: z.string(),
  strokeWidth: z.number().positive(),
});

export const designElementSchema = z.discriminatedUnion('type', [
  textElementSchema,
  rectElementSchema,
  ellipseElementSchema,
  polygonElementSchema,
  starElementSchema,
  pathElementSchema,
  lineElementSchema,
  imageElementSchema,
  iconElementSchema,
]);

export type Shadow = z.infer<typeof shadowSchema>;
export type TextBackground = z.infer<typeof textBackgroundSchema>;
export type ImageCrop = z.infer<typeof imageCropSchema>;
export type TextAlign = (typeof TEXT_ALIGNS)[number];
export type ImageFit = (typeof IMAGE_FITS)[number];
export type ImageFilters = z.infer<typeof imageFiltersSchema>;
export type TextElement = z.infer<typeof textElementSchema>;
export type RectElement = z.infer<typeof rectElementSchema>;
export type EllipseElement = z.infer<typeof ellipseElementSchema>;
export type PolygonElement = z.infer<typeof polygonElementSchema>;
export type StarElement = z.infer<typeof starElementSchema>;
export type PathElement = z.infer<typeof pathElementSchema>;
export type LineElement = z.infer<typeof lineElementSchema>;
export type ImageElement = z.infer<typeof imageElementSchema>;
export type IconElement = z.infer<typeof iconElementSchema>;
export type DesignElement = z.infer<typeof designElementSchema>;
export type DesignElementType = DesignElement['type'];
export type BoxElement = Exclude<DesignElement, TextElement | LineElement>;

export const hasHeight = (element: DesignElement): element is BoxElement =>
  element.type !== 'text' && element.type !== 'line';
