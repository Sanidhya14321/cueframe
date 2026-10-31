import { definePack } from '../../../pack';
import { engineerResume } from './resume';
import { engineerCardBack, engineerCardFront, engineerLetter } from './stationery';

export const graphiteStackEngineerPack = definePack({
  id: 'graphite-stack-engineer',
  title: 'Graphite Stack Engineer',
  description:
    'A dark tiled software engineer resume in graphite, crimson and amber, with a cover letter and business cards.',
  category: 'resumes',
  tags: ['resume', 'business-card', 'saas', 'b2b'],
  theme: 'dark',

  designs: [engineerResume, engineerCardFront, engineerCardBack, engineerLetter],
});
