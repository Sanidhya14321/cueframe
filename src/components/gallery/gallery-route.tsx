'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { type GalleryFilters, parseFilters, serializeFilters } from '@/lib/gallery-filters';
import { replaceLocationSearch, useLocationSearch } from '@/lib/use-location-search';
import { ClipGallery, type GalleryItem } from './clip-gallery';
import { GalleryTile } from './gallery-tile';

const QUERY_DEBOUNCE_MS = 200;

export const ClipGalleryRoute = ({ items }: { items: GalleryItem[] }) => {
  const search = useLocationSearch();
  const filters = useMemo(() => parseFilters(new URLSearchParams(search)), [search]);
  const [draft, setDraft] = useState<string | null>(null);
  const query = draft ?? filters.query;

  const navigate = useCallback((next: GalleryFilters) => {
    replaceLocationSearch(serializeFilters(next));
    setDraft(null);
  }, []);

  useEffect(() => {
    if (draft === null || draft === filters.query) {
      return;
    }
    const timer = window.setTimeout(
      () => navigate({ ...filters, query: draft }),
      QUERY_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [draft, filters, navigate]);

  return (
    <ClipGallery
      items={items}
      Tile={GalleryTile}
      filters={filters}
      query={query}
      onQueryChange={setDraft}
      onChange={(next) => navigate({ ...next, query })}
    />
  );
};
