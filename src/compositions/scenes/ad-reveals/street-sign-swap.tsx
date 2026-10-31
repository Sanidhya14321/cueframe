import { AbsoluteFill, Composition, useCurrentFrame } from 'remotion';
import {
  type StreetSignSwapProps,
  streetSignSwapDefaults,
  streetSignSwapMeta,
  streetSignSwapSchema,
} from '@/schemas';
import { FootageStage } from '../../footage/footage-stage';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';
import { followFraming } from '../../street-sign-swap/follow-camera';
import { STREET_PLATE } from '../../street-sign-swap/plate';
import { SignPrints } from '../../street-sign-swap/sign-prints';

const StreetSignSwap = (props: StreetSignSwapProps) => {
  const frame = useCurrentFrame();
  const framing = followFraming(STREET_PLATE.track, frame, props.camera);
  return (
    <TransitionFrame motion={props.motion}>
      <AbsoluteFill style={{ backgroundColor: '#000000', overflow: 'hidden' }}>
        <AbsoluteFill
          style={{
            transformOrigin: '0 0',
            transform: `translate(${framing.x}px, ${framing.y}px) scale(${framing.scale})`,
          }}
        >
          <FootageStage plate={STREET_PLATE} frame={frame}>
            <SignPrints props={props} />
          </FootageStage>
        </AbsoluteFill>
      </AbsoluteFill>
    </TransitionFrame>
  );
};

export const streetSignSwapScene: SceneModule = {
  id: 'street-sign-swap',
  component: StreetSignSwap,
  render: (key) => (
    <Composition
      key={key}
      id="street-sign-swap"
      component={StreetSignSwap}
      schema={streetSignSwapSchema}
      defaultProps={streetSignSwapDefaults}
      durationInFrames={streetSignSwapMeta.durationInFrames}
      fps={streetSignSwapMeta.fps}
      width={streetSignSwapMeta.width}
      height={streetSignSwapMeta.height}
    />
  ),
};
