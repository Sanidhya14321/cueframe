import { CameraMotionBlur } from '@remotion/motion-blur';
import { useEffect, useMemo, useState } from 'react';
import { AbsoluteFill, getRemotionEnvironment, useCurrentFrame, useDelayRender } from 'remotion';
import type { ProblemStrikeoutProps } from '@/schemas';
import { DeskStage } from '../promo/desk/desk-stage';
import { LensOverlay } from '../promo/desk/lens';
import { handFontReady, handFonts } from '../promo/fonts';
import { cameraShot, canvasToWorld, pencilState, strikeSchedule } from './choreography';
import { DeskMat } from './desk-mat';
import { Notebook } from './notebook';
import { layoutProblems, strikePath } from './page-art';
import { Pencil, pencilAxis } from './pencil';
import { WritingHand } from './writing-hand';

const useHandFontLoaded = (page: ProblemStrikeoutProps['page']): boolean => {
  const [loaded, setLoaded] = useState(false);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    const handle = delayRender('Loading the handwriting font');
    let active = true;
    handFontReady(page.font)
      .then(() => document.fonts.load(`700 ${page.size}px "${handFonts[page.font]}"`))
      .then(() => {
        if (active) {
          setLoaded(true);
        }
        continueRender(handle);
      })
      .catch(() => {
        continueRender(handle);
      });
    return () => {
      active = false;
      continueRender(handle);
    };
  }, [page.font, page.size, delayRender, continueRender]);
  return loaded;
};

const useStrikePaths = (page: ProblemStrikeoutProps['page']) => {
  const loaded = useHandFontLoaded(page);
  return useMemo(() => {
    const context = document.createElement('canvas').getContext('2d');
    if (context === null || !loaded) {
      return [];
    }
    return layoutProblems(context, page, handFonts[page.font]).map((problem, index) =>
      strikePath(problem, page, index),
    );
  }, [page, loaded]);
};

const Desk = ({ blurred, ...props }: ProblemStrikeoutProps & { blurred: boolean }) => {
  const { page, notebook, pencil, timing, desk, camera, light, lens } = props;
  const frame = useCurrentFrame() * props.motion.speed;
  const paths = useStrikePaths(page);
  const schedule = useMemo(() => strikeSchedule(paths, timing), [paths, timing]);
  const shot = cameraShot(paths, schedule, props, frame);
  const state = pencilState(paths, schedule, timing, pencil.lift, frame);
  const tip = canvasToWorld(notebook, state.tip, state.height);
  const axis = pencilAxis(pencil, state.sweep);
  return (
    <DeskStage
      camera={{
        x: shot.eye.x,
        y: shot.eye.y,
        z: shot.eye.z,
        targetX: shot.target.x,
        targetY: shot.target.y,
        targetZ: shot.target.z,
        fieldOfView: camera.fieldOfView,
        handheld: camera.handheld,
      }}
      light={light}
      frame={frame}
      lens={{ ...lens, screenGlow: 0 }}
      blurred={blurred}
      focus={[shot.focus.x, shot.focus.y, shot.focus.z]}
    >
      <DeskMat color={desk.surface} roughness={desk.roughness} />
      <Notebook page={page} notebook={notebook} schedule={schedule} paths={paths} frame={frame} />
      {pencil.show ? <Pencil pencil={pencil} tip={tip} axis={axis} /> : null}
      {pencil.show && props.hand.show ? (
        <WritingHand hand={props.hand} tip={tip} axis={axis} frame={frame} />
      ) : null}
    </DeskStage>
  );
};

export const NotebookScene = (props: ProblemStrikeoutProps) => {
  const { lens, camera } = props;
  const blurred = getRemotionEnvironment().isRendering && lens.motionBlur > 1;
  return (
    <AbsoluteFill style={{ background: props.desk.surface }}>
      {blurred ? (
        <CameraMotionBlur samples={lens.motionBlur} shutterAngle={lens.shutterAngle}>
          <Desk {...props} blurred />
        </CameraMotionBlur>
      ) : (
        <Desk {...props} blurred={false} />
      )}
      <LensOverlay grain={camera.grain} vignette={camera.vignette} />
    </AbsoluteFill>
  );
};
