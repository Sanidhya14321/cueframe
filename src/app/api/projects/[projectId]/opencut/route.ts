import { readOpenCut, saveOpenCut } from '@/local/opencut';
import { projectApi } from '@/local/project-api';
import { ProjectProblem } from '@/local/projects';

type Context = { params: Promise<{ projectId: string }> };
export const GET = (request: Request, { params }: Context) =>
  projectApi(request, async () =>
    Response.json(await readOpenCut((await params).projectId), {
      headers: { 'cache-control': 'no-store' },
    }),
  );
export const PUT = (request: Request, { params }: Context) =>
  projectApi(request, async () => {
    const text = await request.text();
    if (text.length > 8 * 1024 * 1024) {
      throw new ProjectProblem('Video projects must be under 8 MB.', 413);
    }
    return Response.json(await saveOpenCut((await params).projectId, JSON.parse(text)));
  });
