import { join } from 'node:path';
import { z } from 'zod';
import { readJson, writeJson } from './files';
import { readSettings } from './settings';

const schema = z.object({ name: z.string(), lastSeen: z.number() });
export const markConnected = async (name = 'MCP agent') =>
  writeJson(join((await readSettings()).dataFolder, 'connection.json'), {
    name: name.slice(0, 100),
    lastSeen: Date.now(),
  });
export const connectionState = async () => {
  const saved = schema.safeParse(
    await readJson(join((await readSettings()).dataFolder, 'connection.json')),
  );
  return saved.success
    ? { ...saved.data, connected: Date.now() - saved.data.lastSeen < 60000 }
    : { name: 'No agent', lastSeen: 0, connected: false };
};
