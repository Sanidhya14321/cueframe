import { z } from 'zod';

export const chatEngineSchema = z.enum(['auto', 'external', 'in-app']);
export const projectChatUpdateSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('status'), text: z.string() }),
  z.object({
    type: z.literal('accepted'),
    mode: z.enum(['external', 'in-app']),
    eventId: z.string(),
    waiting: z.boolean(),
  }),
  z.object({ type: z.literal('text'), id: z.string(), text: z.string() }),
  z.object({
    type: z.literal('finish'),
    mode: z.enum(['external', 'in-app']),
    waiting: z.boolean(),
  }),
  z.object({ type: z.literal('error'), message: z.string(), configurationRequired: z.boolean() }),
]);
export type ProjectChatUpdate = z.infer<typeof projectChatUpdateSchema>;
export type ChatEngine = z.infer<typeof chatEngineSchema>;
