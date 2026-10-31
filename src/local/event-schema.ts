import { z } from 'zod';
export const agentEventInputSchema = z.object({
  kind: z.enum(['job', 'comment', 'voice', 'brief']),
  text: z.string().trim().min(1).max(8000),
  frame: z.number().int().min(0).default(0),
  itemId: z.string().nullable().default(null),
});
export const agentEventSchema = agentEventInputSchema.extend({
  id: z.string(),
  author: z.string(),
  turnId: z.string(),
  createdAt: z.number(),
  status: z.enum(['queued', 'in-progress', 'done']),
  actor: z.string().nullable(),
  claimedAt: z.number().nullable(),
  note: z.string().default(''),
});
export type AgentEvent = z.infer<typeof agentEventSchema>;
