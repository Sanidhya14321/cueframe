/* biome-ignore-all lint/performance/noAwaitInLoops: local actions, leases and media steps must execute in order */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { z } from 'zod';
import {
  type CaptionsElement,
  createId,
  createTrack,
  findElement,
  identityTransform,
  projectContentEnd,
  type VideoElement,
} from '@/project';
import { ffmpegPath, runProcess } from './audio';
import { mediaPath } from './media';
import {
  commitAction,
  ProjectProblem,
  projectDirectory,
  readProject,
  setAgentStatus,
} from './projects';
import { setupWhisper } from './whisper-setup';

const wordSchema = z.object({
  text: z.string(),
  startMs: z.number().min(0),
  endMs: z.number().min(0),
});
export type TranscriptWord = z.infer<typeof wordSchema>;
const filler = (text: string) => /^(um|uh|erm|hmm|uhh|umm)$/i.test(text.replace(/[^a-z]/gi, ''));
export const tightenWords = (words: TranscriptWord[]) => {
  const groups: TranscriptWord[][] = [];
  let previous = -1;
  for (const [index, word] of words.entries()) {
    if (filler(word.text) || !word.text.trim()) {
      continue;
    }
    const last = groups.at(-1)?.at(-1);
    if (!last || index !== previous + 1 || word.startMs - last.endMs > 400) {
      groups.push([word]);
    } else {
      groups.at(-1)?.push(word);
    }
    previous = index;
  }
  return groups;
};
export const applyTranscript = async (
  projectId: string,
  itemId: string,
  words: TranscriptWord[],
  emphasis: string[],
  actor: string,
) => {
  const state = await readProject(projectId);
  const found = findElement(state.project, itemId);
  if (found?.element.type !== 'video') {
    throw new ProjectProblem('Select a video item.');
  }
  const original = found.element;
  const groups = tightenWords(words);
  if (groups.length === 0) {
    throw new ProjectProblem('No speech was found.');
  }
  let cursor = original.from;
  const captionWords: TranscriptWord[] = [];
  await commitAction(
    projectId,
    { type: 'delete-item', id: itemId },
    { actor, label: 'Keep the original file; tighten the video cuts' },
  );
  for (const group of groups) {
    const first = group[0];
    const last = group.at(-1);
    if (!(first && last)) {
      continue;
    }
    const sourceStart = Math.max(0, first.startMs - 30);
    const sourceEnd = last.endMs + 30;
    const duration = Math.max(
      1,
      Math.round(((sourceEnd - sourceStart) / 1000) * state.project.fps),
    );
    const item: VideoElement = {
      ...original,
      animation: { kind: 'none', easing: 'linear', durationInFrames: 0 },
      id: createId('speech'),
      from: cursor,
      durationInFrames: duration,
      sourceFrom: (original.sourceFrom ?? 0) + Math.round((sourceStart / 1000) * state.project.fps),
      punchIns: group
        .filter((word) =>
          emphasis.some(
            (text) => text.toLowerCase() === word.text.replace(/[^a-z0-9]/gi, '').toLowerCase(),
          ),
        )
        .map((word) => ({
          from: Math.round(((word.startMs - sourceStart) / 1000) * state.project.fps),
          to: Math.round(((word.endMs - sourceStart) / 1000) * state.project.fps),
          scale: 1.15,
        })),
    };
    await commitAction(
      projectId,
      { type: 'add-item', trackId: found.trackId, element: item },
      { actor, label: 'Add a tight speech segment' },
    );
    captionWords.push(
      ...group.map((word) => ({
        ...word,
        startMs: ((cursor - original.from) / state.project.fps) * 1000 + word.startMs - sourceStart,
        endMs: ((cursor - original.from) / state.project.fps) * 1000 + word.endMs - sourceStart,
      })),
    );
    cursor += duration;
  }
  const track = createTrack('Word captions');
  await commitAction(
    projectId,
    { type: 'patch', operations: [{ op: 'add', path: '/tracks/0', value: track }] },
    { actor, label: 'Add captions above the video' },
  );
  const captions: CaptionsElement = {
    type: 'captions',
    id: createId('captions'),
    from: original.from,
    durationInFrames: cursor - original.from,
    transform: identityTransform(),
    fontSize: Math.round(state.project.width / 20),
    color: '#ffffff',
    activeColor: '#a3e635',
    background: '#111111dd',
    words: captionWords,
  };
  await commitAction(
    projectId,
    { type: 'add-item', trackId: track.id, element: captions },
    { actor, label: 'Word-synced captions' },
  );
  const current = await readProject(projectId);
  await commitAction(
    projectId,
    {
      type: 'patch',
      operations: [
        {
          op: 'replace',
          path: '/durationInFrames',
          value: Math.max(1, projectContentEnd(current.project)),
        },
      ],
    },
    { actor, label: 'Trim the empty tail' },
  );
  return {
    segments: groups.length,
    words: captionWords.length,
    removedSeconds: Math.max(
      0,
      original.durationInFrames / state.project.fps - (cursor - original.from) / state.project.fps,
    ),
  };
};
export const transcribeVideo = async (
  projectId: string,
  itemId: string,
  emphasis: string[],
  update: (progress: number, label: string) => Promise<void>,
) => {
  const state = await readProject(projectId);
  const item = findElement(state.project, itemId)?.element;
  if (item?.type !== 'video') {
    throw new ProjectProblem('Select an imported video item.');
  }
  const match = new RegExp(`^/api/projects/${projectId}/media/([a-f0-9]+.[a-z0-9]+)$`).exec(
    item.src,
  );
  if (!match?.[1]) {
    throw new ProjectProblem('Import this video into the project before transcribing.');
  }
  const engine = await setupWhisper(update);
  const folder = join(await projectDirectory(projectId), 'out');
  const wav = join(folder, `${itemId.replace(/[^a-zA-Z0-9-]/g, '')}.whisper.wav`);
  const output = wav.replace(/\.wav$/, '');
  await update(0.5, 'Extracting speech audio locally');
  await runProcess(ffmpegPath(), [
    '-v',
    'error',
    '-y',
    '-ss',
    String((item.sourceFrom ?? 0) / state.project.fps),
    '-i',
    await mediaPath(projectId, match[1]),
    '-t',
    String(item.durationInFrames / state.project.fps),
    '-ac',
    '1',
    '-ar',
    '16000',
    '-c:a',
    'pcm_s16le',
    wav,
  ]);
  await update(0.6, 'Transcribing words on this computer');
  await runProcess(
    engine.binary,
    [
      '-m',
      engine.model,
      '-f',
      wav,
      '-ojf',
      '-of',
      output,
      '-ml',
      '1',
      '-sow',
      '-l',
      'en',
      '-t',
      '4',
    ],
    600000,
  );
  const raw = JSON.parse(await readFile(`${output}.json`, 'utf8')) as {
    transcription: { text: string; offsets: { from: number; to: number } }[];
  };
  const words = raw.transcription
    .filter((entry) => entry.text.trim() && !entry.text.includes('['))
    .map((entry) =>
      wordSchema.parse({
        text: entry.text.trim(),
        startMs: entry.offsets.from,
        endMs: entry.offsets.to,
      }),
    );
  await writeFile(`${output}.words.json`, JSON.stringify(words), { mode: 0o600 });
  await setAgentStatus(projectId, 'agent:whisper', {
    status: 'working',
    label: 'Tightening cuts and adding captions',
    itemIds: [itemId],
    name: 'Local Whisper',
  });
  try {
    await update(0.9, 'Applying cuts, word captions and emphasis zooms');
    return await applyTranscript(projectId, itemId, words, emphasis, 'agent:whisper');
  } finally {
    await setAgentStatus(projectId, 'agent:whisper', {
      status: 'idle',
      label: 'Speech edit complete',
      itemIds: [],
    });
  }
};
