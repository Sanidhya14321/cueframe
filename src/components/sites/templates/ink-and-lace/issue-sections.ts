import type { InkAndLaceContent } from '@/sites/templates/weddings/ink-and-lace';

export type SectionId =
  | 'il-story'
  | 'il-itinerary'
  | 'il-venue'
  | 'il-date'
  | 'il-party'
  | 'il-details'
  | 'il-faq'
  | 'il-rsvp';

export interface IssueSection {
  id: SectionId;
  label: string;
  kicker: string;
  number: string;
  page: string;
}

const ALL: readonly {
  id: SectionId;
  label: string;
  kicker: string;
  visible: (content: InkAndLaceContent) => boolean;
}[] = [
  { id: 'il-story', label: 'The story', kicker: 'Feature', visible: () => true },
  { id: 'il-itinerary', label: 'The itinerary', kicker: 'Order of the day', visible: () => true },
  { id: 'il-venue', label: 'The venue', kicker: 'Location', visible: () => true },
  { id: 'il-date', label: 'The date', kicker: 'Save the date', visible: () => true },
  {
    id: 'il-party',
    label: 'The wedding party',
    kicker: 'Masthead',
    visible: (content) => content.party.length > 0,
  },
  {
    id: 'il-details',
    label: 'The details',
    kicker: 'Good to know',
    visible: (content) => content.details.length > 0,
  },
  {
    id: 'il-faq',
    label: 'Questions & answers',
    kicker: 'In conversation',
    visible: (content) => content.faqs.length > 0,
  },
  { id: 'il-rsvp', label: 'Kindly respond', kicker: 'RSVP', visible: () => true },
];

export const issueSections = (content: InkAndLaceContent): IssueSection[] =>
  ALL.filter((section) => section.visible(content)).map((section, index) => ({
    id: section.id,
    label: section.label,
    kicker: section.kicker,
    number: String(index + 1).padStart(2, '0'),
    page: String(6 + index * 8).padStart(3, '0'),
  }));
