import { definePack } from '../../../pack';
import { COBALT } from './palette';
import { POSTS } from './posts';
import { eventDay, eventList, eventStory } from './posts-events';

export const jadeEventCalendarPack = definePack({
  id: 'jade-event-calendar',
  title: 'Jade Event Calendar',
  description:
    'Monthly event calendar, save the date, event day and content planner posts in jade and lime, with a matching story.',
  category: 'social-posts',
  tags: ['event', 'instagram', 'small-business', 'story'],
  theme: 'dark',

  designs: [...POSTS, eventStory, eventDay(COBALT), eventList(COBALT)],
});
