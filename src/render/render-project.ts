import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import type { Project } from '@/project';
import {
  BROWSER_RENDER_OPTIONS,
  buildRenderMediaOptions,
  outputExtension,
  type RenderOptions,
} from './render-options';
import { getServeUrl } from './serve-url';

const PROJECT_COMPOSITION_ID = 'project';

export interface RenderProjectArgs {
  project: Project;
  outDir: string;
  options: RenderOptions;
  name?: string;
  onProgress?: (progress: number) => void;
}

export interface RenderProjectResult {
  video: string;
  poster: string;
}

export const renderProject = async ({
  project,
  outDir,
  options,
  name = PROJECT_COMPOSITION_ID,
  onProgress,
}: RenderProjectArgs): Promise<RenderProjectResult> => {
  const serveUrl = await getServeUrl();
  const inputProps = project as unknown as Record<string, unknown>;
  const composition = await selectComposition({
    ...BROWSER_RENDER_OPTIONS,
    serveUrl,
    id: PROJECT_COMPOSITION_ID,
    inputProps,
  });

  await mkdir(outDir, { recursive: true });
  const video = join(outDir, `${name}.${outputExtension(options.codec)}`);
  const poster = join(outDir, `${name}.jpg`);
  const media = buildRenderMediaOptions(options);

  await renderMedia({
    ...BROWSER_RENDER_OPTIONS,
    serveUrl,
    composition,
    inputProps,
    outputLocation: video,
    onProgress: ({ progress }) => onProgress?.(progress),
    ...media,
  });

  await renderStill({
    ...BROWSER_RENDER_OPTIONS,
    serveUrl,
    composition,
    inputProps,
    output: poster,
    frame: Math.min(Math.floor(composition.durationInFrames / 3), composition.durationInFrames - 1),
    imageFormat: 'jpeg',
    jpegQuality: options.jpegQuality,
    scale: options.scale,
  });

  return { video, poster };
};
