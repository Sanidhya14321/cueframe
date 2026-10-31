'use client';

import { SearchX } from 'lucide-react';
import type { ComponentType } from 'react';
import { Button } from '@/components/ui/button';
import type { GalleryMeta } from '@/lib/gallery-filters';
import {
  DEFAULT_FILTERS,
  facetCounts,
  filterClips,
  type GalleryFilters,
} from '@/lib/gallery-filters';
import { FilterBar } from './filter-bar';
import { MasonryGrid } from './masonry-grid';

export interface VideoGalleryItem {
  kind: 'video';
  meta: GalleryMeta;
  video: string | null;
  firstFrame: string | null;
  width: number;
  height: number;
}

export interface PosterGalleryItem {
  kind: 'poster';
  meta: GalleryMeta;
  preview: string;
  width: number;
  height: number;
}

export interface SiteGalleryItem {
  kind: 'site';
  meta: GalleryMeta;
  preview: string;
  width: number;
  height: number;
}

export type GalleryItem = VideoGalleryItem | PosterGalleryItem | SiteGalleryItem;

type GalleryTile = ComponentType<GalleryItem>;

const galleryItemKey = (item: GalleryItem): string => `${item.kind}-${item.meta.id}`;

const heightRatio = (item: GalleryItem): number => item.height / item.width;

interface ClipGalleryProps {
  items: GalleryItem[];
  Tile: GalleryTile;
  filters: GalleryFilters;
  query: string;
  onQueryChange: (query: string) => void;
  onChange: (next: GalleryFilters) => void;
}

export const ClipGallery = ({
  items,
  Tile,
  filters,
  query,
  onQueryChange,
  onChange,
}: ClipGalleryProps) => {
  const effective = { ...filters, query };
  const visible = filterClips(items, effective);
  const counts = {
    kinds: facetCounts(items, effective, 'kind', (meta) => [meta.kind]),
    categories: facetCounts(items, effective, 'category', (meta) => [meta.category]),
    tags: facetCounts(items, effective, 'tags', (meta) => meta.tags),
    themes: facetCounts(items, effective, 'theme', (meta) => [meta.theme]),
  };

  return (
    <div className="flex flex-col gap-6">
      <FilterBar
        filters={filters}
        query={query}
        counts={counts}
        total={items.length}
        shown={visible.length}
        onQueryChange={onQueryChange}
        onChange={onChange}
      />
      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl bg-muted/40 px-6 py-16 text-center">
          <SearchX className="size-6 text-muted-foreground" />
          <p className="font-medium text-sm">Nothing matches these filters.</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              onQueryChange('');
              onChange({ ...DEFAULT_FILTERS, sort: filters.sort });
            }}
          >
            Reset filters
          </Button>
        </div>
      ) : (
        <MasonryGrid
          items={visible}
          itemKey={galleryItemKey}
          heightRatio={heightRatio}
          Tile={Tile}
        />
      )}
    </div>
  );
};
