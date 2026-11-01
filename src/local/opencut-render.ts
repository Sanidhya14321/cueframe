import 'server-only';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { repoRoot } from '@/lib/repo-root';
import { projectDirectory, readProject } from './projects';
import { sessionToken } from './security';
import { workerEnvironment } from './worker-env';

export const renderNativeProject = async (
  id: string,
  origin: string,
  update: (progress: number, label: string) => Promise<void>,
  revision: number,
) => {
  const state = await readProject(id);
  if (state.revision !== revision) {
    throw new Error('The project changed before rendering. Render again to use the latest edit.');
  }
  const name = `video-${state.revision}`;
  const output = join(await projectDirectory(id), 'out', `${name}.mp4`);
  await update(0.05, 'Rendering the video');
  await new Promise<void>((resolve, reject) => {
    const child = spawn(
      'bun',
      ['run', join(repoRoot(), 'src/render/render-opencut.ts'), origin, id, output],
      {
        cwd: repoRoot(),
        stdio: ['ignore', 'ignore', 'pipe'],
        env: {
          ...workerEnvironment(),
          CLIPKIT_RENDER_TOKEN: sessionToken(),
        },
      },
    );
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error('The native render timed out.'));
    }, 600000);
    child.stderr.on('data', () => undefined);
    child.on('error', () => {
      clearTimeout(timer);
      reject(new Error('Could not start OpenCut rendering.'));
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error('The video editor could not export this project. Check its effects and media.'),
        );
      }
    });
  });
  if ((await readProject(id)).revision !== state.revision) {
    throw new Error(
      'The project changed during rendering. Render again to use the latest revision.',
    );
  }
  const data = await readFile(output);
  if (data.length === 0) {
    throw new Error('OpenCut produced an empty video.');
  }
  return {
    url: `/api/projects/${id}/out/${name}.mp4`,
    fileName: `${name}.mp4`,
    bytes: data.length,
  };
};
