import { readJob } from '@/local/jobs';
import { projectApi } from '@/local/project-api';
export const GET = (
  request: Request,
  { params }: { params: Promise<{ projectId: string; jobId: string }> },
) =>
  projectApi(request, async () => {
    const { projectId, jobId } = await params;
    return Response.json(await readJob(projectId, jobId), {
      headers: { 'cache-control': 'no-store' },
    });
  });
