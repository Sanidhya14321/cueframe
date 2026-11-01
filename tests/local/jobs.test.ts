import { beforeEach, describe, expect, it } from 'bun:test';
import { join } from 'node:path';
import { seedProjectForClip } from '@/core';
import { writeJson } from '@/local/files';
import { readJob, startJob } from '@/local/jobs';
import { createProject, projectDirectory } from '@/local/projects';
import { resetTestHome } from './test-home';

beforeEach(resetTestHome);

describe('local jobs', () => {
  it('reports a job left working by an earlier server as failed', async () => {
    const { id } = await createProject({
      title: 'Jobs',
      project: seedProjectForClip('typewriter'),
    });
    const jobId = '11111111-1111-4111-8111-111111111111';
    await writeJson(join(await projectDirectory(id), 'out', `${jobId}.job.json`), {
      id: jobId,
      kind: 'render',
      status: 'working',
      progress: 0.4,
      label: 'Rendering',
      createdAt: 1,
    });
    const job = await readJob(id, jobId);
    expect(job.status).toBe('error');
    expect(job.label).toContain('restarted');
    expect((await readJob(id, jobId)).status).toBe('error');
  });

  it('leaves a running job alone', async () => {
    const { id } = await createProject({
      title: 'Jobs',
      project: seedProjectForClip('typewriter'),
    });
    let finish: () => void = () => undefined;
    const job = await startJob(
      id,
      'render',
      () =>
        new Promise<void>((done) => {
          finish = done;
        }),
    );
    expect((await readJob(id, job.id)).status).not.toBe('error');
    finish();
  });
});
