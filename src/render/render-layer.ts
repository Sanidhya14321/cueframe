import { readFile } from 'node:fs/promises';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { parseProject } from '@/project';
import { renderBrowserOptions } from './render-browser';
import { BROWSER_RENDER_OPTIONS } from './render-options';
import { getServeUrl } from './serve-url';

const input = process.argv[2];
const output = process.argv[3];
if (!(input && output)) {
  throw new Error('Layer input and output required.');
}
const project = parseProject(JSON.parse(await readFile(input, 'utf8')));
const browserOptions = {
  ...BROWSER_RENDER_OPTIONS,
  ...(await renderBrowserOptions()),
};
const serveUrl = await getServeUrl();
const inputProps = project as unknown as Record<string, unknown>;
const composition = await selectComposition({
  ...browserOptions,
  serveUrl,
  id: 'project',
  inputProps,
});
await renderMedia({
  ...browserOptions,
  serveUrl,
  composition,
  inputProps,
  outputLocation: output,
  codec: 'vp9',
  concurrency: 2,
  pixelFormat: 'yuva420p',
  imageFormat: 'png',
  crf: 20,
});
