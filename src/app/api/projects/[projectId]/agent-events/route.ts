import { enqueueEvent } from '@/local/agent-events';
import { agentEventInputSchema } from '@/local/event-schema';
import { projectApi } from '@/local/project-api';
import { publicProjectState } from '@/local/project-state';
export const POST = (request: Request, { params }: { params: Promise<{ projectId: string }> }) =>
  projectApi(request, async () =>
    Response.json(
      publicProjectState(
        await enqueueEvent(
          (await params).projectId,
          agentEventInputSchema.parse(await request.json()),
        ),
      ),
    ),
  );
