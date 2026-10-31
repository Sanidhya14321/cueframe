'use client';

import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { scrollToSection } from '../../kit/scroll-to-section';
import { DISPLAY, LABEL } from './fonts';

const SECTIONS = [
  { id: 'er-story', label: 'Our story' },
  { id: 'er-venue', label: 'The venue' },
  { id: 'er-schedule', label: 'The day' },
  { id: 'er-details', label: 'Guest notes' },
  { id: 'er-faqs', label: 'Questions' },
  { id: 'er-rsvp', label: 'Reply' },
] as const;

const HALF = SECTIONS.length / 2;

const NavLinks = ({ links }: { links: readonly (typeof SECTIONS)[number][] }) => (
  <ul className="flex items-center gap-7">
    {links.map((section) => (
      <li key={section.id}>
        <button
          type="button"
          onClick={() => scrollToSection(section.id)}
          className={cn(LABEL, 'text-(--er-muted) text-[10px] transition hover:text-(--er-text)')}
        >
          {section.label}
        </button>
      </li>
    ))}
  </ul>
);

export const SiteNav = ({ monogram }: { monogram: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-30 border-(--er-accent)/35 border-b bg-(--er-bg)/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 @3xl:grid @3xl:grid-cols-[1fr_auto_1fr]">
        <div className="hidden justify-end @3xl:flex">
          <NavLinks links={SECTIONS.slice(0, HALF)} />
        </div>
        <button
          type="button"
          onClick={() => scrollToSection('er-invitation')}
          className={cn(DISPLAY, 'text-(--er-text) text-2xl italic @3xl:mx-10')}
        >
          {monogram}
        </button>
        <div className="hidden @3xl:flex">
          <NavLinks links={SECTIONS.slice(HALF)} />
        </div>
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="text-(--er-text) @3xl:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open ? (
        <ul className="grid grid-cols-2 gap-x-4 border-(--er-accent)/35 border-t px-5 py-3 @3xl:hidden">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  scrollToSection(section.id);
                }}
                className={cn(LABEL, 'w-full py-2.5 text-left text-(--er-text) text-[11px]')}
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
