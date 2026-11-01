/* biome-ignore-all lint/style/noProcessEnv: this explicit setup command imports credentials into private disk settings */
import { readSettings, saveSettings } from '@/local/settings';

const { YUGABYTE_DATABASE_URL, FISH_AUDIO_API_KEY, AGENT_API_KEY, AGENT_BASE_URL, AGENT_MODEL } =
  process.env;

try {
  await saveSettings({
    ...(YUGABYTE_DATABASE_URL ? { yugabyteUrl: YUGABYTE_DATABASE_URL } : {}),
    ...(FISH_AUDIO_API_KEY ? { fishAudioKey: FISH_AUDIO_API_KEY } : {}),
    ...(AGENT_API_KEY ? { apiKey: AGENT_API_KEY } : {}),
    ...(AGENT_BASE_URL ? { baseUrl: AGENT_BASE_URL } : {}),
    ...(AGENT_MODEL ? { model: AGENT_MODEL } : {}),
  });
  const saved = await readSettings();
  console.info(`Yugabyte connection: ${saved.yugabyteUrl ? 'saved' : 'missing'}`);
  console.info(`Fish Audio key: ${saved.fishAudioKey ? 'saved' : 'missing'}`);
  console.info(`Agent model: ${saved.model ? 'saved' : 'missing'}`);
  console.info(
    `Agent key: ${saved.apiKey ? 'saved' : 'missing (only optional for a local provider)'}`,
  );
} catch {
  console.error('Configuration failed. Check the connection URL and local settings permissions.');
  process.exitCode = 1;
}
