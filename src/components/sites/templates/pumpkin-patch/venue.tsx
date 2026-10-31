import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { directionsUrl, mapEmbedUrl } from '@/sites/calendar';
import type { PumpkinPatchContent } from '@/sites/templates/baby-showers/pumpkin-patch';
import { Reveal } from '../../kit/reveal';
import { SitePhoto } from '../../kit/site-photo';
import { BODY, DISPLAY } from './fonts';
import { Pumpkin } from './ornaments';
import { PILL_SOLID, PillLink, SectionTitle } from './pill';

export const Venue = ({ content }: { content: PumpkinPatchContent }) => {
  const { event, photos } = content;
  return (
    <section id="pp-venue" className="scroll-mt-16 px-5 py-20">
      <Reveal>
        <SectionTitle kicker="where we will gather" title="Find the farm" />
      </Reveal>
      <div className="mx-auto mt-12 grid max-w-5xl gap-8 @3xl:grid-cols-2">
        <Reveal className="overflow-hidden rounded-[2rem] bg-(--pp-card) shadow-[0_24px_48px_-32px_rgba(60,30,10,0.6)]">
          <SitePhoto
            src={photos.venue}
            alt={event.venue}
            className="aspect-[16/10] w-full"
            emptyClassName="bg-(--pp-oat)"
          />
          <div className="flex flex-col items-start gap-3 px-7 pt-6 pb-8">
            <h3 className={cn(DISPLAY, 'text-3xl leading-tight')}>{event.venue}</h3>
            <span className={cn(BODY, 'flex items-start gap-2 font-bold text-(--pp-primary)')}>
              <MapPin className="mt-0.5 size-4 shrink-0" />
              {event.address}
            </span>
            <p className={cn(BODY, 'whitespace-pre-line text-(--pp-muted) leading-relaxed')}>
              {event.venueNote}
            </p>
            <PillLink href={directionsUrl(event.address)} className={cn(PILL_SOLID, 'mt-3')}>
              Get directions
            </PillLink>
          </div>
        </Reveal>
        <Reveal delay={150} className="relative min-h-80">
          <iframe
            title={`Map of ${event.venue}`}
            src={mapEmbedUrl(event.address)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="size-full min-h-80 rounded-[2rem] border-(--pp-card) border-8 bg-(--pp-oat) shadow-[0_24px_48px_-32px_rgba(60,30,10,0.6)]"
          />
          <Pumpkin className="absolute -right-3 -bottom-6 w-24 -rotate-6" />
        </Reveal>
      </div>
    </section>
  );
};
