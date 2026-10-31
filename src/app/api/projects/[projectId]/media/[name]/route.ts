import { readMedia } from '@/local/media';
import { projectApi } from '@/local/project-api';
export const GET = (
  request: Request,
  { params }: { params: Promise<{ projectId: string; name: string }> },
) =>
  projectApi(request, async () => {
    const { projectId, name } = await params;
    const { data, mime } = await readMedia(projectId, name);
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
      const end = Math.min(match[2] ? Number(match[2]) : data.length - 1, data.length - 1);
      if (start > end) {
        return new Response(null, { status: 416 });
      }
      return new Response(data.subarray(start, end + 1), {
        status: 206,
        headers: {
          ...headers,
          'content-range': `bytes ${start}-${end}/${data.length}`,
          'content-length': String(end - start + 1),
        },
      });
    }
    return new Response(data, { headers: { ...headers, 'content-length': String(data.length) } });
  });
