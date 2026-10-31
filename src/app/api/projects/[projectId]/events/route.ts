import { projectApi } from '@/local/project-api';
import { projectEvents } from '@/local/project-events';
import { readProject } from '@/local/projects';
export const dynamic = 'force-dynamic';
export const GET = (request: Request, { params }: { params: Promise<{ projectId: string }> }) =>
  projectApi(request, async () => {
    const { projectId } = await params;
    await readProject(projectId);
    return new Response(projectEvents(projectId, request.signal), {
      headers: {
        'content-type': 'text/event-stream',
        'cache-control': 'no-cache, no-transform',
        connection: 'keep-alive',
        'x-accel-buffering': 'no',
      },
    });
  });
