import { defineControls } from '@/schemas/control-layout';
import type { EmeraldRoseContent } from './emerald-rose';

export const emeraldRoseControls = defineControls<EmeraldRoseContent>({
  sections: [
    {
      title: 'Couple',
      fields: [
        { path: 'couple.firstName', label: 'First name' },
        { path: 'couple.secondName', label: 'Second name' },
        {
          path: 'couple.monogram',
          label: 'Monogram',
          hint: 'Shown on the gate lock, the menu bar and the footer.',
        },
        { path: 'couple.greeting', label: 'Greeting', hint: 'The small line above your names.' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The garden around the gate, the venue and countdown bands and the buttons.',
        },
        {
          path: 'colors.secondary',
          label: 'Secondary color',
          hint: 'Roses behind the gate, the photo shadow, the dress code panel and the RSVP section.',
        },
        {
          path: 'colors.accent',
          label: 'Accent color',
          hint: 'The gilded gate, rose line drawings, timeline and fine rules.',
        },
        { path: 'colors.background', label: 'Background color', hint: 'The ivory page.' },
        { path: 'colors.text', label: 'Text color', hint: 'Headings and body copy on the page.' },
      ],
    },
    {
      title: 'Date & venue',
      fields: [
        {
          path: 'event.startsAt',
          label: 'Date and time',
          hint: 'Written out under your names and drives the countdown and calendar.',
        },
        { path: 'event.venue', label: 'Venue' },
        { path: 'event.address', label: 'Address', hint: 'Used for the map and directions.' },
        { path: 'event.rsvpBy', label: 'RSVP by' },
      ],
      more: [
        { path: 'event.venueNote', label: 'About the venue' },
        { path: 'event.venueWebsite', label: 'Venue website' },
      ],
    },
    {
      title: 'Photos',
      fields: [
        { path: 'photos.hero', label: 'Opening portrait' },
        { path: 'photos.storyThen', label: 'Story, first chapter' },
        { path: 'photos.storyNow', label: 'Story, last chapter' },
        { path: 'photos.venue', label: 'Venue photo' },
      ],
      more: [
        { path: 'photos.reception', label: 'Venue detail photo', hint: 'The smaller inset photo.' },
        { path: 'photos.schedule', label: 'Programme portrait', hint: 'Shown in an oval frame.' },
      ],
    },
    {
      title: 'Love story',
      fields: [
        {
          path: 'story.text',
          label: 'Story',
          hint: 'Leave a blank line between paragraphs: each one becomes a chapter.',
        },
        { path: 'story.thenLabel', label: 'Where it starts', hint: 'Caption on the first photo.' },
        { path: 'story.nowLabel', label: 'Where it is now', hint: 'Caption on the last photo.' },
      ],
    },
    {
      title: 'Order of the day',
      fields: [
        { path: 'schedule', label: 'Moments', items: { time: 'Time', title: 'What happens' } },
      ],
    },
    {
      title: 'Guest notes',
      fields: [
        {
          path: 'details',
          label: 'Notes',
          hint: 'Ceremony, children, hotels, gifts. Leave the link empty to hide it.',
          items: {
            title: 'Title',
            text: 'Text',
            linkLabel: 'Link label',
            linkUrl: 'Link',
          },
        },
        { path: 'dressCode.text', label: 'Dress code' },
        { path: 'dressCode.swatches', label: 'Dress code colors', items: { color: 'Color' } },
      ],
    },
    {
      title: 'FAQs',
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
      ],
    },
    {
      title: 'Garden gate',
      fields: [
        { path: 'intro.show', label: 'Open with a garden gate' },
        { path: 'intro.prompt', label: 'Gate prompt' },
      ],
    },
  ],
});
