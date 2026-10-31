import { MapPin, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { directionsUrl, mapEmbedUrl } from '@/sites/calendar';
import type { SnowDayOneContent } from '@/sites/templates/birthdays/snow-day-one';
import { Reveal } from '../../kit/reveal';
import { SitePhoto } from '../../kit/site-photo';
import { DISPLAY, LABEL } from './fonts';
import { Mitten } from './ornaments';
import { SectionTitle } from './section-title';

export const Venue = ({ content }: { content: SnowDayOneContent }) => {
  const { event, photos } = content;
  return (
    <section id="sd-place" className="scroll-mt-16 px-5 py-16">
      <Reveal>
        <SectionTitle kicker="follow the snowflakes" title="Where the fun is" />
      </Reveal>
      <div className="mx-auto mt-10 grid max-w-5xl gap-6 @3xl:grid-cols-2">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_50px_-34px_rgba(30,40,110,0.7)]">
          <SitePhoto
            src={photos.venue}
            alt={event.venue}
            className="aspect-[16/9] w-full"
            emptyClassName="bg-(--sd-frost)"
          />
          <div className="relative px-6 pt-6 pb-7">
            <Mitten className="-top-9 absolute right-6 w-14 rotate-12 text-(--sd-accent) drop-shadow-md" />
            <h3 className={cn(DISPLAY, 'font-semibold text-(--sd-primary) text-3xl leading-tight')}>
              {event.venue}
            </h3>
            <p className="mt-2 flex items-start gap-2 font-semibold text-(--sd-text)">
              <MapPin className="mt-0.5 size-4 shrink-0 text-(--sd-accent)" />
              {event.address}
            </p>
            <p className="mt-4 whitespace-pre-line text-(--sd-muted) leading-relaxed">
              {event.venueNote}
            </p>
            <a
              href={directionsUrl(event.address)}
              target="_blank"
              rel="noreferrer"
              className={cn(
                LABEL,
                'mt-6 inline-flex items-center gap-2 rounded-full bg-(--sd-primary) px-5 py-3 text-white text-xs transition hover:brightness-110',
              )}
            >
              <Navigation className="size-4" />
              Get directions
            </a>
          </div>
        </Reveal>
        <Reveal
          delay={150}
          className="rounded-[2rem] bg-white p-3 shadow-[0_24px_50px_-34px_rgba(30,40,110,0.7)]"
        >
          <iframe
            title={`Map of ${event.venue}`}
            src={mapEmbedUrl(event.address)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="aspect-square size-full min-h-72 rounded-[1.5rem] border-(--sd-frost) border-2 border-dashed bg-(--sd-frost) @3xl:aspect-auto"
          />
        </Reveal>
      </div>
    </section>
  );
};
