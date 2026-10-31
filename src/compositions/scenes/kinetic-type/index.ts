import type { SceneModule } from '../../scene-module';
import { anniversaryKineticScene } from './anniversary-kinetic';
import { brandingIsTickerScene } from './branding-is-ticker';
import { chunkyTypeStackScene } from './chunky-type-stack';
import { circlePopScene } from './circle-pop';
import { comingSoonFlipsScene } from './coming-soon-flips';
import { dominoWordsScene } from './domino-words';
import { echoStackScene } from './echo-stack';
import { gridStackScene } from './grid-stack';
import { hangingWordsScene } from './hanging-words';
import { lensOrbitScene } from './lens-orbit';
import { outlineMarqueeScene } from './outline-marquee';
import { ribbonWordsScene } from './ribbon-words';
import { scrollerCalloutScene } from './scroller-callout';
import { scrollerWallScene } from './scroller-wall';
import { stickerStackScene } from './sticker-stack';
import { textRingsScene } from './text-rings';
import { wordBuildScene } from './word-build';
import { wordFieldScene } from './word-field';
import { wordPunchScene } from './word-punch';
import { wordStreamsScene } from './word-streams';

export const kineticTypeScenes: SceneModule[] = [
  wordBuildScene,
  wordPunchScene,
  wordStreamsScene,
  outlineMarqueeScene,
  echoStackScene,
  gridStackScene,
  hangingWordsScene,
  lensOrbitScene,
  wordFieldScene,
  stickerStackScene,
  chunkyTypeStackScene,
  circlePopScene,
  brandingIsTickerScene,
  dominoWordsScene,
  scrollerCalloutScene,
  scrollerWallScene,
  ribbonWordsScene,
  anniversaryKineticScene,
  comingSoonFlipsScene,
  textRingsScene,
];
