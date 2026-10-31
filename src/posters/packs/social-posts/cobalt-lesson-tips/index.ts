import { definePack } from '../../../pack';
import { COBALT, CRIMSON, lessIsMore, sellProblem, toDoTools } from './posts';
import { targeting, turnSuccess } from './posts-more';

const SELL = sellProblem(COBALT);
const TODO = toDoTools(COBALT);
const LESS = lessIsMore(COBALT);
const TARGET = targeting(COBALT);
const SUCCESS = turnSuccess(COBALT);
const POSTS = [SELL, TODO, LESS, TARGET, SUCCESS];

export const cobaltLessonTipsPack = definePack({
  id: 'cobalt-lesson-tips',
  title: 'Cobalt Lesson Tips',
  description:
    'Educational tip posts for small business marketing in cobalt, black and white, with matching stories.',
  category: 'social-posts',
  tags: ['tips', 'instagram', 'small-business', 'story'],
  theme: 'dark',

  designs: [SELL, TODO, LESS, TARGET, SUCCESS, lessIsMore(CRIMSON), toDoTools(CRIMSON), ...POSTS],
});
