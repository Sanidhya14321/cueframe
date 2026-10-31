import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { z } from 'zod';
import { ensureDirectory, readJson, serial, writeJson } from './files';
import { projectDirectory } from './projects';

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
    throw new Error('Unknown job.');
  }
  const folder = join(await projectDirectory(projectId), 'out');
  await ensureDirectory(folder);
  return join(folder, `${id}.job.json`);
};
export const readJob = async (projectId: string, id: string): Promise<LocalJob> =>
  jobSchema.parse(await readJson(await jobPath(projectId, id)));
export const startJob = async (
  projectId: string,
  kind: string,
  run: (update: (progress: number, label: string) => Promise<void>) => Promise<unknown>,
): Promise<LocalJob> => {
  const job: LocalJob = {
    id: randomUUID(),
    kind,
    status: 'queued',
    progress: 0,
    label: 'Queued',
    createdAt: Date.now(),
  };
  const path = await jobPath(projectId, job.id);
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
      });
  }, 0);
  return job;
};
