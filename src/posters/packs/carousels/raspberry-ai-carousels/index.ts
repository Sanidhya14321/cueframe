import { definePack } from '../../../pack';
import { QUESTION_SERIES } from './questions';
import { SKILL_SERIES } from './skills';
import { SHIFT_SERIES } from './ways';

export const raspberryAiCarouselsPack = definePack({
  id: 'raspberry-ai-carousels',
  title: 'Raspberry AI Carousels',
  description:
    'Three LinkedIn carousels about AI skills, marketing shifts and big questions in a raspberry gradient.',
  category: 'carousels',
  tags: ['carousel', 'linkedin', 'ai', 'gradient'],
  theme: 'light',

  designs: [...SHIFT_SERIES, ...SKILL_SERIES, ...QUESTION_SERIES],
});
