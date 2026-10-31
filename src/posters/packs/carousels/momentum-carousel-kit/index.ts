import { definePack } from '../../../pack';
import { FOLDER_STEPS, foldersCover } from './focus-folders';
import { type NotesTheme, notesChecklist, notesCover, notesRows, notesSayTry } from './notes';
import { PLANNER_STEPS, PROMPT_STEPS, plannerCover, promptCover } from './prompt-planner';
import { TIP_STEPS, tipsCover } from './tips';

const MINT: NotesTheme = {
  paper: '#eef3ee',
  ink: '#10231a',
  muted: '#475a50',
  accent: '#15803d',
  highlight: '#bbf7d0',
  card: '#ffffff',
  cardInk: '#10231a',
  font: 'Inter',
};

const notesDeck = [
  notesCover(MINT, {
    name: 'Mira Solano',
    handle: '@mirasolano',
    photo: 'woman-portrait-4',
    title: 'How to Stay\nConsistent',
    hook: 'It is simpler than you think...',
    swipe: 'Swipe to open notes',
    count: '3',
  }),
  notesChecklist(MINT, {
    page: 'Notes | 1 of 3',
    title: 'Track Small Wins\nEvery Single Day',
    items: ['Improve by one percent', 'Fix one weak spot', 'Close open loops', 'Prep for tomorrow'],
  }),
  notesSayTry(MINT, {
    page: 'Notes | 2 of 3',
    title: 'Shrink the\nFirst Step',
    pairs: [
      { label: 'Skip:', quote: '"I will read for a whole hour."' },
      { label: 'Try:', quote: '"Ten pages right after lunch."' },
    ],
  }),
  notesRows(MINT, {
    page: 'Notes | 3 of 3',
    title: 'Stack It on a\nDaily Routine',
    rows: [
      { when: 'After coffee', action: 'Plan the day' },
      { when: 'After lunch', action: 'Walk ten minutes' },
      { when: 'After work', action: 'Tidy the desk' },
    ],
  }),
] as const;

const promptDeck = [promptCover, ...PROMPT_STEPS] as const;
const plannerDeck = [plannerCover, ...PLANNER_STEPS];
const tipsDeck = [tipsCover, ...TIP_STEPS];
const foldersDeck = [foldersCover, ...FOLDER_STEPS];

export const momentumCarouselKitPack = definePack({
  id: 'momentum-carousel-kit',
  title: 'Momentum Carousel Kit',
  description:
    'Five swipeable business carousels on prompts, weekly planning, focus tips, habit notes and growth steps.',
  category: 'carousels',
  tags: ['carousel', 'linkedin', 'b2b', 'tips'],
  theme: 'light',

  designs: [
    ...promptDeck,
    ...plannerDeck,
    ...tipsDeck,
    ...notesDeck,
    ...foldersDeck,
    promptCover,
    PROMPT_STEPS[0],
    PROMPT_STEPS[1],
    plannerCover,
    PLANNER_STEPS[0],
    PLANNER_STEPS[1],
    tipsCover,
    TIP_STEPS[0],
    TIP_STEPS[1],
    notesDeck[0],
    notesDeck[1],
    notesDeck[2],
    foldersCover,
    FOLDER_STEPS[0],
    FOLDER_STEPS[1],
  ],
});
