import { projectApi } from '@/local/project-api';
import { ProjectProblem } from '@/local/projects';
import { transcribeSpeech } from '@/local/voice-input';

const MAX_AUDIO_BYTES = 25 * 1024 * 1024;
export const POST = (request: Request) =>
  projectApi(request, async () => {
    const audio = new Uint8Array(await request.arrayBuffer());
    if (audio.length === 0 || audio.length > MAX_AUDIO_BYTES) {
      throw new ProjectProblem('Record a voice request under 25 MB.', 413);
    }
    try {
      return Response.json({ text: await transcribeSpeech(audio) });
    } catch {
      throw new ProjectProblem(
        'Local transcription failed. Open Media tools to set up Whisper, then try again.',
        500,
      );
    }
  });
