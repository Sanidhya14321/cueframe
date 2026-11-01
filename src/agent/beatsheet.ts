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
  type Element,
  identityTransform,
} from '@/project';
import { getClipDefaults, getClipSchema, isClipId } from '@/schemas';
import { type BeatStyle, beatStyleSchema, sectionElements, styleColor } from './beat-sections';
import { BEAT_ROLES } from './beat-suggest';
import { clipCatalog } from './catalog';

export const beatsheetSchema = z.object({
  projectId: z.string(),
  aspect: z.enum(['landscape', 'portrait', 'square']).default('landscape'),
  targetSeconds: z.number().min(8).max(120).default(30),
  musicFile: z.string().optional(),
  style: beatStyleSchema.prefault({}),
  segments: z
    .array(
      z.object({
        role: z.enum(BEAT_ROLES),
        text: z.string().min(1).max(64),
        subtitle: z.string().max(120).optional(),
        energy: z.number().int().min(1).max(5),
        voiceLine: z.string().max(1000).optional(),
        clipId: z.string().optional(),
        props: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .min(12)
    .max(16),
});
export type Beatsheet = z.infer<typeof beatsheetSchema>;
type Segment = Beatsheet['segments'][number];
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
const chosenClip = (clipId: string, aspect: string) => {
  const choice = clipCatalog.find((clip) => clip.id === clipId);
  if (!(choice && isClipId(choice.id))) {
    throw new ProjectProblem(`Unknown clip ${clipId}. Use suggest_clips.`);
  }
  if (!choice.aspectSupport.includes(aspect)) {
    throw new ProjectProblem(`Clip ${clipId} does not support ${aspect}.`);
  }
  return { ...choice, id: choice.id };
};
const clipProps = (
  choice: ReturnType<typeof chosenClip>,
  segment: Segment,
  style: BeatStyle,
): { props: Record<string, unknown>; unfilledSlots: string[] } => {
  const defaults = getClipDefaults(choice.id) as Record<string, unknown>;
  let props = structuredClone(defaults);
  const slot =
    choice.textSlots.find((field) => /(^|\.)(text|title|headline|brandName)$/.test(field.path)) ??
    choice.textSlots[0];
  if (slot) {
    props = setAtPath(props, slot.path.split('.'), segment.text) as Record<string, unknown>;
  }
  const subtitle = choice.textSlots.find((field) => /(^|\.)subtitle$/.test(field.path));
  if (subtitle && segment.subtitle) {
    props = setAtPath(props, subtitle.path.split('.'), segment.subtitle) as Record<string, unknown>;
  }
  for (const field of describeControlPaths(getClipSchema(choice.id)).values()) {
    const path = field.path.join('.');
    if (
      /font/i.test(path) &&
      (field.kind === 'text' || (field.kind === 'enum' && field.options.includes(style.font)))
    ) {
      props = setAtPath(props, field.path, style.font) as Record<string, unknown>;
    }
    if (field.kind === 'color') {
      props = setAtPath(props, field.path, styleColor(style, path.toLowerCase())) as Record<
        string,
        unknown
      >;
    }
  }
  const merged = { ...props, ...segment.props };
  const read = (source: Record<string, unknown>, path: string) =>
    path
      .split('.')
      .reduce<unknown>((value, key) => (value as Record<string, unknown>)?.[key], source);
  return {
    props: merged,
    unfilledSlots: choice.textSlots
      .map((field) => field.path)
      .filter((path) => read(merged, path) === read(defaults, path)),
  };
};
const checkSegments = ({ segments, aspect }: Beatsheet) => {
  if (segments.some((segment) => segment.text.trim().split(/\s+/).length > 4)) {
    throw new ProjectProblem('Use 1 to 4 words per segment.');
  }
  for (const { clipId } of segments) {
    if (clipId) {
      chosenClip(clipId, aspect);
    }
  }
};
type SegmentSlot = { from: number; duration: number; width: number; height: number };
const placeSegment = async (
  input: Beatsheet,
  actor: string,
  segment: Segment,
  tracks: Record<'headlines' | 'details' | 'sections', { id: string }>,
  { from, duration, width, height }: SegmentSlot,
) => {
  const add = (trackId: string, element: Element, label: string) =>
    commitAction(input.projectId, { type: 'add-item', trackId, element }, { actor, label });
  const beatLabel = `${segment.role}: ${segment.text}`;
  const placed = { from, duration, voiceLine: segment.voiceLine };
  if (segment.clipId) {
    const choice = chosenClip(segment.clipId, input.aspect);
    const { props, unfilledSlots } = clipProps(choice, segment, input.style);
    const element = createCompositionElement(choice.id, props, {
      from,
      durationInFrames: duration,
      voiceLine: segment.voiceLine ?? segment.text,
      animation: { ...defaultAnimation(), durationInFrames: Math.min(6, duration) },
    });
    await add(tracks.sections.id, element, beatLabel);
    return { ...placed, id: element.id, clipId: choice.id as string, unfilledSlots };
  }
  const { backdrop, headline, detail } = sectionElements(input.style, {
    text: segment.text,
    subtitle: segment.subtitle,
    energy: segment.energy,
    from,
    duration,
    width,
    height,
  });
  await add(tracks.sections.id, backdrop, `Backdrop: ${segment.text}`);
  await add(tracks.headlines.id, headline, beatLabel);
  if (detail) {
    await add(tracks.details.id, detail, `Detail: ${segment.subtitle}`);
  }
  return { ...placed, id: headline.id };
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
  checkSegments(input);
  await setAgentStatus(input.projectId, actor, {
    status: 'working',
    label: 'Building the beat sheet',
    itemIds: [],
    name: actor === 'agent:mcp' ? 'MCP agent' : 'Beat-sheet builder',
  });
  const tracks = [
    createTrack('Headlines'),
    createTrack('Details'),
    createTrack('Sections'),
    createTrack('Sound effects'),
    createTrack('Music'),
  ];
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
        { op: 'replace', path: '/background', value: input.style.background },
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
  const [headlines, details, sections, effects, music] = tracks;
  if (!(headlines && details && sections && effects && music)) {
    throw new ProjectProblem('Could not create tracks.');
  }
  let from = 0;
  const items: Awaited<ReturnType<typeof placeSegment>>[] = [];
  const whoosh = await saveMedia(
    input.projectId,
    synthesizeSound(0.16, bpm, 'whoosh'),
    'audio/wav',
  );
  const hit = await saveMedia(input.projectId, synthesizeSound(0.18, bpm, 'hit'), 'audio/wav');
  for (const [index, segment] of input.segments.entries()) {
    const beatStart = Math.round((index * availableBeats) / count);
    const beatEnd = Math.round(((index + 1) * availableBeats) / count);
    const duration =
      index === count - 1 ? total - from : Math.round((((beatEnd - beatStart) * 60) / bpm) * fps);
    const placed = await placeSegment(
      input,
      actor,
      segment,
      { headlines, details, sections },
      {
        from,
        duration,
        width,
        height,
      },
    );
    const itemId = placed.id;
    items.push(placed);
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
    from += duration;
    await setAgentStatus(input.projectId, actor, {
      status: 'working',
      label: `${index + 1}/${count}: ${segment.text}`,
      itemIds: [itemId],
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
