import { definePack } from '../../../pack';
import { cardBack, cardFront, coverLetter } from './letter';
import { resume } from './resume';

export const blueprintGridResumePack = definePack({
  id: 'blueprint-grid-resume',
  title: 'Blueprint Grid Resume',
  description:
    'A minimalist designer resume on grid paper with selection-box headings, matching cover letter and cards.',
  category: 'resumes',
  tags: ['resume', 'business-card', 'freelance', 'photo'],
  theme: 'light',

  designs: [resume, cardFront, cardBack, coverLetter],
});
