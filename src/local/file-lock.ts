/* biome-ignore-all lint/performance/noAwaitInLoops: exclusive filesystem locks require ordered retries */
import { open, readFile, rm, stat } from 'node:fs/promises';
import { dirname } from 'node:path';
import { ensureDirectory, serial } from './files';

const stale = async (path: string) => {
  try {
    const [owner, metadata] = await Promise.all([readFile(path, 'utf8'), stat(path)]);
    const pid = Number(owner);
    if (Date.now() - metadata.mtimeMs > 120000) {
      return true;
    }
    try {
      process.kill(pid, 0);
      return false;
    } catch {
      return true;
    }
  } catch {
    return false;
  }
};
export const serialDisk = <T>(path: string, run: () => Promise<T>): Promise<T> =>
  serial(path, async () => {
    await ensureDirectory(dirname(path));
    const lock = `${path}.lock`;
    const deadline = Date.now() + 125000;
    while (Date.now() < deadline) {
      let handle: Awaited<ReturnType<typeof open>>;
      try {
        handle = await open(lock, 'wx', 0o600);
      } catch (error) {
        if (!(error instanceof Error && 'code' in error && error.code === 'EEXIST')) {
          throw error;
        }
        if (await stale(lock)) {
          await rm(lock, { force: true });
        } else {
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
        continue;
      }
      try {
        await handle.writeFile(String(process.pid));
        return await run();
      } finally {
        await handle.close();
        await rm(lock, { force: true });
      }
    }
    throw new Error('Another local write is still running. Try again.');
  });
