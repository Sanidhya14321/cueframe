import { definePack } from '../../../pack';
import { realtorResume } from './resume';
import { realtorCardBack, realtorCardFront, realtorLetter } from './stationery';

export const roseMarbleRealtorPack = definePack({
  id: 'rose-marble-realtor',
  title: 'Rose Marble Realtor',
  description:
    'An elegant real estate agent resume in dusty rose and navy marble, with a matching cover letter and business cards.',
  category: 'resumes',
  tags: ['resume', 'business-card', 'real-estate', 'photo'],
  theme: 'light',

  designs: [realtorResume, realtorCardFront, realtorCardBack, realtorLetter],
});
