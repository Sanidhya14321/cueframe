import { Skeleton } from '@/components/ui/skeleton';

const GALLERY_CARDS = Array.from({ length: 12 }, (_, index) => `card-${index}`);
const FILTERS = ['type', 'category', 'tags', 'theme', 'sort'] as const;
const PROPERTY_ROWS = ['one', 'two', 'three', 'four', 'five', 'six'] as const;
const TRACKS = ['top', 'middle', 'bottom'] as const;
const TOOLS = [
  'templates',
  'elements',
  'text',
  'photos',
  'uploads',
  'frame',
  'background',
  'layers',
];

const GalleryGridSkeleton = () => (
  <div className="flex flex-col gap-6" role="status" aria-busy aria-label="Loading the library">
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-9 w-full sm:w-auto sm:min-w-[16rem] sm:flex-1" />
        <div className="flex gap-2 overflow-hidden">
          {FILTERS.map((filter) => (
            <Skeleton key={filter} className="h-9 w-28 shrink-0" />
          ))}
        </div>
      </div>
      <Skeleton className="h-5 w-24" />
    </div>
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-5">
      {GALLERY_CARDS.map((card) => (
        <div key={card} className="flex flex-col overflow-hidden rounded-xl border bg-card">
          <Skeleton className="aspect-video rounded-none" />
          <div className="flex flex-col gap-2 px-3.5 py-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <div className="flex gap-1.5">
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-4 w-10 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const GalleryPageSkeleton = () => (
  <div className="w-full px-4 pt-4 pb-8 sm:px-6 sm:pt-6 lg:px-10">
    <GalleryGridSkeleton />
  </div>
);

export const ClipPreviewSkeleton = () => (
  <div className="flex h-full flex-col" role="status" aria-busy aria-label="Loading the preview">
    <div className="flex items-center justify-center gap-3 p-3">
      <Skeleton className="h-9 w-36" />
      <Skeleton className="h-9 w-32 sm:w-72" />
    </div>
    <div className="flex min-h-0 flex-1 items-center justify-center p-3 sm:p-6">
      <Skeleton className="aspect-video max-h-full w-full max-w-[980px] rounded-xl" />
    </div>
  </div>
);

const PropertiesSkeleton = () => (
  <div className="flex flex-col gap-4 p-4">
    <Skeleton className="h-5 w-40" />
    {PROPERTY_ROWS.map((row) => (
      <div key={row} className="flex flex-col gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-full" />
      </div>
    ))}
  </div>
);

export const ClipEditorSkeleton = () => (
  <div className="flex h-[calc(100dvh-3.5rem)] min-h-0 flex-col">
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <section className="flex h-[min(46dvh,26rem)] shrink-0 flex-col bg-muted/30 lg:h-auto lg:min-h-0 lg:flex-1">
        <ClipPreviewSkeleton />
      </section>
      <div className="flex shrink-0 gap-1 border-border border-y bg-sidebar p-1.5 lg:hidden">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 flex-1" />
      </div>
      <aside className="min-h-0 flex-1 overflow-hidden border-border bg-sidebar lg:w-[360px] lg:flex-none lg:border-l">
        <PropertiesSkeleton />
      </aside>
    </div>
    <div className="hidden h-72 shrink-0 flex-col gap-3 border-border border-t bg-sidebar p-3 lg:flex">
      <Skeleton className="h-8 w-full max-w-3xl" />
      {TRACKS.map((track) => (
        <div key={track} className="flex gap-3">
          <Skeleton className="h-11 w-32 shrink-0" />
          <Skeleton className="h-11 flex-1" />
        </div>
      ))}
    </div>
  </div>
);

export const DesignEditorSkeleton = () => (
  <div
    className="flex h-[calc(100dvh-3.5rem)] min-h-0 flex-col"
    role="status"
    aria-busy
    aria-label="Loading the editor"
  >
    <div className="flex h-14 shrink-0 items-center gap-2 border-b px-3">
      <Skeleton className="size-8" />
      <Skeleton className="h-8 w-32 sm:w-56" />
      <Skeleton className="hidden h-8 w-40 sm:block" />
      <Skeleton className="ml-auto h-8 w-24" />
    </div>
    <div className="flex min-h-0 flex-1 flex-col md:flex-row">
      <div className="order-last flex shrink-0 gap-1 overflow-hidden border-t px-2 py-1.5 md:order-none md:w-[72px] md:flex-col md:items-center md:border-t-0 md:border-r md:px-0 md:py-2">
        {TOOLS.map((tool) => (
          <Skeleton key={tool} className="h-12 w-14 shrink-0 md:w-16" />
        ))}
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 items-center justify-center bg-muted/40 p-6">
          <Skeleton className="aspect-square max-h-full w-full max-w-md bg-background shadow-sm" />
        </div>
      </div>
      <aside className="hidden w-[280px] shrink-0 border-l lg:block">
        <PropertiesSkeleton />
      </aside>
    </div>
  </div>
);
