import { useId } from 'react';
import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type MailinfraDewStepsProps,
  mailinfraDewStepsDefaults,
  mailinfraDewStepsMeta,
  mailinfraDewStepsSchema,
} from '@/schemas';
import { BokehBackdrop } from '../../mailinfra-dew-steps/bokeh-backdrop';
import { EndLockup, IntroTitle, StepCopy } from '../../mailinfra-dew-steps/copy';
import { cameraAt, planOf, screenSpeed } from '../../mailinfra-dew-steps/timeline';
import { World } from '../../mailinfra-dew-steps/world';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const MailinfraDewSteps = (props: MailinfraDewStepsProps) => {
  const { look, motion, timing } = props;
  const frame = useCurrentFrame() * motion.speed;
  const { durationInFrames } = useVideoConfig();
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const plan = planOf(props, durationInFrames * motion.speed);
  const camera = cameraAt(frame, plan, timing.cameraDrift);
  const speed = screenSpeed(frame, plan, timing.cameraDrift) * motion.speed;
  const blur = Math.min(60, Math.abs(speed) * timing.motionBlur * 0.4);
  return (
    <TransitionFrame motion={motion}>
      {look.showBackdrop ? (
        <BokehBackdrop
          frame={frame}
          cameraX={camera.x}
          zoom={camera.zoom}
          speed={speed}
          props={props}
          id={`${id}-sky`}
        />
      ) : null}
      <World
        frame={frame}
        camera={camera}
        blur={blur}
        props={props}
        plan={plan}
        id={`${id}-world`}
      />
      <AbsoluteFill>
        <IntroTitle props={props} plan={plan} speed={motion.speed} />
        <StepCopy props={props} plan={plan} speed={motion.speed} />
        <EndLockup props={props} plan={plan} speed={motion.speed} id={`${id}-mark`} />
      </AbsoluteFill>
    </TransitionFrame>
  );
};

export const mailinfraDewStepsScene: SceneModule = {
  id: 'mailinfra-dew-steps',
  component: MailinfraDewSteps,
  render: (key) => (
    <Composition
      key={key}
      id="mailinfra-dew-steps"
      component={MailinfraDewSteps}
      schema={mailinfraDewStepsSchema}
      defaultProps={mailinfraDewStepsDefaults}
      durationInFrames={mailinfraDewStepsMeta.durationInFrames}
      fps={mailinfraDewStepsMeta.fps}
      width={mailinfraDewStepsMeta.width}
      height={mailinfraDewStepsMeta.height}
    />
  ),
};
