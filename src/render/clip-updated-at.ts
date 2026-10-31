import { readFile, writeFile } from 'node:fs/promises';
import { type ClipId, clipUpdatedAtSchema } from '@/schemas';
import { clipUpdatedAtFile } from './paths';

export const stampClipUpdatedAt = async (ids: readonly ClipId[], now: Date): Promise<void> => {
  const current = clipUpdatedAtSchema.parse(JSON.parse(await readFile(clipUpdatedAtFile, 'utf8')));
  const stamped = { ...current, ...Object.fromEntries(ids.map((id) => [id, now.toISOString()])) };
  const sorted = Object.fromEntries(
    Object.entries(stamped).sort(([left], [right]) => left.localeCompare(right)),
  );
  await writeFile(clipUpdatedAtFile, `${JSON.stringify(sorted, null, 2)}\n`);
};
