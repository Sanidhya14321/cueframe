import { Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type PhoneTurnaroundProps,
  type PromoPhone,
  phoneTurnaroundDefaults,
  phoneTurnaroundMeta,
  phoneTurnaroundSchema,
} from '@/schemas';
import { facingBrightness, PhoneModel } from '../../promo/phone-model';
import { isDarkLook, PromoLayer } from '../../promo/promo-layer';
import { Stage } from '../../promo/stage';
import { glide, settle, smooth, TAU, track, tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';

export const PhoneTurnaround = ({
  phone,
  position,
  scale,
  entry,
  entryYaw,
  entryFrames,
  riseFrames,
  riseYaw,
  riseTilt,
  turnAt,
  rise: riseDistance,
  turnFrames,
  driftYaw,
  pushIn,
  secondScreen,
  secondCustomScreen,
  secondTurnAt,
  secondTurnFrames,
  travelX,
  endYaw,
  look,
  stage,
  motion,
}: PhoneTurnaroundProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const { durationInFrames } = useVideoConfig();
  const turn = Math.round(durationInFrames * turnAt);
  const turnIn = entry === 'turn-in';
  const rise = turnIn ? 1 : tween(frame, [0, riseFrames], [0, 1], settle);
  const turnStart = Math.max(0, Math.min(riseFrames - 48, turn - 72));
  const turned = Math.max(turnStart + turnFrames, turn + turnFrames);
  const twice = secondScreen !== 'none' || secondCustomScreen.length > 0;
  const secondFrom = turnIn ? secondTurnAt : Math.max(turned + 1, secondTurnAt);
  const secondEnd = secondFrom + secondTurnFrames;
  const settleYaw = twice
    ? track(
        frame,
        [
          [turned, 0],
          [secondFrom, 0.35],
          [secondEnd, TAU + endYaw + 0.25],
        ],
        glide,
      )
    : tween(frame, [turned, Math.max(durationInFrames, turned + 1)], [0, driftYaw]);
  const rotateY =
    tween(frame, [0, riseFrames], [Math.PI + riseYaw, Math.PI], settle) +
    tween(frame, [turnStart, turned], [0, Math.PI - 0.25]) +
    settleYaw;
  const second = twice ? tween(frame, [secondFrom, secondEnd], [0, 1]) : 0;
  const calm = 1 - second;
  const growEnd = twice ? secondEnd : durationInFrames;
  const grow = turnIn
    ? scale
    : scale *
      (0.85 + rise * 0.15) *
      tween(frame, [riseFrames, Math.max(growEnd, riseFrames + 1)], [1, pushIn]);
  const arrive = tween(frame, [0, entryFrames], [0, 1], smooth);
  const spin = twice
    ? track(
        frame,
        [
          [secondFrom, 0],
          [secondEnd, TAU + endYaw],
        ],
        glide,
      )
    : 0;
  const yaw = turnIn
    ? entryYaw * (1 - arrive) + Math.sin(frame / 48) * 0.05 * arrive * calm + spin
    : rotateY - TAU;
  const shown: PromoPhone =
    twice && frame >= secondFrom + secondTurnFrames / 2
      ? {
          ...phone,
          screen: secondScreen === 'none' ? phone.screen : secondScreen,
          customScreen: secondCustomScreen,
        }
      : phone;
  return (
    <PromoLayer look={look} motion={motion}>
      <Stage stage={{ ...stage, cameraDrift: stage.cameraDrift * calm }} dark={isDarkLook(look)}>
        <group
          position={[
            position.x + travelX * second,
            position.y + (1 - rise) * -riseDistance + Math.sin(frame / 30) * motion.float * calm,
            position.z,
          ]}
          rotation={[0.05 + (1 - rise) * riseTilt, yaw, 0.03]}
          scale={grow}
        >
          <PhoneModel
            phone={shown}
            reflections={stage.reflections}
            brightness={facingBrightness(yaw + TAU)}
          />
        </group>
      </Stage>
    </PromoLayer>
  );
};

export const phoneTurnaroundScene: SceneModule = {
  id: 'phone-turnaround',
  component: PhoneTurnaround,
  render: (key) => (
    <Composition
      key={key}
      id="phone-turnaround"
      component={PhoneTurnaround}
      schema={phoneTurnaroundSchema}
      defaultProps={phoneTurnaroundDefaults}
      durationInFrames={phoneTurnaroundMeta.durationInFrames}
      fps={phoneTurnaroundMeta.fps}
      width={phoneTurnaroundMeta.width}
      height={phoneTurnaroundMeta.height}
    />
  ),
};
