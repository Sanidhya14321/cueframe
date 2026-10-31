import { z } from 'zod';
import { projectApi, requestActor } from '@/local/project-api';
import { publicProjectState } from '@/local/project-state';
import { commitAction, undoProject } from '@/local/projects';
import { projectActionSchema } from '@/project/actions';

const input = z.object({
  action: projectActionSchema.optional(),
  revision: z.number().int().optional(),
  clientId: z.string().default('api'),
  turnId: z.string().optional(),
  label: z.string().max(200).optional(),
  history: z.enum(['undo', 'redo', 'undo-agent']).optional(),
});
export const POST = (request: Request, { params }: { params: Promise<{ projectId: string }> }) =>
  projectApi(request, async () => {
    const data = input.parse(await request.json());
    const { projectId } = await params;
    const actor = requestActor(request, data.clientId);
    const state = data.history
      ? await undoProject(projectId, actor, data.history === 'redo', data.history === 'undo-agent')
      : await commitAction(projectId, projectActionSchema.parse(data.action), {
          actor,
          ...(data.revision === undefined ? {} : { revision: data.revision }),
          ...(data.turnId === undefined ? {} : { turnId: data.turnId }),
          ...(data.label === undefined ? {} : { label: data.label }),
        });
    return Response.json(publicProjectState(state));
  });
