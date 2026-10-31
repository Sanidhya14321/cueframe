/* biome-ignore-all lint/performance/noAwaitInLoops: local actions, leases and media steps must execute in order */
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { z } from 'zod';
import {
  type AudioElement,
  createId,
  createTrack,
  findElement,
  identityTransform,
} from '@/project';
import { pcmAudio } from './audio';
import { readJson, serial, writeJson } from './files';
import { mediaPath, saveMedia } from './media';
import {
  commitAction,
  ProjectProblem,
  projectDirectory,
  readProject,
  setAgentStatus,
} from './projects';
import { readSettings } from './settings';

export const voiceInputSchema = z.object({
  projectId: z.string(),
  referenceId: z.string().max(200).optional(),
  lines: z
    .array(z.object({ itemId: z.string(), text: z.string().min(1).max(2000) }))
    .max(50)
    .optional(),
});
export const addVoiceover = async (
  input: z.infer<typeof voiceInputSchema>,
  update: (progress: number, label: string) => Promise<void>,
) => {
  const settings = await readSettings();
  if (!settings.fishAudioKey) {
    return {
      skipped: true,
      message: 'No Fish Audio key is saved. Add one in Settings to generate voiceover.',
    };
  }
  if (!input.referenceId) {
    throw new ProjectProblem('Choose a Fish Audio voice reference ID before generating voiceover.');
  }
  const state = await readProject(input.projectId);
  const lines =
    input.lines ??
    state.project.tracks
      .flatMap((row) => row.elements)
      .flatMap((candidate) =>
        candidate.type === 'composition' && candidate.voiceLine
          ? [{ itemId: candidate.id, text: candidate.voiceLine }]
          : [],
      );
  if (lines.length === 0) {
    throw new ProjectProblem('Add a voice line to a clip, or supply lines for the voiceover.');
  }
  const track = createTrack('Voiceover');
  await commitAction(
    input.projectId,
    { type: 'add-track', track },
    { actor: 'agent:voice', label: 'Add voiceover track' },
  );
  await setAgentStatus(input.projectId, 'agent:voice', {
    status: 'working',
    label: 'Generating voiceover',
    itemIds: lines.map((line) => line.itemId),
    name: 'Fish Audio',
  });
  const regions: { from: number; to: number }[] = [];
  try {
    for (const [index, line] of lines.entries()) {
      const item = findElement((await readProject(input.projectId)).project, line.itemId)?.element;
      if (!item) {
        throw new ProjectProblem('Voiceover item not found.');
      }
      await update(index / lines.length, `Generating voice ${index + 1}/${lines.length}`);
      const hash = createHash('sha256')
        .update(
          JSON.stringify({ text: line.text, reference: input.referenceId, model: 's2.1-pro-free' }),
        )
        .digest('hex');
      const cachePath = join(await projectDirectory(input.projectId), `voice-${hash}.json`);
      const saved = await serial(cachePath, async () => {
        const cached = await readJson(cachePath);
        if (cached !== null) {
          return z.object({ url: z.string(), name: z.string() }).parse(cached);
        }
        const response = await fetch('https://api.fish.audio/v1/tts', {
          method: 'POST',
          redirect: 'error',
          headers: {
            Authorization: `Bearer ${settings.fishAudioKey}`,
            'content-type': 'application/json',
            model: 's2.1-pro-free',
          },
          body: JSON.stringify({
            text: line.text,
            format: 'wav',
            ...(input.referenceId ? { reference_id: input.referenceId } : {}),
          }),
          signal: AbortSignal.timeout(120000),
        });
        if (!response.ok) {
          throw new ProjectProblem(
            `Fish Audio returned ${response.status}. Check the saved key, voice and credits.`,
          );
        }
        const audio = await saveMedia(
          input.projectId,
          new Uint8Array(await response.arrayBuffer()),
          'audio/wav',
        );
        await writeJson(cachePath, audio);
        return audio;
      });
      const pcm = await pcmAudio(await mediaPath(input.projectId, saved.name));
      const naturalFrames = Math.ceil((pcm.length / 2 / 11025) * state.project.fps);
      const playbackRate = Math.max(1, naturalFrames / item.durationInFrames);
      if (playbackRate > 2) {
        throw new ProjectProblem(
          'This voice line is too long. Shorten it or extend its clip, then retry.',
        );
      }
      const duration = Math.min(item.durationInFrames, Math.ceil(naturalFrames / playbackRate));
      const audio: AudioElement = {
        type: 'audio',
        id: createId('voice'),
        src: saved.url,
        from: item.from,
        durationInFrames: duration,
        volume: 1,
        role: 'voice',
        playbackRate,
        transform: identityTransform(),
      };
      await commitAction(
        input.projectId,
        { type: 'add-item', trackId: track.id, element: audio },
        { actor: 'agent:voice', label: `Voice: ${line.text.slice(0, 50)}` },
      );
      regions.push({ from: item.from, to: item.from + duration });
    }
    const current = await readProject(input.projectId);
    for (const item of current.project.tracks.flatMap((row) => row.elements)) {
      if (item.type === 'audio' && item.role === 'music') {
        await commitAction(
          input.projectId,
          {
            type: 'replace-item',
            element: {
              ...item,
              duckRegions: regions.map((region) => ({
                from: region.from - item.from,
                to: region.to - item.from,
              })),
            },
          },
          { actor: 'agent:voice', label: 'Duck music under voice' },
        );
      }
    }
    return { voices: lines.length, cachedByTextHash: true };
  } finally {
    await setAgentStatus(input.projectId, 'agent:voice', {
      status: 'idle',
      label: 'Voiceover finished',
      itemIds: [],
    });
  }
};
