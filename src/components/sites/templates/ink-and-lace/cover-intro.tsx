'use client';

import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { describeEventDate } from '@/sites/event-date';
import type { InkAndLaceContent } from '@/sites/templates/weddings/ink-and-lace';
import type { SiteIntroProps } from '../../site-view';
import { fitSize } from './fit-size';
import { DISPLAY, LABEL, SANS } from './fonts';
import { Barcode } from './lace';
import { Photo } from './photo';

type Phase = 'closed' | 'turning';

const TURN_MS = 1300;

export const CoverIntro = ({ content, position, onOpened }: SiteIntroProps<InkAndLaceContent>) => {
  const [phase, setPhase] = useState<Phase>('closed');
  const { couple, issue, intro, photos, event } = content;
  const when = describeEventDate(event.startsAt);

  useEffect(() => {
    if (phase !== 'turning') {
      return;
    }
    const timer = setTimeout(onOpened, TURN_MS);
    return () => clearTimeout(timer);
  }, [phase, onOpened]);

  const turning = phase === 'turning';

  return (
    <div
      className={cn(
        position,
        '@container inset-0 z-40 overflow-hidden [perspective:2200px] [perspective-origin:0%_50%]',
      )}
    >
      <div
        className={cn(
          'absolute inset-0 origin-left bg-(--il-ink) text-(--il-paper) shadow-[24px_0_60px_-20px_rgba(0,0,0,0.6)] transition-transform duration-[1300ms] ease-[cubic-bezier(0.65,0,0.35,1)] backface-hidden transform-3d',
          turning ? '-rotate-y-100' : 'rotate-y-0',
        )}
      >
        <Photo
          src={photos.cover}
          alt={`${couple.firstName} and ${couple.secondName}`}
          className="absolute inset-0 size-full"
        />
        <div className="absolute inset-0 bg-linear-to-b from-(--il-ink)/70 via-transparent via-40% to-(--il-ink)/85" />
        <div
          className={cn(
            'absolute inset-0 bg-linear-to-r from-transparent to-black/60 opacity-0 transition-opacity duration-[1300ms]',
            turning && 'opacity-100',
          )}
        />
        <div className="relative flex h-full flex-col px-5 pt-5 pb-6 @3xl:px-10 @3xl:pt-8">
          <div
            className={cn(LABEL, 'flex justify-between border-current/40 border-b pb-2 text-[9px]')}
          >
            <span>
              {issue.volume} / {issue.number}
            </span>
            {when === null ? null : (
              <span>
                {when.month} {when.year}
              </span>
            )}
          </div>
          <h2
            className={cn(
              DISPLAY,
              'mt-1 text-center uppercase leading-[0.82] tracking-[-0.02em] [font-variation-settings:"opsz"_96]',
            )}
            style={{ fontSize: `min(${fitSize(issue.masthead.length, 34, 118)}cqw, 16rem)` }}
          >
            {issue.masthead}
          </h2>
          <div className="mt-auto flex items-end justify-between gap-5">
            <div className="flex max-w-[34rem] flex-col gap-3">
              <span className={cn(LABEL, 'text-(--il-accent-on-ink)')}>The wedding of</span>
              <span className={cn(DISPLAY, 'text-5xl italic leading-[0.95] @3xl:text-7xl')}>
                {couple.firstName}
                <span className="text-(--il-accent-on-ink)"> &amp; </span>
                {couple.secondName}
              </span>
              <span className={cn(SANS, 'max-w-sm text-sm leading-relaxed opacity-85')}>
                {issue.coverLine}
              </span>
            </div>
            <div className="hidden shrink-0 flex-col items-center bg-(--il-paper) px-2 pt-2 pb-1 text-(--il-ink) @md:flex">
              <Barcode seed={issue.number} className="h-10 w-24" />
              <span className={cn(SANS, 'mt-1 text-[8px] tracking-[0.3em]')}>
                {issue.number.replace(/\D/g, '').padStart(4, '0')}{' '}
                {event.startsAt.replace(/\D/g, '').slice(0, 8)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPhase('turning')}
            disabled={turning}
            className={cn(
              LABEL,
              'group mt-6 flex items-center justify-center gap-3 border border-current/60 py-3.5 transition hover:bg-(--il-paper) hover:text-(--il-ink) @md:self-start @md:px-8',
            )}
          >
            {intro.prompt}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
        <span
          aria-hidden="true"
          className="absolute right-0 bottom-0 size-10 bg-linear-to-tl from-(--il-paper) from-50% to-(--il-paper-deep) to-50% shadow-[-4px_-4px_10px_rgba(0,0,0,0.35)] [clip-path:polygon(100%_0,100%_100%,0_100%)]"
        />
      </div>
    </div>
  );
};
