import { AbsoluteFill, Composition, Sequence, useCurrentFrame } from 'remotion';
import {
  type ProblemStrikeoutProps,
  problemStrikeoutDefaults,
  problemStrikeoutMeta,
  problemStrikeoutSchema,
} from '@/schemas';
import { smooth, tween } from '../../promo/timing';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';
import { NotebookScene } from '../../strikeout/notebook-scene';
import { SolutionCard } from '../../strikeout/solution-card';

const ProblemStrikeout = (props: ProblemStrikeoutProps) => {
  const frame = useCurrentFrame() * props.motion.speed;
  const { cutFrame, crossfade } = props.timing;
  const cardFrom = cutFrame - crossfade;
  const cardShown = crossfade > 0 ? tween(frame, [cardFrom, cutFrame], [0, 1], smooth) : 1;
  return (
    <TransitionFrame motion={props.motion}>
      <Sequence durationInFrames={Math.ceil(cutFrame / props.motion.speed)} layout="none">
        <NotebookScene {...props} />
      </Sequence>
      <Sequence from={Math.floor(cardFrom / props.motion.speed)} layout="none">
        <AbsoluteFill
          style={{
            opacity: cardShown,
            transform: `scale(${(1.06 - 0.06 * cardShown).toFixed(4)})`,
          }}
        >
          <SolutionCard card={props.card} lead={crossfade} speed={props.motion.speed} />
        </AbsoluteFill>
      </Sequence>
    </TransitionFrame>
  );
};

export const problemStrikeoutScene: SceneModule = {
  id: 'problem-strikeout',
  component: ProblemStrikeout,
  render: (key) => (
    <Composition
      key={key}
      id="problem-strikeout"
      component={ProblemStrikeout}
      schema={problemStrikeoutSchema}
      defaultProps={problemStrikeoutDefaults}
      durationInFrames={problemStrikeoutMeta.durationInFrames}
      fps={problemStrikeoutMeta.fps}
      width={problemStrikeoutMeta.width}
      height={problemStrikeoutMeta.height}
    />
  ),
};
