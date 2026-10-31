import { Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type PhonePedestalProps,
  phonePedestalDefaults,
  phonePedestalMeta,
  phonePedestalSchema,
} from '@/schemas';
import { PHONE } from '../../promo/phone-geometry';
import { PhoneModel } from '../../promo/phone-model';
import { isDarkLook, PromoLayer } from '../../promo/promo-layer';
import { Pedestal } from '../../promo/set-pieces';
import { Stage } from '../../promo/stage';
import { settle, tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';

export const PhonePedestal = ({
  phone,
  scale,
  lean,
  yaw,
  pitch,
  rock,
  rockSpeed,
  pedestal,
  entry,
  camera,
  look,
  stage,
  motion,
}: PhonePedestalProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const { durationInFrames } = useVideoConfig();
  const land = tween(frame, [0, entry.frames], [0, 1], settle);
  const sway = Math.sin(((frame - entry.frames * 0.6) / 30) * rockSpeed) * rock * land;
  const rise = tween(frame, [0, durationInFrames], [0, camera.rise], (t) => t);
  const tilt = (1 - land) * entry.cameraTilt;
  const orbit = tween(
    frame,
    [0, durationInFrames],
    [camera.orbit / 2, -camera.orbit / 2],
    (t) => t,
  );
  const reach = (pedestal.size / Math.SQRT2) * Math.cos(Math.PI / 4 - pedestal.turn);
  return (
    <PromoLayer look={look} motion={motion}>
      <Stage
        stage={stage}
        dark={isDarkLook(look)}
        cameraOffset={[0, camera.height + rise + tilt, 0]}
        target={[0, camera.aimY + tilt, 0]}
        backdropZ={-pedestal.size * 1.6}
        keyPosition={[camera.lightX, camera.lightY, camera.lightZ]}
      >
        <group rotation={[0, orbit, 0]}>
          {pedestal.show ? (
            <group
              position={[0, pedestal.top - pedestal.size / 2, -reach]}
              rotation={[0, pedestal.turn, 0]}
            >
              <group rotation={[Math.PI / 2, 0, 0]}>
                <Pedestal
                  size={pedestal.size}
                  bevel={pedestal.bevel}
                  color={pedestal.color}
                  roughness={pedestal.roughness}
                  reflections={stage.reflections}
                />
              </group>
            </group>
          ) : null}
          <group
            position={[0, pedestal.top + (1 - land) * entry.drop, 0]}
            rotation={[pitch, yaw, -(lean + sway) * (0.6 + 0.4 * land)]}
          >
            <group position={[0, (PHONE.height / 2) * scale, 0]} scale={scale}>
              <PhoneModel phone={phone} reflections={stage.reflections} />
            </group>
          </group>
        </group>
      </Stage>
    </PromoLayer>
  );
};

export const phonePedestalScene: SceneModule = {
  id: 'phone-pedestal',
  component: PhonePedestal,
  render: (key) => (
    <Composition
      key={key}
      id="phone-pedestal"
      component={PhonePedestal}
      schema={phonePedestalSchema}
      defaultProps={phonePedestalDefaults}
      durationInFrames={phonePedestalMeta.durationInFrames}
      fps={phonePedestalMeta.fps}
      width={phonePedestalMeta.width}
      height={phonePedestalMeta.height}
    />
  ),
};
