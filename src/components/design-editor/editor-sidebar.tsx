'use client';

import type { LucideIcon } from 'lucide-react';
import { X } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

export interface SidebarPanel {
  id: string;
  label: string;
  Icon: LucideIcon;
  render: () => ReactNode;
}

const isCompactViewport = (): boolean => window.matchMedia('(max-width: 767px)').matches;

export const EditorSidebar = ({
  panels,
  initial,
}: {
  panels: SidebarPanel[];
  initial?: string;
}) => {
  const [active, setActive] = useState<string | null>(() =>
    isCompactViewport() ? null : (initial ?? panels[0]?.id ?? null),
  );
  const current = panels.find((panel) => panel.id === active);
  return (
    <aside className="relative order-last flex shrink-0 border-t bg-background md:order-none md:border-t-0 md:border-r">
      <nav
        className="flex w-full gap-1 overflow-x-auto px-2 py-1.5 md:w-[72px] md:flex-col md:items-center md:overflow-visible md:border-r md:px-0 md:py-2"
        aria-label="Editor tools"
      >
        {panels.map(({ id, label, Icon }) => (
          <button
            type="button"
            key={id}
            onClick={() => setActive((currentId) => (currentId === id ? null : id))}
            aria-pressed={active === id}
            className={cn(
              'flex w-16 shrink-0 flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] transition-colors md:py-2',
              active === id
                ? 'bg-violet-500/12 text-violet-600 dark:text-violet-300'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
          >
            <Icon className="size-5" />
            {label}
          </button>
        ))}
      </nav>
      {current === undefined ? null : (
        <div className="absolute inset-x-0 bottom-full z-30 flex h-[55dvh] flex-col rounded-t-2xl border-t bg-background shadow-2xl md:static md:h-auto md:w-[260px] lg:w-[300px] md:rounded-none md:border-t-0 md:shadow-none">
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <h2 className="font-semibold text-sm">{current.label}</h2>
            <button
              type="button"
              aria-label={`Close ${current.label}`}
              onClick={() => setActive(null)}
              className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">{current.render()}</div>
        </div>
      )}
    </aside>
  );
};
