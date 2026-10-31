import { AbsoluteFill, Composition, useCurrentFrame } from 'remotion';
import {
  type GoingLiveTeaserProps,
  goingLiveTeaserDefaults,
  goingLiveTeaserMeta,
  goingLiveTeaserSchema,
} from '@/schemas';
import { progress, within } from '../../going-live/beat';
import { EchoTitle } from '../../going-live/echo-title';
import { EndCard } from '../../going-live/end-card';
import { GlitchText } from '../../going-live/glitch-text';
import { LightWall } from '../../going-live/light-wall';
import { Monogram } from '../../going-live/monogram';
import { SmokeBank } from '../../going-live/smoke';
import { StatsWall } from '../../going-live/stats-wall';
import { UrlReveal } from '../../going-live/url-reveal';
import { PlainWord, ZoomWord } from '../../going-live/zoom-word';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const SMOKE_FLOOR_OFFSET = 0.42;
const GLOW_STOPS = 12;

const backdropGlow = (look: GoingLiveTeaserProps['look']): string => {
  const stops = Array.from({ length: GLOW_STOPS + 1 }, (_, index) => {
    const t = index / GLOW_STOPS;
    const level = look.glowStrength * (1 - t * t) ** 2 * 100;
    return `color-mix(in srgb, ${look.glow} ${level.toFixed(2)}%, ${look.background}) ${(t * 100).toFixed(1)}%`;
  });
  return `radial-gradient(ellipse 95% 62% at 50% 56%, ${stops.join(', ')})`;
};

const GoingLiveTeaser = (props: GoingLiveTeaserProps) => {
  const { copy, wall, look, type, zoom, glitch, echo, smoke, logo, endCard, timing, motion } =
    props;
  const frame = useCurrentFrame() * motion.speed;
  const base = { weight: type.weight, tracking: type.tracking };
  const word = { ...base, size: type.wordSize };
  const approachLevel = 1 - progress(frame, timing.approachFadeStart, timing.approachFadeEnd);
  const echoShared = {
    frame,
    smallType: { ...base, size: type.stackSize },
    lineHeight: type.lineHeight,
    look,
    echo,
  };
  return (
    <TransitionFrame motion={motion}>
      {look.showBackdrop ? <AbsoluteFill style={{ background: backdropGlow(look) }} /> : null}
      <ZoomWord
        frame={frame}
        text={copy.opener}
        accentWord=""
        ink={look.ink}
        accent={look.accent}
        type={word}
        start={timing.openerStart}
        land={timing.openerLand}
        fromScale={zoom.fromScale}
        originX={zoom.openerOriginX}
        originY={zoom.openerOriginY}
        curve={zoom.openerCurve}
        opacity={1 - progress(frame, timing.openerFadeStart, timing.openerFadeEnd)}
      />
      <LightWall
        frame={frame}
        start={timing.wallStart}
        end={timing.wallEnd}
        wall={wall}
        accent={look.accent}
      />
      <GlitchText
        frame={frame}
        text={copy.glitch}
        start={timing.glitchStart}
        end={timing.glitchEnd}
        type={{ ...base, size: type.glitchSize }}
        lineHeight={type.lineHeight}
        glitch={glitch}
        accent={look.accent}
      />
      <AbsoluteFill style={{ opacity: approachLevel }}>
        <StatsWall
          frame={frame}
          fadeIn={timing.statsIn}
          start={timing.approachAt}
          fadeStart={timing.approachFadeStart}
          end={timing.approachFadeEnd}
          wall={wall}
          accent={look.accent}
        />
        {within(frame, timing.approachAt, timing.approachFadeEnd) ? (
          <PlainWord text={copy.approach} color={look.ink} type={word} />
        ) : null}
      </AbsoluteFill>
      {within(frame, timing.bridgeAt, timing.approachAt) ? (
        <PlainWord text={copy.bridge} color={look.ink} type={word} />
      ) : null}
      {within(frame, timing.liveStart, timing.liveEnd) ? (
        <>
          <SmokeBank
            frame={frame}
            start={timing.liveLand}
            end={timing.smokeEnd}
            floor={960 + type.wordSize * SMOKE_FLOOR_OFFSET}
            smoke={smoke}
            color={look.smoke}
          />
          <ZoomWord
            frame={frame}
            text={copy.live}
            accentWord={copy.liveAccent}
            ink={look.ink}
            accent={look.accent}
            type={word}
            start={timing.liveStart}
            land={timing.liveLand}
            fromScale={zoom.fromScale}
            originX={zoom.liveOriginX}
            originY={zoom.liveOriginY}
            curve={zoom.liveCurve}
            opacity={1}
          />
        </>
      ) : null}
      <EchoTitle
        {...echoShared}
        text={copy.stay}
        bigType={{ ...base, size: type.stayBigSize }}
        cues={{
          at: timing.stayAt,
          flash: timing.stayFlash,
          big: timing.stayBig,
          echo: timing.stayEcho,
          end: timing.launchAt,
        }}
      />
      <EchoTitle
        {...echoShared}
        text={copy.launch}
        bigType={{ ...base, size: type.launchBigSize }}
        cues={{
          at: timing.launchAt,
          flash: timing.launchFlash,
          big: timing.launchBig,
          echo: timing.launchEcho,
          end: timing.launchEnd,
        }}
      />
      <UrlReveal
        frame={frame}
        text={copy.url}
        start={timing.urlStart}
        charFrames={timing.urlCharFrames}
        fadeStart={timing.urlFadeStart}
        fadeEnd={timing.urlFadeEnd}
        type={{ ...base, size: type.urlSize }}
        color={look.ink}
      />
      {logo.show ? (
        <Monogram
          frame={frame}
          start={timing.logoStart}
          square={timing.logoSquare}
          drawn={timing.logoDrawn}
          stroke={logo.stroke}
          scale={logo.scale}
          centerY={logo.y}
          color={look.logo}
        />
      ) : null}
      <EndCard frame={frame} copy={copy} type={type} look={look} timing={timing} layout={endCard} />
    </TransitionFrame>
  );
};

export const goingLiveTeaserScene: SceneModule = {
  id: 'going-live-teaser',
  component: GoingLiveTeaser,
  render: (key) => (
    <Composition
      key={key}
      id="going-live-teaser"
      component={GoingLiveTeaser}
      schema={goingLiveTeaserSchema}
      defaultProps={goingLiveTeaserDefaults}
      durationInFrames={goingLiveTeaserMeta.durationInFrames}
      fps={goingLiveTeaserMeta.fps}
      width={goingLiveTeaserMeta.width}
      height={goingLiveTeaserMeta.height}
    />
  ),
};
