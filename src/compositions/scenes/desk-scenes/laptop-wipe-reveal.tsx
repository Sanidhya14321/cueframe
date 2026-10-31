import { CameraMotionBlur } from '@remotion/motion-blur';
import { useMemo } from 'react';
import { Composition, getRemotionEnvironment, useCurrentFrame } from 'remotion';
import * as THREE from 'three';
import {
  type LaptopWipeRevealProps,
  laptopWipeRevealDefaults,
  laptopWipeRevealMeta,
  laptopWipeRevealSchema,
} from '@/schemas';
import { useCanvasFont, useCanvasTexture } from '../../promo/desk/canvas-texture';
import { cameraPosition, DeskRoom, DeskStage } from '../../promo/desk/desk-stage';
import { drawScreen, SCREEN_CANVAS } from '../../promo/desk/desk-textures';
import { type Finger, mixPose } from '../../promo/desk/hand-rig';
import { HeldTowel } from '../../promo/desk/held-towel';
import { LAPTOP } from '../../promo/desk/laptop-geometry';
import { LaptopModel } from '../../promo/desk/laptop-model';
import { LensOverlay } from '../../promo/desk/lens';
import { Plant } from '../../promo/desk/plant';
import { choreograph, shaderPoints, type WipeTiming } from '../../promo/desk/wipe-choreography';
import { createWipeMaterial, updateWipeMaterial } from '../../promo/desk/wipe-material';
import { displayFont, displayFontReady } from '../../promo/fonts';
import { PromoLayer } from '../../promo/promo-layer';
import type { SceneModule } from '../../scene-module';

const ASPECT = LAPTOP.screenWidth / LAPTOP.screenHeight;

const Screen = ({
  screen,
  wipe,
  cloth,
  progress,
  reveal,
}: Pick<LaptopWipeRevealProps, 'screen' | 'wipe' | 'cloth'> & {
  progress: number;
  reveal: number;
}) => {
  useCanvasFont(`600 ${screen.size}px "${displayFont}"`, displayFontReady);
  const content = useCanvasTexture(
    SCREEN_CANVAS.width,
    SCREEN_CANVAS.height,
    (context) => drawScreen(context, { ...screen, font: displayFont }),
    JSON.stringify(screen),
  );
  const wipeMaterial = useMemo(() => createWipeMaterial(content), [content]);
  const points = useMemo(
    () =>
      shaderPoints(
        wipe,
        ASPECT,
        new THREE.Vector2(cloth.offsetX, cloth.offsetY).divideScalar(LAPTOP.screenHeight),
      ),
    [wipe, cloth.offsetX, cloth.offsetY],
  );
  updateWipeMaterial(wipeMaterial, {
    cover: screen.cover,
    smudge: screen.smudge,
    haze: screen.haze,
    points,
    count: progress * (points.length - 1),
    radius: wipe.radius,
    softness: wipe.softness,
    streaks: wipe.streaks,
    reveal: wipe.revealAll ? reveal : 0,
    brightness: screen.brightness,
    aspect: ASPECT,
  });
  return (
    <mesh material={wipeMaterial.material}>
      <planeGeometry args={[LAPTOP.screenWidth, LAPTOP.screenHeight]} />
    </mesh>
  );
};

const FINGER_REST: Record<Finger, number> = { index: 0.02, middle: 0.06, ring: 0.11, pinky: 0.17 };

const FINGER_PHASE: Record<Finger, number> = { index: 0, middle: 1.7, ring: 3.1, pinky: 4.4 };

const livelyCurl = (
  base: number,
  finger: Finger,
  frame: number,
  hand: LaptopWipeRevealProps['hand'],
): number => {
  const phase = FINGER_PHASE[finger];
  const life = Math.sin(frame / 11 + phase) * 0.5 + Math.sin(frame / 7.3 + phase * 1.7) * 0.5;
  return base + FINGER_REST[finger] * hand.fingerVariety + life * 0.04 * hand.fingerLife;
};

const fingerCurls = (
  base: Record<Finger, number>,
  frame: number,
  hand: LaptopWipeRevealProps['hand'],
): Record<Finger, number> => ({
  index: livelyCurl(base.index, 'index', frame, hand),
  middle: livelyCurl(base.middle, 'middle', frame, hand),
  ring: livelyCurl(base.ring, 'ring', frame, hand),
  pinky: livelyCurl(base.pinky, 'pinky', frame, hand),
});

const DeskScene = ({ blurred, ...props }: LaptopWipeRevealProps & { blurred: boolean }) => {
  const { screen, wipe, timing, cloth, hand, arm, hold, laptop, room, camera, light, lens } = props;
  const frame = useCurrentFrame() * props.motion.speed;
  const eye = new THREE.Vector3(...cameraPosition(camera, frame));
  const laptopTransform = new THREE.Matrix4()
    .makeTranslation(laptop.x, 0, 0)
    .multiply(new THREE.Matrix4().makeRotationY(laptop.turn));
  const localEye = eye.clone().applyMatrix4(laptopTransform.clone().invert());
  const choreography = {
    timing: timing satisfies WipeTiming,
    path: wipe,
    hold: { ...hold, x: hold.x - laptop.x },
    lidAngle: laptop.lidAngle,
    camera: localEye,
    contactGap: hand.contactGap + 0.02,
    enterFrom: new THREE.Vector3(hand.enterX, hand.enterY, hand.enterZ),
  };
  const motion = choreograph({ ...choreography, frame });
  const settled = choreograph({ ...choreography, frame: timing.turnStart + timing.turnFrames });
  const settledFingers = 1 - THREE.MathUtils.smoothstep(motion.turn, 0, 0.35);
  const wipePose = {
    curl: fingerCurls(
      { index: hand.wipeCurl, middle: hand.wipeCurl, ring: hand.wipeCurl, pinky: hand.wipeCurl },
      frame,
      {
        ...hand,
        fingerVariety: hand.fingerVariety * settledFingers,
        fingerLife: hand.fingerLife * settledFingers,
      },
    ),
    spread: hand.spread,
    thumbCurl: 0.1,
    thumbReach: -0.2,
    wristBend: hand.wristBend,
    wristTwist: hand.wristTwist,
  };
  const holdPose = {
    curl: {
      index: hand.holdCurl * 0.8,
      middle: hand.holdCurl,
      ring: hand.holdCurl * 1.1,
      pinky: hand.holdCurl * 1.2,
    },
    spread: hand.spread * 0.6,
    thumbCurl: hand.thumbHold,
    thumbReach: 0.4,
    wristBend: hand.holdWristBend,
    wristTwist: hand.wristTwist,
  };
  const grip = THREE.MathUtils.smoothstep(motion.turn, 0.45, 1);
  const pose = {
    ...mixPose(wipePose, holdPose, motion.turn),
    thumbCurl: THREE.MathUtils.lerp(wipePose.thumbCurl, holdPose.thumbCurl, grip),
    thumbReach: THREE.MathUtils.lerp(wipePose.thumbReach, holdPose.thumbReach, grip),
  };
  const focus = motion.palm.position.clone().applyMatrix4(laptopTransform);
  return (
    <DeskStage
      camera={camera}
      light={light}
      frame={frame}
      lens={room.show ? lens : null}
      blurred={blurred}
      focus={[focus.x, focus.y, focus.z]}
    >
      {room.show ? (
        <DeskRoom
          wall={room.wall}
          desk={room.desk}
          deskRoughness={room.deskRoughness}
          wallDistance={room.wallDistance}
        />
      ) : null}
      {room.show && room.showPlant ? (
        <group position={[room.plantX, 0, room.plantZ]} scale={room.plantScale}>
          <Plant look={room} frame={frame} />
        </group>
      ) : null}
      <group matrixAutoUpdate={false} matrix={laptopTransform}>
        <LaptopModel
          look={laptop}
          glow={lens.screenGlow * screen.brightness}
          glowColor={screen.background}
          screen={
            <Screen
              screen={screen}
              wipe={wipe}
              cloth={cloth}
              progress={motion.wipe}
              reveal={motion.reveal}
            />
          }
        />
        <HeldTowel
          palm={motion.palm}
          pose={pose}
          holdPalm={settled.palm}
          holdPose={holdPose}
          skin={hand.skin}
          roughness={hand.roughness}
          detail={hand.detail}
          arm={arm}
          cloth={cloth.show ? cloth : null}
          press={motion.press}
          held={motion.turn}
          gap={hand.contactGap * 0.5}
          elbow={new THREE.Vector3(arm.elbowX, arm.elbowY, arm.elbowZ)}
        />
      </group>
    </DeskStage>
  );
};

const LaptopWipeReveal = (props: LaptopWipeRevealProps) => {
  const { lens, camera } = props;
  const blurred = getRemotionEnvironment().isRendering && lens.motionBlur > 1;
  return (
    <PromoLayer look={props.look} motion={props.motion}>
      {blurred ? (
        <CameraMotionBlur samples={lens.motionBlur} shutterAngle={lens.shutterAngle}>
          <DeskScene {...props} blurred />
        </CameraMotionBlur>
      ) : (
        <DeskScene {...props} blurred={false} />
      )}
      <LensOverlay grain={camera.grain} vignette={camera.vignette} />
    </PromoLayer>
  );
};

export const laptopWipeRevealScene: SceneModule = {
  id: 'laptop-wipe-reveal',
  component: LaptopWipeReveal,
  render: (key) => (
    <Composition
      key={key}
      id="laptop-wipe-reveal"
      component={LaptopWipeReveal}
      schema={laptopWipeRevealSchema}
      defaultProps={laptopWipeRevealDefaults}
      durationInFrames={laptopWipeRevealMeta.durationInFrames}
      fps={laptopWipeRevealMeta.fps}
      width={laptopWipeRevealMeta.width}
      height={laptopWipeRevealMeta.height}
    />
  ),
};
