import { definePack } from '../../../pack';
import { designerResume } from './resume';
import { designerCardBack, designerCardFront, designerLetter } from './stationery';

export const loopLineDesignerPack = definePack({
  id: 'loop-line-designer',
  title: 'Loop Line Designer',
  description:
    'A playful graphic designer resume on a plum grid with lime swirls, plus a cover letter and business cards.',
  category: 'resumes',
  tags: ['resume', 'business-card', 'freelance', 'neon'],
  theme: 'dark',

  designs: [designerResume, designerCardFront, designerCardBack, designerLetter],
});
