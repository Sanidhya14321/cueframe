import type { Poster } from '../../pack';
import { burgundyEnterpriseDeckPack } from './burgundy-enterprise-deck';
import { chartreuseAiEnterpriseDeckPack } from './chartreuse-ai-enterprise-deck';
import { coralB2bAgencyDeckPack } from './coral-b2b-agency-deck';
import { emberB2bDeckPack } from './ember-b2b-deck';
import { evergreenAiSaasDeckPack } from './evergreen-ai-saas-deck';
import { lagoonMobileDeckPack } from './lagoon-mobile-deck';
import { tealGlowSaasDeckPack } from './teal-glow-saas-deck';

export const PITCH_DECK_PACKS: Poster[] = [
  ...burgundyEnterpriseDeckPack,
  ...chartreuseAiEnterpriseDeckPack,
  ...coralB2bAgencyDeckPack,
  ...emberB2bDeckPack,
  ...evergreenAiSaasDeckPack,
  ...lagoonMobileDeckPack,
  ...tealGlowSaasDeckPack,
];
