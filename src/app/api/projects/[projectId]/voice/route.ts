import { startJob } from '@/local/jobs';
import { projectApi } from '@/local/project-api';
import { addVoiceover, voiceInputSchema } from '@/local/voice';
export const POST = (request: Request, { params }: { params: Promise<{ projectId: string }> }) =>
  projectApi(request, async () => {
    const { projectId } = await params;
    const input = voiceInputSchema.parse({ ...((await request.json()) as object), projectId });
    return Response.json(
      await startJob(projectId, 'voice', (update) => addVoiceover(input, update)),
    );
  });
