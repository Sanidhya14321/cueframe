import { AgentConfigurationError, describeAgentError } from '@/agent/model';
import { agentEventInputSchema } from '@/local/event-schema';
import { projectApi } from '@/local/project-api';
import { sendProjectChat } from '@/local/project-chat';
import { chatEngineSchema, type ProjectChatUpdate } from '@/local/project-chat-schema';
import { ProjectProblem } from '@/local/projects';
import { hostedSpendProblem } from '@/local/rate-limit';

export const maxDuration = 60;

export const POST = (request: Request, { params }: { params: Promise<{ projectId: string }> }) =>
  projectApi(request, async () => {
    const limited = hostedSpendProblem(request, 'project-chat', 30);
    if (limited) {
      return limited;
    }
    const parsed = agentEventInputSchema
      .extend({ engine: chatEngineSchema.default('auto') })
      .safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return Response.json(
        { problem: 'Enter a message of up to 8,000 characters.' },
        { status: 400 },
      );
    }
    const projectId = (await params).projectId;
    if (request.headers.get('accept')?.includes('application/x-ndjson')) {
      const encoder = new TextEncoder();
      const abort = new AbortController();
      let closed = false;
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          const emit = (update: ProjectChatUpdate) => {
            if (!(closed || request.signal.aborted)) {
              controller.enqueue(encoder.encode(`${JSON.stringify(update)}\n`));
            }
          };
          emit({ type: 'status', text: 'Connecting to your agent…' });
          sendProjectChat(projectId, parsed.data, new URL(request.url).origin, undefined, {
            engine: parsed.data.engine,
            signal: AbortSignal.any([request.signal, abort.signal]),
            onUpdate: emit,
          })
            .catch((error: unknown) => {
              emit({
                type: 'error',
                message:
                  error instanceof AgentConfigurationError || error instanceof ProjectProblem
                    ? error.message
                    : describeAgentError(error),
                configurationRequired: error instanceof AgentConfigurationError,
              });
            })
            .finally(() => {
              if (!closed) {
                closed = true;
                controller.close();
              }
            });
        },
        cancel() {
          closed = true;
          abort.abort();
        },
      });
      return new Response(stream, {
        headers: {
          'content-type': 'application/x-ndjson',
          'cache-control': 'no-cache, no-transform',
          'x-accel-buffering': 'no',
        },
      });
    }
    try {
      return Response.json(
        await sendProjectChat(projectId, parsed.data, new URL(request.url).origin, undefined, {
          engine: parsed.data.engine,
        }),
      );
    } catch (error) {
      if (error instanceof AgentConfigurationError) {
        return Response.json(
          { problem: error.message, configurationRequired: true },
          { status: 400 },
        );
      }
      throw error;
    }
  });
