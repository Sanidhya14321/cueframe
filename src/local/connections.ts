import { join } from 'node:path';
import { z } from 'zod';
import { readJson, writeJson } from './files';
import { readSettings } from './settings';

const schema = z.object({ name: z.string(), lastSeen: z.number() });
const CONNECTION_TTL_MS = 60000;
const STREAM_HEARTBEAT_MS = 20000;
const connectionPath = async () => join((await readSettings()).dataFolder, 'connection.json');
const readConnection = async () => schema.safeParse(await readJson(await connectionPath()));
export const markConnected = async (name?: string) => {
  const saved = name === undefined ? await readConnection() : null;
  return writeJson(await connectionPath(), {
    name: (name ?? (saved?.success ? saved.data.name : 'MCP agent')).slice(0, 100),
    lastSeen: Date.now(),
  });
};
export const holdConnection = (signal: AbortSignal, intervalMs = STREAM_HEARTBEAT_MS) => {
  if (signal.aborted) {
    return;
  }
  const timer = setInterval(() => {
    markConnected().catch(() => undefined);
  }, intervalMs);
  signal.addEventListener('abort', () => clearInterval(timer), { once: true });
};
export const connectionState = async () => {
  const saved = await readConnection();
  return saved.success
    ? { ...saved.data, connected: Date.now() - saved.data.lastSeen < CONNECTION_TTL_MS }
    : { name: 'No agent', lastSeen: 0, connected: false };
};
