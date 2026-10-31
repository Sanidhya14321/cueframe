/* biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: canonical history grouping and atomic native metadata share one action transaction */
import { serialDisk } from './file-lock';
import { activePresence } from './presence';
import { assertEditable } from './project-guards';
import { ProjectProblem } from './project-problem';
import 'server-only';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { customAlphabet } from 'nanoid';
import { checkMedia } from '@/agent/media';
import type { Project } from '@/project';
import { type ProjectAction, reduceProjectAction } from '@/project/actions';
import { undoContribution } from '@/project/merge-undo';
import { ensureDirectory, readJson, writeJson } from './files';
import { type ProjectState, projectStateSchema } from './project-state';
import { readSettings } from './settings';

// biome-ignore lint/security/noSecrets: lowercase alphanumeric ID alphabet
const newId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 12);
const validId = (id: string) => /^[a-z0-9]{12}$/.test(id);

export { ProjectProblem } from './project-problem';

const projectsFolder = async (): Promise<string> => {
  const folder = join((await readSettings()).dataFolder, 'projects');
  await ensureDirectory(folder);
  return folder;
};
export const projectDirectory = async (id: string): Promise<string> => {
  if (!validId(id)) {
    throw new ProjectProblem('Unknown project.', 404);
  }
  const folder = join(await projectsFolder(), id);
  await ensureDirectory(folder);
  return folder;
};
export const readProject = async (id: string): Promise<ProjectState> => {
  const raw = await readJson(join(await projectDirectory(id), 'project.json'));
  if (raw === null) {
    throw new ProjectProblem('Unknown project.', 404);
  }
  const state = projectStateSchema.parse(raw);
  const agent = activePresence(state.agent);
  return agent?.label === state.agent?.label
    ? { ...state, agent }
    : { ...state, agent, revision: state.revision + 1 };
};
export const listProjects = async (): Promise<ProjectState[]> => {
  const names = await readdir(await projectsFolder());
  const rows = await Promise.all(
    names.filter(validId).map(async (id) => {
      try {
        return await readProject(id);
      } catch (error) {
        if (error instanceof ProjectProblem && error.status === 404) {
          return null;
        }
        throw error;
      }
    }),
  );
  return rows
    .filter((row): row is ProjectState => row !== null)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};
const summaries = new Map<string, { modified: number; summary: ProjectSummary }>();
export interface ProjectSummary {
  id: string;
  title: string;
  revision: number;
  updated: number;
  seconds: number;
  size: string;
  engine: string;
}
export const listProjectSummaries = async (): Promise<ProjectSummary[]> => {
  const folder = await projectsFolder();
  const rows = await Promise.all(
    (await readdir(folder)).filter(validId).map(async (id) => {
      const file = await stat(join(folder, id, 'project.json')).catch(() => null);
      if (!file) {
        return null;
      }
      const cached = summaries.get(id);
      if (cached?.modified === file.mtimeMs) {
        return cached.summary;
      }
      const state = await readProject(id);
      const summary = {
        id,
        title: state.title,
        revision: state.revision,
        updated: state.updatedAt.getTime(),
        seconds: state.nativeVideo?.duration || state.project.durationInFrames / state.project.fps,
        size: `${state.project.width}×${state.project.height}`,
        engine: state.nativeVideo ? 'Edited video' : 'Animation source',
      };
      summaries.set(id, { modified: file.mtimeMs, summary });
      return summary;
    }),
  );
  return rows
    .filter((row): row is ProjectSummary => row !== null)
    .sort((a, b) => b.updated - a.updated);
};
export const createProject = async (input: {
  title: string;
  project: Project;
  sourceKey?: string | undefined;
}): Promise<ProjectState> => {
  const checked = checkMedia('clip', input.project);
  if (!checked.ok) {
    throw new ProjectProblem(checked.error);
  }
  const state = projectStateSchema.parse({
    ...input,
    project: checked.document,
    id: newId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const folder = await projectDirectory(state.id);
  await ensureDirectory(join(folder, 'media'));
  await ensureDirectory(join(folder, 'out'));
  await writeJson(join(folder, 'project.json'), state);
  return state;
};
export const openProject = async (input: {
  title: string;
  project: Project;
  sourceKey: string;
}): Promise<ProjectState> =>
  serialDisk(
    join(await projectsFolder(), '.open-project'),
    async () =>
      (await listProjects()).find((row) => row.sourceKey === input.sourceKey) ??
      createProject(input),
  );

export const mutateProject = async (
  id: string,
  mutate: (state: ProjectState) => ProjectState | Promise<ProjectState>,
): Promise<ProjectState> => {
  const path = join(await projectDirectory(id), 'project.json');
  return serialDisk(path, async () => {
    const current = await readProject(id);
    const next = projectStateSchema.parse(await mutate(current));
    next.revision = current.revision + 1;
    next.updatedAt = new Date();
    await writeJson(path, next);
    return next;
  });
};
export interface ActionContext {
  actor: string;
  revision?: number;
  turnId?: string;
  label?: string;
  title?: string | undefined;
  nativeVideo?: ProjectState['nativeVideo'];
}
export const commitAction = (
  id: string,
  action: ProjectAction,
  context: ActionContext,
): Promise<ProjectState> =>
  mutateProject(id, (state) => {
    if (context.revision !== undefined && context.revision !== state.revision) {
      throw new ProjectProblem(
        'This project changed. Reloaded the latest revision; try your edit again.',
        409,
      );
    }
    const next = reduceProjectAction(state.project, action);
    assertEditable(state, next, context.actor);
    const event = state.events.find(
      (request) => request.actor === context.actor && request.status === 'in-progress',
    );
    const turnId =
      event?.turnId ??
      context.turnId ??
      (state.agent?.actor === context.actor && state.agent.status === 'working'
        ? state.agent.turnId
        : newId());
    const previous = state.history.at(-1);
    const entry = {
      id: newId(),
      actor: context.actor,
      author: context.actor.startsWith('browser:')
        ? 'You'
        : state.agent?.actor === context.actor
          ? state.agent.name
          : context.actor.replace(/^agent:/, ''),
      turnId,
      label: context.label ?? action.type,
      before: state.project,
      after: next,
      at: Date.now(),
      undone: false,
    };
    const history =
      context.actor.startsWith('browser:') &&
      previous?.turnId === turnId &&
      previous.actor === context.actor &&
      !previous.undone
        ? [...state.history.slice(0, -1), { ...previous, after: next, at: Date.now() }]
        : [...state.history, entry];
    return {
      ...state,
      title: context.title ?? state.title,
      ...(context.nativeVideo ? { nativeVideo: context.nativeVideo } : {}),
      project: next,
      history: history.slice(-80),
    };
  });
export const undoProject = (
  id: string,
  actor: string,
  redo = false,
  agent = false,
): Promise<ProjectState> =>
  mutateProject(id, (state) => {
    const target = state.history
      .toReversed()
      .find(
        (entry) =>
          entry.undone === redo &&
          (agent
            ? entry.actor.startsWith('agent:')
            : actor.startsWith('browser:') || entry.actor === actor),
      );
    if (target === undefined) {
      throw new ProjectProblem(redo ? 'Nothing to redo.' : 'Nothing to undo.');
    }
    const entries = state.history.filter(
      (entry) =>
        entry.turnId === target.turnId && entry.actor === target.actor && entry.undone === redo,
    );
    let project: unknown = state.project;
    for (const entry of redo ? entries : entries.toReversed()) {
      project = undoContribution(
        project,
        redo ? entry.after : entry.before,
        redo ? entry.before : entry.after,
      );
    }
    const checked = checkMedia('clip', project);
    if (!checked.ok) {
      throw new ProjectProblem(checked.error);
    }
    assertEditable(state, checked.document, actor);

    return {
      ...state,
      project: checked.document,
      history: state.history.map((entry) =>
        entries.some((changed) => changed.id === entry.id) ? { ...entry, undone: !redo } : entry,
      ),
    };
  });

export const setAgentStatus = (
  id: string,
  actor: string,
  input: {
    status: 'working' | 'idle';
    label: string;
    itemIds: string[];
    name?: string | undefined;
  },
): Promise<ProjectState> =>
  mutateProject(id, (state) => {
    if (
      input.status === 'working' &&
      state.agent?.status === 'working' &&
      state.agent.actor !== actor
    ) {
      throw new ProjectProblem('Another agent is working. Wait for it to finish.', 423);
    }
    return {
      ...state,
      agent: {
        actor,
        name: input.name ?? 'MCP agent',
        status: input.status,
        label: input.label,
        itemIds: input.status === 'working' ? input.itemIds : [],
        heartbeat: Date.now(),
        turnId:
          state.agent?.actor === actor && state.agent.status === 'working'
            ? state.agent.turnId
            : newId(),
      },
    };
  });
