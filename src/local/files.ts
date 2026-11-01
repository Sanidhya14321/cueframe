import { randomUUID } from 'node:crypto';
import { chmod, lstat, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { notifyFile } from './file-events';

const queues = new Map<string, Promise<unknown>>();

export const serial = async <T>(key: string, run: () => Promise<T>): Promise<T> => {
  const previous = queues.get(key) ?? Promise.resolve();
  const next = previous.catch(() => undefined).then(run);
  queues.set(key, next);
  try {
    return await next;
  } finally {
    if (queues.get(key) === next) {
      queues.delete(key);
    }
  }
};

export const ensureDirectory = async (path: string): Promise<void> => {
  await mkdir(path, { recursive: true, mode: 0o700 });
  if ((await lstat(path)).isSymbolicLink()) {
    throw new Error('Data folders cannot be symlinks.');
  }
};

export const readJson = async (path: string): Promise<unknown> => {
  try {
    if ((await lstat(dirname(path))).isSymbolicLink()) {
      throw new Error('Data folders cannot be symlinks.');
    }
    if ((await lstat(path)).isSymbolicLink()) {
      throw new Error('Data files cannot be symlinks.');
    }
    return JSON.parse(await readFile(path, 'utf8')) as unknown;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
};

export const writeJson = async (path: string, value: unknown): Promise<void> => {
  await ensureDirectory(dirname(path));
  const temporary = `${path}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600, flag: 'wx' });
    await rename(temporary, path);
    await chmod(path, 0o600);
    notifyFile(path);
  } finally {
    await rm(temporary, { force: true });
  }
};
