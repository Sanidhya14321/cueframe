import { definePack } from '../../../pack';
import { developerResume } from './resume';
import { developerCardBack, developerCardFront, developerLetter } from './stationery';

export const skylineWebDeveloperPack = definePack({
  id: 'skyline-web-developer',
  title: 'Skyline Web Developer',
  description:
    'A clean navy and sky blue web developer resume with a timeline layout, cover letter and business cards.',
  category: 'resumes',
  tags: ['resume', 'business-card', 'saas', 'corporate'],
  theme: 'light',

  designs: [developerResume, developerCardFront, developerCardBack, developerLetter],
});
