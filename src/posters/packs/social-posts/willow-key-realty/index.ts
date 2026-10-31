import { definePack } from '../../../pack';
import { justSold, newListing, openHouse, trueFalse } from './posts';
import {
  buyerChecklist,
  clientReview,
  clientReviewStory,
  faqSearch,
  townhomes,
} from './posts-more';

const POSTS = [
  newListing,
  clientReview,
  openHouse,
  justSold,
  buyerChecklist,
  townhomes,
  trueFalse,
  faqSearch,
];

export const willowKeyRealtyPack = definePack({
  id: 'willow-key-realty',
  title: 'Willow Key Realty',
  description:
    'New listing, open house, just sold, review and buyer tip posts for a real estate agent in sage, cream and brass.',
  category: 'social-posts',
  tags: ['real-estate', 'instagram', 'story', 'photo'],
  theme: 'light',

  designs: [
    ...POSTS,
    trueFalse,
    newListing,
    openHouse,
    justSold,
    buyerChecklist,
    clientReview,
    townhomes,
    faqSearch,
    clientReviewStory,
  ],
});
