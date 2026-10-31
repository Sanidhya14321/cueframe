'use client';

import { CalendarPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MidnightCrownContent } from '@/sites/templates/quinceaneras/midnight-crown';
import { downloadEventCalendar } from '../../kit/calendar-download';
import { Reveal } from '../../kit/reveal';
import { COUNTDOWN_UNITS, useCountdown } from '../../kit/use-countdown';
import { DECO, DISPLAY, FOIL } from './fonts';
import { SectionTitle } from './ornaments';

const downloadCalendar = (content: MidnightCrownContent): void => {
  const { celebrant, mass } = content;
  downloadEventCalendar({
    title: `${celebrant.firstName}'s quinceañera`,
    startsAt: content.event.startsAt,
    hours: 8,
    location: `${mass.place}, ${mass.address}`,
  });
};

export const Countdown = ({ content }: { content: MidnightCrownContent }) => {
  const parts = useCountdown(content.event.startsAt);
  return (
    <section className="px-5 py-20">
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-10 text-center">
        <SectionTitle kicker="Faltan" title="Until the first waltz" />
        <div className="grid w-full max-w-xl grid-cols-4 gap-2 @md:gap-4">
          {COUNTDOWN_UNITS.map((unit) => (
            <div
              key={unit.key}
              className="flex flex-col items-center gap-2 rounded-t-full border border-(--mc-gold)/60 bg-(--mc-surface)/60 px-1 pt-7 pb-4 @md:pt-10"
            >
              <span
                className={cn(DISPLAY, FOIL, 'text-3xl tabular-nums leading-none @md:text-5xl')}
              >
                {parts === null ? '--' : String(parts[unit.key]).padStart(2, '0')}
              </span>
              <span
                className={cn(
                  DECO,
                  'text-(--mc-muted) text-[9px] tracking-[0.2em] @md:text-[10px]',
                )}
              >
                {unit.label}
              </span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => downloadCalendar(content)}
          className={cn(
            DECO,
            'flex items-center gap-2 bg-(image:--mc-foil) bg-[length:220%_100%] px-7 py-3 text-(--mc-bg) text-xs transition-[background-position] duration-700 hover:bg-right',
          )}
        >
          <CalendarPlus className="size-4" />
          Add to calendar
        </button>
      </Reveal>
    </section>
  );
};
