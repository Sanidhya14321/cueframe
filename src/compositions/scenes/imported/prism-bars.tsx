import { Composition } from 'remotion';
import {
  type PrismBarsProps,
  prismBarsDefaults,
  prismBarsMeta,
  prismBarsSchema,
} from '@/schemas/clips/imported/prism-bars';
import type { SceneModule } from '../../scene-module';
import { WebMotion } from './web-motion';
export const PrismBars = (props: PrismBarsProps) => <WebMotion variant={24} {...props} />;
export const prismBarsScene: SceneModule = {
  id: 'prism-bars',
  component: PrismBars,
  render: (key) => (
    <Composition
      key={key}
      id="prism-bars"
      component={PrismBars}
      schema={prismBarsSchema}
      defaultProps={prismBarsDefaults}
      width={prismBarsMeta.width}
      height={prismBarsMeta.height}
      fps={prismBarsMeta.fps}
      durationInFrames={prismBarsMeta.durationInFrames}
    />
  ),
};
