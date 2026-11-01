import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { searchCatalog } from '@/agent/catalog';
import { clipFieldGuide, jsonSchema } from '@/agent/instructions';
import { searchLibraryVectors } from '@/local/library/vectors';
import {
  CLIP_CATEGORIES,
  CLIP_DEFAULTS,
  CLIP_REGISTRY,
  CLIP_ROLES,
  CLIP_SCHEMAS,
  CLIP_THEMES,
  clipLabel,
  getClipMeta,
  isClipId,
} from '@/schemas';
import { embedQuery } from './clip-embeddings';
import { recommendClips } from './clip-recommend';
import { ORIENTATIONS, orientationOf } from './clip-search';
import { failure, json } from './results';

const CATEGORY_IDS = CLIP_CATEGORIES.map((category) => category.id) as [string, ...string[]];

const isCategory = (value: string | undefined): value is (typeof CLIP_CATEGORIES)[number]['id'] =>
  value !== undefined && CATEGORY_IDS.includes(value);

const previewUrl = (appUrl: string, clipId: string): string => `${appUrl}/previews/${clipId}.mp4`;

const categoryCounts = () =>
  CLIP_CATEGORIES.map((category) => ({
    id: category.id,
    label: category.label,
    clips: CLIP_REGISTRY.filter((meta) => meta.category === category.id).length,
  }));

export const registerCatalogTools = (server: McpServer, appUrl: string): void => {
  server.registerTool(
    'search_library',
    {
      title: 'Search library by meaning',
      description:
        'Match a user prompt to clips, poster pages and website templates using Yugabyte pgvector metadata embeddings.',
      inputSchema: {
        query: z.string().min(1).max(4000),
        kind: z.enum(['clip', 'poster', 'site']).optional(),
        limit: z.number().int().min(1).max(40).default(12),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ query, kind, limit }) => {
      try {
        const vector = await embedQuery(query);
        if (!vector) {
          return failure('The local embedding model is unavailable. Run bun run library:index.');
        }
        const results = await searchLibraryVectors(vector, kind, limit);
        return results === null
          ? failure(
              'Configure Yugabyte and run bun run library:index before searching the full library.',
            )
          : json({ results });
      } catch {
        return failure('Library search failed. Check Yugabyte and run bun run library:index.');
      }
    },
  );
  server.registerTool(
    'search_clips',
    {
      title: 'Search clips',
      description:
        'Search the cueframe library of animation clips by what a video needs, for example "app launch phone reveal", "logo outro" or "pricing list". Every clip is labelled with what is on screen, its beats, mood, use cases and the role it plays in a video (opener, feature, proof, cta, closer, transition, background, overlay). Leave query empty to browse with filters.',
      inputSchema: {
        query: z.string().describe('Plain-language description of the clip you want'),
        category: z.enum(CATEGORY_IDS).optional(),
        theme: z.enum(CLIP_THEMES).optional(),
        orientation: z.enum(ORIENTATIONS).optional(),
        role: z.enum(CLIP_ROLES).optional().describe('Where the clip sits in a video'),
        limit: z.number().int().min(1).max(40).optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ query, category, theme, orientation, role, limit }) => {
      const hits = (
        await searchCatalog(
          query,
          isCategory(category) ? category : undefined,
          CLIP_REGISTRY.length,
        )
      )
        .filter(
          (clip) =>
            (!theme || clip.theme === theme) &&
            (!orientation || clip.aspectSupport.includes(orientation)) &&
            (!role || clip.roles.includes(role)),
        )
        .slice(0, limit ?? 5);
      return json({
        results: hits.map((hit) => ({ ...hit, preview: previewUrl(appUrl, hit.id) })),
        categories: hits.length === 0 ? categoryCounts() : undefined,
      });
    },
  );

  server.registerTool(
    'recommend_clips',
    {
      title: 'Recommend clips for a brief',
      description:
        'Turn a video brief into a storyboard: one distinct clip per story role, ranked by local semantic similarity and each clip\'s labels, with alternatives and textSlots, the prop paths to fill with your copy. Reads format and theme from the brief ("dark vertical reel") unless given. Use this before add_item.',
      inputSchema: {
        brief: z.string().min(1).describe('What the video is about, in plain language'),
        roles: z.array(z.enum(CLIP_ROLES)).min(1).max(16).optional(),
        orientation: z.enum(ORIENTATIONS).optional(),
        theme: z.enum(CLIP_THEMES).optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ brief, roles, orientation, theme }) =>
      json({
        storyboard: (await recommendClips(brief, { roles, orientation, theme })).map((step) => ({
          ...step,
          preview: step.clip ? previewUrl(appUrl, step.clip.id) : null,
        })),
      }),
  );

  server.registerTool(
    'get_clip',
    {
      title: 'Get clip details',
      description:
        'Everything needed to use one clip: its labels, size, length, default props, the editor field guide (what each prop path controls) and the props JSON schema. Call this before setting props on a clip.',
      inputSchema: { clipId: z.string() },
      annotations: { readOnlyHint: true },
    },
    ({ clipId }) => {
      if (!isClipId(clipId)) {
        return failure(`Unknown clipId "${clipId}". Use search_clips to find clip ids.`);
      }
      const meta = getClipMeta(clipId);
      return json({
        id: clipId,
        title: meta.title,
        description: meta.description,
        category: meta.category,
        theme: meta.theme,
        orientation: orientationOf(meta),
        width: meta.width,
        height: meta.height,
        fps: meta.fps,
        durationInFrames: meta.durationInFrames,
        label: clipLabel(clipId),
        preview: previewUrl(appUrl, clipId),
        defaultProps: CLIP_DEFAULTS[clipId],
        fieldGuide: clipFieldGuide(clipId),
        propsSchema: JSON.parse(jsonSchema(CLIP_SCHEMAS[clipId])) as unknown,
      });
    },
  );
};
