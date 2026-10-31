import { generateText } from 'ai';
import { agentModel } from '@/agent/model';
import { requireLocalSession } from '@/local/security';

export const POST = async (request: Request): Promise<Response> => {
  const denied = requireLocalSession(request);
  if (denied !== null) {
    return denied;
  }
  try {
    await generateText({
      model: await agentModel(),
      prompt: 'Reply with OK.',
      maxOutputTokens: 16,
      maxRetries: 0,
      abortSignal: AbortSignal.timeout(15000),
    });
    return Response.json({ message: 'Connected. The selected model replied.' });
  } catch {
    return Response.json(
      { problem: 'Connection failed. Check the saved base URL, model and API key.' },
      { status: 400 },
    );
  }
};
