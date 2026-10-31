import { cn } from '@/lib/utils';
import { describeEventDate } from '@/sites/event-date';
import type { EmeraldRoseContent } from '@/sites/templates/weddings/emerald-rose';
import type { SiteBodyProps } from '../../site-view';
import { Countdown } from './countdown';
import { Faqs } from './faqs';
import { DISPLAY, LABEL } from './fonts';
import { GuestNotes } from './guest-notes';
import { Hero, NameRibbon } from './hero';
import { LoveStory } from './love-story';
import { Flourish } from './ornaments';
import { Rsvp } from './rsvp';
import { Schedule } from './schedule';
import { SiteNav } from './site-nav';
import { Venue } from './venue';

const Footer = ({ content }: { content: EmeraldRoseContent }) => {
  const when = describeEventDate(content.event.startsAt);
  return (
    <footer className="flex flex-col items-center gap-4 bg-(--er-primary-deep) px-5 py-16 text-center text-(--er-bg)">
      <span className={cn(DISPLAY, 'text-(--er-accent) text-2xl italic')}>
        {content.couple.monogram}
      </span>
      <Flourish className="w-44 text-(--er-accent)" />
      <span className={cn(DISPLAY, 'text-4xl italic')}>
        {content.couple.firstName} &amp; {content.couple.secondName}
      </span>
      {when === null ? null : (
        <span className={cn(LABEL, 'text-(--er-bg)/70 text-[10px]')}>
          {when.month} {when.day}, {when.year} &middot; {content.event.venue}
        </span>
      )}
    </footer>
  );
};

export const EmeraldRoseBody = ({ content }: SiteBodyProps<EmeraldRoseContent>) => (
  <div className="@container min-h-full bg-(--er-bg) text-(--er-text) antialiased">
    <SiteNav monogram={content.couple.monogram} />
    <Hero content={content} />
    <NameRibbon content={content} />
    <LoveStory content={content} />
    <Venue content={content} />
    <Schedule content={content} />
    <GuestNotes content={content} />
    <Faqs faqs={content.faqs} />
    <Countdown content={content} />
    <Rsvp content={content} />
    <Footer content={content} />
  </div>
);
