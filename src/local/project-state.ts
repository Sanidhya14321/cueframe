import { z } from 'zod';
import { projectSchema } from '@/project';
import { commentSchema } from './comment-schema';
import { agentEventSchema } from './event-schema';
import { agentPresenceSchema, changedItemIds } from './presence';

const journalSchema = z.object({
  id: z.string(),
  actor: z.string(),
  author: z.string().default('Agent'),
  turnId: z.string(),
  label: z.string(),
  before: projectSchema,
  after: projectSchema,
  undone: z.boolean().default(false),
  at: z.number(),
});
export const projectStateSchema = z.object({
  id: z.string(),
  title: z.string(),
  sourceKey: z.string().optional(),
  project: projectSchema,
  nativeVideo: z
    .object({
      revision: z.number().int().min(0),
      duration: z.number().min(0),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      fps: z.number().positive(),
      tracks: z.number().int().min(0),
    })
    .optional(),
  revision: z.number().int().default(0),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  comments: z.array(commentSchema).default([]),
  agent: agentPresenceSchema.nullable().default(null),
  events: z.array(agentEventSchema).default([]),
  brief: z.string().default(''),
  history: z.array(journalSchema).default([]),
});
export type ProjectState = z.infer<typeof projectStateSchema>;
export type PublicProjectState = Omit<ProjectState, 'history'> & {
  canUndo: boolean;
  canRedo: boolean;
  activity: {
    id: string;
    actor: string;
    author: string;
    turnId: string;
    label: string;
    at: number;
    itemIds: string[];
  }[];
};
export const publicProjectState = ({ history, ...state }: ProjectState): PublicProjectState => ({
  ...state,
  canUndo: history.some((entry) => !entry.undone),
  canRedo: history.some((entry) => entry.undone),
  activity: history.slice(-30).map((entry) => ({
    id: entry.id,
    actor: entry.actor,
    author: entry.author,
    turnId: entry.turnId,
    label: entry.label,
    at: entry.at,
    itemIds: changedItemIds(entry.before, entry.after),
  })),
});
