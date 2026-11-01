import { isHosted } from './security';

const MAX_TRACKED_KEYS = 10000;
const windows = new Map<string, { count: number; resetAt: number }>();

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
  const current = windows.get(key);
  if (current === undefined || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }
  current.count += 1;
  return current.count > limit ? Math.ceil((current.resetAt - now) / 1000) : null;
};

export const clientAddress = (request: Request): string =>
  request.headers.get('x-real-ip') ??
  request.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim() ??
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
