import MiniSearch from 'minisearch';
import {
  CLIP_THEMES,
  type ClipTheme,
  categoryKeywords,
  categoryLabel,
  GALLERY_CATEGORY_IDS,
  GALLERY_TAGS,
  type GalleryCategory,
  type GalleryTag,
} from '@/schemas/taxonomy';

export const GALLERY_KINDS = [
  { id: 'video', label: 'Videos' },
  { id: 'poster', label: 'Posters' },
  { id: 'site', label: 'Websites' },
] as const;

export type GalleryKind = (typeof GALLERY_KINDS)[number]['id'];

export interface GalleryMeta {
  attribution?: import('@/schemas/registry').ClipMeta['attribution'];
  id: string;
  kind: GalleryKind;
  title: string;
  description: string;
  category: GalleryCategory;
  tags: readonly GalleryTag[];
  theme: ClipTheme;
  durationInFrames: number;
  fps: number;
  updatedAt: string;
}

export const SORT_OPTIONS = [
  { id: 'relevance', label: 'Best match' },
  { id: 'updated', label: 'Recently updated' },
  { id: 'name-asc', label: 'Name, A to Z' },
  { id: 'name-desc', label: 'Name, Z to A' },
  { id: 'shortest', label: 'Shortest first' },
  { id: 'longest', label: 'Longest first' },
] as const;

export type SortId = (typeof SORT_OPTIONS)[number]['id'];

export interface GalleryFilters {
  query: string;
  kind: GalleryKind | 'all';
  category: GalleryCategory | 'all';
  tags: GalleryTag[];
  theme: ClipTheme | 'all';
  sort: SortId;
}

export const DEFAULT_FILTERS: GalleryFilters = {
  query: '',
  kind: 'all',
  category: 'all',
  tags: [],
  theme: 'all',
  sort: 'relevance',
};

const SORT_IDS: readonly string[] = SORT_OPTIONS.map((option) => option.id);
const CATEGORY_IDS: readonly string[] = GALLERY_CATEGORY_IDS;
const TAGS: readonly string[] = GALLERY_TAGS;
const KIND_IDS: readonly string[] = GALLERY_KINDS.map((kind) => kind.id);
const THEMES: readonly string[] = CLIP_THEMES;

const isCategory = (value: string): value is GalleryCategory => CATEGORY_IDS.includes(value);
const isTag = (value: string): value is GalleryTag => TAGS.includes(value);
const isKind = (value: string): value is GalleryKind => KIND_IDS.includes(value);
const isTheme = (value: string): value is ClipTheme => THEMES.includes(value);
const isSort = (value: string): value is SortId => SORT_IDS.includes(value);

export const parseFilters = (params: URLSearchParams): GalleryFilters => {
  const kind = params.get('type') ?? '';
  const category = params.get('category') ?? '';
  const theme = params.get('theme') ?? '';
  const sort = params.get('sort') ?? '';
  const tags = (params.get('tags') ?? '').split(',').filter(isTag);
  return {
    query: params.get('q') ?? '',
    kind: isKind(kind) ? kind : 'all',
    category: isCategory(category) ? category : 'all',
    tags: [...new Set(tags)],
    theme: isTheme(theme) ? theme : 'all',
    sort: isSort(sort) ? sort : DEFAULT_FILTERS.sort,
  };
};

export const serializeFilters = (filters: GalleryFilters): string => {
  const params = new URLSearchParams();
  if (filters.query.trim().length > 0) {
    params.set('q', filters.query.trim());
  }
  if (filters.kind !== 'all') {
    params.set('type', filters.kind);
  }
  if (filters.category !== 'all') {
    params.set('category', filters.category);
  }
  if (filters.tags.length > 0) {
    params.set('tags', filters.tags.join(','));
  }
  if (filters.theme !== 'all') {
    params.set('theme', filters.theme);
  }
  if (filters.sort !== DEFAULT_FILTERS.sort) {
    params.set('sort', filters.sort);
  }
  const text = params.toString();
  return text.length > 0 ? `?${text}` : '';
};

export const hasActiveFilters = (filters: GalleryFilters): boolean =>
  filters.query.trim().length > 0 ||
  filters.kind !== 'all' ||
  filters.category !== 'all' ||
  filters.tags.length > 0 ||
  filters.theme !== 'all';

interface SearchDocument {
  id: string;
  title: string;
  tags: string;
  category: string;
  keywords: string;
  theme: string;
  description: string;
}

const toSearchDocument = (meta: GalleryMeta): SearchDocument => ({
  id: meta.id,
  title: meta.title,
  tags: meta.tags.join(' '),
  category: categoryLabel(meta.category),
  keywords: [meta.category, ...categoryKeywords(meta.category)].join(' '),
  theme: meta.theme,
  description: meta.description,
});

const SEARCH_FIELDS = ['title', 'tags', 'category', 'keywords', 'theme', 'description'];

const FUZZY_MIN_LENGTH = 6;

const indexes = new WeakMap<readonly { meta: GalleryMeta }[], MiniSearch<SearchDocument>>();

const indexFor = (items: readonly { meta: GalleryMeta }[]): MiniSearch<SearchDocument> => {
  const cached = indexes.get(items);
  if (cached !== undefined) {
    return cached;
  }
  const index = new MiniSearch<SearchDocument>({
    fields: SEARCH_FIELDS,
    searchOptions: {
      boost: { title: 4, tags: 2.5, category: 2, keywords: 1.5, theme: 1, description: 1 },
      prefix: true,
      fuzzy: (term) => (term.length >= FUZZY_MIN_LENGTH ? 0.2 : false),
      combineWith: 'AND',
    },
  });
  index.addAll(items.map((item) => toSearchDocument(item.meta)));
  indexes.set(items, index);
  return index;
};

type SearchScores = ReadonlyMap<string, number> | null;

const searchScores = (items: readonly { meta: GalleryMeta }[], query: string): SearchScores => {
  if (query.trim().length === 0) {
    return null;
  }
  return new Map(
    indexFor(items)
      .search(query)
      .map((result) => [String(result.id), result.score]),
  );
};

type Facet = 'kind' | 'category' | 'tags' | 'theme';

const matches = (
  meta: GalleryMeta,
  filters: GalleryFilters,
  scores: SearchScores,
  ignore?: Facet,
): boolean =>
  (scores === null || scores.has(meta.id)) &&
  (ignore === 'kind' || filters.kind === 'all' || meta.kind === filters.kind) &&
  (ignore === 'category' || filters.category === 'all' || meta.category === filters.category) &&
  (ignore === 'tags' || filters.tags.every((tag) => meta.tags.includes(tag))) &&
  (ignore === 'theme' || filters.theme === 'all' || meta.theme === filters.theme);

type Comparator = (left: GalleryMeta, right: GalleryMeta) => number;

const byUpdated: Comparator = (left, right) => right.updatedAt.localeCompare(left.updatedAt);

const COMPARATORS: Record<Exclude<SortId, 'relevance'>, Comparator> = {
  updated: byUpdated,
  'name-asc': (left, right) => left.title.localeCompare(right.title),
  'name-desc': (left, right) => right.title.localeCompare(left.title),
  shortest: (left, right) => left.durationInFrames / left.fps - right.durationInFrames / right.fps,
  longest: (left, right) => right.durationInFrames / right.fps - left.durationInFrames / left.fps,
};

const comparator = (sort: SortId, scores: SearchScores): Comparator => {
  if (sort !== 'relevance') {
    return COMPARATORS[sort];
  }
  if (scores === null) {
    return byUpdated;
  }
  return (left, right) => (scores.get(right.id) ?? 0) - (scores.get(left.id) ?? 0);
};

export const filterClips = <Item extends { meta: GalleryMeta }>(
  items: readonly Item[],
  filters: GalleryFilters,
): Item[] => {
  const scores = searchScores(items, filters.query);
  const compare = comparator(filters.sort, scores);
  return items
    .filter((item) => matches(item.meta, filters, scores))
    .sort((left, right) => compare(left.meta, right.meta));
};

export const facetCounts = <Key extends string>(
  items: readonly { meta: GalleryMeta }[],
  filters: GalleryFilters,
  facet: Facet,
  keysOf: (meta: GalleryMeta) => readonly Key[],
): Map<Key, number> => {
  const scores = searchScores(items, filters.query);
  const counts = new Map<Key, number>();
  for (const item of items) {
    if (matches(item.meta, filters, scores, facet)) {
      for (const key of keysOf(item.meta)) {
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
  }
  return counts;
};

export const formatDuration = (meta: GalleryMeta): string => {
  const seconds = meta.durationInFrames / meta.fps;
  return Number.isInteger(seconds) ? `${seconds}s` : `${seconds.toFixed(1)}s`;
};
