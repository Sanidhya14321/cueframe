import type { Template } from '../../../kit';
import { definePack } from '../../../pack';
import {
  brandCover,
  brandGap,
  brandNext,
  brandPeople,
  sentenceClear,
  sentenceConvert,
  sentenceEngage,
  sentencesCover,
} from './slides-bold';
import { noteDisconnect, noteFramework, noteShift, notesCover } from './slides-notes';
import {
  attractCover,
  goalAuthority,
  goalRevenue,
  goalSystems,
  goalsCover,
  lessonKnown,
  lessonMemorable,
  lessonPull,
} from './slides-paper';

const GOALS: readonly Template[] = [goalsCover, goalAuthority, goalSystems, goalRevenue];
const BRAND: readonly Template[] = [brandCover, brandPeople, brandGap, brandNext];
const NOTES: readonly Template[] = [notesCover, noteDisconnect, noteFramework, noteShift];
const LESSONS: readonly Template[] = [attractCover, lessonPull, lessonKnown, lessonMemorable];
const SENTENCES: readonly Template[] = [
  sentencesCover,
  sentenceClear,
  sentenceEngage,
  sentenceConvert,
];

export const tomatoSketchCarouselsPack = definePack({
  id: 'tomato-sketch-carousels',
  title: 'Tomato Sketch Carousels',
  description:
    'Five LinkedIn carousels in tomato red, ink and sketchbook paper with doodles, sticky notes and bold statements.',
  category: 'carousels',
  tags: ['carousel', 'linkedin', 'b2b', 'tips', 'quote'],
  theme: 'light',

  designs: [...GOALS, ...BRAND, ...NOTES, ...LESSONS, ...SENTENCES],
});
