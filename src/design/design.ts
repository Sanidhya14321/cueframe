import { z } from 'zod';
import { designControlSchema } from './controls';
import { designElementSchema } from './element';
import { fillSchema } from './fill';

export const designSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  background: fillSchema,
  elements: z.array(designElementSchema),
  controls: z.array(designControlSchema),
});

export type Design = z.infer<typeof designSchema>;

export interface DesignFormat {
  id: string;
  label: string;
  width: number;
  height: number;
}

export const DESIGN_FORMATS = [
  { id: 'square-post', label: 'Instagram post', width: 1080, height: 1080 },
  { id: 'portrait-post', label: 'Portrait post', width: 1080, height: 1350 },
  { id: 'story', label: 'Story / Reel', width: 1080, height: 1920 },
  { id: 'linkedin-post', label: 'LinkedIn post', width: 1200, height: 1200 },
  { id: 'landscape', label: 'Landscape post', width: 1200, height: 628 },
  { id: 'presentation', label: 'Presentation', width: 1920, height: 1080 },
  { id: 'poster', label: 'Poster', width: 1240, height: 1754 },
] as const satisfies readonly DesignFormat[];

export type DesignFormatId = (typeof DESIGN_FORMATS)[number]['id'];

export const findDesignFormat = (id: string): DesignFormat | undefined =>
  DESIGN_FORMATS.find((format) => format.id === id);
