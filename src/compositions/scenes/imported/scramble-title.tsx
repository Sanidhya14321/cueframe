import { Composition } from 'remotion';
import {
  type ScrambleTitleProps,
  scrambleTitleDefaults,
  scrambleTitleMeta,
  scrambleTitleSchema,
} from '@/schemas/clips/imported/scramble-title';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const ScrambleTitle = (props: ScrambleTitleProps) => <WebMotion variant={3} {...props} />;
export const scrambleTitleScene: SceneModule = {
  id: 'scramble-title',
  component: ScrambleTitle,
  render: (key) => (
    <Composition
      key={key}
      id="scramble-title"
      component={ScrambleTitle}
      schema={scrambleTitleSchema}
      defaultProps={scrambleTitleDefaults}
      width={scrambleTitleMeta.width}
      height={scrambleTitleMeta.height}
      fps={scrambleTitleMeta.fps}
      durationInFrames={scrambleTitleMeta.durationInFrames}
    />
  ),
};
