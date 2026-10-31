import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { directionsUrl, mapEmbedUrl } from '@/sites/calendar';
import type { InkAndLaceContent } from '@/sites/templates/weddings/ink-and-lace';
import { Reveal } from '../../kit/reveal';
import { DISPLAY, LABEL, SANS } from './fonts';
import type { IssueSection } from './issue-sections';
import { Photo } from './photo';
import { SectionHead } from './section-head';
import { TextLink } from './text-link';

export const Venue = ({
  content,
  section,
}: {
  content: InkAndLaceContent;
  section: IssueSection;
}) => {
  const { event, photos } = content;
  return (
    <section id={section.id} className="scroll-mt-14 px-5 py-16 @3xl:px-10 @3xl:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead section={section} />
        <div className="mt-10 grid gap-10 @3xl:mt-14 @3xl:grid-cols-12 @3xl:gap-12">
          <Reveal className="flex flex-col gap-5 @3xl:col-span-5 @3xl:pt-6">
            <h3
              className={cn(
                DISPLAY,
                'text-5xl leading-[0.95] tracking-[-0.02em] [font-variation-settings:"opsz"_96] @3xl:text-7xl',
              )}
            >
              {event.venue}
            </h3>
            <span className={cn(LABEL, 'flex items-center gap-2 text-(--il-accent)')}>
              <MapPin className="size-3.5" />
              {event.address}
            </span>
            <p className={cn(SANS, 'text-[15px] leading-[1.75]')}>{event.venueNote}</p>
            <div className="mt-2 flex flex-wrap gap-6">
              <TextLink href={directionsUrl(event.address)}>Get directions</TextLink>
              {event.venueWebsite === '' ? null : (
                <TextLink href={event.venueWebsite}>Visit website</TextLink>
              )}
            </div>
          </Reveal>
          <Reveal delay={150} className="@3xl:col-span-7">
            <Photo src={photos.venue} alt={event.venue} className="aspect-[4/3] w-full" />
          </Reveal>
        </div>
        <Reveal className="mt-10 @3xl:mt-14">
          <iframe
            title={`Map of ${event.venue}`}
            src={mapEmbedUrl(event.address)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-72 w-full border border-current/25 bg-(--il-paper-deep) [filter:var(--il-photo-filter)] @3xl:h-96"
          />
          <span className={cn(LABEL, 'mt-3 block text-(--il-muted) text-[9px]')}>
            Fig. 04, the way there
          </span>
        </Reveal>
      </div>
    </section>
  );
};
