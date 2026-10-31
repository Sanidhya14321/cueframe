import { z } from 'zod';

const providerUrl = z.url().refine((value) => {
  const url = new URL(value);
  return (
    ['http:', 'https:'].includes(url.protocol) &&
    !url.username &&
    !url.password &&
    !url.search &&
    !url.hash
  );
}, 'Use an HTTP or HTTPS base URL without credentials, query or fragment.');

export const settingsSchema = z
  .object({
    dataFolder: z.string().min(1),
    providerType: z.enum(['openai-compatible', 'anthropic']),
    baseUrl: providerUrl,
    model: z.string().max(200),
    apiKey: z.string().max(4096),
    fishAudioKey: z.string().max(4096),
  })
  .strict();

export type LocalSettings = z.infer<typeof settingsSchema>;

export const publicSettingsSchema = settingsSchema
  .omit({ apiKey: true, fishAudioKey: true })
  .extend({
    hasApiKey: z.boolean(),
    hasFishAudioKey: z.boolean(),
  });

export type PublicSettings = z.infer<typeof publicSettingsSchema>;

export const settingsChangeSchema = settingsSchema
  .partial()
  .extend({
    clearApiKey: z.boolean().optional(),
    clearFishAudioKey: z.boolean().optional(),
  })
  .strict();
