import { definePack } from '../../../pack';
import { clientsSay, PLUM, photoQuote, reviewWord, SPRUCE } from './posts';
import { envelopeReviews, reviewStory, typewriterScroll } from './posts-more';

const WORD = reviewWord(PLUM);
const PAPER = clientsSay(PLUM);
const QUOTE = photoQuote(PLUM);
const SCROLL = typewriterScroll(PLUM);
const ENVELOPE = envelopeReviews(PLUM);

export const plumProofReviewsPack = definePack({
  id: 'plum-proof-reviews',
  title: 'Plum Proof Reviews',
  description:
    'Customer review and testimonial posts for small businesses in violet, ink and lemon, with a matching story.',
  category: 'social-posts',
  tags: ['review', 'small-business', 'instagram', 'story'],
  theme: 'dark',

  designs: [
    SCROLL,
    QUOTE,
    WORD,
    ENVELOPE,
    PAPER,
    reviewStory(PLUM),
    reviewWord(SPRUCE),
    envelopeReviews(SPRUCE),
  ],
});
