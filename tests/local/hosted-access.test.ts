/* biome-ignore-all lint/style/noProcessEnv: these tests set the operator's hosted configuration */
import { afterEach, describe, expect, it } from 'bun:test';
import { isHosted, localOrigin, passwordMatches } from '@/local/security';

afterEach(() => {
  Reflect.deleteProperty(process.env, 'CLIPKIT_PASSWORD');
  Reflect.deleteProperty(process.env, 'CLIPKIT_PUBLIC_URL');
});

describe('hosted access', () => {
  it('stays local-only until configured', () => {
    expect(isHosted()).toBe(false);
    expect(passwordMatches('anything')).toBe(false);
  });

  it('accepts only its public host and the right password', () => {
    Object.assign(process.env, {
      CLIPKIT_PASSWORD: 'correct',
      CLIPKIT_PUBLIC_URL: 'https://studio.example.com',
    });
    const request = (host: string) => new Request('http://0.0.0.0:3000/', { headers: { host } });
    expect(localOrigin(request('studio.example.com'))).toBe('https://studio.example.com');
    expect(localOrigin(request('evil.example.com'))).toBeNull();
    expect(passwordMatches('correct')).toBe(true);
    expect(passwordMatches('wrong')).toBe(false);
  });
});
