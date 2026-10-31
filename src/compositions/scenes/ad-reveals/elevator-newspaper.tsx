import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type ElevatorNewspaperProps,
  elevatorNewspaperDefaults,
  elevatorNewspaperMeta,
  elevatorNewspaperSchema,
} from '@/schemas';
import { cameraFraming } from '../../elevator-newspaper/camera';
import { NewspaperPrints } from '../../elevator-newspaper/newspaper-prints';
import { ELEVATOR_PLATE } from '../../elevator-newspaper/plate';
import { FootageStage } from '../../footage/footage-stage';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const ElevatorNewspaper = (props: ElevatorNewspaperProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const framing = cameraFraming(frame, props.camera, width, height);
  return (
    <TransitionFrame motion={props.motion}>
      <AbsoluteFill style={{ backgroundColor: '#000000', overflow: 'hidden' }}>
        <AbsoluteFill
          style={{
            transformOrigin: '0 0',
            transform: `translate(${framing.x}px, ${framing.y}px) scale(${framing.scale})`,
          }}
        >
          <FootageStage plate={ELEVATOR_PLATE} frame={frame}>
            <NewspaperPrints props={props} />
          </FootageStage>
        </AbsoluteFill>
      </AbsoluteFill>
    </TransitionFrame>
  );
};

export const elevatorNewspaperScene: SceneModule = {
  id: 'elevator-newspaper',
  component: ElevatorNewspaper,
  render: (key) => (
    <Composition
      key={key}
      id="elevator-newspaper"
      component={ElevatorNewspaper}
      schema={elevatorNewspaperSchema}
      defaultProps={elevatorNewspaperDefaults}
      durationInFrames={elevatorNewspaperMeta.durationInFrames}
      fps={elevatorNewspaperMeta.fps}
      width={elevatorNewspaperMeta.width}
      height={elevatorNewspaperMeta.height}
    />
  ),
};
