'use client';

import { CalendarPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SnowDayOneContent } from '@/sites/templates/birthdays/snow-day-one';
import { downloadEventCalendar } from '../../kit/calendar-download';
import { Reveal } from '../../kit/reveal';
import { COUNTDOWN_UNITS, useCountdown } from '../../kit/use-countdown';
import { DISPLAY, LABEL } from './fonts';
import { SectionTitle } from './section-title';
import { Snowfall } from './snowfall';

const downloadCalendar = (content: SnowDayOneContent): void => {
  const { child, event } = content;
  downloadEventCalendar({
    title: `${child.name}'s ${child.ageWord} birthday`,
    startsAt: event.startsAt,
    hours: event.hours,
    location: `${event.venue}, ${event.address}`,
  });
};

export const Countdown = ({ content }: { content: SnowDayOneContent }) => {
  const parts = useCountdown(content.event.startsAt);
  return (
    <section className="relative overflow-hidden px-5 py-16">
      <Snowfall count={14} color="var(--sd-secondary)" />
      <Reveal className="relative mx-auto flex max-w-3xl flex-col items-center gap-8">
        <SectionTitle kicker="almost snow day" title="Counting down" />
        <div className="grid grid-cols-4 gap-2 @md:gap-5">
          {COUNTDOWN_UNITS.map((unit, index) => (
            <div
              key={unit.key}
              className={cn(
                'flex size-[4.6rem] flex-col items-center justify-center rounded-full bg-white shadow-[inset_0_-7px_0_var(--sd-frost),0_14px_26px_-18px_rgba(30,40,110,0.7)] ring-2 ring-(--sd-frost) @md:size-28',
                index % 2 === 1 && 'translate-y-3',
              )}
            >
              <span
                className={cn(
                  DISPLAY,
                  'font-semibold text-(--sd-primary) text-3xl tabular-nums leading-none @md:text-5xl',
                  unit.key === 'seconds' && 'text-(--sd-accent)',
                )}
              >
                {parts === null ? '--' : String(parts[unit.key]).padStart(2, '0')}
              </span>
              <span className={cn(LABEL, 'mt-1 text-(--sd-muted) text-[8px] @md:text-[10px]')}>
                {unit.label}
              </span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => downloadCalendar(content)}
          className={cn(
            LABEL,
            'mt-2 flex items-center gap-2 rounded-full bg-(--sd-primary) px-6 py-3 text-white text-xs shadow-[0_10px_24px_-12px_var(--sd-primary)] transition hover:-translate-y-0.5',
          )}
        >
          <CalendarPlus className="size-4" />
          Add to calendar
        </button>
      </Reveal>
    </section>
  );
};
