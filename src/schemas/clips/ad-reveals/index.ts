import type { ClipModule } from '../../registry';
import {
  batteryChargeSuccessDefaults,
  batteryChargeSuccessMeta,
  batteryChargeSuccessSchema,
} from './battery-charge-success';
import { batteryChargeSuccessControls } from './battery-charge-success-controls';
import {
  billboardReaderDefaults,
  billboardReaderMeta,
  billboardReaderSchema,
} from './billboard-reader';
import { billboardReaderControls } from './billboard-reader-controls';
import {
  burningPaperRevealDefaults,
  burningPaperRevealMeta,
  burningPaperRevealSchema,
} from './burning-paper-reveal';
import { burningPaperRevealControls } from './burning-paper-reveal-controls';
import {
  crumpledPaperRevealDefaults,
  crumpledPaperRevealMeta,
  crumpledPaperRevealSchema,
} from './crumpled-paper-reveal';
import { crumpledPaperRevealControls } from './crumpled-paper-reveal-controls';
import {
  elevatorNewspaperDefaults,
  elevatorNewspaperMeta,
  elevatorNewspaperSchema,
} from './elevator-newspaper';
import { elevatorNewspaperControls } from './elevator-newspaper-controls';
import {
  helicopterUnveilDefaults,
  helicopterUnveilMeta,
  helicopterUnveilSchema,
} from './helicopter-unveil';
import { helicopterUnveilControls } from './helicopter-unveil-controls';
import {
  mailinfraDeliverabilityChargeDefaults,
  mailinfraDeliverabilityChargeMeta,
  mailinfraDeliverabilityChargeSchema,
} from './mailinfra-deliverability-charge';
import { mailinfraDeliverabilityChargeControls } from './mailinfra-deliverability-charge-controls';
import {
  mailinfraSpiderDropDefaults,
  mailinfraSpiderDropMeta,
  mailinfraSpiderDropSchema,
} from './mailinfra-spider-drop';
import { mailinfraSpiderDropControls } from './mailinfra-spider-drop-controls';
import {
  mailinfraThreadFeaturesDefaults,
  mailinfraThreadFeaturesMeta,
  mailinfraThreadFeaturesSchema,
} from './mailinfra-thread-features';
import { mailinfraThreadFeaturesControls } from './mailinfra-thread-features-controls';
import {
  problemStrikeoutDefaults,
  problemStrikeoutMeta,
  problemStrikeoutSchema,
} from './problem-strikeout';
import { problemStrikeoutControls } from './problem-strikeout-controls';
import { spillRevealDefaults, spillRevealMeta, spillRevealSchema } from './spill-reveal';
import { spillRevealControls } from './spill-reveal-controls';
import {
  streetSignSwapDefaults,
  streetSignSwapMeta,
  streetSignSwapSchema,
} from './street-sign-swap';
import { streetSignSwapControls } from './street-sign-swap-controls';

export const adRevealsClips: ClipModule[] = [
  {
    id: 'helicopter-unveil',
    schema: helicopterUnveilSchema,
    defaults: helicopterUnveilDefaults,
    meta: helicopterUnveilMeta,
    controls: helicopterUnveilControls,
  },
  {
    id: 'problem-strikeout',
    schema: problemStrikeoutSchema,
    defaults: problemStrikeoutDefaults,
    meta: problemStrikeoutMeta,
    controls: problemStrikeoutControls,
  },
  {
    id: 'spill-reveal',
    schema: spillRevealSchema,
    defaults: spillRevealDefaults,
    meta: spillRevealMeta,
    controls: spillRevealControls,
  },
  {
    id: 'crumpled-paper-reveal',
    schema: crumpledPaperRevealSchema,
    defaults: crumpledPaperRevealDefaults,
    meta: crumpledPaperRevealMeta,
    controls: crumpledPaperRevealControls,
  },
  {
    id: 'battery-charge-success',
    schema: batteryChargeSuccessSchema,
    defaults: batteryChargeSuccessDefaults,
    meta: batteryChargeSuccessMeta,
    controls: batteryChargeSuccessControls,
  },
  {
    id: 'billboard-reader',
    schema: billboardReaderSchema,
    defaults: billboardReaderDefaults,
    meta: billboardReaderMeta,
    controls: billboardReaderControls,
  },
  {
    id: 'burning-paper-reveal',
    schema: burningPaperRevealSchema,
    defaults: burningPaperRevealDefaults,
    meta: burningPaperRevealMeta,
    controls: burningPaperRevealControls,
  },
  {
    id: 'mailinfra-spider-drop',
    schema: mailinfraSpiderDropSchema,
    defaults: mailinfraSpiderDropDefaults,
    meta: mailinfraSpiderDropMeta,
    controls: mailinfraSpiderDropControls,
  },
  {
    id: 'mailinfra-deliverability-charge',
    schema: mailinfraDeliverabilityChargeSchema,
    defaults: mailinfraDeliverabilityChargeDefaults,
    meta: mailinfraDeliverabilityChargeMeta,
    controls: mailinfraDeliverabilityChargeControls,
  },
  {
    id: 'mailinfra-thread-features',
    schema: mailinfraThreadFeaturesSchema,
    defaults: mailinfraThreadFeaturesDefaults,
    meta: mailinfraThreadFeaturesMeta,
    controls: mailinfraThreadFeaturesControls,
  },
  {
    id: 'elevator-newspaper',
    schema: elevatorNewspaperSchema,
    defaults: elevatorNewspaperDefaults,
    meta: elevatorNewspaperMeta,
    controls: elevatorNewspaperControls,
  },
  {
    id: 'street-sign-swap',
    schema: streetSignSwapSchema,
    defaults: streetSignSwapDefaults,
    meta: streetSignSwapMeta,
    controls: streetSignSwapControls,
  },
];
