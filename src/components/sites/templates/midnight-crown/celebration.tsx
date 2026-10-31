import { ExternalLink, MapPin } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { directionsUrl, mapEmbedUrl } from '@/sites/calendar';
import { describeEventDate } from '@/sites/event-date';
import type { MidnightCrownContent } from '@/sites/templates/quinceaneras/midnight-crown';
import { Reveal } from '../../kit/reveal';
import { SitePhoto } from '../../kit/site-photo';
import { BODY, DECO, DISPLAY, FOIL } from './fonts';
import { DecoCorners, SectionTitle } from './ornaments';

const GoldLink = ({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={cn(
      DECO,
      'inline-flex items-center gap-2 border border-(--mc-gold)/70 px-5 py-2.5 text-(--mc-gold) text-[11px] transition hover:bg-(--mc-gold) hover:text-(--mc-bg)',
      className,
    )}
  >
    {children}
  </a>
);

const PlaceCard = ({
  kicker,
  title,
  time,
  place,
  address,
  photo,
  children,
}: {
  kicker: string;
  title: string;
  time: string;
  place: string;
  address: string;
  photo: string;
  children?: ReactNode;
}) => (
  <div className="relative flex h-full flex-col items-center bg-(--mc-surface) text-center shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
    <div className="relative h-52 w-full overflow-hidden @3xl:h-60">
      <SitePhoto
        src={photo}
        alt={place}
        className="size-full"
        emptyClassName="bg-linear-to-b from-(--mc-surface-deep) to-(--mc-bg)"
      />
      <div className="absolute inset-0 bg-linear-to-t from-(--mc-surface) via-(--mc-surface)/20 to-transparent" />
    </div>
    <div className="-mt-10 relative flex flex-1 flex-col items-center gap-3 px-6 pb-9">
      <DecoCorners className="-top-6" />
      <span className={cn(DECO, 'text-(--mc-blush) text-[11px]')}>{kicker}</span>
      <h3 className={cn(DISPLAY, 'text-(--mc-text) text-3xl italic')}>{title}</h3>
      <span className={cn(DISPLAY, FOIL, 'text-4xl')}>{time}</span>
      <span className={cn(DECO, 'mt-1 text-(--mc-text) text-sm')}>{place}</span>
      <span className={cn(BODY, 'text-(--mc-muted) text-lg italic')}>{address}</span>
      {children}
      <div className="mt-auto flex flex-wrap justify-center gap-3 pt-4">
        <GoldLink href={directionsUrl(address)}>
          <MapPin className="size-3.5" />
          Directions
        </GoldLink>
      </div>
    </div>
  </div>
);

export const Celebration = ({ content }: { content: MidnightCrownContent }) => {
  const { mass, reception, photos } = content;
  const when = describeEventDate(content.event.startsAt);
  return (
    <section id="mc-celebration" className="scroll-mt-14 px-5 py-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-12">
        <Reveal>
          <SectionTitle kicker="Misa y recepción" title="The celebration" />
        </Reveal>
        <div className="grid w-full gap-8 @3xl:grid-cols-2">
          <Reveal className="h-full">
            <PlaceCard
              kicker="Misa"
              title={mass.title}
              time={when?.time.toLowerCase() ?? ''}
              place={mass.place}
              address={mass.address}
              photo={photos.chapel}
            />
          </Reveal>
          <Reveal delay={150} className="h-full">
            <PlaceCard
              kicker="Recepción"
              title={reception.title}
              time={reception.time}
              place={reception.place}
              address={reception.address}
              photo={photos.ballroom}
            >
              <p className={cn(BODY, 'mt-2 max-w-sm text-(--mc-text)/85 text-lg leading-relaxed')}>
                {reception.note}
              </p>
              {reception.website === '' ? null : (
                <GoldLink href={reception.website} className="mt-2 border-transparent">
                  <ExternalLink className="size-3.5" />
                  Venue website
                </GoldLink>
              )}
            </PlaceCard>
          </Reveal>
        </div>
        <Reveal className="w-full">
          <div className="relative border border-(--mc-gold)/60 p-2.5">
            <iframe
              title={`Map of ${reception.place}`}
              src={mapEmbedUrl(reception.address)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-72 w-full border border-(--mc-gold)/30 bg-(--mc-surface) @3xl:h-80"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
};
