import { defineControls } from '@/schemas/control-layout';
import type { InkAndLaceContent } from './ink-and-lace';

export const inkAndLaceControls = defineControls<InkAndLaceContent>({
  sections: [
    {
      title: 'Couple',
      fields: [
        { path: 'couple.firstName', label: 'First name' },
        { path: 'couple.secondName', label: 'Second name' },
        {
          path: 'couple.monogram',
          label: 'Monogram',
          hint: 'Shown in the top bar, inside the lace frame and in the colophon.',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The ink: the itinerary and reply pages, buttons and rules.',
        },
        {
          path: 'colors.accent',
          label: 'Accent color',
          hint: 'Section numbers, the ampersand, pull quotes and the circled date.',
        },
        {
          path: 'colors.background',
          label: 'Background color',
          hint: 'The paper, and the lace and type on the ink pages.',
        },
        { path: 'colors.text', label: 'Text color', hint: 'Headlines and body copy on paper.' },
      ],
    },
    {
      title: 'The issue',
      fields: [
        {
          path: 'issue.masthead',
          label: 'Magazine title',
          hint: 'The big word across the top of the cover.',
        },
        { path: 'issue.volume', label: 'Volume line' },
        { path: 'issue.number', label: 'Issue number' },
        {
          path: 'issue.coverLine',
          label: 'Cover line',
          hint: 'The teaser under your names on the cover and the opening page.',
        },
      ],
    },
    {
      title: 'Date & venue',
      fields: [
        {
          path: 'event.startsAt',
          label: 'Date and time',
          hint: 'Drives the calendar, countdown and add to calendar.',
        },
        { path: 'event.venue', label: 'Venue' },
        { path: 'event.address', label: 'Address', hint: 'Used for the map and directions.' },
        { path: 'event.rsvpBy', label: 'RSVP by' },
      ],
      more: [
        { path: 'event.venueNote', label: 'About the venue' },
        { path: 'event.venueWebsite', label: 'Venue website', hint: 'Leave empty to hide.' },
      ],
    },
    {
      title: 'Photos',
      fields: [
        { path: 'photos.cover', label: 'Cover photo' },
        { path: 'photos.hero', label: 'Opening page photo' },
        { path: 'photos.venue', label: 'Venue photo' },
        {
          path: 'photos.blackAndWhite',
          label: 'Black and white photos',
          hint: 'Prints every photo in monochrome, like the pages of a magazine.',
        },
      ],
      more: [
        { path: 'photos.storyOne', label: 'Story, first photo' },
        { path: 'photos.storyTwo', label: 'Story, second photo' },
        { path: 'photos.closing', label: 'Reply page backdrop' },
      ],
    },
    {
      title: 'The story',
      fields: [
        { path: 'story.headline', label: 'Headline' },
        {
          path: 'story.deck',
          label: 'Introduction',
          hint: 'The short paragraph under the headline.',
        },
        { path: 'story.text', label: 'Story', hint: 'Leave a blank line between paragraphs.' },
        { path: 'story.pullQuote', label: 'Pull quote' },
      ],
    },
    {
      title: 'Itinerary',
      fields: [
        {
          path: 'schedule',
          label: 'Moments',
          items: { time: 'Time', title: 'What happens', note: 'Note' },
        },
      ],
    },
    {
      title: 'Wedding party',
      fields: [
        {
          path: 'party',
          label: 'People',
          hint: 'Listed like the credits of a magazine. Leave empty to hide the page.',
          items: { name: 'Name', role: 'Role' },
        },
      ],
    },
    {
      title: 'Details',
      fields: [
        {
          path: 'details',
          label: 'Notes',
          hint: 'Dress code, hotels, travel, registry. Leave the link empty to hide the button.',
          items: {
            title: 'Title',
            text: 'Text',
            linkLabel: 'Button label',
            linkUrl: 'Button link',
          },
        },
      ],
    },
    {
      title: 'Q&A',
      fields: [
        { path: 'faqs', label: 'Questions', items: { question: 'Question', answer: 'Answer' } },
      ],
    },
    {
      title: 'RSVP',
      fields: [
        { path: 'rsvp.message', label: 'Invitation to reply' },
        {
          path: 'rsvp.link',
          label: 'RSVP form link',
          hint: 'Where guests reply, for example a Google Form. Leave empty to hide the button.',
        },
        { path: 'rsvp.buttonLabel', label: 'Button label' },
        { path: 'colophon.note', label: 'Closing note', hint: 'The small print at the very end.' },
      ],
    },
    {
      title: 'Cover',
      fields: [
        { path: 'intro.show', label: 'Open with the magazine cover' },
        { path: 'intro.prompt', label: 'Cover button' },
      ],
    },
  ],
});
