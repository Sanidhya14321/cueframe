import { definePack } from '../../../pack';
import { eventDay, eventList, LAGOON, monthEvents, ROSEWOOD } from './posts';
import { contentCalendar, eventStory, saveDate } from './posts-more';

const MONTH = monthEvents(ROSEWOOD);
const LIST = eventList(ROSEWOOD);
const DAY = eventDay(ROSEWOOD);
const DATE = saveDate(ROSEWOOD);
const CALENDAR = contentCalendar(ROSEWOOD);

export const rosewoodTechEventsPack = definePack({
  id: 'rosewood-tech-events',
  title: 'Rosewood Tech Events',
  description:
    'Event calendar, save the date and content plan posts for SaaS and tech brands in wine and raspberry.',
  category: 'social-posts',
  tags: ['event', 'saas', 'instagram', 'story', 'gradient'],
  theme: 'dark',

  designs: [
    MONTH,
    LIST,
    DAY,
    CALENDAR,
    DATE,
    eventStory(ROSEWOOD),
    monthEvents(LAGOON),
    contentCalendar(LAGOON),
  ],
});
