import type { ClipModule } from '../../registry';
import {
  anniversaryKineticDefaults,
  anniversaryKineticMeta,
  anniversaryKineticSchema,
} from './anniversary-kinetic';
import { anniversaryKineticControls } from './anniversary-kinetic-controls';
import {
  brandingIsTickerDefaults,
  brandingIsTickerMeta,
  brandingIsTickerSchema,
} from './branding-is-ticker';
import { brandingIsTickerControls } from './branding-is-ticker-controls';
import {
  chunkyTypeStackDefaults,
  chunkyTypeStackMeta,
  chunkyTypeStackSchema,
} from './chunky-type-stack';
import { chunkyTypeStackControls } from './chunky-type-stack-controls';
import { circlePopDefaults, circlePopMeta, circlePopSchema } from './circle-pop';
import { circlePopControls } from './circle-pop-controls';
import {
  comingSoonFlipsDefaults,
  comingSoonFlipsMeta,
  comingSoonFlipsSchema,
} from './coming-soon-flips';
import { comingSoonFlipsControls } from './coming-soon-flips-controls';
import { dominoWordsDefaults, dominoWordsMeta, dominoWordsSchema } from './domino-words';
import { dominoWordsControls } from './domino-words-controls';
import { echoStackDefaults, echoStackMeta, echoStackSchema } from './echo-stack';
import { echoStackControls } from './echo-stack-controls';
import { gridStackDefaults, gridStackMeta, gridStackSchema } from './grid-stack';
import { gridStackControls } from './grid-stack-controls';
import { hangingWordsDefaults, hangingWordsMeta, hangingWordsSchema } from './hanging-words';
import { hangingWordsControls } from './hanging-words-controls';
import { lensOrbitDefaults, lensOrbitMeta, lensOrbitSchema } from './lens-orbit';
import { lensOrbitControls } from './lens-orbit-controls';
import {
  outlineMarqueeDefaults,
  outlineMarqueeMeta,
  outlineMarqueeSchema,
} from './outline-marquee';
import { outlineMarqueeControls } from './outline-marquee-controls';
import { ribbonWordsDefaults, ribbonWordsMeta, ribbonWordsSchema } from './ribbon-words';
import { ribbonWordsControls } from './ribbon-words-controls';
import {
  scrollerCalloutDefaults,
  scrollerCalloutMeta,
  scrollerCalloutSchema,
} from './scroller-callout';
import { scrollerCalloutControls } from './scroller-callout-controls';
import { scrollerWallDefaults, scrollerWallMeta, scrollerWallSchema } from './scroller-wall';
import { scrollerWallControls } from './scroller-wall-controls';
import { stickerStackDefaults, stickerStackMeta, stickerStackSchema } from './sticker-stack';
import { stickerStackControls } from './sticker-stack-controls';
import { textRingsDefaults, textRingsMeta, textRingsSchema } from './text-rings';
import { textRingsControls } from './text-rings-controls';
import { wordBuildDefaults, wordBuildMeta, wordBuildSchema } from './word-build';
import { wordBuildControls } from './word-build-controls';
import { wordFieldDefaults, wordFieldMeta, wordFieldSchema } from './word-field';
import { wordFieldControls } from './word-field-controls';
import { wordPunchDefaults, wordPunchMeta, wordPunchSchema } from './word-punch';
import { wordPunchControls } from './word-punch-controls';
import { wordStreamsDefaults, wordStreamsMeta, wordStreamsSchema } from './word-streams';
import { wordStreamsControls } from './word-streams-controls';

export const kineticTypeClips: ClipModule[] = [
  {
    id: 'word-build',
    schema: wordBuildSchema,
    defaults: wordBuildDefaults,
    meta: wordBuildMeta,
    controls: wordBuildControls,
  },
  {
    id: 'word-punch',
    schema: wordPunchSchema,
    defaults: wordPunchDefaults,
    meta: wordPunchMeta,
    controls: wordPunchControls,
  },
  {
    id: 'word-streams',
    schema: wordStreamsSchema,
    defaults: wordStreamsDefaults,
    meta: wordStreamsMeta,
    controls: wordStreamsControls,
  },
  {
    id: 'outline-marquee',
    schema: outlineMarqueeSchema,
    defaults: outlineMarqueeDefaults,
    meta: outlineMarqueeMeta,
    controls: outlineMarqueeControls,
  },
  {
    id: 'echo-stack',
    schema: echoStackSchema,
    defaults: echoStackDefaults,
    meta: echoStackMeta,
    controls: echoStackControls,
  },
  {
    id: 'grid-stack',
    schema: gridStackSchema,
    defaults: gridStackDefaults,
    meta: gridStackMeta,
    controls: gridStackControls,
  },
  {
    id: 'hanging-words',
    schema: hangingWordsSchema,
    defaults: hangingWordsDefaults,
    meta: hangingWordsMeta,
    controls: hangingWordsControls,
  },
  {
    id: 'lens-orbit',
    schema: lensOrbitSchema,
    defaults: lensOrbitDefaults,
    meta: lensOrbitMeta,
    controls: lensOrbitControls,
  },
  {
    id: 'word-field',
    schema: wordFieldSchema,
    defaults: wordFieldDefaults,
    meta: wordFieldMeta,
    controls: wordFieldControls,
  },
  {
    id: 'sticker-stack',
    schema: stickerStackSchema,
    defaults: stickerStackDefaults,
    meta: stickerStackMeta,
    controls: stickerStackControls,
  },
  {
    id: 'chunky-type-stack',
    schema: chunkyTypeStackSchema,
    defaults: chunkyTypeStackDefaults,
    meta: chunkyTypeStackMeta,
    controls: chunkyTypeStackControls,
  },
  {
    id: 'circle-pop',
    schema: circlePopSchema,
    defaults: circlePopDefaults,
    meta: circlePopMeta,
    controls: circlePopControls,
  },
  {
    id: 'branding-is-ticker',
    schema: brandingIsTickerSchema,
    defaults: brandingIsTickerDefaults,
    meta: brandingIsTickerMeta,
    controls: brandingIsTickerControls,
  },
  {
    id: 'domino-words',
    schema: dominoWordsSchema,
    defaults: dominoWordsDefaults,
    meta: dominoWordsMeta,
    controls: dominoWordsControls,
  },
  {
    id: 'scroller-callout',
    schema: scrollerCalloutSchema,
    defaults: scrollerCalloutDefaults,
    meta: scrollerCalloutMeta,
    controls: scrollerCalloutControls,
  },
  {
    id: 'scroller-wall',
    schema: scrollerWallSchema,
    defaults: scrollerWallDefaults,
    meta: scrollerWallMeta,
    controls: scrollerWallControls,
  },
  {
    id: 'ribbon-words',
    schema: ribbonWordsSchema,
    defaults: ribbonWordsDefaults,
    meta: ribbonWordsMeta,
    controls: ribbonWordsControls,
  },
  {
    id: 'anniversary-kinetic',
    schema: anniversaryKineticSchema,
    defaults: anniversaryKineticDefaults,
    meta: anniversaryKineticMeta,
    controls: anniversaryKineticControls,
  },
  {
    id: 'coming-soon-flips',
    schema: comingSoonFlipsSchema,
    defaults: comingSoonFlipsDefaults,
    meta: comingSoonFlipsMeta,
    controls: comingSoonFlipsControls,
  },
  {
    id: 'text-rings',
    schema: textRingsSchema,
    defaults: textRingsDefaults,
    meta: textRingsMeta,
    controls: textRingsControls,
  },
];
