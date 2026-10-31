'use client';

import { GanttChart, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MobilePanel = 'properties' | 'timeline';

const PANELS = [
  { id: 'properties', label: 'Properties', Icon: SlidersHorizontal },
  { id: 'timeline', label: 'Timeline', Icon: GanttChart },
] as const;

export const MobilePanelSwitch = ({
  active,
  onChange,
}: {
  active: MobilePanel;
  onChange: (panel: MobilePanel) => void;
}) => (
  <div
    role="tablist"
    aria-label="Editor panel"
    className="flex shrink-0 gap-1 border-border border-y bg-sidebar p-1.5 lg:hidden"
  >
    {PANELS.map(({ id, label, Icon }) => (
      <button
        key={id}
        type="button"
        role="tab"
        aria-selected={active === id}
        onClick={() => onChange(id)}
        className={cn(
          'inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md font-medium text-sm transition-colors',
          active === id
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <Icon className="size-4" />
        {label}
      </button>
    ))}
  </div>
);
