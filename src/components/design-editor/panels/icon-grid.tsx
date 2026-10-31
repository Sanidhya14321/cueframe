'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { DESIGN_ICON_NAMES, iconDataUrl } from '@/design';
import { cn } from '@/lib/utils';

interface IconGridProps {
  selected?: string;
  onPick: (name: string) => void;
  columns?: number;
}

export const IconGrid = ({ selected, onPick, columns = 6 }: IconGridProps) => {
  const [query, setQuery] = useState('');
  const names = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle === ''
      ? DESIGN_ICON_NAMES
      : DESIGN_ICON_NAMES.filter((name) => name.includes(needle));
  }, [query]);

  return (
    <div className="flex flex-col gap-2">
      <Input
        aria-label="Search icons"
        placeholder="Search icons"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="h-8"
      />
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {names.map((name) => (
          <button
            type="button"
            key={name}
            title={name}
            aria-label={`Icon ${name}`}
            onClick={() => onPick(name)}
            className={cn(
              'flex aspect-square items-center justify-center rounded-md hover:bg-accent dark:invert-0',
              selected === name ? 'bg-violet-500/15' : 'bg-muted/60',
            )}
          >
            <span
              aria-hidden="true"
              className="size-5 bg-center bg-contain bg-no-repeat dark:invert"
              style={{ backgroundImage: `url("${iconDataUrl(name, '#334155', 2, 48)}")` }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
