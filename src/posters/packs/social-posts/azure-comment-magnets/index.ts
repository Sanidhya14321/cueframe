import { definePack } from '../../../pack';
import { AZURE, closeTo, dontSkip, FUCHSIA, wordBoxes } from './posts';
import { expertsFolder, gotMail, pollStory } from './posts-more';

const WORDS = wordBoxes(AZURE);
const CLOSE = closeTo(AZURE);
const MAIL = gotMail(AZURE);
const SKIP = dontSkip(AZURE);
const FOLDER = expertsFolder(AZURE);

export const azureCommentMagnetsPack = definePack({
  id: 'azure-comment-magnets',
  title: 'Azure Comment Magnets',
  description:
    'Comment-driving engagement posts for tiny businesses in electric blue, ink and white, with a poll story.',
  category: 'social-posts',
  tags: ['small-business', 'instagram', 'quiz', 'story'],
  theme: 'dark',

  designs: [
    WORDS,
    CLOSE,
    FOLDER,
    SKIP,
    MAIL,
    pollStory(AZURE),
    expertsFolder(FUCHSIA),
    dontSkip(FUCHSIA),
  ],
});
