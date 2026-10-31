import { z } from 'zod';
import type { Project } from '@/project';
export const agentPresenceSchema = z.object({
  actor: z.string(),
  name: z.string(),
  status: z.enum(['working', 'idle']),
  label: z.string(),
  itemIds: z.array(z.string()),
  heartbeat: z.number(),
  turnId: z.string(),
});
export type AgentPresence = z.infer<typeof agentPresenceSchema>;
export const changedItemIds = (before: Project, after: Project): string[] => {
  const old = new Map(
    before.tracks.flatMap((track) =>
      track.elements.map(
        (item) =>
          [
            item.id,
            { item, track: track.id, hidden: track.hidden ?? false, muted: track.muted ?? false },
          ] as const,
      ),
    ),
  );
  const next = new Map(
    after.tracks.flatMap((track) =>
      track.elements.map(
        (item) =>
          [
            item.id,
            { item, track: track.id, hidden: track.hidden ?? false, muted: track.muted ?? false },
          ] as const,
      ),
    ),
  );
  const canvasChanged =
    before.width !== after.width ||
    before.height !== after.height ||
    before.fps !== after.fps ||
    before.durationInFrames !== after.durationInFrames ||
    before.background !== after.background ||
    before.tracks.map((track) => track.id).join() !== after.tracks.map((track) => track.id).join();
  return [...new Set([...old.keys(), ...next.keys()])].filter(
    (id) => canvasChanged || JSON.stringify(old.get(id)) !== JSON.stringify(next.get(id)),
  );
};
export const activePresence = (agent: AgentPresence | null): AgentPresence | null =>
  agent?.status === 'working' && Date.now() - agent.heartbeat > 60000
    ? { ...agent, status: 'idle', itemIds: [], label: 'Agent disconnected; locks cleared.' }
    : agent;
