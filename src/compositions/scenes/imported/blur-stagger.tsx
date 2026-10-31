import { Composition } from 'remotion';
import {
  type BlurStaggerProps,
  blurStaggerDefaults,
  blurStaggerMeta,
  blurStaggerSchema,
} from '@/schemas/clips/imported/blur-stagger';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const BlurStagger = (props: BlurStaggerProps) => <WebMotion variant={1} {...props} />;
export const blurStaggerScene: SceneModule = {
  id: 'blur-stagger',
  component: BlurStagger,
  render: (key) => (
    <Composition
      key={key}
      id="blur-stagger"
      component={BlurStagger}
      schema={blurStaggerSchema}
      defaultProps={blurStaggerDefaults}
      width={blurStaggerMeta.width}
      height={blurStaggerMeta.height}
      fps={blurStaggerMeta.fps}
      durationInFrames={blurStaggerMeta.durationInFrames}
    />
  ),
};
