import { z } from 'zod';
import { projectApi, requestActor } from '@/local/project-api';
import { publicProjectState } from '@/local/project-state';
import { commitAction, readProject } from '@/local/projects';
import { projectSchema } from '@/project';

type Context = { params: Promise<{ projectId: string }> };
export const GET = (request: Request, { params }: Context) =>
  projectApi(request, async () =>
    Response.json(publicProjectState(await readProject((await params).projectId)), {
      headers: { 'cache-control': 'no-store' },
    }),
  );
export const PUT = (request: Request, { params }: Context) =>
  projectApi(request, async () => {
    const data = z
      .object({ project: projectSchema, revision: z.number().int(), clientId: z.string() })
      .parse(await request.json());
    return Response.json(
      publicProjectState(
        await commitAction(
          (await params).projectId,
          { type: 'replace-project', project: data.project },
          { revision: data.revision, actor: requestActor(request, data.clientId) },
        ),
      ),
    );
  });
