import { definePack } from '../../../pack';
import { BLUSH, contentCalendar, eventDay, monthEvents, TANGERINE } from './posts';
import { eventList, saveTheDate } from './posts-more';

const PLANNER = contentCalendar(BLUSH);
const DAY = eventDay(BLUSH);
const MONTH = monthEvents(BLUSH);
const AGENDA = eventList(BLUSH);
const SAVE = saveTheDate(BLUSH);

export const blushDateEventsPack = definePack({
  id: 'blush-date-events',
  title: 'Blush Date Events',
  description:
    'Event, calendar and save the date posts for freelancers in blush pink and deep teal, with matching stories.',
  category: 'social-posts',
  tags: ['event', 'freelance', 'instagram', 'story'],
  theme: 'dark',

  designs: [DAY, AGENDA, MONTH, SAVE, PLANNER, contentCalendar(TANGERINE), monthEvents(TANGERINE)],
});
