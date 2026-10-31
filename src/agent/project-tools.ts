import { z } from 'zod';
import { resolveEvent, waitForEvents } from '@/local/agent-events';
import { resolveComment, waitForComments } from '@/local/comments';
import { readJob, startJob } from '@/local/jobs';
import {
  commitAction,
  createProject,
  listProjects,
  readProject,
  setAgentStatus,
} from '@/local/projects';
import { renderLocalProject } from '@/local/render';
import { transcribeVideo } from '@/local/transcribe';
import { addVoiceover, voiceInputSchema } from '@/local/voice';
import { createCompositionElement, createTrack, findElement } from '@/project';
import { getClipDefaults, getClipMeta, isClipId } from '@/schemas';
import { beatsheetSchema, buildFromBeatsheet } from './beatsheet';

export interface ToolContext {
  origin: string;
  actor: string;
}
const defineProjectTool = <Shape extends z.ZodRawShape>(
  description: string,
  shape: Shape,
  execute: (input: z.infer<z.ZodObject<Shape>>, context: ToolContext) => unknown | Promise<unknown>,
) => ({
  description,
  input: z.object(shape),
  invoke: (input: unknown, context: ToolContext) => execute(z.object(shape).parse(input), context),
});
const projectId = z.string().describe('The project id returned by new_project or list_projects');
const confirmed = z.literal(true).describe('Set true when requesting this edit.');
const outline = (state: Awaited<ReturnType<typeof readProject>>) => ({
  id: state.id,
  title: state.title,
  revision: state.revision,
  items: state.project.tracks.flatMap((track) =>
    track.elements.map((item) => ({
      id: item.id,
      start: item.from,
      duration: item.durationInFrames,
      clip: item.type === 'composition' ? item.clipId : item.type,
      text:
        item.type === 'text'
          ? item.content
          : item.type === 'composition'
            ? Object.values(item.props).find((value) => typeof value === 'string')
            : undefined,
    })),
  ),
});
export const projectTools = {
  wait_for_events: defineProjectTool(
    'Wait for queued jobs, comments, voice requests or brief changes. Events are delivered one at a time; edit only its item when pinned, then resolve_event. Unfinished events redeliver after reconnect.',
    { projectId, timeout: z.number().min(0).max(55).default(25) },
    async ({ projectId: id, timeout }, ctx) => waitForEvents(id, ctx.actor, timeout),
  ),
  resolve_event: defineProjectTool(
    'Finish the event you claimed and record a short result note.',
    { projectId, id: z.string(), note: z.string().min(1).max(1000), confirmed },
    async ({ projectId: pid, id, note }, ctx) => ({
      revision: (await resolveEvent(pid, id, note, ctx.actor)).revision,
    }),
  ),

  add_voiceover: defineProjectTool(
    'Generate cached Fish Audio voice lines and duck music. Skips clearly if no key is saved. Poll get_job for progress.',
    { ...voiceInputSchema.shape, confirmed },
    async (input) => startJob(input.projectId, 'voice', (update) => addVoiceover(input, update)),
  ),
  render: defineProjectTool(
    'Render a full-fidelity MP4 locally to the project out folder. Poll get_job for progress and a download URL.',
    { projectId, confirmed },
    async ({ projectId: id }, ctx) =>
      startJob(id, 'render', (update) => renderLocalProject(id, update, ctx.origin)),
  ),
  transcribe_video: defineProjectTool(
    'Transcribe an imported video locally; remove fillers and long pauses, add active-word captions and 115% emphasis zooms. Returns a job id; poll get_job.',
    { projectId, id: z.string(), emphasis: z.array(z.string()).default([]), confirmed },
    async ({ projectId: pid, id, emphasis }) =>
      startJob(pid, 'transcribe', (update) => transcribeVideo(pid, id, emphasis, update)),
  ),
  get_job: defineProjectTool(
    'Read progress or the result of a transcription, voice or render job.',
    { projectId, jobId: z.string() },
    async ({ projectId: pid, jobId }) => readJob(pid, jobId),
  ),
  wait_for_comments: defineProjectTool(
    'Wait for new user comments. Change only each comment’s item and resolve it before another item.',
    { projectId, timeout: z.number().min(0).max(55).default(25) },
    async ({ projectId: id, timeout }, ctx) => waitForComments(id, ctx.actor, timeout),
  ),
  resolve_comment: defineProjectTool(
    'Mark one user comment done with a short note.',
    { projectId, id: z.string(), note: z.string().min(1).max(1000), confirmed },
    async ({ projectId: pid, id, note }, ctx) => ({
      revision: (await resolveComment(pid, id, note, ctx.actor)).revision,
    }),
  ),
  build_from_beatsheet: defineProjectTool(
    'Build 12-16 short segments live, with downbeat cuts, whooshes, hits and music. Use 16 segments for a 30-second video.',
    { ...beatsheetSchema.shape, confirmed },
    async (input, ctx) => buildFromBeatsheet(input, ctx.actor),
  ),
  set_agent_status: defineProjectTool(
    'Set working before edits and idle when done. Heartbeat at least every 30 seconds; locks expire after 60 seconds.',
    {
      projectId,
      status: z.enum(['working', 'idle']),
      label: z.string().max(200),
      itemIds: z.array(z.string()).max(200).default([]),
      name: z.string().max(100).default('Claude Code'),
      confirmed,
    },
    async ({ projectId: pid, ...input }, ctx) => ({
      revision: (await setAgentStatus(pid, ctx.actor, input)).revision,
    }),
  ),
  list_projects: defineProjectTool(
    'List local projects with their editor links.',
    {},
    async (_, ctx) =>
      (await listProjects()).map(({ id, title }) => ({
        id,
        title,
        editorUrl: `${ctx.origin}/video/${id}`,
      })),
  ),
  open_project: defineProjectTool(
    'Open a saved project; returns a compact outline and editor link.',
    { projectId },
    async ({ projectId: id }, ctx) => ({
      ...outline(await readProject(id)),
      editorUrl: `${ctx.origin}/video/${id}`,
    }),
  ),
  new_project: defineProjectTool(
    'Create an editable local video project. Prefer build_from_beatsheet to build a whole video.',
    {
      title: z.string().min(1).max(200),
      aspect: z.enum(['landscape', 'portrait', 'square']).default('landscape'),
      seconds: z.number().min(1).max(600).default(30),
      confirmed,
    },
    async ({ title, aspect, seconds }, ctx) => {
      const sizes = {
        landscape: [1920, 1080],
        portrait: [1080, 1920],
        square: [1080, 1080],
      } as const;
      const [width, height] = sizes[aspect];
      const state = await createProject({
        title,
        project: {
          width,
          height,
          fps: 30,
          durationInFrames: Math.round(seconds * 30),
          background: '#0a0a0a',
          tracks: [createTrack('Clips')],
        },
      });
      return { projectId: state.id, editorUrl: `${ctx.origin}/video/${state.id}` };
    },
  ),
  get_project: defineProjectTool(
    'Read one compact line per item, without clip source or the complete document.',
    { projectId },
    async ({ projectId: id }) => outline(await readProject(id)),
  ),
  get_item: defineProjectTool(
    'Read the full props of one item before editing it.',
    { projectId, id: z.string() },
    async ({ projectId: pid, id }) => {
      const item = findElement((await readProject(pid)).project, id);
      if (!item) {
        throw new Error('Unknown item.');
      }
      return item.element;
    },
  ),
  add_item: defineProjectTool(
    'Add a catalog clip to a project as one live action.',
    {
      projectId,
      clipId: z.string(),
      start: z.number().int().min(0),
      duration: z.number().int().positive().optional(),
      props: z.record(z.string(), z.unknown()).default({}),
      confirmed,
    },
    async ({ projectId: pid, clipId, start, duration, props }, ctx) => {
      if (!isClipId(clipId)) {
        throw new Error('Unknown clip. Use search_clips.');
      }
      const state = await readProject(pid);
      const track = state.project.tracks[0];
      if (!track) {
        throw new Error('Add a track first.');
      }
      const item = createCompositionElement(
        clipId,
        { ...getClipDefaults(clipId), ...props },
        { from: start, durationInFrames: duration ?? getClipMeta(clipId).durationInFrames },
      );
      const next = await commitAction(
        pid,
        { type: 'add-item', trackId: track.id, element: item },
        { actor: ctx.actor, label: `Add ${clipId}` },
      );
      return { id: item.id, revision: next.revision };
    },
  ),
  update_props: defineProjectTool(
    'Change only the named item props; other items stay editable.',
    { projectId, id: z.string(), props: z.record(z.string(), z.unknown()), confirmed },
    async ({ projectId: pid, id, props }, ctx) => ({
      revision: (
        await commitAction(
          pid,
          { type: 'update-props', id, props },
          { actor: ctx.actor, label: `Update ${id}` },
        )
      ).revision,
    }),
  ),
  move_item: defineProjectTool(
    'Move an item to a start frame, optionally another track.',
    {
      projectId,
      id: z.string(),
      start: z.number().int().min(0),
      trackId: z.string().optional(),
      confirmed,
    },
    async ({ projectId: pid, id, start, trackId }, ctx) => ({
      revision: (
        await commitAction(
          pid,
          { type: 'move-item', id, from: start, ...(trackId ? { trackId } : {}) },
          { actor: ctx.actor, label: `Move ${id}` },
        )
      ).revision,
    }),
  ),
  delete_item: defineProjectTool(
    'Delete one item.',
    { projectId, id: z.string(), confirmed },
    async ({ projectId: pid, id }, ctx) => ({
      revision: (
        await commitAction(
          pid,
          { type: 'delete-item', id },
          { actor: ctx.actor, label: `Delete ${id}` },
        )
      ).revision,
    }),
  ),
};
