'use client';

import { CalendarPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { describeEventDate } from '@/sites/event-date';
import type { PumpkinPatchContent } from '@/sites/templates/baby-showers/pumpkin-patch';
import { Reveal } from '../../kit/reveal';
import { scrollToSection } from '../../kit/scroll-to-section';
import { SitePhoto } from '../../kit/site-photo';
import { addShowerToCalendar } from './add-to-calendar';
import { FallingLeaves } from './falling-leaves';
import { BODY, DISPLAY, HAND, LABEL } from './fonts';
import { Bow, PumpkinTrio, Vine } from './ornaments';
import { PILL, PILL_OUTLINE, PILL_SOLID } from './pill';

const DueTag = ({ text }: { text: string }) => (
  <div className="mt-5 flex items-center">
    <span className="h-0.5 w-10 rounded-full bg-(--pp-kraft-deep)/60" />
    <span className="relative -rotate-2 bg-(--pp-accent-soft) py-1 pr-5 pl-8 text-(--pp-accent-deep) [clip-path:polygon(16px_0,100%_0,100%_100%,16px_100%,0_50%)]">
      <span className="absolute top-1/2 left-3.5 size-2 -translate-y-1/2 rounded-full bg-(--pp-bg)" />
      <span className={cn(HAND, 'font-bold text-2xl')}>{text}</span>
    </span>
  </div>
);

const CalendarLeaf = ({ startsAt }: { startsAt: string }) => {
  const when = describeEventDate(startsAt);
  if (when === null) {
    return null;
  }
  return (
    <div className="flex items-center gap-4">
      <div className="w-24 shrink-0 overflow-hidden rounded-2xl bg-(--pp-card) text-center shadow-[0_14px_28px_-18px_rgba(60,30,10,0.6)] ring-1 ring-(--pp-oat-deep)">
        <div className={cn(LABEL, 'bg-(--pp-primary) py-1.5 text-(--pp-card) text-[10px]')}>
          {when.month}
        </div>
        <div className={cn(DISPLAY, 'pt-2 text-5xl leading-none')}>{when.day}</div>
        <div className={cn(LABEL, 'pt-1 pb-2 text-(--pp-muted) text-[9px]')}>{when.year}</div>
      </div>
      <span className={cn(DISPLAY, 'text-2xl leading-snug')}>
        {when.weekday}
        <br />
        <span className="text-(--pp-primary) italic">at {when.time}</span>
      </span>
    </div>
  );
};

export const Hero = ({ content }: { content: PumpkinPatchContent }) => {
  const { family, event, photos } = content;
  return (
    <section
      id="pp-home"
      className="relative scroll-mt-16 overflow-hidden px-5 pt-10 pb-24 @3xl:pt-16"
    >
      <FallingLeaves />
      <Vine className="absolute -top-2 -left-16 w-80 -rotate-6 opacity-80" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 @3xl:grid-cols-[1.15fr_1fr]">
        <Reveal className="flex flex-col items-center text-center @3xl:items-start @3xl:text-left">
          <span className={cn(LABEL, 'text-(--pp-muted) text-[11px]')}>
            You are invited to a baby shower
          </span>
          <h1
            className={cn(
              DISPLAY,
              'mt-4 text-balance text-5xl leading-[1.02] @md:text-6xl @5xl:text-7xl',
            )}
          >
            {family.headline}
          </h1>
          <svg viewBox="0 0 220 16" aria-hidden className="mt-2 w-48 text-(--pp-primary)">
            <path
              d="M4 10 C50 2 110 2 216 8 M30 13 C80 8 140 8 190 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <span className={cn(BODY, 'mt-5 text-(--pp-muted) text-lg')}>honoring</span>
          <span className={cn(HAND, 'font-bold text-(--pp-primary) text-5xl leading-tight')}>
            {family.parentOne} &amp; {family.parentTwo}
          </span>
          <DueTag text={family.dueLine} />
          <div className="mt-8 flex flex-col items-center gap-5 @md:flex-row @md:items-center @md:gap-8">
            <CalendarLeaf startsAt={event.startsAt} />
            <div className={cn(BODY, 'flex flex-col @md:text-left')}>
              <span className="font-extrabold text-lg">{event.venue}</span>
              <span className="text-(--pp-muted)">{event.address}</span>
            </div>
          </div>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => scrollToSection('pp-rsvp')}
              className={cn(PILL, PILL_SOLID)}
            >
              Kindly RSVP
            </button>
            <button
              type="button"
              onClick={() => addShowerToCalendar(content)}
              className={cn(PILL, PILL_OUTLINE)}
            >
              <CalendarPlus className="size-4" />
              Save the date
            </button>
          </div>
        </Reveal>
        <Reveal delay={150} className="relative mx-auto w-full max-w-sm pt-12 @3xl:max-w-md">
          <div className="relative rotate-2 rounded-[2.5rem] bg-(--pp-card) p-3 shadow-[0_30px_60px_-30px_rgba(60,30,10,0.55)]">
            <SitePhoto
              src={photos.hero}
              alt={`${family.parentOne} and ${family.parentTwo}`}
              className="aspect-[4/5] w-full rounded-[2rem]"
              emptyClassName="bg-(--pp-oat)"
            />
            <div className="pointer-events-none absolute inset-6 rounded-[1.6rem] border-2 border-white/60 border-dashed" />
          </div>
          <Bow className="absolute top-0 left-1/2 w-44 -translate-x-1/2 drop-shadow-md" />
          <PumpkinTrio className="absolute -bottom-10 -left-8 h-28 w-48 @3xl:-left-14 @3xl:w-56" />
        </Reveal>
      </div>
    </section>
  );
};
