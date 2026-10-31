import { Composition } from 'remotion';
import {
  type ShimmerTitleProps,
  shimmerTitleDefaults,
  shimmerTitleMeta,
  shimmerTitleSchema,
} from '@/schemas/clips/imported/shimmer-title';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const ShimmerTitle = (props: ShimmerTitleProps) => <WebMotion variant={6} {...props} />;
export const shimmerTitleScene: SceneModule = {
  id: 'shimmer-title',
  component: ShimmerTitle,
  render: (key) => (
    <Composition
      key={key}
      id="shimmer-title"
      component={ShimmerTitle}
      schema={shimmerTitleSchema}
      defaultProps={shimmerTitleDefaults}
      width={shimmerTitleMeta.width}
      height={shimmerTitleMeta.height}
      fps={shimmerTitleMeta.fps}
      durationInFrames={shimmerTitleMeta.durationInFrames}
    />
  ),
};
