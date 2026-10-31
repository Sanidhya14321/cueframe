import { Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import { type PhoneFanProps, phoneFanDefaults, phoneFanMeta, phoneFanSchema } from '@/schemas';
import { PhoneModel } from '../../promo/phone-model';
import { isDarkLook, PromoLayer } from '../../promo/promo-layer';
import { offscreenDrop, Stage } from '../../promo/stage';
import { settle, smooth, TAU, tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';

const RISE_ORDER: Record<PhoneFanProps['riseOrder'], readonly number[]> = {
  'center-out': [1, 0, 2],
  'left-to-right': [0, 1, 2],
  'right-to-left': [2, 1, 0],
};

interface FanPose {
  visible: boolean;
  x: number;
  y: number;
  tilt: number;
  yaw: number;
}

const risePose = (
  frame: number,
  offset: number,
  delay: number,
  {
    spacing,
    fan,
    drop,
    riseFrames,
    riseSpin,
  }: { spacing: number; fan: number; drop: number; riseFrames: number; riseSpin: number },
): FanPose => {
  const arrive = tween(frame, [delay, delay + riseFrames], [0, 1], settle);
  const spin = (1 - arrive) * TAU * riseSpin * (offset === 0 ? 1 : Math.sign(offset));
  return {
    visible: true,
    x: offset * spacing,
    y: -(1 - arrive) * drop,
    tilt: 0.05 + (1 - arrive) * 0.35,
    yaw: -offset * fan + spin,
  };
};

const spreadPose = (
  frame: number,
  offset: number,
  {
    spacing,
    fan,
    spreadDelay,
    flyFrom,
    flyYaw,
    flyFrames,
    spreadFrames,
  }: {
    spacing: number;
    fan: number;
    spreadDelay: number;
    flyFrom: number;
    flyYaw: number;
    flyFrames: number;
    spreadFrames: number;
  },
): FanPose => {
  const arrive = tween(frame, [0, flyFrames], [0, 1], settle);
  const face = tween(frame, [0, flyFrames * 0.5], [0, 1], smooth);
  const out = tween(frame, [spreadDelay, spreadDelay + spreadFrames], [0, 1], smooth);
  return {
    visible: offset === 0 || out > 0,
    x: offset === 0 ? flyFrom * (1 - arrive) : offset * spacing * out,
    y: 0,
    tilt: 0.04,
    yaw: offset === 0 ? flyYaw * (1 - face) : -offset * fan * out,
  };
};

export const PhoneFan = ({
  phones,
  position,
  scale,
  spacing,
  fan,
  stagger,
  riseOrder,
  riseFrames,
  riseSpin,
  orbit,
  dollyFrom,
  dollyTo,
  entrance,
  spreadDelay,
  flyFrom,
  flyYaw,
  flyFrames,
  spreadFrames,
  look,
  stage,
  motion,
}: PhoneFanProps) => {
  const raw = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const frame = raw * motion.speed;
  const dolly = tween(raw, [0, durationInFrames], [dollyFrom, dollyTo], (t) => t);
  const sway = tween(raw, [0, durationInFrames], [-orbit, orbit], (t) => t);
  const drop = offscreenDrop(stage, scale, dollyFrom);
  return (
    <PromoLayer look={look} motion={motion}>
      <Stage
        stage={stage}
        dark={isDarkLook(look)}
        distanceScale={dolly}
        cameraOffset={[0, 0.3, 0]}
        target={[0, -0.35, 0]}
      >
        <group rotation={[0, sway, 0]} position={[position.x, position.y, position.z]}>
          {phones.map((entry, index) => {
            const offset = index - 1;
            const pose =
              entrance === 'spread'
                ? spreadPose(frame, offset, {
                    spacing,
                    fan,
                    spreadDelay,
                    flyFrom,
                    flyYaw,
                    flyFrames,
                    spreadFrames,
                  })
                : risePose(frame, offset, (RISE_ORDER[riseOrder][index] ?? index) * stagger, {
                    spacing,
                    fan,
                    drop,
                    riseFrames,
                    riseSpin,
                  });
            return (
              <group
                key={`${index}:${entry.screen}`}
                visible={pose.visible}
                position={[
                  pose.x,
                  pose.y + Math.sin(frame / 26 + index * 2) * motion.float,
                  offset === 0 ? 0.4 : -0.5,
                ]}
                rotation={[pose.tilt, pose.yaw, 0]}
                scale={scale}
              >
                <PhoneModel phone={entry} reflections={stage.reflections} />
              </group>
            );
          })}
        </group>
      </Stage>
    </PromoLayer>
  );
};

export const phoneFanScene: SceneModule = {
  id: 'phone-fan',
  component: PhoneFan,
  render: (key) => (
    <Composition
      key={key}
      id="phone-fan"
      component={PhoneFan}
      schema={phoneFanSchema}
      defaultProps={phoneFanDefaults}
      durationInFrames={phoneFanMeta.durationInFrames}
      fps={phoneFanMeta.fps}
      width={phoneFanMeta.width}
      height={phoneFanMeta.height}
    />
  ),
};
