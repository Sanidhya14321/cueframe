import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { directionsUrl, mapEmbedUrl } from '@/sites/calendar';
import type { EmeraldRoseContent } from '@/sites/templates/weddings/emerald-rose';
import { Reveal } from '../../kit/reveal';
import { SitePhoto } from '../../kit/site-photo';
import { BODY, DISPLAY, LABEL } from './fonts';
import { TextLink } from './links';

export const Venue = ({ content }: { content: EmeraldRoseContent }) => {
  const { event, photos } = content;
  return (
    <section
      id="er-venue"
      className="scroll-mt-16 bg-(--er-primary-deep) px-5 py-20 text-(--er-bg) @3xl:py-28"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-16 @3xl:grid-cols-2">
        <Reveal className="relative pb-[18%] @3xl:pb-[14%]">
          <div className="w-[80%] border border-(--er-accent)/60 p-2">
            <SitePhoto
              src={photos.venue}
              alt={event.venue}
              className="aspect-[4/5] w-full"
              emptyClassName="bg-(--er-primary)"
            />
          </div>
          <div className="absolute right-0 bottom-0 w-[50%] border-(--er-primary-deep) border-8 bg-(--er-primary-deep)">
            <SitePhoto
              src={photos.reception}
              alt=""
              className="aspect-square w-full"
              emptyClassName="bg-(--er-primary)"
            />
          </div>
        </Reveal>
        <Reveal delay={150}>
          <span className={cn(LABEL, 'text-(--er-accent) text-[10px]')}>Where we gather</span>
          <h2 className={cn(DISPLAY, 'mt-4 text-5xl italic leading-tight @3xl:text-6xl')}>
            {event.venue}
          </h2>
          <span
            className={cn(BODY, 'mt-3 flex items-start gap-2 text-(--er-bg)/75 text-lg italic')}
          >
            <MapPin className="mt-1.5 size-4 shrink-0 text-(--er-accent)" />
            {event.address}
          </span>
          <p className={cn(BODY, 'mt-6 max-w-md whitespace-pre-line text-xl leading-relaxed')}>
            {event.venueNote}
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 text-(--er-accent)">
            <TextLink href={directionsUrl(event.address)}>Directions</TextLink>
            {event.venueWebsite === '' ? null : (
              <TextLink href={event.venueWebsite}>Venue website</TextLink>
            )}
          </div>
        </Reveal>
      </div>
      <Reveal className="mx-auto mt-16 max-w-6xl">
        <iframe
          title={`Map of ${event.venue}`}
          src={mapEmbedUrl(event.address)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="aspect-[4/3] w-full border border-(--er-accent)/50 bg-(--er-primary) p-1.5 @3xl:aspect-[21/8]"
        />
      </Reveal>
    </section>
  );
};
