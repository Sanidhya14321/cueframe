import { useId, useMemo } from 'react';
import { AbsoluteFill, Composition, useCurrentFrame } from 'remotion';
import {
  type MiniaturePanoramaProps,
  miniaturePanoramaDefaults,
  miniaturePanoramaMeta,
  miniaturePanoramaSchema,
} from '@/schemas';
import {
  FRAME_HEIGHT,
  FRAME_WIDTH,
  gardenView,
  lakeView,
  motionBlur,
  nightView,
  scheduleFrom,
} from '../../invitations/miniature-panorama/camera';
import { makeIds } from '../../invitations/miniature-panorama/defs';
import { GardenWorld } from '../../invitations/miniature-panorama/garden-world';
import { InviteText } from '../../invitations/miniature-panorama/invite-text';
import { LakeWorld } from '../../invitations/miniature-panorama/lake-world';
import { NightWorld } from '../../invitations/miniature-panorama/night-world';
import { nightPaint, paintFrom } from '../../invitations/miniature-panorama/palette';
import { Petals } from '../../invitations/miniature-panorama/sky';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const LAYER = { position: 'absolute', left: 0, top: 0 } as const;

const MiniaturePanorama = (props: MiniaturePanoramaProps) => {
  const { camera, timing, motion, look, invite, petals } = props;
  const frame = useCurrentFrame() * motion.speed;
  const schedule = useMemo(() => scheduleFrom(timing), [timing]);
  const paint = useMemo(() => paintFrom(props), [props]);
  const dark = useMemo(() => nightPaint(paint, props.night), [paint, props.night]);
  const base = useId().replace(/[^a-zA-Z0-9]/g, '');
  const ids = useMemo(
    () => ({ lake: makeIds(`${base}l`), night: makeIds(`${base}n`), garden: makeIds(`${base}g`) }),
    [base],
  );
  const lake = (at: number) => lakeView(at, schedule, camera);
  const night = (at: number) => nightView(at, schedule, camera);
  const garden = (at: number) => gardenView(at, schedule, camera);
  const shared = { frame, paint, schedule, parallax: camera.parallax, backdrop: look.showBackdrop };
  return (
    <TransitionFrame motion={motion}>
      <AbsoluteFill>
        <LakeWorld
          {...shared}
          view={lake(frame)}
          blur={motionBlur(lake, frame, camera.blur)}
          ids={ids.lake}
          closeUp={camera.closeUp}
        />
        <NightWorld
          {...shared}
          paint={dark}
          view={night(frame)}
          blur={motionBlur(night, frame, camera.blur)}
          ids={ids.night}
        />
        <GardenWorld
          {...shared}
          view={garden(frame)}
          blur={motionBlur(garden, frame, camera.blur)}
          ids={ids.garden}
        />
        {petals.count > 0 ? (
          <svg
            width={FRAME_WIDTH}
            height={FRAME_HEIGHT}
            viewBox={`0 0 ${FRAME_WIDTH} ${FRAME_HEIGHT}`}
            style={LAYER}
            aria-hidden="true"
          >
            <Petals count={petals.count} color={petals.color} frame={frame} />
          </svg>
        ) : null}
        <InviteText invite={invite} frame={frame} />
      </AbsoluteFill>
    </TransitionFrame>
  );
};

export const miniaturePanoramaScene: SceneModule = {
  id: 'miniature-panorama',
  component: MiniaturePanorama,
  render: (key) => (
    <Composition
      key={key}
      id="miniature-panorama"
      component={MiniaturePanorama}
      schema={miniaturePanoramaSchema}
      defaultProps={miniaturePanoramaDefaults}
      durationInFrames={miniaturePanoramaMeta.durationInFrames}
      fps={miniaturePanoramaMeta.fps}
      width={miniaturePanoramaMeta.width}
      height={miniaturePanoramaMeta.height}
    />
  ),
};
