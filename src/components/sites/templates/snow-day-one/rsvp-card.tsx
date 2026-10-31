import { cn } from '@/lib/utils';
import { describeEventDate } from '@/sites/event-date';
import type { SnowDayOneContent } from '@/sites/templates/birthdays/snow-day-one';
import { Reveal } from '../../kit/reveal';
import { DISPLAY, GIANT_NUMBER, HAND, LABEL } from './fonts';
import { KnitCuff, MittenGarland, SnowDrift, SnowflakeMark } from './ornaments';
import { Snowfall } from './snowfall';

export const RsvpCard = ({ content }: { content: SnowDayOneContent }) => {
  const { rsvp, event, child } = content;
  return (
    <section id="sd-rsvp" className="scroll-mt-16 px-5 pt-6 pb-20">
      <Reveal className="relative mx-auto max-w-xl pt-12">
        <MittenGarland className="absolute inset-x-6 top-0 h-24" />
        <div className="relative overflow-hidden rounded-[2.25rem] bg-(--sd-accent) text-white shadow-[0_30px_60px_-30px_var(--sd-accent-deep)]">
          <KnitCuff className="h-8 bg-(--sd-accent-deep)" />
          <Snowfall count={12} />
          <div className="relative flex flex-col items-center gap-4 px-6 pt-10 pb-12 text-center @md:px-12">
            <span className={cn(HAND, 'text-2xl text-white/90')}>will you come play?</span>
            <h2 className={cn(DISPLAY, 'font-semibold text-5xl leading-none @md:text-6xl')}>
              RSVP
            </h2>
            <span className={cn(LABEL, 'rounded-full bg-white/20 px-4 py-1.5 text-[10px]')}>
              Kindly reply by {event.rsvpBy}
            </span>
            <p className="max-w-md whitespace-pre-line text-lg leading-relaxed">{rsvp.message}</p>
            {rsvp.link === '' ? null : (
              <a
                href={rsvp.link}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  LABEL,
                  'mt-2 rounded-full bg-(--sd-highlight) px-8 py-3.5 text-(--sd-text) text-xs shadow-[0_10px_0_-2px_var(--sd-accent-deep)] transition hover:-translate-y-0.5',
                )}
              >
                {rsvp.buttonLabel}
              </a>
            )}
            <span className={cn(DISPLAY, 'mt-4 text-white/90 text-xl')}>
              {child.name} turns {child.ageWord}
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export const Footer = ({ content }: { content: SnowDayOneContent }) => {
  const { child, hosts, event } = content;
  const when = describeEventDate(event.startsAt);
  return (
    <footer className="relative overflow-hidden bg-(--sd-primary) text-white">
      <SnowDrift fill="var(--sd-bg)" className="h-12 rotate-180" />
      <Snowfall count={16} />
      <div className="relative flex flex-col items-center gap-2 px-5 pt-6 pb-14 text-center">
        <span className={cn(DISPLAY, GIANT_NUMBER, 'text-8xl')}>{child.age}</span>
        <span className={cn(DISPLAY, 'mt-3 font-semibold text-3xl')}>
          {child.name} turns {child.ageWord}
        </span>
        {when === null ? null : (
          <span className={cn(LABEL, 'flex items-center gap-2 text-(--sd-highlight) text-xs')}>
            <SnowflakeMark className="size-3.5" />
            {when.month} {when.day}, {when.year}
            <SnowflakeMark className="size-3.5" />
          </span>
        )}
        <span className={cn(HAND, 'mt-2 text-white/85 text-xl')}>with love, {hosts.names}</span>
      </div>
    </footer>
  );
};
