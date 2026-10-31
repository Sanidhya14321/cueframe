import type { SceneModule } from '../../scene-module';
import { batteryChargeSuccessScene } from './battery-charge-success';
import { billboardReaderScene } from './billboard-reader';
import { burningPaperRevealScene } from './burning-paper-reveal';
import { crumpledPaperRevealScene } from './crumpled-paper-reveal';
import { elevatorNewspaperScene } from './elevator-newspaper';
import { helicopterUnveilScene } from './helicopter-unveil';
import { mailinfraDeliverabilityChargeScene } from './mailinfra-deliverability-charge';
import { mailinfraSpiderDropScene } from './mailinfra-spider-drop';
import { mailinfraThreadFeaturesScene } from './mailinfra-thread-features';
import { problemStrikeoutScene } from './problem-strikeout';
import { spillRevealScene } from './spill-reveal';
import { streetSignSwapScene } from './street-sign-swap';

export const adRevealsScenes: SceneModule[] = [
  helicopterUnveilScene,
  problemStrikeoutScene,
  spillRevealScene,
  crumpledPaperRevealScene,
  batteryChargeSuccessScene,
  billboardReaderScene,
  burningPaperRevealScene,
  mailinfraSpiderDropScene,
  mailinfraDeliverabilityChargeScene,
  mailinfraThreadFeaturesScene,
  elevatorNewspaperScene,
  streetSignSwapScene,
];
