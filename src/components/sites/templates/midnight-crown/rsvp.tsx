import { cn } from '@/lib/utils';
import { describeEventDate } from '@/sites/event-date';
import type { MidnightCrownContent } from '@/sites/templates/quinceaneras/midnight-crown';
import { Reveal } from '../../kit/reveal';
import { BODY, DECO, DISPLAY, FOIL } from './fonts';
import { CrownMonogram, DecoRule, Sunburst } from './ornaments';
import { Starfield } from './starfield';

export const Rsvp = ({ content }: { content: MidnightCrownContent }) => {
  const { rsvp, event } = content;
  return (
    <section id="mc-rsvp" className="scroll-mt-14 px-5 pt-6 pb-24">
      <Reveal className="mx-auto max-w-xl">
        <div className="rounded-t-full border border-(--mc-gold) p-3">
          <div className="relative flex flex-col items-center gap-5 overflow-hidden rounded-t-full border border-(--mc-gold)/50 bg-[linear-gradient(180deg,var(--mc-surface),var(--mc-surface-deep))] px-6 pt-24 pb-14 text-center @md:px-14 @md:pt-28">
            <Sunburst className="-translate-x-1/2 absolute top-0 left-1/2 w-[110%] opacity-60" />
            <span className={cn(DECO, 'relative text-(--mc-blush) text-xs')}>
              Confirma tu asistencia
            </span>
            <h2 className={cn(DISPLAY, FOIL, 'relative text-6xl italic')}>RSVP</h2>
            {event.rsvpBy === '' ? null : (
              <span className={cn(DECO, 'text-(--mc-text) text-[11px]')}>
                Kindly reply by {event.rsvpBy}
              </span>
            )}
            <DecoRule />
            <p
              className={cn(
                BODY,
                'max-w-sm whitespace-pre-line text-(--mc-text)/90 text-xl leading-relaxed',
              )}
            >
              {rsvp.message}
            </p>
            {rsvp.link === '' ? null : (
              <a
                href={rsvp.link}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  DECO,
                  'mt-3 bg-(image:--mc-foil) bg-[length:220%_100%] px-8 py-3.5 text-(--mc-bg) text-xs shadow-[0_10px_30px_-10px_var(--mc-glow)] transition-[background-position] duration-700 hover:bg-right',
                )}
              >
                {rsvp.buttonLabel}
              </a>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export const Footer = ({ content }: { content: MidnightCrownContent }) => {
  const { celebrant } = content;
  const when = describeEventDate(content.event.startsAt);
  return (
    <footer className="relative flex flex-col items-center gap-3 overflow-hidden border-(--mc-gold)/30 border-t bg-(--mc-surface-deep) px-5 py-16 text-center">
      <Starfield variant="band" />
      <CrownMonogram
        initial={celebrant.initial}
        className="relative w-24"
        letterClassName="text-5xl"
      />
      <span className={cn(DISPLAY, 'relative mt-2 text-(--mc-text) text-3xl italic')}>
        {celebrant.firstName} {celebrant.lastName}
      </span>
      <span className={cn(DECO, 'relative text-(--mc-gold) text-[11px]')}>
        {celebrant.greeting}
        {when === null ? '' : ` · ${when.month} ${when.day}, ${when.year}`}
      </span>
    </footer>
  );
};
