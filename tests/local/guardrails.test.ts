/* biome-ignore-all lint/style/noProcessEnv: these tests set the operator's hosted configuration */
import { afterEach, describe, expect, it } from 'bun:test';
import { z } from 'zod';
import { projectApi } from '@/local/project-api';
import { ProjectProblem } from '@/local/projects';
import { hostedSpendProblem, takeRateLimit } from '@/local/rate-limit';
import {
  browserSessionToken,
  canSeeAgentToken,
  hostedStartupProblems,
  isHosted,
  requireLocalSession,
  roleCookie,
  roleProblem,
  SESSION_COOKIE,
  sessionToken,
} from '@/local/security';

const ORIGIN = 'https://studio.example.com';
const host = () =>
  Object.assign(process.env, {
    CUEFRAME_PASSWORD: 'correct-horse-battery',
    CUEFRAME_PUBLIC_URL: ORIGIN,
  });
const hostedRequest = (headers: Record<string, string>, method = 'POST', path = '/api/projects') =>
  ({
    url: `${ORIGIN}${path}`,
    method,
    headers: new Headers({ host: 'studio.example.com', origin: ORIGIN, ...headers }),
  }) as Request;

afterEach(() => {
  for (const key of ['CUEFRAME_PASSWORD', 'CUEFRAME_PUBLIC_URL', 'CUEFRAME_USERS']) {
    Reflect.deleteProperty(process.env, key);
  }
});

describe('hosted session separation', () => {
  it('never hands the agent token to the browser', () => {
    host();
    expect(browserSessionToken()).not.toBe(sessionToken());
    const viewer = `${SESSION_COOKIE}=${browserSessionToken()}; cueframe-role=${roleCookie('viewer')}`;
    expect(requireLocalSession(hostedRequest({ cookie: viewer }))?.status).toBe(403);
    const stolen = { authorization: `Bearer ${browserSessionToken()}` };
    expect(requireLocalSession(hostedRequest(stolen))?.status).toBe(401);
    expect(canSeeAgentToken(hostedRequest({ cookie: viewer }, 'GET', '/api/connect'))).toBe(false);
  });

  it('shows the token to admins and keeps the local cookie unchanged', () => {
    expect(browserSessionToken()).toBe(sessionToken());
    host();
    const admin = `cueframe-role=${roleCookie('admin')}`;
    expect(canSeeAgentToken(hostedRequest({ cookie: admin }, 'GET', '/api/connect'))).toBe(true);
  });

  it('refuses writes from a session without a role', () => {
    host();
    expect(roleProblem(hostedRequest({}))?.status).toBe(403);
  });

  it('reports invalid and weak hosted settings without leaking them', () => {
    Object.assign(process.env, { CUEFRAME_PUBLIC_URL: ORIGIN, CUEFRAME_USERS: '{secret' });
    const invalid = hostedStartupProblems();
    expect(invalid.errors).toHaveLength(1);
    expect(invalid.errors.join()).not.toContain('secret');
    expect(() => isHosted()).toThrow();
    Object.assign(process.env, {
      CUEFRAME_USERS: JSON.stringify([{ email: 'a', password: 'short', role: 'admin' }]),
    });
    expect(hostedStartupProblems().warnings.join()).toContain('short');
  });
});

describe('rate limits', () => {
  it('blocks past the limit and reports the wait', () => {
    const key = crypto.randomUUID();
    expect(takeRateLimit(key, 1, 60000)).toBeNull();
    expect(takeRateLimit(key, 1, 60000)).toBeGreaterThan(0);
    const expired = crypto.randomUUID();
    takeRateLimit(expired, 1, 0);
    expect(takeRateLimit(expired, 1, 0)).toBeNull();
  });

  it('applies spend limits only to the hosted version', () => {
    const name = crypto.randomUUID();
    const request = hostedRequest({ 'x-real-ip': '1.1.1.1' });
    expect(hostedSpendProblem(request, name, 1)).toBeNull();
    host();
    expect(hostedSpendProblem(request, name, 1)).toBeNull();
    expect(hostedSpendProblem(request, name, 1)?.status).toBe(429);
  });
});

describe('project API errors', () => {
  const statusOf = async (error: unknown) => {
    const request = new Request('http://127.0.0.1:3000/api/projects', {
      headers: { authorization: `Bearer ${sessionToken()}`, host: '127.0.0.1:3000' },
    });
    return (await projectApi(request, () => Promise.reject(error))).status;
  };

  it('separates bad input, missing files and server faults', async () => {
    expect(await statusOf(new ProjectProblem('Locked.', 423))).toBe(423);
    expect(await statusOf(z.string().safeParse(1).error)).toBe(400);
    expect(await statusOf(new SyntaxError('bad json'))).toBe(400);
    expect(await statusOf(Object.assign(new Error('gone'), { code: 'ENOENT' }))).toBe(404);
    expect(await statusOf(new Error('disk full'))).toBe(500);
  });
});
