import { AbsoluteFill, Composition, useCurrentFrame } from 'remotion';
import {
  type ScrollerWallProps,
  scrollerWallDefaults,
  scrollerWallMeta,
  scrollerWallSchema,
} from '@/schemas';
import { smooth, tween } from '../../promo/timing';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';
import { ContactWall } from '../../scroller-wall/contact-wall';
import { DotBridge } from '../../scroller-wall/dot-bridge';
import { EndCard } from '../../scroller-wall/end-card';
import { useWallFonts } from '../../scroller-wall/fonts';
import { HeyIntro } from '../../scroller-wall/hey-intro';
import { HeadlineStack, headlineSpan, ScrollerStack } from '../../scroller-wall/word-beats';

const Field = ({ frame, props }: { frame: number; props: ScrollerWallProps }) => {
  const { look, intro, wall } = props;
  const wash = tween(frame, [wall.washAt, wall.washAt + wall.washFrames], [0, 1], smooth);
  return (
    <AbsoluteFill style={{ background: frame < intro.cutAt ? look.paper : look.field }}>
      {wash > 0 ? (
        <AbsoluteFill
          style={{
            opacity: wash,
            background: `linear-gradient(to bottom left, ${wall.washTop}, ${wall.washMiddle} 52%, ${wall.washBottom})`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

const ScrollerWall = (props: ScrollerWallProps) => {
  useWallFonts(props);
  const frame = useCurrentFrame() * props.motion.speed;
  const { look, scroller, headline, words, dots, contact, wall, card } = props;
  const [headlineFrom, headlineTo] = headlineSpan(headline);
  const wordsFrom = Math.min(...words.items.map((item) => item.at));
  const white = tween(frame, [wall.whiteAt, wall.whiteAt + wall.whiteFrames], [0, 1], smooth);
  const cardOpaque = frame >= card.at + card.fadeFrames;
  return (
    <TransitionFrame motion={props.motion}>
      {look.showBackdrop && !cardOpaque ? <Field frame={frame} props={props} /> : null}
      {frame < scroller.at ? <HeyIntro frame={frame} props={props} /> : null}
      {frame >= scroller.at && frame < scroller.endAt ? (
        <ScrollerStack frame={frame} props={props} />
      ) : null}
      {frame >= headlineFrom && frame < headlineTo ? (
        <HeadlineStack frame={frame} props={props} />
      ) : null}
      {frame >= contact.at && !cardOpaque ? <ContactWall frame={frame} props={props} /> : null}
      {frame >= wordsFrom && frame < dots.fadeAt + dots.fadeFrames ? (
        <DotBridge frame={frame} props={props} />
      ) : null}
      {look.showBackdrop && white > 0 && !cardOpaque ? (
        <AbsoluteFill style={{ background: card.background, opacity: white }} />
      ) : null}
      {frame >= card.at ? (
        <EndCard frame={frame} card={card} showBackdrop={look.showBackdrop} />
      ) : null}
    </TransitionFrame>
  );
};

export const scrollerWallScene: SceneModule = {
  id: 'scroller-wall',
  component: ScrollerWall,
  render: (key) => (
    <Composition
      key={key}
      id="scroller-wall"
      component={ScrollerWall}
      schema={scrollerWallSchema}
      defaultProps={scrollerWallDefaults}
      durationInFrames={scrollerWallMeta.durationInFrames}
      fps={scrollerWallMeta.fps}
      width={scrollerWallMeta.width}
      height={scrollerWallMeta.height}
    />
  ),
};
