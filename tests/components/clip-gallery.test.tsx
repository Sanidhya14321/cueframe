import { describe, expect, it } from 'bun:test';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { ClipGallery, type GalleryItem } from '@/components/gallery/clip-gallery';
import { DEFAULT_FILTERS, type GalleryFilters } from '@/lib/gallery-filters';
import { videoMeta } from '@/lib/video-meta';
import { CLIP_REGISTRY } from '@/schemas';

const items: GalleryItem[] = CLIP_REGISTRY.map((meta) => ({
  kind: 'video',
  meta: videoMeta(meta),
  video: null,
  firstFrame: null,
  width: meta.width,
  height: meta.height,
}));

const StubTile = ({ meta }: GalleryItem) => <article>{meta.title}</article>;

const Harness = ({ initial = DEFAULT_FILTERS }: { initial?: GalleryFilters }) => {
  const [filters, setFilters] = useState(initial);
  const [query, setQuery] = useState(initial.query);
  return (
    <ClipGallery
      items={items}
      Tile={StubTile}
      filters={filters}
      query={query}
      onQueryChange={setQuery}
      onChange={setFilters}
    />
  );
};

describe('ClipGallery', () => {
  it('lists every clip in one flat grid but only mounts the tiles near the viewport', () => {
    const width = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      value: 1200,
    });
    render(<Harness />);
    if (width !== undefined) {
      Object.defineProperty(HTMLElement.prototype, 'clientWidth', width);
    }
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByText(`${items.length} items`)).toBeInTheDocument();
    const mounted = screen.getAllByRole('article').length;
    expect(mounted).toBeGreaterThan(0);
    expect(mounted).toBeLessThan(items.length);
  });

  it('narrows the grid as you type a search', () => {
    render(<Harness />);
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search the library' }), {
      target: { value: 'phone wall' },
    });
    expect(screen.getAllByRole('article').map((node) => node.textContent)).toEqual(['Phone Wall']);
    expect(screen.getByText(`1 of ${items.length} items`)).toBeInTheDocument();
  });

  it('shows removable chips for active filters and an empty state', () => {
    render(<Harness initial={{ ...DEFAULT_FILTERS, category: 'transitions', tags: ['phone'] }} />);
    expect(screen.getByText('Nothing matches these filters.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Remove filter #phone' }));
    expect(screen.getAllByRole('article').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(screen.getByText(`${items.length} items`)).toBeInTheDocument();
  });

  it('orders the grid by name when sorted by name', () => {
    render(<Harness initial={{ ...DEFAULT_FILTERS, sort: 'name-asc' }} />);
    const titles = screen.getAllByRole('article').map((node) => node.textContent ?? '');
    expect(titles).toEqual([...titles].sort((left, right) => left.localeCompare(right)));
  });
});
