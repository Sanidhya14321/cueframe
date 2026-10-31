import { z } from 'zod';

export const transformSchema = z.object({
  x: z.number(),
  y: z.number(),
  scale: z.number().min(0),
  rotation: z.number(),
  opacity: z.number().min(0).max(1),
});

export type Transform = z.infer<typeof transformSchema>;

export const identityTransform = (): Transform => ({
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
  opacity: 1,
});
