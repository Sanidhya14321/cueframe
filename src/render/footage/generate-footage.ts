import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { $ } from 'bun';
import { FOOTAGE } from '@/footage';
import type { FootageSpec } from '@/footage/footage-spec';
import { assemblePlate } from './assemble-plate';
import { plateFile, publishDir, shotFile, sourceDir, stillFile } from './footage-paths';
import { generateImage, generateVideo } from './openrouter';

const STEPS = ['--stills', '--shots', '--plate'] as const;

const dataUrl = (path: string) => `data:image/png;base64,${readFileSync(path).toString('base64')}`;

const makeStills = async (spec: FootageSpec, wanted: (name: string, path: string) => boolean) => {
  for (const still of spec.stills) {
    const path = stillFile(spec, still.name);
    if (!wanted(still.name, path)) {
      continue;
    }
    const input = still.from === undefined ? undefined : dataUrl(stillFile(spec, still.from));
    writeFileSync(path, await generateImage({ ...still, input }));
    console.info(`Wrote ${path}`);
    if (still.publishWidth !== undefined) {
      const published = join(publishDir(spec), `${still.name}.jpg`);
      mkdirSync(publishDir(spec), { recursive: true });
      await $`ffmpeg -v error -y -i ${path} -vf scale=${still.publishWidth}:-2:flags=lanczos -q:v 3 ${published}`;
      console.info(`Wrote ${published}`);
    }
  }
};

const makeShots = async (spec: FootageSpec, wanted: (name: string, path: string) => boolean) => {
  for (const shot of spec.shots) {
    const path = shotFile(spec, shot.name);
    if (!wanted(shot.name, path)) {
      continue;
    }
    const { data, cost } = await generateVideo(
      {
        ...shot,
        resolution: spec.resolution,
        aspectRatio: spec.aspectRatio,
        firstFrame: dataUrl(stillFile(spec, shot.firstFrame)),
        lastFrame:
          shot.lastFrame === undefined ? undefined : dataUrl(stillFile(spec, shot.lastFrame)),
      },
      (status) => console.info(`${shot.name}: ${status}`),
    );
    writeFileSync(path, data);
    console.info(`Wrote ${path} (${cost ?? 'unknown'} USD)`);
  }
};

const main = async () => {
  const args = process.argv.slice(2);
  const spec = FOOTAGE.find((entry) => entry.id === args[0]);
  if (spec === undefined) {
    const ids = FOOTAGE.map((entry) => entry.id).join('|');
    console.error(
      `Usage: bun run footage <${ids}> [--stills] [--shots] [--plate] [--only <name>] [--force]`,
    );
    process.exit(1);
  }
  const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : undefined;
  const force = args.includes('--force');
  const chosen = STEPS.filter((step) => args.includes(step));
  const runs = (step: (typeof STEPS)[number]) => chosen.length === 0 || chosen.includes(step);
  const wanted = (name: string, path: string) =>
    (only === undefined || only === name) && (force || only === name || !existsSync(path));

  mkdirSync(sourceDir(spec), { recursive: true });
  if (runs('--stills')) {
    await makeStills(spec, wanted);
  }
  if (runs('--shots')) {
    await makeShots(spec, wanted);
  }
  if (runs('--plate')) {
    await assemblePlate(spec);
    console.info(`Wrote ${plateFile(spec)}`);
  }
};

await main();
