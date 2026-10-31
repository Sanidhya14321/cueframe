'use client';

import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import type { Poster } from '@/posters/pack';
import { posterPreviewPath } from '@/posters/preview-path';

export const TemplatesPanel = ({ onApply }: { onApply: (poster: Poster) => void }) => {
  const [posters, setPosters] = useState<readonly Poster[] | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let active = true;
    import('@/posters')
      .then((module) => {
        if (active) {
          setPosters(module.POSTERS);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (posters ?? []).filter(
      ({ meta }) =>
        needle === '' ||
        `${meta.title} ${meta.description} ${meta.tags.join(' ')} ${meta.category}`
          .toLowerCase()
          .includes(needle),
    );
  }, [posters, query]);

  return (
    <div className="flex flex-col gap-4">
      <Input
        aria-label="Search templates"
        placeholder="Search templates: hiring, deck, resume"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="h-8"
      />
      <p className="text-[11px] text-muted-foreground">
        Click a template to replace the canvas with it, resized to this design.
      </p>
      {posters === null ? (
        <Loader2 className="mx-auto size-5 animate-spin text-muted-foreground" />
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {visible.map((poster) => (
            <button
              type="button"
              key={poster.meta.id}
              aria-label={`Use ${poster.meta.title}`}
              title={poster.meta.title}
              onClick={() => onApply(poster)}
              className="relative w-full overflow-hidden rounded-md bg-muted ring-violet-500 transition hover:ring-2"
              style={{ aspectRatio: `${poster.meta.width} / ${poster.meta.height}` }}
            >
              <Image
                src={posterPreviewPath(poster.meta)}
                alt=""
                fill
                unoptimized
                sizes="140px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
