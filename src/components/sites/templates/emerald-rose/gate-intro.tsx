'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { EmeraldRoseContent } from '@/sites/templates/weddings/emerald-rose';
import type { SiteIntroProps } from '../../site-view';
import { BODY, DISPLAY, LABEL } from './fonts';
import { GardenView, GatePanel, PostCap } from './gate-art';

type Phase = 'closed' | 'unlock' | 'open' | 'enter';

const NEXT: Record<Phase, { phase: Phase | 'done'; after: number } | null> = {
  closed: null,
  unlock: { phase: 'open', after: 450 },
  open: { phase: 'enter', after: 1150 },
  enter: { phase: 'done', after: 800 },
};

const Post = ({ side }: { side: 'left' | 'right' }) => (
  <span
    className={cn(
      'absolute top-[16%] bottom-0 flex w-[9%] flex-col items-center',
      side === 'left' ? 'left-0' : 'right-0',
    )}
  >
    <PostCap className="-mb-px w-[130%]" />
    <span className="w-full flex-1 bg-(--er-primary) shadow-[inset_0_0_0_1px_var(--er-accent)]" />
  </span>
);

export const GateIntro = ({ content, position, onOpened }: SiteIntroProps<EmeraldRoseContent>) => {
  const [phase, setPhase] = useState<Phase>('closed');
  const { couple, intro } = content;

  useEffect(() => {
    const next = NEXT[phase];
    if (next === null) {
      return;
    }
    const timer = setTimeout(() => {
      if (next.phase === 'done') {
        onOpened();
      } else {
        setPhase(next.phase);
      }
    }, next.after);
    return () => clearTimeout(timer);
  }, [phase, onOpened]);

  const started = phase !== 'closed';
  const swung = phase === 'open' || phase === 'enter';

  return (
    <div
      className={cn(
        position,
        '@container inset-0 z-40 flex flex-col items-center justify-center gap-7 overflow-hidden bg-(--er-primary-deep) px-6 text-(--er-bg) transition-opacity duration-700',
        phase === 'enter' && 'opacity-0',
      )}
    >
      <div
        className={cn(
          'flex flex-col items-center text-center transition-[opacity,translate] duration-700',
          swung && '-translate-y-4 opacity-0',
        )}
      >
        <span className={cn(LABEL, 'text-(--er-accent) text-[10px]')}>{couple.greeting}</span>
        <span
          className={cn(
            DISPLAY,
            'mt-4 max-w-full text-balance text-[clamp(1.75rem,10cqi,3rem)] italic leading-tight',
          )}
        >
          {`${couple.firstName} `}
          <span className={cn(BODY, 'text-(--er-accent) text-[0.65em]')}>&amp;</span>
          {` ${couple.secondName}`}
        </span>
      </div>
      <button
        type="button"
        aria-label={intro.prompt}
        onClick={() => setPhase('unlock')}
        disabled={started}
        className={cn(
          'group relative aspect-[5/6] w-[min(78%,340px)] cursor-pointer transition-transform duration-[900ms] ease-in perspective-[1100px] focus-visible:outline-none',
          phase === 'enter' && 'scale-[1.9]',
        )}
      >
        <GardenView className="absolute inset-x-[9%] top-[4%] bottom-0 h-[96%] w-[82%]" />
        <span
          className={cn(
            'absolute top-[4%] bottom-0 left-[9%] w-[41%] origin-left transition-transform duration-[1100ms] ease-in-out transform-3d',
            swung && '-rotate-y-104',
          )}
        >
          <GatePanel className="size-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)]" />
        </span>
        <span
          className={cn(
            'absolute top-[4%] right-[9%] bottom-0 w-[41%] origin-right transition-transform duration-[1100ms] ease-in-out transform-3d',
            swung && 'rotate-y-104',
          )}
        >
          <GatePanel className="-scale-x-100 size-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)]" />
        </span>
        <Post side="left" />
        <Post side="right" />
        <span
          className={cn(
            'absolute top-[47%] left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-(--er-primary-deep) border-2 bg-(--er-accent) shadow-[0_0_0_3px_var(--er-accent),0_10px_24px_-6px_rgba(0,0,0,0.6)] transition-[rotate,opacity,scale] duration-500',
            started ? 'rotate-90 scale-75 opacity-0' : 'group-hover:scale-105',
          )}
        >
          <span className={cn(DISPLAY, 'text-(--er-primary-deep) text-base italic leading-none')}>
            {couple.monogram}
          </span>
        </span>
      </button>
      <span
        className={cn(
          LABEL,
          'animate-pulse text-(--er-bg)/75 text-[11px] transition-opacity',
          started && 'opacity-0',
        )}
      >
        {intro.prompt}
      </span>
    </div>
  );
};
