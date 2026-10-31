import { defineControls } from '@/schemas/control-layout';
import type { MidnightCrownContent } from './midnight-crown';

export const midnightCrownControls = defineControls<MidnightCrownContent>({
  sections: [
    {
      title: 'Celebrant',
      fields: [
        { path: 'celebrant.firstName', label: 'First name' },
        { path: 'celebrant.lastName', label: 'Family name' },
        {
          path: 'celebrant.initial',
          label: 'Monogram letter',
          hint: 'Drawn beneath the crown on the doors and in the footer.',
        },
        { path: 'celebrant.years', label: 'Age', hint: 'Shown in gold foil, for example XV.' },
      ],
      more: [
        { path: 'celebrant.greeting', label: 'Greeting', hint: 'The small line above her name.' },
        { path: 'celebrant.tagline', label: 'Tagline', hint: 'The line beneath her name.' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The gold foil: crown, headings, frames, stars and buttons.',
        },
        {
          path: 'colors.secondary',
          label: 'Secondary color',
          hint: 'The soft accent on script lines, gems and the court of honour.',
        },
        {
          path: 'colors.background',
          label: 'Background color',
          hint: 'The midnight sky behind the page.',
        },
        { path: 'colors.surface', label: 'Surface color', hint: 'Cards, doors and framed panels.' },
        { path: 'colors.text', label: 'Text color', hint: 'Names and body copy.' },
      ],
    },
    {
      title: 'Date & places',
      fields: [
        {
          path: 'event.startsAt',
          label: 'Date and mass time',
          hint: 'Drives the date, the countdown and the calendar.',
        },
        { path: 'mass.place', label: 'Church' },
        { path: 'mass.address', label: 'Church address' },
        { path: 'reception.place', label: 'Reception venue' },
        {
          path: 'reception.address',
          label: 'Venue address',
          hint: 'Used for the map and directions.',
        },
        { path: 'reception.time', label: 'Reception time' },
      ],
      more: [
        { path: 'mass.title', label: 'Mass card title' },
        { path: 'reception.title', label: 'Reception card title' },
        { path: 'reception.note', label: 'About the venue' },
        {
          path: 'reception.website',
          label: 'Venue website',
          hint: 'Leave empty to hide the button.',
        },
        { path: 'event.rsvpBy', label: 'RSVP by' },
      ],
    },
    {
      title: 'Photos',
      fields: [
        { path: 'photos.hero', label: 'Arch portrait' },
        { path: 'photos.portrait', label: 'Letter photo' },
        { path: 'photos.chapel', label: 'Mass photo' },
        { path: 'photos.ballroom', label: 'Reception photo' },
      ],
      more: [{ path: 'photos.court', label: 'Court of honour backdrop' }],
    },
    {
      title: 'Her letter',
      fields: [
        { path: 'letter.text', label: 'Letter to guests' },
        { path: 'letter.signature', label: 'Signature' },
      ],
    },
    {
      title: 'Family & padrinos',
      fields: [
        { path: 'parents', label: 'Parents', items: { name: 'Name' } },
        {
          path: 'padrinos',
          label: 'Padrinos',
          hint: 'Sponsors and what they gift or bless, such as the crown or the last doll.',
          items: { role: 'Role', names: 'Names' },
        },
      ],
    },
    {
      title: 'Program of the night',
      fields: [
        {
          path: 'schedule',
          label: 'Moments',
          items: { time: 'Time', title: 'What happens', note: 'Detail' },
        },
      ],
    },
    {
      title: 'Court of honour',
      fields: [
        { path: 'court.escort', label: 'Chambelán de honor', hint: 'Her escort for the night.' },
        {
          path: 'court.pairs',
          label: 'Damas & chambelanes',
          items: { dama: 'Dama', chambelan: 'Chambelán' },
        },
      ],
    },
    {
      title: 'Dress code',
      fields: [
        { path: 'dressCode.title', label: 'Dress code' },
        { path: 'dressCode.text', label: 'Guidance' },
        { path: 'dressCode.swatches', label: 'Suggested colors', items: { color: 'Color' } },
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
      title: 'Ballroom doors',
      fields: [
        { path: 'intro.show', label: 'Open with ballroom doors' },
        { path: 'intro.prompt', label: 'Door prompt' },
      ],
    },
  ],
});
