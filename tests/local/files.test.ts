import { beforeEach, describe, expect, it } from 'bun:test';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { readJson, serial, writeJson } from '@/local/files';
import { configFolder } from '@/local/settings';
import { resetTestHome } from './test-home';

beforeEach(resetTestHome);

describe('atomic local files', () => {
  it('serializes concurrent updates and leaves no temporary files', async () => {
    const path = join(configFolder(), 'counter.json');
    await writeJson(path, 0);
    await Promise.all(
      Array.from({ length: 20 }, () =>
        serial(path, async () => {
          const count = await readJson(path);
          await writeJson(path, Number(count) + 1);
        }),
      ),
    );
    expect(await readJson(path)).toBe(20);
    expect(await readdir(configFolder())).toEqual(['counter.json']);
    expect(await readFile(path, 'utf8')).toBe('20\n');
  });
  it('preserves corrupt files instead of silently replacing them', async () => {
    const path = join(configFolder(), 'broken.json');
    await writeJson(path, {});
    await writeFile(path, 'broken');
    expect(readJson(path)).rejects.toThrow();
    expect(await readFile(path, 'utf8')).toBe('broken');
  });
});
