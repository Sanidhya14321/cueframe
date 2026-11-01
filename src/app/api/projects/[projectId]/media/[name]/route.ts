import { mediaFile } from '@/local/media';
import { projectApi } from '@/local/project-api';
export const GET = (
  request: Request,
  { params }: { params: Promise<{ projectId: string; name: string }> },
) =>
  projectApi(request, async () => {
    const { projectId, name } = await params;
    const { size, mime, open } = await mediaFile(projectId, name);
    const range = request.headers.get('range');
    const headers = {
      'content-type': mime,
      'cache-control': 'private, max-age=31536000, immutable',
      'accept-ranges': 'bytes',
      'x-content-type-options': 'nosniff',
    };
    if (range) {
      const match = /^bytes=(\d+)-(\d*)$/.exec(range);
      if (!match) {
        return new Response(null, { status: 416 });
      }
      const start = Number(match[1]);
      const end = Math.min(match[2] ? Number(match[2]) : size - 1, size - 1);
      if (start > end) {
        return new Response(null, { status: 416 });
      }
      return new Response(open({ start, end }), {
        status: 206,
        headers: {
          ...headers,
          'content-range': `bytes ${start}-${end}/${size}`,
          'content-length': String(end - start + 1),
        },
      });
    }
    return new Response(open(), { headers: { ...headers, 'content-length': String(size) } });
  });
