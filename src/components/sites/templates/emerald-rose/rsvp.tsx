import { cn } from '@/lib/utils';
import type { EmeraldRoseContent } from '@/sites/templates/weddings/emerald-rose';
import { Reveal } from '../../kit/reveal';
import { BODY, DISPLAY, LABEL } from './fonts';
import { BUTTON } from './links';
import { RoseSprig } from './ornaments';

export const Rsvp = ({ content }: { content: EmeraldRoseContent }) => {
  const { rsvp, event } = content;
  return (
    <section
      id="er-rsvp"
      className="relative scroll-mt-16 bg-(--er-secondary) px-10 py-24 text-(--er-bg) @3xl:py-32"
    >
      <div className="pointer-events-none absolute inset-3 border border-(--er-accent)/50 @3xl:inset-5" />
      <div className="pointer-events-none absolute inset-4.5 border border-(--er-accent)/25 @3xl:inset-7" />
      <Reveal className="relative mx-auto flex max-w-xl flex-col items-center text-center">
        <RoseSprig className="w-16 text-(--er-accent)" />
        <span className={cn(LABEL, 'mt-6 text-(--er-bg)/75 text-[10px]')}>
          Kindly reply by {event.rsvpBy}
        </span>
        <h2 className={cn(DISPLAY, 'mt-4 text-5xl italic leading-tight @md:text-6xl')}>
          Will you join us?
        </h2>
        <p className={cn(BODY, 'mt-6 whitespace-pre-line text-lg leading-relaxed @md:text-xl')}>
          {rsvp.message}
        </p>
        {rsvp.link === '' ? null : (
          <a
            href={rsvp.link}
            target="_blank"
            rel="noreferrer"
            className={cn(BUTTON, 'mt-10 bg-(--er-bg) px-10 text-(--er-secondary-deep)')}
          >
            {rsvp.buttonLabel}
          </a>
        )}
      </Reveal>
    </section>
  );
};
