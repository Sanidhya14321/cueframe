import type { Poster } from '../pack';
import { CAROUSEL_PACKS } from './carousels';
import { LIFESTYLE_PACKS } from './lifestyle';
import { PITCH_DECK_PACKS } from './pitch-decks';
import { RESUME_PACKS } from './resumes';
import { SEASONAL_PACKS } from './seasonal';
import { SOCIAL_POST_PACKS } from './social-posts';
import { SPORTS_PACKS } from './sports';

export const POSTERS: readonly Poster[] = [
  ...SOCIAL_POST_PACKS,
  ...CAROUSEL_PACKS,
  ...PITCH_DECK_PACKS,
  ...RESUME_PACKS,
  ...SPORTS_PACKS,
  ...SEASONAL_PACKS,
  ...LIFESTYLE_PACKS,
];
