import { AbsoluteFill, Composition, useCurrentFrame } from 'remotion';
import {
  type GoldMonogramInviteProps,
  goldMonogramInviteDefaults,
  goldMonogramInviteMeta,
  goldMonogramInviteSchema,
} from '@/schemas';
import { inviteScriptFonts, inviteSerifFonts } from '../../invitations/fonts';
import { BandAct } from '../../invitations/gold-monogram-invite/band';
import { LotusAct } from '../../invitations/gold-monogram-invite/lotus';
import { QuoteAct } from '../../invitations/gold-monogram-invite/quote';
import { RingAct } from '../../invitations/gold-monogram-invite/ring-event';
import { StageAct } from '../../invitations/gold-monogram-invite/stage';
import { TitleAct } from '../../invitations/gold-monogram-invite/title';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const GoldMonogramInvite = (props: GoldMonogramInviteProps) => {
  const frame = useCurrentFrame() * props.motion.speed;
  const serif = inviteSerifFonts[props.fonts.serif];
  const script = inviteScriptFonts[props.fonts.script];
  const fonts = { serif, script };
  const [lotusEvent, ringEvent, bandEvent] = props.events;
  return (
    <TransitionFrame motion={props.motion}>
      {props.background.show ? (
        <AbsoluteFill style={{ backgroundColor: props.background.night }} />
      ) : null}
      <QuoteAct frame={frame} {...props} {...fonts} />
      <TitleAct frame={frame} {...props} {...fonts} />
      <StageAct frame={frame} {...props} {...fonts} />
      {lotusEvent === undefined ? null : (
        <LotusAct frame={frame} {...props} {...fonts} event={lotusEvent} />
      )}
      {ringEvent === undefined ? null : (
        <RingAct frame={frame} {...props} {...fonts} event={ringEvent} />
      )}
      {bandEvent === undefined ? null : (
        <BandAct frame={frame} {...props} {...fonts} event={bandEvent} />
      )}
    </TransitionFrame>
  );
};

export const goldMonogramInviteScene: SceneModule = {
  id: 'gold-monogram-invite',
  component: GoldMonogramInvite,
  render: (key) => (
    <Composition
      key={key}
      id="gold-monogram-invite"
      component={GoldMonogramInvite}
      schema={goldMonogramInviteSchema}
      defaultProps={goldMonogramInviteDefaults}
      durationInFrames={goldMonogramInviteMeta.durationInFrames}
      fps={goldMonogramInviteMeta.fps}
      width={goldMonogramInviteMeta.width}
      height={goldMonogramInviteMeta.height}
    />
  ),
};
