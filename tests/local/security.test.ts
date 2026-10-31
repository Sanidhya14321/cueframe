import { describe, expect, it } from 'bun:test';
import {
  localRequestProblem,
  requireLocalSession,
  SESSION_COOKIE,
  sessionToken,
} from '@/local/security';
import { ServerRequest } from '../server-http';

const origin = 'http://127.0.0.1:3000';
const request = (headers: HeadersInit = {}, method = 'PUT', url = `${origin}/api/settings`) =>
  new ServerRequest(url, { method, headers });
const bearer = () => ({ authorization: `Bearer ${sessionToken()}` });
const cookie = () => ({ cookie: `${SESSION_COOKIE}=${sessionToken()}` });

describe('local session security', () => {
  it('accepts token-authenticated local command-line requests without Origin', () => {
    expect(requireLocalSession(request(bearer()))).toBeNull();
    expect(sessionToken()).toBe(sessionToken());
  });
  it('requires the browser token and exact origin for writes', () => {
    expect(requireLocalSession(request({ ...cookie(), origin }))).toBeNull();
    expect(requireLocalSession(request(cookie()))?.status).toBe(403);
    expect(requireLocalSession(request({ origin }))?.status).toBe(401);
    expect(requireLocalSession(request({ authorization: 'Bearer wrong' }))?.status).toBe(401);
  });
  it('protects private reads and rejects cross-site requests even with a token', () => {
    expect(requireLocalSession(request({}, 'GET'))?.status).toBe(401);
    expect(requireLocalSession(request(cookie(), 'GET'))).toBeNull();
    expect(
      requireLocalSession(request({ ...bearer(), origin: 'https://evil.example' }))?.status,
    ).toBe(403);
    expect(
      requireLocalSession(request({ ...bearer(), 'sec-fetch-site': 'cross-site' }))?.status,
    ).toBe(403);
  });
  it('accepts Next-normalized loopback URLs but validates the actual browser origin', () => {
    expect(
      requireLocalSession(
        request(
          { ...cookie(), host: '127.0.0.1:3000', origin },
          'PUT',
          'http://localhost:3000/api/settings',
        ),
      ),
    ).toBeNull();
    expect(
      requireLocalSession(
        request(
          { ...cookie(), host: '127.0.0.1:3000', origin: 'http://localhost:3000' },
          'PUT',
          'http://localhost:3000/api/settings',
        ),
      )?.status,
    ).toBe(403);
  });
  it('rejects remote and rebound hosts, null origins and port mismatches', () => {
    expect(
      localRequestProblem(request({}, 'GET', 'https://evil.example/api/settings'))?.status,
    ).toBe(403);
    expect(requireLocalSession(request({ ...bearer(), host: 'evil.example' }))?.status).toBe(403);
    expect(requireLocalSession(request({ ...bearer(), origin: 'null' }))?.status).toBe(403);
    expect(
      requireLocalSession(request({ ...bearer(), origin: 'http://127.0.0.1:3001' }))?.status,
    ).toBe(403);
  });
});
