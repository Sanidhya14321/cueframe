import type { ClipModule } from '../../registry';
import { auroraRibbonsDefaults, auroraRibbonsMeta, auroraRibbonsSchema } from './aurora-ribbons';
import { auroraRibbonsControls } from './aurora-ribbons-controls';
import { blurStaggerDefaults, blurStaggerMeta, blurStaggerSchema } from './blur-stagger';
import { blurStaggerControls } from './blur-stagger-controls';
import { borderOrbitDefaults, borderOrbitMeta, borderOrbitSchema } from './border-orbit';
import { borderOrbitControls } from './border-orbit-controls';
import { browserFrameDefaults, browserFrameMeta, browserFrameSchema } from './browser-frame';
import { browserFrameControls } from './browser-frame-controls';
import { countUpDefaults, countUpMeta, countUpSchema } from './count-up';
import { countUpControls } from './count-up-controls';
import { dotWaveDefaults, dotWaveMeta, dotWaveSchema } from './dot-wave';
import { dotWaveControls } from './dot-wave-controls';
import { gradientFlowDefaults, gradientFlowMeta, gradientFlowSchema } from './gradient-flow';
import { gradientFlowControls } from './gradient-flow-controls';
import { gridFlightDefaults, gridFlightMeta, gridFlightSchema } from './grid-flight';
import { gridFlightControls } from './grid-flight-controls';
import { letterCascadeDefaults, letterCascadeMeta, letterCascadeSchema } from './letter-cascade';
import { letterCascadeControls } from './letter-cascade-controls';
import { marqueeLoopDefaults, marqueeLoopMeta, marqueeLoopSchema } from './marquee-loop';
import { marqueeLoopControls } from './marquee-loop-controls';
import { meteorShowerDefaults, meteorShowerMeta, meteorShowerSchema } from './meteor-shower';
import { meteorShowerControls } from './meteor-shower-controls';
import { orbitMarksDefaults, orbitMarksMeta, orbitMarksSchema } from './orbit-marks';
import { orbitMarksControls } from './orbit-marks-controls';
import {
  particleVortexDefaults,
  particleVortexMeta,
  particleVortexSchema,
} from './particle-vortex';
import { particleVortexControls } from './particle-vortex-controls';
import { phoneStackDefaults, phoneStackMeta, phoneStackSchema } from './phone-stack';
import { phoneStackControls } from './phone-stack-controls';
import { prismBarsDefaults, prismBarsMeta, prismBarsSchema } from './prism-bars';
import { prismBarsControls } from './prism-bars-controls';
import { revealWipeDefaults, revealWipeMeta, revealWipeSchema } from './reveal-wipe';
import { revealWipeControls } from './reveal-wipe-controls';
import { rippleFieldDefaults, rippleFieldMeta, rippleFieldSchema } from './ripple-field';
import { rippleFieldControls } from './ripple-field-controls';
import { rollingDigitsDefaults, rollingDigitsMeta, rollingDigitsSchema } from './rolling-digits';
import { rollingDigitsControls } from './rolling-digits-controls';
import { scrambleTitleDefaults, scrambleTitleMeta, scrambleTitleSchema } from './scramble-title';
import { scrambleTitleControls } from './scramble-title-controls';
import { shimmerTitleDefaults, shimmerTitleMeta, shimmerTitleSchema } from './shimmer-title';
import { shimmerTitleControls } from './shimmer-title-controls';
import { shineCalloutDefaults, shineCalloutMeta, shineCalloutSchema } from './shine-callout';
import { shineCalloutControls } from './shine-callout-controls';
import { spotlightCardDefaults, spotlightCardMeta, spotlightCardSchema } from './spotlight-card';
import { spotlightCardControls } from './spotlight-card-controls';
import { springCardsDefaults, springCardsMeta, springCardsSchema } from './spring-cards';
import { springCardsControls } from './spring-cards-controls';
import { typeScanDefaults, typeScanMeta, typeScanSchema } from './type-scan';
import { typeScanControls } from './type-scan-controls';
import { wordFlipDefaults, wordFlipMeta, wordFlipSchema } from './word-flip';
import { wordFlipControls } from './word-flip-controls';
export const importedClips: ClipModule[] = [
  {
    id: 'gradient-flow',
    schema: gradientFlowSchema,
    defaults: gradientFlowDefaults,
    meta: gradientFlowMeta,
    controls: gradientFlowControls,
  },
  {
    id: 'blur-stagger',
    schema: blurStaggerSchema,
    defaults: blurStaggerDefaults,
    meta: blurStaggerMeta,
    controls: blurStaggerControls,
  },
  {
    id: 'letter-cascade',
    schema: letterCascadeSchema,
    defaults: letterCascadeDefaults,
    meta: letterCascadeMeta,
    controls: letterCascadeControls,
  },
  {
    id: 'scramble-title',
    schema: scrambleTitleSchema,
    defaults: scrambleTitleDefaults,
    meta: scrambleTitleMeta,
    controls: scrambleTitleControls,
  },
  {
    id: 'word-flip',
    schema: wordFlipSchema,
    defaults: wordFlipDefaults,
    meta: wordFlipMeta,
    controls: wordFlipControls,
  },
  {
    id: 'type-scan',
    schema: typeScanSchema,
    defaults: typeScanDefaults,
    meta: typeScanMeta,
    controls: typeScanControls,
  },
  {
    id: 'shimmer-title',
    schema: shimmerTitleSchema,
    defaults: shimmerTitleDefaults,
    meta: shimmerTitleMeta,
    controls: shimmerTitleControls,
  },
  {
    id: 'count-up',
    schema: countUpSchema,
    defaults: countUpDefaults,
    meta: countUpMeta,
    controls: countUpControls,
  },
  {
    id: 'rolling-digits',
    schema: rollingDigitsSchema,
    defaults: rollingDigitsDefaults,
    meta: rollingDigitsMeta,
    controls: rollingDigitsControls,
  },
  {
    id: 'spotlight-card',
    schema: spotlightCardSchema,
    defaults: spotlightCardDefaults,
    meta: spotlightCardMeta,
    controls: spotlightCardControls,
  },
  {
    id: 'border-orbit',
    schema: borderOrbitSchema,
    defaults: borderOrbitDefaults,
    meta: borderOrbitMeta,
    controls: borderOrbitControls,
  },
  {
    id: 'marquee-loop',
    schema: marqueeLoopSchema,
    defaults: marqueeLoopDefaults,
    meta: marqueeLoopMeta,
    controls: marqueeLoopControls,
  },
  {
    id: 'ripple-field',
    schema: rippleFieldSchema,
    defaults: rippleFieldDefaults,
    meta: rippleFieldMeta,
    controls: rippleFieldControls,
  },
  {
    id: 'dot-wave',
    schema: dotWaveSchema,
    defaults: dotWaveDefaults,
    meta: dotWaveMeta,
    controls: dotWaveControls,
  },
  {
    id: 'grid-flight',
    schema: gridFlightSchema,
    defaults: gridFlightDefaults,
    meta: gridFlightMeta,
    controls: gridFlightControls,
  },
  {
    id: 'meteor-shower',
    schema: meteorShowerSchema,
    defaults: meteorShowerDefaults,
    meta: meteorShowerMeta,
    controls: meteorShowerControls,
  },
  {
    id: 'orbit-marks',
    schema: orbitMarksSchema,
    defaults: orbitMarksDefaults,
    meta: orbitMarksMeta,
    controls: orbitMarksControls,
  },
  {
    id: 'spring-cards',
    schema: springCardsSchema,
    defaults: springCardsDefaults,
    meta: springCardsMeta,
    controls: springCardsControls,
  },
  {
    id: 'reveal-wipe',
    schema: revealWipeSchema,
    defaults: revealWipeDefaults,
    meta: revealWipeMeta,
    controls: revealWipeControls,
  },
  {
    id: 'browser-frame',
    schema: browserFrameSchema,
    defaults: browserFrameDefaults,
    meta: browserFrameMeta,
    controls: browserFrameControls,
  },
  {
    id: 'phone-stack',
    schema: phoneStackSchema,
    defaults: phoneStackDefaults,
    meta: phoneStackMeta,
    controls: phoneStackControls,
  },
  {
    id: 'shine-callout',
    schema: shineCalloutSchema,
    defaults: shineCalloutDefaults,
    meta: shineCalloutMeta,
    controls: shineCalloutControls,
  },
  {
    id: 'aurora-ribbons',
    schema: auroraRibbonsSchema,
    defaults: auroraRibbonsDefaults,
    meta: auroraRibbonsMeta,
    controls: auroraRibbonsControls,
  },
  {
    id: 'particle-vortex',
    schema: particleVortexSchema,
    defaults: particleVortexDefaults,
    meta: particleVortexMeta,
    controls: particleVortexControls,
  },
  {
    id: 'prism-bars',
    schema: prismBarsSchema,
    defaults: prismBarsDefaults,
    meta: prismBarsMeta,
    controls: prismBarsControls,
  },
];
