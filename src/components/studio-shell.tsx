'use client';

import { Clapperboard, Plus, Settings } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { PAGE_ACTIONS_ID } from '@/components/media-agent/page-actions';
import { SiteNavLinks } from '@/components/site-nav-links';
import { StudioCommandPalette } from '@/components/studio-command-palette';
import { StudioConnection } from '@/components/studio-connection';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useCreateProject } from '@/lib/use-create-project';

export const StudioShell = ({ children }: { children: ReactNode }) => {
  const { create, busy, problem } = useCreateProject();
  return (
    <>
      <a
        href="#studio-content"
        className="sr-only fixed top-2 left-2 z-50 rounded-md bg-primary p-3 text-primary-foreground focus:not-sr-only"
      >
        Skip to content
      </a>
      <header className="studio-topbar sticky top-0 z-30 flex h-11 shrink-0 items-center justify-between gap-1 border-b bg-background px-2 sm:gap-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-1 sm:gap-4">
          <Link
            href="/"
            aria-label="ClipKit home"
            className="flex min-h-11 shrink-0 items-center gap-2 pr-1 font-semibold tracking-tight sm:pr-2"
          >
            <Clapperboard className="size-5 text-primary" />
            <span>ClipKit</span>
          </Link>
          <Button
            type="button"
            onClick={create}
            disabled={busy}
            className="size-11 gap-1 px-2 text-xs sm:w-auto sm:gap-2 sm:px-3 sm:text-sm"
            aria-label={busy ? 'Creating video' : 'New video'}
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">{busy ? 'Creating…' : 'New video'}</span>
          </Button>
          <SiteNavLinks />
        </div>
        <nav aria-label="Studio tools" className="flex shrink-0 items-center gap-0 sm:gap-1">
          <div id={PAGE_ACTIONS_ID} className="contents" />
          <StudioConnection />
          <StudioCommandPalette />
          <Button variant="ghost" size="icon" className="size-11" asChild>
            <Link href="/settings" aria-label="Settings">
              <Settings />
            </Link>
          </Button>
          <span className="hidden lg:contents">
            <ThemeToggle />
          </span>
        </nav>
      </header>
      {problem ? (
        <p role="alert" className="border-b px-4 py-2 text-sm text-destructive">
          {problem}
        </p>
      ) : null}
      <main id="studio-content" tabIndex={-1} className="flex min-h-0 flex-1 flex-col outline-none">
        {children}
      </main>
    </>
  );
};
