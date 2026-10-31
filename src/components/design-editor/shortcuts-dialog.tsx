'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SHORTCUT_GROUPS } from './shortcuts';

export const ShortcutsDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>Keyboard shortcuts</DialogTitle>
        <DialogDescription>Use ⌘ on macOS and Ctrl on Windows and Linux.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-6 sm:grid-cols-2">
        {SHORTCUT_GROUPS.map((group) => (
          <section key={group.title} className="flex flex-col gap-2">
            <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
              {group.title}
            </h3>
            <dl className="flex flex-col gap-1.5 text-sm">
              {group.items.map(([label, keys]) => (
                <div key={label} className="flex items-center justify-between gap-4">
                  <dt>{label}</dt>
                  <dd className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px]">
                    {keys}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </DialogContent>
  </Dialog>
);
