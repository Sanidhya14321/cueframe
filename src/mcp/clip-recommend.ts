import { clipCatalog } from '@/agent/catalog';
import type { ClipRole, ClipTheme } from '@/schemas';
import { embedQuery, semanticOrder } from './clip-embeddings';
import { type ClipSearchHit, type Orientation, searchClips } from './clip-search';

const DEFAULT_STORY: readonly ClipRole[] = ['opener', 'feature', 'proof', 'cta', 'closer'];

const ORIENTATION_WORDS: readonly (readonly [RegExp, Orientation])[] = [
  [/\b(portrait|vertical|reel|reels|tiktok|shorts|9:16)\b/i, 'portrait'],
  [/\b(square|1:1)\b/i, 'square'],
  [/\b(landscape|widescreen|youtube|16:9)\b/i, 'landscape'],
];

const THEME_WORDS: readonly (readonly [RegExp, ClipTheme])[] = [
  [/\bdark\b/i, 'dark'],
  [/\b(light|bright)\b/i, 'light'],
];

const matchWord = <T>(brief: string, words: readonly (readonly [RegExp, T])[]): T | undefined =>
  words.find(([pattern]) => pattern.test(brief))?.[1];

export interface ClipRecommendOptions {
  roles?: readonly ClipRole[] | undefined;
  orientation?: Orientation | undefined;
  theme?: ClipTheme | undefined;
}

export interface ClipRecommendation {
  role: ClipRole;
  clip: ClipSearchHit | null;
  textSlots: readonly { path: string }[];
  alternatives: readonly string[];
}

const RRF_K = 60;

const blendRanks = (
  hits: ClipSearchHit[],
  keyword: ReadonlyMap<string, number>,
  semantic: readonly string[],
): ClipSearchHit[] => {
  const place = new Map(semantic.map((id, index) => [id, index]));
  const rrf = (rank: number | undefined) => (rank === undefined ? 0 : 1 / (RRF_K + rank));
  return hits.toSorted(
    (a, b) =>
      rrf(keyword.get(b.id)) + rrf(place.get(b.id)) - rrf(keyword.get(a.id)) - rrf(place.get(a.id)),
  );
};

export const recommendClips = async (
  brief: string,
  options: ClipRecommendOptions = {},
  embed: (text: string) => Promise<readonly number[] | null> = embedQuery,
): Promise<ClipRecommendation[]> => {
  const vector = await embed(brief);
  const orientation = options.orientation ?? matchWord(brief, ORIENTATION_WORDS);
  const theme = options.theme ?? matchWord(brief, THEME_WORDS);
  const used = new Set<string>();
  const categories = new Set<string>();
  return (options.roles ?? DEFAULT_STORY).map((role) => {
    const candidates = vector
      ? searchClips('', { role, orientation, theme }, 500)
      : searchClips(brief, { role, orientation, theme }, 500);
    const keyword = new Map(
      searchClips(brief, { role, orientation, theme }, 500).map((hit, index) => [hit.id, index]),
    );
    const ordered = vector ? blendRanks(candidates, keyword, semanticOrder(vector)) : candidates;
    const hits = ordered.filter((hit) => !used.has(hit.id));
    const clip = hits.find((hit) => !categories.has(hit.category)) ?? hits[0] ?? null;
    if (clip !== null) {
      used.add(clip.id);
      categories.add(clip.category);
    }
    return {
      role,
      clip,
      textSlots: clipCatalog.find((entry) => entry.id === clip?.id)?.textSlots ?? [],
      alternatives: hits
        .filter((hit) => hit.id !== clip?.id)
        .slice(0, 3)
        .map((hit) => hit.id),
    };
  });
};
