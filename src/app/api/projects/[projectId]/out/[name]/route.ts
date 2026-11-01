import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { projectApi } from '@/local/project-api';
import { projectDirectory } from '@/local/projects';
export const GET = (
  request: Request,
  { params }: { params: Promise<{ projectId: string; name: string }> },
) =>
  projectApi(request, async () => {
    const { projectId, name } = await params;
    if (!/^video-\d+\.mp4$/.test(name)) {
      return new Response(null, { status: 404 });
    }
    return new Response(await readFile(join(await projectDirectory(projectId), 'out', name)), {
      headers: {
        'content-type': 'video/mp4',
        'content-disposition': `attachment; filename="${name}"`,
        'cache-control': 'no-store',
      },
    });
  });
