import { CameraMotionBlur } from '@remotion/motion-blur';
import { Composition, getRemotionEnvironment, useCurrentFrame } from 'remotion';
import {
  type CrumpledPaperRevealProps,
  crumpledPaperRevealDefaults,
  crumpledPaperRevealMeta,
  crumpledPaperRevealSchema,
} from '@/schemas';
import { CrumpledSheet } from '../../paper/crumpled-sheet';
import { paperCues } from '../../paper/paper-cues';
import { PaperHands } from '../../paper/paper-hands';
import { PaperWall } from '../../paper/paper-wall';
import { DeskStage } from '../../promo/desk/desk-stage';
import { LensOverlay } from '../../promo/desk/lens';
import { PromoLayer } from '../../promo/promo-layer';
import type { SceneModule } from '../../scene-module';

const PaperScene = ({ blurred, ...props }: CrumpledPaperRevealProps & { blurred: boolean }) => {
  const { print, paper, hands, room, light, lens } = props;
  const frame = useCurrentFrame() * props.motion.speed;
  const cues = paperCues(props, frame);
  return (
    <DeskStage
      camera={cues.camera}
      light={light}
      frame={frame}
      lens={{ ...lens, screenGlow: 0 }}
      blurred={blurred}
      focus={[cues.focus.x, cues.focus.y, cues.focus.z]}
    >
      <PaperWall color={room.wall} distance={room.wallDistance} glow={room.glow} />
      <group matrixAutoUpdate={false} matrix={cues.transform}>
        <CrumpledSheet shape={paper} state={cues.state} print={print} look={paper} />
      </group>
      {hands.show ? (
        <PaperHands frame={frame} look={hands} top={cues.top} bottom={cues.bottom} />
      ) : null}
    </DeskStage>
  );
};

const CrumpledPaperReveal = (props: CrumpledPaperRevealProps) => {
  const { lens, camera } = props;
  const blurred = getRemotionEnvironment().isRendering && lens.motionBlur > 1;
  return (
    <PromoLayer look={props.look} motion={props.motion}>
      {blurred ? (
        <CameraMotionBlur samples={lens.motionBlur} shutterAngle={lens.shutterAngle}>
          <PaperScene {...props} blurred />
        </CameraMotionBlur>
      ) : (
        <PaperScene {...props} blurred={false} />
      )}
      <LensOverlay grain={camera.grain} vignette={camera.vignette} />
    </PromoLayer>
  );
};

export const crumpledPaperRevealScene: SceneModule = {
  id: 'crumpled-paper-reveal',
  component: CrumpledPaperReveal,
  render: (key) => (
    <Composition
      key={key}
      id="crumpled-paper-reveal"
      component={CrumpledPaperReveal}
      schema={crumpledPaperRevealSchema}
      defaultProps={crumpledPaperRevealDefaults}
      durationInFrames={crumpledPaperRevealMeta.durationInFrames}
      fps={crumpledPaperRevealMeta.fps}
      width={crumpledPaperRevealMeta.width}
      height={crumpledPaperRevealMeta.height}
    />
  ),
};
