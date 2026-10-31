import type { ComponentType } from 'react';
import type { InkAndLaceContent } from '@/sites/templates/weddings/ink-and-lace';
import type { SiteBodyProps } from '../../site-view';
import { Contents } from './contents';
import { Details } from './details';
import { type IssueSection, issueSections, type SectionId } from './issue-sections';
import { Itinerary } from './itinerary';
import { Opening } from './opening';
import { Party } from './party';
import { QAndA } from './q-and-a';
import { Colophon, Reply } from './reply';
import { SiteNav } from './site-nav';
import { Story } from './story';
import { TheDate } from './the-date';
import { Venue } from './venue';

const VIEWS: Record<
  SectionId,
  ComponentType<{ content: InkAndLaceContent; section: IssueSection }>
> = {
  'il-story': Story,
  'il-itinerary': Itinerary,
  'il-venue': Venue,
  'il-date': TheDate,
  'il-party': Party,
  'il-details': Details,
  'il-faq': QAndA,
  'il-rsvp': Reply,
};

export const InkAndLaceBody = ({ content }: SiteBodyProps<InkAndLaceContent>) => {
  const sections = issueSections(content);
  return (
    <div className="@container min-h-full bg-(--il-paper) text-(--il-text) antialiased selection:bg-(--il-accent) selection:text-(--il-paper)">
      <SiteNav content={content} sections={sections} />
      <Opening content={content} />
      <Contents content={content} sections={sections} />
      {sections.map((section) => {
        const View = VIEWS[section.id];
        return <View key={section.id} content={content} section={section} />;
      })}
      <Colophon content={content} />
    </div>
  );
};
