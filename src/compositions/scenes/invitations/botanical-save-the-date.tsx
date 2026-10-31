import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type BotanicalSaveTheDateProps,
  botanicalSaveTheDateDefaults,
  botanicalSaveTheDateMeta,
  botanicalSaveTheDateSchema,
} from '@/schemas';
import { ARCH, Scenery } from '../../invitations/botanical-save-the-date/scenery';
import { timelineOf } from '../../invitations/botanical-save-the-date/timeline';
import { archCenter } from '../../invitations/botanical-save-the-date/tropical';
import { type Cue, onStage } from '../../invitations/botanical-save-the-date/type';
import { voiceOf } from '../../invitations/botanical-save-the-date/voice';
import { ArcText, WeddingWords } from '../../invitations/botanical-save-the-date/wedding-words';
import {
  Couple,
  EventWords,
  Invitation,
  SaveTheDate,
  Verse,
} from '../../invitations/botanical-save-the-date/words';
import { PromoLayer } from '../../promo/promo-layer';
import type { SceneModule } from '../../scene-module';

const BotanicalSaveTheDate = (props: BotanicalSaveTheDateProps) => {
  const frame = useCurrentFrame() * props.motion.speed;
  const { width, height, durationInFrames } = useVideoConfig();
  const timeline = timelineOf(props, durationInFrames);
  const { beats } = timeline;
  const voice = voiceOf(props);
  const { lettering, timing } = props;
  const y = (top: number) => top + lettering.offsetY;
  const shared = { frame, voice, lettering, stagger: timing.lineStagger };
  const show = (cue: Cue) => onStage(frame, cue);
  const arch = archCenter(ARCH);
  return (
    <PromoLayer look={props.look} motion={props.motion}>
      <AbsoluteFill>
        <Scenery props={props} timeline={timeline} frame={frame} width={width} height={height} />
        {show(beats.verseOne.cue) ? (
          <Verse {...shared} cue={beats.verseOne.cue} text={props.verseOne} top={y(705)} />
        ) : null}
        {show(beats.verseTwo.cue) ? (
          <Verse {...shared} cue={beats.verseTwo.cue} text={props.verseTwo} top={y(705)} />
        ) : null}
        {show(beats.save.cue) ? (
          <SaveTheDate
            {...shared}
            cue={beats.save.cue}
            top={y(650)}
            words={{
              top: props.saveTop,
              joiner: props.saveJoiner,
              bottom: props.saveBottom,
              date: props.date,
            }}
          />
        ) : null}
        {show(beats.couple.cue) ? (
          <Couple
            {...shared}
            cue={beats.couple.cue}
            top={y(1130)}
            inset={130}
            words={{
              intro: props.coupleIntro,
              first: props.partnerOne,
              joiner: props.partnerJoiner,
              second: props.partnerTwo,
            }}
          />
        ) : null}
        {show(beats.invite.cue) ? (
          <Invitation
            {...shared}
            cue={beats.invite.cue}
            top={y(540)}
            words={{
              line: props.inviteLine,
              script: props.inviteScript,
              first: props.partnerOne,
              firstFamily: props.partnerOneFamily,
              second: props.partnerTwo,
              secondFamily: props.partnerTwoFamily,
            }}
          />
        ) : null}
        {show(beats.mehendi.cue) ? (
          <EventWords {...shared} cue={beats.mehendi.cue} top={y(720)} event={props.mehendi} />
        ) : null}
        {show(beats.ring.cue) ? (
          <EventWords {...shared} cue={beats.ring.cue} top={y(520)} event={props.ring} />
        ) : null}
        {show(beats.wedding.cue) ? (
          <>
            <ArcText
              text={props.wedding.arcText}
              center={arch}
              radius={(ARCH.right - ARCH.left) / 2 - 46}
              startAngle={-174}
              size={lettering.detailSize * 0.66}
              tracking={0.3}
              frame={frame}
              cue={beats.wedding.cue}
              voice={voice}
            />
            <WeddingWords
              {...shared}
              cue={beats.wedding.cue}
              top={y(470)}
              inset={120}
              noteTop={y(1480)}
              wedding={props.wedding}
            />
          </>
        ) : null}
        {show(beats.closing.cue) ? (
          <Verse {...shared} cue={beats.closing.cue} text={props.closing} top={y(785)} />
        ) : null}
      </AbsoluteFill>
    </PromoLayer>
  );
};

export const botanicalSaveTheDateScene: SceneModule = {
  id: 'botanical-save-the-date',
  component: BotanicalSaveTheDate,
  render: (key) => (
    <Composition
      key={key}
      id="botanical-save-the-date"
      component={BotanicalSaveTheDate}
      schema={botanicalSaveTheDateSchema}
      defaultProps={botanicalSaveTheDateDefaults}
      durationInFrames={botanicalSaveTheDateMeta.durationInFrames}
      fps={botanicalSaveTheDateMeta.fps}
      width={botanicalSaveTheDateMeta.width}
      height={botanicalSaveTheDateMeta.height}
    />
  ),
};
