import { definePack } from '../../../pack';
import { COBALT, newspaper, PINE, reviewWord, SUNSET } from './posts';
import { photoQuote, typewriter, userEnvelope, userStory } from './posts-more';

const word = reviewWord(PINE);
const paper = newspaper(PINE);
const quote = photoQuote(PINE);
const keys = typewriter(PINE);
const envelope = userEnvelope(PINE);

export const pineSaasReviewsPack = definePack({
  id: 'pine-saas-reviews',
  title: 'Pine SaaS Reviews',
  description:
    'User review, release-note clipping, team photo quote and envelope posts for SaaS brands in pine and mint.',
  category: 'social-posts',
  tags: ['review', 'saas', 'instagram', 'story'],
  theme: 'dark',

  designs: [
    word,
    envelope,
    quote,
    paper,
    keys,
    userStory(PINE),
    newspaper(SUNSET),
    photoQuote(COBALT),
  ],
});
