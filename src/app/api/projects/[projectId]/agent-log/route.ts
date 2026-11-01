import { readAgentLog } from '@/local/agent-log';
import { projectApi } from '@/local/project-api';

const CHECK_MS = 400;
const encoder = new TextEncoder();
export const dynamic = 'force-dynamic';
export const GET = (request: Request, { params }: { params: Promise<{ projectId: string }> }) =>
  projectApi(request, async () => {
    const { projectId } = await params;
    await readAgentLog(projectId);
    let timer: ReturnType<typeof setInterval>;
    let closed = false;
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        let last = '';
        const check = async () => {
          const next = JSON.stringify(await readAgentLog(projectId));
          if (next !== last && !request.signal.aborted && !closed) {
            last = next;
            controller.enqueue(encoder.encode(`data: ${next}\n\n`));
          }
        };
        check().catch(() => undefined);
        timer = setInterval(() => check().catch(() => undefined), CHECK_MS);
        request.signal.addEventListener('abort', () => {
          clearInterval(timer);
          if (!closed) {
            closed = true;
            controller.close();
          }
        });
      },
      cancel() {
        closed = true;
        clearInterval(timer);
      },
    });
    return new Response(stream, {
      headers: {
        'content-type': 'text/event-stream',
        'cache-control': 'no-cache, no-transform',
        connection: 'keep-alive',
        'x-accel-buffering': 'no',
      },
    });
  });
