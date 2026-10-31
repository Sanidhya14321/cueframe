/* biome-ignore-all lint/performance/noAwaitInLoops: local actions, leases and media steps must execute in order */
import { randomUUID } from 'node:crypto';
import { commentSchema } from './comment-schema';
import { mutateProject, ProjectProblem, readProject } from './projects';

export const addComment = (
  projectId: string,
  input: { text: string; frame: number; itemId?: string | undefined },
) =>
  mutateProject(projectId, (state) => {
    const itemId =
      input.itemId ??
      state.project.tracks
        .flatMap((track) => track.elements)
        .find((item) => input.frame >= item.from && input.frame < item.from + item.durationInFrames)
        ?.id ??
      null;
    const comment = commentSchema.parse({
      ...input,
      id: randomUUID(),
      itemId,
      status: 'open',
      note: '',
      createdAt: Date.now(),
      actor: null,
    });
    return { ...state, comments: [...state.comments, comment].slice(-300) };
  });
export const waitForComments = async (projectId: string, actor: string, timeout: number) => {
  const deadline = Date.now() + Math.min(55000, timeout * 1000);
  do {
    const state = await readProject(projectId);
    const pending = state.comments.filter((comment) => comment.status === 'open');
    if (pending.length > 0) {
      await mutateProject(projectId, (current) => ({
        ...current,
        events: current.events.map((event) =>
          pending.some((entry) => entry.id === event.id)
            ? { ...event, status: 'in-progress' as const, actor, claimedAt: Date.now() }
            : event,
        ),
        comments: current.comments.map((comment) =>
          pending.some((entry) => entry.id === comment.id)
            ? { ...comment, status: 'in-progress', actor }
            : comment,
        ),
      }));
      return pending.map(({ id, text, itemId, frame }) => ({ id, text, itemId, frame }));
    }
    if (Date.now() >= deadline) {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  } while (Date.now() < deadline);
  return [];
};
export const resolveComment = (projectId: string, id: string, note: string, actor: string) =>
  mutateProject(projectId, (state) => {
    if (!state.comments.some((comment) => comment.id === id)) {
      throw new ProjectProblem('Unknown comment.');
    }
    return {
      ...state,
      events: state.events.map((event) =>
        event.id === id ? { ...event, status: 'done', note, actor } : event,
      ),
      comments: state.comments.map((comment) =>
        comment.id === id ? { ...comment, status: 'done', note, actor } : comment,
      ),
    };
  });
