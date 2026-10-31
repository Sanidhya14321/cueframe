import { cn } from '@/lib/utils';
import type { PumpkinPatchContent } from '@/sites/templates/baby-showers/pumpkin-patch';
import { Reveal } from '../../kit/reveal';
import { BODY, DISPLAY, HAND, LABEL } from './fonts';
import { Bow, PumpkinTrio } from './ornaments';
import { PILL_SOLID, PillLink } from './pill';

export const Rsvp = ({ content }: { content: PumpkinPatchContent }) => {
  const { rsvp, event } = content;
  return (
    <section
      id="pp-rsvp"
      className="relative scroll-mt-16 overflow-hidden bg-(--pp-primary) px-5 pt-24 pb-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_85%_90%,rgba(0,0,0,0.18),transparent_50%)]" />
      <Reveal className="relative mx-auto max-w-lg">
        <div className="relative rounded-[2rem] bg-(--pp-card) px-7 pt-16 pb-12 text-center shadow-[0_30px_60px_-30px_rgba(40,15,0,0.7)] @md:px-12">
          <span className="absolute inset-x-0 top-0 mx-auto h-full w-9 bg-(--pp-accent)/25" />
          <Bow className="absolute -top-14 left-1/2 w-48 -translate-x-1/2 drop-shadow-lg" />
          <div className="relative flex flex-col items-center gap-4">
            <span className={cn(HAND, 'text-(--pp-primary) text-3xl')}>will you join us?</span>
            <h2 className={cn(DISPLAY, 'text-5xl leading-none')}>RSVP</h2>
            <span
              className={cn(
                LABEL,
                'rounded-full bg-(--pp-accent-soft) px-4 py-1.5 text-(--pp-accent-deep) text-[10px]',
              )}
            >
              Kindly reply by {event.rsvpBy}
            </span>
            <p className={cn(BODY, 'whitespace-pre-line text-lg leading-relaxed')}>
              {rsvp.message}
            </p>
            {rsvp.link === '' ? null : (
              <PillLink href={rsvp.link} className={cn(PILL_SOLID, 'mt-3 px-9 py-3.5 text-xs')}>
                {rsvp.buttonLabel}
              </PillLink>
            )}
          </div>
        </div>
        <PumpkinTrio className="absolute -right-2 -bottom-10 h-24 w-40 @md:-right-16" />
      </Reveal>
    </section>
  );
};
