import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { renderStill, selectComposition } from '@remotion/renderer';
import { firstFrameFileName, stillFileName } from '@/lib/preview-files';
import type { Project } from '@/project';
import {
  BROWSER_RENDER_OPTIONS,
  DEFAULT_RENDER_OPTIONS,
  outputExtension,
  type RenderOptions,
} from './render-options';
import { renderProject } from './render-project';
import { getServeUrl } from './serve-url';

const GALLERY_PREVIEW_OPTIONS: RenderOptions = {
  ...DEFAULT_RENDER_OPTIONS,
  scale: 0.5,
  crf: 26,
};

const FIRST_FRAME_WIDTH = 48;
const STILL_BOX = 800;

export const galleryPreviewFileNames = (name: string): string[] => [
  `${name}.${outputExtension(GALLERY_PREVIEW_OPTIONS.codec)}`,
  firstFrameFileName(name),
  stillFileName(name),
];

interface StillSpec {
  frame: number;
  quality: number;
  scale: (width: number, height: number) => number;
}

const renderProjectStill = async (
  project: Project,
  output: string,
  spec: StillSpec,
): Promise<void> => {
  const serveUrl = await getServeUrl();
  const inputProps = project as unknown as Record<string, unknown>;
  const composition = await selectComposition({
    ...BROWSER_RENDER_OPTIONS,
    serveUrl,
    id: 'project',
    inputProps,
  });
  await renderStill({
    ...BROWSER_RENDER_OPTIONS,
    serveUrl,
    composition,
    inputProps,
    output,
    frame: Math.min(spec.frame, composition.durationInFrames - 1),
    imageFormat: 'jpeg',
    jpegQuality: spec.quality,
    scale: spec.scale(composition.width, composition.height),
  });
};

export const renderGalleryStill = (
  project: Project,
  outDir: string,
  name: string,
  frame: number,
): Promise<void> =>
  renderProjectStill(project, join(outDir, stillFileName(name)), {
    frame,
    quality: 84,
    scale: (width, height) => STILL_BOX / Math.max(width, height),
  });

export const renderGalleryPreview = async (
  project: Project,
  outDir: string,
  name: string,
  stillFrame: number,
): Promise<void> => {
  const { poster } = await renderProject({
    project,
    outDir,
    options: GALLERY_PREVIEW_OPTIONS,
    name,
  });
  await rm(poster, { force: true });
  await renderProjectStill(project, join(outDir, firstFrameFileName(name)), {
    frame: 0,
    quality: 70,
    scale: (width) => FIRST_FRAME_WIDTH / width,
  });
  await renderGalleryStill(project, outDir, name, stillFrame);
};
