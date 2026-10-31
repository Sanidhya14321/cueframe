'use client';

import { CalendarPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { describeEventDate } from '@/sites/event-date';
import type { InkAndLaceContent } from '@/sites/templates/weddings/ink-and-lace';
import { downloadEventCalendar } from '../../kit/calendar-download';
import { Reveal } from '../../kit/reveal';
import { COUNTDOWN_UNITS, useCountdown } from '../../kit/use-countdown';
import { DISPLAY, LABEL, SANS } from './fonts';
import type { IssueSection } from './issue-sections';
import { monthGrid, ordinal, WEEKDAY_INITIALS } from './month-grid';
import { SectionHead } from './section-head';

const downloadCalendar = (content: InkAndLaceContent): void => {
  const { couple, event } = content;
  downloadEventCalendar({
    title: `${couple.firstName} & ${couple.secondName}'s wedding`,
    startsAt: event.startsAt,
    hours: 8,
    location: `${event.venue}, ${event.address}`,
  });
};

const Ring = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 60 50"
    className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[150%] w-[170%] text-(--il-accent)"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
  >
    <path d="M44 7 C30 1 8 6 5 22 C2 38 22 47 38 44 C54 41 59 26 52 15 C47 8 36 5 27 6" />
  </svg>
);

export const TheDate = ({
  content,
  section,
}: {
  content: InkAndLaceContent;
  section: IssueSection;
}) => {
  const when = describeEventDate(content.event.startsAt);
  const parts = useCountdown(content.event.startsAt);
  const cells = when === null ? [] : monthGrid(when.date);
  const eventDay = when === null ? null : when.date.getDate();
  return (
    <section
      id={section.id}
      className="scroll-mt-14 bg-(--il-paper-deep) px-5 py-16 @3xl:px-10 @3xl:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHead section={section} />
        <div className="mt-10 grid gap-14 @3xl:mt-14 @3xl:grid-cols-2 @3xl:gap-16">
          <Reveal className="border border-current/25 bg-(--il-paper) p-6 @md:p-8">
            {when === null ? null : (
              <div className="flex items-baseline justify-between border-current/25 border-b pb-4">
                <span className={cn(DISPLAY, 'text-4xl italic')}>{when.month}</span>
                <span className={cn(LABEL, 'text-(--il-muted)')}>{when.year}</span>
              </div>
            )}
            <div className="mt-5 grid grid-cols-7 gap-y-3 text-center">
              {WEEKDAY_INITIALS.map((initial, index) => (
                <span key={index} className={cn(LABEL, 'text-(--il-muted) text-[9px]')}>
                  {initial}
                </span>
              ))}
              {cells.map((cell) => (
                <span
                  key={cell.key}
                  className={cn(
                    DISPLAY,
                    'relative py-1 text-lg tabular-nums @md:text-xl',
                    cell.day === eventDay && 'font-semibold text-(--il-accent)',
                  )}
                >
                  {cell.day}
                  {cell.day !== null && cell.day === eventDay ? <Ring /> : null}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={150} className="flex flex-col justify-center gap-8">
            {when === null ? null : (
              <p className={cn(DISPLAY, 'text-3xl italic leading-tight @3xl:text-4xl')}>
                {when.weekday}, the {ordinal(when.date.getDate())} of {when.month}, at {when.time}.
              </p>
            )}
            <div className="grid grid-cols-4 border-current/25 border-y">
              {COUNTDOWN_UNITS.map((unit, index) => (
                <div
                  key={unit.key}
                  className={cn(
                    'flex flex-col gap-2 py-5',
                    index === 0 ? 'pr-2' : 'border-current/25 border-l pl-3 @md:pl-5',
                  )}
                >
                  <span
                    className={cn(
                      DISPLAY,
                      'text-4xl tabular-nums leading-none @md:text-5xl',
                      unit.key === 'seconds' && 'text-(--il-accent)',
                    )}
                  >
                    {parts === null ? '--' : String(parts[unit.key]).padStart(2, '0')}
                  </span>
                  <span className={cn(LABEL, 'text-(--il-muted) text-[8px] @md:text-[9px]')}>
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 @md:flex-row @md:items-center @md:gap-6">
              <button
                type="button"
                onClick={() => downloadCalendar(content)}
                className={cn(
                  LABEL,
                  'flex items-center justify-center gap-3 bg-(--il-ink) px-6 py-3.5 text-(--il-paper) transition hover:bg-(--il-accent)',
                )}
              >
                <CalendarPlus className="size-4" />
                Add to calendar
              </button>
              <span className={cn(SANS, 'text-(--il-muted) text-sm')}>
                Kindly reply by {content.event.rsvpBy}
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
