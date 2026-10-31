import type { SnowDayOneContent } from '@/sites/templates/birthdays/snow-day-one';
import type { SiteBodyProps } from '../../site-view';
import { Countdown } from './countdown';
import { Hero } from './hero';
import { ParentNotes } from './parent-notes';
import { PartyPlan } from './party-plan';
import { Footer, RsvpCard } from './rsvp-card';
import { SiteNav } from './site-nav';
import { SnowKeyframes } from './snowfall';
import { Venue } from './venue';
import { YearOfFirsts } from './year-of-firsts';

export const SnowDayOneBody = ({ content }: SiteBodyProps<SnowDayOneContent>) => (
  <div className="@container min-h-full overflow-x-clip bg-(--sd-bg) text-(--sd-text) antialiased">
    <SnowKeyframes />
    <SiteNav title={`${content.child.name} turns ${content.child.ageWord}`} />
    <Hero content={content} />
    <YearOfFirsts content={content} />
    <PartyPlan content={content} />
    <Venue content={content} />
    <Countdown content={content} />
    <ParentNotes content={content} />
    <RsvpCard content={content} />
    <Footer content={content} />
  </div>
);
