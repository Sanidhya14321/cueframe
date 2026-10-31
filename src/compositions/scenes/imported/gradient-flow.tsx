import { Composition } from 'remotion';
import {
  type GradientFlowProps,
  gradientFlowDefaults,
  gradientFlowMeta,
  gradientFlowSchema,
} from '@/schemas/clips/imported/gradient-flow';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const GradientFlow = (props: GradientFlowProps) => <WebMotion variant={0} {...props} />;
export const gradientFlowScene: SceneModule = {
  id: 'gradient-flow',
  component: GradientFlow,
  render: (key) => (
    <Composition
      key={key}
      id="gradient-flow"
      component={GradientFlow}
      schema={gradientFlowSchema}
      defaultProps={gradientFlowDefaults}
      width={gradientFlowMeta.width}
      height={gradientFlowMeta.height}
      fps={gradientFlowMeta.fps}
      durationInFrames={gradientFlowMeta.durationInFrames}
    />
  ),
};
