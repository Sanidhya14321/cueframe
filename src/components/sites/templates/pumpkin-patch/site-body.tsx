import { cn } from '@/lib/utils';
import { describeEventDate } from '@/sites/event-date';
import type { PumpkinPatchContent } from '@/sites/templates/baby-showers/pumpkin-patch';
import type { SiteBodyProps } from '../../site-view';
import { Afternoon } from './afternoon';
import { Countdown } from './countdown';
import { PumpkinPatchKeyframes } from './falling-leaves';
import { BODY, DISPLAY, HAND, LABEL } from './fonts';
import { Hero } from './hero';
import { LittleDetails } from './little-details';
import { Pumpkin, Vine } from './ornaments';
import { Registry } from './registry';
import { Rsvp } from './rsvp';
import { SiteHeader } from './site-header';
import { Venue } from './venue';
import { WelcomeNote } from './welcome-note';

const Footer = ({ content }: { content: PumpkinPatchContent }) => {
  const { family, event } = content;
  const when = describeEventDate(event.startsAt);
  return (
    <footer className="flex flex-col items-center gap-3 bg-(--pp-night) px-5 pt-14 pb-16 text-center text-(--pp-bg)">
      <Pumpkin className="w-20" />
      <span className={cn(DISPLAY, 'text-3xl')}>Baby {family.lastName}</span>
      {when === null ? null : (
        <span className={cn(LABEL, 'text-(--pp-primary-soft) text-[10px]')}>
          {when.month} {when.day}, {when.year}
        </span>
      )}
      <Vine className="mt-2 w-48 opacity-70" />
      <span className={cn(HAND, 'text-2xl text-(--pp-bg)/80')}>
        hosted with love by {family.hostedBy}
      </span>
    </footer>
  );
};

export const PumpkinPatchBody = ({ content }: SiteBodyProps<PumpkinPatchContent>) => (
  <div
    className={cn(
      BODY,
      '@container min-h-full overflow-x-clip bg-(--pp-bg) text-(--pp-text) antialiased',
    )}
  >
    <PumpkinPatchKeyframes />
    <SiteHeader lastName={content.family.lastName} />
    <Hero content={content} />
    <WelcomeNote content={content} />
    <Afternoon content={content} />
    <Registry content={content} />
    <LittleDetails content={content} />
    <Venue content={content} />
    <Countdown content={content} />
    <Rsvp content={content} />
    <Footer content={content} />
  </div>
);
