/* biome-ignore-all lint/performance/noAwaitInLoops: local actions, leases and media steps must execute in order */
import { saveMedia } from '@/local/media';
import { projectApi } from '@/local/project-api';
import { ProjectProblem, readProject } from '@/local/projects';
export const POST = (request: Request, { params }: { params: Promise<{ projectId: string }> }) =>
  projectApi(request, async () => {
    const { projectId } = await params;
    await readProject(projectId);
    const reader = request.body?.getReader();
    if (!reader) {
      throw new ProjectProblem('Choose a media file.');
    }
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const part = await reader.read();
      if (part.done) {
        break;
      }
      length += part.value.length;
      if (length > 256 * 1024 * 1024) {
        await reader.cancel();
        throw new ProjectProblem('Media files must be at most 256 MB.', 413);
      }
      chunks.push(part.value);
    }
    return Response.json(
      await saveMedia(projectId, Buffer.concat(chunks), request.headers.get('content-type') ?? ''),
    );
  });
