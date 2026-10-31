import { Composition } from 'remotion';
import {
  type OrbitMarksProps,
  orbitMarksDefaults,
  orbitMarksMeta,
  orbitMarksSchema,
} from '@/schemas/clips/imported/orbit-marks';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const OrbitMarks = (props: OrbitMarksProps) => <WebMotion variant={16} {...props} />;
export const orbitMarksScene: SceneModule = {
  id: 'orbit-marks',
  component: OrbitMarks,
  render: (key) => (
    <Composition
      key={key}
      id="orbit-marks"
      component={OrbitMarks}
      schema={orbitMarksSchema}
      defaultProps={orbitMarksDefaults}
      width={orbitMarksMeta.width}
      height={orbitMarksMeta.height}
      fps={orbitMarksMeta.fps}
      durationInFrames={orbitMarksMeta.durationInFrames}
    />
  ),
};
