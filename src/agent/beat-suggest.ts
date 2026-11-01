import { z } from 'zod';
import { searchLibraryVectors } from '@/local/library/vectors';
import { embedQuery, semanticScores } from '@/mcp/clip-embeddings';
import { searchClips } from '@/mcp/clip-search';
import { clipCatalog } from './catalog';

export const BEAT_ROLES = ['hook', 'point', 'proof', 'turn', 'cta'] as const;
const beatClipRole = {
  hook: 'opener',
  point: 'feature',
  proof: 'proof',
  turn: 'transition',
  cta: 'cta',
} as const;
const MIN_SCORE = 0.2;
const ROLE_BONUS = 0.05;

export const suggestInputSchema = z.object({
  brief: z.string().min(1).max(2000),
  aspect: z.enum(['landscape', 'portrait', 'square']).default('landscape'),
  beats: z
    .array(z.object({ role: z.enum(BEAT_ROLES), text: z.string().min(1).max(200) }))
    .min(1)
    .max(16),
  limit: z.number().int().min(1).max(5).default(3),
});
type SuggestInput = z.infer<typeof suggestInputSchema>;

const rankedClips = async (query: string, embed: typeof embedQuery) => {
  const vector = await embed(query);
  if (!vector) {
    return searchClips(query, {}, 40).map((hit) => ({ id: hit.id, score: MIN_SCORE }));
  }
  const stored = await searchLibraryVectors(vector, 'clip', 5000).catch(() => null);
  return stored?.length
    ? stored.map(({ id, score }) => ({ id, score: Number(score) }))
    : semanticScores(vector);
};

export const suggestBeatClips = (
  { brief, aspect, beats, limit }: SuggestInput,
  origin: string,
  embed: typeof embedQuery = embedQuery,
) => {
  const byId = new Map(clipCatalog.map((clip) => [clip.id, clip]));
  return Promise.all(
    beats.map(async (beat, index) => {
      const role = beatClipRole[beat.role];
      const ranked = await rankedClips(`${brief}. ${role}: ${beat.text}`, embed);
      const suggestions = ranked
        .flatMap(({ id, score }) => {
          const clip = byId.get(id);
          if (!(clip?.aspectSupport.includes(aspect) && score >= MIN_SCORE)) {
            return [];
          }
          const roleMatch = clip.roles.includes(role);
          return [{ clip, score, roleMatch, rank: score + (roleMatch ? ROLE_BONUS : 0) }];
        })
        .sort((a, b) => b.rank - a.rank)
        .slice(0, limit)
        .map(({ clip, score, roleMatch }) => ({
          clipId: clip.id,
          score: Math.round(score * 100) / 100,
          roleMatch,
          description: clip.description,
          textSlots: clip.textSlots.map((slot) => slot.path),
          preview: `${origin}/previews/${clip.id}.mp4`,
        }));
      return { index, text: beat.text, suggestions };
    }),
  );
};
