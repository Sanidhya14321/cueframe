import { Composition } from 'remotion';
import {
  type BorderOrbitProps,
  borderOrbitDefaults,
  borderOrbitMeta,
  borderOrbitSchema,
} from '@/schemas/clips/imported/border-orbit';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const BorderOrbit = (props: BorderOrbitProps) => <WebMotion variant={10} {...props} />;
export const borderOrbitScene: SceneModule = {
  id: 'border-orbit',
  component: BorderOrbit,
  render: (key) => (
    <Composition
      key={key}
      id="border-orbit"
      component={BorderOrbit}
      schema={borderOrbitSchema}
      defaultProps={borderOrbitDefaults}
      width={borderOrbitMeta.width}
      height={borderOrbitMeta.height}
      fps={borderOrbitMeta.fps}
      durationInFrames={borderOrbitMeta.durationInFrames}
    />
  ),
};
