/* biome-ignore-all lint/style/noProcessEnv: isolated native render worker inherits runtime environment with server-only options cleared */
import 'server-only';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { rename, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { repoRoot } from '@/lib/repo-root';
import { identityTransform, type Project } from '@/project';
import { ffmpegPath, runProcess } from './audio';
import { serialDisk } from './file-lock';
import { writeJson } from './files';
import { ProjectProblem, projectDirectory, readProject } from './projects';
import { inlineProjectMedia } from './render';
import { renderTurn } from './render-turn';
import { workerEnvironment } from './worker-env';

export const prepareOpenCutPreview = async (id: string, itemId: string, cachedOnly = false) => {
  const state = await readProject(id);
  const item = state.project.tracks
    .flatMap((track) => track.elements)
    .find((candidate) => candidate.id === itemId);
  if (!item) {
    throw new ProjectProblem('Unknown source layer.', 404);
  }
  const { opencut: _native, ...source } = item;
  const normalized = {
    ...source,
    id: 'preview-source',
    from: 0,
    sourceFrom: 0,
    durationInFrames: item.durationInFrames + (item.sourceFrom ?? 0),
    transform: identityTransform(),
  };
  const digest = createHash('sha256')
    .update(
      JSON.stringify({
        source: normalized,
        width: state.project.width,
        height: state.project.height,
        fps: state.project.fps,
      }),
    )
    .digest('hex');
  const output = join(await projectDirectory(id), 'media', `${digest}.webm`);
  if (cachedOnly && !existsSync(output)) {
    return null;
  }
  await serialDisk(output, async () => {
    if (existsSync(output)) {
      return;
    }
    const project: Project = {
      ...state.project,
      background: 'transparent',
      durationInFrames: item.durationInFrames + (item.sourceFrom ?? 0),
      tracks: [
        {
          id: 'source',
          name: 'Source layer',
          elements: [
            {
              ...source,
              ...(source.type === 'audio' ? { volume: 1 } : {}),
              from: 0,
              sourceFrom: 0,
              durationInFrames: item.durationInFrames + (item.sourceFrom ?? 0),
              transform: identityTransform(),
            },
          ],
        },
      ],
    };
    project.opencut = undefined;
    const input = `${output}.json`;
    await writeJson(input, await inlineProjectMedia(project));
    const temporary = `${output}.tmp.webm`;
    try {
      await renderTurn(() => renderLayer(input, temporary));
      await rename(temporary, output);
    } finally {
      await rm(input, { force: true });
      await rm(temporary, { force: true });
    }
  });
  const probe = JSON.parse(
    (
      await runProcess(ffmpegPath().replace(/ffmpeg$/, 'ffprobe'), [
        '-v',
        'error',
        '-show_entries',
        'stream=codec_type',
        '-of',
        'json',
        output,
      ])
    ).toString(),
  ) as { streams: { codec_type: string }[] };
  return {
    url: `/api/projects/${id}/media/${digest}.webm`,
    width: state.project.width,
    height: state.project.height,
    fps: state.project.fps,
    duration: normalized.durationInFrames / state.project.fps,
    hasAudio: probe.streams.some((stream) => stream.codec_type === 'audio'),
  };
};
const renderLayer = (input: string, output: string) =>
  new Promise<void>((resolve, reject) => {
    const child = spawn(
      'bun',
      ['run', join(repoRoot(), 'src/render/render-layer.ts'), input, output],
      {
        cwd: repoRoot(),
        env: workerEnvironment(),
        stdio: ['ignore', 'ignore', 'pipe'],
      },
    );
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error('Source layer preview timed out.'));
    }, 600000);
    let detail = '';
    child.stderr.on('data', (chunk: Buffer) => {
      detail = `${detail}${chunk}`.slice(-2000);
    });
    child.on('error', () => {
      clearTimeout(timer);
      reject(new Error('Could not start the source layer renderer.'));
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve();
      } else {
        console.error(`[ClipKit preview] ${detail}`);
        reject(
          new Error('Could not render this source layer. Open Animation workspace to inspect it.'),
        );
      }
    });
  });
