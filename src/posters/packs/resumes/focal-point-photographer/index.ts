import { definePack } from '../../../pack';
import { photographerResume } from './resume';
import { photographerCardBack, photographerCardFront, photographerLetter } from './stationery';

export const focalPointPhotographerPack = definePack({
  id: 'focal-point-photographer',
  title: 'Focal Point Photographer',
  description:
    'A slanted-band photographer resume with a matching cover letter and business cards in deep teal and amber.',
  category: 'resumes',
  tags: ['resume', 'business-card', 'freelance', 'photo'],
  theme: 'light',

  designs: [photographerResume, photographerCardFront, photographerCardBack, photographerLetter],
});
