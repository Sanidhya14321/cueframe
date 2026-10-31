import { useId } from 'react';
import { AbsoluteFill, Composition, useCurrentFrame } from 'remotion';
import {
  type ArchSaveTheDateProps,
  archSaveTheDateDefaults,
  archSaveTheDateMeta,
  archSaveTheDateSchema,
} from '@/schemas';
import { viewAt } from '../../invitations/arch-save-the-date/camera';
import { InviteLines } from '../../invitations/arch-save-the-date/invite-lines';
import { Palace } from '../../invitations/arch-save-the-date/palace';
import { TitleLockup } from '../../invitations/arch-save-the-date/title';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const ArchSaveTheDate = (props: ArchSaveTheDateProps) => {
  const { copy, type, timing, camera, motion } = props;
  const time = useCurrentFrame() * motion.speed;
  const prefix = `arch${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const view = viewAt(time, camera);
  return (
    <TransitionFrame motion={motion}>
      <AbsoluteFill>
        <Palace props={props} view={view} time={time} prefix={prefix} />
        <TitleLockup copy={copy} type={type} timing={timing} time={time} />
        <InviteLines copy={copy} type={type} timing={timing} time={time} />
      </AbsoluteFill>
    </TransitionFrame>
  );
};

export const archSaveTheDateScene: SceneModule = {
  id: 'arch-save-the-date',
  component: ArchSaveTheDate,
  render: (key) => (
    <Composition
      key={key}
      id="arch-save-the-date"
      component={ArchSaveTheDate}
      schema={archSaveTheDateSchema}
      defaultProps={archSaveTheDateDefaults}
      durationInFrames={archSaveTheDateMeta.durationInFrames}
      fps={archSaveTheDateMeta.fps}
      width={archSaveTheDateMeta.width}
      height={archSaveTheDateMeta.height}
    />
  ),
};
