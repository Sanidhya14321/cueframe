import type { MidnightCrownContent } from '@/sites/templates/quinceaneras/midnight-crown';
import type { SiteBodyProps } from '../../site-view';
import { Celebration } from './celebration';
import { Countdown } from './countdown';
import { Details } from './details';
import { Hero } from './hero';
import { Family, Letter } from './letter';
import { Court, Program } from './program';
import { Footer, Rsvp } from './rsvp';
import { SiteNav } from './site-nav';
import { MIDNIGHT_KEYFRAMES } from './starfield';

export const MidnightCrownBody = ({ content }: SiteBodyProps<MidnightCrownContent>) => (
  <div className="@container min-h-full overflow-x-clip bg-(--mc-bg) text-(--mc-text) antialiased">
    <style>{MIDNIGHT_KEYFRAMES}</style>
    <SiteNav initial={content.celebrant.initial} />
    <Hero content={content} />
    <Letter content={content} />
    <Family content={content} />
    <Celebration content={content} />
    <Program content={content} />
    <Court content={content} />
    <Details content={content} />
    <Countdown content={content} />
    <Rsvp content={content} />
    <Footer content={content} />
  </div>
);
