import { z } from 'zod';
import { trackSchema } from './track';

export const projectSchema = z.object({
  fps: z.number().int().positive(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  durationInFrames: z.number().int().positive(),
  background: z.string(),
  tracks: z.array(trackSchema),
  opencut: z
    .object({
      version: z.number().int().optional(),
      document: z.string(),
      media: z.string(),
      source: z.string(),
    })
    .optional(),
});

export type Project = z.infer<typeof projectSchema>;

export const parseProject = (value: unknown): Project => projectSchema.parse(value);

export const safeParseProject = (value: unknown): Project | null => {
  const result = projectSchema.safeParse(value);
  return result.success ? result.data : null;
};
