import { definePack } from '../../../pack';
import { dailyReminder, eatSleep, letsFlow, stopBreathe, yogaVertical } from './posts';
import { yogaLettersPost, yogaLettersStory } from './posts-extra';
import { benefits, moodYoga, toggles, unwind, yogaSchedule } from './posts-more';

const POSTS = [
  stopBreathe,
  yogaVertical,
  moodYoga,
  unwind,
  letsFlow,
  eatSleep,
  yogaSchedule,
  dailyReminder,
  yogaLettersPost,
  benefits,
  toggles,
];

export const cobaltStudioYogaPack = definePack({
  id: 'cobalt-studio-yoga',
  title: 'Cobalt Studio Yoga',
  description:
    'Bold yoga and fitness studio posts and stories with schedules, reminders and big type in cobalt blue, ink and lilac.',
  category: 'lifestyle',
  tags: ['wellness', 'instagram', 'story', 'photo'],
  theme: 'dark',

  designs: [
    ...POSTS,
    stopBreathe,
    letsFlow,
    dailyReminder,
    yogaVertical,
    benefits,
    toggles,
    yogaSchedule,
    eatSleep,
    unwind,
    moodYoga,
    yogaLettersPost,
    yogaLettersStory,
  ],
});
