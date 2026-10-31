import { AbsoluteFill, Composition, useCurrentFrame } from 'remotion';
import {
  type HangingWordsProps,
  hangingWordsDefaults,
  hangingWordsMeta,
  hangingWordsSchema,
} from '@/schemas';
import { FollowWord } from '../../hanging-words/follow-word';
import { HangingAct } from '../../hanging-words/hanging-act';
import { InkDrop, inkCovers } from '../../hanging-words/ink-drop';
import { RepeatStack } from '../../hanging-words/repeat-stack';
import { WordFlash } from '../../hanging-words/word-flash';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const HangingWords = (props: HangingWordsProps) => {
  const frame = useCurrentFrame() * props.motion.speed;
  const { look, drop } = props;
  const firstActOver = frame >= drop.fallStart + drop.fallFrames;
  const nightFull = frame >= drop.fallStart && inkCovers(props, frame);
  const nightOver = frame >= drop.liftStart;
  return (
    <TransitionFrame motion={props.motion}>
      {look.showBackdrop ? <AbsoluteFill style={{ background: look.background }} /> : null}
      {firstActOver || nightOver ? null : <HangingAct props={props} frame={frame} />}
      {look.showBackdrop ? <InkDrop props={props} frame={frame} /> : null}
      {nightFull && !nightOver ? <WordFlash props={props} frame={frame} /> : null}
      <RepeatStack props={props} frame={frame} />
      <FollowWord props={props} frame={frame} />
    </TransitionFrame>
  );
};

export const hangingWordsScene: SceneModule = {
  id: 'hanging-words',
  component: HangingWords,
  render: (key) => (
    <Composition
      key={key}
      id="hanging-words"
      component={HangingWords}
      schema={hangingWordsSchema}
      defaultProps={hangingWordsDefaults}
      durationInFrames={hangingWordsMeta.durationInFrames}
      fps={hangingWordsMeta.fps}
      width={hangingWordsMeta.width}
      height={hangingWordsMeta.height}
    />
  ),
};
