import { readFile } from 'node:fs/promises';
import { CLIP_DEFAULTS, type ClipId, isClipId } from '@/schemas';
import { renderClip } from './render-clip';
import { type RenderOptions, resolveRenderOptions } from './render-options';

const readFlag = (name: string): string | null => {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) {
    return null;
  }
  return process.argv[index + 1] ?? null;
};

const readJson = async <T>(path: string): Promise<T> => {
  const raw = await readFile(path, 'utf8');
  return JSON.parse(raw) as T;
};

const loadProps = (clipId: ClipId, propsPath: string | null): Promise<Record<string, unknown>> =>
  propsPath === null
    ? Promise.resolve(CLIP_DEFAULTS[clipId] as Record<string, unknown>)
    : readJson<Record<string, unknown>>(propsPath);

const main = async (): Promise<void> => {
  const clip = readFlag('clip');
  const outDir = readFlag('out');
  const optionsPath = readFlag('options');
  const propsPath = readFlag('props');

  if (clip === null || !isClipId(clip)) {
    throw new Error(`Missing or invalid --clip (got ${String(clip)})`);
  }
  if (outDir === null) {
    throw new Error('Missing --out');
  }

  const options: RenderOptions = resolveRenderOptions(
    optionsPath === null ? null : await readJson<Partial<RenderOptions>>(optionsPath),
  );
  const inputProps = await loadProps(clip, propsPath);

  const result = await renderClip({
    clipId: clip,
    inputProps,
    outDir,
    options,
    onProgress: (progress) => {
      process.stdout.write(`${JSON.stringify({ progress })}\n`);
    },
  });

  process.stdout.write(`${JSON.stringify({ done: true, ...result })}\n`);
};

await main();
