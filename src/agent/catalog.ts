import { searchClips } from '@/mcp/clip-search';
import type { ClipCategory } from '@/schemas';
import catalog from '../../catalog.json' with { type: 'json' };

const byId = new Map(catalog.map((clip) => [clip.id, clip]));

export const searchCatalog = (query: string, category?: ClipCategory, limit = 5) =>
  searchClips(query, { category }, limit).flatMap((hit) => {
    const clip = byId.get(hit.id);
    return clip ? [clip] : [];
  });
export const clipCatalog = catalog;
