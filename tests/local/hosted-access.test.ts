/* biome-ignore-all lint/style/noProcessEnv: tests configure the single owner login */
import { afterEach, describe, expect, it } from 'bun:test';
import { createHmac } from 'node:crypto';
import { POST as login } from '@/app/api/login/route';
import {
  authenticate,
  browserSessionToken,
  isHosted,
  localOrigin,
  requireLocalSession,
  SESSION_COOKIE,
  sessionToken,
} from '@/local/security';

afterEach(() => {
  Reflect.deleteProperty(process.env, 'CUEFRAME_PASSWORD');
  Reflect.deleteProperty(process.env, 'CUEFRAME_PUBLIC_URL');
});

describe('owner access', () => {
  it('signs in with only a password and invalidates old role-based browser sessions', async () => {
    const origin = 'https://studio.example.com';
    Object.assign(process.env, { CUEFRAME_PASSWORD: 'correct', CUEFRAME_PUBLIC_URL: origin });
    const form = new FormData();
    form.set('password', 'correct');
    const request = {
      url: `${origin}/api/login`,
      method: 'POST',
      headers: new Headers({ origin }),
      formData: () => Promise.resolve(form),
    } as Request;
    const response = await login(request);
    expect(response.status).toBe(303);
    expect(response.cookies.getAll().map((cookie) => cookie.name)).toEqual([SESSION_COOKIE]);
    expect(response.cookies.get(SESSION_COOKIE)?.value).toBe(browserSessionToken());
    const old = createHmac('sha256', sessionToken()).update('browser-session').digest('hex');
    const oldRequest = {
      ...request,
      url: `${origin}/api/settings`,
      headers: new Headers({ origin, cookie: `${SESSION_COOKIE}=${old}` }),
    } as Request;
    expect(requireLocalSession(oldRequest)?.status).toBe(401);
  });
  it('keeps the free local app account-free', () => {
    expect(isHosted()).toBe(false);
    expect(authenticate('anything')).toBe(false);
  });

  it('accepts only its public host and the owner password', () => {
    Object.assign(process.env, {
      CUEFRAME_PASSWORD: 'correct',
      CUEFRAME_PUBLIC_URL: 'https://studio.example.com',
    });
    const request = (host: string) => new Request(`http://${host}/`);
    expect(localOrigin(request('studio.example.com'))).toBe('https://studio.example.com');
    expect(localOrigin(request('evil.example.com'))).toBeNull();
    expect(authenticate('correct')).toBe(true);
    expect(authenticate('wrong')).toBe(false);
  });

  it('gives one authenticated owner access to projects and settings without a role cookie', () => {
    const origin = 'https://studio.example.com';
    Object.assign(process.env, { CUEFRAME_PASSWORD: 'correct', CUEFRAME_PUBLIC_URL: origin });
    for (const path of ['/api/projects', '/api/settings']) {
      const request = {
        url: `${origin}${path}`,
        method: 'POST',
        headers: new Headers({
          origin,
          cookie: `${SESSION_COOKIE}=${browserSessionToken()}`,
        }),
      } as Request;
      expect(requireLocalSession(request)).toBeNull();
    }
    const anonymous = new Request(`${origin}/api/projects`, {
      method: 'POST',
      headers: { origin },
    });
    expect(requireLocalSession(anonymous)?.status).toBe(401);
    const crossSite = {
      url: `${origin}/api/projects`,
      method: 'POST',
      headers: new Headers({
        origin: 'https://evil.example.com',
        cookie: `${SESSION_COOKIE}=${browserSessionToken()}`,
      }),
    } as Request;
    expect(requireLocalSession(crossSite)?.status).toBe(403);
  });
});
