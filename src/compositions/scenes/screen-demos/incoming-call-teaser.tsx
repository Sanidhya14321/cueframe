import { Composition, useCurrentFrame } from 'remotion';
import {
  type IncomingCallTeaserProps,
  incomingCallTeaserDefaults,
  incomingCallTeaserMeta,
  incomingCallTeaserSchema,
} from '@/schemas';
import { CallScreen } from '../../incoming-call-teaser/call-screen';
import { LoadingWall } from '../../incoming-call-teaser/loading-wall';
import { SignOff } from '../../incoming-call-teaser/sign-off';
import { teaserTimeline } from '../../incoming-call-teaser/timeline';
import { WordBeats } from '../../incoming-call-teaser/word-beats';
import { PromoLayer } from '../../promo/promo-layer';
import type { SceneModule } from '../../scene-module';

const TeaserBeat = ({ frame, ...props }: IncomingCallTeaserProps & { frame: number }) => {
  const timeline = teaserTimeline(props);
  if (frame < timeline.callEnd) {
    return <CallScreen call={props.call} frame={frame} />;
  }
  if (frame < timeline.wordsEnd) {
    return <WordBeats words={props.words} timeline={timeline} frame={frame} />;
  }
  if (frame < timeline.wallEnd) {
    return <LoadingWall wall={props.wall} frame={frame - timeline.wordsEnd} />;
  }
  if (frame < timeline.outroStart) {
    return null;
  }
  return <SignOff outro={props.outro} frame={frame - timeline.outroStart} />;
};

const IncomingCallTeaser = (props: IncomingCallTeaserProps) => {
  const frame = useCurrentFrame() * props.motion.speed;
  return (
    <PromoLayer look={props.look} motion={props.motion}>
      <TeaserBeat {...props} frame={frame} />
    </PromoLayer>
  );
};

export const incomingCallTeaserScene: SceneModule = {
  id: 'incoming-call-teaser',
  component: IncomingCallTeaser,
  render: (key) => (
    <Composition
      key={key}
      id="incoming-call-teaser"
      component={IncomingCallTeaser}
      schema={incomingCallTeaserSchema}
      defaultProps={incomingCallTeaserDefaults}
      durationInFrames={incomingCallTeaserMeta.durationInFrames}
      fps={incomingCallTeaserMeta.fps}
      width={incomingCallTeaserMeta.width}
      height={incomingCallTeaserMeta.height}
    />
  ),
};
