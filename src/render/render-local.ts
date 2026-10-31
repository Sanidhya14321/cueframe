import { readFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { parseProject } from '@/project';
import { nativeBrowserPath } from './native-browser';
import { DEFAULT_RENDER_OPTIONS } from './render-options';
import { renderProject } from './render-project';

const input = process.argv[2];
const name = process.argv[3];
if (!(input && name && /^video-\d+$/.test(name))) {
  throw new Error('Expected a local render input and output name.');
}
const project = parseProject(JSON.parse(await readFile(input, 'utf8')));
await renderProject({
  project,
  outDir: dirname(input),
  name,
  options: DEFAULT_RENDER_OPTIONS,
  browser: { browserExecutable: await nativeBrowserPath(), chromiumOptions: { gl: 'swangle' } },
  onProgress: (progress) => console.info(JSON.stringify({ progress })),
});
console.info(JSON.stringify({ done: true }));
