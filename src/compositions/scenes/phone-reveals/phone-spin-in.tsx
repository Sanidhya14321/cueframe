import { Composition, useCurrentFrame } from 'remotion';
import {
  type PhoneSpinInProps,
  phoneSpinInDefaults,
  phoneSpinInMeta,
  phoneSpinInSchema,
} from '@/schemas';
import { facingBrightness, PhoneModel } from '../../promo/phone-model';
import { isDarkLook, PromoLayer } from '../../promo/promo-layer';
import { Stage } from '../../promo/stage';
import { settle, TAU, tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';

export const PhoneSpinIn = ({
  phone,
  position,
  scale,
  spinTurns,
  tilt,
  rise,
  spinFrames,
  slideIn,
  sway,
  startPitch,
  startRoll,
  look,
  stage,
  motion,
}: PhoneSpinInProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const side = position.x === 0 ? 1 : Math.sign(position.x);
  const arrive = tween(frame, [0, spinFrames], [0, 1], settle);
  const rotateY =
    -side * tilt - (1 - arrive) * side * spinTurns * TAU + Math.sin(frame / 48) * sway;
  return (
    <PromoLayer look={look} motion={motion} focusX={50 + side * 18}>
      <Stage stage={stage} dark={isDarkLook(look)}>
        <group
          position={[
            position.x + side * (1 - arrive) * slideIn,
            position.y - (1 - arrive) * rise + Math.sin(frame / 32) * motion.float,
            position.z,
          ]}
          rotation={[0.04 + (1 - arrive) * startPitch, rotateY, (1 - arrive) * -startRoll * side]}
          scale={scale}
        >
          <PhoneModel
            phone={phone}
            reflections={stage.reflections}
            brightness={facingBrightness(rotateY)}
          />
        </group>
      </Stage>
    </PromoLayer>
  );
};

export const phoneSpinInScene: SceneModule = {
  id: 'phone-spin-in',
  component: PhoneSpinIn,
  render: (key) => (
    <Composition
      key={key}
      id="phone-spin-in"
      component={PhoneSpinIn}
      schema={phoneSpinInSchema}
      defaultProps={phoneSpinInDefaults}
      durationInFrames={phoneSpinInMeta.durationInFrames}
      fps={phoneSpinInMeta.fps}
      width={phoneSpinInMeta.width}
      height={phoneSpinInMeta.height}
    />
  ),
};
