import MiniSearch from 'minisearch';
import {
  CLIP_REGISTRY,
  type ClipCategory,
  type ClipId,
  type ClipMeta,
  type ClipRole,
  type ClipTheme,
  categoryKeywords,
  categoryLabel,
  clipLabel,
} from '@/schemas';

export const ORIENTATIONS = ['landscape', 'portrait', 'square'] as const;

export type Orientation = (typeof ORIENTATIONS)[number];

export interface ClipSearchFilters {
  category?: ClipCategory | undefined;
  theme?: ClipTheme | undefined;
  orientation?: Orientation | undefined;
  role?: ClipRole | undefined;
}

export interface ClipSearchHit {
  id: ClipId;
  title: string;
  summary: string;
  category: ClipCategory;
  theme: ClipTheme;
  orientation: Orientation;
  size: string;
  seconds: number;
  roles: readonly ClipRole[];
  useCases: readonly string[];
  score: number;
}

export const orientationOf = ({ width, height }: { width: number; height: number }): Orientation =>
  width === height ? 'square' : width > height ? 'landscape' : 'portrait';

interface ClipDocument {
  id: ClipId;
  title: string;
  description: string;
  category: string;
  tags: string;
  summary: string;
  visuals: string;
  motion: string;
  mood: string;
  roles: string;
  useCases: string;
  editable: string;
  keywords: string;
}

const toDocument = (meta: ClipMeta): ClipDocument => {
  const label = clipLabel(meta.id);
  return {
    id: meta.id,
    title: meta.title,
    description: meta.description,
    category: [categoryLabel(meta.category), ...categoryKeywords(meta.category)].join(' '),
    tags: meta.tags.join(' '),
    summary: label?.summary ?? '',
    visuals: label?.visuals.join(' ') ?? '',
    motion: label?.motion.join(' ') ?? '',
    mood: label?.mood.join(' ') ?? '',
    roles: label?.roles.join(' ') ?? '',
    useCases: label?.useCases.join(' ') ?? '',
    editable: label?.editable.join(' ') ?? '',
    keywords: label?.keywords.join(' ') ?? '',
  };
};

const BOOSTS = {
  title: 4,
  keywords: 3,
  useCases: 2.5,
  tags: 2,
  category: 2,
  roles: 2,
  summary: 1.5,
  visuals: 1.5,
  description: 1.2,
  mood: 1,
  motion: 1,
  editable: 0.6,
} as const;

const createIndex = (): MiniSearch<ClipDocument> => {
  const index = new MiniSearch<ClipDocument>({
    fields: Object.keys(BOOSTS),
    storeFields: ['id'],
    searchOptions: { boost: BOOSTS, prefix: true, fuzzy: 0.2, combineWith: 'OR' },
  });
  index.addAll(CLIP_REGISTRY.map(toDocument));
  return index;
};

let cachedIndex: MiniSearch<ClipDocument> | null = null;

const clipIndex = (): MiniSearch<ClipDocument> => {
  cachedIndex ??= createIndex();
  return cachedIndex;
};

const META_BY_ID = new Map<string, ClipMeta>(CLIP_REGISTRY.map((meta) => [meta.id, meta]));

const matchesFilters = (meta: ClipMeta, filters: ClipSearchFilters): boolean =>
  (filters.category === undefined || meta.category === filters.category) &&
  (filters.theme === undefined || meta.theme === filters.theme) &&
  (filters.orientation === undefined || orientationOf(meta) === filters.orientation) &&
  (filters.role === undefined || (clipLabel(meta.id)?.roles.includes(filters.role) ?? false));

const toHit = (meta: ClipMeta, score: number): ClipSearchHit => {
  const label = clipLabel(meta.id);
  return {
    id: meta.id,
    title: meta.title,
    summary: label?.summary ?? meta.description,
    category: meta.category,
    theme: meta.theme,
    orientation: orientationOf(meta),
    size: `${meta.width}x${meta.height}`,
    seconds: Math.round((meta.durationInFrames / meta.fps) * 10) / 10,
    roles: label?.roles ?? [],
    useCases: label?.useCases ?? [],
    score: Math.round(score * 100) / 100,
  };
};

export const searchClips = (
  query: string,
  filters: ClipSearchFilters = {},
  limit = 12,
): ClipSearchHit[] => {
  const trimmed = query.trim();
  const ranked =
    trimmed === ''
      ? CLIP_REGISTRY.map((meta) => ({ meta, score: 0 }))
      : clipIndex()
          .search(trimmed)
          .flatMap((result) => {
            const meta = META_BY_ID.get(String(result.id));
            return meta === undefined ? [] : [{ meta, score: result.score }];
          });
  return ranked
    .filter(({ meta }) => matchesFilters(meta, filters))
    .slice(0, limit)
    .map(({ meta, score }) => toHit(meta, score));
};
