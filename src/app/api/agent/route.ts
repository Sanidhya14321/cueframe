import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  toUIMessageStream,
} from 'ai';
import { maskAssets } from '@/agent/assets';
import { mediaInstructions } from '@/agent/instructions';
import { agentRequestSchema, checkMedia } from '@/agent/media';
import { agentModel, describeAgentError } from '@/agent/model';
import { createMediaTools, editSucceeded, type MediaAgentMessage } from '@/agent/tools';
import { hostedSpendProblem } from '@/local/rate-limit';
import { requireLocalSession } from '@/local/security';

export const maxDuration = 60;

const AGENT_REQUESTS_PER_MINUTE = 30;

const badRequest = (message: string): Response =>
  Response.json({ error: message }, { status: 400 });

export const POST = async (request: Request): Promise<Response> => {
  const denied = requireLocalSession(request);
  if (denied !== null) {
    return denied;
  }
  const limited = hostedSpendProblem(request, 'agent', AGENT_REQUESTS_PER_MINUTE);
  if (limited !== null) {
    return limited;
  }
  const parsed = agentRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return badRequest('Malformed agent request.');
  }
  const { media, chatTitle } = parsed.data;
  const checked = checkMedia(media.kind, media.document);
  if (!checked.ok) {
    return badRequest(checked.error);
  }
  const { masked, assets } = maskAssets(checked.document);
  const tools = createMediaTools(media.kind, masked, assets);
  const messages = parsed.data.messages as MediaAgentMessage[];

  let model: Awaited<ReturnType<typeof agentModel>>;
  try {
    model = await agentModel();
  } catch {
    return Response.json(
      { error: 'Choose your provider and model in Settings before using the AI editor.' },
      { status: 400 },
    );
  }
  const modelMessages = await convertToModelMessages(messages, { tools }).catch(() => null);
  if (modelMessages === null) {
    return badRequest('Malformed agent request.');
  }
  const result = streamText({
    model,
    instructions: mediaInstructions({ ...media, document: masked, chatTitle }),
    messages: modelMessages,
    abortSignal: request.signal,
    tools,
    stopWhen: [editSucceeded, stepCountIs(6)],
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream<typeof tools, MediaAgentMessage>({
      stream: result.stream,
      onError: describeAgentError,
    }),
  });
};
