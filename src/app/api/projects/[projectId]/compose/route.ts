import { z } from 'zod';
import { composeFromBrief } from '@/agent/compose';
import { projectApi } from '@/local/project-api';
import { hostedSpendProblem } from '@/local/rate-limit';

const input = z.object({ brief: z.string().trim().min(1).max(4000) });
type Context = { params: Promise<{ projectId: string }> };
export const POST = (request: Request, { params }: Context) =>
  projectApi(request, async () => {
    const limited = hostedSpendProblem(request, 'compose', 10);
    if (limited !== null) {
      return limited;
    }
    const { brief } = input.parse(await request.json());
    return Response.json(await composeFromBrief((await params).projectId, brief, 'agent:composer'));
  });
