import { Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type PhoneSwapProps,
  type PromoPhone,
  phoneSwapDefaults,
  phoneSwapMeta,
  phoneSwapSchema,
} from '@/schemas';
import { beatAt } from '../../promo/beats';
import { PhoneModel } from '../../promo/phone-model';
import { isDarkLook, PromoLayer } from '../../promo/promo-layer';
import { offscreenDrop, Stage } from '../../promo/stage';
import { settle, TAU, tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';

export const PhoneSwap = ({
  screens,
  finish,
  startSide,
  offset,
  scale,
  spinTurns,
  turn,
  sway,
  arriveFrames,
  look,
  stage,
  motion,
}: PhoneSwapProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const { durationInFrames } = useVideoConfig();
  const count = screens.length;
  const { beat, progress } = beatAt(frame, durationInFrames / count, count);
  const first = startSide === 'right' ? 1 : -1;
  const sideOf = (index: number) => (index % 2 === 0 ? first : -first);
  const from = sideOf(beat);
  const to = sideOf(beat + 1);
  const side = progress > 0 ? from + (to - from) * progress : from;
  const phoneAt = (index: number): PromoPhone => ({
    screen: screens[index]?.screen ?? 'home',
    customScreen: screens[index]?.customScreen ?? '',
    finish,
  });
  const mix = progress > 0 ? tween(progress, [0.06, 0.94], [0, 1]) : 0;
  const arrive = arriveFrames > 0 ? tween(frame, [0, arriveFrames], [0, 1], settle) : 1;
  const rotateY =
    -turn * side +
    progress * TAU * Math.round(spinTurns) * from +
    Math.sin(frame / 36) * sway +
    (1 - arrive) * -0.7;
  return (
    <PromoLayer look={look} motion={motion} focusX={50 + side * 16}>
      <Stage stage={stage} dark={isDarkLook(look)}>
        <group
          position={[
            offset * side,
            (1 - arrive) * -offscreenDrop(stage, scale) + Math.sin(frame / 28) * motion.float * 1.6,
            0,
          ]}
          rotation={[0.06 + (1 - arrive) * 0.35, rotateY, 0]}
          scale={scale}
        >
          <PhoneModel
            phone={phoneAt(beat)}
            nextPhone={mix > 0 ? phoneAt(beat + 1) : undefined}
            screenMix={mix}
            reflections={stage.reflections}
          />
        </group>
      </Stage>
    </PromoLayer>
  );
};

export const phoneSwapScene: SceneModule = {
  id: 'phone-swap',
  component: PhoneSwap,
  render: (key) => (
    <Composition
      key={key}
      id="phone-swap"
      component={PhoneSwap}
      schema={phoneSwapSchema}
      defaultProps={phoneSwapDefaults}
      durationInFrames={phoneSwapMeta.durationInFrames}
      fps={phoneSwapMeta.fps}
      width={phoneSwapMeta.width}
      height={phoneSwapMeta.height}
    />
  ),
};
