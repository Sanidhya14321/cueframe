/* biome-ignore-all lint/style/noProcessEnv: these tests set the operator's hosted configuration */
import { afterEach, describe, expect, it } from 'bun:test';
import {
  authenticate,
  isHosted,
  localOrigin,
  requestRole,
  roleCookie,
  roleProblem,
} from '@/local/security';

afterEach(() => {
  Reflect.deleteProperty(process.env, 'CLIPKIT_PASSWORD');
  Reflect.deleteProperty(process.env, 'CLIPKIT_PUBLIC_URL');
  Reflect.deleteProperty(process.env, 'CLIPKIT_USERS');
});

describe('hosted access', () => {
  it('stays local-only until configured', () => {
    expect(isHosted()).toBe(false);
    expect(authenticate('admin', 'anything')).toBeNull();
  });

  it('accepts only its public host and the right password', () => {
    Object.assign(process.env, {
      CLIPKIT_PASSWORD: 'correct',
      CLIPKIT_PUBLIC_URL: 'https://studio.example.com',
    });
    const request = (host: string) => new Request(`http://${host}/`);
    expect(localOrigin(request('studio.example.com'))).toBe('https://studio.example.com');
    expect(localOrigin(request('evil.example.com'))).toBeNull();
    expect(authenticate('admin', 'correct')).toBe('admin');
    expect(authenticate('admin', 'wrong')).toBeNull();
  });

  it('blocks viewer writes and creator settings changes', () => {
    Object.assign(process.env, {
      CLIPKIT_USERS: JSON.stringify([{ email: 'v', password: 'p', role: 'viewer' }]),
      CLIPKIT_PUBLIC_URL: 'https://studio.example.com',
    });
    expect(authenticate('v', 'p')).toBe('viewer');
    const write = (path: string, role: 'viewer' | 'creator') =>
      ({
        url: `https://studio.example.com${path}`,
        method: 'POST',
        headers: new Headers({ cookie: `clipkit-role=${roleCookie(role)}` }),
      }) as Request;
    expect(requestRole(write('/api/projects', 'viewer'))).toBe('viewer');
    expect(roleProblem(write('/api/projects', 'viewer'))?.status).toBe(403);
    expect(roleProblem(write('/api/projects', 'creator'))).toBeNull();
    expect(roleProblem(write('/api/settings', 'creator'))?.status).toBe(403);
  });
});
