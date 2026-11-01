import { searchClipsByMeaning } from '@/local/library/search';
import { projectApi } from '@/local/project-api';
import { CLIP_REGISTRY } from '@/schemas';

export const GET = (request: Request) =>
  projectApi(request, async () => {
    const query = new URL(request.url).searchParams.get('q')?.trim().slice(0, 500) ?? '';
    const rows = query
      ? await searchClipsByMeaning(query, {}, CLIP_REGISTRY.length)
      : CLIP_REGISTRY;
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
