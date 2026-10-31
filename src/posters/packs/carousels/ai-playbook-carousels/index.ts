import { definePack } from '../../../pack';
import {
  type NotesTheme,
  notesBody,
  notesChecklist,
  notesCover,
  notesRows,
} from '../momentum-carousel-kit/notes';
import { COMMENT_STEPS, commentsCover } from './comment-cards';
import { NUMBER_STEPS, numbersCover, PILL_STEPS, pillsCover } from './pills-numbers';
import { STRATEGY_STEPS, searchCover } from './strategy-cards';

const NIGHT: NotesTheme = {
  paper: '#0c1211',
  ink: '#ffffff',
  muted: '#b9c8c4',
  accent: '#2dd4bf',
  highlight: 'rgba(45,212,191,0.32)',
  card: '#ffffff',
  cardInk: '#0c1211',
  font: 'Plus Jakarta Sans',
};

const notesDeck = [
  notesCover(NIGHT, {
    name: 'Owen Blake',
    handle: '@owenblake',
    photo: 'man-portrait-3',
    title: 'Planning With\nAI Assistants',
    hook: 'It is changing how you work.',
    swipe: 'Swipe to view notes',
    count: '4',
  }),
  notesBody(NIGHT, {
    page: 'Notes | 1 of 4',
    title: 'Get Better at\nPrompting',
    body: 'Go past one line questions. Iterate on the prompt, add examples and set clear limits, and you will get sharper drafts that match the brief.',
  }),
  notesChecklist(NIGHT, {
    page: 'Notes | 2 of 4',
    title: 'Where People\nStill Win',
    items: ['Judgement', 'Taste', 'Strategy', 'Trust'],
  }),
  notesRows(NIGHT, {
    page: 'Notes | 3 of 4',
    title: 'Keep Your\nOwn Voice',
    rows: [
      { when: 'Draft fast', action: 'Edit slowly' },
      { when: 'Ask AI', action: 'Decide yourself' },
      { when: 'Reuse ideas', action: 'Add your story' },
    ],
  }),
] as const;

const commentsDeck = [commentsCover, ...COMMENT_STEPS] as const;
const pillsDeck = [pillsCover, ...PILL_STEPS] as const;
const strategyDeck = [searchCover, ...STRATEGY_STEPS] as const;
const numbersDeck = [numbersCover, ...NUMBER_STEPS] as const;

export const aiPlaybookCarouselsPack = definePack({
  id: 'ai-playbook-carousels',
  title: 'AI Playbook Carousels',
  description:
    'Five teal business carousels that teach teams how to prompt, plan and work smarter with AI tools.',
  category: 'carousels',
  tags: ['carousel', 'linkedin', 'ai', 'b2b'],
  theme: 'light',

  designs: [
    ...commentsDeck,
    ...notesDeck,
    ...pillsDeck,
    ...strategyDeck,
    ...numbersDeck,
    commentsDeck[0],
    commentsDeck[1],
    commentsDeck[2],
    notesDeck[0],
    notesDeck[1],
    notesDeck[2],
    pillsDeck[0],
    pillsDeck[1],
    pillsDeck[2],
    strategyDeck[0],
    strategyDeck[1],
    strategyDeck[2],
    numbersDeck[0],
    numbersDeck[1],
    numbersDeck[2],
  ],
});
