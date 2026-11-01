import { embedQuery } from '@/mcp/clip-embeddings';
import { type ClipSearchFilters, searchClips } from '@/mcp/clip-search';
import { CLIP_REGISTRY } from '@/schemas';
import { readSettings } from '../settings';
import { searchLibraryVectors } from './vectors';

export const searchClipsByMeaning = async (
  query: string,
  filters: ClipSearchFilters = {},
  limit = 12,
) => {
  const keyword = searchClips(query, filters, CLIP_REGISTRY.length);
  if (!query.trim()) {
    return keyword.slice(0, limit);
  }
  if (!(await readSettings()).yugabyteUrl) {
    return keyword.slice(0, limit);
  }
  const stored = await embedQuery(query)
    .then((vector) => (vector ? searchLibraryVectors(vector, 'clip', 5000) : null))
    .catch(() => null);
  if (!stored?.length) {
    return keyword.slice(0, limit);
  }
  const semanticRanks = new Map(stored.map((row, index) => [row.id, index]));
  const keywordRanks = new Map(keyword.map((row, index) => [row.id, index]));
  const rank = (index: number | undefined) => (index === undefined ? 0 : 1 / (60 + index));
  return searchClips('', filters, CLIP_REGISTRY.length)
    .filter((hit) => semanticRanks.has(hit.id) || keywordRanks.has(hit.id))
    .map((hit) => ({
      ...hit,
      score: rank(semanticRanks.get(hit.id)) + rank(keywordRanks.get(hit.id)),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};
