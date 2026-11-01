import { z } from 'zod';
import { applyEdits, editOperationSchema } from '@/agent/edits';
import { checkMedia } from '@/agent/media';
import { elementSchema } from './element';
import {
  addElement,
  addTrack,
  findElement,
  moveElement,
  moveElementToTrack,
  moveTrack,
  projectContentEnd,
  removeElement,
  removeTrack,
  replaceElement,
  resizeElement,
  trimElementStart,
} from './mutations';
import { type Project, projectSchema } from './project';
import { trackSchema } from './track';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const mergeProps = (
  current: Record<string, unknown>,
  changes: Record<string, unknown>,
): Record<string, unknown> =>
  Object.fromEntries([
    ...Object.entries(current),
    ...Object.entries(changes).map(([key, value]) => {
      const prior = current[key];
      return [key, isRecord(prior) && isRecord(value) ? mergeProps(prior, value) : value];
    }),
  ]);
export const projectActionSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('add-item'), trackId: z.string(), element: elementSchema }),
  z.object({ type: z.literal('replace-item'), element: elementSchema }),
  z.object({
    type: z.literal('update-props'),
    id: z.string(),
    props: z.record(z.string(), z.unknown()),
  }),
  z.object({
    type: z.literal('move-item'),
    id: z.string(),
    from: z.number(),
    trackId: z.string().optional(),
  }),
  z.object({ type: z.literal('delete-item'), id: z.string() }),
  z.object({ type: z.literal('resize-item'), id: z.string(), duration: z.number() }),
  z.object({ type: z.literal('trim-item'), id: z.string(), from: z.number() }),
  z.object({ type: z.literal('add-track'), track: trackSchema }),
  z.object({ type: z.literal('delete-track'), id: z.string() }),
  z.object({ type: z.literal('move-track'), id: z.string(), direction: z.enum(['up', 'down']) }),
  z.object({ type: z.literal('replace-project'), project: projectSchema }),
  z.object({ type: z.literal('patch'), operations: z.array(editOperationSchema).max(1000) }),
]);
export type ProjectAction = z.infer<typeof projectActionSchema>;
export const reduceProjectAction = (project: Project, action: ProjectAction): Project => {
  let next: Project;
  switch (action.type) {
    case 'add-item':
      next = addElement(project, action.trackId, action.element);
      break;
    case 'replace-item':
      next = replaceElement(project, action.element);
      break;
    case 'update-props': {
      const found = findElement(project, action.id);
      if (found?.element.type !== 'composition') {
        throw new Error('Select an animation item.');
      }
      next = replaceElement(project, {
        ...found.element,
        props: mergeProps(found.element.props, action.props),
      });
      break;
    }
    case 'move-item':
      next = action.trackId
        ? moveElementToTrack(project, action.id, action.trackId, action.from)
        : moveElement(project, action.id, action.from);
      break;
    case 'delete-item':
      next = removeElement(project, action.id);
      break;
    case 'resize-item':
      next = resizeElement(project, action.id, action.duration);
      break;
    case 'trim-item':
      next = trimElementStart(project, action.id, action.from);
      break;
    case 'add-track':
      next = addTrack(project, action.track);
      break;
    case 'delete-track':
      next = removeTrack(project, action.id);
      break;
    case 'move-track':
      next = moveTrack(project, action.id, action.direction);
      break;
    case 'replace-project':
      next = action.project;
      break;
    case 'patch': {
      const result = applyEdits('clip', project, action.operations);
      if (!result.ok) {
        throw new Error(result.error);
      }
      next = result.document;
      break;
    }
    default: {
      const unreachable: never = action;
      throw new Error(`Unknown action: ${String(unreachable)}`);
    }
  }
  next = { ...next, durationInFrames: Math.max(next.durationInFrames, projectContentEnd(next)) };
  const checked = checkMedia('clip', next);
  if (!checked.ok) {
    throw new Error(checked.error);
  }
  return checked.document;
};
