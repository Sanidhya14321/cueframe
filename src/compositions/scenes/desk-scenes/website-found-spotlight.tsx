import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type WebsiteFoundSpotlightProps,
  websiteFoundSpotlightDefaults,
  websiteFoundSpotlightMeta,
  websiteFoundSpotlightSchema,
} from '@/schemas';
import { LensOverlay } from '../../promo/desk/lens';
import { PromoLayer } from '../../promo/promo-layer';
import { turn, tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';
import { EndCard } from '../../website-found-spotlight/end-card';
import { lightCue } from '../../website-found-spotlight/light-cues';
import { PosterCopy } from '../../website-found-spotlight/poster-copy';
import { SpotlightStage } from '../../website-found-spotlight/spotlight-stage';

type EndCardLook = WebsiteFoundSpotlightProps['endCard'];

const FEATHER = 90;

interface Iris {
  mask: string;
  glow: string;
}

const iris = (card: EndCardLook, elapsed: number, width: number, height: number): Iris | null => {
  if (elapsed >= card.irisFrames) {
    return null;
  }
  const x = card.irisX * width;
  const y = card.irisY * height;
  const reach = Math.hypot(Math.max(x, width - x), Math.max(y, height - y));
  const radius = tween(elapsed + 1, [0, card.irisFrames], [0, reach + FEATHER], turn);
  const inner = Math.max(0, radius - FEATHER);
  const strength = Math.round(70 * (1 - (elapsed + 1) / card.irisFrames));
  const at = `circle at ${x}px ${y}px`;
  const bloom = Math.round(85 * tween(elapsed, [0, card.irisFrames * 0.45], [1, 0]));
  return {
    mask: `radial-gradient(${at}, #000 ${inner}px, transparent ${radius}px)`,
    glow: `radial-gradient(${at}, transparent ${Math.max(0, inner - 60)}px, color-mix(in oklab, ${card.beam} ${strength}%, transparent) ${inner + FEATHER * 0.4}px, transparent ${radius + 50}px), radial-gradient(${at}, color-mix(in oklab, ${card.beam} ${bloom}%, transparent) 0px, transparent ${FEATHER + radius * 0.6}px)`,
  };
};

const WebsiteFoundSpotlight = (props: WebsiteFoundSpotlightProps) => {
  const { look, motion, palette, camera, endCard, timing, copy } = props;
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame() * motion.speed;
  const elapsed = frame - timing.endCardStart;
  const ending = endCard.show && elapsed >= 0;
  const opening = ending ? iris(endCard, elapsed, width, height) : null;
  const sceneVisible = !ending || opening !== null;
  return (
    <PromoLayer look={{ ...look, showBackdrop: false }} motion={motion}>
      {sceneVisible ? (
        <>
          {look.showBackdrop ? (
            <AbsoluteFill
              style={{
                background: `linear-gradient(180deg, ${palette.skyEdge} 0%, ${palette.sky} 45%, ${palette.sky} 100%)`,
              }}
            />
          ) : null}
          <SpotlightStage props={props} frame={frame} cue={lightCue(timing, frame)} />
          {look.showBackdrop ? (
            <LensOverlay grain={camera.grain} vignette={camera.vignette} />
          ) : null}
          <PosterCopy props={props} />
        </>
      ) : null}
      {ending ? (
        <AbsoluteFill style={{ maskImage: opening?.mask, WebkitMaskImage: opening?.mask }}>
          <EndCard card={endCard} markLetter={copy.markLetter} elapsed={elapsed} />
        </AbsoluteFill>
      ) : null}
      {opening ? <AbsoluteFill style={{ background: opening.glow }} /> : null}
    </PromoLayer>
  );
};

export const websiteFoundSpotlightScene: SceneModule = {
  id: 'website-found-spotlight',
  component: WebsiteFoundSpotlight,
  render: (key) => (
    <Composition
      key={key}
      id="website-found-spotlight"
      component={WebsiteFoundSpotlight}
      schema={websiteFoundSpotlightSchema}
      defaultProps={websiteFoundSpotlightDefaults}
      durationInFrames={websiteFoundSpotlightMeta.durationInFrames}
      fps={websiteFoundSpotlightMeta.fps}
      width={websiteFoundSpotlightMeta.width}
      height={websiteFoundSpotlightMeta.height}
    />
  ),
};
