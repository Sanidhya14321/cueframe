import { readFile, writeFile } from 'node:fs/promises';
import { posterUpdatedAtSchema } from '@/posters';
import { posterUpdatedAtFile } from '../paths';

export const stampPosterUpdatedAt = async (ids: readonly string[], now: Date): Promise<void> => {
  const current = posterUpdatedAtSchema.parse(
    JSON.parse(await readFile(posterUpdatedAtFile, 'utf8')),
  );
  const stamped = { ...current, ...Object.fromEntries(ids.map((id) => [id, now.toISOString()])) };
  const sorted = Object.fromEntries(
    Object.entries(stamped).sort(([left], [right]) => left.localeCompare(right)),
  );
  await writeFile(posterUpdatedAtFile, `${JSON.stringify(sorted, null, 2)}\n`);
};
