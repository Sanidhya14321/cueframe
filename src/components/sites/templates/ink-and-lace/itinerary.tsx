import { cn } from '@/lib/utils';
import type { InkAndLaceContent } from '@/sites/templates/weddings/ink-and-lace';
import { Reveal } from '../../kit/reveal';
import { DISPLAY, LABEL, SANS } from './fonts';
import type { IssueSection } from './issue-sections';
import { LaceBand } from './lace';
import { SectionHead } from './section-head';

export const Itinerary = ({
  content,
  section,
}: {
  content: InkAndLaceContent;
  section: IssueSection;
}) => (
  <section id={section.id} className="scroll-mt-14 bg-(--il-ink) text-(--il-paper)">
    <LaceBand className="h-7 w-full text-(--il-on-ink-muted)" />
    <div className="mx-auto max-w-6xl px-5 py-16 @3xl:px-10 @3xl:py-24">
      <SectionHead section={section} tone="ink" />
      <ol className="mt-6">
        {content.schedule.map((moment, index) => (
          <li key={index}>
            <Reveal
              delay={index * 60}
              className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-1 border-current/20 border-b py-6 @3xl:grid-cols-12 @3xl:gap-x-8 @3xl:py-8"
            >
              <span
                className={cn(
                  LABEL,
                  'row-span-2 text-(--il-accent-on-ink) @3xl:col-span-1 @3xl:row-span-1',
                )}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span
                className={cn(
                  DISPLAY,
                  'text-4xl tabular-nums leading-none @3xl:col-span-4 @3xl:text-6xl',
                )}
              >
                {moment.time}
              </span>
              <span className="flex flex-col gap-1.5 @3xl:col-span-7">
                <span className={cn(DISPLAY, 'text-2xl italic @3xl:text-3xl')}>{moment.title}</span>
                {moment.note === '' ? null : (
                  <span className={cn(SANS, 'text-(--il-on-ink-muted) text-sm leading-relaxed')}>
                    {moment.note}
                  </span>
                )}
              </span>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
    <LaceBand className="h-7 w-full -scale-y-100 text-(--il-on-ink-muted)" />
  </section>
);
