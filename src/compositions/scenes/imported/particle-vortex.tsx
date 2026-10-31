import { Composition } from 'remotion';
import {
  type ParticleVortexProps,
  particleVortexDefaults,
  particleVortexMeta,
  particleVortexSchema,
} from '@/schemas/clips/imported/particle-vortex';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const ParticleVortex = (props: ParticleVortexProps) => <WebMotion variant={23} {...props} />;
export const particleVortexScene: SceneModule = {
  id: 'particle-vortex',
  component: ParticleVortex,
  render: (key) => (
    <Composition
      key={key}
      id="particle-vortex"
      component={ParticleVortex}
      schema={particleVortexSchema}
      defaultProps={particleVortexDefaults}
      width={particleVortexMeta.width}
      height={particleVortexMeta.height}
      fps={particleVortexMeta.fps}
      durationInFrames={particleVortexMeta.durationInFrames}
    />
  ),
};
