import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type AnniversaryKineticProps,
  anniversaryKineticDefaults,
  anniversaryKineticMeta,
  anniversaryKineticSchema,
} from '@/schemas';
import { BeatLayer } from '../../anniversary/beat-layer';
import { Dust } from '../../anniversary/decor';
import { LogoLockup } from '../../anniversary/logo-lockup';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const AnniversaryKinetic = ({
  beats,
  logo,
  look,
  band,
  sparkles,
  chrome,
  motion,
}: AnniversaryKineticProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const { width, height } = useVideoConfig();
  const ordered = beats
    .map((beat, index) => ({ beat, index }))
    .sort((a, b) => a.beat.start - b.beat.start);
  const position = ordered.findLastIndex((entry) => entry.beat.start <= frame);
  const current = ordered[position];
  const showLogo = frame >= logo.start || current === undefined;
  const nextStart = ordered[position + 1]?.beat.start ?? logo.start;
  const paper = showLogo || current?.beat.backdrop === 'paper';
  return (
    <TransitionFrame motion={motion}>
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        {showLogo || current === undefined ? (
          <LogoLockup logo={logo} local={frame - logo.start} backdrop={look.showBackdrop} />
        ) : (
          <BeatLayer
            beat={current.beat}
            index={current.index}
            look={look}
            band={band}
            chrome={chrome}
            local={frame - current.beat.start}
            length={Math.max(1, Math.min(nextStart, logo.start) - current.beat.start)}
            width={width}
            height={height}
          />
        )}
        {showLogo ? null : (
          <Dust
            look={look}
            sparkles={sparkles}
            frame={frame}
            dark={paper}
            width={width}
            height={height}
          />
        )}
      </AbsoluteFill>
    </TransitionFrame>
  );
};

export const anniversaryKineticScene: SceneModule = {
  id: 'anniversary-kinetic',
  component: AnniversaryKinetic,
  render: (key) => (
    <Composition
      key={key}
      id="anniversary-kinetic"
      component={AnniversaryKinetic}
      schema={anniversaryKineticSchema}
      defaultProps={anniversaryKineticDefaults}
      durationInFrames={anniversaryKineticMeta.durationInFrames}
      fps={anniversaryKineticMeta.fps}
      width={anniversaryKineticMeta.width}
      height={anniversaryKineticMeta.height}
    />
  ),
};
