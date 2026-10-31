'use client';

import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { scrollToSection } from '../../kit/scroll-to-section';
import { DECO, DISPLAY } from './fonts';
import { Crown } from './ornaments';

const SECTIONS = [
  { id: 'mc-letter', label: 'Her letter' },
  { id: 'mc-family', label: 'Family' },
  { id: 'mc-celebration', label: 'Celebration' },
  { id: 'mc-program', label: 'Program' },
  { id: 'mc-court', label: 'Court' },
  { id: 'mc-details', label: 'Details' },
  { id: 'mc-rsvp', label: 'RSVP' },
] as const;

export const SiteNav = ({ initial }: { initial: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-30 border-(--mc-gold)/25 border-b bg-(--mc-bg)/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => scrollToSection('mc-home')}
          className="flex items-end gap-1.5"
        >
          <Crown className="w-7" />
          <span className={cn(DISPLAY, 'text-(--mc-text) text-2xl italic leading-none')}>
            {initial}
          </span>
        </button>
        <ul className="hidden items-center gap-6 @3xl:flex">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  DECO,
                  'text-(--mc-muted) text-[11px] transition hover:text-(--mc-gold)',
                )}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="text-(--mc-gold) @3xl:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open ? (
        <ul className="flex flex-col gap-1 border-(--mc-gold)/25 border-t px-5 py-3 @3xl:hidden">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  scrollToSection(section.id);
                }}
                className={cn(DECO, 'w-full py-2 text-left text-(--mc-text) text-xs')}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </nav>
  );
};
