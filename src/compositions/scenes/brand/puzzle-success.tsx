import { useId } from 'react';
import { AbsoluteFill, Composition, useCurrentFrame } from 'remotion';
import {
  type PuzzleSuccessProps,
  puzzleSuccessDefaults,
  puzzleSuccessMeta,
  puzzleSuccessSchema,
} from '@/schemas';
import { PromoLayer } from '../../promo/promo-layer';
import { SummitIcon, Wordmark } from '../../puzzle-success/brand-marks';
import { puzzleBeat } from '../../puzzle-success/choreography';
import { NeonCables, NeonDefs } from '../../puzzle-success/neon-cables';
import { Pulse, PulseDefs } from '../../puzzle-success/pulse';
import { PieceDefs, PuzzlePieces, SuccessWord } from '../../puzzle-success/puzzle-pieces';
import { Sparks } from '../../puzzle-success/sparks';
import type { SceneModule } from '../../scene-module';

const PuzzleSuccess = (props: PuzzleSuccessProps) => {
  const frame = useCurrentFrame() * props.motion.speed;
  const prefix = `puzzle${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const beat = puzzleBeat(frame, props);
  const { width, height } = puzzleSuccessMeta;
  const flashing = beat.flash > 0 && props.pulse.flashOpacity > 0;
  return (
    <PromoLayer look={props.look} motion={props.motion}>
      {flashing ? (
        <AbsoluteFill
          style={{ background: props.pulse.flashColor, opacity: props.pulse.flashOpacity }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          filter: flashing
            ? `blur(${props.pulse.flashBlur}px) brightness(${(1 - props.pulse.flashShadow).toFixed(3)})`
            : undefined,
        }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ position: 'absolute', inset: 0 }}
          aria-hidden="true"
        >
          <defs>
            <PieceDefs props={props} prefix={prefix} />
            <NeonDefs props={props} prefix={prefix} />
            <PulseDefs props={props} prefix={prefix} />
          </defs>
          {flashing ? null : (
            <>
              <SummitIcon props={props} />
              <Pulse props={props} beat={beat} prefix={prefix} />
              <Sparks props={props} beat={beat} prefix={prefix} />
              <NeonCables props={props} beat={beat} prefix={prefix} />
            </>
          )}
          <g opacity={flashing ? 0.8 : 1}>
            <PuzzlePieces props={props} beat={beat} prefix={prefix} />
            <SuccessWord props={props} beat={beat} prefix={prefix} />
          </g>
        </svg>
        <Wordmark props={props} />
      </AbsoluteFill>
    </PromoLayer>
  );
};

export const puzzleSuccessScene: SceneModule = {
  id: 'puzzle-success',
  component: PuzzleSuccess,
  render: (key) => (
    <Composition
      key={key}
      id="puzzle-success"
      component={PuzzleSuccess}
      schema={puzzleSuccessSchema}
      defaultProps={puzzleSuccessDefaults}
      durationInFrames={puzzleSuccessMeta.durationInFrames}
      fps={puzzleSuccessMeta.fps}
      width={puzzleSuccessMeta.width}
      height={puzzleSuccessMeta.height}
    />
  ),
};
