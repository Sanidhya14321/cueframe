'use client';

import { cn } from '@/lib/utils';
import { describeEventDate } from '@/sites/event-date';
import type { EmeraldRoseContent } from '@/sites/templates/weddings/emerald-rose';
import { Reveal } from '../../kit/reveal';
import { scrollToSection } from '../../kit/scroll-to-section';
import { SitePhoto } from '../../kit/site-photo';
import { ordinalDay } from './date-words';
import { BODY, DISPLAY, LABEL } from './fonts';
import { BUTTON } from './links';
import { RoseSprig } from './ornaments';

export const Hero = ({ content }: { content: EmeraldRoseContent }) => {
  const { couple, event, photos } = content;
  const when = describeEventDate(event.startsAt);
  return (
    <section id="er-invitation" className="relative scroll-mt-16 overflow-hidden px-5 pt-10 pb-20">
      <div className="mx-auto grid max-w-6xl items-center gap-14 @3xl:grid-cols-[1.15fr_0.85fr] @3xl:gap-16 @3xl:pt-8">
        <Reveal className="relative mx-auto w-full max-w-[22rem] @3xl:order-2 @3xl:max-w-none">
          <div className="absolute inset-0 translate-x-3 translate-y-3 bg-(--er-secondary) @3xl:translate-x-5 @3xl:translate-y-5" />
          <div className="relative aspect-[4/5] overflow-hidden bg-(--er-primary)/15">
            <SitePhoto
              src={photos.hero}
              alt={`${couple.firstName} and ${couple.secondName}`}
              className="size-full"
            />
            <div className="absolute inset-3 border border-(--er-bg)/70" />
          </div>
          <RoseSprig className="-left-5 -bottom-10 absolute w-20 text-(--er-accent) @3xl:-left-16 @3xl:w-32" />
        </Reveal>
        <Reveal delay={150} className="@3xl:order-1">
          <span className={cn(LABEL, 'text-(--er-secondary) text-[10px]')}>{couple.greeting}</span>
          <h1 className="mt-5">
            <span
              className={cn(
                DISPLAY,
                'block break-words text-6xl italic leading-[0.95] @md:text-7xl @3xl:text-8xl',
              )}
            >
              {couple.firstName}
            </span>
            <span className="my-3 flex items-center gap-4 @3xl:my-4">
              <span className="h-px w-10 bg-(--er-accent)" />
              <span className={cn(LABEL, 'text-(--er-accent) text-[11px]')}>and</span>
              <span className="h-px flex-1 bg-(--er-accent)" />
            </span>
            <span
              className={cn(
                DISPLAY,
                'block break-words pl-10 text-6xl italic leading-[0.95] @md:text-7xl @3xl:pl-24 @3xl:text-8xl',
              )}
            >
              {couple.secondName}
            </span>
          </h1>
          {when === null ? null : (
            <p className={cn(DISPLAY, 'mt-10 text-2xl leading-snug @3xl:text-3xl')}>
              {when.weekday}, the {ordinalDay(when.day)} of {when.month}
              <span className={cn(LABEL, 'mt-2 block text-(--er-muted) text-[11px]')}>
                {when.year} &middot; at {when.time}
              </span>
            </p>
          )}
          <div className="mt-6 border-(--er-accent)/50 border-l-2 pl-4">
            <span className={cn(LABEL, 'block text-[11px]')}>{event.venue}</span>
            <span className={cn(BODY, 'text-(--er-muted) text-lg italic')}>{event.address}</span>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <button
              type="button"
              onClick={() => scrollToSection('er-rsvp')}
              className={cn(BUTTON, 'bg-(--er-primary) text-(--er-bg)')}
            >
              Reply by {event.rsvpBy}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('er-story')}
              className={cn(
                LABEL,
                'border-(--er-text)/40 border-b pb-1 text-[11px] hover:border-(--er-text)',
              )}
            >
              Read our story
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export const NameRibbon = ({ content }: { content: EmeraldRoseContent }) => {
  const { couple, event } = content;
  const when = describeEventDate(event.startsAt);
  const phrases = [
    `${couple.firstName} & ${couple.secondName}`,
    when === null ? '' : `${when.month} ${when.day}, ${when.year}`,
    event.venue,
  ].filter((phrase) => phrase !== '');
  const run = Array.from({ length: 4 }, () => phrases).flat();
  return (
    <div aria-hidden className="overflow-hidden bg-(--er-primary) py-4 text-(--er-bg)">
      <style>
        {'@keyframes er-ribbon{from{transform:translateX(0)}to{transform:translateX(-50%)}}'}
      </style>
      <div className="flex w-max animate-[er-ribbon_40s_linear_infinite] motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {run.map((phrase, index) => (
              <span key={`${copy}-${index}`} className="flex items-center">
                <span className={cn(DISPLAY, 'whitespace-nowrap px-6 text-xl italic')}>
                  {phrase}
                </span>
                <span className="size-1.5 rotate-45 bg-(--er-accent)" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
