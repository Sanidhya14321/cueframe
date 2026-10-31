'use client';

import { type FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type PublicSettings, publicSettingsSchema } from '@/local/settings-schema';

export const SettingsForm = () => {
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [fishKey, setFishKey] = useState('');
  const [clearApiKey, setClearApiKey] = useState(false);
  const [clearFishKey, setClearFishKey] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Settings unavailable');
        }
        setSettings(publicSettingsSchema.parse(await response.json()));
      })
      .catch(() => setMessage('Could not load local settings. Reload to try again.'));
  }, []);

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (settings === null) {
      return;
    }
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          dataFolder: settings.dataFolder,
          providerType: settings.providerType,
          baseUrl: settings.baseUrl,
          model: settings.model.trim(),
          ...(apiKey ? { apiKey } : {}),
          ...(fishKey ? { fishAudioKey: fishKey } : {}),
          clearApiKey,
          clearFishAudioKey: clearFishKey,
        }),
      });
      if (!response.ok) {
        throw new Error('Could not save. Check the base URL and writable absolute folder path.');
      }
      setSettings(publicSettingsSchema.parse(await response.json()));
      setApiKey('');
      setFishKey('');
      setClearApiKey(false);
      setClearFishKey(false);
      setMessage('Settings saved on this computer.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save settings.');
    } finally {
      setBusy(false);
    }
  };

  const test = async () => {
    setBusy(true);
    setMessage('Testing the saved provider settings…');
    try {
      const response = await fetch('/api/settings/test', { method: 'POST' });
      setMessage(
        response.ok
          ? 'Connected. The selected model replied.'
          : 'Connection failed. Save a valid base URL, model and API key first.',
      );
    } catch {
      setMessage('Could not reach the local server.');
    } finally {
      setBusy(false);
    }
  };

  if (settings === null) {
    return (
      <p className="mt-6" role="status">
        {message || 'Loading local settings…'}
      </p>
    );
  }
  return (
    <form className="mt-8 flex flex-col gap-6" onSubmit={save}>
      <fieldset className="flex flex-col gap-3" disabled={busy}>
        <legend className="mb-3 font-medium">Storage</legend>
        <Label htmlFor="data-folder">Data folder</Label>
        <Input
          id="data-folder"
          required
          value={settings.dataFolder}
          onChange={(event) => setSettings({ ...settings, dataFolder: event.target.value })}
        />
        <p className="text-muted-foreground text-xs">
          Defaults to ~/ClipKit. Switching folders does not move existing projects. Keys are stored
          in that folder’s settings.json; a location pointer stays in the original ClipKit folder.
        </p>
      </fieldset>
      <fieldset className="flex flex-col gap-3" disabled={busy}>
        <legend className="mb-3 font-medium">AI provider</legend>
        <Label htmlFor="provider-type">Provider type</Label>
        <select
          id="provider-type"
          className="h-10 rounded-md border bg-background px-3 text-sm"
          value={settings.providerType}
          onChange={(event) =>
            setSettings({
              ...settings,
              providerType: event.target.value === 'anthropic' ? 'anthropic' : 'openai-compatible',
            })
          }
        >
          <option value="openai-compatible">OpenAI-compatible (including OpenRouter)</option>
        </select>
        <Label htmlFor="base-url">Base URL</Label>
        <Input
          id="base-url"
          type="url"
          required
          value={settings.baseUrl}
          onChange={(event) => setSettings({ ...settings, baseUrl: event.target.value })}
        />
        <Label htmlFor="model">Model</Label>
        <Input
          id="model"
          placeholder="Provider model ID"
          value={settings.model}
          onChange={(event) => setSettings({ ...settings, model: event.target.value })}
        />
        <Label htmlFor="provider-key">API key</Label>
        <Input
          id="provider-key"
          type="password"
          autoComplete="new-password"
          value={apiKey}
          placeholder={settings.hasApiKey ? 'Key saved. Leave blank to keep it.' : 'No key saved'}
          onChange={(event) => {
            setApiKey(event.target.value);
            setClearApiKey(false);
          }}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={clearApiKey}
            onChange={(event) => setClearApiKey(event.target.checked)}
          />
          Remove saved API key
        </label>
        <p className="text-muted-foreground text-xs">
          The AI editor sends your message and document to this provider only when you ask it to
          edit. The connection test sends a short test prompt and may use provider credits. Save
          before testing.
        </p>
      </fieldset>
      <fieldset className="flex flex-col gap-3" disabled={busy}>
        <legend className="mb-3 font-medium">Voice</legend>
        <Label htmlFor="fish-key">Fish Audio key</Label>
        <Input
          id="fish-key"
          type="password"
          autoComplete="new-password"
          value={fishKey}
          placeholder={
            settings.hasFishAudioKey ? 'Key saved. Leave blank to keep it.' : 'No key saved'
          }
          onChange={(event) => {
            setFishKey(event.target.value);
            setClearFishKey(false);
          }}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={clearFishKey}
            onChange={(event) => setClearFishKey(event.target.checked)}
          />
          Remove saved Fish Audio key
        </label>
        <p className="text-muted-foreground text-xs">Saved for voice generation.</p>
      </fieldset>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? 'Working…' : 'Save settings'}
        </Button>
        <Button type="button" variant="outline" disabled={busy} onClick={test}>
          Test saved provider
        </Button>
      </div>
      <p role="status" className="min-h-5 text-sm">
        {message}
      </p>
    </form>
  );
};
