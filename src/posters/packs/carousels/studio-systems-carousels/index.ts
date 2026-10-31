import { definePack } from '../../../pack';
import { bubblesCover, LESSON_STEPS } from './bubbles';
import { SLIDER_STEPS, slidersCover, WINDOW_STEPS, windowsCover } from './windows-sliders';

const windowsDeck = [windowsCover, ...WINDOW_STEPS] as const;
const lessonsDeck = [bubblesCover, ...LESSON_STEPS] as const;
const slidersDeck = [slidersCover, ...SLIDER_STEPS] as const;

export const studioSystemsCarouselsPack = definePack({
  id: 'studio-systems-carousels',
  title: 'Studio Systems Carousels',
  description:
    'Three navy and sky blue carousels about design systems, AI lessons and working faster with templates.',
  category: 'carousels',
  tags: ['carousel', 'instagram', 'saas', 'ai'],
  theme: 'dark',

  designs: [
    ...windowsDeck,
    ...lessonsDeck,
    ...slidersDeck,
    windowsDeck[0],
    windowsDeck[1],
    windowsDeck[2],
    lessonsDeck[0],
    lessonsDeck[1],
    lessonsDeck[2],
    slidersDeck[0],
    slidersDeck[1],
    slidersDeck[2],
  ],
});
