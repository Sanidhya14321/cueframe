import { Composition } from 'remotion';
import {
  type MagnifierCaptionProps,
  magnifierCaptionDefaults,
  magnifierCaptionMeta,
  magnifierCaptionSchema,
} from '@/schemas';
import { MagnifierScene } from '../../magnifier/magnifier-scene';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';

const MagnifierCaption = (props: MagnifierCaptionProps) => (
  <TransitionFrame motion={props.motion}>
    <MagnifierScene {...props} />
  </TransitionFrame>
);

export const magnifierCaptionScene: SceneModule = {
  id: 'magnifier-caption',
  component: MagnifierCaption,
  render: (key) => (
    <Composition
      key={key}
      id="magnifier-caption"
      component={MagnifierCaption}
      schema={magnifierCaptionSchema}
      defaultProps={magnifierCaptionDefaults}
      durationInFrames={magnifierCaptionMeta.durationInFrames}
      fps={magnifierCaptionMeta.fps}
      width={magnifierCaptionMeta.width}
      height={magnifierCaptionMeta.height}
    />
  ),
};
