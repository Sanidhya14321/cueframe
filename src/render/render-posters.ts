import { existsSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { chromium } from '@playwright/test';
import { POSTER_UPDATED_AT, POSTERS, type Poster, posterPreviewPath } from '@/posters';
import { posterPreviewEntry, posterPreviewsDir, publicDir } from './paths';
import { stampPosterUpdatedAt } from './posters/poster-updated-at';

const PREVIEW_WIDTH = 480;

interface Options {
  packFile: string | undefined;
  ids: string[];
  newOnly: boolean;
  outDir: string;
  width: number;
}

const parseOptions = (args: readonly string[]): Options => {
  const value = (flag: string) => {
    const index = args.indexOf(flag);
    return index === -1 ? undefined : args[index + 1];
  };
  const packFile = value('--pack-file');
  const flagValues = new Set([value('--out'), value('--width'), packFile]);
  return {
    packFile: packFile === undefined ? undefined : resolve(packFile),
    ids: args.filter((arg) => !(arg.startsWith('-') || flagValues.has(arg))),
    newOnly: args.includes('--new') || args.includes('-new'),
    outDir: value('--out') ?? posterPreviewsDir,
    width: Number(value('--width') ?? PREVIEW_WIDTH),
  };
};

const qaEntry = async (packFile: string): Promise<string> => {
  const entry = join(dirname(posterPreviewEntry), `qa-${process.pid}.tsx`);
  const source = (await Bun.file(posterPreviewEntry).text()).replace(
    "import { POSTERS } from '@/posters';",
    `import * as candidates from './${relative(dirname(posterPreviewEntry), packFile).replace(/\.ts$/, '')}';\nconst POSTERS = Object.values(candidates).filter(Array.isArray).flat() as import('@/posters').Poster[];`,
  );
  await writeFile(entry, source);
  return entry;
};

const bundle = async (packFile: string | undefined): Promise<string> => {
  const entry = packFile === undefined ? posterPreviewEntry : await qaEntry(packFile);
  const result = await Bun.build({
    entrypoints: [entry],
    target: 'browser',
    format: 'esm',
    define: { 'process.env.NODE_ENV': '"production"' },
  });
  if (entry !== posterPreviewEntry) {
    await rm(entry, { force: true });
  }
  const [output] = result.outputs;
  if (!result.success || output === undefined) {
    throw new Error(result.logs.map(String).join('\n'));
  }
  return output.text();
};

const serve = (script: string) =>
  Bun.serve({
    port: 0,
    fetch: (request) => {
      const { pathname } = new URL(request.url);
      if (pathname === '/') {
        return new Response(
          '<!doctype html><html><body style="margin:0"><script type="module" src="/entry.js"></script></body></html>',
          { headers: { 'content-type': 'text/html' } },
        );
      }
      if (pathname === '/entry.js') {
        return new Response(script, { headers: { 'content-type': 'text/javascript' } });
      }
      return new Response(Bun.file(join(publicDir, decodeURIComponent(pathname))));
    },
  });

const pendingPosters = (options: Options, posters: readonly Poster[]) =>
  posters
    .filter(
      ({ meta }) =>
        options.ids.length === 0 ||
        options.ids.includes(meta.id) ||
        options.ids.includes(meta.packId),
    )
    .map(({ meta }) => ({
      posterId: meta.id,
      packId: meta.packId,
      file: join(options.outDir, posterPreviewPath(meta).replace(/^\/poster-previews\//, '')),
    }))
    .filter((job) => !(options.newOnly && existsSync(job.file)));

const main = async (): Promise<void> => {
  const options = parseOptions(process.argv.slice(2));
  const posters: readonly Poster[] =
    options.packFile === undefined
      ? POSTERS
      : Object.values(await import(options.packFile))
          .filter(Array.isArray)
          .flat()
          .filter(
            (value): value is Poster =>
              typeof value === 'object' && value !== null && 'meta' in value && 'build' in value,
          );
  const jobs = pendingPosters(options, posters);
  if (jobs.length === 0) {
    console.info('No poster previews to render.');
    return;
  }
  const server = serve(await bundle(options.packFile));
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    page.on('pageerror', (error) => console.error(error.message));
    await page.goto(`http://localhost:${server.port}/`);
    await page.waitForFunction(() => 'posterPreview' in window);
    const packIds = new Set(
      jobs
        .filter((job) => options.ids.length === 0 || options.ids.includes(job.packId))
        .map((job) => job.packId),
    );
    if (options.outDir === posterPreviewsDir && !options.newOnly) {
      await Promise.all(
        [...packIds].map((id) => rm(join(options.outDir, id), { recursive: true, force: true })),
      );
    }
    for (const job of jobs) {
      const dataUrl = await page.evaluate(
        ({ posterId, width }) =>
          (
            window as unknown as {
              posterPreview: { render: (id: string, width: number) => Promise<string> };
            }
          ).posterPreview.render(posterId, width),
        { posterId: job.posterId, width: options.width },
      );
      await mkdir(dirname(job.file), { recursive: true });
      await writeFile(job.file, Buffer.from(dataUrl.split(',')[1] ?? '', 'base64'));
      console.info(`  ${job.posterId}`);
    }
  } finally {
    await browser.close();
    await server.stop(true);
  }
  if (options.outDir === posterPreviewsDir && options.packFile === undefined) {
    const requested = jobs.filter(
      (job) =>
        options.ids.includes(job.posterId) ||
        options.ids.includes(job.packId) ||
        POSTER_UPDATED_AT[job.packId] === undefined,
    );
    await stampPosterUpdatedAt([...new Set(requested.map((job) => job.packId))], new Date());
  }
  console.info(`Rendered ${jobs.length} poster previews to ${options.outDir}`);
};

await main();
