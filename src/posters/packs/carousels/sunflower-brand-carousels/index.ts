import type { Template } from '../../../kit';
import { definePack } from '../../../pack';
import {
  brandingCover,
  brandingImage,
  brandingSalesperson,
  brandingVersus,
} from './slides-branding';
import {
  stepClients,
  stepShowUp,
  stepsCover,
  stepTrust,
  tipAudience,
  tipConsistent,
  tipsCover,
  tipValues,
} from './slides-dark';
import { leadQuestions, leadSpeed, leadsCover, leadValue } from './slides-leads';
import { consistencyCover, loopSlide, smarterSlide, strategySlide } from './slides-light';

const CONSISTENCY: readonly Template[] = [consistencyCover, smarterSlide, loopSlide, strategySlide];
const TIPS: readonly Template[] = [tipsCover, tipConsistent, tipAudience, tipValues];
const BRANDING: readonly Template[] = [
  brandingCover,
  brandingImage,
  brandingVersus,
  brandingSalesperson,
];
const STEPS: readonly Template[] = [stepsCover, stepTrust, stepClients, stepShowUp];
const LEADS: readonly Template[] = [leadsCover, leadSpeed, leadQuestions, leadValue];

export const sunflowerBrandCarouselsPack = definePack({
  id: 'sunflower-brand-carousels',
  title: 'Sunflower Brand Carousels',
  description:
    'Five LinkedIn carousels in cream, charcoal and glowing sunflower yellow about branding, consistency and converting leads.',
  category: 'carousels',
  tags: ['carousel', 'linkedin', 'b2b', 'tips', 'comparison'],
  theme: 'light',

  designs: [...CONSISTENCY, ...TIPS, ...BRANDING, ...STEPS, ...LEADS],
});
