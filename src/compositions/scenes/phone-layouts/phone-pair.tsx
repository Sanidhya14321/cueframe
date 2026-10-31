import { Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import { type PhonePairProps, phonePairDefaults, phonePairMeta, phonePairSchema } from '@/schemas';
import { PhoneModel } from '../../promo/phone-model';
import { isDarkLook, PromoLayer } from '../../promo/promo-layer';
import { Stage } from '../../promo/stage';
import { settle, smooth, tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';

const BEHIND_DEPTH = 0.6;
const DRIFT_IN = 40;

const FromBehind = ({
  phones,
  position,
  scale,
  gap,
  angle,
  behindSide,
  slideDelay,
  slideFrames,
  stage,
  frame,
  float,
}: PhonePairProps & { frame: number; float: number }) => {
  const out = tween(frame, [slideDelay, slideDelay + slideFrames], [0, 1], smooth);
  const direction = behindSide === 'left' ? -1 : 1;
  const parallax = (stage.cameraDistance + BEHIND_DEPTH) / stage.cameraDistance;
  return (
    <>
      {phones.map((entry, index) => {
        const behind = index === 1;
        return (
          <group
            key={`${index}:${entry.screen}`}
            visible={!behind || out > 0}
            position={[
              behind ? position.x * parallax + direction * gap * 2 * out : position.x,
              behind
                ? position.y * parallax + Math.sin(frame / 26 + 1.6) * float * out
                : position.y,
              position.z - (behind ? BEHIND_DEPTH : 0),
            ]}
            rotation={[0.05, angle, 0.03]}
            scale={scale}
          >
            <PhoneModel phone={entry} reflections={stage.reflections} />
          </group>
        );
      })}
    </>
  );
};

export const PhonePair = (props: PhonePairProps) => {
  const { phones, position, scale, gap, angle, stagger, entrance } = props;
  const { arriveFrames, arriveSwing, look, stage, motion } = props;
  const frame = useCurrentFrame() * motion.speed;
  const arrive = tween(frame, [0, arriveFrames], [0, 1], settle);
  const { width, height } = useVideoConfig();
  const halfWidth =
    Math.tan((stage.fieldOfView * Math.PI) / 360) * stage.cameraDistance * (width / height);
  const travel = Math.max(0, halfWidth + 1.3 * scale - gap);
  const behind = entrance === 'from-behind';
  const settled = tween(frame, [0, DRIFT_IN], [0, 1]);
  return (
    <PromoLayer look={look} motion={motion}>
      <Stage
        stage={behind ? { ...stage, cameraDrift: stage.cameraDrift * settled } : stage}
        dark={isDarkLook(look)}
      >
        {behind ? (
          <FromBehind {...props} frame={frame} float={motion.float} />
        ) : (
          phones.map((entry, index) => {
            const side = index === 0 ? -1 : 1;
            return (
              <group
                key={`${index}:${entry.screen}`}
                position={[
                  position.x + side * (gap + (1 - arrive) * travel),
                  position.y +
                    (side * stagger) / 2 +
                    Math.sin(frame / 26 + index * 1.6) * motion.float,
                  position.z + (index === 0 ? 0.3 : -0.5),
                ]}
                rotation={[0.05, -side * (angle + (1 - arrive) * arriveSwing), side * -0.04]}
                scale={scale}
              >
                <PhoneModel phone={entry} reflections={stage.reflections} />
              </group>
            );
          })
        )}
      </Stage>
    </PromoLayer>
  );
};

export const phonePairScene: SceneModule = {
  id: 'phone-pair',
  component: PhonePair,
  render: (key) => (
    <Composition
      key={key}
      id="phone-pair"
      component={PhonePair}
      schema={phonePairSchema}
      defaultProps={phonePairDefaults}
      durationInFrames={phonePairMeta.durationInFrames}
      fps={phonePairMeta.fps}
      width={phonePairMeta.width}
      height={phonePairMeta.height}
    />
  ),
};
