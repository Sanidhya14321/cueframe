import type { LanguageModel } from 'ai';
import { agentModel } from '@/agent/model';
import { connectionState } from './connections';
import type { ChatEngine } from './project-chat-schema';
import { ProjectProblem } from './project-problem';

export const resolveChatEngine = async (
  listening: boolean,
  engine?: ChatEngine,
  override?: LanguageModel,
) => {
  const external = await connectionState();
  if (engine === 'external' || (engine !== 'in-app' && (listening || external.connected))) {
    if (!(listening || external.connected)) {
      throw new ProjectProblem('Connect your coding agent first, or choose the AI editor.', 409);
    }
    return { mode: 'external' as const, waiting: !listening };
  }
  return { mode: 'in-app' as const, model: override ?? (await agentModel()) };
};
