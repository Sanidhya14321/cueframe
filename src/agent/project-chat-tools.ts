/* biome-ignore-all lint/complexity/useLiteralKeys: tool names are indexed in the AI SDK tool registry */
import { type ToolSet, tool } from 'ai';
import { z } from 'zod';
import { logToolCall } from '@/local/agent-log';
import { searchClipsByMeaning } from '@/local/library/search';
import { readProject } from '@/local/projects';
import { getClipDefaults, getClipMeta, getClipSchema, isClipId } from '@/schemas';
import { clipFieldGuide } from './instructions';
import { projectTools, type ToolContext } from './project-tools';

const ALLOWED = [
  'get_project',
  'get_item',
  'add_item',
  'update_props',
  'move_item',
  'delete_item',
  'compose_from_brief',
  'suggest_clips',
  'build_from_beatsheet',
  'edit_project',
  'transcribe_video',
  'add_voiceover',
  'render',
  'get_job',
  'share_update',
] as const satisfies readonly (keyof typeof projectTools)[];

export const projectChatTools = (projectId: string, context: ToolContext): ToolSet => {
  const tools: ToolSet = {};
  for (const name of ALLOWED) {
    const definition = projectTools[name];
    const inputSchema: z.ZodType = definition.input.extend({ projectId: z.literal(projectId) });
    tools[name] = tool({
      description: definition.description,
      inputSchema,
      execute: async (input) => {
        try {
          const result = await definition.invoke(inputSchema.parse(input), context);
          await logToolCall(name, input);
          if (name === 'get_project') {
            const { project } = await readProject(projectId);
            return {
              outline: result,
              settings: {
                width: project.width,
                height: project.height,
                fps: project.fps,
                durationInFrames: project.durationInFrames,
                background: project.background,
              },
              tracks: project.tracks.map((track, trackIndex) => ({
                id: track.id,
                path: `/tracks/${trackIndex}`,
                items: track.elements.map((item, itemIndex) => ({
                  id: item.id,
                  path: `/tracks/${trackIndex}/elements/${itemIndex}`,
                })),
              })),
            };
          }
          return result;
        } catch {
          const message =
            'This action failed. Re-read the item and check its settings or selection scope.';
          await logToolCall(name, input, message);
          return { error: message };
        }
      },
    });
  }
  tools['search_clips'] = tool({
    description: 'Find library animation clips matching the user prompt before adding clips.',
    inputSchema: z.object({ query: z.string().max(2000) }),
    execute: async ({ query }) => searchClipsByMeaning(query, {}, 8),
  });
  tools['get_clip'] = tool({
    description: 'Read a clip schema, editable fields and defaults before adding or changing it.',
    inputSchema: z.object({ clipId: z.string() }),
    execute: ({ clipId }) =>
      isClipId(clipId)
        ? {
            metadata: getClipMeta(clipId),
            defaults: getClipDefaults(clipId),
            fields: clipFieldGuide(clipId),
            schema: z.toJSONSchema(getClipSchema(clipId)),
          }
        : { error: 'Unknown clip. Use search_clips.' },
  });
  return tools;
};
