import { CameraMotionBlur } from '@remotion/motion-blur';
import { useMemo } from 'react';
import { AbsoluteFill, Composition, getRemotionEnvironment, useCurrentFrame } from 'remotion';
import {
  type SpillRevealProps,
  spillRevealDefaults,
  spillRevealMeta,
  spillRevealSchema,
} from '@/schemas';
import { DeskStage } from '../../promo/desk/desk-stage';
import { HandModel, useHandScene } from '../../promo/desk/hand-model';
import { applyHandPose } from '../../promo/desk/hand-rig';
import { LensOverlay } from '../../promo/desk/lens';
import { PromoLayer } from '../../promo/promo-layer';
import type { SceneModule } from '../../scene-module';
import { PaperCup } from '../../spill/cup';
import { Napkin } from '../../spill/napkin';
import { Puddle } from '../../spill/puddle';
import { puddleShape, type SpillMotion, spillMotion } from '../../spill/spill-motion';
import { SpillTable } from '../../spill/table';

const Hand = ({ motion, props }: { motion: SpillMotion; props: SpillRevealProps }) => {
  const hand = useHandScene();
  if (motion.palm === null) {
    return null;
  }
  applyHandPose(hand.rig, motion.pose);
  return (
    <HandModel
      hand={hand}
      palm={motion.palm}
      skin={props.hand.skin}
      roughness={props.hand.roughness}
      detail={props.hand.detail}
      arm={props.arm}
      elbow={motion.elbow}
    />
  );
};

const SpillScene = ({ blurred, ...props }: SpillRevealProps & { blurred: boolean }) => {
  const frame = useCurrentFrame() * props.motion.speed;
  const { cup, water } = props;
  const puddle = useMemo(() => puddleShape(cup, water), [cup, water]);
  const motion = spillMotion(props, frame, spillRevealMeta.durationInFrames, puddle);
  return (
    <AbsoluteFill style={{ transform: props.camera.mirror ? 'scaleX(-1)' : undefined }}>
      <DeskStage
        camera={motion.camera}
        light={props.light}
        frame={frame}
        lens={props.lens}
        blurred={blurred}
        focus={motion.focus}
        supersample={false}
      >
        <SpillTable look={props.table} />
        <Puddle
          shape={motion.puddle}
          reach={motion.reach}
          tint={props.water.tint}
          opacity={props.water.opacity}
          gloss={props.water.gloss}
        />
        <group matrixAutoUpdate={false} matrix={motion.cup}>
          <PaperCup
            look={props.cup}
            mirror={props.camera.mirror}
            fill={motion.fill}
            tilt={motion.tilt}
          />
        </group>
        <Napkin
          look={props.napkin}
          message={props.message}
          mirror={props.camera.mirror}
          puddle={motion.puddle}
          edgeZ={props.table.edgeZ}
          pose={{ drop: motion.drop, soak: motion.soak, frame }}
        />
        <Hand motion={motion} props={props} />
      </DeskStage>
    </AbsoluteFill>
  );
};

const SpillReveal = (props: SpillRevealProps) => {
  const { lens, camera } = props;
  const blurred = getRemotionEnvironment().isRendering && lens.motionBlur > 1;
  return (
    <PromoLayer look={props.look} motion={props.motion}>
      {blurred ? (
        <CameraMotionBlur samples={lens.motionBlur} shutterAngle={lens.shutterAngle}>
          <SpillScene {...props} blurred />
        </CameraMotionBlur>
      ) : (
        <SpillScene {...props} blurred={false} />
      )}
      <LensOverlay grain={camera.grain} vignette={camera.vignette} />
    </PromoLayer>
  );
};

export const spillRevealScene: SceneModule = {
  id: 'spill-reveal',
  component: SpillReveal,
  render: (key) => (
    <Composition
      key={key}
      id="spill-reveal"
      component={SpillReveal}
      schema={spillRevealSchema}
      defaultProps={spillRevealDefaults}
      durationInFrames={spillRevealMeta.durationInFrames}
      fps={spillRevealMeta.fps}
      width={spillRevealMeta.width}
      height={spillRevealMeta.height}
    />
  ),
};
