'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { PumpkinPatchContent } from '@/sites/templates/baby-showers/pumpkin-patch';
import type { SiteIntroProps } from '../../site-view';
import { FallingLeaves } from './falling-leaves';
import { DISPLAY, HAND, LABEL } from './fonts';
import { Bow, LeafIcon, MAPLE, OVAL_LEAF, Pumpkin } from './ornaments';

type Phase = 'closed' | 'untie' | 'lid' | 'reveal' | 'leaving';

const NEXT: Record<Phase, { phase: Phase | 'done'; after: number } | null> = {
  closed: null,
  untie: { phase: 'lid', after: 650 },
  lid: { phase: 'reveal', after: 550 },
  reveal: { phase: 'leaving', after: 1000 },
  leaving: { phase: 'done', after: 600 },
};

const ORDER: readonly Phase[] = ['closed', 'untie', 'lid', 'reveal', 'leaving'];

const BURST = [
  { x: -120, y: -70, turn: -40, shape: MAPLE, fill: 'var(--pp-primary)' },
  { x: 120, y: -80, turn: 50, shape: OVAL_LEAF, fill: 'var(--pp-secondary)' },
  { x: -90, y: -140, turn: 20, shape: OVAL_LEAF, fill: 'var(--pp-secondary)' },
  { x: 96, y: -150, turn: -30, shape: MAPLE, fill: 'var(--pp-kraft-deep)' },
  { x: -10, y: -170, turn: 70, shape: MAPLE, fill: 'var(--pp-accent)' },
  { x: 150, y: -10, turn: 15, shape: MAPLE, fill: 'var(--pp-primary)' },
  { x: -150, y: -20, turn: -60, shape: OVAL_LEAF, fill: 'var(--pp-kraft-deep)' },
];

export const GiftBoxIntro = ({
  content,
  position,
  onOpened,
}: SiteIntroProps<PumpkinPatchContent>) => {
  const [phase, setPhase] = useState<Phase>('closed');
  const { family, intro } = content;

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

  const reached = (target: Phase) => ORDER.indexOf(phase) >= ORDER.indexOf(target);
  const untied = reached('untie');
  const lidOff = reached('lid');
  const revealed = reached('reveal');

  return (
    <div
      className={cn(
        position,
        'inset-0 z-40 flex flex-col items-center justify-center gap-6 overflow-hidden bg-(--pp-bg) px-6 text-(--pp-text) transition-opacity duration-500',
        phase === 'leaving' && 'opacity-0',
      )}
    >
      <FallingLeaves className="opacity-60" />
      <div className="relative flex flex-col items-center text-center">
        <span className={cn(LABEL, 'text-(--pp-muted) text-[11px]')}>A baby shower for</span>
        <span className={cn(DISPLAY, 'mt-2 text-4xl leading-tight')}>
          {family.parentOne} &amp; {family.parentTwo}
        </span>
      </div>
      <button
        type="button"
        aria-label={intro.prompt}
        onClick={() => setPhase('untie')}
        disabled={untied}
        className="group relative mt-6 aspect-square w-[min(72%,280px)] cursor-pointer focus-visible:outline-none"
      >
        {BURST.map((leaf) => (
          <span
            key={`${leaf.x}-${leaf.y}`}
            className="absolute top-[40%] left-1/2 size-7 transition-[translate,rotate,opacity] duration-1000 ease-out"
            style={{
              translate: revealed ? `calc(-50% + ${leaf.x}px) ${leaf.y}px` : '-50% 0',
              rotate: revealed ? `${leaf.turn * 3}deg` : '0deg',
              opacity: revealed ? 0.9 : 0,
            }}
          >
            <LeafIcon shape={leaf.shape} fill={leaf.fill} className="size-full" />
          </span>
        ))}
        <span
          className={cn(
            'absolute bottom-[8%] left-1/2 w-[58%] -translate-x-1/2 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
            revealed ? '-translate-y-[72%]' : 'translate-y-0',
          )}
        >
          <Pumpkin className="w-full" />
        </span>
        <span className="absolute inset-x-[8%] bottom-0 h-[62%] overflow-hidden rounded-t-sm rounded-b-2xl bg-(--pp-kraft) shadow-[0_26px_40px_-24px_rgba(60,30,10,0.7)]">
          <span className="absolute inset-x-0 top-0 h-3 bg-black/10" />
          <span
            className={cn(
              'absolute inset-y-0 left-1/2 w-[15%] origin-bottom -translate-x-1/2 bg-(--pp-accent) transition-[scale,opacity] duration-500 ease-in',
              untied && 'scale-y-0 opacity-0',
            )}
          />
          <span
            className={cn(
              'absolute inset-x-0 top-[44%] h-[13%] bg-(--pp-accent) transition-[scale,opacity] duration-500 ease-in',
              untied && 'scale-x-0 opacity-0',
            )}
          />
        </span>
        <span
          className={cn(
            'absolute inset-x-[3%] top-[27%] h-[14%] rounded-lg bg-(--pp-kraft-deep) shadow-md transition-[translate,rotate,opacity] duration-600 ease-in',
            lidOff && '-translate-x-[30%] -translate-y-[260%] -rotate-[28deg] opacity-0',
          )}
        >
          <span
            className={cn(
              'absolute inset-y-0 left-1/2 w-[14%] -translate-x-1/2 bg-(--pp-accent) transition-opacity duration-300',
              untied && 'opacity-0',
            )}
          />
        </span>
        <span
          className={cn(
            'absolute bottom-[70%] left-1/2 w-[62%] -translate-x-1/2 transition-[translate,scale,rotate,opacity] duration-600 ease-in group-hover:scale-105',
            untied && '-translate-y-24 scale-x-25 rotate-12 opacity-0',
          )}
        >
          <Bow className="w-full drop-shadow-md" />
        </span>
      </button>
      <div className="relative grid min-h-20 w-full max-w-md place-items-center text-center">
        <span
          className={cn(
            LABEL,
            'col-start-1 row-start-1 text-(--pp-muted) text-xs transition-opacity',
            untied ? 'opacity-0' : 'animate-pulse',
          )}
        >
          {intro.prompt}
        </span>
        <span
          className={cn(
            HAND,
            'col-start-1 row-start-1 text-balance font-bold text-(--pp-primary) text-4xl leading-none transition-opacity duration-500',
            revealed ? 'opacity-100' : 'opacity-0',
          )}
        >
          {family.headline}
        </span>
      </div>
    </div>
  );
};
