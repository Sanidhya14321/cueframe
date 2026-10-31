import { z } from 'zod';
import { startJob } from '@/local/jobs';
import { projectApi } from '@/local/project-api';
import { transcribeVideo } from '@/local/transcribe';
import { setupWhisper } from '@/local/whisper-setup';
export const POST = (request: Request, { params }: { params: Promise<{ projectId: string }> }) =>
  projectApi(request, async () => {
    const input = z
      .object({
        itemId: z.string().optional(),
        emphasis: z.array(z.string().max(50)).max(100).default([]),
        setup: z.boolean().optional(),
      })
      .parse(await request.json());
    const { projectId } = await params;
    return Response.json(
      await startJob(projectId, 'transcribe', async (update) => {
        if (input.setup) {
          await setupWhisper(update);
          return { message: 'Local Whisper is ready.' };
        }
        if (!input.itemId) {
          throw new Error('Select a video first.');
        }
        return transcribeVideo(projectId, input.itemId, input.emphasis, update);
      }),
    );
  });
