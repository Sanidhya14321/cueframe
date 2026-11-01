import { z } from 'zod';

const agentLogEntrySchema = z.object({
  id: z.string(),
  at: z.number(),
  kind: z.enum(['thinking', 'decision', 'tool', 'reply', 'error']),
  text: z.string().max(1000),
  itemIds: z.array(z.string()).default([]),
});
export const agentLogSchema = z.object({
  listeningAt: z.number().default(0),
  entries: z.array(agentLogEntrySchema).default([]),
});
export type AgentLogEntry = z.infer<typeof agentLogEntrySchema>;
export type AgentLogView = { listening: boolean; entries: AgentLogEntry[] };
