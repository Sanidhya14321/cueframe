import { definePack } from '../../../pack';
import { cardBack, cardFront, coverLetter } from './letter';
import { resume } from './resume';

export const garnetMonogramResumePack = definePack({
  id: 'garnet-monogram-resume',
  title: 'Garnet Monogram Resume',
  description:
    'A bold sectioned resume with a hexagon monogram, matching cover letter and business cards in wine and rose.',
  category: 'resumes',
  tags: ['resume', 'business-card', 'corporate', 'freelance'],
  theme: 'light',

  designs: [resume, cardFront, cardBack, coverLetter],
});
