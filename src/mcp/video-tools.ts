import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { applyEdits, editOperationSchema } from '@/agent/edits';
import { checkMedia } from '@/agent/media';
import { createVideo, findVideo, listVideos, updateVideo, type VideoRow } from '@/local/videos';
import type { Project } from '@/project';
import { getClipMeta, isClipId } from '@/schemas';
import { ORIENTATIONS } from './clip-search';
import { failure, json } from './results';
import { type ClipPlacement, createVideoProject, placeClip } from './video-builder';

const placementInput = z.object({
  clipId: z.string(),
  props: z
    .record(z.string(), z.unknown())
    .optional()
    .describe('Prop overrides merged deeply over the clip defaults, see get_clip'),
  durationInFrames: z.number().int().min(1).optional(),
});

const videoIdInput = z.string().describe('The videoId that create_video or list_videos returned');

const videoPath = (id: string): string => `/video/${id}`;

const outline = (project: Project) =>
  project.tracks.map((track, trackIndex) => ({
    track: trackIndex,
    name: track.name,
    elements: track.elements.map((element, elementIndex) => ({
      path: `/tracks/${trackIndex}/elements/${elementIndex}`,
      type: element.type,
      clip:
        element.type === 'composition' && isClipId(element.clipId)
          ? `${element.clipId} (${getClipMeta(element.clipId).title})`
          : undefined,
      from: element.from,
      durationInFrames: element.durationInFrames,
    })),
  }));

const toPlacement = (input: z.infer<typeof placementInput>): ClipPlacement => ({
  ...input,
  clipId: input.clipId as ClipPlacement['clipId'],
});

const NOT_FOUND = 'No video with that videoId. Use list_videos.';

export const registerVideoTools = (server: McpServer, origin: string): void => {
  const summary = (video: VideoRow, withProject = false): CallToolResult =>
    json({
      videoId: video.id,
      title: video.title,
      editorUrl: `${origin}${videoPath(video.id)}`,
      seconds: Math.round((video.project.durationInFrames / video.project.fps) * 10) / 10,
      size: `${video.project.width}x${video.project.height}`,
      timeline: outline(video.project),
      ...(withProject ? { project: video.project } : {}),
    });

  const save = async (id: string, change: { title?: string | undefined; project: Project }) => {
    const saved = await updateVideo(id, change);
    return saved === null ? failure(NOT_FOUND) : summary(saved);
  };

  server.registerTool(
    'create_video',
    {
      title: 'Create a video',
      description:
        'Build a new video from clips played one after another on the first track and save it locally on this machine. Returns its videoId, which add_clip, edit_video and get_video take, and an editorUrl that opens it in the browser editor. The editorUrl never changes, so share it once. Without an orientation the video takes the size of the first clip.',
      inputSchema: {
        title: z.string().min(1),
        orientation: z.enum(ORIENTATIONS).optional(),
        fps: z.number().int().min(12).max(60).optional(),
        background: z.string().optional().describe('Hex colour behind every clip'),
        clips: z.array(placementInput).optional(),
      },
      annotations: { destructiveHint: false },
    },
    async ({ title, orientation, fps, background, clips = [] }) => {
      const unknown = clips.map((clip) => clip.clipId).filter((clipId) => !isClipId(clipId));
      if (unknown.length > 0) {
        return failure(`Unknown clip ids: ${unknown.join(', ')}. Use search_clips.`);
      }
      const checked = checkMedia(
        'clip',
        createVideoProject({ orientation, fps, background, clips: clips.map(toPlacement) }),
      );
      return checked.ok
        ? summary(await createVideo({ title, project: checked.document }))
        : failure(checked.error);
    },
  );

  server.registerTool(
    'add_clip',
    {
      title: 'Add a clip',
      description:
        'Add a clip to a video. By default it goes at the end of the first track; set from (frame) to place it elsewhere or track to layer it (track 0 is the top layer). The video grows to fit.',
      inputSchema: {
        videoId: videoIdInput,
        ...placementInput.shape,
        from: z.number().int().min(0).optional(),
        track: z.number().int().min(0).optional(),
      },
      annotations: { destructiveHint: false },
    },
    async ({ videoId, clipId, props, durationInFrames, from, track }) => {
      const video = await findVideo(videoId);
      if (video === null) {
        return failure(NOT_FOUND);
      }
      if (!isClipId(clipId)) {
        return failure(`Unknown clipId "${clipId}". Use search_clips.`);
      }
      const checked = checkMedia(
        'clip',
        placeClip(video.project, { clipId, props, durationInFrames, from, track }),
      );
      return checked.ok ? save(videoId, { project: checked.document }) : failure(checked.error);
    },
  );

  server.registerTool(
    'edit_video',
    {
      title: 'Edit a video',
      description:
        "Change a video with RFC 6902 JSON Patch operations against its project (paths like /tracks/0/elements/1/props/headline, see the timeline outline, get_video and get_clip for each clip's props). Batch related changes in one call. The result is validated against the project and clip schemas; on failure nothing changes and the error says what to fix. To recolour a clip, replace the first path of a colour role and its linked paths follow.",
      inputSchema: {
        videoId: videoIdInput,
        title: z.string().min(1).optional().describe('A new title for the video'),
        operations: z.array(editOperationSchema),
      },
      annotations: { destructiveHint: false },
    },
    async ({ videoId, title, operations }) => {
      const video = await findVideo(videoId);
      if (video === null) {
        return failure(NOT_FOUND);
      }
      const edited = applyEdits('clip', video.project, operations);
      return edited.ok ? save(videoId, { title, project: edited.document }) : failure(edited.error);
    },
  );

  server.registerTool(
    'get_video',
    {
      title: 'Get a video',
      description:
        'The current state of a video, including changes the person made in the browser editor: its timeline outline and full project.',
      inputSchema: { videoId: videoIdInput },
      annotations: { readOnlyHint: true },
    },
    async ({ videoId }) => {
      const video = await findVideo(videoId);
      return video === null ? failure(NOT_FOUND) : summary(video, true);
    },
  );

  server.registerTool(
    'list_videos',
    {
      title: 'List videos',
      description: 'The videos saved to this machine, most recently changed first.',
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    async () =>
      json({
        videos: (await listVideos()).map((video) => ({
          videoId: video.id,
          title: video.title,
          editorUrl: `${origin}${videoPath(video.id)}`,
          updatedAt: video.updatedAt.toISOString(),
        })),
      }),
  );
};
