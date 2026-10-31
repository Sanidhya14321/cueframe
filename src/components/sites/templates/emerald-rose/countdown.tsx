'use client';

import { CalendarPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EmeraldRoseContent } from '@/sites/templates/weddings/emerald-rose';
import { downloadEventCalendar } from '../../kit/calendar-download';
import { Reveal } from '../../kit/reveal';
import { COUNTDOWN_UNITS, useCountdown } from '../../kit/use-countdown';
import { DISPLAY, LABEL } from './fonts';
import { BUTTON } from './links';

const downloadCalendar = (content: EmeraldRoseContent): void => {
  const { couple, event } = content;
  downloadEventCalendar({
    title: `${couple.firstName} & ${couple.secondName}'s wedding`,
    startsAt: event.startsAt,
    hours: 8,
    location: `${event.venue}, ${event.address}`,
  });
};

export const Countdown = ({ content }: { content: EmeraldRoseContent }) => {
  const parts = useCountdown(content.event.startsAt);
  return (
    <section className="bg-(--er-primary) px-5 py-20 text-(--er-bg)">
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <span className={cn(LABEL, 'text-(--er-accent) text-[10px]')}>Until we say I do</span>
        <div className="mt-8 grid w-full grid-cols-4 divide-x divide-(--er-accent)/40">
          {COUNTDOWN_UNITS.map((unit) => (
            <div key={unit.key} className="flex flex-col items-center px-1">
              <span
                className={cn(
                  DISPLAY,
                  'text-4xl tabular-nums leading-none @md:text-6xl @3xl:text-7xl',
                )}
              >
                {parts === null ? '--' : String(parts[unit.key]).padStart(2, '0')}
              </span>
              <span className={cn(LABEL, 'mt-3 text-(--er-bg)/70 text-[9px] tracking-[0.2em]')}>
                {unit.label}
              </span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => downloadCalendar(content)}
          className={cn(
            BUTTON,
            'mt-12 border border-(--er-accent) text-(--er-accent) hover:bg-(--er-accent) hover:text-(--er-primary-deep)',
          )}
        >
          <CalendarPlus className="size-4" />
          Add to calendar
        </button>
      </Reveal>
    </section>
  );
};
