import { defineControls } from '@/schemas/control-layout';
import type { SnowDayOneContent } from './snow-day-one';

export const snowDayOneControls = defineControls<SnowDayOneContent>({
  sections: [
    {
      title: 'Birthday child',
      fields: [
        { path: 'child.name', label: 'Name' },
        { path: 'child.age', label: 'Age number', hint: 'The giant number in the snowy hero.' },
        { path: 'child.ageWord', label: 'Age in words', hint: 'Written under the giant number.' },
        {
          path: 'child.themeLine',
          label: 'Theme line',
          hint: 'The playful line above the name, for example "Our little snowflake is turning".',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The winter sky, the giant number, headings and buttons.',
        },
        {
          path: 'colors.secondary',
          label: 'Secondary color',
          hint: 'Frosty panels, snow drifts and the window frost.',
        },
        {
          path: 'colors.accent',
          label: 'Accent color',
          hint: 'Mittens, hearts, the RSVP card and little pops of cheer.',
        },
        {
          path: 'colors.highlight',
          label: 'Highlight color',
          hint: 'Time chips, stars and the butter-yellow sparkles.',
        },
        { path: 'colors.background', label: 'Background color', hint: 'The snowy page.' },
        { path: 'colors.text', label: 'Text color', hint: 'Body copy and small labels.' },
      ],
    },
    {
      title: 'Hosts',
      fields: [
        { path: 'hosts.names', label: 'Parents or hosts', hint: 'Shown in the hero and footer.' },
        {
          path: 'hosts.invitation',
          label: 'Invitation line',
          hint: 'The line just before the hosts, under the date.',
        },
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
          label: 'Party length (hours)',
          hint: 'How long the calendar event lasts.',
        },
      ],
    },
    {
      title: 'Photos',
      fields: [
        { path: 'photos.hero', label: 'Birthday portrait' },
        { path: 'photos.snapOne', label: 'First snapshot' },
        { path: 'photos.snapTwo', label: 'Second snapshot' },
        { path: 'photos.snapThree', label: 'Third snapshot' },
      ],
      more: [
        { path: 'photos.venue', label: 'Venue photo' },
        { path: 'photos.party', label: 'Party plan photo' },
      ],
    },
    {
      title: 'A year of firsts',
      fields: [
        { path: 'story.text', label: 'Story' },
        { path: 'story.captionOne', label: 'First snapshot caption' },
        { path: 'story.captionTwo', label: 'Second snapshot caption' },
        { path: 'story.captionThree', label: 'Third snapshot caption' },
      ],
      more: [
        {
          path: 'firsts',
          label: 'Milestones',
          hint: 'Little firsts from the year, shown as snowball badges.',
          items: { when: 'When', what: 'What happened' },
        },
      ],
    },
    {
      title: 'Party plan',
      fields: [
        {
          path: 'schedule',
          label: 'Moments',
          items: { time: 'Time', title: 'What happens', note: 'Little note', icon: 'Icon' },
        },
      ],
    },
    {
      title: 'Notes for parents',
      fields: [
        {
          path: 'notes',
          label: 'Notes',
          hint: 'Gifts, what to wear, parking. Leave the link empty to hide the button.',
          items: {
            icon: 'Icon',
            title: 'Title',
            text: 'Text',
            linkLabel: 'Button label',
            linkUrl: 'Button link',
          },
        },
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
      title: 'Frosty window',
      fields: [
        { path: 'intro.show', label: 'Open with a frosty window' },
        { path: 'intro.prompt', label: 'Window prompt' },
      ],
    },
  ],
});
