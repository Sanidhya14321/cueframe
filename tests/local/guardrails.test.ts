/* biome-ignore-all lint/style/noProcessEnv: these tests set the operator's hosted configuration */
import { afterEach, describe, expect, it } from 'bun:test';
import { z } from 'zod';
import { projectApi } from '@/local/project-api';
import { ProjectProblem } from '@/local/projects';
import { clientAddress, hostedSpendProblem, takeRateLimit } from '@/local/rate-limit';
import {
  browserSessionToken,
  canSeeAgentToken,
  hostedStartupProblems,
  isHosted,
  requireLocalSession,
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
  for (const key of ['CUEFRAME_PASSWORD', 'CUEFRAME_PUBLIC_URL']) {
    Reflect.deleteProperty(process.env, key);
  }
});

describe('hosted session separation', () => {
  it('keeps browser and agent tokens separate', () => {
    host();
    expect(browserSessionToken()).not.toBe(sessionToken());
    const owner = `${SESSION_COOKIE}=${browserSessionToken()}`;
    expect(requireLocalSession(hostedRequest({ cookie: owner }))).toBeNull();
    const stolen = { authorization: `Bearer ${browserSessionToken()}` };
    expect(requireLocalSession(hostedRequest(stolen))?.status).toBe(401);
    expect(canSeeAgentToken(hostedRequest({}, 'GET', '/api/connect'))).toBe(false);
  });

  it('shows the connection token only to the signed-in owner or CLI', () => {
    expect(browserSessionToken()).toBe(sessionToken());
    host();
    const owner = `${SESSION_COOKIE}=${browserSessionToken()}`;
    expect(canSeeAgentToken(hostedRequest({ cookie: owner }, 'GET', '/api/connect'))).toBe(true);
    expect(
      canSeeAgentToken(
        hostedRequest({ authorization: `Bearer ${sessionToken()}` }, 'GET', '/api/connect'),
      ),
    ).toBe(true);
  });

  it('refuses anonymous writes', () => {
    host();
    expect(requireLocalSession(hostedRequest({}))?.status).toBe(401);
  });

  it('reports invalid and weak owner settings without exposing credentials', () => {
    Object.assign(process.env, {
      CUEFRAME_PUBLIC_URL: 'invalid',
      CUEFRAME_PASSWORD: 'private-owner-password',
    });
    const invalid = hostedStartupProblems();
    expect(invalid.errors).toHaveLength(1);
    expect(invalid.errors.join()).not.toContain('private-owner-password');
    expect(() => isHosted()).toThrow();
    Object.assign(process.env, { CUEFRAME_PUBLIC_URL: ORIGIN, CUEFRAME_PASSWORD: 'short' });
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

describe('client address', () => {
  it('uses the entry the proxy appended, so clients cannot choose their own key', () => {
    const spoofed = hostedRequest({
      'x-real-ip': '9.9.9.9',
      'x-forwarded-for': '8.8.8.8, 1.1.1.1:443',
    });
    expect(clientAddress(spoofed)).toBe('1.1.1.1');
    expect(clientAddress(hostedRequest({ 'x-real-ip': '1.1.1.1' }))).toBe('1.1.1.1');
    expect(clientAddress(hostedRequest({}))).toBe('unknown');
  });
});

describe('rate limit persistence', () => {
  it('writes counts to the data folder for the next start', async () => {
    const key = crypto.randomUUID();
    takeRateLimit(key, 5, 60000);
    await Bun.sleep(1100);
    const { configFolder } = await import('@/local/settings');
    expect(await Bun.file(`${configFolder()}/rate-limits.json`).text()).toContain(key);
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
