import { projectApi } from '@/local/project-api';
import { recommendClips } from '@/mcp/clip-recommend';

export const GET = (request: Request) =>
  projectApi(request, async () => {
    const brief = new URL(request.url).searchParams.get('brief')?.trim().slice(0, 4000) ?? '';
    if (brief === '') {
      return Response.json({ clips: [] });
    }
    const steps = await recommendClips(brief);
    return Response.json({
      clips: steps.flatMap(({ role, clip }) =>
        clip
          ? [{ id: clip.id, title: clip.title, role, still: `/previews/${clip.id}.still.jpg` }]
          : [],
      ),
    });
  });
