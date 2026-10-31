import { startJob } from '@/local/jobs';
import { projectApi } from '@/local/project-api';
import { renderLocalProject } from '@/local/render';
export const POST = (request: Request, { params }: { params: Promise<{ projectId: string }> }) =>
  projectApi(request, async () => {
    const { projectId } = await params;
    return Response.json(
      await startJob(projectId, 'render', (update) => {
        return renderLocalProject(projectId, update, new URL(request.url).origin);
      }),
    );
  });
