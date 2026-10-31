import type { Project } from '@/project';
import { changedItemIds } from './presence';
import { ProjectProblem } from './project-problem';
import type { ProjectState } from './project-state';

const canvasChanged = (before: Project, after: Project) =>
  ['width', 'height', 'fps', 'background', 'durationInFrames'].some(
    (key) => Reflect.get(before, key) !== Reflect.get(after, key),
  );
export const assertEditable = (state: ProjectState, next: Project, actor: string) => {
  const changed = changedItemIds(state.project, next);
  const agent = state.agent;
  if (
    agent?.status === 'working' &&
    agent.actor !== actor &&
    changed.some((id) => agent.itemIds.includes(id))
  ) {
    throw new ProjectProblem('This item is locked while the agent edits it.', 423);
  }
  const event = state.events.find(
    (entry) =>
      entry.status === 'in-progress' &&
      (entry.actor === actor || actor.startsWith('agent:')) &&
      entry.itemId !== null,
  );
  if (event && (canvasChanged(state.project, next) || changed.some((id) => id !== event.itemId))) {
    throw new ProjectProblem('Change only the item attached to this event, then resolve it.', 423);
  }
  const assigned = state.comments.filter(
    (comment) =>
      comment.status === 'in-progress' && comment.actor === actor && comment.itemId !== null,
  );
  if (!actor.startsWith('agent:') || assigned.length === 0) {
    return;
  }
  if (
    canvasChanged(state.project, next) ||
    changed.some((id) => !assigned.some((comment) => comment.itemId === id))
  ) {
    throw new ProjectProblem(
      'A comment is in progress. Change only its item, then resolve it.',
      423,
    );
  }
};
