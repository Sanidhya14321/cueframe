import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { z } from 'zod';
import { ensureDirectory, readJson, serial, writeJson } from './files';
import { ProjectProblem } from './project-problem';
import { projectDirectory } from './projects';

const MAX_RUNNING_JOBS = 8;
const jobSchema = z.object({
  id: z.string(),
  kind: z.string(),
  status: z.enum(['queued', 'working', 'done', 'error']),
  progress: z.number(),
  label: z.string(),
  result: z.unknown().optional(),
  createdAt: z.number(),
});
export type LocalJob = z.infer<typeof jobSchema>;
const jobPath = async (projectId: string, id: string) => {
  if (!/^[a-f0-9-]{36}$/.test(id)) {
    throw new ProjectProblem('Unknown job.', 404);
  }
  const folder = join(await projectDirectory(projectId), 'out');
  await ensureDirectory(folder);
  return join(folder, `${id}.job.json`);
};
const shared = globalThis as typeof globalThis & { cueframeRunningJobs?: Set<string> };
const runningJobs = shared.cueframeRunningJobs ?? new Set<string>();
shared.cueframeRunningJobs = runningJobs;
export const readJob = async (projectId: string, id: string): Promise<LocalJob> => {
  const path = await jobPath(projectId, id);
  const saved = await readJson(path);
  if (saved === null) {
    throw new ProjectProblem('Unknown job.', 404);
  }
  const job = jobSchema.parse(saved);
  if (job.status === 'done' || job.status === 'error' || runningJobs.has(id)) {
    return job;
  }
  const stranded = {
    ...job,
    status: 'error' as const,
    label: 'cueframe restarted during this task. Start it again.',
  };
  await serial(path, () => writeJson(path, stranded));
  return stranded;
};
export const startJob = async (
  projectId: string,
  kind: string,
  run: (update: (progress: number, label: string) => Promise<void>) => Promise<unknown>,
): Promise<LocalJob> => {
  if (runningJobs.size >= MAX_RUNNING_JOBS) {
    throw new ProjectProblem('The server is busy with other tasks. Try again shortly.', 429);
  }
  const job: LocalJob = {
    id: randomUUID(),
    kind,
    status: 'queued',
    progress: 0,
    label: 'Queued',
    createdAt: Date.now(),
  };
  const path = await jobPath(projectId, job.id);
  runningJobs.add(job.id);
  await writeJson(path, job);
  const update = (progress: number, label: string) =>
    serial(path, async () => {
      Object.assign(job, { progress, label, status: 'working' });
      await writeJson(path, job);
    });
  setTimeout(() => {
    run(update)
      .then(async (result) => {
        await serial(path, async () => {
          Object.assign(job, { status: 'done', progress: 1, label: 'Complete', result });
          await writeJson(path, job);
        });
      })
      .catch(async (error: unknown) => {
        await serial(path, async () => {
          Object.assign(job, {
            status: 'error',
            label: error instanceof Error ? error.message : 'The media task failed.',
          });
          await writeJson(path, job);
        });
      })
      .catch(() => console.error('[cueframe job] could not save the job result'))
      .finally(() => runningJobs.delete(job.id));
  }, 0);
  return job;
};
