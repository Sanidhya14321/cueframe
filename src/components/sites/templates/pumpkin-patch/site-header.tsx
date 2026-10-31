'use client';

import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { scrollToSection } from '../../kit/scroll-to-section';
import { DISPLAY, LABEL } from './fonts';
import { Pumpkin } from './ornaments';
import { PILL, PILL_SOLID } from './pill';

const SECTIONS = [
  { id: 'pp-welcome', label: 'Welcome' },
  { id: 'pp-afternoon', label: 'The afternoon' },
  { id: 'pp-registry', label: 'Registry' },
  { id: 'pp-details', label: 'Details' },
  { id: 'pp-venue', label: 'Find us' },
] as const;

export const SiteHeader = ({ lastName }: { lastName: string }) => {
  const [open, setOpen] = useState(false);
  const go = (id: string) => {
    setOpen(false);
    scrollToSection(id);
  };
  return (
    <header className="sticky top-0 z-30 border-(--pp-oat-deep)/60 border-b bg-(--pp-bg)/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5">
        <button
          type="button"
          onClick={() => go('pp-home')}
          className={cn(DISPLAY, 'flex items-center gap-2 text-(--pp-text) text-xl')}
        >
          <Pumpkin className="w-8" />
          Baby {lastName}
        </button>
        <ul className="hidden items-center gap-6 @3xl:flex">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => go(section.id)}
                className={cn(LABEL, 'text-(--pp-muted) text-[10px] hover:text-(--pp-primary)')}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go('pp-rsvp')}
            className={cn(PILL, PILL_SOLID, 'px-4 py-2 shadow-none')}
          >
            RSVP
          </button>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="grid size-9 place-items-center rounded-full text-(--pp-text) @3xl:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <ul className="flex flex-col border-(--pp-oat-deep)/60 border-t px-5 py-2 @3xl:hidden">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => go(section.id)}
                className={cn(LABEL, 'w-full py-3 text-left text-(--pp-text) text-[11px]')}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </header>
  );
};
