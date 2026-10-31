import type { ReactNode } from 'react';
import { categoryLabel, type GalleryCategory } from '@/schemas/taxonomy';

export const TILE_FRAME =
  'group relative block w-full overflow-hidden rounded-2xl bg-muted ring-1 ring-foreground/5 transition duration-300 hover:ring-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export const TileCaption = ({
  title,
  category,
  children,
}: {
  title: string;
  category: GalleryCategory;
  children?: ReactNode;
}) => (
  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-3 pt-10 pb-2.5 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
    <div className="flex min-w-0 flex-col">
      <span className="truncate font-semibold text-[13px] leading-tight tracking-tight">
        {title}
      </span>
      <span className="truncate text-[11px] text-white/70">{categoryLabel(category)}</span>
    </div>
    {children}
  </div>
);

export const TileBadge = ({ children }: { children: ReactNode }) => (
  <span className="pointer-events-none absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 font-medium text-[10px] text-white tabular-nums backdrop-blur-md">
    {children}
  </span>
);
