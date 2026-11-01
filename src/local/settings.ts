import { rename } from 'node:fs/promises';
import { homedir } from 'node:os';
import { isAbsolute, join, resolve } from 'node:path';
import { z } from 'zod';
import { serialDisk } from './file-lock';
import { ensureDirectory, readJson, writeJson } from './files';
import {
  type LocalSettings,
  type PublicSettings,
  settingsChangeSchema,
  settingsSchema,
} from './settings-schema';

const locationSchema = z.object({ dataFolder: z.string() });

export const configFolder = (): string => {
  // biome-ignore lint/style/noProcessEnv: local runtime configuration is isolated from provider credentials
  const { CUEFRAME_HOME } = process.env;
  return resolve(CUEFRAME_HOME || join(homedir(), 'cueframe'));
};

const normalizeFolder = (value: string): string => {
  const expanded =
    value === '~' ? homedir() : value.startsWith('~/') ? join(homedir(), value.slice(2)) : value;
  if (!isAbsolute(expanded)) {
    throw new Error('Choose an absolute data folder path.');
  }
  return resolve(expanded);
};

const activeFolder = async (): Promise<string> => {
  const location = await readJson(join(configFolder(), 'location.json'));
  return location === null
    ? configFolder()
    : normalizeFolder(locationSchema.parse(location).dataFolder);
};

export const readSettings = async (): Promise<LocalSettings> => {
  const folder = await activeFolder();
  const path = join(folder, 'settings.json');
  return serialDisk(path, async () => {
    try {
      const saved = await readJson(path);
      if (saved !== null) {
        return settingsSchema.parse({ ...settingsSchema.parse(saved), dataFolder: folder });
      }
    } catch (error) {
      if (!(error instanceof SyntaxError || error instanceof z.ZodError)) {
        throw error;
      }
      await rename(path, `${path}.corrupt-${Date.now()}`);
      console.error('[cueframe] settings.json was unreadable and has been set aside.');
    }
    const defaults: LocalSettings = {
      dataFolder: folder,
      providerType: 'openai-compatible',
      baseUrl: 'https://openrouter.ai/api/v1',
      model: '',
      apiKey: '',
      fishAudioKey: '',
      yugabyteUrl: '',
    };
    await writeJson(path, defaults);
    return defaults;
  });
};

export const publicSettings = (settings: LocalSettings): PublicSettings => ({
  dataFolder: settings.dataFolder,
  providerType: settings.providerType,
  baseUrl: settings.baseUrl,
  model: settings.model,
  hasApiKey: settings.apiKey !== '',
  hasFishAudioKey: settings.fishAudioKey !== '',
  hasYugabyteUrl: settings.yugabyteUrl !== '',
});

export const saveSettings = (input: unknown): Promise<PublicSettings> =>
  serialDisk(join(configFolder(), '.settings-operation'), async () => {
    const change = settingsChangeSchema.parse(input);
    const previous = await readSettings();
    const { clearApiKey, clearFishAudioKey, ...fields } = change;
    const next = settingsSchema.parse({
      ...previous,
      ...fields,
      dataFolder: normalizeFolder(fields.dataFolder ?? previous.dataFolder),
      apiKey: clearApiKey ? '' : (fields.apiKey ?? previous.apiKey),
      fishAudioKey: clearFishAudioKey ? '' : (fields.fishAudioKey ?? previous.fishAudioKey),
    });
    await ensureDirectory(join(next.dataFolder, 'projects'));
    await writeJson(join(next.dataFolder, 'settings.json'), next);
    await writeJson(join(configFolder(), 'location.json'), { dataFolder: next.dataFolder });
    return publicSettings(next);
  });
