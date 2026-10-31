'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { MidnightCrownContent } from '@/sites/templates/quinceaneras/midnight-crown';
import type { SiteIntroProps } from '../../site-view';
import { DECO, DISPLAY, FOIL } from './fonts';
import { Crown, CrownMonogram, Sparkle, Sunburst } from './ornaments';
import { MIDNIGHT_KEYFRAMES, Starfield } from './starfield';

type Phase = 'closed' | 'opening' | 'glow' | 'leaving';

const NEXT: Record<Phase, { phase: Phase | 'done'; after: number } | null> = {
  closed: null,
  opening: { phase: 'glow', after: 1500 },
  glow: { phase: 'leaving', after: 1000 },
  leaving: { phase: 'done', after: 800 },
};

const DoorLeaf = ({ side, open }: { side: 'left' | 'right'; open: boolean }) => (
  <span
    className={cn(
      'absolute inset-y-0 w-1/2 bg-linear-to-b from-(--mc-surface) to-(--mc-surface-deep) transition-transform duration-[1400ms] ease-[cubic-bezier(0.65,0,0.35,1)] backface-hidden',
      side === 'left'
        ? 'left-0 origin-left border-(--mc-gold)/50 border-r'
        : 'right-0 origin-right border-(--mc-gold)/50 border-l',
      open && (side === 'left' ? '-rotate-y-[108deg]' : 'rotate-y-[108deg]'),
    )}
  >
    <span className="absolute inset-x-[14%] top-[34%] h-[26%] border border-(--mc-gold)/70">
      <span className="absolute inset-1.5 border border-(--mc-gold)/30" />
    </span>
    <span className="absolute inset-x-[14%] top-[64%] bottom-[6%] border border-(--mc-gold)/70">
      <span className="absolute inset-1.5 border border-(--mc-gold)/30" />
      <span className="absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-(--mc-gold)/70" />
    </span>
    <span
      className={cn(
        'absolute top-[52%] h-[12%] w-1 rounded-full bg-(image:--mc-foil)',
        side === 'left' ? 'right-[7%]' : 'left-[7%]',
      )}
    />
  </span>
);

export const DoorsIntro = ({
  content,
  position,
  onOpened,
}: SiteIntroProps<MidnightCrownContent>) => {
  const [phase, setPhase] = useState<Phase>('closed');
  const { celebrant, intro } = content;

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

  const opened = phase !== 'closed';
  const glowing = phase === 'glow' || phase === 'leaving';

  return (
    <div
      className={cn(
        position,
        'inset-0 z-40 flex flex-col items-center justify-center gap-12 overflow-hidden bg-(--mc-bg) px-6 text-(--mc-text) transition-opacity duration-700',
        phase === 'leaving' && 'opacity-0',
      )}
    >
      <style>{MIDNIGHT_KEYFRAMES}</style>
      <Starfield />
      <div
        className={cn(
          'relative flex flex-col items-center text-center transition-[opacity,translate] duration-700',
          glowing && '-translate-y-4 opacity-0',
        )}
      >
        <span className={cn(DECO, 'text-(--mc-blush) text-xs')}>{celebrant.greeting}</span>
        <span className={cn(DISPLAY, FOIL, 'mt-2 text-5xl italic')}>{celebrant.firstName}</span>
      </div>
      <button
        type="button"
        aria-label={intro.prompt}
        onClick={() => setPhase('opening')}
        disabled={opened}
        className="group relative w-[min(72%,300px)] cursor-pointer focus-visible:outline-none"
      >
        <Sunburst className="-top-[13%] -translate-x-1/2 absolute left-1/2 w-[150%]" />
        <span className="relative block aspect-[3/5] rounded-t-full border-(--mc-gold) border-2 p-2 shadow-[0_0_60px_-10px_var(--mc-glow)]">
          <span className="relative block size-full overflow-hidden rounded-t-full border border-(--mc-gold)/60 perspective-[1100px]">
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,var(--mc-gold-light),var(--mc-glow)_35%,var(--mc-bg)_80%)]" />
            <span
              className={cn(
                'absolute inset-0 flex items-center justify-center transition-[scale,opacity] duration-1000 ease-out',
                glowing ? 'scale-125 opacity-100' : 'scale-75 opacity-60',
              )}
            >
              <Crown className="w-[58%] animate-[mc-float_3s_ease-in-out_infinite] drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)] motion-reduce:animate-none" />
            </span>
            <span className="absolute inset-0 transform-3d">
              <DoorLeaf side="left" open={opened} />
              <DoorLeaf side="right" open={opened} />
            </span>
            <span
              className={cn(
                '-translate-x-1/2 absolute top-[12%] left-1/2 flex w-[46%] justify-center transition-opacity duration-300',
                opened && 'opacity-0',
              )}
            >
              <CrownMonogram
                initial={celebrant.initial}
                className="w-full transition-transform group-hover:scale-105"
                letterClassName="text-4xl"
              />
            </span>
          </span>
        </span>
      </button>
      <span
        className={cn(
          DECO,
          'flex items-center gap-3 text-(--mc-gold) text-xs transition-opacity',
          opened ? 'opacity-0' : 'animate-pulse',
        )}
      >
        <Sparkle className="size-2.5" />
        {intro.prompt}
        <Sparkle className="size-2.5" />
      </span>
    </div>
  );
};
