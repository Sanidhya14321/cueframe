'use client';

import { CalendarPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CountdownParts } from '@/sites/event-date';
import type { PumpkinPatchContent } from '@/sites/templates/baby-showers/pumpkin-patch';
import { Reveal } from '../../kit/reveal';
import { COUNTDOWN_UNITS, useCountdown } from '../../kit/use-countdown';
import { addShowerToCalendar } from './add-to-calendar';
import { DISPLAY, HAND, LABEL } from './fonts';
import { GINGHAM, Pumpkin, type PumpkinTone } from './ornaments';
import { PILL, PILL_SOLID } from './pill';

const UNIT_STYLE: Record<keyof CountdownParts, { tone: PumpkinTone; ink: string }> = {
  days: { tone: 'primary', ink: 'text-(--pp-card)' },
  hours: { tone: 'cream', ink: 'text-(--pp-text)' },
  minutes: { tone: 'sage', ink: 'text-(--pp-card)' },
  seconds: { tone: 'accent', ink: 'text-(--pp-card)' },
};

export const Countdown = ({ content }: { content: PumpkinPatchContent }) => {
  const parts = useCountdown(content.event.startsAt);
  return (
    <section className={cn('px-5 py-20', GINGHAM)}>
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center rounded-[2.5rem] bg-(--pp-bg) px-5 py-12 text-center shadow-[0_24px_48px_-36px_rgba(60,30,10,0.7)] @md:px-10">
        <span className={cn(HAND, 'text-(--pp-primary) text-3xl')}>only a few more sleeps</span>
        <h2 className={cn(DISPLAY, 'text-4xl @md:text-5xl')}>Counting down</h2>
        <div className="mt-9 grid w-full max-w-xl grid-cols-4 gap-1.5 @md:gap-4">
          {COUNTDOWN_UNITS.map((unit, index) => {
            const style = UNIT_STYLE[unit.key];
            return (
              <div key={unit.key} className="flex flex-col items-center gap-2">
                <div
                  className="relative w-full motion-safe:animate-[pp-bob_4s_ease-in-out_infinite]"
                  style={{ animationDelay: `${index * 400}ms` }}
                >
                  <Pumpkin tone={style.tone} leaf={index % 2 === 0} className="w-full" />
                  <span
                    className={cn(
                      DISPLAY,
                      'absolute inset-x-0 top-[42%] text-center font-semibold text-2xl tabular-nums leading-none @md:text-4xl',
                      style.ink,
                    )}
                  >
                    {parts === null ? '--' : String(parts[unit.key]).padStart(2, '0')}
                  </span>
                </div>
                <span className={cn(LABEL, 'text-(--pp-muted) text-[9px] @md:text-[10px]')}>
                  {unit.label}
                </span>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => addShowerToCalendar(content)}
          className={cn(PILL, PILL_SOLID, 'mt-10')}
        >
          <CalendarPlus className="size-4" />
          Add to calendar
        </button>
      </Reveal>
    </section>
  );
};
