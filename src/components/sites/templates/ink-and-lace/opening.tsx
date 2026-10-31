'use client';

import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { describeEventDate } from '@/sites/event-date';
import type { InkAndLaceContent } from '@/sites/templates/weddings/ink-and-lace';
import { Reveal } from '../../kit/reveal';
import { scrollToSection } from '../../kit/scroll-to-section';
import { fitSize } from './fit-size';
import { DISPLAY, LABEL, SANS } from './fonts';
import { Rosette } from './lace';
import { Photo } from './photo';

export const Opening = ({ content }: { content: InkAndLaceContent }) => {
  const { couple, issue, event, photos } = content;
  const when = describeEventDate(event.startsAt);
  const longest = Math.max(couple.firstName.length, couple.secondName.length + 2);
  const nameSize = `min(${fitSize(longest, 19, 168)}cqw, 10.5rem)`;
  return (
    <header id="il-cover" className="scroll-mt-14 px-5 pt-6 pb-16 @3xl:px-10 @3xl:pb-24">
      <div className="mx-auto max-w-6xl">
        <div
          className={cn(
            LABEL,
            'grid grid-cols-2 gap-2 border-current/30 border-y py-2.5 @3xl:grid-cols-3',
          )}
        >
          <span>
            {issue.volume} / {issue.number}
          </span>
          <span className="hidden text-center @3xl:block">The {issue.masthead} issue</span>
          {when === null ? null : (
            <span className="text-right">
              {when.month} {when.day}, {when.year}
            </span>
          )}
        </div>
        <Reveal>
          <h1
            className={cn(
              DISPLAY,
              'mt-6 flex flex-col leading-[0.86] tracking-[-0.035em] [font-variation-settings:"opsz"_96] @3xl:mt-10',
            )}
            style={{ fontSize: nameSize }}
          >
            <span>{couple.firstName}</span>
            <span className="flex items-baseline justify-end gap-[0.12em]">
              <span className="text-(--il-accent) text-[0.62em] italic">&amp;</span>
              <span>{couple.secondName}</span>
            </span>
          </h1>
        </Reveal>
        <div className="mt-8 grid gap-10 @3xl:mt-14 @3xl:grid-cols-12 @3xl:gap-12">
          <Reveal className="@3xl:col-span-7">
            <figure>
              <Photo
                src={photos.hero}
                alt={`${couple.firstName} and ${couple.secondName}`}
                className="aspect-[4/5] w-full"
              />
              <figcaption
                className={cn(
                  LABEL,
                  'mt-3 flex justify-between gap-6 text-(--il-muted) text-[9px]',
                )}
              >
                <span className="shrink-0">Fig. 01</span>
                <span className="text-right">
                  {couple.firstName} &amp; {couple.secondName}, photographed for this issue
                </span>
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={150} className="flex flex-col gap-8 @3xl:col-span-5 @3xl:pt-4">
            <p
              className={cn(
                DISPLAY,
                'text-3xl italic leading-[1.15] @3xl:text-[2.6rem] @3xl:leading-[1.1]',
              )}
            >
              {issue.coverLine}
            </p>
            {when === null ? null : (
              <div className="flex items-stretch gap-5 border-current/25 border-y py-5">
                <span
                  className={cn(
                    DISPLAY,
                    'text-[6.5rem] leading-[0.8] tracking-tight [font-variation-settings:"opsz"_96]',
                  )}
                >
                  {when.day}
                </span>
                <span className="flex flex-col justify-between border-current/25 border-l pl-5">
                  <span className={cn(DISPLAY, 'text-2xl italic')}>{when.month}</span>
                  <span className={cn(LABEL)}>
                    {when.weekday}, {when.year}
                  </span>
                  <span className={cn(LABEL, 'text-(--il-accent)')}>at {when.time}</span>
                </span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className={cn(LABEL, 'text-(--il-muted)')}>The venue</span>
              <span className={cn(DISPLAY, 'text-2xl')}>{event.venue}</span>
              <span className={cn(SANS, 'text-(--il-muted) text-sm')}>{event.address}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => scrollToSection('il-rsvp')}
                className={cn(
                  LABEL,
                  'flex items-center gap-3 bg-(--il-ink) px-6 py-3.5 text-(--il-paper) transition hover:bg-(--il-accent)',
                )}
              >
                RSVP by {event.rsvpBy}
                <ArrowDown className="size-3.5" />
              </button>
              <Rosette className="hidden size-16 text-(--il-accent) @md:block" />
            </div>
          </Reveal>
        </div>
      </div>
    </header>
  );
};
