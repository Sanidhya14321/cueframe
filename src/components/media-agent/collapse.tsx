import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export const Collapse = ({ open, children }: { open: boolean; children: ReactNode }) => (
  <div
    inert={!open}
    className={cn(
      'grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none',
      open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
    )}
  >
    <div className="min-h-0 overflow-hidden">{children}</div>
  </div>
);

export const Appear = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div
    className={cn(
      'fade-in-0 slide-in-from-bottom-1 animate-in duration-300 ease-out motion-reduce:animate-none',
      className,
    )}
  >
    {children}
  </div>
);
