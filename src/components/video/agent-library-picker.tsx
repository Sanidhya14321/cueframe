'use client';
import { Library } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CLIP_REGISTRY } from '@/schemas';
import { SITE_TEMPLATES } from '@/sites/templates';

export type LibraryRef = { id: string; title: string; type: 'clip' | 'website template' };

const CATALOG: readonly LibraryRef[] = [
  ...CLIP_REGISTRY.map(({ id, title }) => ({ id, title, type: 'clip' as const })),
  ...SITE_TEMPLATES.map(({ id, meta }) => ({
    id,
    title: meta.title,
    type: 'website template' as const,
  })),
];

export const AgentLibraryPicker = ({ onPick }: { onPick: (item: LibraryRef) => void }) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    return CATALOG.filter((item) => item.title.toLowerCase().includes(term)).slice(0, 40);
  }, [query]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" size="sm">
          <Library />
          Library
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="flex w-72 flex-col gap-2 text-xs">
        <Input
          aria-label="Search clips and templates"
          placeholder="Search clips and templates"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ul className="max-h-64 overflow-y-auto">
          {matches.map((item) => (
            <li key={`${item.type}:${item.id}`}>
              <button
                type="button"
                className="flex min-h-9 w-full items-center justify-between gap-2 rounded-md px-2 text-left hover:bg-accent"
                onClick={() => {
                  onPick(item);
                  setOpen(false);
                }}
              >
                <span className="truncate">{item.title}</span>
                <span className="shrink-0 text-muted-foreground">{item.type}</span>
              </button>
            </li>
          ))}
        </ul>
        {matches.length === 0 ? <p className="text-muted-foreground">Nothing matches.</p> : null}
      </PopoverContent>
    </Popover>
  );
};
