import { z } from 'zod';
import { projectTools } from '@/agent/project-tools';
import { projectApi, requestActor } from '@/local/project-api';
import { localOrigin } from '@/local/security';

const input = z.object({
  clipId: z.string(),
  start: z.number().int().min(0),
  clientId: z.string().default('api'),
});
export const POST = (request: Request, { params }: { params: Promise<{ projectId: string }> }) =>
  projectApi(request, async () => {
    const { clipId, start, clientId } = input.parse(await request.json());
    const { projectId } = await params;
    return Response.json(
      await projectTools.add_item.invoke(
        { projectId, clipId, start, confirmed: true },
        {
          origin: localOrigin(request) ?? new URL(request.url).origin,
          actor: requestActor(request, clientId),
        },
      ),
    );
  });
