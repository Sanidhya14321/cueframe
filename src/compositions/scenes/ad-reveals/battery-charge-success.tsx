import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type BatteryChargeSuccessProps,
  batteryChargeSuccessDefaults,
  batteryChargeSuccessMeta,
  batteryChargeSuccessSchema,
} from '@/schemas';
import { Battery } from '../../battery-charge-success/battery';
import { Cables } from '../../battery-charge-success/cables';
import { batteryBox, chargeLevel, chargePhase } from '../../battery-charge-success/choreography';
import { mixHex, mixThree } from '../../battery-charge-success/curves';
import { BatteryHalo } from '../../battery-charge-success/halo';
import { GlowTitle } from '../../battery-charge-success/title';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const STOPS = [0, 0.04, 0.14, 0.3, 0.5, 0.7, 0.86, 0.96, 1];

const BatteryChargeSuccess = (props: BatteryChargeSuccessProps) => {
  const frame = useCurrentFrame() * props.motion.speed;
  const { width, height, durationInFrames } = useVideoConfig();
  const duration = durationInFrames * props.motion.speed;
  const box = batteryBox(props.battery, width);
  const level = chargeLevel(frame, props.timing);
  const phase = chargePhase(frame, props.timing);
  const { look, charge } = props;
  const tint = mixHex(
    look.background,
    mixThree(charge.empty, charge.mid, charge.charged, phase),
    look.ambientTint * 0.25,
  );
  const centerY = ((box.top + box.height * 0.3) / height) * 100;
  const gradient = STOPS.map(
    (stop) =>
      `color-mix(in oklab, ${tint} ${((1 - stop * stop * (3 - 2 * stop)) * 100).toFixed(1)}%, ${look.backgroundEdge}) ${(stop * 100).toFixed(0)}%`,
  ).join(', ');
  return (
    <TransitionFrame motion={props.motion}>
      {look.showBackdrop ? (
        <AbsoluteFill
          style={{
            backgroundColor: look.backgroundEdge,
            backgroundImage: `radial-gradient(ellipse 78% 52% at 50% ${centerY.toFixed(1)}%, ${gradient})`,
          }}
        />
      ) : null}
      <BatteryHalo props={props} box={box} level={level} phase={phase} />
      <Cables
        props={props}
        frame={frame}
        duration={duration}
        box={box}
        phase={phase}
        height={height}
      />
      <Battery
        props={props}
        frame={frame}
        box={box}
        level={level}
        phase={phase}
        width={width}
        height={height}
      />
      <GlowTitle props={props} frame={frame} duration={duration} phase={phase} />
    </TransitionFrame>
  );
};

export const batteryChargeSuccessScene: SceneModule = {
  id: 'battery-charge-success',
  component: BatteryChargeSuccess,
  render: (key) => (
    <Composition
      key={key}
      id="battery-charge-success"
      component={BatteryChargeSuccess}
      schema={batteryChargeSuccessSchema}
      defaultProps={batteryChargeSuccessDefaults}
      durationInFrames={batteryChargeSuccessMeta.durationInFrames}
      fps={batteryChargeSuccessMeta.fps}
      width={batteryChargeSuccessMeta.width}
      height={batteryChargeSuccessMeta.height}
    />
  ),
};
