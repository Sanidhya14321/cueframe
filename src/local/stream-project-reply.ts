import { type LanguageModel, stepCountIs, streamText, type ToolSet } from 'ai';

export const streamProjectReply = async (input: {
  model: LanguageModel;
  instructions: string;
  prompt: string;
  tools: ToolSet;
  signal: AbortSignal | undefined;
  onText: (text: string) => void;
}) => {
  const result = streamText({
    model: input.model,
    instructions: input.instructions,
    messages: [{ role: 'user', content: input.prompt }],
    tools: input.tools,
    maxOutputTokens: 2000,
    stopWhen: stepCountIs(12),
    onError: () => undefined,
    abortSignal: AbortSignal.any([
      AbortSignal.timeout(45000),
      ...(input.signal ? [input.signal] : []),
    ]),
  });
  let characters = 0;
  const emit = (text: string) => {
    const next = text.slice(0, Math.max(0, 8000 - characters));
    characters += next.length;
    if (next) {
      input.onText(next);
    }
  };
  for await (const part of result.fullStream) {
    if (part.type === 'error') {
      throw part.error;
    }
    if (part.type === 'abort') {
      throw new DOMException('Reply stopped.', 'AbortError');
    }
    if (part.type === 'text-start' && characters > 0) {
      emit('\n\n');
    }
    if (part.type === 'text-delta') {
      emit(part.text);
    }
  }
};
