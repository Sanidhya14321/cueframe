import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { describeEventDate } from '@/sites/event-date';
import type { InkAndLaceContent } from '@/sites/templates/weddings/ink-and-lace';
import { Reveal } from '../../kit/reveal';
import { DISPLAY, LABEL, SANS } from './fonts';
import type { IssueSection } from './issue-sections';
import { Barcode, LaceBand, LaceFrame } from './lace';
import { Photo } from './photo';

export const Reply = ({
  content,
  section,
}: {
  content: InkAndLaceContent;
  section: IssueSection;
}) => {
  const { couple, event, rsvp, photos } = content;
  return (
    <section
      id={section.id}
      className="relative scroll-mt-14 overflow-hidden bg-(--il-ink) text-(--il-paper)"
    >
      <Photo src={photos.closing} alt="" className="absolute inset-0 size-full opacity-30" />
      <div className="absolute inset-0 bg-linear-to-b from-(--il-ink) via-(--il-ink)/40 to-(--il-ink)" />
      <LaceBand className="relative h-7 w-full text-(--il-on-ink-muted)" />
      <div className="relative flex justify-center px-5 py-20 @3xl:py-28">
        <Reveal className="w-full max-w-md">
          <LaceFrame className="text-(--il-paper)">
            <div className="flex flex-col items-center gap-5 text-center">
              <span className={cn(LABEL, 'text-(--il-accent-on-ink)')}>
                {section.number} / {section.kicker}
              </span>
              <h2
                className={cn(
                  DISPLAY,
                  'text-5xl italic leading-[0.95] [font-variation-settings:"opsz"_96] @md:text-6xl',
                )}
              >
                Kindly respond
              </h2>
              <span className={cn(LABEL, 'text-(--il-on-ink-muted)')}>by {event.rsvpBy}</span>
              <p className={cn(SANS, 'whitespace-pre-line text-sm leading-relaxed opacity-85')}>
                {rsvp.message}
              </p>
              {rsvp.link === '' ? null : (
                <a
                  href={rsvp.link}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    LABEL,
                    'mt-2 inline-flex items-center gap-3 bg-(--il-paper) px-7 py-3.5 text-(--il-ink) transition hover:bg-(--il-accent) hover:text-(--il-paper)',
                  )}
                >
                  {rsvp.buttonLabel}
                  <ArrowUpRight className="size-3.5" />
                </a>
              )}
              <span className={cn(DISPLAY, 'mt-2 text-2xl italic text-(--il-on-ink-muted)')}>
                {couple.monogram}
              </span>
            </div>
          </LaceFrame>
        </Reveal>
      </div>
    </section>
  );
};

export const Colophon = ({ content }: { content: InkAndLaceContent }) => {
  const { couple, issue, colophon, event } = content;
  const when = describeEventDate(event.startsAt);
  return (
    <footer className="bg-(--il-ink) px-5 pb-12 text-(--il-paper) @3xl:px-10">
      <div className="mx-auto grid max-w-6xl gap-8 border-current/20 border-t pt-10 @3xl:grid-cols-12 @3xl:items-end">
        <div className="flex flex-col gap-2 @3xl:col-span-5">
          <span
            className={cn(
              DISPLAY,
              'text-6xl uppercase leading-none tracking-[-0.02em] [font-variation-settings:"opsz"_96]',
            )}
          >
            {issue.masthead}
          </span>
          <span className={cn(LABEL, 'text-(--il-on-ink-muted)')}>
            {issue.volume} / {issue.number}
            {when === null ? '' : ` / ${when.month} ${when.year}`}
          </span>
        </div>
        <div className="flex flex-col gap-2 @3xl:col-span-4">
          <span className={cn(LABEL, 'text-(--il-accent-on-ink)')}>Colophon</span>
          <p className={cn(SANS, 'text-(--il-on-ink-muted) text-sm leading-relaxed')}>
            {colophon.note}
          </p>
        </div>
        <div className="flex items-end justify-between gap-4 @3xl:col-span-3 @3xl:flex-col">
          <span className={cn(DISPLAY, 'text-2xl italic')}>
            {couple.firstName} &amp; {couple.secondName}
          </span>
          <Barcode seed={issue.number} className="h-8 w-24 text-(--il-on-ink-muted)" />
        </div>
      </div>
    </footer>
  );
};
