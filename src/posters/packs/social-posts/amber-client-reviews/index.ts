import { definePack } from '../../../pack';
import { AMBER, clientsSay, photoQuote, ROSE, reviewLetters } from './posts';
import { clientEnvelope, clientEnvelopeStory, typewriter } from './posts-more';

export const amberClientReviewsPack = definePack({
  id: 'amber-client-reviews',
  title: 'Amber Client Reviews',
  description:
    'Testimonial and client review posts for AI and digital agencies in amber, orange and black.',
  category: 'social-posts',
  tags: ['review', 'instagram', 'story', 'ai', 'photo'],
  theme: 'dark',

  designs: [
    clientEnvelope,
    photoQuote,
    reviewLetters(AMBER),
    clientsSay(AMBER),
    typewriter(AMBER),
    clientsSay(ROSE),
    typewriter(ROSE),
    clientEnvelopeStory,
  ],
});
