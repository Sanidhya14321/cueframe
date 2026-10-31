import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { APICallError, type LanguageModel } from 'ai';
import { readSettings } from '@/local/settings';

export const agentModel = async (): Promise<LanguageModel> => {
  const settings = await readSettings();
  if (settings.providerType !== 'openai-compatible') {
    throw new Error('Choose an OpenAI-compatible provider in Settings.');
  }
  if (!settings.model) {
    throw new Error('Choose a model in Settings before using the AI editor.');
  }
  return createOpenRouter({
    baseURL: settings.baseUrl,
    apiKey: settings.apiKey || 'local-no-key',
    compatibility: 'compatible',
    fetch: Object.assign(
      (input: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]) =>
        fetch(input, { ...init, redirect: 'error' }),
      { preconnect: fetch.preconnect },
    ),
  })(settings.model);
};

const statusOf = (error: unknown): number | undefined => {
  if (APICallError.isInstance(error)) {
    return error.statusCode;
  }
  if (typeof error === 'object' && error !== null && 'lastError' in error) {
    return statusOf(error.lastError);
  }
  return undefined;
};

export const describeAgentError = (error: unknown): string => {
  const status = statusOf(error);
  if (status === 401 || status === 402 || status === 403) {
    return 'The AI editor is not available right now. Check the API key and credits.';
  }
  if (status === 429) {
    return 'The AI usage limit has been reached. Try again later.';
  }
  if (status !== undefined && status >= 500) {
    return 'The AI model is busy right now. Try again in a moment.';
  }
  return 'Something went wrong while editing. Try again.';
};
