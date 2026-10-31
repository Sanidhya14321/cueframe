import { prepareOpenCutPreview } from '@/local/opencut-preview';
import { projectApi } from '@/local/project-api';

type Context = { params: Promise<{ projectId: string; itemId: string }> };
export const POST = (request: Request, { params }: Context) =>
  projectApi(request, async () => {
    const { projectId, itemId } = await params;
    const preview = await prepareOpenCutPreview(projectId, itemId);
    return Response.json(preview);
  });
