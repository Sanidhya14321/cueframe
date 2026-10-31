import { definePack } from '../../../pack';
import { resumeWins } from './achievements';
import { cardBack, cardFront } from './cards';
import { coverLetter } from './letter';
import { resumeMain } from './resume';

export const tidepoolAppResumePack = definePack({
  id: 'tidepool-app-resume',
  title: 'Tidepool App Resume',
  description:
    'A phone-screen inspired two page resume with matching cover letter and business cards in teal and coral.',
  category: 'resumes',
  tags: ['resume', 'business-card', 'freelance', 'photo'],
  theme: 'light',

  designs: [resumeMain, cardFront, cardBack, resumeWins, coverLetter],
});
