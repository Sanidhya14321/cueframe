/* biome-ignore-all lint/performance/noAwaitInLoops: nearest package discovery depends on each parent lookup */
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import type { Plugin } from 'vite';

const allowed = new Set(['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC', '0BSD']);
const copyNotice = async (source: string, target: string): Promise<void> => {
  const text = (await readFile(source, 'utf8')).replaceAll('\r\n', '\n');
  await writeFile(target, text.endsWith('\n') ? text : `${text}\n`);
};

type Package = { name: string; version: string; license: string; path: string };
const findPackage = async (moduleId: string): Promise<Package | null> => {
  let folder = dirname(moduleId.split('?')[0] ?? moduleId);
  while (folder !== dirname(folder)) {
    const path = join(folder, 'package.json');
    if (existsSync(path)) {
      const data = JSON.parse(await readFile(path, 'utf8')) as Partial<Package>;
      if (data.name && data.version && data.license) {
        if (!allowed.has(data.license)) {
          throw new Error(`Unreviewed runtime license: ${data.name} (${data.license})`);
        }
        return { name: data.name, version: data.version, license: data.license, path: folder };
      }
    }
    folder = dirname(folder);
  }
  return null;
};
const fallbackNotice = (name: string) => {
  if (name.startsWith('@radix-ui/')) {
    return resolve(import.meta.dir, 'node_modules/radix-ui/LICENSE');
  }
  return new Map([
    [
      '@hugeicons/core-free-icons',
      resolve(import.meta.dir, 'node_modules/@hugeicons/react/LICENSE.md'),
    ],
    ['opencut-wasm', resolve(import.meta.dir, 'LICENSE.txt')],
    ['react-remove-scroll-bar', resolve(import.meta.dir, 'remove-scroll-bar-license.txt')],
  ]).get(name);
};
export const runtimeLicenses = (): Plugin => ({
  name: 'clipkit-runtime-licenses',
  async generateBundle() {
    const packages = await Promise.all(
      [...this.getModuleIds()].filter((id) => id.includes('/node_modules/')).map(findPackage),
    );
    const unique = new Map(
      packages.filter((item): item is Package => item !== null).map((item) => [item.name, item]),
    );
    const destination = resolve(import.meta.dir, '../../licenses/opencut-runtime');
    await mkdir(destination, { recursive: true });
    const inventory = await Promise.all(
      [...unique.values()]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(async ({ path, ...data }) => {
          const notices = (await readdir(path)).filter((name) =>
            /^(license|copying|notice)(\.|$)/i.test(name),
          );
          const files = await Promise.all(
            notices.map(async (name) => {
              const file = `${data.name.replaceAll('@', '').replaceAll('/', '-')}-${name.toLowerCase()}.txt`;
              await copyNotice(join(path, name), join(destination, file));
              return file;
            }),
          );
          const fallback = fallbackNotice(data.name);
          if (files.length === 0 && fallback) {
            const file = `${data.name.replaceAll('@', '').replaceAll('/', '-')}-license.txt`;
            await copyNotice(fallback, join(destination, file));
            files.push(file);
          }
          if (files.length === 0) {
            throw new Error(`Missing runtime notice for ${data.name}`);
          }
          return { ...data, files };
        }),
    );
    await writeFile(join(destination, 'inventory.json'), `${JSON.stringify(inventory, null, 2)}\n`);
    const formatter = Bun.spawn(
      [
        resolve(import.meta.dir, '../../node_modules/.bin/biome'),
        'format',
        '--write',
        join(destination, 'inventory.json'),
      ],
      { stdout: 'ignore', stderr: 'inherit' },
    );
    if (await formatter.exited) {
      throw new Error('Cannot format the runtime inventory');
    }
  },
});
