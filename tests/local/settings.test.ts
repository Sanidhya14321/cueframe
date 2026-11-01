import { beforeEach, describe, expect, it } from 'bun:test';
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { GET, PUT } from '@/app/api/settings/route';
import { sessionToken } from '@/local/security';
import { configFolder, readSettings, saveSettings } from '@/local/settings';
import { resetTestHome } from './test-home';

beforeEach(resetTestHome);
const request = (body?: unknown) =>
  new Request('http://127.0.0.1:3000/api/settings', {
    method: body === undefined ? 'GET' : 'PUT',
    headers: { authorization: `Bearer ${sessionToken()}`, 'content-type': 'application/json' },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

describe('local settings', () => {
  it('initializes a private settings file and never returns secrets', async () => {
    await saveSettings({
      apiKey: 'test-provider-secret',
      fishAudioKey: 'test-voice-secret',
      model: 'test-model',
      yugabyteUrl: 'postgresql://localhost:5433/test-vector-database',
    });
    const response = await GET(request());
    const text = await response.text();
    expect(text).not.toContain('test-provider-secret');
    expect(text).not.toContain('test-voice-secret');
    expect(text).not.toContain('test-vector-database');
    expect(JSON.parse(text)).toMatchObject({ hasApiKey: true, hasFishAudioKey: true });
    expect((await readSettings()).apiKey).toBe('test-provider-secret');
    expect((await stat(join(configFolder(), 'settings.json'))).mode & 0o777).toBe(0o600);
  });
  it('preserves omitted secrets and removes them explicitly', async () => {
    await saveSettings({ apiKey: 'keep-me', yugabyteUrl: 'postgresql://localhost:5433/library' });
    await saveSettings({ model: 'another-model' });
    expect((await readSettings()).apiKey).toBe('keep-me');
    expect((await readSettings()).yugabyteUrl).toBe('postgresql://localhost:5433/library');
    await saveSettings({ clearApiKey: true });
    expect((await readSettings()).apiKey).toBe('');
  });
  it('switches the data folder and keeps only a path in its bootstrap pointer', async () => {
    const target = join(configFolder(), 'alternate');
    await saveSettings({ dataFolder: target, apiKey: 'local-key' });
    expect((await readSettings()).dataFolder).toBe(target);
    expect(JSON.parse(await readFile(join(configFolder(), 'location.json'), 'utf8'))).toEqual({
      dataFolder: target,
    });
    expect(await readFile(join(target, 'settings.json'), 'utf8')).toContain('local-key');
  });
  it('rejects relative folders, unknown fields and credentials in base URLs', async () => {
    expect((await PUT(request({ dataFolder: '../escape' }))).status).toBe(400);
    expect((await PUT(request({ owner: 'other' }))).status).toBe(400);
    // biome-ignore lint/security/noSecrets: intentionally invalid credentials to verify URL rejection
    expect((await PUT(request({ baseUrl: 'https://user:secret@example.com/v1' }))).status).toBe(
      400,
    );
    expect((await PUT(request({ baseUrl: 'file:///tmp/model' }))).status).toBe(400);
  });
  it('requires a session before reading or writing settings', async () => {
    expect((await GET(new Request('http://127.0.0.1:3000/api/settings'))).status).toBe(401);
    expect(
      (await PUT(new Request('http://127.0.0.1:3000/api/settings', { method: 'PUT' }))).status,
    ).toBe(401);
  });
});

describe('settings recovery', () => {
  it('sets a corrupt settings file aside and starts from defaults', async () => {
    const { readdir, writeFile: write } = await import('node:fs/promises');
    const path = await import('node:path');
    const settings = await import('@/local/settings');
    const { dataFolder } = await settings.readSettings();
    await write(path.join(dataFolder, 'settings.json'), '{broken');
    expect((await settings.readSettings()).apiKey).toBe('');
    expect((await readdir(dataFolder)).some((name) => name.includes('.corrupt-'))).toBe(true);
  });
});
