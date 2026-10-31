import { composeFromBrief } from '@/agent/compose';
import { projectApi } from '@/local/project-api';

type Context = { params: Promise<{ projectId: string }> };
export const POST = (request: Request, { params }: Context) =>
  projectApi(request, async () => {
    const { brief } = (await request.json()) as { brief: string };
    return Response.json(await composeFromBrief((await params).projectId, brief, 'agent:composer'));
  });
