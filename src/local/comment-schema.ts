import { z } from 'zod';
export const commentSchema = z.object({
  id: z.string(),
  text: z.string(),
  frame: z.number().int().min(0),
  itemId: z.string().nullable(),
  status: z.enum(['open', 'in-progress', 'done']),
  note: z.string(),
  createdAt: z.number(),
  actor: z.string().nullable(),
});
