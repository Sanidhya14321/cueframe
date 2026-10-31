'use client';

import { cn } from '@/lib/utils';
import type { InkAndLaceContent } from '@/sites/templates/weddings/ink-and-lace';
import { Reveal } from '../../kit/reveal';
import { scrollToSection } from '../../kit/scroll-to-section';
import { DISPLAY, LABEL, SANS } from './fonts';
import type { IssueSection } from './issue-sections';
import { LaceBand } from './lace';
import { Photo } from './photo';

export const Contents = ({
  content,
  sections,
}: {
  content: InkAndLaceContent;
  sections: readonly IssueSection[];
}) => (
  <section id="il-contents" className="scroll-mt-14 bg-(--il-paper-deep)">
    <LaceBand className="h-7 w-full text-(--il-rule)" />
    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 @3xl:grid-cols-12 @3xl:px-10 @3xl:py-24">
      <Reveal className="flex flex-col gap-6 @3xl:col-span-4">
        <span className={cn(LABEL, 'text-(--il-accent)')}>
          {content.issue.volume} / {content.issue.number}
        </span>
        <h2 className={cn(DISPLAY, 'text-6xl italic leading-[0.9] @3xl:text-7xl')}>
          In this issue
        </h2>
        <p className={cn(SANS, 'max-w-xs text-(--il-muted) text-sm leading-relaxed')}>
          {content.issue.coverLine}
        </p>
        <Photo src={content.photos.cover} alt="" className="hidden aspect-[3/4] w-40 @3xl:block" />
      </Reveal>
      <Reveal delay={120} className="@3xl:col-span-8">
        <ol className="flex flex-col">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => scrollToSection(section.id)}
                className="group flex w-full items-baseline gap-4 border-current/20 border-b py-4 text-left @3xl:gap-6 @3xl:py-5"
              >
                <span
                  className={cn(
                    DISPLAY,
                    'w-10 shrink-0 text-(--il-accent) text-2xl @3xl:w-14 @3xl:text-4xl',
                  )}
                >
                  {section.number}
                </span>
                <span className="flex min-w-0 flex-col gap-1">
                  <span
                    className={cn(
                      DISPLAY,
                      'text-2xl leading-tight transition-transform duration-300 group-hover:translate-x-1 @3xl:text-4xl',
                    )}
                  >
                    {section.label}
                  </span>
                  <span className={cn(LABEL, 'text-(--il-muted) text-[9px]')}>
                    {section.kicker}
                  </span>
                </span>
                <span className="mb-2 hidden flex-1 border-current/30 border-b border-dotted @md:block" />
                <span className={cn(LABEL, 'ml-auto shrink-0 text-(--il-muted)')}>
                  p. {section.page}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </Reveal>
    </div>
  </section>
);
