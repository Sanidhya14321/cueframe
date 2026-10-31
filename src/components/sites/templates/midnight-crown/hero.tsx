'use client';

import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { describeEventDate } from '@/sites/event-date';
import type { MidnightCrownContent } from '@/sites/templates/quinceaneras/midnight-crown';
import { scrollToSection } from '../../kit/scroll-to-section';
import { SitePhoto } from '../../kit/site-photo';
import { BODY, DECO, DISPLAY, FOIL } from './fonts';
import { Crown, DecoRule, Sparkle, Sunburst } from './ornaments';
import { Starfield } from './starfield';

export const ArchPhoto = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => (
  <div className={cn('relative rounded-t-full border border-(--mc-gold) p-2.5', className)}>
    <div className="relative size-full overflow-hidden rounded-t-full border border-(--mc-gold)/50">
      <SitePhoto
        src={src}
        alt={alt}
        className="size-full"
        emptyClassName="bg-linear-to-b from-(--mc-surface) to-(--mc-bg)"
      />
      <div className="absolute inset-0 bg-linear-to-t from-(--mc-bg)/70 via-transparent to-transparent" />
    </div>
  </div>
);

export const Hero = ({ content }: { content: MidnightCrownContent }) => {
  const { celebrant, photos } = content;
  const when = describeEventDate(content.event.startsAt);
  return (
    <section
      id="mc-home"
      className="relative scroll-mt-14 overflow-hidden bg-[linear-gradient(180deg,var(--mc-bg)_0%,var(--mc-surface-deep)_55%,var(--mc-bg)_100%)] px-5 pt-12 pb-16 @3xl:pt-16 @3xl:pb-24"
    >
      <Starfield />
      <div className="relative mx-auto grid max-w-5xl items-center gap-10 @3xl:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] @3xl:gap-16">
        <div className="relative mx-auto w-full max-w-[19rem] @3xl:max-w-sm">
          <Sunburst className="-top-[14%] -translate-x-1/2 absolute left-1/2 w-[135%]" />
          <ArchPhoto
            src={photos.hero}
            alt={celebrant.firstName}
            className="relative aspect-[3/4.2] w-full"
          />
          <span
            className={cn(
              DISPLAY,
              FOIL,
              '-bottom-9 -translate-x-1/2 absolute left-1/2 font-medium text-8xl leading-none drop-shadow-[0_6px_20px_rgba(0,0,0,0.6)] @3xl:text-9xl',
            )}
          >
            {celebrant.years}
          </span>
        </div>
        <div className="flex flex-col items-center pt-6 text-center @3xl:pt-0">
          <Crown className="w-16" />
          <span className={cn(DECO, 'mt-4 text-(--mc-blush) text-sm')}>{celebrant.greeting}</span>
          <h1
            className={cn(
              DISPLAY,
              'mt-3 text-(--mc-text) text-6xl italic leading-[0.95] @md:text-7xl @3xl:text-8xl',
            )}
          >
            {celebrant.firstName}
          </h1>
          <span className={cn(DECO, 'mt-3 text-(--mc-gold) text-base @3xl:text-lg')}>
            {celebrant.lastName}
          </span>
          <DecoRule className="mt-6" />
          <p className={cn(BODY, 'mt-5 max-w-sm text-(--mc-text)/85 text-xl italic leading-snug')}>
            {celebrant.tagline}
          </p>
          {when === null ? null : (
            <div className="mt-8 flex items-stretch gap-4 text-(--mc-text)">
              <span className="flex w-24 flex-col items-center justify-center border-(--mc-gold)/60 border-y py-2">
                <span className={cn(DECO, 'text-[11px]')}>{when.weekday}</span>
              </span>
              <span className="flex flex-col items-center px-1">
                <span className={cn(DECO, 'text-(--mc-gold) text-[11px]')}>{when.month}</span>
                <span className={cn(DISPLAY, FOIL, 'text-5xl leading-none')}>{when.day}</span>
                <span className={cn(DECO, 'text-(--mc-gold) text-[11px]')}>{when.year}</span>
              </span>
              <span className="flex w-24 flex-col items-center justify-center border-(--mc-gold)/60 border-y py-2">
                <span className={cn(DECO, 'text-[11px]')}>{when.time}</span>
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={() => scrollToSection('mc-letter')}
            className={cn(
              DECO,
              'mt-10 flex flex-col items-center gap-1 text-(--mc-muted) text-[10px] hover:text-(--mc-gold)',
            )}
          >
            <Sparkle className="size-3 text-(--mc-gold)" />
            Enter the ballroom
            <ChevronDown className="size-4 animate-bounce motion-reduce:animate-none" />
          </button>
        </div>
      </div>
    </section>
  );
};
