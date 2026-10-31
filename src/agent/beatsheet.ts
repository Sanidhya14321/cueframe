/* biome-ignore-all lint/performance/noAwaitInLoops: local actions, leases and media steps must execute in order */
import { z } from 'zod';
import { describeControlPaths } from '@/core/clip-controls';
import { setAtPath } from '@/lib/value-path';
import { estimateTempo, pcmAudio, synthesizeSound } from '@/local/audio';
import { mediaPath, saveMedia } from '@/local/media';
import { commitAction, ProjectProblem, readProject, setAgentStatus } from '@/local/projects';
import {
  type AudioElement,
  createCompositionElement,
  createId,
  createTrack,
  defaultAnimation,
  identityTransform,
} from '@/project';
import { getClipDefaults, getClipSchema, isClipId } from '@/schemas';
import { clipCatalog } from './catalog';

export const beatsheetSchema = z.object({
  projectId: z.string(),
  aspect: z.enum(['landscape', 'portrait', 'square']).default('landscape'),
  targetSeconds: z.number().min(8).max(120).default(30),
  musicFile: z.string().optional(),
  segments: z
    .array(
      z.object({
        role: z.enum(['hook', 'point', 'proof', 'turn', 'cta']),
        text: z.string().min(1).max(64),
        energy: z.number().int().min(1).max(5),
        voiceLine: z.string().max(1000).optional(),
      }),
    )
    .min(12)
    .max(16),
});
export type Beatsheet = z.infer<typeof beatsheetSchema>;
const roles = { hook: 'opener', point: 'feature', proof: 'proof', turn: 'transition', cta: 'cta' };
const audioItem = (
  src: string,
  from: number,
  duration: number,
  role: AudioElement['role'],
  volume: number,
): AudioElement => ({
  id: createId('audio'),
  type: 'audio',
  src,
  from,
  durationInFrames: duration,
  role,
  volume,
  transform: identityTransform(),
});
const paletteColor = (path: string): string => {
  if (/background/.test(path)) {
    return '#0b0d17';
  }
  if (/surface/.test(path)) {
    return '#1c2035';
  }
  return /ink|text|foreground/.test(path) ? '#f5f3ff' : '#a78bfa';
};
const chooseClip = (
  segment: Beatsheet['segments'][number],
  index: number,
  previous: string,
  aspect: string,
) => {
  const candidates = clipCatalog
    .filter(
      (clip) =>
        clip.textSlots.length > 0 &&
        clip.aspectSupport.includes(aspect) &&
        clip.id !== previous &&
        clip.roles.includes(roles[segment.role] ?? 'feature'),
    )
    .sort(
      (a, b) =>
        Math.abs(a.energy - segment.energy) - Math.abs(b.energy - segment.energy) ||
        a.id.localeCompare(b.id),
    );
  const choice =
    candidates[index % candidates.length] ?? clipCatalog.find((clip) => clip.id === 'word-build');
  if (!(choice && isClipId(choice.id))) {
    throw new ProjectProblem('No suitable catalog clip.');
  }
  return { ...choice, id: choice.id };
};
const segmentProps = (choice: ReturnType<typeof chooseClip>, text: string) => {
  let props: Record<string, unknown> = structuredClone(getClipDefaults(choice.id)) as Record<
    string,
    unknown
  >;
  const slot =
    choice.textSlots.find((field) => /(^|\.)(text|title|headline|brandName)$/.test(field.path)) ??
    choice.textSlots[0];
  if (slot) {
    props = setAtPath(props, slot.path.split('.'), text) as Record<string, unknown>;
  }
  for (const field of describeControlPaths(getClipSchema(choice.id)).values()) {
    if (/font/i.test(field.path.join('.'))) {
      const font = /subtitle|secondary/i.test(field.path.join('.')) ? 'Instrument Serif' : 'Inter';
      if (field.kind === 'text' || (field.kind === 'enum' && field.options.includes(font))) {
        props = setAtPath(props, field.path, font) as Record<string, unknown>;
      }
    }
    if (field.kind === 'color') {
      const path = field.path.join('.').toLowerCase();
      const color = paletteColor(path);
      props = setAtPath(props, field.path, color) as Record<string, unknown>;
    }
  }
  return props;
};
export const buildFromBeatsheet = async (input: Beatsheet, actor: string) => {
  const state = await readProject(input.projectId);
  const fps = state.project.fps;
  const bpm = input.musicFile
    ? estimateTempo(await pcmAudio(await mediaPath(input.projectId, input.musicFile)))
    : 128;
  const availableBeats = Math.round((input.targetSeconds * bpm) / 60);
  const count = input.segments.length;
  if (availableBeats < count * 2 || availableBeats > count * 4) {
    throw new ProjectProblem(
      `At ${bpm} BPM, choose a target between ${Math.ceil((count * 2 * 60) / bpm)} and ${Math.floor((count * 4 * 60) / bpm)} seconds for ${count} segments.`,
    );
  }
  if (input.segments.some((segment) => segment.text.trim().split(/\s+/).length > 4)) {
    throw new ProjectProblem('Use 1 to 4 words per segment.');
  }
  await setAgentStatus(input.projectId, actor, {
    status: 'working',
    label: 'Building the beat sheet',
    itemIds: [],
    name: actor === 'agent:mcp' ? 'MCP agent' : 'Beat-sheet builder',
  });
  const tracks = [createTrack('Clips'), createTrack('Sound effects'), createTrack('Music')];
  const sizes = { landscape: [1920, 1080], portrait: [1080, 1920], square: [1080, 1080] } as const;
  const [width, height] = sizes[input.aspect];
  const total = Math.round(input.targetSeconds * fps);
  await commitAction(
    input.projectId,
    {
      type: 'patch',
      operations: [
        { op: 'replace', path: '/width', value: width },
        { op: 'replace', path: '/height', value: height },
        {
          op: 'replace',
          path: '/durationInFrames',
          value: Math.max(total, state.project.durationInFrames),
        },
      ],
    },
    { actor, label: 'Set the video format' },
  );
  for (const track of tracks.toReversed()) {
    await commitAction(
      input.projectId,
      { type: 'patch', operations: [{ op: 'add', path: '/tracks/0', value: track }] },
      { actor, label: `Add ${track.name}` },
    );
  }
  const clips = tracks[0];
  const effects = tracks[1];
  const music = tracks[2];
  if (!(clips && effects && music)) {
    throw new ProjectProblem('Could not create tracks.');
  }
  let from = 0;
  let previous = '';
  const items: { id: string; from: number; duration: number; voiceLine?: string | undefined }[] =
    [];
  const whoosh = await saveMedia(
    input.projectId,
    synthesizeSound(0.16, bpm, 'whoosh'),
    'audio/wav',
  );
  const hit = await saveMedia(input.projectId, synthesizeSound(0.18, bpm, 'hit'), 'audio/wav');
  for (const [index, segment] of input.segments.entries()) {
    const choice = chooseClip(segment, index, previous, input.aspect);
    const props = segmentProps(choice, segment.text);
    const beatStart = Math.round((index * availableBeats) / count);
    const beatEnd = Math.round(((index + 1) * availableBeats) / count);
    const duration =
      index === count - 1 ? total - from : Math.round((((beatEnd - beatStart) * 60) / bpm) * fps);
    const element = createCompositionElement(choice.id, props, {
      from,
      durationInFrames: duration,
      voiceLine: segment.voiceLine ?? segment.text,
      animation: { ...defaultAnimation(), durationInFrames: Math.min(6, duration) },
    });
    await commitAction(
      input.projectId,
      { type: 'add-item', trackId: clips.id, element },
      { actor, label: `${segment.role}: ${segment.text}` },
    );
    await commitAction(
      input.projectId,
      {
        type: 'add-item',
        trackId: effects.id,
        element: audioItem(
          hit.url,
          from,
          Math.min(Math.round(fps * 0.18), duration),
          'effect',
          0.25,
        ),
      },
      { actor, label: 'Landing hit' },
    );
    if (from > 0) {
      await commitAction(
        input.projectId,
        {
          type: 'add-item',
          trackId: effects.id,
          element: audioItem(
            whoosh.url,
            Math.max(0, from - Math.round(fps * 0.16)),
            Math.round(fps * 0.16),
            'effect',
            0.22,
          ),
        },
        { actor, label: 'Cut whoosh' },
      );
    }
    items.push({ id: element.id, from, duration, voiceLine: segment.voiceLine });
    from += duration;
    previous = choice.id;
    await setAgentStatus(input.projectId, actor, {
      status: 'working',
      label: `${index + 1}/${count}: ${segment.text}`,
      itemIds: [element.id],
      name: 'Beat-sheet builder',
    });
    await new Promise((resolve) => setTimeout(resolve, 180));
  }
  const bed = input.musicFile
    ? { url: `/api/projects/${input.projectId}/media/${input.musicFile}` }
    : await saveMedia(
        input.projectId,
        synthesizeSound(
          input.targetSeconds,
          bpm,
          'bed',
          items[input.segments.findIndex((segment) => segment.role === 'turn')]?.from === undefined
            ? (input.targetSeconds * 2) / 3
            : (items[input.segments.findIndex((segment) => segment.role === 'turn')]?.from ?? 0) /
                fps,
        ),
        'audio/wav',
      );
  await commitAction(
    input.projectId,
    { type: 'add-item', trackId: music.id, element: audioItem(bed.url, 0, total, 'music', 0.24) },
    { actor, label: 'Add beat bed' },
  );
  await setAgentStatus(input.projectId, actor, {
    status: 'idle',
    label: 'Video ready to edit',
    itemIds: [],
  });
  return { projectId: input.projectId, bpm, seconds: input.targetSeconds, items };
};
