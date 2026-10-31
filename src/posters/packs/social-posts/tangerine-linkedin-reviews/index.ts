import { definePack } from '../../../pack';
import { LAGOON, newspaper, ORCHID, reviewWord, TANGERINE } from './posts';
import { clientEnvelope, clientStory, photoQuote, typewriter } from './posts-more';

const word = reviewWord(TANGERINE);
const paper = newspaper(TANGERINE);
const quote = photoQuote(TANGERINE);
const keys = typewriter(TANGERINE);
const envelope = clientEnvelope(TANGERINE);

export const tangerineLinkedinReviewsPack = definePack({
  id: 'tangerine-linkedin-reviews',
  title: 'Tangerine Client Reviews',
  description:
    'Testimonial, press clipping, photo quote and envelope review posts in tangerine and navy, with a story.',
  category: 'social-posts',
  tags: ['review', 'linkedin', 'photo', 'small-business'],
  theme: 'dark',

  designs: [
    word,
    envelope,
    quote,
    paper,
    keys,
    clientStory(TANGERINE),
    reviewWord(LAGOON),
    clientEnvelope(ORCHID),
  ],
});
