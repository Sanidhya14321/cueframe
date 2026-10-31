import { projectApi } from '@/local/project-api';
import { CLIP_REGISTRY } from '@/schemas';

export const GET = (request: Request) =>
  projectApi(request, async () =>
    Response.json({
      clips: CLIP_REGISTRY.map(({ id, title, category }) => ({
        id,
        title,
        category,
        still: `/previews/${id}.still.jpg`,
      })),
    }),
  );
