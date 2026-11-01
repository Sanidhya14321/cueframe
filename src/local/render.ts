/* biome-ignore-all lint/style/noProcessEnv: native render worker clears inherited server-only runtime options */
/* biome-ignore-all lint/performance/noAwaitInLoops: source layers render one at a time */
import { spawn } from 'node:child_process';
import { readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { repoRoot } from '@/lib/repo-root';
import type { Project } from '@/project';
import { needsSourcePreview } from '@/project/source-preview';
import { ensureDirectory, writeJson } from './files';
import { inlineProjectMedia } from './media';
import { prepareOpenCutPreview } from './opencut-preview';
import { renderNativeProject } from './opencut-render';
import { projectDirectory, readProject } from './projects';
import { renderTurn } from './render-turn';
import { workerEnvironment } from './worker-env';

const prepareTimelinePreviews = async (
  projectId: string,
  project: Project,
  update: (progress: number, label: string) => Promise<void>,
) => {
  const layers = project.tracks.flatMap((track) => track.elements).filter(needsSourcePreview);
  for (const [index, layer] of layers.entries()) {
    await update(0.01, `Preparing layer ${index + 1} of ${layers.length}`);
    await prepareOpenCutPreview(projectId, layer.id);
  }
};
export const renderLocalProject = async (
  projectId: string,
  update: (progress: number, label: string) => Promise<void>,
  origin = 'http://127.0.0.1:3000',
) => {
  const state = await readProject(projectId);
  if (state.project.opencut) {
    await prepareTimelinePreviews(projectId, state.project, update);
    return renderTurn(() => renderNativeProject(projectId, origin, update, state.revision));
  }
  await update(0.01, 'Preparing the full-fidelity renderer');
  const name = `video-${state.revision}`;
  const outDir = join(await projectDirectory(projectId), 'out');
  const { opencut: _native, ...canonical } = state.project;
  const project = (await inlineProjectMedia(canonical)) as typeof state.project;
  await ensureDirectory(outDir);
  const input = join(outDir, `${name}.input.json`);
  await writeJson(input, project);
  try {
    await renderTurn(() => runRenderWorker(input, name, update));
  } finally {
    await rm(input, { force: true });
  }
  const rendered = { video: join(outDir, `${name}.mp4`) };
  const data = await readFile(rendered.video);
  if (data.length === 0) {
    throw new Error('The renderer produced an empty file.');
  }
  return {
    url: `/api/projects/${projectId}/out/${name}.mp4`,
    fileName: `${name}.mp4`,
    bytes: data.length,
  };
};

const runRenderWorker = (
  input: string,
  name: string,
  update: (progress: number, label: string) => Promise<void>,
): Promise<void> =>
  new Promise((resolve, reject) => {
    const child = spawn(
      'bun',
      ['run', join(repoRoot(), 'src/render/render-local.ts'), input, name],
      {
        cwd: repoRoot(),
        stdio: ['ignore', 'pipe', 'pipe'],
        env: workerEnvironment(),
      },
    );
    let buffer = '';
    let last = 0;
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error('The local render timed out.'));
    }, 1200000);
    child.stdout.on('data', (chunk: Buffer) => {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (!line.startsWith('{')) {
          continue;
        }
        try {
          const parsed = JSON.parse(line) as { progress?: number };
          if (typeof parsed.progress === 'number' && parsed.progress - last > 0.03) {
            last = parsed.progress;
            update(last, `Rendering ${Math.round(last * 100)}%`).catch(() => undefined);
          }
        } catch {
          console.error('[cueframe render] skipped an unreadable progress line');
        }
      }
    });
    let detail = '';
    child.stderr.on('data', (chunk: Buffer) => {
      detail = `${detail}${chunk}`.slice(-1500);
    });
    child.on('error', () => {
      clearTimeout(timer);
      reject(new Error('Could not start the local Bun renderer.'));
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve();
      } else {
        console.error(`[cueframe render] ${detail}`);
        reject(new Error('Local rendering failed. Check the project media and available memory.'));
      }
    });
  });
