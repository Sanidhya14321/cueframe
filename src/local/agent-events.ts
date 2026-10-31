// biome-ignore-all lint/performance/noAwaitInLoops: ordered polling and atomic claims
import { randomUUID } from 'node:crypto';
import type { z } from 'zod';
import { commentSchema } from './comment-schema';
import { agentEventInputSchema, agentEventSchema } from './event-schema';
import { mutateProject, ProjectProblem, readProject } from './projects';

export const enqueueEvent = (projectId: string, input: z.input<typeof agentEventInputSchema>) =>
  mutateProject(projectId, (state) => {
    const data = agentEventInputSchema.parse(input);
    if (
      data.itemId &&
      !state.project.tracks.some((track) => track.elements.some((item) => item.id === data.itemId))
    ) {
      throw new ProjectProblem('Select an existing item.');
    }
    const event = agentEventSchema.parse({
      ...data,
      id: randomUUID(),
      author: 'You',
      turnId: randomUUID(),
      createdAt: Date.now(),
      status: 'queued',
      actor: null,
      claimedAt: null,
    });
    return {
      ...state,
      events: [...state.events, event],
      comments:
        data.kind === 'comment'
          ? [...state.comments, commentSchema.parse({ ...event, status: 'open', actor: null })]
          : state.comments,
      brief: data.kind === 'brief' ? data.text : state.brief,
    };
  });

export const waitForEvents = async (projectId: string, actor: string, timeout: number) => {
  const deadline = Date.now() + Math.min(55, Math.max(0, timeout)) * 1000;
  do {
    const current = await readProject(projectId);
    const eligible = current.events.some(
      (event) =>
        event.status === 'queued' ||
        (event.status === 'in-progress' &&
          (event.actor === actor || Date.now() - (event.claimedAt ?? 0) > 60000)),
    );
    const comment = current.comments.some((entry) => entry.status === 'open');
    if (eligible || comment) {
      let claimed: typeof current.events = [];
      await mutateProject(projectId, (state) => {
        const events = [...state.events];
        for (const entry of state.comments.filter((item) => item.status === 'open')) {
          if (!events.some((event) => event.id === entry.id)) {
            events.push(
              agentEventSchema.parse({
                id: entry.id,
                kind: 'comment',
                text: entry.text,
                itemId: entry.itemId,
                frame: entry.frame,
                author: 'You',
                turnId: randomUUID(),
                createdAt: entry.createdAt,
                status: 'queued',
                actor: null,
                claimedAt: null,
              }),
            );
          }
        }
        const candidate =
          events.find((event) => event.status === 'in-progress' && event.actor === actor) ??
          events.find(
            (event) =>
              event.status === 'queued' ||
              (event.status === 'in-progress' && Date.now() - (event.claimedAt ?? 0) > 60000),
          );
        if (!candidate) {
          return state;
        }
        const next = { ...candidate, status: 'in-progress' as const, actor, claimedAt: Date.now() };
        claimed = [next];
        return {
          ...state,
          events: events.map((event) => (event.id === next.id ? next : event)),
          comments: state.comments.map((entry) =>
            entry.id === next.id ? { ...entry, status: 'in-progress' as const, actor } : entry,
          ),
        };
      });
      if (claimed.length > 0) {
        return claimed;
      }
    }
    if (Date.now() >= deadline) {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  } while (Date.now() < deadline);
  return [];
};
export const resolveEvent = (projectId: string, id: string, note: string, actor: string) =>
  mutateProject(projectId, (state) => {
    const event = state.events.find((entry) => entry.id === id);
    if (!event || event.actor !== actor || event.status !== 'in-progress') {
      throw new ProjectProblem('Only the agent handling this event can resolve it.', 409);
    }
    return {
      ...state,
      events: state.events.map((entry) =>
        entry.id === id ? { ...entry, status: 'done', note } : entry,
      ),
      comments: state.comments.map((entry) =>
        entry.id === id ? { ...entry, status: 'done', note, actor } : entry,
      ),
    };
  });
