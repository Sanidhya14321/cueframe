// biome-ignore-all lint/performance/noAwaitInLoops: Render frames sequentially to bound Chromium memory.
import { createHash } from 'node:crypto';
import { mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { renderStill, selectComposition } from '@remotion/renderer';
import { seedProjectForClip } from '../src/core/project-seed';
import { BROWSER_RENDER_OPTIONS } from '../src/render/render-options';
import { getServeUrl } from '../src/render/serve-url';
import { CLIP_REGISTRY } from '../src/schemas';

const hashFrame = async (path: string) =>
  createHash('sha256')
    .update(await readFile(path))
    .digest('hex');

const out = '/tmp/clipkit-motion-qa';
await mkdir(out, { recursive: true });
const serveUrl = await getServeUrl();
for (const clip of CLIP_REGISTRY.filter((meta) => meta.category === 'imported')) {
  const project = seedProjectForClip(clip.id);
  const element = project.tracks[0]?.elements[0];
  if (element?.type !== 'composition') {
    throw new Error('Missing clip');
  }
  element.props = {
    ...element.props,
    text: 'THIS IS A LONG HEADLINE THAT STILL NEEDS TO FIT EVERY FRAME CLEARLY',
    subtitle: 'Editable web motion, tested with short and long text.',
  };
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
    output: join(out, `${clip.id}.long.png`),
    frame: 115,
  });
  const repeated = join(out, `${clip.id}.repeat.png`);
  await renderStill({
    ...BROWSER_RENDER_OPTIONS,
    serveUrl,
    composition,
    inputProps,
    output: repeated,
    frame: 115,
  });
  if ((await hashFrame(repeated)) !== (await hashFrame(join(out, `${clip.id}.long.png`)))) {
    throw new Error(`Identical frames differed for ${clip.id}.`);
  }
  element.props = { ...element.props, text: 'GO' };
  await renderStill({
    ...BROWSER_RENDER_OPTIONS,
    serveUrl,
    composition,
    inputProps,
    output: join(out, `${clip.id}.short.png`),
    frame: 75,
  });
  console.info(`Checked ${clip.id}`);
}
console.info(
  'All 25 clips passed identical-frame, long and short checks. Samples: /tmp/clipkit-motion-qa',
);
