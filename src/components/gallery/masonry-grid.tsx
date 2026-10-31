'use client';

import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { type ComponentType, useLayoutEffect, useRef, useState } from 'react';

const GAP = 12;
const MIN_COLUMN_WIDTH = 212;
const MAX_COLUMNS_BEFORE_WIDENING = 8;
const PHONE_WIDTH = 640;
const OVERSCAN_ITEMS = 4;
const OVERSCAN_PX = 600;
const SERVER_RENDERED_ITEMS = 16;

interface GridLayout {
  width: number;
  offset: number;
}

const columnWidthFloor = (width: number): number =>
  Math.max(MIN_COLUMN_WIDTH, width / MAX_COLUMNS_BEFORE_WIDENING);

const columnsFor = (width: number): number =>
  width < PHONE_WIDTH
    ? 2
    : Math.max(2, Math.floor((width + GAP) / (columnWidthFloor(width) + GAP)));

const sameLayout = (left: GridLayout | null, right: GridLayout): boolean =>
  left !== null && left.width === right.width && left.offset === right.offset;

interface MasonryGridProps<Item> {
  items: readonly Item[];
  itemKey: (item: Item) => string;
  heightRatio: (item: Item) => number;
  Tile: ComponentType<Item>;
}

export const MasonryGrid = <Item extends object>({
  items,
  itemKey,
  heightRatio,
  Tile,
}: MasonryGridProps<Item>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<GridLayout | null>(null);
  const columns = columnsFor(layout?.width ?? 0);
  const columnWidth =
    layout === null ? 0 : Math.max(0, (layout.width - GAP * (columns - 1)) / columns);

  const virtualizer = useWindowVirtualizer({
    count: layout === null ? 0 : items.length,
    lanes: columns,
    gap: GAP,
    overscan: OVERSCAN_ITEMS,
    scrollMargin: layout?.offset ?? 0,
    getItemKey: (index) => {
      const item = items[index];
      return item === undefined ? index : itemKey(item);
    },
    estimateSize: (index) => {
      const item = items[index];
      return item === undefined ? columnWidth : Math.round(columnWidth * heightRatio(item));
    },
  });

  useLayoutEffect(() => {
    const container = containerRef.current;
    const frame = container?.parentElement;
    if (container === null || frame === null || frame === undefined) {
      return;
    }
    const measure = () => {
      const next = {
        width: container.clientWidth,
        offset: Math.round(container.getBoundingClientRect().top + window.scrollY),
      };
      setLayout((current) => (sameLayout(current, next) ? current : next));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (columnWidth > 0 && items.length >= 0) {
      virtualizer.measure();
    }
  }, [columnWidth, items, virtualizer]);

  if (layout === null) {
    return (
      <div ref={containerRef} className="columns-2 gap-3 sm:columns-[13.25rem]">
        {items.slice(0, SERVER_RENDERED_ITEMS).map((item) => (
          <div key={itemKey(item)} className="mb-3 break-inside-avoid">
            <Tile {...item} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative" style={{ height: virtualizer.getTotalSize() }}>
      {virtualizer.getVirtualItems().map((entry) => {
        const item = items[entry.index];
        const top = (virtualizer.scrollOffset ?? 0) - OVERSCAN_PX;
        const bottom = top + (virtualizer.scrollRect?.height ?? 0) + OVERSCAN_PX * 2;
        if (item === undefined || entry.end < top || entry.start > bottom) {
          return null;
        }
        return (
          <div
            key={entry.key}
            className="absolute top-0 left-0"
            style={{
              width: columnWidth,
              height: entry.size,
              transform: `translate(${entry.lane * (columnWidth + GAP)}px, ${entry.start - virtualizer.options.scrollMargin}px)`,
            }}
          >
            <Tile {...item} />
          </div>
        );
      })}
    </div>
  );
};
