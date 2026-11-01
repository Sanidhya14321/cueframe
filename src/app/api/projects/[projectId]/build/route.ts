import { beatsheetSchema, buildFromBeatsheet } from '@/agent/beatsheet';
import { projectApi } from '@/local/project-api';
import { hostedSpendProblem } from '@/local/rate-limit';

export const maxDuration = 300;
export const POST = (request: Request, { params }: { params: Promise<{ projectId: string }> }) =>
  projectApi(request, async () => {
    const limited = hostedSpendProblem(request, 'build', 10);
    if (limited !== null) {
      return limited;
    }
    const body = (await request.json()) as object;
    const input = beatsheetSchema.parse({ ...body, projectId: (await params).projectId });
    return Response.json(await buildFromBeatsheet(input, 'agent:builder'));
  });
