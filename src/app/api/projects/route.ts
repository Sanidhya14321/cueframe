import { z } from 'zod';
import { projectApi } from '@/local/project-api';
import { publicProjectState } from '@/local/project-state';
import { createProject, listProjectSummaries, openProject } from '@/local/projects';
import { projectSchema } from '@/project';

const input = z.object({
  title: z.string().min(1).max(200),
  project: projectSchema,
  sourceKey: z.string().max(200).optional(),
});
export const GET = (request: Request) =>
  projectApi(request, async () =>
    Response.json(
      (await listProjectSummaries()).map(({ id, title, revision, updated }) => ({
        id,
        title,
        revision,
        updatedAt: new Date(updated),
      })),
    ),
  );
export const POST = (request: Request) =>
  projectApi(request, async () => {
    const data = input.parse(await request.json());
    const state =
      data.sourceKey === undefined
        ? await createProject(data)
        : await openProject({ ...data, sourceKey: data.sourceKey });
    return Response.json(publicProjectState(state));
  });
