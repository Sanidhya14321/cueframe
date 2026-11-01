import { readSettings } from '../../local/settings';

const POLL_MS = 15_000;

const request = async (path: string, init: RequestInit = {}): Promise<Response> => {
  const settings = await readSettings();
  if (!settings.apiKey) {
    throw new Error('Save a provider API key in cueframe Settings to generate footage.');
  }
  const response = await fetch(`${settings.baseUrl.replace(/\/$/, '')}${path}`, {
    ...init,
    redirect: 'error',
    headers: { Authorization: `Bearer ${settings.apiKey}`, 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Provider request failed with ${response.status}.`);
  }
  return response;
};

export type ImageRequest = {
  model: string;
  prompt: string;
  aspectRatio: string;
  input?: string | undefined;
};

type ImageReply = {
  choices?: { message?: { images?: { image_url?: { url?: string } }[] } }[];
};

export const generateImage = async ({
  model,
  prompt,
  aspectRatio,
  input,
}: ImageRequest): Promise<Buffer> => {
  const content: unknown[] = [{ type: 'text', text: prompt }];
  if (input !== undefined) {
    content.push({ type: 'image_url', image_url: { url: input } });
  }
  const response = await request('/chat/completions', {
    method: 'POST',
    body: JSON.stringify({
      model,
      modalities: ['image', 'text'],
      image_config: { aspect_ratio: aspectRatio, image_size: '2K' },
      messages: [{ role: 'user', content }],
    }),
  });
  const reply = (await response.json()) as ImageReply;
  const url = reply.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (url === undefined) {
    throw new Error(`${model} returned no image.`);
  }
  return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
};

export type VideoRequest = {
  model: string;
  prompt: string;
  seconds: number;
  resolution: string;
  aspectRatio: string;
  firstFrame: string;
  lastFrame?: string | undefined;
  providerOptions?: Record<string, unknown> | undefined;
};

type VideoJob = { id: string; status: string; error?: string; usage?: { cost?: number } };

const FINISHED = new Set(['completed', 'failed', 'cancelled', 'expired']);

const waitForJob = async (job: VideoJob, onStatus: (status: string) => void): Promise<VideoJob> => {
  if (FINISHED.has(job.status)) {
    return job;
  }
  await Bun.sleep(POLL_MS);
  const polled = (await (await request(`/videos/${job.id}`)).json()) as VideoJob;
  onStatus(polled.status);
  return waitForJob(polled, onStatus);
};

const frameImage = (url: string, frameType: 'first_frame' | 'last_frame') => ({
  type: 'image_url',
  frame_type: frameType,
  image_url: { url },
});

export const generateVideo = async (
  video: VideoRequest,
  onStatus: (status: string) => void,
): Promise<{ data: Buffer; cost: number | undefined }> => {
  const frames = [frameImage(video.firstFrame, 'first_frame')];
  if (video.lastFrame !== undefined) {
    frames.push(frameImage(video.lastFrame, 'last_frame'));
  }
  const submitted = await request('/videos', {
    method: 'POST',
    body: JSON.stringify({
      model: video.model,
      prompt: video.prompt,
      duration: video.seconds,
      resolution: video.resolution,
      aspect_ratio: video.aspectRatio,
      generate_audio: false,
      frame_images: frames,
      ...(video.providerOptions === undefined
        ? {}
        : { provider: { options: video.providerOptions } }),
    }),
  });
  const job = await waitForJob((await submitted.json()) as VideoJob, onStatus);
  if (job.status !== 'completed') {
    throw new Error(`${video.model} job ${job.id} ${job.status}.`);
  }
  const content = await request(`/videos/${job.id}/content?index=0`);
  return { data: Buffer.from(await content.arrayBuffer()), cost: job.usage?.cost };
};
