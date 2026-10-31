import { Composition } from 'remotion';
import {
  type CountUpProps,
  countUpDefaults,
  countUpMeta,
  countUpSchema,
} from '@/schemas/clips/imported/count-up';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const CountUp = (props: CountUpProps) => <WebMotion variant={7} {...props} />;
export const countUpScene: SceneModule = {
  id: 'count-up',
  component: CountUp,
  render: (key) => (
    <Composition
      key={key}
      id="count-up"
      component={CountUp}
      schema={countUpSchema}
      defaultProps={countUpDefaults}
      width={countUpMeta.width}
      height={countUpMeta.height}
      fps={countUpMeta.fps}
      durationInFrames={countUpMeta.durationInFrames}
    />
  ),
};
