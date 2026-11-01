import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { z } from 'zod';
import { serialDisk } from './file-lock';
import { readJson, writeJson } from './files';
import { readSettings } from './settings';

const schema = z.object({
  name: z.string(),
  lastSeen: z.number(),
  streams: z.record(z.string(), z.number()).default({}),
  disconnectedAt: z.number().default(0),
});
const CONNECTION_TTL_MS = 60000;
const STREAM_HEARTBEAT_MS = 20000;
const connectionPath = async () => join((await readSettings()).dataFolder, 'connection.json');
const readConnection = async (path: string) => {
  const saved = schema.safeParse(await readJson(path));
  return saved.success
    ? saved.data
    : { name: 'MCP agent', lastSeen: 0, streams: {}, disconnectedAt: 0 };
};
const updateConnection = async (
  change: (saved: z.infer<typeof schema>) => z.infer<typeof schema>,
) => {
  const path = await connectionPath();
  await serialDisk(path, async () => writeJson(path, change(await readConnection(path))));
};
export const markConnected = (name?: string) =>
  updateConnection((saved) => ({
    ...saved,
    name: (name ?? saved.name).slice(0, 100),
    lastSeen: Date.now(),
    disconnectedAt: 0,
  }));
export const holdConnection = (signal: AbortSignal, intervalMs = STREAM_HEARTBEAT_MS) => {
  if (signal.aborted) {
    return;
  }
  const id = randomUUID();
  const closed = Promise.withResolvers<void>();
  const refresh = () =>
    updateConnection((saved) => {
      if (signal.aborted) {
        return saved;
      }
      const streams = Object.fromEntries(
        Object.entries(saved.streams).filter(([, seen]) => Date.now() - seen < CONNECTION_TTL_MS),
      );
      return {
        ...saved,
        streams: { ...streams, [id]: Date.now() },
        lastSeen: Date.now(),
        disconnectedAt: 0,
      };
    }).catch(() => undefined);
  refresh().catch(() => undefined);
  const timer = setInterval(refresh, intervalMs);
  timer.unref?.();
  signal.addEventListener(
    'abort',
    () => {
      clearInterval(timer);
      updateConnection((saved) => {
        const streams = { ...saved.streams };
        delete streams[id];
        return { ...saved, streams, disconnectedAt: Date.now() };
      })
        .catch(() => undefined)
        .finally(() => closed.resolve());
    },
    { once: true },
  );
  return closed.promise;
};
export const connectionState = async () => {
  const saved = await readConnection(await connectionPath());
  const activeStream = Object.values(saved.streams).some(
    (seen) => Date.now() - seen < CONNECTION_TTL_MS,
  );
  return {
    name: saved.name,
    lastSeen: saved.lastSeen,
    connected:
      activeStream ||
      (saved.lastSeen > saved.disconnectedAt && Date.now() - saved.lastSeen < CONNECTION_TTL_MS),
  };
};
