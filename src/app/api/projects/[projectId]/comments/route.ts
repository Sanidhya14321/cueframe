import { z } from 'zod';
import { addComment } from '@/local/comments';
import { projectApi } from '@/local/project-api';
import { publicProjectState } from '@/local/project-state';

const input = z.object({
  text: z.string().min(1).max(2000),
  frame: z.number().int().min(0),
  itemId: z.string().optional(),
});
export const POST = (request: Request, { params }: { params: Promise<{ projectId: string }> }) =>
  projectApi(request, async () =>
    Response.json(
      publicProjectState(
        await addComment((await params).projectId, input.parse(await request.json())),
      ),
    ),
  );
