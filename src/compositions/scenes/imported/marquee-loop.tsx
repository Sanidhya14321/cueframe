import { Composition } from 'remotion';
import {
  type MarqueeLoopProps,
  marqueeLoopDefaults,
  marqueeLoopMeta,
  marqueeLoopSchema,
} from '@/schemas/clips/imported/marquee-loop';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const MarqueeLoop = (props: MarqueeLoopProps) => <WebMotion variant={11} {...props} />;
export const marqueeLoopScene: SceneModule = {
  id: 'marquee-loop',
  component: MarqueeLoop,
  render: (key) => (
    <Composition
      key={key}
      id="marquee-loop"
      component={MarqueeLoop}
      schema={marqueeLoopSchema}
      defaultProps={marqueeLoopDefaults}
      width={marqueeLoopMeta.width}
      height={marqueeLoopMeta.height}
      fps={marqueeLoopMeta.fps}
      durationInFrames={marqueeLoopMeta.durationInFrames}
    />
  ),
};
