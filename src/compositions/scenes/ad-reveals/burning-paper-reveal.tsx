import { useId } from 'react';
import { AbsoluteFill, Composition, useCurrentFrame } from 'remotion';
import {
  type BurningPaperRevealProps,
  burningPaperRevealDefaults,
  burningPaperRevealMeta,
  burningPaperRevealSchema,
} from '@/schemas';
import { BrandCard } from '../../burning-paper/brand-card';
import { burnCues, edgeXAt, paperTransform } from '../../burning-paper/burn-cues';
import { svgId } from '../../burning-paper/color';
import { FireLayer } from '../../burning-paper/fire-layer';
import { HeatShimmer } from '../../burning-paper/heat-shimmer';
import { HeldHand } from '../../burning-paper/held-hand';
import { PaperShadow, PaperSheet } from '../../burning-paper/paper-sheet';
import { TwoToneWall } from '../../burning-paper/two-tone-wall';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const BurningPaperReveal = (props: BurningPaperRevealProps) => {
  const id = svgId(useId());
  const frame = useCurrentFrame() * props.motion.speed;
  const cues = burnCues(props, frame);
  const transform = paperTransform(props, cues);
  const glowX = edgeXAt(cues.edge, props.paper.height * 0.15, props.paper.width) + 40;
  return (
    <TransitionFrame motion={props.motion}>
      <AbsoluteFill>
        <svg
          viewBox="0 0 1080 1920"
          width="100%"
          height="100%"
          style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
          role="img"
          aria-label={`${props.copy.kicker} ${props.copy.headline}`}
        >
          <defs>
            <radialGradient id={`${id}-warm`} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor={props.flame.mid} stopOpacity="0.9" />
              <stop offset="0.4" stopColor={props.flame.outer} stopOpacity="0.4" />
              <stop offset="1" stopColor={props.flame.outer} stopOpacity="0" />
            </radialGradient>
          </defs>
          {props.look.showBackdrop ? <TwoToneWall backdrop={props.backdrop} cues={cues} /> : null}
          {props.look.showBackdrop ? (
            <HeatShimmer props={props} cues={cues}>
              <TwoToneWall backdrop={props.backdrop} cues={cues} />
            </HeatShimmer>
          ) : null}
          <g transform={transform}>
            {props.look.showBackdrop ? <PaperShadow props={props} cues={cues} /> : null}
            {props.look.showBackdrop ? (
              <ellipse
                cx={glowX}
                cy={-props.flame.height * 0.2}
                rx={360}
                ry={560}
                fill={`url(#${id}-warm)`}
                opacity={Math.min(1, props.flame.wallGlow * cues.strength * cues.flicker)}
                style={{ mixBlendMode: 'screen' }}
              />
            ) : null}
            <PaperSheet props={props} cues={cues} />
          </g>
        </svg>
        <FireLayer props={props} cues={cues} />
        <HeldHand props={props} cues={cues} />
        <BrandCard card={props.brandCard} frame={frame} />
      </AbsoluteFill>
    </TransitionFrame>
  );
};

export const burningPaperRevealScene: SceneModule = {
  id: 'burning-paper-reveal',
  component: BurningPaperReveal,
  render: (key) => (
    <Composition
      key={key}
      id="burning-paper-reveal"
      component={BurningPaperReveal}
      schema={burningPaperRevealSchema}
      defaultProps={burningPaperRevealDefaults}
      durationInFrames={burningPaperRevealMeta.durationInFrames}
      fps={burningPaperRevealMeta.fps}
      width={burningPaperRevealMeta.width}
      height={burningPaperRevealMeta.height}
    />
  ),
};
