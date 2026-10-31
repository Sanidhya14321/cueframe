'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { SnowDayOneContent } from '@/sites/templates/birthdays/snow-day-one';
import type { SiteIntroProps } from '../../site-view';
import { DISPLAY, GIANT_NUMBER, HAND } from './fonts';
import { FrostArt } from './frost-art';
import { Mitten, SnowDrift } from './ornaments';
import { Snowfall, SnowKeyframes } from './snowfall';

type Phase = 'frosted' | 'wiping' | 'clear' | 'leaving';

const STRIPS = 6;
const STRIP_MS = 320;
const STRIP_INDEXES = Array.from({ length: STRIPS }, (_, index) => index);

const percent = (value: number): string => `${Math.round(value * 100) / 100}%`;

const stripClip = (index: number, cleared: boolean): string => {
  if (!cleared) {
    return 'inset(0 0 0 0)';
  }
  return index % 2 === 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)';
};

const wiperPosition = (wiped: number): { left: string; top: string } => {
  const strip = Math.max(0, Math.min(STRIPS - 1, wiped - 1));
  const goingRight = strip % 2 === 0;
  return {
    left: wiped === 0 ? '12%' : goingRight ? '86%' : '14%',
    top: percent(((strip + 0.5) * 100) / STRIPS),
  };
};

const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const FrostIntro = ({ content, position, onOpened }: SiteIntroProps<SnowDayOneContent>) => {
  const [phase, setPhase] = useState<Phase>('frosted');
  const [wiped, setWiped] = useState(0);
  const { child, intro } = content;

  useEffect(() => {
    if (phase === 'frosted') {
      return;
    }
    const reduced = prefersReducedMotion();
    const step = (): void => {
      if (phase === 'wiping') {
        if (wiped < STRIPS) {
          setWiped(wiped + 1);
        } else {
          setPhase('clear');
        }
      } else if (phase === 'clear') {
        setPhase('leaving');
      } else {
        onOpened();
      }
    };
    const wait = phase === 'wiping' ? STRIP_MS : phase === 'clear' ? (reduced ? 400 : 1300) : 700;
    const timer = setTimeout(step, wait);
    return () => clearTimeout(timer);
  }, [phase, wiped, onOpened]);

  const start = (): void => {
    if (prefersReducedMotion()) {
      setWiped(STRIPS);
      setPhase('clear');
      return;
    }
    setPhase('wiping');
  };

  const clear = phase === 'clear' || phase === 'leaving';
  const wiper = wiperPosition(wiped);

  return (
    <div
      className={cn(
        position,
        '@container inset-0 z-40 overflow-hidden bg-linear-to-b from-(--sd-primary) via-(--sd-primary-soft) to-(--sd-frost) transition-[opacity,scale] duration-700 ease-in motion-reduce:transition-none',
        phase === 'leaving' && 'scale-110 opacity-0',
      )}
    >
      <SnowKeyframes />
      <Snowfall count={36} />
      <div
        className={cn(
          'absolute inset-0 flex flex-col items-center justify-center px-8 text-center text-white transition-transform duration-1000 ease-out motion-reduce:transition-none',
          clear ? 'scale-100' : 'scale-90',
        )}
      >
        <span className={cn(HAND, 'text-(--sd-ice) text-2xl @md:text-3xl')}>{child.themeLine}</span>
        <span className={cn(DISPLAY, GIANT_NUMBER, 'mt-4 text-[10rem] @md:text-[14rem]')}>
          {child.age}
        </span>
        <span className={cn(DISPLAY, 'mt-4 font-semibold text-5xl @md:text-6xl')}>
          {child.name}
        </span>
      </div>
      <button
        type="button"
        aria-label={intro.prompt}
        onClick={start}
        disabled={phase !== 'frosted'}
        className="absolute inset-3 cursor-pointer rounded-[2rem] focus-visible:outline-none @md:inset-6 @md:rounded-[2.75rem]"
      >
        <span className="absolute inset-0 overflow-hidden rounded-[inherit]">
          {STRIP_INDEXES.map((index) => (
            <span
              key={index}
              className="absolute inset-x-0 overflow-hidden backdrop-blur-[10px] transition-[clip-path] duration-300 ease-in-out motion-reduce:transition-none"
              style={{
                top: percent((index * 100) / STRIPS),
                height: percent(100 / STRIPS),
                clipPath: stripClip(index, wiped > index),
              }}
            >
              <span
                className="absolute inset-x-0"
                style={{ top: `-${index * 100}%`, height: `${STRIPS * 100}%` }}
              >
                <FrostArt />
              </span>
            </span>
          ))}
        </span>
        <span className="absolute inset-x-0 top-[38%] h-2.5 bg-white shadow-[0_3px_6px_rgba(30,40,110,0.25)] @md:h-3.5" />
        <span className="absolute inset-0 rounded-[inherit] border-[10px] border-white shadow-[inset_0_4px_12px_rgba(30,40,110,0.25),0_18px_40px_-16px_rgba(20,24,70,0.6)] @md:border-[14px]" />
        <SnowDrift fill="white" className="-bottom-1 absolute inset-x-[-4%] h-10 @md:h-14" />
        <span
          className={cn(
            'absolute inset-x-6 top-[50%] flex flex-col items-center gap-3 text-(--sd-primary) transition-opacity duration-300',
            phase !== 'frosted' && 'opacity-0',
          )}
        >
          <Mitten className="w-14 animate-[sd-bob_2.6s_ease-in-out_infinite] text-(--sd-accent) motion-reduce:animate-none" />
          <span className={cn(HAND, 'text-3xl leading-tight @md:text-4xl')}>{intro.prompt}</span>
          <span className={cn(DISPLAY, 'font-medium text-(--sd-primary-deep) text-lg')}>
            {child.name} has a little secret
          </span>
        </span>
        <span
          className={cn(
            '-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute w-16 transition-opacity @md:w-20',
            phase === 'wiping' ? 'opacity-100' : 'opacity-0',
          )}
          style={{
            left: wiper.left,
            top: wiper.top,
            transition: `left ${STRIP_MS}ms ease-in-out, top 140ms ease-out, opacity 300ms`,
          }}
        >
          <Mitten className="w-full rotate-[-20deg] text-(--sd-accent) drop-shadow-lg" />
        </span>
      </button>
    </div>
  );
};
