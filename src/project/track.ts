import { z } from 'zod';
import { elementSchema } from './element';

export const trackSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  hidden: z.boolean().optional(),
  muted: z.boolean().optional(),
  elements: z.array(elementSchema),
});

export type Track = z.infer<typeof trackSchema>;
