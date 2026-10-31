'use client';

import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { InkAndLaceContent } from '@/sites/templates/weddings/ink-and-lace';
import { scrollToSection } from '../../kit/scroll-to-section';
import { DISPLAY, LABEL } from './fonts';
import type { IssueSection } from './issue-sections';

export const SiteNav = ({
  content,
  sections,
}: {
  content: InkAndLaceContent;
  sections: readonly IssueSection[];
}) => {
  const [open, setOpen] = useState(false);
  const go = (id: string) => {
    setOpen(false);
    scrollToSection(id);
  };
  return (
    <nav className="sticky top-0 z-30 border-current/15 border-b bg-(--il-paper)/92 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-5 @3xl:px-10">
        <button type="button" onClick={() => go('il-cover')} className="flex items-baseline gap-3">
          <span className={cn(DISPLAY, 'text-2xl uppercase tracking-[-0.01em]')}>
            {content.issue.masthead}
          </span>
          <span
            className={cn(
              LABEL,
              'hidden whitespace-nowrap text-(--il-muted) text-[9px] @md:inline',
            )}
          >
            {content.issue.number}
          </span>
        </button>
        <ul className="hidden items-center gap-3.5 @6xl:flex">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => go(section.id)}
                className={cn(
                  LABEL,
                  'whitespace-nowrap text-[9px] tracking-[0.16em] transition-colors hover:text-(--il-accent)',
                )}
              >
                <span className="text-(--il-accent)">{section.number}</span> {section.label}
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          aria-label={open ? 'Close contents' : 'Open contents'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className={cn(LABEL, 'flex items-center gap-2 @6xl:hidden')}
        >
          Contents
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>
      {open ? (
        <ol className="mx-auto flex max-w-6xl flex-col border-current/15 border-t px-5 py-2 @3xl:px-10 @6xl:hidden">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => go(section.id)}
                className="flex w-full items-baseline gap-4 border-current/10 border-b py-3 text-left last:border-b-0"
              >
                <span className={cn(DISPLAY, 'w-7 text-(--il-accent) text-lg')}>
                  {section.number}
                </span>
                <span className={cn(DISPLAY, 'text-xl')}>{section.label}</span>
              </button>
            </li>
          ))}
        </ol>
      ) : null}
    </nav>
  );
};
