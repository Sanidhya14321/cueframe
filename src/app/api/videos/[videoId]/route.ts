import { z } from 'zod';
import { dropObjectUrls } from '@/agent/assets';
import { checkMedia } from '@/agent/media';
import { requireLocalSession } from '@/local/security';
import { updateVideo } from '@/local/videos';

type Context = { params: Promise<{ videoId: string }> };

const changeSchema = z.object({ project: z.unknown() });

export const PUT = async (request: Request, { params }: Context) => {
  const denied = requireLocalSession(request);
  if (denied !== null) {
    return denied;
  }
  const change = changeSchema.safeParse(await request.json().catch(() => null));
  const checked = checkMedia('clip', change.success ? dropObjectUrls(change.data.project) : null);
  if (!checked.ok) {
    return Response.json({ problem: checked.error }, { status: 400 });
  }
  const video = await updateVideo((await params).videoId, { project: checked.document });
  return video === null
    ? Response.json({ problem: 'That video does not exist.' }, { status: 404 })
    : Response.json({ updatedAt: video.updatedAt.toISOString() });
};
