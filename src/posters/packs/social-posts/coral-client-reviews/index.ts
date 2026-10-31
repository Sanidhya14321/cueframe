import { definePack } from '../../../pack';
import { CORAL, clientsSay, LAGOON, photoQuote, reviewLetters } from './posts';
import { envelopeReviews, typewriterScroll } from './posts-more';

const LETTERS = reviewLetters(CORAL);
const PAPER = clientsSay(CORAL);
const QUOTE = photoQuote(CORAL);
const SCROLL = typewriterScroll(CORAL);
const ENVELOPE = envelopeReviews(CORAL);

export const coralClientReviewsPack = definePack({
  id: 'coral-client-reviews',
  title: 'Coral Client Reviews',
  description:
    'Testimonial and client review posts for freelancers in coral and midnight navy, with matching stories.',
  category: 'social-posts',
  tags: ['review', 'freelance', 'instagram', 'story'],
  theme: 'dark',

  designs: [ENVELOPE, QUOTE, LETTERS, PAPER, SCROLL, clientsSay(LAGOON), typewriterScroll(LAGOON)],
});
