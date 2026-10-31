'use client';

import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { describeEventDate } from '@/sites/event-date';
import type { SnowDayOneContent } from '@/sites/templates/birthdays/snow-day-one';
import { scrollToSection } from '../../kit/scroll-to-section';
import { SitePhoto } from '../../kit/site-photo';
import { DISPLAY, GIANT_NUMBER, HAND, LABEL } from './fonts';
import { CocoaMug, Mitten, SnowDrift, SnowflakeMark, Sparkle } from './ornaments';
import { Snowfall } from './snowfall';

const DateCard = ({ content }: { content: SnowDayOneContent }) => {
  const when = describeEventDate(content.event.startsAt);
  return (
    <div className="w-full max-w-md rounded-[2rem] bg-white/18 px-5 py-5 ring-1 ring-white/50 backdrop-blur-md">
      {when === null ? null : (
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 text-center">
          <span className={cn(LABEL, 'text-[11px]')}>{when.weekday}</span>
          <SnowflakeMark className="size-4 text-(--sd-highlight)" />
          <span className={cn(DISPLAY, 'font-semibold text-3xl leading-none')}>
            {when.month.slice(0, 3)} {when.day}
          </span>
          <SnowflakeMark className="size-4 text-(--sd-highlight)" />
          <span className={cn(LABEL, 'text-[11px]')}>{when.time}</span>
        </div>
      )}
      <p className="mt-4 text-center text-sm text-white/85">{content.hosts.invitation}</p>
      <p className={cn(DISPLAY, 'text-center font-medium text-xl')}>{content.hosts.names}</p>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-sm text-white/85">
        <MapPin className="size-4 shrink-0 text-(--sd-highlight)" />
        {content.event.venue}
      </p>
    </div>
  );
};

export const Hero = ({ content }: { content: SnowDayOneContent }) => {
  const { child, photos, rsvp } = content;
  return (
    <header
      id="sd-home"
      className="relative scroll-mt-16 overflow-hidden bg-linear-to-b from-(--sd-primary) via-(--sd-primary-soft) to-(--sd-frost) text-white"
    >
      <Snowfall count={42} />
      <div className="relative mx-auto grid max-w-5xl items-center gap-10 px-5 pt-12 pb-28 @3xl:grid-cols-[1.15fr_0.85fr] @3xl:gap-6 @3xl:pt-16 @3xl:pb-36">
        <div className="flex flex-col items-center text-center @3xl:items-start @3xl:text-left">
          <span className={cn(HAND, 'text-(--sd-ice) text-2xl @md:text-3xl')}>
            {child.themeLine}
          </span>
          <div className="relative mt-4 mb-2">
            <span
              className={cn(
                DISPLAY,
                GIANT_NUMBER,
                'block text-[11rem] @md:text-[14rem] @3xl:text-[16rem]',
              )}
            >
              {child.age}
            </span>
            <span
              className={cn(
                DISPLAY,
                '-right-14 absolute top-2 flex size-20 rotate-12 items-center justify-center rounded-full bg-(--sd-highlight) font-semibold text-(--sd-text) text-2xl shadow-lg ring-4 ring-white @md:-right-16 @md:size-24 @md:text-3xl',
              )}
            >
              {child.ageWord}!
            </span>
            <Sparkle className="-left-10 absolute top-8 size-7 animate-[sd-twinkle_2.4s_ease-in-out_infinite] text-(--sd-highlight) motion-reduce:animate-none" />
            <Sparkle className="-left-4 absolute bottom-6 size-4 animate-[sd-twinkle_3s_ease-in-out_infinite] text-white motion-reduce:animate-none" />
          </div>
          <h1 className={cn(DISPLAY, 'font-semibold text-6xl leading-none @md:text-7xl')}>
            {child.name}
          </h1>
          <div className="mt-8 flex w-full justify-center @3xl:justify-start">
            <DateCard content={content} />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3 @3xl:justify-start">
            {rsvp.link === '' ? null : (
              <a
                href={rsvp.link}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  LABEL,
                  'rounded-full bg-(--sd-accent) px-6 py-3 text-white text-xs shadow-[0_10px_24px_-10px_var(--sd-accent-deep)] transition hover:-translate-y-0.5',
                )}
              >
                {rsvp.buttonLabel}
              </a>
            )}
            <button
              type="button"
              onClick={() => scrollToSection('sd-plan')}
              className={cn(
                LABEL,
                'rounded-full bg-white/20 px-6 py-3 text-white text-xs ring-1 ring-white/60 transition hover:bg-white/30',
              )}
            >
              See the plan
            </button>
          </div>
        </div>
        <div className="relative mx-auto w-64 @md:w-72 @3xl:w-full @3xl:max-w-sm">
          <div className="rounded-full bg-white/25 p-3 ring-2 ring-white/60">
            <SitePhoto
              src={photos.hero}
              alt={child.name}
              className="aspect-square w-full rounded-full object-[60%_center] ring-4 ring-white"
              emptyClassName="bg-(--sd-frost)"
            />
          </div>
          <Mitten className="-left-3 absolute top-4 w-14 -rotate-12 animate-[sd-bob_3.4s_ease-in-out_infinite] text-(--sd-accent) motion-reduce:animate-none" />
          <CocoaMug className="-right-2 absolute bottom-2 w-16 rotate-6 drop-shadow-lg" />
          <SnowflakeMark className="absolute top-0 right-6 size-8 text-white/90" />
        </div>
      </div>
      <SnowDrift fill="var(--sd-bg)" className="absolute inset-x-0 bottom-0 h-16 @3xl:h-24" />
    </header>
  );
};
