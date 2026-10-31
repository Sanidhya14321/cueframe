import { projectApi } from '@/local/project-api';
import { searchClips } from '@/mcp/clip-search';
import { CLIP_REGISTRY } from '@/schemas';

export const GET = (request: Request) =>
  projectApi(request, () => {
    const query = new URL(request.url).searchParams.get('q')?.trim() ?? '';
    const rows = query ? searchClips(query, {}, CLIP_REGISTRY.length) : CLIP_REGISTRY;
    return Promise.resolve(
      Response.json({
        clips: rows.map(({ id, title, category }) => ({
          id,
          title,
          category,
          still: `/previews/${id}.still.jpg`,
        })),
      }),
    );
  });
