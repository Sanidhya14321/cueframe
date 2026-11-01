import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import { isHosted } from './security';
import { configFolder } from './settings';

const MAX_TRACKED_KEYS = 10000;
const SAVE_DELAY_MS = 1000;
const savedSchema = z.record(z.string(), z.object({ count: z.number(), resetAt: z.number() }));
const statePath = () => join(configFolder(), 'rate-limits.json');

const loadWindows = () => {
  try {
    return new Map(
      Object.entries(savedSchema.parse(JSON.parse(readFileSync(statePath(), 'utf8')))),
    );
  } catch {
    return new Map<string, { count: number; resetAt: number }>();
  }
};
const windows = loadWindows();
let saveTimer: ReturnType<typeof setTimeout> | null = null;

const scheduleSave = () => {
  saveTimer ??= setTimeout(() => {
    saveTimer = null;
    try {
      mkdirSync(configFolder(), { recursive: true, mode: 0o700 });
      writeFileSync(statePath(), JSON.stringify(Object.fromEntries(windows)), { mode: 0o600 });
    } catch {
      console.error('[cueframe] could not save rate limits');
    }
  }, SAVE_DELAY_MS);
  saveTimer.unref?.();
};

export const takeRateLimit = (key: string, limit: number, windowMs: number): number | null => {
  const now = Date.now();
  if (windows.size >= MAX_TRACKED_KEYS) {
    for (const [tracked, entry] of windows) {
      if (entry.resetAt <= now) {
        windows.delete(tracked);
      }
    }
    if (windows.size >= MAX_TRACKED_KEYS) {
      windows.clear();
    }
  }
  scheduleSave();
  const current = windows.get(key);
  if (current === undefined || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }
  current.count += 1;
  return current.count > limit ? Math.ceil((current.resetAt - now) / 1000) : null;
};

export const clientAddress = (request: Request): string =>
  request.headers
    .get('x-forwarded-for')
    ?.split(',')
    .at(-1)
    ?.trim()
    .replace(/^([^:]+):\d+$/, '$1') ||
  request.headers.get('x-real-ip') ||
  'unknown';

export const hostedSpendProblem = (
  request: Request,
  name: string,
  limitPerMinute: number,
): Response | null => {
  if (!isHosted()) {
    return null;
  }
  const retryAfter = takeRateLimit(`${name}:${clientAddress(request)}`, limitPerMinute, 60000);
  return retryAfter === null
    ? null
    : Response.json(
        { problem: 'Too many requests. Wait a moment, then try again.' },
        { status: 429, headers: { 'retry-after': String(retryAfter) } },
      );
};
