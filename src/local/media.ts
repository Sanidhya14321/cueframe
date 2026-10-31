import 'server-only';
import { createHash } from 'node:crypto';
import { lstat, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ensureDirectory } from './files';
import { ProjectProblem, projectDirectory } from './projects';

const extensions: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/mp4': 'm4a',
  'audio/ogg': 'ogg',
  'audio/webm': 'webm',
};
export const mediaPath = async (id: string, name: string): Promise<string> => {
  if (!/^[a-f0-9]{64}\.(png|jpg|webp|gif|mp4|webm|mov|mp3|wav|m4a|ogg)$/.test(name)) {
    throw new ProjectProblem('Unknown media file.', 404);
  }
  const folder = join(await projectDirectory(id), 'media');
  await ensureDirectory(folder);
  const path = join(folder, name);
  try {
    if ((await lstat(path)).isSymbolicLink()) {
      throw new ProjectProblem('Media links are not allowed.');
    }
  } catch (error) {
    if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) {
      throw error;
    }
  }
  return path;
};
export const saveMedia = async (
  id: string,
  data: Uint8Array,
  mime: string,
): Promise<{ url: string; name: string }> => {
  const extension = extensions[mime.split(';')[0] ?? ''];
  if (!extension || data.length === 0 || data.length > 256 * 1024 * 1024) {
    throw new ProjectProblem('Choose a supported image, audio or video file up to 256 MB.');
  }
  const name = `${createHash('sha256').update(data).digest('hex')}.${extension}`;
  await writeFile(await mediaPath(id, name), data, { mode: 0o600 });
  return { url: `/api/projects/${id}/media/${name}`, name };
};
export const readMedia = async (id: string, name: string) => {
  const path = await mediaPath(id, name);
  const data = await readFile(path);
  const extension = name.split('.').at(-1);
  const mime =
    Object.entries(extensions).find(([, value]) => value === extension)?.[0] ??
    'application/octet-stream';
  return { data, mime };
};
