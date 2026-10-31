import { Composition } from 'remotion';
import {
  type DotWaveProps,
  dotWaveDefaults,
  dotWaveMeta,
  dotWaveSchema,
} from '@/schemas/clips/imported/dot-wave';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const DotWave = (props: DotWaveProps) => <WebMotion variant={13} {...props} />;
export const dotWaveScene: SceneModule = {
  id: 'dot-wave',
  component: DotWave,
  render: (key) => (
    <Composition
      key={key}
      id="dot-wave"
      component={DotWave}
      schema={dotWaveSchema}
      defaultProps={dotWaveDefaults}
      width={dotWaveMeta.width}
      height={dotWaveMeta.height}
      fps={dotWaveMeta.fps}
      durationInFrames={dotWaveMeta.durationInFrames}
    />
  ),
};
