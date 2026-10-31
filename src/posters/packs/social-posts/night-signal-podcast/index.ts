import { definePack } from '../../../pack';
import { audiencePulse, lateNight, onAirNightly, thankYou } from './posts';
import { liveQa, weeklyAfter, weeklyBefore } from './posts-live';
import { countdown, meetTheHost, tuneIn, tuneInStory } from './posts-more';
import { inNumbers } from './posts-stats';

const POSTS = [
  onAirNightly,
  thankYou,
  lateNight,
  audiencePulse,
  meetTheHost,
  countdown,
  inNumbers,
  tuneIn,
  liveQa,
];

const FEED = [...POSTS, weeklyBefore];

export const nightSignalPodcastPack = definePack({
  id: 'night-signal-podcast',
  title: 'Night Signal Podcast',
  description:
    'Episode drops, host intros, listener stats and live Q&A posts for a podcast or radio show in midnight indigo and amber.',
  category: 'social-posts',
  tags: ['podcast', 'instagram', 'story', 'stats'],
  theme: 'dark',

  designs: [
    ...POSTS,
    audiencePulse,
    onAirNightly,
    thankYou,
    lateNight,
    inNumbers,
    countdown,
    tuneIn,
    liveQa,
    meetTheHost,
    weeklyBefore,
    weeklyAfter,
    tuneInStory,
    ...FEED,
  ],
});
