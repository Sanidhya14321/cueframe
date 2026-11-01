import { type ProjectChatUpdate, projectChatUpdateSchema } from '@/local/project-chat-schema';

export class ChatRequestError extends Error {
  readonly configurationRequired: boolean;
  constructor(message: string, configurationRequired = false) {
    super(message);
    this.configurationRequired = configurationRequired;
  }
}

export const readProjectChat = async (
  response: Response,
  update: (part: ProjectChatUpdate) => void,
) => {
  if (!response.ok) {
    const problem = await response.json().catch(() => ({}));
    throw new ChatRequestError(
      problem.problem ?? 'Could not send this message. Try again.',
      problem.configurationRequired === true,
    );
  }
  if (!response.body) {
    throw new ChatRequestError('The reply connection did not open. Try again.');
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let finished = false;
  const consume = (line: string) => {
    if (!line.trim()) {
      return;
    }
    const part = projectChatUpdateSchema.parse(JSON.parse(line));
    if (part.type === 'error') {
      throw new ChatRequestError(part.message, part.configurationRequired);
    }
    if (part.type === 'finish') {
      finished = true;
    }
    update(part);
  };
  try {
    while (true) {
      // biome-ignore lint/performance/noAwaitInLoops: reply chunks arrive in network order
      const result = await reader.read();
      buffer += decoder.decode(result.value, { stream: !result.done });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        consume(line);
      }
      if (buffer.length > 65536) {
        throw new ChatRequestError('The reply stream was invalid. Try again.');
      }
      if (result.done) {
        break;
      }
    }
    consume(buffer);
    if (!finished) {
      throw new ChatRequestError(
        'The reply connection closed early. Check the conversation before retrying.',
      );
    }
  } finally {
    await reader.cancel().catch(() => undefined);
  }
};
