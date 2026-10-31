'use client';

import { cn } from '@/lib/utils';
import { scrollToSection } from '../../kit/scroll-to-section';
import { DISPLAY, LABEL } from './fonts';
import { SnowflakeMark } from './ornaments';

const SECTIONS = [
  { id: 'sd-firsts', label: 'Firsts' },
  { id: 'sd-plan', label: 'Party plan' },
  { id: 'sd-place', label: 'Where' },
  { id: 'sd-notes', label: 'Notes' },
] as const;

export const SiteNav = ({ title }: { title: string }) => (
  <nav className="sticky top-0 z-30 bg-(--sd-bg)/85 shadow-[0_1px_0_var(--sd-frost)] backdrop-blur-md">
    <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-5">
      <button
        type="button"
        onClick={() => scrollToSection('sd-home')}
        className={cn(
          DISPLAY,
          'flex min-w-0 items-center gap-2 font-semibold text-(--sd-primary) text-lg',
        )}
      >
        <SnowflakeMark className="size-5 shrink-0" />
        <span className="truncate">{title}</span>
      </button>
      <div className="flex items-center gap-5">
        <ul className="hidden items-center gap-5 @3xl:flex">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  LABEL,
                  'text-(--sd-muted) text-[11px] transition hover:text-(--sd-primary)',
                )}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => scrollToSection('sd-rsvp')}
          className={cn(
            LABEL,
            'shrink-0 rounded-full bg-(--sd-primary) px-4 py-2 text-[11px] text-white transition hover:brightness-110',
          )}
        >
          RSVP
        </button>
      </div>
    </div>
  </nav>
);
