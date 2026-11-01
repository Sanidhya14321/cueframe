import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { type AgentLogEntry, type AgentLogView, agentLogSchema } from './agent-log-schema';
import { serialDisk } from './file-lock';
import { readJson, writeJson } from './files';
import { projectDirectory } from './projects';

const MAX_ENTRIES = 300;
const LISTENING_TTL_MS = 70000;
const IGNORED_TOOLS = new Set(['get_job', 'share_update', 'wait_for_comments', 'wait_for_events']);
const logPath = async (projectId: string) =>
  join(await projectDirectory(projectId), 'agent-log.json');
const readLog = async (path: string) => agentLogSchema.parse((await readJson(path)) ?? {});
const updateLog = async (
  projectId: string,
  change: (log: ReturnType<typeof agentLogSchema.parse>) => typeof log,
) => {
  const path = await logPath(projectId);
  await serialDisk(path, async () => writeJson(path, change(await readLog(path))));
};
export const readAgentLog = async (projectId: string): Promise<AgentLogView> => {
  const log = await readLog(await logPath(projectId));
  return {
    listening: Date.now() - log.listeningAt < LISTENING_TTL_MS,
    entries: log.entries,
  };
};
export const markListening = (projectId: string) =>
  updateLog(projectId, (log) => ({ ...log, listeningAt: Date.now() }));
export const appendAgentLog = (
  projectId: string,
  entry: Pick<AgentLogEntry, 'kind' | 'text'> & { itemIds?: string[] },
) =>
  updateLog(projectId, (log) => ({
    ...log,
    entries: [
      ...log.entries,
      {
        id: randomUUID(),
        at: Date.now(),
        kind: entry.kind,
        text: entry.text.slice(0, 1000),
        itemIds: entry.itemIds ?? [],
      },
    ].slice(-MAX_ENTRIES),
  }));

type ToolFields = Partial<
  Record<'projectId' | 'clipId' | 'id' | 'brief' | 'title' | 'label' | 'note', unknown>
>;
const toolText = (tool: string, input: ToolFields) => {
  const name = tool.replaceAll('_', ' ');
  const detail = [input.clipId, input.id, input.brief, input.title, input.label].find(
    (value) => typeof value === 'string' && value.length > 0,
  );
  return `${name[0]?.toUpperCase()}${name.slice(1)}${detail ? `: ${String(detail).slice(0, 160)}` : ''}`;
};
export const logToolCall = async (tool: string, input: unknown, problem?: string) => {
  const fields = (input ?? {}) as ToolFields;
  const projectId = fields.projectId;
  if (typeof projectId !== 'string' || IGNORED_TOOLS.has(tool)) {
    return;
  }
  const label = toolText(tool, fields);
  if (problem !== undefined) {
    await appendAgentLog(projectId, { kind: 'error', text: `${label} failed: ${problem}` });
  } else if (tool === 'resolve_event' && typeof fields.note === 'string') {
    await appendAgentLog(projectId, { kind: 'reply', text: fields.note });
  } else {
    await appendAgentLog(projectId, {
      kind: 'tool',
      text: label,
      itemIds: typeof fields.id === 'string' ? [fields.id] : [],
    });
  }
};
