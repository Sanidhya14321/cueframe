/* biome-ignore-all lint/style/noProcessEnv: scheduled CI passes provider credentials as secrets */
/* biome-ignore-all lint/complexity/useLiteralKeys: environment records require indexed access */
const env = process.env;
type Check = { name: string; keys: string[]; run: () => Promise<string> };

const expectOk = (response: Response, name: string) => {
  if (!response.ok) {
    throw new Error(`${name} returned HTTP ${response.status}`);
  }
  return response;
};
const checks: Check[] = [
  {
    name: 'OpenAI-compatible model',
    keys: ['LIVE_MODEL_BASE_URL', 'LIVE_MODEL_API_KEY', 'LIVE_MODEL_ID'],
    run: async () => {
      const response = await fetch(`${env['LIVE_MODEL_BASE_URL']}/chat/completions`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${env['LIVE_MODEL_API_KEY']}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: env['LIVE_MODEL_ID'],
          max_tokens: 5,
          messages: [{ role: 'user', content: 'Reply with OK.' }],
        }),
      });
      const result = (await expectOk(response, 'Model').json()) as {
        choices?: { message?: { content?: string } }[];
      };
      if (!result.choices?.[0]?.message) {
        throw new Error('Model reply had no message');
      }
      return 'replied';
    },
  },
  {
    name: 'Fish Audio speech',
    keys: ['LIVE_FISH_API_KEY', 'LIVE_FISH_VOICE_ID'],
    run: async () => {
      const response = await fetch('https://api.fish.audio/v1/tts', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${env['LIVE_FISH_API_KEY']}`,
          'content-type': 'application/json',
          model: 's2.1-pro-free',
        },
        body: JSON.stringify({
          text: 'Provider check.',
          reference_id: env['LIVE_FISH_VOICE_ID'],
          format: 'wav',
        }),
      });
      const audio = await expectOk(response, 'Fish Audio').arrayBuffer();
      if (audio.byteLength === 0) {
        throw new Error('Fish Audio returned no audio');
      }
      return `${audio.byteLength} bytes`;
    },
  },
];
let failed = false;
for (const check of checks) {
  if (check.keys.some((key) => !env[key])) {
    console.info(`SKIP ${check.name}: add ${check.keys.join(', ')}`);
    continue;
  }
  try {
    // biome-ignore lint/performance/noAwaitInLoops: paid checks run one at a time
    console.info(`PASS ${check.name}: ${await check.run()}`);
  } catch (error) {
    failed = true;
    console.error(`FAIL ${check.name}: ${error instanceof Error ? error.message : 'unknown'}`);
  }
}
process.exit(failed ? 1 : 0);
