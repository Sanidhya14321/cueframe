import { defineControls } from '@/schemas/control-layout';
import type { PumpkinPatchContent } from './pumpkin-patch';

export const pumpkinPatchControls = defineControls<PumpkinPatchContent>({
  sections: [
    {
      title: 'Parents-to-be',
      fields: [
        { path: 'family.parentOne', label: 'First parent' },
        { path: 'family.parentTwo', label: 'Second parent' },
        {
          path: 'family.lastName',
          label: 'Family name',
          hint: 'Shown as Baby Hollis in the header.',
        },
        { path: 'family.dueLine', label: 'Due date line', hint: 'The little tag under the title.' },
      ],
      more: [
        {
          path: 'family.headline',
          label: 'Headline',
          hint: 'The big line at the top of the page.',
        },
        { path: 'family.hostedBy', label: 'Hosted by' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'Pumpkins, buttons, the countdown and the headline accent.',
        },
        {
          path: 'colors.secondary',
          label: 'Secondary color',
          hint: 'Vines, leaves, stems and the welcome and registry panels.',
        },
        {
          path: 'colors.accent',
          label: 'Accent color',
          hint: 'The ribbon bow, the due date tag and the seconds pumpkin. Blue for a boy.',
        },
        { path: 'colors.background', label: 'Background color', hint: 'The cream page and cards.' },
        { path: 'colors.text', label: 'Text color', hint: 'Headings and body copy.' },
      ],
    },
    {
      title: 'Date & place',
      fields: [
        {
          path: 'event.startsAt',
          label: 'Date and time',
          hint: 'Drives the countdown and the calendar file.',
        },
        { path: 'event.venue', label: 'Venue' },
        { path: 'event.address', label: 'Address', hint: 'Used for the map and directions.' },
        { path: 'event.rsvpBy', label: 'RSVP by' },
      ],
      more: [
        { path: 'event.venueNote', label: 'About the venue' },
        {
          path: 'event.hours',
          label: 'Length in hours',
          hint: 'How long the calendar event lasts.',
        },
      ],
    },
    {
      title: 'Photos',
      fields: [
        { path: 'photos.hero', label: 'Top photo' },
        { path: 'photos.welcome', label: 'Welcome note photo' },
        { path: 'photos.venue', label: 'Venue photo' },
      ],
      more: [
        { path: 'photos.brunch', label: 'The afternoon photo' },
        { path: 'photos.registry', label: 'Registry photo' },
      ],
    },
    {
      title: 'Welcome note',
      fields: [
        { path: 'welcome.title', label: 'Title' },
        { path: 'welcome.text', label: 'Note' },
        { path: 'welcome.signature', label: 'Signed by' },
      ],
    },
    {
      title: 'The afternoon',
      fields: [
        {
          path: 'schedule',
          label: 'Plan',
          items: { time: 'Time', title: 'What happens', note: 'A short line' },
        },
      ],
    },
    {
      title: 'Registry',
      fields: [
        { path: 'registry.text', label: 'Registry note' },
        {
          path: 'registry.links',
          label: 'Registry buttons',
          hint: 'One button per store. Leave a link empty to hide that button.',
          items: { label: 'Button label', link: 'Link' },
        },
      ],
    },
    {
      title: 'Little details',
      fields: [
        {
          path: 'details',
          label: 'Details',
          hint: 'Books instead of cards, a diaper raffle, what to wear.',
          items: { title: 'Title', text: 'Text' },
        },
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
      title: 'Gift box opening',
      fields: [
        { path: 'intro.show', label: 'Open with a gift box' },
        { path: 'intro.prompt', label: 'Gift box prompt' },
      ],
    },
  ],
});
